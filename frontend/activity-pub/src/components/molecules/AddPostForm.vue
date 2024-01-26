<script setup lang="ts">
	import { ref } from "vue";
	import { useAuthStore } from "@/stores/AuthStore"; // Adjust the import path as necessary
	import router from "@/router";

	const store = useAuthStore();
	const postContent = ref("");
	const errorMessage = ref("");

	const submitPost = async () => {
		if (!postContent.value.trim()) {
			errorMessage.value = "Post content cannot be empty.";
			return;
		}

		try {
			// Construct the object for the "Create" activity
			const activityObject = {
				content: postContent.value,
				// Add other properties to the object as needed
			};

			// Use the "Create" activity type
			const result = await store.postToOutbox(
				"Create",
				activityObject
			);

			if (result) {
				postContent.value = ""; // Clear the textarea after successful submission
				errorMessage.value = ""; // Clear any previous error message
				await router.push("/");
			} else {
				errorMessage.value =
					"Failed to add the post. Please try again.";
			}
		} catch (error) {
			console.error(error);
			errorMessage.value =
				"An error occurred while trying to add the post.";
		}
	};
</script>
<template>
	<div class="add-post-container">
		<form @submit.prevent="submitPost">
			<label for="postContent">Your Post</label>
			<textarea
				id="postContent"
				v-model="postContent"
				rows="4"></textarea>

			<button type="submit">Add Post</button>
		</form>

		<p
			v-if="errorMessage"
			class="error">
			{{ errorMessage }}
		</p>
	</div>
</template>
<style scoped>
	.add-post-container {
		max-width: 28rem;
		margin-right: auto;
		margin-left: auto;
		background: rgba(255, 255, 255, 0.58);

		box-shadow: 4px 4px 17px -4px rgba(0, 0, 0, 0.1);
		padding: 3rem 4rem;
	}

	textarea {
		width: 100%;
		padding: 8px;
		margin-bottom: 10px;
		border-radius: 4px;
		border: 1px solid rgba(18, 0, 220, 0.6);

		background: #e3e3e3;

		box-shadow: 2px 2px 16px 0 rgba(18, 0, 220, 0.1);
	}

	button {
		background-color: #007bff;
		color: white;
		padding: 10px 15px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}

	.error {
		color: #ff0000;
	}

	.success {
		color: #008000;
	}
</style>
