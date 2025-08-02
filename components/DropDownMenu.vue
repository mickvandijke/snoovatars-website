<template>
  <div
      v-click-outside="() => { showMenu = false; }"
      @click.self="showMenu = !showMenu"
      class="menu-button relative flex flex-row flex-nowrap items-center duration-200 cursor-pointer">
    <button @click.prevent="showMenu = !showMenu" class="menu-button--button flex flex-row flex-nowrap items-center gap-2">
      <slot name="button"></slot>
    </button>
    <template v-if="showMenu">
      <div class="menu-button--menu absolute right-0 top-full mt-2 z-10 w-fit max-w-lg">
        <div class="menu-button--menu--item-wrapper p-4 flex flex-col gap-1" style="min-width: 192px">
          <slot name="menu"></slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref} from "#imports";
import {UserCircleIcon} from "@heroicons/vue/24/solid";

const showMenu = ref(false);

const props = defineProps({
  usingUser: {
    type: Boolean,
    required: true
  }
});
</script>

<style>
.menu-button--button {
  @apply text-zinc-400 hover:text-white duration-300;
}

.menu-button--menu {
  @apply bg-zinc-800/95 backdrop-blur-lg border border-zinc-700/50 rounded-xl shadow-xl;
}

.menu-button--menu--item-wrapper > * {
  @apply px-4 py-3 w-full whitespace-nowrap inline-flex items-center hover:bg-zinc-700/50 text-zinc-400 hover:text-white rounded-lg duration-200 border-b border-zinc-700/30 last:border-b-0;
}
</style>
