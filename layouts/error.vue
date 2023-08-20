<template>
  <div class="px-4 md:px-6 py-12 flex flex-col justify-center items-center gap-3 text-neutral-200 max-w-2xl">
    <h1 class="text-3xl">404</h1>
  </div>
</template>

<script>
export default {
  props: ['error'],
  // layout: 'error' // you can set a custom layout for the error page
}
</script>

<style scoped>
h1, h2 {
  @apply font-bold;
}
</style>
