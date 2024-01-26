<script setup lang="ts">
	import { useAuthStore } from "@/stores/AuthStore";
	const store = useAuthStore();
</script>

<template>
	<header>
		<div class="logo">
			<img
				src="../../assets/ActivityPub-logo.png"
				alt="activity pub logo" />
			<h1>AP-Blog</h1>
		</div>
		<nav>
			<ul
				v-if="
					$router.currentRoute.value.path === '/' ||
					$router.currentRoute.value.path === '/add'
				">
				<li><a href="/home">Home</a></li>
				<li><a href="/add">Add post</a></li>
				<li><a @click.prevent="store.logOut">Logout</a></li>
			</ul>
		</nav>
	</header>
</template>

<style scoped lang="scss">
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		padding-left: 4rem;
		padding-right: 4rem;
		color: #222;
	}
	.logo {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.2rem;

		h1 {
			font-size: 1.3rem;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
		}

		img {
			width: 3.5rem;
		}
	}
	ul {
		list-style: none;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		font-weight: 500;
		font-size: 1.3rem;
		a {
			color: #222;
			text-decoration: none;
		}
		a:hover {
			cursor: pointer;
		}
	}
</style>
