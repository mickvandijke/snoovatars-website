<template>
  <div
      v-click-outside="() => { showFilterMenu = false }"
      @click.self="showFilterMenu = !showFilterMenu"
      class="filter-menu-button relative flex flex-row flex-nowrap items-center duration-200 cursor-pointer">
    <button @click.prevent="showFilterMenu = !showFilterMenu" class="filter-menu-button--button px-4 flex flex-row flex-nowrap items-center gap-2 rounded-lg">
      <AdjustmentsHorizontalIcon class="w-6 h-6" :class="{ 'text-amber-500': usingFilter }" />
      <span class="hidden sm:block text-sm font-medium">Filters</span>
    </button>
    <template v-if="showFilterMenu">
      <div class="filter-menu-button--menu absolute mt-2 z-10 w-fit max-w-lg">
        <div class="p-4 flex flex-col gap-2" style="min-width: 192px">
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
  @apply h-full bg-secondary text-white/90 hover:text-header hover:bg-tertiary;
}

.filter-menu-button--menu {
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  @apply bg-secondary/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl;
}

.filter-menu-button--menu > * {
  @apply w-full max-w-full;
}

.filter-menu-button--menu select, .filter-menu-button--menu input {
  @apply p-2 bg-secondary hover:bg-tertiary text-sm text-white/90 hover:text-header placeholder-white/20 font-medium border-none focus:outline-none w-full overflow-x-hidden rounded-lg;
}

.filter-menu-button--menu select > option {
  @apply bg-white text-black;
}
</style>
