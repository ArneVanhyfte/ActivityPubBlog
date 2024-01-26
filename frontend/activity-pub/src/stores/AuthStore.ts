import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { User } from "..//interfaces/user.ts";
import instance from "../instances/myAxios.js";
import { useFirestore } from "vuefire";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import {
	getDocs,
	query,
	where,
	collection,
	setDoc,
	doc,
	getDoc,
} from "firebase/firestore";
import { firebaseAuth } from "../firebase.ts";
import router from "../router/index.ts";
import { writeBatch } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

export const useAuthStore = defineStore("auth", () => {
	interface Activity {
		"@context": string;
		type: string;
		id: string;
		actor: string;
		object: { type: string };
		to?: string[];
	}
	const authenticated = ref(false);
	const token = ref("");
	const db = useFirestore();
	const users = ref([]);
	const userNotes = ref([]);

	const signUp = async (
		email: string,
		password: string,
		username: string
	) => {
		try {
			// Check if the username already exists
			const usersRef = collection(db, "users");
			const usernameQuery = query(
				usersRef,
				where("preferredUsername", "==", username)
			);
			const querySnapshot = await getDocs(usernameQuery);

			if (!querySnapshot.empty) {
				console.error("Username already exists");
				return "Username already exists";
			}

			// Continue with creating the new user...
			const newUser = new User(username, email, password);
			const userCredential =
				await createUserWithEmailAndPassword(
					firebaseAuth,
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
			logOut();
			return;
		} catch (error) {
			console.error(error);
			return "Error signing up";
		}
	};

	const signIn = async (email: string, password: string) => {
		try {
			const firebaseApiKey = import.meta.env
				.VITE_FIREBASE_API_KEY;
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

			await signInWithEmailAndPassword(
				firebaseAuth,
				email,
				password
			);

			const data = await response.json();

			// Check for errors in the response
			if (response.status !== 200) {
				console.error("Error:", data.error);
				return data.error.message;
			}

			// If successful, data.idToken contains the ID token
			token.value = data.idToken;
			authenticated.value = true;
			await router.push("/");
			return;
		} catch (error) {
			console.error(error);
			return error.message;
		}
	};

	async function logOut() {
		signOut(firebaseAuth)
			.then(async () => {
				authenticated.value = false;
				token.value = "";
				router.push("/login");
			})
			.catch((error: any) => {
				console.error("Error during logout:", error);
			});
	}

	function getCurrentUser() {
		return new Promise((resolve, reject) => {
			const unsubscribe = firebaseAuth.onAuthStateChanged(
				(user: any) => {
					authenticated.value = !!user;

					unsubscribe();
					resolve(user);
				},
				reject
			);
		});
	}

	watch(authenticated, (value: boolean) => {
		if (value) {
			firebaseAuth.currentUser
				.getIdToken(true)
				.then((idToken: any) => {
					token.value = idToken;
				});
		}
	});

	const getAllUsernames = async () => {
		const usersRef = collection(db, "users");
		const querySnapshot = await getDocs(usersRef);
		const names = querySnapshot.docs.map(
			(doc: any) => doc.data().preferredUsername
		);
		users.value = names;
	};

	const fetchUserNotes = async (username: string) => {
		try {
			const response = await instance.get(
				`/users/${username}/outbox`
			);
			const activities: any[] = response.data.orderedItems;

			// Filter out 'Create' activities where the object type is 'Note'
			const notes = activities
				.filter(
					(activity: Activity) =>
						activity.type === "Create" &&
						activity.object.type === "Note"
				)
				.map((activity: any) => activity.object); // Extract the note object from each 'Create' activity

			userNotes.value = notes;
		} catch (error) {
			console.error("Error fetching user notes:", error);
			userNotes.value = [];
		}
	};

	const postToOutbox = async (
		activityType: string,
		object: any
	) => {
		const backendUrl = import.meta.env.VITE_BACKEND_URL;
		const uid = firebaseAuth.currentUser?.uid; // Use optional chaining to avoid errors if currentUser is null

		if (!uid) {
			console.error("No user logged in");
			return null;
		}

		const userRef = doc(db, "users", uid);
		try {
			const userSnap = await getDoc(userRef);
			if (!userSnap.exists()) {
				console.error("User document does not exist");
				return null;
			}
			const username = userSnap.data().preferredUsername;

			let activity = {};

			if (activityType === "Create") {
				activity = {
					"@context": "https://www.w3.org/ns/activitystreams",
					type: "Create",
					actor: `${backendUrl}/user/${username}`,
					object: {
						...object,
						type: "Note",
						attributedTo: `${backendUrl}/user/${username}`,
					},
				};
			} else if (activityType === "Like") {
				activity = {
					"@context": "https://www.w3.org/ns/activitystreams",
					type: "Like",
					actor: `${backendUrl}/user/${username}`,
					object: object.id,
				};
			}

			// Assuming 'instance' and 'token.value' are correctly initialized and available in your context
			const response = await instance.post(
				`/users/${username}/outbox`,
				activity,
				{
					headers: {
						Authorization: `Bearer ${token.value}`,
					},
				}
			);

			if (response.status === 201) {
				console.log("Activity successfully added to outbox");
				return response.data;
			} else {
				console.error(
					"Unexpected response status:",
					response.status
				);
				return null;
			}
		} catch (error) {
			console.error(
				"Error posting to outbox or fetching user data:",
				error
			);
			return null;
		}
	};

	return {
		authenticated,
		signUp,
		signIn,
		getCurrentUser,
		logOut,
		token,
		getAllUsernames,
		users,
		fetchUserNotes,
		userNotes,
		postToOutbox,
	};
});
