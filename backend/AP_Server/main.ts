import {
	Hono,
	collection,
	createUserWithEmailAndPassword,
	doc,
	getAuth,
	getDocs,
	getFirestore,
	initializeApp,
	query,
	setDoc,
	where,
	load,
	getDoc,
} from "./deps.ts";
import { Activity } from "./interfaces/activity.ts";
import { User } from "./interfaces/user.ts";
import admin from "npm:firebase-admin";
admin.initializeApp({
	credential: admin.credential.cert("./AdminKey.json"),
});
const config = Deno.env.get("FIREBASE_CONFIG") as string;
initializeApp(JSON.parse(config));
const db = getFirestore();
const auth = getAuth();
const app = new Hono();

app.post("signup", async (c) => {
	try {
		const { username, email, password } = await c.req.body();

		// Check if the username already exists
		const usersRef = collection(db, "users");
		const usernameQuery = query(
			usersRef,
			where("preferredUsername", "==", username)
		);
		const querySnapshot = await getDocs(usernameQuery);

		if (!querySnapshot.empty) {
			c.res.status(409).send("Username already taken");
		}

		// Continue with creating the new user...
		const newUser = new User(username, email, password);
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		const userId = userCredential.user.uid;
		const userDocument = {
			id: newUser.id,
			type: newUser.type,
			preferredUsername: username,
			inbox: [],
			outbox: [],
			followers: [],
			following: [],
			liked: [],
		};

		await setDoc(doc(db, "users", userId), userDocument);
		c.res.status(201).send("User created successfully");
	} catch (error) {
		console.error(error);
		c.res.status(500).send("Error creating user");
	}
});

app.post("/signin", async (c) => {
	try {
		const { email, password } = await c.req.body();

		// Send a POST request to Firebase Authentication REST API
		const firebaseApiKey = env["FIREBASE_API_KEY"]; // Ensure the API key is set in the environment
		const response = await fetch(
			`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					password,
					returnSecureToken: true, // Request an ID token
				}),
			}
		);

		const data = await response.json();

		// Check for errors in the response
		if (response.status !== 200) {
			console.error("Error:", data.error);
			return c.json(
				{ error: data.error.message },
				response.status
			);
		}

		// If successful, data.idToken contains the ID token
		const idToken = data.idToken;
		return c.json({ idToken }, 200);
	} catch (error) {
		console.error(error);
		return c.json({ error: "Internal Server Error" }, 500);
	}
});

app.get("/users/:username", async (c) => {
	const username = c.req.param("username");
	const baseUrl = env["BASE_URL"]; // Make sure BASE_URL is set in your environment

	try {
		// Create a query against the collection
		const usersRef = collection(db, "users");
		const q = query(
			usersRef,
			where("preferredUsername", "==", username)
		);
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			return c.text("User not found", 404);
		}

		// Assuming username is unique and taking the first match
		const userDoc = querySnapshot.docs[0];
		const userData = userDoc.data();

		// Construct the ActivityStreams profile object with URLs
		const userProfile = {
			"@context": "https://www.w3.org/ns/activitystreams",
			id: `${baseUrl}/user/${username}`,
			type: "Person",
			preferredUsername: userData.preferredUsername,
			inbox: `${baseUrl}/user/${username}/inbox`,
			outbox: `${baseUrl}/user/${username}/outbox`,
			followers: `${baseUrl}/user/${username}/followers`,
			following: `${baseUrl}/user/${username}/following`,
			liked: `${baseUrl}/user/${username}/liked`,
			// Additional profile details can be added here
		};

		return c.json(userProfile, 200);
	} catch (error) {
		console.error(error);
		return c.text("Internal Server Error", 500);
	}
});

app.get("/users/:username/outbox", async (c) => {
	const username = c.req.param("username");

	try {
		// Query Firestore for the user's outbox
		const usersRef = collection(db, "users");
		const q = query(
			usersRef,
			where("preferredUsername", "==", username)
		);
		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			return c.text("User not found", 404);
		}

		// Assuming username is unique and taking the first match
		const userDoc = querySnapshot.docs[0];
		const userData = userDoc.data();

		// Format the outbox response according to ActivityStreams standard
		const baseUrl = env["BASE_URL"]; // Ensure BASE_URL is set in your environment
		const outbox = {
			"@context": "https://www.w3.org/ns/activitystreams",
			id: `${baseUrl}/user/${username}/outbox`,
			type: "OrderedCollection",
			totalItems: userData.outbox.length,
			orderedItems: userData.outbox, // This should be an array of activities
		};

		return c.json(outbox, 200);
	} catch (error) {
		console.error(error);
		return c.text("Internal Server Error", 500);
	}
});

app.post("/users/:username/outbox", async (c) => {
	try {
		const username = c.req.param("username");
		const activity: Activity = await c.req.body();
		const idToken = c.req.headers.get("authorization"); // Get the authorization header

		// Verify the ID token using firebase-admin
		const decodedToken = await admin
			.auth()
			.verifyIdToken(idToken);
		if (!decodedToken || decodedToken.uid === undefined) {
			return c.text("Invalid token", 403);
		}

		// Fetch the user's data from Firestore
		const userRef = doc(db, `users/${decodedToken.uid}`);
		const userSnap = await getDoc(userRef);

		if (!userSnap.exists) {
			return c.text("User not found", 404);
		}

		const userData = userSnap.data();
		if (userData.preferredUsername !== username) {
			return c.text("You can only post to your own outbox", 403);
		}

		const baseUrl = Deno.env.get("BASE_URL") as string; // Get the base URL from environment
		const uniqueId = crypto.randomUUID(); // Unique ID for the activity
		const publishedTimestamp = new Date().toISOString();
		const attributedToUrl = `${baseUrl}/user/${username}`;

		if (activity.type === "Create") {
			const postDocument = {
				id: `${baseUrl}/p/${uniqueId}`, // Construct the activity URL using BASE_URL
				type: activity.object.type,
				content: activity.object.content, // Assuming 'content' is part of the 'object' within the activity
				published: publishedTimestamp,
				attributedTo: attributedToUrl,
			};
			await setDoc(doc(db, "posts", uniqueId), postDocument);

			const completeActivity = {
				...activity,
				id: postDocument.id, // Link the activity with its ID
				object: postDocument, // Replace the activity's object with the complete note document
			};
			userData.outbox.push(completeActivity);
			await setDoc(userRef, userData);
		} else if (activity.type === "Like") {
			// Handle 'Like' activity
			const likeActivity = {
				"@context": "https://www.w3.org/ns/activitystreams",
				id: `${baseUrl}/activities/${uniqueId}`,
				type: "Like",
				actor: `${baseUrl}/user/${username}`,
				object: activity.object, // URL of the object being liked
				published: publishedTimestamp,
			};
			userData.outbox.push(likeActivity);

			const actorInboxUrl = likeActivity.to[0] + "/inbox";

			try {
				const inboxResponse = await fetch(actorInboxUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + decodedToken, // Insert appropriate token
					},
					body: JSON.stringify(likeActivity),
				});

				if (!inboxResponse.ok) {
					// Handle response error
					console.error(
						`Error posting to inbox: ${inboxResponse.statusText}`
					);
				}
			} catch (error) {
				console.error(`Error making request to inbox: ${error}`);
			}
		} else {
			// Optionally handle other activity types
		}

		if (!userData.liked) {
			userData.liked = []; // Initialize if not already set
		}
		userData.liked.push(activity.object);

		await setDoc(userRef, userData);

		return c.text("Activity added to outbox", 201);
	} catch (error) {
		console.error(error);
		return c.text("Internal Server Error", 500);
	}
});

app.get("/p/:id", async (c) => {
	const postId = c.req.param("id");

	try {
		// Fetch the post document from the 'posts' collection using the postId
		const postRef = doc(db, "posts", postId);
		const postSnap = await getDoc(postRef);

		if (!postSnap.exists()) {
			return c.text("Post not found", 404);
		}

		const post = postSnap.data();

		// Construct and return the ActivityStreams object
		const activityObject = {
			"@context": "https://www.w3.org/ns/activitystreams",
			id: post.id,
			type: post.type,
			attributedTo: post.attributedTo,
			published: post.published,
			content: post.content,
			// Include any other fields that are part of your post structure
		};

		return c.json(activityObject, 200);
	} catch (error) {
		console.error(error);
		return c.text("Internal Server Error", 500);
	}
});

app.post("/users/:username/inbox", async (c) => {
	const username = c.req.param("username");
	const activity: Activity = await c.req.body();
	const token = c.req.headers.get("authorization"); // Get the token from the request headers

	// Verify the token using Firebase Admin SDK
	if (!token) {
		return c.text("No authentication token provided", 401);
	}

	const decodedToken = await admin.auth().verifyIdToken(token);
	if (!decodedToken) {
		return c.text("Invalid authentication token", 403);
	}

	// Generate a unique ID for the activity
	const activityId = crypto.randomUUID();
	const baseUrl = Deno.env.get("BASE_URL") as string; // Ensure BASE_URL is set in your environment
	activity.id = `${baseUrl}/activities/${activityId}`; // Assign the ID to the activity

	// Fetch the user's data from Firestore
	const usersRef = collection(db, "users");
	const q = query(
		usersRef,
		where("preferredUsername", "==", username)
	);
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		return c.text("User not found", 404);
	}

	// Assuming username is unique and taking the first match
	const userDoc = querySnapshot.docs[0];
	const userData = userDoc.data();
	let completeActivity = activity;

	if (activity.object && activity.type !== "Like") {
		const postId = crypto.randomUUID();
		activity.id = `${baseUrl}/activities/${activityId}`;

		await setDoc(doc(db, "posts", postId), activity);
		completeActivity = {
			...activity,
			object: activity.object,
		};
	}

	userData.inbox.push(completeActivity);
	await setDoc(userDoc.ref, userData);

	return c.text("Activity added to inbox", 201);
});

app.get("/.well-known/webfinger", async (c) => {
	const resource = c.req.query("resource");

	if (!resource) {
		return c.text("Resource query parameter is required", 400);
	}

	// Extract the username from the resource query parameter
	// The resource is typically in the format "acct:username@domain"
	const matches = resource.match(/^acct:(.+)@(.+)$/);
	if (!matches) {
		return c.text("Invalid resource format", 400);
	}

	const username = matches[1];
	const domain = matches[2];
	const baseUrl = Deno.env.get("BASE_URL") as string; // Your service's base URL

	// Validate if the domain matches your service's domain
	if (domain !== new URL(baseUrl).hostname) {
		return c.text("Unknown domain", 404);
	}

	// Lookup the user in your database (here using Firestore)
	const usersRef = collection(db, "users");
	const q = query(
		usersRef,
		where("preferredUsername", "==", username)
	);
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		return c.text("User not found", 404);
	}

	// Construct the WebFinger response
	const userDoc = querySnapshot.docs[0];
	const userData = userDoc.data();
	const webFingerResponse = {
		subject: resource,
		links: [
			{
				rel: "self",
				type: "application/activity+json",
				href: `${baseUrl}/user/${username}`,
			},
			// Add other relevant links and properties as needed
		],
	};

	return c.json(webFingerResponse, 200);
});

Deno.serve(app.fetch);
