<script setup lang="ts">
	import FormField from "@/components/atoms/FormField.vue";
	import AppButton from "@/components/atoms/AppButton.vue";
	import { useAuthStore } from "@/stores/AuthStore";
	import { computed, ref } from "vue";
	import router from "@/router";
	const email = ref("");
	const password = ref("");
	const confirmPassword = ref("");
	const username = ref("");
	const submitted = ref(false);
	const emailError = computed(() => {
		if (email.value === "" && submitted.value) {
			return "Email is required";
		} else {
			return "";
		}
	});
	const passwordError = computed(() => {
		if (password.value === "" && submitted.value) {
			return "Password is required";
		} else {
			return "";
		}
	});
	const confirmPwError = computed(() => {
		if (
			password.value !== confirmPassword.value &&
			submitted.value
		) {
			return "Passwords do not match";
		} else {
			return "";
		}
	});
	const usernameError = computed(() => {
		if (username.value === "" && submitted.value) {
			return "Username is required";
		} else {
			return "";
		}
	});
	const error = ref("");
	const store = useAuthStore();
	const signUp = async () => {
		try {
			error.value = (await store.signUp(
				email.value,
				password.value,
				username.value
			)) as string;
		} catch (err: any) {
			error.value = err.message;
		}
	};
	const register = () => {
		submitted.value = true;
		if (
			emailError.value ||
			passwordError.value ||
			confirmPwError.value ||
			usernameError.value
		) {
			console.error("error");
			return;
		} else {
			signUp();
		}
	};
</script>

<template>
	<form>
		<div>
			<FormField
				name="Username"
				type="text"
				v-model="username"
				:error="usernameError" />
			<FormField
				name="Email"
				type="email"
				v-model="email"
				:error="emailError" />
			<FormField
				name="Password"
				type="password"
				v-model="password"
				:error="passwordError" />
			<FormField
				name="Confirm password"
				type="password"
				v-model="confirmPassword"
				:error="confirmPwError" />
		</div>
		<AppButton @click.prevent="register()">Signup</AppButton>
		<div id="signupInfo">
			<p>Already have an account?</p>
			<a
				href="/login"
				@click.prevent="$router.push('/login')">
				Log in</a
			>
		</div>
	</form>
</template>

<style scoped lang="scss">
	form {
		max-width: 28rem;
		margin-right: auto;
		margin-left: auto;
		background: rgba(255, 255, 255, 0.58);

		box-shadow: 4px 4px 17px -4px rgba(0, 0, 0, 0.1);
		padding: 3rem 4rem;

		div {
			display: flex;
			flex-direction: column;
			gap: 2rem;
			margin-bottom: 5rem;
		}
		#signupInfo {
			margin-top: 1rem;
			margin-bottom: 0;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			gap: 0.5rem;
			a {
				color: #1200dc;
				font-weight: 500;
				text-decoration: none;
			}
		}
	}
</style>
