// user.js
export class User {
	id: string;
	type: string;
	preferredUsername: string;
	inbox: string;
	outbox: string;
	followers: string;
	following: string;
	liked: string;
	email: string;
	password: string;
	constructor(
		username: string,
		email: string,
		password: string
	) {
		const baseUrl =
			Deno.env.get("BASE_URL") + "/users/" + username;
		this.id = `${baseUrl}`; // Unique identifier
		this.type = "Person";
		this.preferredUsername = username;
		this.inbox = `${baseUrl}/inbox`; // Where to receive activities
		this.outbox = `${baseUrl}/outbox`; // Where to send activities
		this.followers = `${baseUrl}/followers`; // List of followers
		this.following = `${baseUrl}/following`; // List of following
		this.liked = `${baseUrl}/liked`; // Liked activities
		// Additional fields can be added as needed
		// Email and password are not part of ActivityPub but are needed for Firebase
		this.email = email;
		this.password = password;
	}
}
