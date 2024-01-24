<script setup lang="ts">

</script>

<template>
  <button>
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
button {
  color: #EAEAEA;
  background: #1200DC;
  box-shadow: 4px 4px 11px 0px rgba(18, 0, 220, 0.17);
  font-size: 1.3rem;
  font-weight: 500;
  transition-duration: 0.15s;
  width: 100%;
  border: none;
  border-radius: 1px;

  padding: 0.5rem 0;

  &:hover {
    cursor: pointer;
    background: rgb(7, 50, 148);
    transition-duration: 0.15s;
  }
}
</style>
