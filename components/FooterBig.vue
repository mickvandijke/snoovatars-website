<template>
  <footer class="px-4 md:px-6 mt-12 pb-[53px] md:pb-0 w-full">
    <!-- sponsors -->
    <div class="p-4 h-72 bg-black/10 rounded-2xl">

    </div>

    <!-- footer -->
    <div class="py-28 flex justify-center gap-6 w-full">
      <div class="footer--section">
        <h1 class="footer--section--header">Socials</h1>
        <div class="footer--section--items">
          <a href="https://twitter.com/RCAX_io" class="footer--section--items--link">Twitter</a>
          <a href="https://discord.gg/6VAVhjMECB" class="footer--section--items--link">Discord</a>
        </div>
      </div>
      <div class="footer--section">
        <h1 class="footer--section--header">Info</h1>
        <div class="footer--section--items">
          <NuxtLink to="sponsoring" class="footer--section--items--link">Advertisements & Donations</NuxtLink>
          <a href="https://discord.gg/6VAVhjMECB" class="footer--section--items--link">Discord</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {Capacitor} from "@capacitor/core";
</script>

<style scoped>
.footer--section {
  @apply w-64 flex flex-col gap-3 items-start;
}

.footer--section--header {
  @apply text-white text-2xl font-semibold;
}

.footer--section--items {
  @apply flex flex-col gap-2 font-medium;
}

.footer--section--items--link {
  @apply text-white/60 hover:text-white duration-300;
}
</style>
