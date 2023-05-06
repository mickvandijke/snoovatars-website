<template>
  <div class="grid grid-cols-1 gap-1">
    <template v-for="(mint, index) in props.items" :key="index">
      <AvatarCard :item="{ name: mint.token.name, contract_address: mint.token.contract_address, image: mint.token.image }" :series-stats="getSeriesStats(mint.token.name)">
        <div class="flex items-center gap-2">
          <a :href="`https://opensea.io/collection/${getSeriesStats(mint.token.name)?.collection.slug}?search[query]=${mint.token.name}`" target="_blank" class="text-white font-bold text-[0.9rem]" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ mint.token.name }}</a>
          <a :href="`https://opensea.io/assets/matic/${mint.token.contract_address}/${mint.token.id}`" target="_blank" class="text-amber-500 font-bold text-[0.9rem]">#{{ mint.token.mint_number }}</a>
          <div class="ml-auto">
            <template v-if="watchList.has(mint.token.name)">
              <div @click="removeFromWatchList(mint.token.name)" class="flex items-center justify-center cursor-pointer">
                <StarIcon class="w-5 h-5 text-yellow-500" />
              </div>
            </template>
            <template v-else>
              <div @click="addToWatchList(mint.token.name)" class="flex items-center justify-center cursor-pointer">
                <StarIcon class="w-5 h-5 text-neutral-500 hover:text-yellow-500/50" />
              </div>
            </template>
          </div>
        </div>
        <div class="flex items-center gap-1 font-bold text-[0.7rem] overflow-hidden">
          <div class="text-neutral-400 text-xs">Minter:</div>
          <div class="px-1.5 py-1 flex items-center bg-black/10 text-xs rounded-md gap-0.5">
            <a :href="`https://opensea.io/${mint.minter}`" target="_blank" class="text-neutral-200">{{ mint.minter.slice(2, 7) }}</a>
          </div>
        </div>
        <div class="text-neutral-400 text-sm font-bold" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(mint.date_minted)) }}</div>
      </AvatarCard>
    </template>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {
  useSeriesStats,
  useWatchList,
  addToWatchList,
  removeFromWatchList,
  useEthereumUsdPrice
} from "~/composables/states";
import {StarIcon} from "@heroicons/vue/24/solid";
import {ref} from "#imports";
import {Mint} from "~/types/mint";

const props = defineProps({
  items: Array as PropType<Mint[]>
});

const seriesStats = useSeriesStats();
const watchList = useWatchList();
const ethereumPriceUsd = useEthereumUsdPrice();

const lastSalesToggle = ref(-1);

function getSeriesStats(name: string) {
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

function getTokenImage(url: string): string {
  if (url.startsWith("ipfs://")) {
    url = url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }

  return url;
}
</script>

<style scoped>

</style>
