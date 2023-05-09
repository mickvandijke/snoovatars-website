<template>
  <VirtualGrid :items="items">
    <template #default="{ item, index }">
      <AvatarCard :item="{ name: item.token.name, contract_address: item.token.contract_address, image: item.token.image }" :series-stats="getSeriesStats(item.token.name)">
        <div class="flex items-center gap-2 text-[0.8rem]">
          <a :href="'https://opensea.io/collection/' + getSeriesStats(item.token.name)?.collection.slug + '?search[query]=' + item.token.name" target="_blank" class="text-white font-bold" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.token.name }}</a>
          <a :href="`https://opensea.io/assets/matic/${item.token.contract_address}/${item.token.id}`" target="_blank" class="text-amber-500 font-bold">#{{ item.token.mint_number }}</a>
          <div class="ml-auto">
            <template v-if="watchList.has(item.token.name)">
              <div @click="removeFromWatchList(item.token.name)" class="flex items-center justify-center cursor-pointer">
                <StarIcon class="w-5 h-5 text-yellow-500" />
              </div>
            </template>
            <template v-else>
              <div @click="addToWatchList(item.token.name)" class="flex items-center justify-center cursor-pointer">
                <StarIcon class="w-5 h-5 text-neutral-500 hover:text-yellow-500/50" />
              </div>
            </template>
          </div>
        </div>
        <div class="flex items-center gap-1 font-bold text-[0.7rem] overflow-hidden">
          <div class="text-neutral-400">Buyer:</div>
          <div class="flex items-center gap-0.5">
            <a :href="`https://opensea.io/${item.buyer}`" target="_blank" class="text-neutral-200">{{ item.buyer.slice(2, 6) }}..{{ item.buyer.slice(item.buyer.length - 4, item.buyer.length) }}</a>
          </div>
          <div class="text-neutral-400 text-xs">Seller:</div>
          <div class="flex items-center gap-0.5">
            <a :href="`https://opensea.io/${item.seller}`" target="_blank" class="text-neutral-200">{{ item.seller.slice(2, 6) }}..{{ item.seller.slice(item.seller.length - 4, item.seller.length) }}</a>
          </div>
        </div>
        <div class="flex items-center gap-1 font-bold text-[0.8rem] lg:text-[0.9rem] 2xl:text-[1.1rem] overflow-hidden">
          <div class="flex items-center rounded-md gap-0.5">
            <template v-if="item.payment_token.symbol === 'ETH'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
            </template>
            <template v-else>
              <div class="flex items-center w-3 h-3 text-orange-500 text-sm">M</div>
            </template>
            <div class="text-white">{{ (item.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
            <template v-if="item.payment_token.symbol === 'ETH'">
              <div class="text-amber-500">({{ ethereumInLocalCurrency(item.payment_token.base_price) }})</div>
            </template>
          </div>
          <div class="text-neutral-400" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(item.date_sold)) }} ago</div>
        </div>
      </AvatarCard>
    </template>
  </VirtualGrid>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {Sale} from "~/types/sale";
import {
  useSeriesStats,
  useWatchList,
  addToWatchList,
  removeFromWatchList
} from "~/composables/states";
import {StarIcon} from "@heroicons/vue/24/solid";
import {ethereumInLocalCurrency} from "#imports";

const props = defineProps({
  items: Array as PropType<Sale[]>
});

const seriesStats = useSeriesStats();
const watchList = useWatchList();

function getSeriesStats(name: string) {
  return seriesStats.value[name];
}
</script>

<style scoped>

</style>
