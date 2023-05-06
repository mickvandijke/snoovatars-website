<template>
  <div class="grid grid-cols-1 gap-1">
    <template v-for="(sale, index) in props.items" :key="index">
      <AvatarCard :item="{ name: sale.token.name, contract_address: sale.token.contract_address, image: sale.token.image }" :series-stats="getSeries(sale.token.name)">
        <div class="flex items-center gap-2">
          <a :href="'https://opensea.io/collection/' + getSeries(sale.token.name)?.collection.slug + '?search[query]=' + sale.token.name" target="_blank" class="text-white font-bold text-[0.9rem]" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ sale.token.name }}</a>
          <a :href="`https://opensea.io/assets/matic/${sale.token.contract_address}/${sale.token.id}`" target="_blank" class="text-amber-500 font-bold text-[0.9rem]">#{{ sale.token.mint_number }}</a>
          <div class="ml-auto">
            <template v-if="watchList.has(sale.token.name)">
              <div @click="removeFromWatchList(sale.token.name)" class="flex items-center justify-center cursor-pointer">
                <StarIcon class="w-5 h-5 text-yellow-500" />
              </div>
            </template>
            <template v-else>
              <div @click="addToWatchList(sale.token.name)" class="flex items-center justify-center cursor-pointer">
                <StarIcon class="w-5 h-5 text-neutral-500 hover:text-yellow-500/50" />
              </div>
            </template>
          </div>
        </div>
        <div class="flex items-center gap-1 font-bold text-[0.7rem] overflow-hidden">
          <div class="text-neutral-400 text-xs">Buyer:</div>
          <div class="px-1.5 py-1 flex items-center bg-black/10 text-xs rounded-md gap-0.5">
            <a :href="`https://opensea.io/${sale.buyer}`" target="_blank" class="text-neutral-200">{{ sale.buyer.slice(2, 7) }}</a>
          </div>
          <div class="text-neutral-400 text-xs">Seller:</div>
          <div class="px-1.5 py-1 flex items-center bg-black/10 text-xs rounded-md gap-0.5">
            <a :href="`https://opensea.io/${sale.seller}`" target="_blank" class="text-neutral-200">{{ sale.seller.slice(2, 7) }}</a>
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
      </AvatarCard>
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
import {ref} from "#imports";

const props = defineProps({
  items: Array as PropType<Sale[]>
});

const seriesStats = useSeriesStats();
const watchList = useWatchList();
const ethereumPriceUsd = useEthereumUsdPrice();

const lastSalesToggle = ref(-1);

function getSeries(name: string) {
  return seriesStats.value[name];
}

function getStats(name: string) {
  return seriesStats.value[name]?.stats;
}

function toggleLastSales(index: number) {
  if (isToggleLastSales(index)) {
    lastSalesToggle.value = -1;
  } else {
    lastSalesToggle.value = index;
  }
}

function isToggleLastSales(index: number): boolean {
  return lastSalesToggle.value == index;
}
</script>

<style scoped>

</style>
