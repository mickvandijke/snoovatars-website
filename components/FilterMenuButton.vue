<template>
  <div
      v-click-outside="() => { showFilterMenu = false }"
      @click.self="showFilterMenu = !showFilterMenu"
      class="filter-menu-button relative flex flex-row flex-nowrap items-center duration-200 cursor-pointer">
    <button @click.prevent="showFilterMenu = !showFilterMenu" class="filter-menu-button--button">
      <AdjustmentsHorizontalIcon class="w-5 h-5" :class="{ 'text-orange-400': usingFilter }" />
      <span class="hidden sm:block text-sm font-medium">Filters</span>
    </button>
    <template v-if="showFilterMenu">
      <div class="filter-menu-button--menu absolute mt-2 z-50">
        <div class="p-4 flex flex-col gap-2">
          <slot></slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref} from "#imports";
import {AdjustmentsHorizontalIcon} from "@heroicons/vue/24/outline";

const showFilterMenu = ref(false);

const props = defineProps({
  usingFilter: {
    type: Boolean,
    required: true
  }
});
</script>

<style>
.filter-menu-button--button {
  @apply px-3 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 text-zinc-300 hover:text-zinc-100 rounded-lg transition-all duration-200 font-medium flex items-center gap-2;
  height: 36px;
}

.filter-menu-button--button:focus {
  @apply outline-none ring-2 ring-orange-500/50;
}

.filter-menu-button--menu {
  right: 0;
  top: 100%;
  @apply bg-zinc-800/95 backdrop-blur-lg border border-zinc-700/50 rounded-xl shadow-xl;
  min-width: 280px;
  max-width: 350px;
  width: max-content;
}

.filter-menu-button--menu > div {
  @apply w-full max-w-full;
}

.filter-menu-button--menu select, 
.filter-menu-button--menu input {
  @apply px-3 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 text-sm text-zinc-400 placeholder-zinc-500 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 w-full rounded-lg transition-all duration-200;
}

.filter-menu-button--menu select > option {
  @apply bg-zinc-800 text-zinc-400;
}

.filter-menu-button--menu input[type="number"] {
  @apply appearance-none;
}

.filter-menu-button--menu button {
  @apply px-3 py-2 bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-400 hover:text-white rounded-lg transition-all duration-200 font-medium;
}

.filter-menu-button--menu button.clear-button {
  @apply bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .filter-menu-button--button {
    @apply px-2.5 text-xs;
    height: 32px;
  }
  
  .filter-menu-button--menu {
    min-width: 250px;
    max-width: 300px;
    right: -20px;
  }
}

@media (max-width: 480px) {
  .filter-menu-button--menu {
    right: -40px;
    min-width: 220px;
    max-width: 280px;
  }
}
</style>
