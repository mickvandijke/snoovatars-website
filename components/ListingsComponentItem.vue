<template>
  <div class="space-y-1">
    <!-- Listing Info -->
    <div class="flex items-center justify-between text-xs">
      <span class="text-zinc-500">Listing</span>
      <div class="flex items-center gap-1.5">
        <button 
          @click="openLinkWith(`https://opensea.io/${item.maker_address}`)" 
          class="text-zinc-300 hover:text-white transition-colors font-mono text-xs px-1.5 py-0.5 bg-zinc-800/40 rounded"
        >
          {{ item.maker_address.slice(2, 6) }}
        </button>
      </div>
    </div>

    <!-- Current Floor -->
    <div class="flex items-center justify-between text-xs">
      <span class="text-zinc-500">Floor</span>
      <template v-if="!lowestListing">
        <span class="text-zinc-500">—</span>
      </template>
      <template v-else-if="normalizeTokenSymbol(lowestListing.payment_token.symbol) === 'ETH'">
        <div class="flex items-center gap-0.5 font-medium text-zinc-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-2.5 h-2.5">
            <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
          </svg>
          <span>{{ (lowestListing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(3).replace(/\.?0+$/, '') }}</span>
        </div>
      </template>
      <template v-else-if="normalizeTokenSymbol(lowestListing.payment_token.symbol) === 'MATIC'">
        <div class="flex items-center gap-0.5 font-medium text-zinc-400">
          <span class="font-bold text-xs">M</span>
          <span>{{ (lowestListing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(3).replace(/\.?0+$/, '') }}</span>
        </div>
      </template>
    </div>

    <!-- Listing Price -->
    <div class="flex items-center justify-between pt-1">
      <button 
        @click="openLinkWith(`https://opensea.io/assets/matic/${item.token.contract_address}/${item.token.id}`)"
        class="flex items-center gap-1 hover:opacity-80 transition-opacity"
      >
        <template v-if="normalizeTokenSymbol(item.payment_token.symbol) === 'ETH'">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-2.5 h-2.5 text-white">
            <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
          </svg>
        </template>
        <template v-else-if="normalizeTokenSymbol(item.payment_token.symbol) === 'MATIC'">
          <span class="font-bold text-xs text-white">M</span>
        </template>
        <span class="text-xs font-bold text-white">{{ (item.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(3).replace(/\.?0+$/, '') }}</span>
        <span class="text-xs text-zinc-500">({{ listingFiatPrice }})</span>
      </button>
      <span class="text-xs text-zinc-400">{{ $timeAgo(new Date(item.date_listed)) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {Listing} from "~/types/listing";
import {computed, openLinkWith, getLowestListing} from "#imports";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {normalizeTokenSymbol} from "~/global/utils";
import {getSeriesStats, useEthereumUsdPrice, useSettings, useEthereumPriceMap} from "~/composables/states";

const props = defineProps({
  item: Object as PropType<Listing>
});

const ethereumUsdPrice = useEthereumUsdPrice();

const seriesStats = computed(() => {
  return getSeriesStats(props.item.token.contract_address, props.item.token.name);
});

const lowestListing = computed(() => {
  return getLowestListing(seriesStats.value);
});

const listingFiatPrice = computed(() => {
  const ethPrice = props.item.payment_token.base_price / ETH_TO_GWEI_MODIFIER;
  const settings = useSettings();
  const currency = settings.value.currency.preferred;
  const ethereumPriceMap = useEthereumPriceMap();
  const exchangeRate = ethereumPriceMap.value.get(currency) ?? 0;
  const fiatValue = ethPrice * exchangeRate;
  
  if (fiatValue >= 1000) {
    const formattedK = new Intl.NumberFormat(undefined, { style: 'currency', currency, minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(fiatValue / 1000);
    return formattedK.replace(/\.0/, '') + 'k';
  }
  
  const minimumFractionDigits = fiatValue >= 100 ? 0 : 2;
  const maximumFractionDigits = fiatValue >= 100 ? 0 : 2;
  
  return new Intl.NumberFormat(undefined, { 
    style: 'currency', 
    currency, 
    minimumFractionDigits, 
    maximumFractionDigits 
  }).format(fiatValue);
});
</script>

<style scoped>

</style>