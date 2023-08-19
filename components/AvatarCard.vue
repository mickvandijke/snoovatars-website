<template>
  <div ref="componentRef" class="px-2 py-1 sm:p-1 sm:bg-primary-accent border-dashed border-t last:border-b sm:border sm:border-solid border-primary-border sm:border-transparent sm:hover:border-white/20 relative flex flex-col gap-1 w-full sm:rounded-xl overflow-hidden cursor-pointer">
    <template v-if="seriesStats">
      <div class="flex gap-1" style="height: 90px">
        <button @click="openLinkWith(`https://opensea.io/collection/${seriesStats?.collection.slug}?search[query]=${seriesStats?.series.name}`)" class="relative rounded-lg flex items-center overflow-hidden" style="width: 19%">
          <template v-if="Capacitor.isNativePlatform()">
            <img v-lazy-pix="getTokenImage(item.image)" :key="item.image" src="/img/rcax_placeholder.png" class="relative w-full h-auto mx-auto" :alt="item.name">
          </template>
          <template v-else>
            <img :src="getTokenImage(item.image)" :key="item.image" class="relative w-full h-auto mx-auto" :alt="item.name">
          </template>
          <template v-if="Capacitor.getPlatform() !== 'ios'">
            <div class="absolute top-1 right-1 w-4 h-4 rounded-full">
              <OpenseaIcon />
            </div>
          </template>
          <template v-if="ranking">
            <div class="px-1 absolute bottom-1 left-1 bg-gray-600 rounded-md">
              <h1 class="text-[0.65rem] text-white/90 font-semibold rounded-md">#{{ ranking }}</h1>
            </div>
          </template>
        </button>
        <div @click="selectAvatar" class="pl-1 sm:pr-1 flex flex-col overflow-hidden" style="width: 81%">
          <div class="flex items-center gap-1 text-[0.7rem]">
            <button @click.stop="openLinkWith(`https://opensea.io/collection/${seriesStats.collection.slug}?search[query]=${seriesStats.series.name}`)" class="text-white hover:text-neutral-300 font-bold text-[0.8rem]" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ seriesStats.series.name }}</button>
            <div class="relative text-black text-[0.7rem] font-medium rounded italic" :class="getMintClasses(seriesStats.series.total_quantity)">
              <span class="relative">{{ Math.max(seriesStats.series.total_sold, seriesStats.series.total_quantity) }}</span>
            </div>
            <div class="ml-auto flex items-center gap-1 font-bold">
              <template v-if="watchList.has(seriesStats.series.name)">
                <div @click.stop="removeFromWatchList(seriesStats.series.name)" class="flex items-center justify-center cursor-pointer">
                  <StarIcon class="w-5 h-5 text-yellow-500" />
                </div>
              </template>
              <template v-else>
                <div @click.stop="addToWatchList(seriesStats.series.name)" class="group flex items-center justify-center cursor-pointer">
                  <StarIconOutlined class="w-5 h-5 text-white/20 group-hover:text-yellow-500" />
                </div>
              </template>
            </div>
          </div>
          <div class="h-full flex flex-col justify-between">
            <slot></slot>
          </div>
          <div class="mt-auto flex items-center gap-1">
            <template v-if="!hideFloor && false">
              <template v-if="seriesStats.stats.lowest_listing">
                <button @click.stop="openLinkWith(`https://opensea.io/assets/matic/${seriesStats.stats.lowest_listing.token.contract_address}/${seriesStats.stats.lowest_listing.token.id}`)" class="flex items-center gap-0.5 text-[0.7rem]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="flex gap-0.5 font-bold text-neutral-400">
                    <span>{{ (seriesStats.stats.lowest_listing?.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</span>
                    <span class="text-neutral-500">(<span class="text-neutral-400">{{ ethereumInLocalCurrency(seriesStats.stats.lowest_listing?.payment_token.base_price) }}</span>)</span>
                    <span class="text-neutral-400">#{{ seriesStats.stats.lowest_listing.token.mint_number }}</span>
                  </div>
                </button>
              </template>
              <template v-else>
                <div class="flex text-[0.7rem]">
                  <span class="text-neutral-400 font-medium">No listings yet.</span>
                </div>
              </template>
            </template>
            <template v-else>
              <div class="text-[0.65rem] font-medium" :class="{ 'text-green-500/90': seriesStats.series.total_sold < seriesStats.series.total_quantity, 'text-red-500/90': seriesStats.series.total_sold >= seriesStats.series.total_quantity }">
                <template v-if="seriesStats && seriesStats.series.mint_price > 0">
                  ${{ seriesStats.series.mint_price / 100.00 }}
                </template>
                <template v-else>
                  FREE
                </template>
              </div>
              <button @click.stop="openLinkWith(`https://opensea.io/collection/${seriesStats.collection.slug}`)" class="text-white/40 hover:text-white/60 text-[0.65rem] duration-200" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ seriesStats.collection.name.replace(" x Reddit Collectible Avatars", "") }}</button>
            </template>
            <div class="ml-auto px-0.5 py-0.25 text-[0.65rem] text-white/40" :key="getGeneration">{{ getGeneration }}</div>
            <InformationCircleIcon @click.stop="selectAvatar" class="w-5 h-5 text-white/20 cursor-pointer" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, useSelectedAvatar} from "#imports";
import {PropType} from "@vue/runtime-core";
import {SeriesStats} from "~/types/seriesStats";
import OpenseaIcon from "~/components/OpenseaIcon.vue";
import {InformationCircleIcon, StarIcon as StarIconOutlined} from "@heroicons/vue/24/outline";
import {useWatchList, addToWatchList, removeFromWatchList} from "#imports";
import {StarIcon} from "@heroicons/vue/20/solid";
import {Capacitor} from "@capacitor/core";
import {getTokenImage} from "~/global/utils";
import {findCollectionNameByContractAddress} from "~/global/generations";

export interface AvatarCardItem {
  name: string;
  contract_address: string;
  image: string;
}

const watchList = useWatchList();
const selectedAvatar = useSelectedAvatar();

const componentRef = ref(null);

const props = defineProps({
  item: {
    type: Object as PropType<AvatarCardItem>,
    required: true
  },
  seriesStats: {
    type: Object as PropType<SeriesStats>,
    required: true
  },
  hideFloor: {
    type: Boolean,
    required: false,
    default: () => false
  },
  ranking: {
    type: Number,
    required: false
  }
});

const getGeneration = computed(() => {
  return findCollectionNameByContractAddress(props.item.contract_address);
});

function selectAvatar() {
  selectedAvatar.value = {
    seriesStats: props.seriesStats,
    contract: props.seriesStats.series.contract_address,
    series: props.seriesStats.series.name
  }
}

function getMintClasses(totalQuantity: number) {
  if (totalQuantity <= 250) {
    return ["text-yellow-500"];
  } else if (totalQuantity <= 777) {
    return ["text-gray-300"];
  } else {
    return ["text-white/60"];
  }
}
</script>

<style scoped>

</style>
