<template>
  <div class="menubar px-2 py-2 sm:px-6 sm:py-4 inline-flex justify-center sm:justify-start gap-2 sm:gap-4 z-10 w-full overflow-hidden" style="max-width: 100%;">
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
  @apply p-2 bg-primary-accent hover:bg-primary-accent-hover text-sm text-white placeholder-white/20 font-medium border-none focus:outline-none w-full max-w-[6rem] md:max-w-fit rounded-lg;
}
</style>
