<template>
  <div class="grid grid-cols-1 gap-1">
    <template v-for="(sale, index) in props.items" :key="index">
      <div class="relative grid grid-cols-5 gap-1 overflow-hidden">
        <div class="relative rounded-lg">
          <img v-lazy-pix="sale.token.image" :alt="sale.token.name">
          <template v-if="getSeries(sale.token.name)">
            <div class="absolute top-1 left-1 px-1 py-0.5 bg-white text-black text-[0.65rem] font-bold rounded">{{ getSeries(sale.token.name)?.total_sold }}</div>
            <div class="absolute bottom-1 left-1 p-1 bg-neutral-800/50 md:bg-neutral-800/80 backdrop-blur-lg md:backdrop-blur-none text-white font-bold text-[0.65rem] rounded">${{ getSeries(sale.token.name)?.mint_price / 100.00 }}</div>
          </template>
        </div>
        <div class="col-span-4 px-2 py-2 bg-neutral-800 flex flex-col rounded-lg gap-1 overflow-hidden">
          <div class="flex items-center gap-2">
            <h1 class="text-white font-bold text-[0.9rem]" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ sale.token.name }}</h1>
            <h1 class="text-amber-500 font-bold text-[0.9rem]">#{{ sale.token.mint_number }}</h1>
            <div class="ml-auto">
              <template v-if="watchList.has(sale.token.name)">
                <div @click="removeFromWatchList(sale.token.name)" class="flex items-center justify-center cursor-pointer">
                  <StarIcon class="w-5 h-5 text-yellow-500" />
                </div>
              </template>
              <template v-else>
                <div @click="addToWatchList(sale.token.name)" class="flex items-center justify-center cursor-pointer">
                  <StarIcon class="w-5 h-5 text-neutral-700 hover:text-yellow-500/50" />
                </div>
              </template>
            </div>
          </div>
          <div class="flex items-center gap-1 font-bold text-[0.7rem] overflow-hidden">
            <div class="text-neutral-400 text-xs">Buyer:</div>
            <div class="px-1.5 py-1 flex items-center bg-black/10 text-xs rounded-md gap-0.5">
              <div class="text-neutral-200">{{ sale.buyer.slice(2, 7) }}</div>
            </div>
            <div class="text-neutral-400 text-xs">Seller:</div>
            <div class="px-1.5 py-1 flex items-center bg-black/10 text-xs rounded-md gap-0.5">
              <div class="text-neutral-200">{{ sale.seller.slice(2, 7) }}</div>
            </div>
          </div>
          <div class="mt-auto flex items-center gap-2 font-bold text-xs overflow-hidden">
            <div class="flex items-center rounded-md gap-0.5">
              <template v-if="sale.payment_token.symbol === 'ETH'">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              </template>
              <template v-else>
                <div class="flex items-center w-3 h-3 text-orange-500">M</div>
              </template>
              <div class="text-white text-xs">{{ (sale.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
              <template v-if="sale.payment_token.symbol === 'ETH'">
                <div class="text-neutral-400 text-xs">(${{ Math.round((sale.payment_token.base_price / 1000000000000000000) * ethereumPriceUsd) }})</div>
              </template>
            </div>
            <div class="text-neutral-400 text-xs" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(sale.date_sold)) }}</div>
            <template v-if="getStats(sale.token.name)?.lowest_listing">
              <a class="ml-auto px-2 py-0.5 flex items-center gap-2 bg-neutral-700 hover:bg-[#2081E2] text-white/50 font-bold rounded-md duration-500" :href="getStats(sale.token.name)?.lowest_listing.permalink">
                <div class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="font-bold text-white text-xs">{{
                      (getStats(sale.token.name)?.lowest_listing.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '')
                    }}</div>
                </div>
              </a>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {Sale} from "~/types/sale";
import {
  useSeriesStats,
  useWatchList,
  addToWatchList,
  removeFromWatchList,
  useEthereumUsdPrice
} from "~/composables/states";
import {StarIcon} from "@heroicons/vue/24/solid";

const props = defineProps({
  items: Array as PropType<Sale[]>
});

const seriesStats = useSeriesStats();
const watchList = useWatchList();
const ethereumPriceUsd = useEthereumUsdPrice();

function getSeries(name: string) {
  return seriesStats.value[name]?.series;
}

function getStats(name: string) {
  return seriesStats.value[name]?.stats;
}
</script>

<style scoped>

</style>
