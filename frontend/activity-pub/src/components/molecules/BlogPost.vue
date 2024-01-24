<script setup lang="ts">

defineProps({
  content: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="card">
    <img src="../../assets/placeholder.png" alt="side of building">
    <div class="content">
      <h3>
        <slot></slot>
      </h3>
      <div class="container">
        <p class="text">{{ content }}</p>
        <p class="date">{{ user }} | {{ date }}</p>
      </div>

    </div>

    <img class="like" src="../../assets/heart.png" alt="heart icon with circle">

  </div>
</template>

<style scoped lang="scss">

.card {
  display: flex;
  gap: 1rem;
  border-radius: 5px;
  background: #FFF;

  box-shadow: 4px 4px 17px -4px rgba(0, 0, 0, 0.10);
  padding: 1rem;
  position: relative;
  .like{
    position: absolute;
    right: 0.5rem;
    top: 0.3rem;
  }
}

.content {
  .container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100% - 2.6rem);
  }

  h3 {
    text-align: center;
    border-bottom: solid 2px rgba(241, 0, 126, 0.19);
    font-weight: 500;
    font-size: 1.5rem;
    padding-bottom: 0.25rem;
    margin-bottom: 1rem;

  }

  .text {
    text-align: center;

  }

  .date {
    text-align: end;
  }
}
</style>