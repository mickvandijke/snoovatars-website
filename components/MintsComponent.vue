<template>
  <VirtualGrid :items="items">
    <template #default="{ item, index }">
      <AvatarCard :item="{ name: item.token.name, contract_address: item.token.contract_address, image: item.token.image }" :series-stats="getSeriesStats(item.token.name)">
        <div class="flex items-center gap-2 text-[0.8rem]">
          <a :href="`https://opensea.io/collection/${getSeriesStats(item.token.name)?.collection.slug}?search[query]=${item.token.name}`" target="_blank" class="text-white font-bold" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.token.name }}</a>
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
          <div class="text-neutral-400">Minter:</div>
          <div class="flex items-center gap-0.5">
            <a :href="`https://opensea.io/${item.minter}`" target="_blank" class="text-neutral-200">{{ item.minter.slice(0, 6) }}..{{ item.minter.slice(item.minter.length - 6, item.minter.length) }}</a>
          </div>
        </div>
        <div class="text-amber-500 text-[0.8rem] md:text-[1.1rem] font-bold">{{ $timeAgo(new Date(item.date_minted)) }} ago</div>
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
