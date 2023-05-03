<template>
  <div class="grid grid-cols-1 gap-1 overflow-hidden">
    <template v-for="(item, index) in props.items" :key="item.series.name">
      <div class="relative grid grid-cols-5 gap-1 overflow-hidden">
        <div @click="toggleLastSales(item.series.name)" class="relative rounded-lg">
          <img v-lazy-pix="item.series.image" src="/img/rcax_placeholder.png" :alt="item.series.name">
          <div class="absolute top-1 left-1 px-1 py-0.5 bg-white text-black text-[0.65rem] font-bold rounded">{{ item.series.total_sold }}</div>
          <div class="absolute bottom-1 left-1 p-1 bg-neutral-800/50 md:bg-neutral-800/80 backdrop-blur-lg md:backdrop-blur-none text-white font-bold text-[0.65rem] rounded">${{ item.series.mint_price / 100.00 }}</div>
        </div>
        <div @click="toggleLastSales(item.series.name)" class="col-span-4 px-2 py-2 bg-neutral-800 flex flex-col rounded-lg gap-1 overflow-hidden">
          <div class="flex items-center gap-2">
            <h1 class="text-neutral-300 font-bold text-[0.9rem] rounded-md">#{{ index + 1 }}</h1>
            <a :href="'https://opensea.io/collection/' + item.collection.slug + '?search[query]=' + item.series.name" target="_blank" class="text-white font-bold text-[0.9rem]" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.series.name }}</a>
            <div class="ml-auto flex items-center gap-1 font-bold text-[0.7rem]">
              <template v-if="item.stats.lowest_listing">
                <div class="flex items-center">
                  <div class="text-neutral-400">M:</div>
                  <div class="px-1 py-0.5 flex items-center bg-black/10 text-xs rounded-md">
                    <div class="text-neutral-200">${{ abbreviateNumber((item.series.total_sold * (item.stats.lowest_listing?.payment_token.base_price / 1000000000000000000) * ethereumPriceUsd)) }}</div>
                  </div>
                </div>
              </template>
              <template v-if="watchList.has(item.series.name)">
                <div @click.stop="removeFromWatchList(item.series.name)" class="flex items-center justify-center cursor-pointer">
                  <StarIcon class="w-5 h-5 text-yellow-500" />
                </div>
              </template>
              <template v-else>
                <div @click.stop="addToWatchList(item.series.name)" class="flex items-center justify-center cursor-pointer">
                  <StarIcon class="w-5 h-5 text-neutral-500 hover:text-yellow-500/50" />
                </div>
              </template>
            </div>
          </div>
          <div class="flex">
            <template v-if="item.stats.lowest_listing">
              <div class="flex items-center gap-1 font-bold text-xs overflow-hidden">
                <div class="flex items-center">
                  <div class="text-neutral-400">Vol:</div>
                  <div class="px-1 py-0.5 flex items-center bg-black/10 text-xs rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                    <div class="text-neutral-200">{{ (item.stats.total_volume / 1000000000000000000).toFixed(0) }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-1 font-bold text-xs overflow-hidden">
                  <div class="text-neutral-400">F/Mint:</div>
                  <div class="px-1.5 py-0.5 flex items-center bg-black/10 gap-0.5 rounded-md">
                    <div class="text-neutral-200">{{ Math.round(((item.stats.lowest_listing?.payment_token.base_price / 1000000000000000000) * ethereumPriceUsd) / (item.series.mint_price / 100) * 100) }}%</div>
                  </div>
                </div>
              </div>
            </template>
            <div class="ml-auto flex items-center gap-1 font-bold text-xs overflow-hidden">
              <div class="text-neutral-400">24h:</div>
              <template v-if="item.stats.daily_price_change > 0">
                <div class="flex gap-0.5 items-center text-green-500">
                  <ArrowTrendingUpIcon class="w-4 h-4" />
                  <span>{{ item.stats.daily_price_change.toFixed(2) }}%</span>
                </div>
              </template>
              <template v-else-if="item.stats.daily_price_change < 0">
                <div class="flex gap-0.5 items-center text-red-500">
                  <ArrowTrendingDownIcon class="w-4 h-4" />
                  <span>{{ item.stats.daily_price_change.toFixed(2) }}%</span>
                </div>
              </template>
              <template v-else>
                <div class="flex gap-0.5 items-center text-neutral-200">
                  <span>0%</span>
                </div>
              </template>
            </div>
          </div>
          <div class="mt-auto flex gap-2 font-medium items-center">
            <template v-if="item.stats.lowest_listing">
              <a class="px-2 py-0.5 flex items-center gap-2 bg-neutral-700 hover:bg-[#2081E2] text-white/50 font-bold rounded-md duration-500" :href="item.stats.lowest_listing?.permalink" target="_blank">
                <div class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="font-bold text-white text-xs">{{ (item.stats.lowest_listing?.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }} <span class="text-neutral-300">(${{ Math.round((item.stats.lowest_listing?.payment_token.base_price / 1000000000000000000) * ethereumPriceUsd) }})</span></div>
                </div>
              </a>
            </template>
            <template v-if="item.stats.last_sale">
              <div class="ml-auto flex items-center gap-0.5 font-bold text-[0.7rem] overflow-hidden">
                <div class="px-1.5 py-1 flex items-center bg-black/10 text-xs rounded-md gap-0.5">
                  <template v-if="item.stats.last_sale?.payment_token.symbol === 'ETH'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  </template>
                  <template v-else>
                    <div class="flex items-center w-3 h-3 text-orange-500">M</div>
                  </template>
                  <div class="text-neutral-200">{{ (item.stats.last_sale?.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                </div>
                <div class="text-neutral-400 text-xs" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(item.stats.last_sale?.date_sold)) }}</div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <template v-if="isToggleLastSales(item.series.name)">
        <LastSalesComponent :contract="item.series.contract_address" :series="item.series.name" />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import {SeriesStats} from "~/types/seriesStats";
import {PropType} from "@vue/runtime-core";
import {useEthereumUsdPrice, useWatchList, addToWatchList, removeFromWatchList} from "~/composables/states";
import {StarIcon} from "@heroicons/vue/24/solid";
import {ArrowTrendingUpIcon, ArrowTrendingDownIcon} from "@heroicons/vue/20/solid";
import SeriesStatsSalesComponent from "~/components/SeriesStatsSalesComponent.vue";
import {ref} from "#imports";

const ethereumPriceUsd = useEthereumUsdPrice();
const watchList = useWatchList();

const lastSalesToggle = ref("");

const props = defineProps({
  items: Array as PropType<SeriesStats[]>
});

function toggleLastSales(series: string) {
  if (isToggleLastSales(series)) {
    lastSalesToggle.value = "";
  } else {
    lastSalesToggle.value = series;
  }
}

function isToggleLastSales(series: string): boolean {
  return lastSalesToggle.value == series;
}

function abbreviateNumber(value: number) {
  let newValue = value;
  if (value >= 1000000000) {
    newValue = (value / 1000000000).toFixed(2) + 'B';
  } else if (value >= 1000000) {
    newValue = (value / 1000000).toFixed(2) + 'M';
  } else if (value >= 1000) {
    newValue = (value / 1000).toFixed(2) + 'K';
  } else {
    newValue = Math.round(value);
  }
  return newValue;
}
</script>

<style scoped>

</style>
