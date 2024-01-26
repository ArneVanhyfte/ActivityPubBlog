<script setup lang="ts">
	import AppHeader from "@/components/organisms/AppHeader.vue";
	import BlogPost from "@/components/molecules/BlogPost.vue";
	import { useAuthStore } from "@/stores/AuthStore";
	import { onMounted } from "vue";

	const store = useAuthStore();
	onMounted(() => {
		store.getAllUsernames();
	});
</script>
<template>
	<body>
		<AppHeader />
		<main>
			<section class="posts">
				<h2>Arne's posts</h2>
				<ul>
					<li>
						<BlogPost
							content="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Ad architecto distinctio eos molestiae odit perferendis quam, quos reiciendis?
              Enim error est fuga fugiat, libero quaerat quos sunt vitae? Cum, veritatis."
							date="12-01-2024"
							user="Arne vanhyfte"
							>First post</BlogPost
						>
					</li>
				</ul>
			</section>
			<section class="users">
				<h2>Users</h2>
				<ul v-if="store.users">
					<li v-for="user in store.users">
						<h3>{{ user }}</h3>
					</li>
					<li>
						<h3>Arne Vanhyfte</h3>
					</li>
					<li>
						<h3>Jarne De Smet</h3>
					</li>
					<li>
						<h3>Luna Temmerman</h3>
					</li>
				</ul>
			</section>
		</main>
	</body>
</template>

<style scoped lang="scss">
	body {
		height: 100vh;
		background: center / cover url("../assets/Background.png")
			fixed no-repeat;
	}
	main {
		margin-top: 3rem;
		margin-left: 4rem;
		margin-right: 4rem;
		display: flex;
		gap: 2rem;

		.posts {
			width: 65%;
			height: 2rem;

			ul {
				list-style: none;
				padding: 0;
				margin-top: 1.5rem;
			}
		}

		.users {
			width: 35%;
			height: 2rem;

			ul {
				margin-top: 2rem;
				list-style: none;
				padding: 0;
				display: flex;
				flex-direction: column;
				gap: 2rem;

				li {
					text-align: center;
					padding-top: 1rem;
					padding-bottom: 1rem;
					border-radius: 5px;
					background: #fff;
					box-shadow: 4px 4px 17px -4px rgba(0, 0, 0, 0.1);

					&:hover {
						background: #efefef;
						cursor: pointer;
					}
				}
			}

			h2 {
				padding-bottom: 0.5rem;
				border-bottom: rgba(241, 0, 126, 0.19) solid 2px;
			}
		}

		h2 {
			text-align: center;
		}
	}
</style>
