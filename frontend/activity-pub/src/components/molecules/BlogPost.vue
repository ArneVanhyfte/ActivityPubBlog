<script setup lang="ts">
	defineProps({
		content: {
			type: String,
			required: true,
		},
		user: {
			type: String,
			required: true,
		},
		date: {
			type: String,
			required: true,
		},
	});
</script>

<template>
	<div class="card">
		<div class="content">
			<div class="container">
				<p class="text">{{ content }}</p>
			</div>
		</div>

		<img
			class="like"
			src="../../assets/heart.png"
			alt="heart icon with circle" />
	</div>
</template>

<style scoped lang="scss">
	.card {
		display: flex;
		gap: 1rem;
		border-radius: 5px;
		background: #fff;

		box-shadow: 4px 4px 17px -4px rgba(0, 0, 0, 0.1);
		padding: 1rem;
		position: relative;
		.like {
			position: absolute;
			right: 0.5rem;
			bottom: 0.3rem;
		}
	}

	.content {
		.container {
			margin-bottom: 2rem;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: calc(100% - 2.6rem);
		}

		.text {
			text-align: center;
		}

		.date {
			text-align: end;
		}
	}
</style>
