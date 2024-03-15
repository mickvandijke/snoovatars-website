<template>
  <div v-if="isBannerShowing" class="relative mt-2 md:my-2 px-2 sm:px-6 w-full">
    <Carousel :items-to-show="1" :autoplay="10000" :wrap-around="true" pause-autoplay-on-hover class="drop-shadow-lg">
      <Slide v-for="(slide, i) in shuffledSlides" :key="i">
        <component :is="slide.component" />
      </Slide>
      <template v-if="shuffledSlides.length > 1" #addons>
        <Pagination />
        <Navigation />
      </template>
    </Carousel>
    <button @click="isBannerClosed = !isBannerClosed" class="p-1 absolute text-xs sm:text-sm font-medium top-1 right-2.5 sm:right-7 md:top-2 md:right-9 bg-secondary/60 backdrop-blur-2xl text-details hover:bg-secondary duration-200 rounded-full z-20">
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
import BannerIt from "~/components/banners/BannerIt.vue";
import {
  BannersBannerConeHeads,
  BannersBannerRcaxMarketplaceBeta,
  BannersBannerRcaxTokenHalving,
  BannersBannerRcaxTokenLaunch, BannersBannerRedditAvatarGiveaways,
  BannersBannerConeDesk, BannersBannerRedditAvatarTrading, BannersBannerRcaEggs
} from "#components";

const isBannerClosed = ref(false);

const slides = [
  {
    key: 'I&T',
    component: BannerIt,
    startDate: new Date('2024-02-19'), // Start date for this slide
    expirationDate: new Date('2024-02-26'),
  },
  {
    key: 'RCA Eggs',
    component: BannersBannerRcaEggs,
    startDate: new Date('2023-12-23'), // Start date for this slide
    expirationDate: new Date('2023-12-31'),
  },
  {
    key: 'rcax banner',
    component: BannerRcaxSponsoring,
    startDate: new Date('2023-12-31'), // Start date for this slide
    expirationDate: new Date('3000-09-23'),
  },
  {
    key: 'rcax marketplace beta',
    component: BannersBannerRcaxMarketplaceBeta,
    startDate: new Date('2023-12-31'), // Start date for this slide
    expirationDate: new Date('3000-08-22'),
  },
  {
    key: 'rcax token launch',
    component: BannersBannerRcaxTokenLaunch,
    startDate: new Date('2023-12-31'), // Start date for this slide
    expirationDate: new Date('3000-08-22'),
  },
  {
    key: 'rcax token halving',
    component: BannersBannerRcaxTokenHalving,
    startDate: new Date('2000-01-01'), // Start date for this slide
    expirationDate: new Date('2023-10-11'),
  },
  {
    key: 'nyan matcher',
    component: BannerNyanMatcher,
    startDate: new Date('2023-08-20'), // Start date for this slide
    expirationDate: new Date('2023-08-28'),
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

  if (shuffledSlides.value.length < 1) {
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
  @apply rounded-2xl sm:rounded-2xl overflow-hidden;
}

.carousel__item {
  @apply w-full flex justify-center items-center h-[7rem] md:h-96;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;

  @apply bg-secondary backdrop-blur-xl text-details hover:bg-tertiary duration-200 rounded-full;
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
