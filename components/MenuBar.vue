<template>
  <div class="menubar" :class="{ 'mobile-padding-top': Capacitor.isNativePlatform() }" style="max-width: 100%;">
    <slot></slot>
  </div>
</template>

<script setup>

import {Capacitor} from "@capacitor/core";
</script>

<style>
.menubar {
  @apply bg-primary/90 backdrop-blur-lg border-b border-secondary sticky top-[56px] sm:top-[64px] sm:mb-3 px-2 py-2 sm:px-6 sm:py-3 inline-flex justify-center sm:justify-start gap-2 sm:gap-3 z-10 w-full;
}

.menubar > * {
  @apply h-9 sm:h-10;
}

.menubar > select {
  @apply p-2 bg-transparent ring-1 ring-white/5 text-sm text-white/80 hover:text-header placeholder-white/20 font-medium focus:outline-none w-full max-w-[7rem] md:max-w-fit rounded-2xl;
}

.menubar > select > option {
  @apply bg-white text-black;
}

.mobile-padding-top {
  top: calc(82px + env(safe-area-inset-top));
}
</style>
