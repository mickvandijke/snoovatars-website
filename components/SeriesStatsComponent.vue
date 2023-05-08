<template>
  <div class="overflow-x-hidden overflow-y-auto w-full" :class="containerClasses" :style="{ 'max-height': containerMaxHeight }" ref="container" @scroll="handleScroll">
    <div class="mt-1 lg:mt-0 px-2 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1">
      <template v-for="(item, index) in visibleItems">
        <AvatarCard :item="{ name: item.series.name, contract_address: item.series.contract_address, image: item.series.image }" :series-stats="item" hide-floor>
          <div class="flex items-center gap-1 text-[0.7rem]">
            <h1 class="text-neutral-500 font-bold rounded-md">#{{ index + 1 }}</h1>
            <a :href="`https://opensea.io/collection/${item.collection.slug}?search[query]=${item.series.name}`" target="_blank" class="text-white font-bold text-[0.8rem]" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.series.name }}</a>
            <div class="ml-auto flex items-center gap-1 font-bold">
              <div class="flex items-center gap-1 font-bold overflow-hidden">
                <div class="text-neutral-400">24h:</div>
                <template v-if="item.stats.daily_price_change > 0">
                  <div class="flex gap-0.5 items-center text-green-500">
                    <ArrowTrendingUpIcon class="w-4 h-4" />
                    <span>{{ item.stats.daily_price_change.toFixed(2) }}%</span>
                  </div>
                </template>
                <template v-else-if="item.stats.daily_price_change < 0">
                  <div class="flex gap-0.5 items-center text-red-500">
                    <ArrowTrendingDownIcon class="w-4 h-4" />
                    <span>{{ item.stats.daily_price_change.toFixed(2) }}%</span>
                  </div>
                </template>
                <template v-else>
                  <div class="flex gap-0.5 items-center text-neutral-200">
                    <span>0%</span>
                  </div>
                </template>
              </div>
              <template v-if="watchList.has(item.series.name)">
                <div @click.stop="removeFromWatchList(item.series.name)" class="flex items-center justify-center cursor-pointer">
                  <StarIcon class="w-5 h-5 text-yellow-500" />
                </div>
              </template>
              <template v-else>
                <div @click.stop="addToWatchList(item.series.name)" class="flex items-center justify-center cursor-pointer">
                  <StarIcon class="w-5 h-5 text-neutral-500 hover:text-yellow-500/50" />
                </div>
              </template>
            </div>
          </div>
          <div class="flex font-bold text-[0.7rem]">
            <template v-if="item.stats.last_sale">
              <div class="flex flex-nowrap items-center gap-1 overflow-hidden">
                <div class="flex items-center gap-0.5">
                  <template v-if="item.stats.last_sale?.payment_token.symbol === 'ETH'">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  </template>
                  <template v-else>
                    <div class="flex items-center w-3 h-3 text-orange-500">M</div>
                  </template>
                  <div class="text-neutral-200">{{ (item.stats.last_sale?.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                </div>
                <span class="text-neutral-300">({{ ethereumInLocalCurrency(item.stats.last_sale?.payment_token.base_price) }})</span>
                <span class="text-neutral-500">#{{ item.stats.last_sale.token.mint_number }}</span>
                <div class="text-neutral-400" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(item.stats.last_sale?.date_sold)) }}</div>
              </div>
            </template>
            <div class="ml-auto flex items-center">
              <div class="text-neutral-400">7D:</div>
              <div class="pl-0.5 flex gap-0.5 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                <div class="text-neutral-200">{{ (item.stats.weekly_average_price ?? 0).toFixed(4).replace(/\.?0+$/, '') }}</div>
              </div>
            </div>
          </div>
          <div class="flex gap-2 font-medium text-[0.8rem] items-center">
            <template v-if="item.stats.lowest_listing">
              <div class="flex flex-col">
                <div class="flex items-center gap-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="flex gap-1 font-bold text-white">
                    <span>{{ (item.stats.lowest_listing?.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</span>
                    <span class="text-neutral-300">({{ ethereumInLocalCurrency(item.stats.lowest_listing?.payment_token.base_price) }})</span>
                    <span class="text-amber-500">#{{ item.stats.lowest_listing.token.mint_number }}</span>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="item.stats.lowest_listing">
              <div class="ml-auto flex items-center gap-1 font-bold text-[0.7rem] overflow-hidden">
                <div class="flex items-center gap-1 font-bold overflow-hidden">
                  <div class="text-neutral-400">F/M:</div>
                  <div class="flex items-center">
                    <div class="text-neutral-200">{{ Math.round(((item.stats.lowest_listing?.payment_token.base_price / 1000000000000000000) * ethereumPriceInUsd) / (item.series.mint_price / 100) * 100) }}%</div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </AvatarCard>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {SeriesStats} from "~/types/seriesStats";
import {PropType} from "@vue/runtime-core";
import {useWatchList, addToWatchList, removeFromWatchList, useEthereumUsdPrice} from "~/composables/states";
import {StarIcon} from "@heroicons/vue/24/solid";
import {ArrowTrendingUpIcon, ArrowTrendingDownIcon} from "@heroicons/vue/20/solid";
import {computed, ethereumInLocalCurrency, ref, watchEffect} from "#imports";

const watchList = useWatchList();
const ethereumPriceInUsd = useEthereumUsdPrice();

const props = defineProps({
  items: Array as PropType<SeriesStats[]>
});

const loadThreshold = computed(() => {
  return window.innerHeight / 2;
});

const buffer = computed(() => {
  if (window?.innerWidth < 800) {
    return 24;
  }

  return 60;
});

const container = ref<HTMLInputElement | null>(null);
const visibleItems = ref<SeriesStats[]>([]);
const loadingMore = ref(false);

const containerClasses = computed(() => {
  if (visibleItems.value.length < buffer.value) {
    return ['max-h-fit'];
  }

  return ['h-screen'];
});

const containerMaxHeight = computed(() => {
  let maxHeight = "100%";

  if (window) {
    if (window.innerWidth < 800) {
      maxHeight = window.innerHeight - 176 + "px";
    } else {
      maxHeight = window.innerHeight - 353 + "px";
    }
  }

  return maxHeight;
});

function handleScroll() {
  const containerHeight = container.value.offsetHeight;
  const contentHeight = container.value.scrollHeight;
  const position = container.value.scrollTop;

  if (contentHeight - (position + containerHeight) < loadThreshold.value) {
    loadMoreItems();
  }
}

const loadMoreItems = () => {
  if (loadingMore.value) {
    return;
  }

  loadingMore.value = true;

  const startIndex = visibleItems.value.length;
  const endIndex = startIndex + buffer.value;

  visibleItems.value = visibleItems.value.concat(props.items.slice(startIndex, endIndex));
  loadingMore.value = false;
};

watchEffect(() => {
  visibleItems.value = props.items.slice(0, buffer.value);
});
</script>

<style scoped>

</style>
