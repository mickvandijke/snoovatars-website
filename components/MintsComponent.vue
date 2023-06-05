<template>
  <VirtualGrid :items="items">
    <template #default="{ item, index }">
      <AvatarCard :item="{ name: item.token.name, contract_address: item.token.contract_address, image: item.token.image }" :series-stats="getSeriesStats(item.token.name)">
        <div class="flex items-center gap-1 font-bold text-[0.7rem] overflow-hidden">
          <div class="text-neutral-400">Minter:</div>
          <div class="flex items-center gap-0.5">
            <a :href="`https://opensea.io/${item.minter}`" target="_blank" class="text-neutral-200">{{ item.minter.slice(0, 6) }}..{{ item.minter.slice(item.minter.length - 6, item.minter.length) }}</a>
          </div>
        </div>
        <div class="flex items-center gap-1 font-bold text-[0.8rem] overflow-hidden">
          <a :href="`https://opensea.io/assets/matic/${item.token.contract_address}/${item.token.id}`" target="_blank" class="text-amber-500 font-bold">#{{ item.token.mint_number }}</a>
          <div class="text-neutral-400 font-bold">{{ $timeAgo(new Date(item.date_minted)) }} ago</div>
        </div>
      </AvatarCard>
    </template>
  </VirtualGrid>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {
  useSeriesStats,
  useWatchList,
  addToWatchList,
  removeFromWatchList
} from "~/composables/states";
import {StarIcon} from "@heroicons/vue/24/solid";
import {Mint} from "~/types/mint";

const props = defineProps({
  items: Array as PropType<Mint[]>
});

const seriesStats = useSeriesStats();
const watchList = useWatchList();

function getSeriesStats(name: string) {
  return seriesStats.value[name];
}
</script>

<style scoped>

</style>
