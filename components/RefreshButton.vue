<template>
  <button @click="action()" :disabled="refreshing" class="refresh-button" :class="{ 'refreshing': refreshing }">
    <ArrowPathIcon class="refresh-icon" :class="{ 'animate-spin': refreshing }" />
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
.refresh-button {
  @apply px-3 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 flex items-center justify-center;
  height: 36px;
}

.refresh-button:focus {
  @apply outline-none ring-2 ring-orange-500/50;
}

.refresh-button.refreshing {
  @apply bg-orange-500/10 border-orange-500/20 text-orange-400;
}

.refresh-icon {
  @apply w-5 h-5;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .refresh-button {
    @apply px-2.5;
    height: 32px;
  }
  
  .refresh-icon {
    @apply w-4 h-4;
  }
}
</style>
