<template>
  <div class="flex flex-row justify-between gap-1">
    <div class="flex flex-col">
      <div class="flex font-bold text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-neutral-500 font-medium">Price:</span>
          <div class="flex flex-nowrap items-center gap-1 whitespace-nowrap overflow-hidden">
            <div class="flex items-center">
              <div class="flex items-center">
                <template v-if="item.payment_token.symbol === 'ETH'">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="flex gap-0.5 font-bold text-white">
                    <span>{{ (item.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
                    <span class="text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(item.payment_token.base_price) }}</span>)</span>
                  </div>
                </template>
                <template v-else-if="item.payment_token.symbol === 'MATIC'">
                  <div class="pr-0.5 flex items-center text-orange-500">M</div>
                  <div class="flex gap-0.5 font-bold text-white">
                    <span>{{ (item.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
                    <span class="text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(item.payment_token.base_price / ethereumPriceMap.get("MATIC")) }}</span>)</span>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex font-bold text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-neutral-500 font-medium">Mint Number:</span>
          <button @click="openLinkWith(`https://opensea.io/assets/matic/${item.token.contract_address}/${item.token.id}`)" class="text-neutral-200">#{{ item.token.mint_number }}</button>
        </div>
      </div>
      <div class="flex font-bold text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-neutral-500 font-medium">Date:</span>
          <div class="text-neutral-200">{{ $timeAgo(new Date(item.date_sold)) }} ago</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-end">
      <div class="flex font-medium text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-neutral-500 font-medium">Seller:</span>
          <button @click="openLinkWith(`https://opensea.io/${item.seller}`)" class="text-neutral-500">{{ item.seller.slice(2, 6) }}</button>
        </div>
      </div>
      <div class="flex font-medium text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-neutral-500 font-medium">Buyer:</span>
          <button @click="openLinkWith(`https://opensea.io/${item.buyer}`)" class="text-neutral-500">{{ item.buyer.slice(2, 6) }}</button>
        </div>
      </div>
      <div class="flex font-medium text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-neutral-500 font-medium">Floor:</span>
          <div class="flex items-center">
            <template v-if="!lowestListing">
              <span class="text-neutral-500 font-medium">None.</span>
            </template>
            <template v-else-if="lowestListing.payment_token.symbol === 'ETH'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="flex gap-0.5 text-neutral-500">
                <span>{{ (lowestListing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
              </div>
            </template>
            <template v-else-if="lowestListing.payment_token.symbol === 'MATIC'">
              <div class="pr-0.5 flex items-center text-neutral-500">M</div>
              <div class="flex gap-0.5 text-neutral-500">
                <span>{{ (lowestListing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {Sale} from "~/types/sale";
import {
  useEthereumPriceMap,
  useWatchList,
  getSeriesStats
} from "~/composables/states";
import {computed, ethereumInLocalCurrency, getLowestListing} from "#imports";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";

const props = defineProps({
  item: Object as PropType<Sale>
});

const watchList = useWatchList();
const ethereumPriceMap = useEthereumPriceMap();

const lowestListing = computed(() => {
  const seriesStats = getSeriesStats(props.item.token.contract_address, props.item.token.name);
  return getLowestListing(seriesStats);
});
</script>

<style scoped>

</style>
