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
  @apply text-header hover:text-header duration-300;
}

.menu-button--menu {
  @apply bg-secondary/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl;
}

.menu-button--menu--item-wrapper > * {
  @apply p-3 w-full whitespace-nowrap inline-flex items-center hover:bg-secondary text-header rounded-lg duration-200;
}
</style>
