<template>
  <div v-if="isBannerShowing" class="sm:mb-6 px-2 sm:px-6 w-full h-24 md:h-96 overflow-hidden">
    <div class="relative flex items-center justify-center bg-black w-full h-full rounded-lg sm:rounded-2xl">
      <a href="https://www.the23.club" target="_blank" class="flex justify-center items-center w-full h-full">
        <img src="/images/banners/hodl_banner2.png" alt="Banner Image" class="object-contain max-h-44" />
      </a>
      <button @click="isBannerClosed = !isBannerClosed" class="p-1 absolute text-xs sm:text-sm font-medium top-1 right-0.5 sm:right-1 md:top-2 md:right-4 bg-primary-accent-solid/90 text-white/60 hover:bg-primary-accent-hover duration-200 rounded-full">
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ComputedRef} from "vue";
import {computed} from "../.nuxt/imports";
import {Capacitor} from "@capacitor/core";
import {ref} from "#imports";
import {XMarkIcon} from "@heroicons/vue/24/solid";

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
