<template>
  <div v-if="isBannerShowing" class="sm:mb-6 px-2 sm:px-6 w-full h-24 sm:h-96">
    <div class="relative flex items-center justify-center bg-black w-full h-full rounded-lg sm:rounded-2xl">
      <a href="https://www.the23.club" target="_blank">
        <img src="/images/banners/hodl_banner2.png" alt="Banner Image" class="max-h-44" />
      </a>
      <button @click="isBannerClosed = !isBannerClosed" class="p-1 absolute text-xs sm:text-sm font-medium top-1 right-0.5 sm:right-1 md:top-2 md:right-4 bg-primary-accent backdrop-blur-xl text-white/60 hover:text-white/80 duration-200 rounded-lg">Hide</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ComputedRef} from "vue";
import {computed} from "../.nuxt/imports";
import {Capacitor} from "@capacitor/core";
import {ref} from "#imports";

const isBannerClosed = ref(false);

const isBannerShowing: ComputedRef<boolean> = computed(() => {
  if (Capacitor.isNativePlatform()) {
    return false;
  }

  return !isBannerClosed.value;
});
</script>

<style scoped>

</style>
