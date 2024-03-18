<template>
  <div class="flex flex-row justify-between gap-1">
    <div class="flex flex-col">
      <div class="flex text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-details">Price:</span>
          <div class="flex flex-nowrap items-center gap-1 whitespace-nowrap overflow-hidden">
            <div class="flex items-center">
              <div class="flex items-center">
                <ListingPrice :listing="item" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-details">Mint Number:</span>
          <button @click="openLinkWith(`https://marketplace.rcax.io/asset/${item.token.contract_address}:${item.token.id}`)" class="text-white/80">#{{ item.token.mint_number }}</button>
        </div>
      </div>
      <div class="flex text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-details">Date:</span>
          <div class="text-white/80">{{ $timeAgo(new Date(item.date_listed)) }} ago</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-end">
      <div class="flex text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-white/40">Seller:</span>
          <button @click="openLinkWith(`https://marketplace.rcax.io/portfolio/${item.maker_address}`)" class="text-details">{{ item.maker_address.slice(2, 6) }}</button>
        </div>
      </div>
      <div class="flex text-[0.7rem]">
        <div class="flex gap-1">
          <span class="text-white/40">Floor:</span>
          <div class="flex items-center">
            <template v-if="!lowestListing">
              <span class="text-details">None.</span>
            </template>
            <template v-else>
              <button @click.stop="openLinkWith(`https://marketplace.rcax.io/asset/${lowestListing.token.contract_address}:${lowestListing.token.id}`)" class="flex items-center group">
                <template v-if="lowestListing.payment_token.symbol === 'ETH'">
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
              </button>
            </template>
          </div>
        </div>
      </div>
      <div class="flex text-[0.7rem]">
        <div class="flex gap-1">
          <div class="flex gap-0.5 items-center">
            <ClockIcon class="text-white/40 w-3 h-3" />
            <span class="text-white/40">Sale:</span>
          </div>
          <div class="flex items-center">
            <template v-if="!seriesStats.stats.last_sale">
              <span class="text-details">None.</span>
            </template>
            <template v-else-if="seriesStats.stats.last_sale.payment_token.symbol === 'ETH'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-details"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="flex gap-0.5 text-details">
                <span>{{ (seriesStats.stats.last_sale.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
              </div>
            </template>
            <template v-else-if="seriesStats.stats.last_sale.payment_token.symbol === 'MATIC'">
              <div class="pr-0.5 flex items-center text-details">M</div>
              <div class="flex gap-0.5 text-details">
                <span>{{ (seriesStats.stats.last_sale.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
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
import {
  useWatchList,
  useEthereumPriceMap,
  getSeriesStats
} from "~/composables/states";
import {computed, ethereumInLocalCurrency, getLowestListing, openLinkWith} from "#imports";
import {Listing} from "~/types/listing";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {ClockIcon} from "@heroicons/vue/24/outline";

const props = defineProps({
  item: Object as PropType<Listing>
});

const watchList = useWatchList();
const ethereumPriceMap = useEthereumPriceMap();

const seriesStats = computed(() => {
  return getSeriesStats(props.item.token.contract_address, props.item.token.name);
});

const lowestListing = computed(() => {
  return getLowestListing(seriesStats.value);
});
</script>

<style scoped>

</style>
