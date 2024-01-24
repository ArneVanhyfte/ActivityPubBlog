<script setup lang="ts">

import FormField from "@/components/atoms/FormField.vue";
import LoginButton from "@/components/atoms/LoginButton.vue";
</script>

<template>
<form>
<div>
  <FormField name="Email" model-value="" type="email"/>
  <FormField name="Password" model-value="" type="password"/>
</div>
<LoginButton>Login</LoginButton>
</form>
</template>

<style scoped lang="scss">
form{
  max-width: 28rem;
  margin-right: auto;
  margin-left: auto;
  background: rgba(255, 255, 255, 0.58);

  box-shadow: 4px 4px 17px -4px rgba(0, 0, 0, 0.10);
  padding: 3rem 4rem;

  div{
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 5rem;
  }

}
</style>