<template>
  <div class="flex flex-row items-center justify-center space-x-1">
    <button
        class="pag-button h-full"
        :disabled="currentPage === 1"
        @click="setPage(currentPage - 1)"
    >
      <ChevronLeftIcon class="w-4 h-4" />
    </button>
    <button
        class="pag-button"
        :class="{ 'active': currentPage === 1 }"
        @click="setPage(1)"
    >
      1
    </button>
    <template v-if="currentPage > 3">
      <span class="text-details">...</span>
    </template>
    <template v-for="page in [currentPage - 1, currentPage, currentPage + 1]" :key="page">
      <button
          v-if="page > 1 && page < pageCount"
          class="pag-button"
          :class="{ 'active': currentPage === page }"
          @click="setPage(page)"
      >
        {{ page }}
      </button>
    </template>
    <template v-if="currentPage < pageCount - 2">
      <span class="text-details">...</span>
    </template>
    <button
        v-if="pageCount > 1"
        class="pag-button"
        :class="{ 'active': currentPage === pageCount }"
        @click="setPage(pageCount)"
    >
      {{ pageCount }}
    </button>
    <button
        class="pag-button h-full"
        :disabled="currentPage === pageCount"
        @click="setPage(currentPage + 1)"
    >
      <ChevronRightIcon class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/vue/24/solid";

const props = defineProps({
  totalItems: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 5,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
});

const emits = defineEmits(['update:currentPage']);

function setPage(page: number) {
  emits("update:currentPage", page);
}

const pageCount = computed(() => {
  return Math.ceil(props.totalItems / props.pageSize);
});
</script>

<style scoped>
.pag-button {
  @apply px-3 py-2 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 text-sm text-zinc-400 hover:text-white disabled:text-zinc-600 disabled:bg-zinc-800/20 disabled:border-zinc-700/20 rounded-lg transition-all duration-200;
}

.pag-button.active {
  @apply text-white bg-zinc-700/50 border-zinc-600/50;
}
</style>
