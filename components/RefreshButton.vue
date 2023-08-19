<template>
  <button @click="action()" :disabled="refreshing" class="px-1 sm:px-2 sm:ml-auto text-white/60 hover:text-white disabled:text-white/40 duration-200 cursor-pointer" :class="{ 'loading': !refreshing }">
    <ArrowPathIcon class="w-7 h-7" :class="{ 'animate-spin': refreshing }" />
  </button>
</template>

<script setup>
import {ArrowPathIcon} from "@heroicons/vue/24/solid";

const props = defineProps({
  action: {
    type: Function,
    required: true,
  },
  refreshing: {
    type: Boolean,
    required: true,
  }
});
</script>

<style scoped>

</style>
