<template>
  <VirtualGrid :items="items">
    <template #default="{ item, index }">
      <AvatarCard :item="{ name: item.token.name, contract_address: item.token.contract_address, image: item.token.image }" :series-stats="getSeriesStats(item.token.name)">
        <div class="flex flex-row justify-between gap-1">
          <div class="flex flex-col">
            <div class="flex font-bold text-[0.7rem]">
              <div class="flex gap-1">
                <span class="text-neutral-500 font-medium">Mint Number:</span>
                <button @click="openLinkWith(`https://opensea.io/assets/matic/${item.token.contract_address}/${item.token.id}`)" class="text-white">#{{ item.token.mint_number }}</button>
              </div>
            </div>
            <div class="flex font-bold text-[0.7rem]">
              <div class="flex gap-1">
                <span class="text-neutral-500 font-medium">Minter:</span>
                <button @click="openLinkWith(`https://opensea.io/${item.minter}`)" class="text-neutral-200">{{ item.minter.slice(0, 6) }}..{{ item.minter.slice(item.minter.length - 6, item.minter.length) }}</button>
              </div>
            </div>
            <div class="flex font-bold text-[0.7rem]">
              <div class="flex gap-1">
                <span class="text-neutral-500 font-medium">Date:</span>
                <div class="text-neutral-200">{{ $timeAgo(new Date(item.date_minted)) }} ago</div>
              </div>
            </div>
          </div>
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
