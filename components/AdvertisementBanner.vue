<template>
  <div v-if="isBannerShowing" class="relative sm:mb-6 px-2 sm:px-6 w-full">
    <Carousel :items-to-show="1" :autoplay="12000" :wrap-around="true">
      <Slide :key="1">
        <div class="carousel__item">
          <div class="advertisement bg-black">
            <div class="flex gap-6 items-center">
              <div class="hidden md:flex justify-center items-center">
                <img src="/images/banners/rcax_icon_banner.png" class="object-contain md:max-h-64 rounded-2xl">
              </div>
              <div class="flex md:flex-col gap-6 max-w-md text-left items-center md:items-start">
                <h1 class="text-white text-xl md:text-5xl font-bold">Your Banner Here?</h1>

                <p class="hidden md:block text-white font-medium">Sponsor RCAX's development by renting a banner. Prices start from $5 a day.</p>

                <NuxtLink to="/sponsoring" class="p-4 w-fit bg-white hover:bg-white/90 text-black/90 font-medium rounded-2xl duration-200">Read More</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </Slide>
      <Slide :key="2">
        <div class="carousel__item">
          <div class="advertisement relative">
            <a href="https://www.the23.club" target="_blank" class="z-20">
              <img src="/images/banners/hodl_banner2.png" alt="Banner Image" class="object-contain max-h-44" />
            </a>
            <img src="/images/banners/hodl_banner2.png" alt="Banner Image" class="absolute left-0 top-0 right-0 bottom-0 blur-3xl opacity-50 z-10" />
          </div>
        </div>
      </Slide>

      <template #addons>
        <Pagination />
        <Navigation />
      </template>
    </Carousel>

    <button @click="isBannerClosed = !isBannerClosed" class="p-1 absolute text-xs sm:text-sm font-medium top-1 right-2.5 sm:right-7 md:top-2 md:right-9 bg-primary-accent-solid/90 text-white/60 hover:bg-primary duration-200 rounded-full z-20">
      <XMarkIcon class="w-5 h-5" />
    </button>
  </div>

<!--  <div v-if="isBannerShowing" class="sm:mb-6 px-2 sm:px-6 w-full h-24 md:h-96">-->
<!--    <div class="relative flex items-center justify-center w-full h-full rounded-lg sm:rounded-2xl overflow-hidden">-->
<!--      &lt;!&ndash; Banner 1 &ndash;&gt;-->
<!--      <div class="banner&#45;&#45;item bg-black">-->
<!--        <a href="https://www.the23.club" target="_blank">-->
<!--          <img src="/images/banners/hodl_banner2.png" alt="Banner Image" class="object-contain max-h-44" />-->
<!--        </a>-->
<!--      </div>-->
<!--      &lt;!&ndash; Banner 2 &ndash;&gt;-->
<!--      <div class="banner&#45;&#45;item bg-white">-->
<!--        <a href="https://www.the23.club" target="_blank">-->
<!--          <img src="/images/banners/hodl_banner2.png" alt="Banner Image" class="object-contain max-h-44" />-->
<!--        </a>-->
<!--      </div>-->
<!--      <button @click="isBannerClosed = !isBannerClosed" class="p-1 absolute text-xs sm:text-sm font-medium top-1 right-0.5 sm:right-1 md:top-2 md:right-2 bg-primary-accent-solid/90 text-white/60 hover:bg-primary-accent-hover duration-200 rounded-full">-->
<!--        <XMarkIcon class="w-5 h-5" />-->
<!--      </button>-->
<!--    </div>-->
<!--  </div>-->
</template>

<script setup lang="ts">
import {ComputedRef} from "vue";
import {computed} from "../.nuxt/imports";
import {Capacitor} from "@capacitor/core";
import {ref} from "#imports";
import {XMarkIcon} from "@heroicons/vue/24/solid";
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';

const isBannerClosed = ref(false);

const isBannerShowing: ComputedRef<boolean> = computed(() => {
  if (Capacitor.isNativePlatform()) {
    return false;
  }

  return !isBannerClosed.value;
});
</script>

<style>
.advertisement {
  @apply flex justify-center items-center min-w-full w-full h-full overflow-hidden;
}

.carousel__viewport {
  @apply rounded-lg sm:rounded-2xl overflow-hidden;
}

.carousel__item {
  @apply w-full flex justify-center items-center h-24 md:h-96;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;

  @apply bg-primary-accent backdrop-blur-xl text-white/60 hover:bg-primary-accent-hover duration-200 rounded-full;
}

.carousel__pagination-button::after {
  @apply px-4 bg-white/20 hover:bg-white/40 rounded duration-200;
}

.carousel__pagination-button--active::after {
  @apply bg-white hover:bg-white;
}

.carousel__prev:hover, .carousel__next:hover {
  @apply text-white/80;
}
</style>
