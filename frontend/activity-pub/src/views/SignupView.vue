<script setup lang="ts">
	import AppHeader from "@/components/organisms/AppHeader.vue";
	import SignupForm from "@/components/molecules/SignupForm.vue";
</script>

<template>
	<body>
		<AppHeader />
		<h1>Signup</h1>
		<SignupForm></SignupForm>
	</body>
</template>

<style scoped lang="scss">
	body {
		height: 100vh;
		background: center / cover url("../assets/Background.png")
			fixed no-repeat;
	}

	h1 {
		text-align: center;
		margin-top: 2rem;
		margin-bottom: 3rem;
	}
</style>
