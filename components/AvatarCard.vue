<template>
  <div ref="componentRef" class="py-0.5 sm:py-0 relative flex flex-col gap-1 w-full overflow-hidden">
    <template v-if="seriesStats">
      <div class="flex gap-1" style="height: 90px">
        <button @click="openLinkWith(`https://opensea.io/collection/${seriesStats?.collection.slug}?search[query]=${seriesStats?.series.name}`)" class="relative rounded-lg flex items-center overflow-hidden" style="width: 19%">
          <div class="absolute w-full h-full blur-lg" :style="{ backgroundImage: `url(${getTokenImage(item.image)})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
          <img :src="getTokenImage(item.image)" class="relative h-full w-auto mx-auto" :alt="item.name">
          <template v-if="seriesStats && seriesStats.series.mint_price > 0">
            <div class="absolute bottom-1 left-1 px-1 py-0.25 text-white text-[0.65rem] text-center font-bold rounded-lg" :class="{ 'bg-green-600': seriesStats.series.total_sold < seriesStats.series.total_quantity, 'bg-red-600': seriesStats.series.total_sold >= seriesStats.series.total_quantity }">${{ seriesStats.series.mint_price / 100.00 }}</div>
          </template>
          <template v-else>
            <div class="absolute bottom-1 left-1 px-1 py-0.25 text-white text-[0.65rem] text-center font-bold rounded-lg" :class="{ 'bg-green-600': seriesStats.series.total_sold < seriesStats.series.total_quantity, 'bg-red-600': seriesStats.series.total_sold >= seriesStats.series.total_quantity }">FREE</div>
          </template>
          <template v-if="Capacitor.getPlatform() !== 'ios'">
            <div class="absolute top-1 right-1 w-4 h-4 rounded-full">
              <OpenseaIcon />
            </div>
          </template>
        </button>
        <div class="pl-2 sm:px-2 py-1.5 sm:bg-neutral-900 flex flex-col rounded-lg gap-0.5 overflow-hidden" style="width: 81%">
          <div class="flex items-center gap-1 text-[0.7rem]">
            <template v-if="ranking">
              <h1 class="text-neutral-500 font-bold rounded-md">#{{ ranking }}</h1>
            </template>
            <button @click="openLinkWith(`https://opensea.io/collection/${seriesStats.collection.slug}?search[query]=${seriesStats.series.name}`)" class="text-white font-bold text-[0.8rem]" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ seriesStats.series.name }}</button>
            <div class="relative ml-0.5 px-1 text-black font-bold rounded" :class="getMintClasses(seriesStats.series.total_quantity)">
              <template v-if="seriesStats.series.total_quantity <= 250">
                <div class="absolute inset-0 blur-sm animate-pulse-slow" :class="getMintClasses(seriesStats.series.total_quantity)"></div>
              </template>
              <template v-else-if="seriesStats.series.total_quantity <= 777">
                <div class="absolute inset-0 blur-sm animate-pulse-slow" :class="getMintClasses(seriesStats.series.total_quantity)"></div>
              </template>
              <span class="relative">{{ Math.max(seriesStats.series.total_sold, seriesStats.series.total_quantity) }}</span>
            </div>
            <div class="ml-auto flex items-center gap-1 font-bold">
              <template v-if="watchList.has(seriesStats.series.name)">
                <div @click.stop="removeFromWatchList(seriesStats.series.name)" class="flex items-center justify-center cursor-pointer">
                  <StarIcon class="w-5 h-5 text-yellow-500" />
                </div>
              </template>
              <template v-else>
                <div @click.stop="addToWatchList(seriesStats.series.name)" class="group flex items-center justify-center cursor-pointer">
                  <StarIcon class="w-5 h-5 text-neutral-700 group-hover:text-yellow-500/50" />
                </div>
              </template>
            </div>
          </div>
          <div class="h-full flex flex-col justify-between">
            <slot></slot>
          </div>
          <div class="mt-auto flex items-center gap-1">
            <template v-if="seriesStats.stats.lowest_listing">
              <template v-if="!hideFloor && false">
                <button @click="openLinkWith(`https://opensea.io/assets/matic/${seriesStats.stats.lowest_listing.token.contract_address}/${seriesStats.stats.lowest_listing.token.id}`)" class="flex items-center gap-0.5 text-[0.7rem]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="flex gap-0.5 font-bold text-neutral-400">
                    <span>{{ (seriesStats.stats.lowest_listing?.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</span>
                    <span class="text-neutral-500">(<span class="text-neutral-400">{{ ethereumInLocalCurrency(seriesStats.stats.lowest_listing?.payment_token.base_price) }}</span>)</span>
                    <span class="text-neutral-400">#{{ seriesStats.stats.lowest_listing.token.mint_number }}</span>
                  </div>
                </button>
              </template>
              <template v-else>
                <button @click="openLinkWith(`https://opensea.io/collection/${seriesStats.collection.slug}`)" class="text-neutral-500 font-semibold text-[0.7rem]" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ seriesStats.collection.name.replace(" x Reddit Collectible Avatars", "") }}</button>
              </template>
            </template>
            <template v-else>
              <div class="flex gap-1 font-bold text-neutral-400 text-[0.7rem]">
                <span>No floor data.</span>
              </div>
            </template>
            <button @click="toggleExtraInfo()" class="ml-auto flex items-center text-neutral-500 text-[0.7rem] font-semibold whitespace-nowrap rounded-md duration-500">
              <span>{{ showExtraInfo ? "Hide details" : "More" }}</span>
              <ChevronDownIcon class="w-5 h-5 duration-200" :class="{ 'rotate-180': showExtraInfo }" />
            </button>
          </div>
        </div>
      </div>
      <template v-if="showExtraInfo">
        <ExtraInfoComponent @close="closeExtraInfo()" class="h-full" :series-stats="seriesStats" :contract="item.contract_address" :series="item.name" />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref} from "#imports";
import {PropType} from "@vue/runtime-core";
import {SeriesStats} from "~/types/seriesStats";
import OpenseaIcon from "~/components/OpenseaIcon.vue";
import {ChevronDownIcon} from "@heroicons/vue/20/solid";
import {useWatchList, addToWatchList, removeFromWatchList, openLink} from "#imports";
import {StarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon} from "@heroicons/vue/20/solid";
import {Capacitor} from "@capacitor/core";
import {getTokenImage} from "~/global/utils";

export interface AvatarCardItem {
  name: string;
  contract_address: string;
  image: string;
}

const watchList = useWatchList();

const componentRef = ref(null);

const props = defineProps({
  item: {
    type: Object as PropType<AvatarCardItem>,
    required: true
  },
  seriesStats: {
    type: Object as PropType<SeriesStats>,
    required: true
  },
  hideFloor: {
    type: Boolean,
    required: false,
    default: () => false
  },
  ranking: {
    type: Number,
    required: false
  }
});

const showExtraInfo = ref(false);

function closeExtraInfo() {
  showExtraInfo.value = false;

  if (componentRef.value) {
    componentRef.value.scrollIntoView({ block: "start", behavior: "smooth" })
  }
}

function toggleExtraInfo() {
  showExtraInfo.value = !showExtraInfo.value;
}

function getMintClasses(totalQuantity: number) {
  if (totalQuantity <= 250) {
    return ["text-[0.65rem] bg-yellow-500 shadow-yellow-500/50"];
  } else if (totalQuantity <= 777) {
    return ["text-[0.65rem] bg-gray-300 shadow-gray-300/50"];
  } else if (totalQuantity <= 10000) {
    return ["text-[0.65rem] bg-neutral-500/90"];
  } else {
    return ["text-[0.65rem] bg-neutral-500/90"];
  }
}
</script>

<style scoped>

</style>
