<template>
  <VirtualGrid :items="items">
    <template #default="{ item, index }">
      <AvatarCard :item="{ name: item.token.name, contract_address: item.token.contract_address, image: item.token.image }" :series-stats="getSeriesStats(item.token.name)">
        <div class="flex items-center gap-1 font-bold text-[0.7rem] overflow-hidden">
          <div class="flex items-center gap-0.5">
            <button @click="openLinkWith(`https://opensea.io/${item.buyer}`)" class="text-neutral-400">{{ item.buyer.slice(2, 6) }}..{{ item.buyer.slice(item.buyer.length - 4, item.buyer.length) }}</button>
          </div>
          <ArrowRightIcon class="text-neutral-500 w-4" />
          <div class="flex items-center gap-0.5">
            <button @click="openLinkWith(`https://opensea.io/${item.seller}`)" class="text-neutral-400">{{ item.seller.slice(2, 6) }}..{{ item.seller.slice(item.seller.length - 4, item.seller.length) }}</button>
          </div>
        </div>
        <div class="flex items-center gap-1 font-bold text-[0.8rem] overflow-hidden">
          <div class="flex items-center rounded-md gap-0.25">
            <template v-if="item.payment_token.symbol === 'ETH'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="flex gap-1 font-bold text-white">
                <span>{{ (item.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
                <span class="text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(item.payment_token.base_price) }}</span>)</span>
              </div>
            </template>
            <template v-else-if="item.payment_token.symbol === 'MATIC'">
              <div class="flex items-center text-orange-500">M</div>
              <div class="flex gap-1 font-bold text-white">
                <span>{{ (item.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
                <span class="text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(item.payment_token.base_price / ethereumPriceMap.get("MATIC")) }}</span>)</span>
              </div>
            </template>
          </div>
          <button @click="openLinkWith(`https://opensea.io/assets/matic/${item.token.contract_address}/${item.token.id}`)" class="text-neutral-400 font-bold">#{{ item.token.mint_number }}</button>
          <div class="text-neutral-500" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(item.date_sold)) }} ago</div>
        </div>
      </AvatarCard>
    </template>
  </VirtualGrid>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {Sale} from "~/types/sale";
import {
  useEthereumPriceMap,
  useSeriesStats,
  useWatchList,
} from "~/composables/states";
import {ethereumInLocalCurrency} from "#imports";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {ArrowRightIcon} from "@heroicons/vue/20/solid";

const props = defineProps({
  items: Array as PropType<Sale[]>
});

const seriesStats = useSeriesStats();
const watchList = useWatchList();
const ethereumPriceMap = useEthereumPriceMap();

function getSeriesStats(name: string) {
  return seriesStats.value[name];
}
</script>

<style scoped>

</style>
