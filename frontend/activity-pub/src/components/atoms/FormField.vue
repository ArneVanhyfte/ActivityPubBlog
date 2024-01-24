<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: true
  },
    error: {
    type: String,
    default: '',
    required: false
  },
  type: {
    type: String,
    required: true
  },

})
</script>

<template>
  <label :for="name">
    {{ name }}

    <input
     :type="type"
      :id="name"
    />
    <span role="alert" v-if="error" class="field-error">{{ error }}</span>
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
  border: 1px solid rgba(18, 0, 220, 0.60);

  background: #E3E3E3;

  box-shadow: 2px 2px 16px 0 rgba(18, 0, 220, 0.10);

  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.5rem;

}


</style>
