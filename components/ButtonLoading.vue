<template>
  <button class="px-4 h-12 flex justify-center items-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-header disabled:text-white/20 font-medium rounded-xl w-full duration-200">
    <ion-spinner v-if="isLoading" class="w-4 h-4 text-amber-500" />
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  }
});
</script>

<style scoped>

</style>
