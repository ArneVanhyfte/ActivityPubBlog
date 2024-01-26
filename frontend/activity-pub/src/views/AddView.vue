<script setup lang="ts">
	import AppHeader from "@/components/organisms/AppHeader.vue";
	import AddPostForm from "@/components/molecules/AddPostForm.vue";
</script>

<template>
	<body>
		<AppHeader />
		<h1>Add Post</h1>
		<AddPostForm></AddPostForm>
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
