<template>
  <button @click.stop="openLinkWith(`https://marketplace.rcax.io/asset/${listing.token.contract_address}:${listing.token.id}`)" class="flex items-center group">
    <template v-if="listing.payment_token.symbol === 'ETH'">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
      <div class="flex gap-1">
        <span class="text-header">{{ (listing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
        <span class="text-details">{{ ethereumInLocalCurrency(listing.payment_token.base_price) }}</span>
        <span class="text-amber-500">#{{ listing.token.mint_number }}</span>
      </div>
    </template>
    <template v-else-if="listing.payment_token.symbol === 'MATIC'">
      <svg class="w-3 h-3 mr-0.5 text-orange-500" fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 38.4 33.5" style="enable-background:new 0 0 38.4 33.5;" xml:space="preserve"><g><path class="st0" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/></g></svg>
      <div class="flex gap-1">
        <span class="text-header">{{ (listing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
        <span class="text-details">{{ ethereumInLocalCurrency(listing.payment_token.base_price / ethereumPriceMap.get("MATIC")) }}</span>
        <span class="text-amber-500">#{{ listing.token.mint_number }}</span>
      </div>
    </template>
  </button>
</template>

<script setup lang="ts">
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {PropType} from "@vue/runtime-core";
import {Listing} from "~/types/listing";
import {useEthereumPriceMap} from "~/composables/states";

const props = defineProps({
  listing: {
    type: Object as PropType<Listing>,
    required: true
  }
});

const ethereumPriceMap = useEthereumPriceMap();
</script>

<style scoped>

</style>
