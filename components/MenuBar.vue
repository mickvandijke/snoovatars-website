<template>
  <div class="menubar px-2 py-2 sm:px-6 sm:py-3 inline-flex justify-center sm:justify-start gap-2 sm:gap-3 z-10 w-full" style="max-width: 100%;">
    <slot></slot>
  </div>
</template>

<script setup>

</script>

<style>
.menubar > * {
  @apply h-9 sm:h-10;
}

.menubar > select {
  @apply p-2 bg-secondary hover:bg-tertiary text-sm text-header hover:text-header placeholder-white/20 font-medium border-none focus:outline-none w-full max-w-[7rem] md:max-w-fit rounded-2xl;
}

.menubar > select > option {
  @apply bg-white text-black;
}
</style>
