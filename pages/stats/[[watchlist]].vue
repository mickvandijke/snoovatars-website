<template>
  <div class="relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <div class="px-2 py-2 sticky top-[56px] lg:top-0 lg:relative flex justify-center gap-2 bg-neutral-800/90 backdrop-blur-lg lg:bg-transparent z-10 w-full overflow-x-hidden drop-shadow-lg">
      <input v-model="searchTerm" placeholder="Filter by search" class="p-2 rounded-md border border-neutral-600/50 bg-neutral-700/50 text-sm focus:outline-none max-w-sm">
      <select v-model="filterGenOption" class="p-2 rounded-md border border-neutral-600 bg-neutral-700 text-sm focus:outline-none max-w-sm">
        <option value="all">Gen: All</option>
        <option value="gen1">Gen 1</option>
        <option value="gen2">Gen 2</option>
        <option value="gen3">Gen 3</option>
        <option value="wsb">WSB</option>
      </select>
      <select v-model="sortOption" class="p-2 rounded-md border border-neutral-600 bg-neutral-700 text-sm focus:outline-none max-w-sm">
        <option value="highestPrice">Sort by Highest Price</option>
        <option value="lowestPrice">Sort by Lowest Price</option>
        <option value="highestLastSale">Sort by Highest Last Sale</option>
        <option value="lowestLastSale">Sort by Lowest Last Sale</option>
        <option value="highestMarketCap">Sort by Highest Market Cap</option>
        <option value="lowestMarketCap">Sort by Lowest Market Cap</option>
        <option value="highestVolume">Sort by Highest Volume</option>
        <option value="lowestVolume">Sort by Lowest Volume</option>
        <option value="highestDailyChange">Sort by Today's Biggest Risers</option>
        <option value="lowestDailyChange">Sort by Today's Biggest Fallers</option>
        <option value="recentSale">Sort by Most Recent Sale</option>
        <option value="highestWeeklyAverage">Sort by Highest 7 Days Average Price</option>
        <option value="highestTwoWeeklyAverage">Sort by Highest 14 Days Average Price</option>
        <option value="highestMonthlyAverage">Sort by Highest 30 Days Average Price</option>
        <option value="lowestWeeklyAverage">Sort by Lowest 7 Days Average Price</option>
        <option value="lowestTwoWeeklyAverage">Sort by Lowest 14 Days Average Price</option>
        <option value="lowestMonthlyAverage">Sort by Lowest 30 Days Average Price</option>
        <option value="lowestFloorMintRatio">Sort by Lowest Floor/Mint Ratio</option>
      </select>
      <button @click="refresh()" :disabled="isRefreshing" class="p-2 whitespace-nowrap bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-white font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer" :class="{ 'loading': isRefreshing }">
        <ArrowPathIcon class="w-5 h-5" />
      </button>
    </div>
    <SeriesStatsComponent :items="filteredAndSortedSeriesStats()" class="mt-1 lg:mt-0 px-2 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1" />
  </div>
</template>

<script setup lang="ts">
import {updateSeriesStats, useEthereumUsdPrice, useSeriesStats, useWatchList} from "~/composables/states";
import {SeriesStats} from "~/types/seriesStats";
import {ref, useRoute, useRouter} from "#imports";
import {watch} from "vue";
import {ArrowPathIcon} from "@heroicons/vue/24/solid";

const router = useRouter();
const route = useRoute();
const seriesStats = useSeriesStats();
const watchList = useWatchList();
const ethereumPriceInUsd = useEthereumUsdPrice();

const searchTerm = ref<string>("");
const filterGenOption = ref<string>(route.query.gen as string ?? "all");
const sortOption = ref<string>(route.query.sort as string ?? "highestPrice");
const isRefreshing = ref(false);

updateSeriesStats();

watch([filterGenOption, sortOption], () => {
  router.push({
    query: {
      gen: filterGenOption.value,
      sort: sortOption.value
    },
  });
})

function refresh() {
  isRefreshing.value = true;

  let promises = [];

  promises.push(updateSeriesStats());

  Promise.all(promises).finally(() => {
    isRefreshing.value = false;
  })
}

function filteredAndSortedSeriesStats(): SeriesStats[] {
  let filteredSeriesStats = Array.from(Object.values(seriesStats.value));

  if (route.params?.watchlist) {
    filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => watchList.value.has(seriesStat.series.name));
  }

  switch (filterGenOption.value) {
    case "gen1":
      filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => !seriesStat.collection.name.includes("Future") && !seriesStat.collection.name.includes("Spooky") && !seriesStat.collection.name.includes("Memetic") && !seriesStat.collection.name.includes("Fiesta Dog"));
      break;
    case "gen2":
      filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => seriesStat.collection.name.includes("Spooky Season"));
      break;
    case "gen3":
      filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => seriesStat.collection.name.includes("Future Realities") || seriesStat.collection.name.includes("Fiesta Dog"));
      break;
    case "wsb":
      filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => seriesStat.collection.name.includes("Memetic Traders"));
      break;
  }

  if (searchTerm.value.trim() !== "") {
    filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => (
        seriesStat.series.name.toLowerCase() +
        seriesStat.collection.name.toLowerCase() +
        seriesStat.series.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")
    ).includes(searchTerm.value.toLowerCase()));
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
        const aFloorMintRatio = a.stats.lowest_listing ? Math.round(((a.stats.lowest_listing?.payment_token.base_price / 1000000000000000000) * ethereumPriceInUsd.value) / (a.series.mint_price / 100) * 100) : 999999999;
        const bFloorMintRatio = b.stats.lowest_listing ? Math.round(((b.stats.lowest_listing?.payment_token.base_price / 1000000000000000000) * ethereumPriceInUsd.value) / (b.series.mint_price / 100) * 100) : 999999999;

        if (aFloorMintRatio > bFloorMintRatio) {
          return 1;
        } else if (aFloorMintRatio < bFloorMintRatio) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "highestMarketCap":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aMarketCap = a.stats.lowest_listing ? (a.series.total_sold * a.stats.lowest_listing?.payment_token.base_price) : 0;
        const bMarketCap = b.stats.lowest_listing ? (b.series.total_sold * b.stats.lowest_listing?.payment_token.base_price) : 0;

        if (aMarketCap > bMarketCap) {
          return -1;
        } else if (aMarketCap < bMarketCap) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestMarketCap":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aMarketCap = a.stats.lowest_listing ? (a.series.total_sold * a.stats.lowest_listing?.payment_token.base_price) : 0;
        const bMarketCap = b.stats.lowest_listing ? (b.series.total_sold * b.stats.lowest_listing?.payment_token.base_price) : 0;

        if (aMarketCap > bMarketCap) {
          return 1;
        } else if (aMarketCap < bMarketCap) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "highestVolume":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aVolume = a.stats.total_volume;
        const bVolume = b.stats.total_volume;

        if (aVolume > bVolume) {
          return -1;
        } else if (aVolume < bVolume) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestVolume":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aVolume = a.stats.total_volume;
        const bVolume = b.stats.total_volume;

        if (aVolume > bVolume) {
          return 1;
        } else if (aVolume < bVolume) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "highestDailyChange":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aDailyChange = a.stats.daily_price_change;
        const bDailyChange = b.stats.daily_price_change;

        if (aDailyChange > bDailyChange) {
          return -1;
        } else if (aDailyChange < bDailyChange) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestDailyChange":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aDailyChange = a.stats.daily_price_change;
        const bDailyChange = b.stats.daily_price_change;

        if (aDailyChange > bDailyChange) {
          return 1;
        } else if (aDailyChange < bDailyChange) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "recentSale":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBaseDate = a.stats.last_sale?.date_sold;
        const bBaseDate = b.stats.last_sale?.date_sold;

        if (aBaseDate > bBaseDate) {
          return -1;
        } else if (aBaseDate < bBaseDate) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "highestWeeklyAverage":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.weekly_average_price ?? 0;
        const bBasePrice = b.stats.weekly_average_price ?? 0;

        if (aBasePrice > bBasePrice) {
          return -1;
        } else if (aBasePrice < bBasePrice) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "highestTwoWeeklyAverage":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.two_weekly_average_price ?? 0;
        const bBasePrice = b.stats.two_weekly_average_price ?? 0;

        if (aBasePrice > bBasePrice) {
          return -1;
        } else if (aBasePrice < bBasePrice) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "highestMonthlyAverage":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.monthly_average_price ?? 0;
        const bBasePrice = b.stats.monthly_average_price ?? 0;

        if (aBasePrice > bBasePrice) {
          return -1;
        } else if (aBasePrice < bBasePrice) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestWeeklyAverage":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.weekly_average_price ?? 0;
        const bBasePrice = b.stats.weekly_average_price ?? 0;

        if (aBasePrice > bBasePrice) {
          return 1;
        } else if (aBasePrice < bBasePrice) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestTwoWeeklyAverage":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.two_weekly_average_price ?? 0;
        const bBasePrice = b.stats.two_weekly_average_price ?? 0;

        if (aBasePrice > bBasePrice) {
          return 1;
        } else if (aBasePrice < bBasePrice) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestMonthlyAverage":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.monthly_average_price ?? 0;
        const bBasePrice = b.stats.monthly_average_price ?? 0;

        if (aBasePrice > bBasePrice) {
          return 1;
        } else if (aBasePrice < bBasePrice) {
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
