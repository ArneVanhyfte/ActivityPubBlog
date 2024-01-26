<script setup lang="ts">
	defineProps({
		name: {
			type: String,
			required: true,
		},
		error: {
			type: String,
			default: "",
			required: false,
		},
		type: {
			type: String,
			required: true,
		},
	});
	const model = defineModel();
</script>

<template>
	<label :for="name">
		{{ name }}

		<input
			:type="type"
			:id="name"
			v-model="model" />
		<span
			role="alert"
			v-if="error"
			class="field-error"
			>{{ error }}</span
		>
	</label>
</template>

<style scoped lang="scss">
	label {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: 0.1em;
		font-weight: 500;
		width: 100%;
	}

	input {
		border-radius: 4px;
		border: 1px solid rgba(18, 0, 220, 0.6);

		background: #e3e3e3;

		box-shadow: 2px 2px 16px 0 rgba(18, 0, 220, 0.1);

		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		padding-left: 0.5rem;
	}
	.field-error {
		color: #f1007e;
		font-size: 0.8rem;
		margin-top: 0.2rem;
	}
</style>
