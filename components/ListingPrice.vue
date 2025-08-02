<template>
  <button @click.stop="openLinkWith(`https://opensea.io/assets/matic/${listing.token.contract_address}/${listing.token.id}`)" class="flex items-center gap-0.5 text-xs hover:text-blue-400 transition-colors duration-200">
    <template v-if="normalizeTokenSymbol(listing.payment_token.symbol) === 'ETH'">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" :class="iconColorClass">
        <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
      </svg>
      <span :class="textColorClass">{{ (listing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(3).replace(/\.?0+$/, '') }}</span>
      <span class="text-xs font-normal text-zinc-500">({{ fiatPrice }})</span>
    </template>
    <template v-else-if="normalizeTokenSymbol(listing.payment_token.symbol) === 'MATIC'">
      <span :class="maticIconClass">M</span>
      <span :class="textColorClass">{{ (listing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(3).replace(/\.?0+$/, '') }}</span>
      <span class="text-xs font-normal text-zinc-500">({{ fiatPrice }})</span>
    </template>
  </button>
</template>

<script setup lang="ts">
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {PropType} from "@vue/runtime-core";
import {Listing} from "~/types/listing";
import {useEthereumPriceMap, useEthereumUsdPrice, useSettings} from "~/composables/states";
import {normalizeTokenSymbol} from "~/global/utils";
import {computed} from "#imports";

const props = defineProps({
  listing: {
    type: Object as PropType<Listing>,
    required: true
  },
  variant: {
    type: String as PropType<'default' | 'muted'>,
    default: 'default'
  }
});

const ethereumPriceMap = useEthereumPriceMap();
const ethereumUsdPrice = useEthereumUsdPrice();

const iconColorClass = computed(() => {
  return props.variant === 'muted' ? 'w-2.5 h-2.5 text-zinc-400' : 'w-2.5 h-2.5 text-white';
});

const textColorClass = computed(() => {
  return props.variant === 'muted' ? 'font-medium text-zinc-400' : 'font-medium text-white';
});

const maticIconClass = computed(() => {
  return props.variant === 'muted' ? 'font-bold text-xs text-zinc-400' : 'font-bold text-xs text-white';
});

const fiatPrice = computed(() => {
  const ethPrice = props.listing.payment_token.base_price / ETH_TO_GWEI_MODIFIER;
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
