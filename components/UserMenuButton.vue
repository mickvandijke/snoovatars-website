<template>
  <div
      v-click-outside="() => { showUserMenu = false; }"
      @click.self="showUserMenu = !showUserMenu"
      class="user-menu-button relative flex flex-row flex-nowrap items-center duration-200 cursor-pointer">
    <button @click.prevent="showUserMenu = !showUserMenu" class="user-menu-button--button flex flex-row flex-nowrap items-center gap-2">
      <UserCircleIcon class="h-9" />
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
import {ref} from "#imports";
import {UserCircleIcon} from "@heroicons/vue/24/outline";

const showUserMenu = ref(false);

const props = defineProps({
  usingUser: {
    type: Boolean,
    required: true
  }
});
</script>

<style>
.user-menu-button--button {
  @apply text-white/40 hover:text-white duration-300;
}

.user-menu-button--menu {
  @apply bg-secondary/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl;
}

.user-menu-button--menu--item-wrapper > * {
  @apply p-3 w-full inline-flex items-center hover:bg-secondary text-header rounded-lg duration-200;
}
</style>
