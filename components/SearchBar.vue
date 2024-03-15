<template>
  <div class="searchbar flex">
    <div class="flex flex-nowrap items-center w-full">
      <div>
        <MagnifyingGlassIcon class="searchbar--icon" />
      </div>
      <div class="px-2 w-full">
        <input :value="searchTerm" @input="$emit('update:searchTerm', $event.target.value)" :placeholder="placeholder" class="searchbar--input">
      </div>
      <template v-if="searchTerm">
        <div class="searchbar--action">
          <XMarkIcon class="searchbar--action--icon" @click="$emit('update:searchTerm', '')" />
        </div>
      </template>
    </div>
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
  @apply px-2 py-1 w-full border border-white/5 hover:border-white/10 focus-within:bg-transparent focus-within:border-white/20 focus-within:hover:border-white/40 rounded-2xl duration-300 cursor-text;
}

.searchbar--icon {
  @apply text-details w-4 h-4 ml-1 sm:mx-1;
}

.searchbar--input {
  @apply p-0 bg-transparent text-sm text-white/80 placeholder-white/25 border-none focus:outline-none cursor-text;
}

.searchbar--action {
  @apply p-1 bg-secondary hover:bg-tertiary rounded-lg cursor-pointer;
}

.searchbar--action--icon {
  @apply text-details w-4 h-4;
}
</style>
