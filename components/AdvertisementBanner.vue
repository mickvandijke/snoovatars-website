<template>
  <div v-if="isBannerShowing" class="relative md:mb-6 px-2 sm:px-6 w-full">
    <Carousel :items-to-show="1" :autoplay="10000" :wrap-around="true" pause-autoplay-on-hover>
      <Slide v-for="(slide, i) in shuffledSlides" :key="i">
        <component :is="slide.component" />
      </Slide>
      <template v-if="shuffledSlides.length > 1" #addons>
        <Pagination />
        <Navigation />
      </template>
    </Carousel>
    <button @click="isBannerClosed = !isBannerClosed" class="p-1 absolute text-xs sm:text-sm font-medium top-1 right-2.5 sm:right-7 md:top-2 md:right-9 bg-primary-accent-solid/90 text-white/60 hover:bg-primary duration-200 rounded-full z-20">
      <XMarkIcon class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import {ComputedRef} from "vue";
import {computed} from "../.nuxt/imports";
import {Capacitor} from "@capacitor/core";
import {ref} from "#imports";
import {XMarkIcon} from "@heroicons/vue/24/solid";
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import BannerNyanMatcher from "~/components/banners/BannerNyanMatcher.vue";
import BannerArconeGames from "~/components/banners/BannerArconeGames.vue";
import BannerRcaxSponsoring from "~/components/banners/BannerRcaxSponsoring.vue";
import BannerThe23Club from "~/components/banners/BannerThe23Club.vue";
import {BannersBannerRcaxTokenLaunch} from "#components";

const isBannerClosed = ref(false);

const slides = [
  {
    key: 'rcax banner',
    component: BannerRcaxSponsoring,
    startDate: new Date('2000-01-01'), // Start date for this slide
    expirationDate: new Date('2023-09-23'),
  },
  {
    key: 'rcax token launch',
    component: BannersBannerRcaxTokenLaunch,
    startDate: new Date('2000-01-01'), // Start date for this slide
    expirationDate: new Date('2025-08-22'),
  },
  {
    key: 'the23club',
    component: BannerThe23Club,
    startDate: new Date('2023-07-26'), // Start date for this slide
    expirationDate: new Date('2023-08-25'),
  },
  {
    key: 'nyan matcher',
    component: BannerNyanMatcher,
    startDate: new Date('2023-08-20'), // Start date for this slide
    expirationDate: new Date('2023-08-28'),
  },
  {
    key: 'arcone games',
    component: BannerArconeGames,
    startDate: new Date('2023-08-22'), // Start date for this slide
    expirationDate: new Date('2023-09-23'),
  }
];

const shuffledSlides = computed(() => {
  const currentDate = new Date();
  let shuffled = [...slides];

  // Filter out slides that haven't started yet
  shuffled = shuffled.filter(slide => slide.startDate <= currentDate);

  // Filter out slides that have expired
  shuffled = shuffled.filter(slide => slide.expirationDate > currentDate);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
});

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

.carousel__pagination {
  @apply hidden md:flex;
}

.carousel__pagination-button::after {
  @apply px-4 bg-white/20 hover:bg-white/40 rounded duration-200;
}

.carousel__pagination-button--active::after {
  @apply bg-white hover:bg-white;
}

.carousel__prev, .carousel__next {
  @apply hidden md:flex;
}

.carousel__prev:hover, .carousel__next:hover {
  @apply text-white/80;
}

.rainbow-gradient {
  background: linear-gradient(to right, #ff5c5c, #ffaa00, #ffdc00, #aaff00, #00ff89, #00f7ff, #4a00ff, #a100ff, #ff00e4);
}

.rainbow-gradient-to-br {
  background: linear-gradient(to bottom right, #ff5c5c, #ffaa00, #ffdc00, #aaff00, #00ff89, #00f7ff, #4a00ff, #a100ff, #ff00e4);
}

.nyan-fade {
  background: linear-gradient(90deg, rgba(0,52,102,1) 0%, rgba(255,255,255,0) 20%);
}
</style>
