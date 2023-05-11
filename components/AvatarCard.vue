<template>
  <div class="relative flex flex-col gap-1 overflow-hidden">
    <template v-if="seriesStats">
      <div class="flex gap-1" style="height: 90px">
        <a :href="`https://opensea.io/collection/${seriesStats?.collection.slug}?search[query]=${seriesStats?.series.name}`" target="_blank" class="relative flex items-center rounded-lg overflow-hidden" style="width: 19%">
          <img :src="getTokenImage(item.image)" :alt="item.name">
          <template v-if="seriesStats">
            <div class="absolute top-1 left-1 px-1 border-amber-400 text-black text-[0.65rem] font-bold border-2 rounded" :class="getMintBackgroundClass(seriesStats.series.total_quantity)">{{ Math.max(seriesStats.series.total_sold, seriesStats.series.total_quantity) }}</div>
            <div class="absolute bottom-0 w-full px-1 py-0.25 text-white text-[0.65rem] text-center font-bold bg-opacity-90" :class="{ 'bg-green-600': seriesStats.series.total_sold < seriesStats.series.total_quantity, 'bg-red-600': seriesStats.series.total_sold >= seriesStats.series.total_quantity }">${{ seriesStats.series.mint_price / 100.00 }}</div>
          </template>
          <div class="absolute top-1 right-1 w-4 h-4 rounded-full">
            <OpenseaIcon />
          </div>
        </a>
        <div class="px-2 py-1.5 bg-neutral-800/75 flex flex-col rounded-lg gap-1 overflow-hidden" style="width: 81%">
          <div class="h-full flex flex-col justify-between">
            <slot></slot>
          </div>
          <div class="mt-auto flex items-center gap-1">
            <template v-if="seriesStats.stats.lowest_listing">
              <template v-if="!hideFloor">
                <div class="flex items-center gap-0.5 text-[0.7rem]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="flex gap-1 font-bold text-neutral-400">
                    <span>{{ (seriesStats.stats.lowest_listing?.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</span>
                  </div>
                </div>
              </template>
              <a class="px-2 flex items-center gap-1 bg-neutral-700 hover:bg-[#2081E2] text-white/75 text-[0.65rem] font-bold rounded-md duration-500" :href="seriesStats.stats.lowest_listing?.permalink" target="_blank">
                Buy
                <OpenseaIcon class="w-3 h-3" />
              </a>
              <a class="px-2 flex items-center gap-1 bg-neutral-700 hover:bg-[#2081E2] text-white/75 text-[0.65rem] font-bold rounded-md duration-500" :href="dappLink(seriesStats.stats.lowest_listing?.permalink)" target="_blank">
                Buy
                <MetaMaskIcon class="w-3 h-3" />
              </a>
            </template>
            <template v-else>
              <div class="flex gap-1 font-bold text-neutral-400 text-[0.7rem]">
                <span>No floor data.</span>
              </div>
            </template>
            <button @click="toggleExtraInfo()" class="ml-auto flex items-center gap-1 text-neutral-500 text-[0.7rem] font-bold whitespace-nowrap rounded-md duration-500">
              Toggle Extra
            </button>
          </div>
        </div>
      </div>
      <template v-if="showExtraInfo">
        <ExtraInfoComponent class="h-full" :series-stats="seriesStats" :contract="item.contract_address" :series="item.name" />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ref} from "#imports";
import {PropType} from "@vue/runtime-core";
import {SeriesStats} from "~/types/seriesStats";
import OpenseaIcon from "~/components/OpenseaIcon.vue";
import {dappLink} from "~/global/utils";

export interface AvatarCardItem {
  name: string;
  contract_address: string;
  image: string;
}

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
  }
});

const showExtraInfo = ref(false);

function toggleExtraInfo() {
  showExtraInfo.value = !showExtraInfo.value;
}

function getTokenImage(url: string): string {
  if (url.startsWith("ipfs://")) {
    url = url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }

  return url;
}

function getMintBackgroundClass(totalQuantity: number) {
  if (totalQuantity <= 250) {
    return ["bg-yellow-500 border-yellow-400"];
  } else if (totalQuantity <= 777) {
    return ["bg-gray-300 border-gray-200"];
  } else {
    return ["bg-amber-700 border-amber-600"];
  }
}
</script>

<style scoped>

</style>
