<template>
  <div class="relative flex flex-col items-center w-full">
    <div class="px-2 py-2 sticky top-[56px] lg:top-0 lg:relative flex gap-2 bg-neutral-900/90 backdrop-blur-lg lg:bg-transparent z-10 w-full">
      <input v-model="searchTerm" placeholder="Search name" class="p-2 rounded-md border border-neutral-600/50 bg-neutral-700/50 text-sm focus:outline-none max-w-sm">
      <select v-model="sortOption" class="p-2 rounded-md border border-neutral-600 bg-neutral-700 text-sm focus:outline-none max-w-sm">
        <option value="highestPrice">Sort by Highest Price</option>
        <option value="lowestPrice">Sort by Lowest Price</option>
        <option value="highestLastSale">Sort by Highest Last Sale</option>
        <option value="lowestLastSale">Sort by Lowest Last Sale</option>
        <option value="lowestFloorMintRatio">Sort by Lowest Floor/Mint Ratio</option>
      </select>
    </div>
    <SeriesStatsComponent :items="filteredAndSortedSeriesStats()" class="mt-1 lg:mt-0 px-2 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1" />
  </div>
</template>

<script setup lang="ts">
import {updateSeriesStats, useEthereumUsdPrice, useSeriesStats, useWatchList} from "~/composables/states";
import {SeriesStats} from "~/types/seriesStats";
import {ref} from "#imports";

const seriesStats = useSeriesStats();
const ethereumPriceUsd = useEthereumUsdPrice();
const watchList = useWatchList();

const searchTerm = ref<string>("");
const sortOption = ref<string>("highestPrice");

await updateSeriesStats();

function filteredAndSortedSeriesStats(): SeriesStats[] {
  let filteredSeriesStats = Array.from(Object.values(seriesStats.value));

  filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => watchList.value.has(seriesStat.series.name));

  if (searchTerm.value.trim() !== "") {
    filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => seriesStat.series.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
  }

  let sortedSeriesStats = [];

  switch (sortOption.value) {
    case "highestPrice":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.lowest_listing && a.stats.lowest_listing.payment_token.symbol === "ETH" ? a.stats.lowest_listing.payment_token.base_price : 0;
        const bBasePrice = b.stats.lowest_listing && b.stats.lowest_listing.payment_token.symbol === "ETH" ? b.stats.lowest_listing.payment_token.base_price : 0;

        if (aBasePrice > bBasePrice) {
          return -1;
        } else if (aBasePrice < bBasePrice) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestPrice":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.lowest_listing && a.stats.lowest_listing.payment_token.symbol === "ETH" ? a.stats.lowest_listing.payment_token.base_price : 0;
        const bBasePrice = b.stats.lowest_listing && b.stats.lowest_listing.payment_token.symbol === "ETH" ? b.stats.lowest_listing.payment_token.base_price : 0;

        if (aBasePrice > bBasePrice) {
          return 1;
        } else if (aBasePrice < bBasePrice) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "highestLastSale":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.last_sale && a.stats.last_sale.payment_token.symbol === "ETH" ? a.stats.last_sale.payment_token.base_price : 0;
        const bBasePrice = b.stats.last_sale && b.stats.last_sale.payment_token.symbol === "ETH" ? b.stats.last_sale.payment_token.base_price : 0;


        if (aBasePrice > bBasePrice) {
          return -1;
        } else if (aBasePrice < bBasePrice) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestLastSale":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.last_sale && a.stats.last_sale.payment_token.symbol === "ETH" ? a.stats.last_sale.payment_token.base_price : 0;
        const bBasePrice = b.stats.last_sale && b.stats.last_sale.payment_token.symbol === "ETH" ? b.stats.last_sale.payment_token.base_price : 0;

        if (aBasePrice > bBasePrice) {
          return 1;
        } else if (aBasePrice < bBasePrice) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestFloorMintRatio":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aFloorMintRatio = a.stats.lowest_listing ? Math.round(((a.stats.lowest_listing?.payment_token.base_price / 1000000000000000000) * ethereumPriceUsd.value) / (a.series.mint_price / 100) * 100) : 999999999;
        const bFloorMintRatio = b.stats.lowest_listing ? Math.round(((b.stats.lowest_listing?.payment_token.base_price / 1000000000000000000) * ethereumPriceUsd.value) / (b.series.mint_price / 100) * 100) : 999999999;

        if (aFloorMintRatio > bFloorMintRatio) {
          return 1;
        } else if (aFloorMintRatio < bFloorMintRatio) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
  }

  return sortedSeriesStats;
}
</script>

<style scoped>

</style>
