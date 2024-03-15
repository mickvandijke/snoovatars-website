<template>
  <div @click="selectAvatar" ref="componentRef" class="p-2 sm:bg-secondary sm:hover:bg-tertiary relative flex flex-col gap-1 w-full sm:rounded-2xl overflow-hidden cursor-pointer duration-300">
    <template v-if="seriesStats">
<!--      <div class="absolute top-0 left-0 px-2 text-[0.7rem] font-semibold italic rounded-br-md shadow z-20" :class="getMintClasses(seriesStats.series.total_quantity)">-->
<!--        <span class="relative">{{ Math.max(seriesStats.series.total_sold, seriesStats.series.total_quantity) }}</span>-->
<!--      </div>-->
      <div class="relative flex w-full" style="height: 90px">
        <button @click.stop="() => { if (Capacitor.getPlatform() !== 'ios') { openLinkWith(marketplaceLink(seriesStats)) } else { selectAvatar() } }" class="relative flex items-center w-fit">
          <div class="relative flex items-center h-full w-fit sm:h-full mx-auto">
            <div class="relative w-fit max-h-full overflow-hidden rounded-lg">
              <img-placeholder img-class="max-h-[90px]" :src="getTokenImage(seriesStats.series.image)" />
              <div class="absolute top-0 left-0 px-1 py-0 text-[0.7rem] font-semibold italic rounded-br-md border-r-2 border-b-2 border-secondary" :class="getMintClasses(Math.max(seriesStats.series.total_quantity, seriesStats.series.total_sold))">
                <span class="relative">{{ Math.max(seriesStats.series.total_sold, seriesStats.series.total_quantity) }}</span>
              </div>
            </div>
<!--            <div class="absolute left-1 top-1 px-1.5 bg-primary rounded-lg text-[0.65rem] font-semibold italic z-30" :class="getMintClasses(seriesStats.series.total_quantity)">-->
<!--              <span class="relative">{{ Math.max(seriesStats.series.total_sold, seriesStats.series.total_quantity) }}</span>-->
<!--            </div>-->
            <!--            <ImgPlaceholder img-class="object-cover rounded-2xl" :key="item.image" :src="getTokenImage(seriesStats.series.image)" :alt="item.name" />-->
          </div>
          <!--          <template v-if="Capacitor.getPlatform() !== 'ios'">-->
          <!--            <div class="absolute top-0.5 right-0 w-4 h-4 rounded-full">-->
          <!--              <img src="/images/branding/rcax/rcaxIcon.svg" />-->
          <!--            </div>-->
          <!--          </template>-->
          <!--          <template v-if="ranking">-->
          <!--            <div class="absolute bottom-0 left-0 px-1 py-0.25 bg-amber-600 text-[0.7rem] font-medium rounded-tr-md drop-shadow">-->
          <!--              <h1 class="text-header rounded-md">#{{ ranking }}</h1>-->
          <!--            </div>-->
          <!--          </template>-->
          <!--          <div class="absolute top-0 left-0 px-1 py-0.25 bg-secondary text-[0.7rem] font-medium italic rounded-br-md shadow" :class="getMintClasses(seriesStats.series.total_quantity)">-->
          <!--            <span class="relative">{{ Math.max(seriesStats.series.total_sold, seriesStats.series.total_quantity) }}</span>-->
          <!--          </div>-->
        </button>
        <div class="relative pl-2 flex flex-col overflow-hidden grow">
          <div class="flex items-center gap-1 text-[0.7rem]">
            <button @click.stop="openLinkWith(marketplaceLink(seriesStats))" class="text-header font-semibold text-[0.8rem]" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ seriesStats.series.name }}</button>
<!--            <div class="relative bg-white/5 py-0.25 px-1 text-black text-[0.65rem] font-medium rounded italic" :class="getMintClasses(seriesStats.series.total_quantity)">-->
<!--              <span class="relative">{{ Math.max(seriesStats.series.total_sold, seriesStats.series.total_quantity) }}</span>-->
<!--            </div>-->
<!--            <div class="px-1.5 bg-primary rounded-lg text-[0.65rem] font-semibold italic z-30" :class="getMintClasses(seriesStats.series.total_quantity)">-->
<!--              <span class="relative">{{ Math.max(seriesStats.series.total_sold, seriesStats.series.total_quantity) }}</span>-->
<!--            </div>-->
            <template v-if="ranking">
              <h1 class="text-white/20 font-semibold rounded-md">#{{ ranking }}</h1>
            </template>
            <div class="ml-auto flex items-center gap-1 font-bold">
              <template v-if="watchList.has(seriesStats.collection.contract_address + seriesStats.series.name)">
                <div @click.stop="removeFromWatchList(seriesStats.series.contract_address + seriesStats.series.name)" class="flex items-center justify-center cursor-pointer">
                  <StarIcon class="w-5 h-5 text-yellow-500" />
                </div>
              </template>
              <template v-else>
                <div @click.stop="addToWatchList(seriesStats.collection.contract_address + seriesStats.series.name)" class="group flex items-center justify-center cursor-pointer">
                  <StarIconOutlined class="w-5 h-5 text-white/20 group-hover:text-yellow-500" />
                </div>
              </template>
            </div>
          </div>
          <div class="relative h-full flex flex-col justify-between">
            <slot></slot>
          </div>
          <div class="mt-auto flex items-center gap-1">
            <template v-if="!hideFloor && false">
              <template v-if="seriesStats.stats.lowest_listing">
                <button @click.stop="openLinkWith(`https://marketplace.rcax.io/asset/${seriesStats.stats.lowest_listing.token.contract_address}:${seriesStats.stats.lowest_listing.token.id}`)" class="flex items-center gap-0.5 text-[0.7rem]">
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
              <div class="text-[0.65rem] font-semibold" :class="{ 'text-green-500': seriesStats.series.total_sold < seriesStats.series.total_quantity, 'text-red-500': seriesStats.series.total_sold >= seriesStats.series.total_quantity }">
                <template v-if="seriesStats && seriesStats.series.mint_price > 0">
                  ${{ seriesStats.series.mint_price / 100.00 }}
                </template>
                <template v-else>
                  FREE
                </template>
              </div>
              <button @click.stop="openLinkWith(marketplaceLink(seriesStats, true))" class="text-white/40 hover:text-details text-[0.65rem] duration-200" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ seriesStats.collection.name.replace(" x Reddit Collectible Avatars", "") }}</button>
            </template>
            <div class="ml-auto px-0.5 py-0.25 text-[0.65rem] text-white/40" :key="getGeneration">{{ getGeneration }}</div>
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
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {marketplaceLink} from "~/global/marketplace";
import {getMintClasses} from "~/global/mint";

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

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

function selectAvatar() {
  hapticsImpactLight();

  selectedAvatar.value = {
    seriesStats: props.seriesStats,
    contract: props.seriesStats.series.contract_address,
    series: props.seriesStats.series.name
  }
}
</script>

<style scoped>

</style>
