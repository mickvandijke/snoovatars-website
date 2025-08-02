<template>
  <div class="searchbar">
    <MagnifyingGlassIcon class="searchbar--icon" />
    <input 
      :value="searchTerm" 
      @input="$emit('update:searchTerm', $event.target.value)" 
      :placeholder="placeholder" 
      class="searchbar--input"
    >
    <button 
      v-if="searchTerm"
      @click="$emit('update:searchTerm', '')"
      class="searchbar--clear"
    >
      <XMarkIcon class="searchbar--clear--icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import {MagnifyingGlassIcon, XMarkIcon} from "@heroicons/vue/20/solid";

const props = defineProps({
  searchTerm: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: false,
    default: "Search"
  }
});
</script>

<style scoped>
.searchbar {
  @apply px-2.5 py-2 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:border-orange-500/50 rounded-lg transition-all duration-200 flex items-center gap-2 cursor-text w-full;
  max-width: 400px;
  height: 36px;
}

.searchbar--icon {
  @apply text-zinc-400 w-4 h-4 flex-shrink-0;
}

.searchbar--input {
  @apply flex-1 bg-transparent text-sm text-zinc-400 placeholder-zinc-500 border-none focus:outline-none cursor-text min-w-0;
  padding: 0;
  margin: 0;
  height: 20px;
  line-height: 20px;
}

.searchbar--clear {
  @apply p-1 bg-zinc-700/30 hover:bg-zinc-600/50 rounded transition-all duration-200 flex-shrink-0 flex items-center justify-center;
  width: 20px;
  height: 20px;
}

.searchbar--clear--icon {
  @apply text-zinc-400 hover:text-zinc-400 w-3 h-3;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .searchbar {
    height: 32px;
    @apply px-2 gap-1.5;
    max-width: 200px;
  }
  
  .searchbar--input {
    height: 18px;
    line-height: 18px;
    @apply text-xs;
  }
  
  .searchbar--clear {
    width: 18px;
    height: 18px;
  }
  
  .searchbar--clear--icon {
    @apply w-2.5 h-2.5;
  }
}

@media (min-width: 768px) {
  .searchbar {
    max-width: 300px;
  }
}
</style>
