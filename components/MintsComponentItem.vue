<template>
  <div class="flex flex-row justify-between gap-1">
    <div class="flex flex-col">
      <div class="flex text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-details font-medium">Mint Number:</span>
          <button @click="openLinkWith(`https://marketplace.rcax.io/asset/${item.token.contract_address}:${item.token.id}`)" class="text-header hover:text-amber-500">#{{ item.token.mint_number }}</button>
        </div>
      </div>
      <div class="flex font-medium text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-details font-medium">Minter:</span>
          <button @click="openLinkWith(`https://marketplace.rcax.io/portfolio/${item.minter}`)" class="text-white/80 hover:text-white">{{ item.minter.slice(2, 6) }}</button>
        </div>
      </div>
      <div class="flex font-medium text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-details font-medium">Date:</span>
          <div class="text-amber-500">{{ $timeAgo(new Date(item.date_minted)) }} ago</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-end">
      <div class="flex font-medium text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-white/40 font-medium">Stock:</span>
          <span class="text-details font-medium">{{ shopStock > 999 ? "999+" : shopStock }} left</span>
        </div>
      </div>
      <div class="flex font-medium text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-white/40 font-medium">Floor:</span>
          <div class="flex items-center">
            <template v-if="!lowestListing">
              <span class="text-details font-medium">None.</span>
            </template>
            <template v-else-if="lowestListing.payment_token.symbol === 'ETH'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-details"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="flex gap-0.5 text-details">
                <span>{{ (lowestListing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
              </div>
            </template>
            <template v-else-if="lowestListing.payment_token.symbol === 'MATIC'">
              <div class="pr-0.5 flex items-center text-details">M</div>
              <div class="flex gap-0.5 text-details">
                <span>{{ (lowestListing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="flex font-medium text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-white/40 font-medium">Profit:</span>
          <div :class="{ 'text-green-500': mintProfitInPercentage >= 0, 'text-red-500': mintProfitInPercentage < 0 }">{{ mintProfitInPercentage }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {
  useWatchList,
  getSeriesStats, useEthereumUsdPrice
} from "~/composables/states";
import {Mint} from "~/types/mint";
import {computed, getListingAsGweiPrice, getLowestListing} from "#imports";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";

const props = defineProps({
  item: Object as PropType<Mint>
});

const watchList = useWatchList();
const ethereumPriceInUsd = useEthereumUsdPrice();

const seriesStats = computed(() => {
  return getSeriesStats(props.item.token.contract_address, props.item.token.name);
});

const lowestListing = computed(() => {
  return getLowestListing(seriesStats.value);
});

const mintProfitInPercentage = computed(() => {
  return Math.round(((getListingAsGweiPrice(lowestListing.value) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd.value) / (seriesStats.value.series.mint_price / 100) * 100 -100);
});

const shopStock = computed(() => {
  return  Math.max(seriesStats.value.series.total_quantity - seriesStats.value.series.total_sold, 0);
});
</script>

<style scoped>

</style>
