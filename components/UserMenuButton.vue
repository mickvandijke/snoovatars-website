<template>
  <div
      v-click-outside="() => { showUserMenu = false; }"
      @click.self="showUserMenu = !showUserMenu"
      class="user-menu-button relative flex flex-row flex-nowrap items-center duration-200 cursor-pointer">
    <button @click.prevent="showUserMenu = !showUserMenu" class="user-menu-button--button flex flex-row flex-nowrap items-center gap-3">
      <div v-if="user?.username" class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {{ user.username.charAt(0).toUpperCase() }}
        </div>
        <span class="text-zinc-400 font-medium hidden xl:block">{{ user.username }}</span>
      </div>
      <UserCircleIcon v-else class="h-9" />
    </button>
    <template v-if="showUserMenu">
      <div class="user-menu-button--menu absolute right-0 top-full mt-2 z-10 w-fit max-w-lg">
        <div class="user-menu-button--menu--item-wrapper p-4 flex flex-col gap-1" style="min-width: 192px">
          <slot></slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref, useUser} from "#imports";
import {UserCircleIcon} from "@heroicons/vue/24/outline";

const showUserMenu = ref(false);
const user = useUser();

const props = defineProps({
  usingUser: {
    type: Boolean,
    required: true
  }
});
</script>

<style>
.user-menu-button--button {
  @apply text-zinc-400 hover:text-white duration-300;
}

.user-menu-button--menu {
  @apply bg-zinc-800/95 backdrop-blur-lg border border-zinc-700/50 rounded-xl shadow-xl;
}

.user-menu-button--menu--item-wrapper > * {
  @apply px-4 py-3 w-full inline-flex items-center hover:bg-zinc-700/50 text-zinc-400 hover:text-white rounded-lg duration-200 font-medium;
}

.user-menu-button--menu--item-wrapper > *:first-child {
  @apply border-b border-zinc-700/30 pb-4 mb-2;
}

.user-menu-button--menu--item-wrapper > .text-amber-400 {
  @apply bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20;
}

.user-menu-button--menu--item-wrapper > .text-red-400 {
  @apply hover:bg-red-400/10;
}
</style>
