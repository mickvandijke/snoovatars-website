<template>
  <div class="relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <MenuBar>
      <input v-model="searchTerm" placeholder="Filter by search" class="p-2 rounded-md border border-neutral-600/50 bg-neutral-700/50 text-sm focus:outline-none max-w-sm">
      <select v-model="sortOption" class="p-2 rounded-md border-transparent bg-neutral-700 text-sm focus:outline-none max-w-sm">
        <option value="highestPrice">Sort by Highest Price</option>
        <option value="lowestPrice">Sort by Lowest Price</option>
        <option value="highestLastSale">Sort by Highest Last Sale</option>
        <option value="lowestLastSale">Sort by Lowest Last Sale</option>
        <option value="highestMarketCap">Sort by Highest Market Cap</option>
        <option value="lowestMarketCap">Sort by Lowest Market Cap</option>
        <option value="highestDailyVolume">Sort by Highest Daily Volume</option>
        <option value="highestVolume">Sort by Highest Total Volume</option>
        <option value="lowestVolume">Sort by Lowest Total Volume</option>
        <option value="highestDailyChange">Sort by Today's Biggest Risers</option>
        <option value="lowestDailyChange">Sort by Today's Biggest Fallers</option>
        <option value="recentSale">Sort by Most Recent Sale</option>
        <option value="fiveLastSales">Sort by Highest 5 Last Sales Average</option>
        <option value="highestWeeklyAverage">Sort by Highest 7 Days Average Sale</option>
        <option value="highestTwoWeeklyAverage">Sort by Highest 14 Days Average Sale</option>
        <option value="highestMonthlyAverage">Sort by Highest 30 Days Average Sale</option>
        <option value="lowestWeeklyAverage">Sort by Lowest 7 Days Average Sale</option>
        <option value="lowestTwoWeeklyAverage">Sort by Lowest 14 Days Average Sale</option>
        <option value="lowestMonthlyAverage">Sort by Lowest 30 Days Average Sale</option>
        <option value="lowestFloorMintRatio">Sort by Lowest Floor/Mint Ratio</option>
        <option value="lowestListedPercentage">Sort by Lowest Listed Percentage</option>
        <option value="highestShopAvailableAbsolute">Sort by Most Available in Shop (Absolute)</option>
        <option value="lowestShopAvailableAbsolute">Sort by Least Available in Shop (Absolute)</option>
        <option value="highestShopAvailablePercentage">Sort by Most Available in Shop (Percentage)</option>
        <option value="lowestShopAvailablePercentage">Sort by Least Available in Shop (Percentage)</option>
        <option value="lowestShopNextMint">Sort by Lowest Next Mint Number in Shop</option>
        <option value="lowestShopAvailablePercentage">test</option>
      </select>
      <div
          @click.self="showFilters = !showFilters"
          class="relative px-4 py-2 flex flex-row flex-nowrap bg-neutral-700 hover:bg-neutral-600 text-white rounded-md duration-200 cursor-pointer">
        <button @click.prevent="showFilters = !showFilters" class="flex flex-row flex-nowrap" :class="{ 'text-amber-500': usingFilter() }">
          <AdjustmentsHorizontalIcon class="w-5 h-5" />
        </button>
        <template v-if="showFilters">
          <div class="absolute right-0 top-full mt-2 z-10 w-fit max-w-lg bg-neutral-800 border border-neutral-700 rounded-md shadow">
            <div class="p-4 flex flex-col gap-2" style="min-width: 192px">
              <select v-model="filterGenOption" class="p-2 h-9 rounded-md border-transparent bg-neutral-700 text-sm focus:outline-none max-w-sm">
                <option value="all">Gen: All</option>
                <option value="gen1">Gen 1</option>
                <option value="gen2">Gen 2</option>
                <option value="gen3">Gen 3</option>
                <option value="wsb">WSB</option>
              </select>
              <select v-model="filterRarityOption" class="p-2 h-9 rounded-md border-transparent bg-neutral-700 text-sm focus:outline-none max-w-sm">
                <option value="all">Supply: All</option>
                <option value="250">Supply: Max 250</option>
                <option value="777">Supply: Max 777</option>
                <option value="1000">Supply: Max 1000</option>
              </select>
              <select v-model="filterSoldOut" class="p-2 h-9 rounded-md border-transparent bg-neutral-700 text-sm focus:outline-none max-w-sm">
                <option value="show">Sold Out: Show</option>
                <option value="hide">Sold Out: Hide</option>
              </select>
              <template v-if="usingFilter()">
                <button @click="clearFilters()" class="p-2 bg-amber-500/20 text-amber-500 text-sm rounded-md">Clear All</button>
              </template>
            </div>
          </div>
        </template>
      </div>
      <button @click="refresh()" :disabled="isRefreshing" class="p-2 whitespace-nowrap bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-white font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer" :class="{ 'loading': isRefreshing }">
        <ArrowPathIcon class="w-5 h-5" />
      </button>
    </MenuBar>
    <SeriesStatsComponent :items="filteredAndSortedSeriesStats()" :sorting="sortOption" />
  </div>
</template>

<script setup lang="ts">
import {updateSeriesStats, useEthereumUsdPrice, useSeriesStats, useWatchList} from "~/composables/states";
import {SeriesStats} from "~/types/seriesStats";
import {computed, ref, useRoute, useRouter} from "#imports";
import {watch} from "vue";
import {ArrowPathIcon, AdjustmentsHorizontalIcon} from "@heroicons/vue/24/solid";
import MenuBar from "~/components/MenuBar.vue";

const router = useRouter();
const route = useRoute();
const seriesStats = useSeriesStats();
const watchList = useWatchList();
const ethereumPriceInUsd = useEthereumUsdPrice();

const searchTerm = ref<string>("");
const filterGenOption = ref<string>(route.query.gen as string ?? "all");
const filterRarityOption = ref<string>(route.query.supply as string ?? "all");
const filterSoldOut = ref<string>(route.query.soldOut as string ?? "show");
const sortOption = ref<string>(route.query.sort as string ?? "highestPrice");
const isRefreshing = ref(false);
const showFilters = ref(false);

updateSeriesStats();

watch([filterGenOption, filterRarityOption, sortOption, filterSoldOut], () => {
  router.push({
    query: {
      gen: filterGenOption.value,
      supply: filterRarityOption.value,
      sort: sortOption.value,
      soldOut: filterSoldOut.value
    },
  });
})

function usingFilter(): boolean {
  return filterGenOption.value !== "all" || filterRarityOption.value !== "all" || filterSoldOut.value !== "show";
}

function clearFilters() {
  filterGenOption.value = "all";
  filterRarityOption.value = "all";
  filterSoldOut.value = "show";
}

function refresh() {
  isRefreshing.value = true;

  let promises = [];

  promises.push(updateSeriesStats());

  Promise.all(promises).finally(() => {
    isRefreshing.value = false;
  })
}

const sortingOnShop = computed(() => {
  return sortOption.value === 'highestShopAvailableAbsolute' || sortOption.value === 'lowestShopAvailableAbsolute' || sortOption.value === 'highestShopAvailablePercentage' || sortOption.value === 'lowestShopAvailablePercentage' || sortOption.value === 'lowestShopNextMint';
});

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

  switch (filterRarityOption.value) {
    case "250":
      filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => seriesStat.series.total_quantity <= 250);
      break;
    case "777":
      filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => seriesStat.series.total_quantity <= 777);
      break;
    case "1000":
      filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => seriesStat.series.total_quantity <= 1000);
      break;
  }

  if (filterSoldOut.value === "hide" || sortingOnShop.value) {
    filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => seriesStat.series.total_sold < seriesStat.series.total_quantity);
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
    case "highestDailyVolume":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aVolume = a.stats.daily_volume;
        const bVolume = b.stats.daily_volume;

        if (aVolume > bVolume) {
          return -1;
        } else if (aVolume < bVolume) {
          return 1;
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
    case "fiveLastSales":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.five_last_sales_average;
        const bBasePrice = b.stats.five_last_sales_average;

        if (aBasePrice > bBasePrice) {
          return -1;
        } else if (aBasePrice < bBasePrice) {
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
    case "lowestListedPercentage":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.listed_percentage;
        const bBasePrice = b.stats.listed_percentage;

        if (aBasePrice > bBasePrice) {
          return 1;
        } else if (aBasePrice < bBasePrice) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "highestShopAvailableAbsolute":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aValue = a.series.total_quantity - a.series.total_sold;
        const bValue = b.series.total_quantity - b.series.total_sold;

        if (aValue > bValue) {
          return -1;
        } else if (aValue < bValue) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestShopAvailableAbsolute":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aValue = a.series.total_quantity - a.series.total_sold;
        const bValue = b.series.total_quantity - b.series.total_sold;

        if (aValue > bValue) {
          return 1;
        } else if (aValue < bValue) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "highestShopAvailablePercentage":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aValue = a.series.total_sold / a.series.total_quantity;
        const bValue = b.series.total_sold / b.series.total_quantity;

        if (aValue > bValue) {
          return 1;
        } else if (aValue < bValue) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestShopAvailablePercentage":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aValue = a.series.total_sold / a.series.total_quantity;
        const bValue = b.series.total_sold / b.series.total_quantity;

        if (aValue > bValue) {
          return -1;
        } else if (aValue < bValue) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestShopNextMint":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aValue = a.series.total_quantity - (a.series.total_quantity - a.series.total_sold) + 1;
        const bValue = b.series.total_quantity - (b.series.total_quantity - b.series.total_sold) + 1;

        if (aValue > bValue) {
          return 1;
        } else if (aValue < bValue) {
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
