<template>
  <div class="relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <MenuBar>
      <input v-model="searchTerm" placeholder="Search filter" class="p-2 rounded-md bg-neutral-800 text-sm border-none focus:outline-none max-w-sm">
      <select v-model="sortOption" class="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm border-none focus:outline-none max-w-sm overflow-x-hidden">
        <option value="highestPrice">Sort by Highest Price</option>
        <option value="lowestPrice">Sort by Lowest Price</option>
        <option value="highestLastSale">Sort by Highest Last Sale</option>
        <option value="lowestLastSale">Sort by Lowest Last Sale</option>
        <option value="fiveLastSales">Sort by Highest Last 5 Sales Average</option>
        <option value="highestSupply">Sort by Highest Supply</option>
        <option value="lowestSupply">Sort by Lowest Supply</option>
        <option value="highestMarketCap">Sort by Highest Market Cap</option>
        <option value="lowestMarketCap">Sort by Lowest Market Cap</option>
        <option value="highestDailyVolume">Sort by Highest Daily Volume</option>
        <option value="highestVolume">Sort by Highest Total Volume</option>
        <option value="lowestVolume">Sort by Lowest Total Volume</option>
        <option value="highestDailyChange">Sort by Today's Biggest Risers</option>
        <option value="lowestDailyChange">Sort by Today's Biggest Fallers</option>
        <option value="recentSale">Sort by Most Recent Sale</option>
        <option value="highestWeeklyAverage">Sort by Highest 7 Days Average Sale</option>
        <option value="highestTwoWeeklyAverage">Sort by Highest 14 Days Average Sale</option>
        <option value="highestMonthlyAverage">Sort by Highest 30 Days Average Sale</option>
        <option value="lowestWeeklyAverage">Sort by Lowest 7 Days Average Sale</option>
        <option value="lowestTwoWeeklyAverage">Sort by Lowest 14 Days Average Sale</option>
        <option value="lowestMonthlyAverage">Sort by Lowest 30 Days Average Sale</option>
        <option value="highestFloorMintRatio">Sort by Highest Mint Profit</option>
        <option value="lowestFloorMintRatio">Sort by Lowest Mint Profit</option>
        <option value="lowestListedPercentage">Sort by Lowest Listed Percentage</option>
        <option value="highestShopAvailableAbsolute">Sort by Most Available in Shop (Absolute)</option>
        <option value="lowestShopAvailableAbsolute">Sort by Least Available in Shop (Absolute)</option>
        <option value="highestShopAvailablePercentage">Sort by Most Available in Shop (Percentage)</option>
        <option value="lowestShopAvailablePercentage">Sort by Least Available in Shop (Percentage)</option>
        <option value="lowestShopNextMint">Sort by Lowest Next Mint Number in Shop</option>
        <option value="artistAsc">Sort by Artist (Ascending)</option>
        <option value="artistDesc">Sort by Artist (Descending)</option>
        <option value="nameAsc">Sort by Name (Ascending)</option>
        <option value="nameDesc">Sort by Name (Descending)</option>
      </select>
      <div
          @click.self="showFilters = !showFilters"
          class="relative px-4 py-2 flex flex-row flex-nowrap bg-neutral-800 hover:bg-neutral-700 text-white rounded-md duration-200 cursor-pointer">
        <button @click.prevent="showFilters = !showFilters" class="flex flex-row flex-nowrap" :class="{ 'text-amber-500': usingFilter() }">
          <AdjustmentsHorizontalIcon class="w-5 h-5" />
        </button>
        <template v-if="showFilters">
          <div class="absolute right-0 top-full mt-2 z-10 w-fit max-w-lg bg-neutral-900 border border-neutral-800 rounded-md shadow">
            <div class="p-4 flex flex-col gap-2" style="min-width: 192px">
              <input type="number" v-model="maxPriceEth" placeholder="Max price (ETH)" class="p-2 h-9 rounded-md bg-neutral-700 text-sm border-none focus:outline-none max-w-sm">
              <select v-model="filterGenOption" class="p-2 h-9 rounded-md border-transparent bg-neutral-700 text-sm focus:outline-none max-w-sm">
                <option value="all">Gen: All</option>
                <template v-for="gen in Object.keys(Filters)">
                  <option :value="gen">{{ gen }}</option>
                </template>
                <option value="new">new</option>
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
      <template v-if="!Capacitor.isNativePlatform()">
        <button @click="refresh()" :disabled="isRefreshing" class="p-2 whitespace-nowrap bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-white font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer" :class="{ 'loading': isRefreshing }">
          <ArrowPathIcon class="w-5 h-5" />
        </button>
      </template>
    </MenuBar>
    <template v-if="layout === 'table'">
      <div class="px-4 w-full overflow-x-auto rounded-lg">
        <table class="mt-3 w-full text-xs font-bold text-center whitespace-nowrap border-collapse">
          <thead>
          <tr class="border-b border-neutral-800 text-neutral-400">
            <th class="border border-neutral-800 pl-4 pr-2 py-3"></th>
            <th class="border border-neutral-800 text-left px-2 py-3 cursor-pointer">Name</th>
            <th class="border border-neutral-800 px-2 py-1 cursor-pointer">Supply</th>
            <th class="border border-neutral-800 px-2 py-1 cursor-pointer">Floor</th>
            <th class="border border-neutral-800 px-2 py-1 cursor-pointer">Last Sale</th>
            <th class="border border-neutral-800 px-2 py-1 cursor-pointer">Last 5 Sales</th>
            <th class="border border-neutral-800 px-2 py-1 cursor-pointer">Total Vol</th>
            <th class="border border-neutral-800 px-2 py-1 cursor-pointer">Vol (24h)</th>
            <th class="border border-neutral-800 px-2 py-1 cursor-pointer">Market Cap</th>
            <th class="border border-neutral-800 text-right px-2 py-1 cursor-pointer">Change (24h)</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(item, index) in slicedItems" :key="index">
            <tr class="hover:bg-neutral-900 text-neutral-200" :set="listing = getLowestListing(item)">
              <td class="border border-neutral-800 p-1 w-12">
                <div class="relative rounded-md overflow-hidden" style="padding-top: 100%">
                  <a @click="openLinkWith(`https://opensea.io/collection/${item.collection.slug}?search[query]=${item.series.name}`)" class="cursor-pointer">
                    <img :src="getTokenImage(item.series.image ?? '/img/rcax_placeholder.png')" :alt="item.series.name" class="absolute top-0 left-0 w-full h-full object-cover">
                  </a>
                </div>
              </td>
              <td class="border border-neutral-800 text-left px-2 py-1">{{ item.series.name }}</td>
              <td class="border border-neutral-800 px-2 py-1">{{ Math.max(item.series.total_quantity, item.series.total_sold) }}</td>
              <td class="border border-neutral-800 px-2 py-1">
                <template v-if="listing">
                  <div class="flex items-center justify-center gap-0.5">
                    <template v-if="listing.payment_token.symbol === 'ETH'">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="flex gap-1">
                        <span>{{ (listing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(6).replace(/\.?0+$/, '') }}</span>
                        <span class="text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(listing.payment_token.base_price) }}</span>)</span>
                        <span class="text-neutral-400">#{{ listing.token.mint_number }}</span>
                      </div>
                    </template>
                    <template v-else-if="listing.payment_token.symbol === 'MATIC'">
                      <div class="flex items-center text-orange-500">M</div>
                      <div class="flex gap-1">
                        <span>{{ (listing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
                        <span class="text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(getListingAsGweiPrice(listing)) }}</span>)</span>
                        <span class="text-neutral-400">#{{ listing.token.mint_number }}</span>
                      </div>
                    </template>
                  </div>
                </template>
              </td>
              <td class="border border-neutral-800 px-2 py-1">
                <template v-if="item.stats.last_sale">
                  <div class="flex flex-nowrap items-center justify-center gap-1 whitespace-nowrap overflow-hidden" :set="lastSale = item.stats.last_sale">
                    <div class="flex items-center gap-0.5">
                      <div class="flex items-center gap-0.5">
                        <template v-if="lastSale.payment_token.symbol === 'ETH'">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                        </template>
                        <template v-else>
                          <div class="flex items-center text-orange-500">M</div>
                        </template>
                        <div class="text-neutral-200">{{ (lastSale.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</div>
                      </div>
                    </div>
                    <span class="text-neutral-300">({{ ethereumInLocalCurrency(getSaleAsGweiPrice(lastSale)) }})</span>
                    <span class="text-neutral-400">#{{ lastSale.token.mint_number }}</span>
                    <div class="text-neutral-500" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(lastSale.date_sold)) }}</div>
                  </div>
                </template>
              </td>
              <td class="border border-neutral-800 px-2 py-1">
                <div class="flex items-center justify-center gap-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="flex gap-1">
                    <span>{{ (item.stats.eth.five_last_sales_average).toFixed(6).replace(/\.?0+$/, '') }}</span>
                    <span class="text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(item.stats.eth.five_last_sales_average * ETH_TO_GWEI_MODIFIER) }}</span>)</span>
                  </div>
                </div>
              </td>
              <td class="border border-neutral-800 px-2 py-1">
                <div class="flex items-center justify-center gap-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <span>{{ (item.stats.total_volume / ETH_TO_GWEI_MODIFIER).toFixed(2) }}</span>
                </div>
              </td>
              <td class="border border-neutral-800 px-2 py-1">
                <div class="flex items-center justify-center gap-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <span>{{ (item.stats.daily_volume).toFixed(2) }}</span>
                </div>
              </td>
              <td class="border border-neutral-800 px-2 py-1">
                <div class="flex items-center justify-center gap-0.5">
                  <span>{{ ethereumInLocalCurrency(item.stats.eth.last_sale ? (item.stats.eth.last_sale.payment_token.base_price * item.series.total_sold) : 0) }}</span>
                </div>
              </td>
              <td class="border border-neutral-800 px-2 py-1">
                <div class="flex items-center justify-end gap-0.5">
                  <template v-if="item.stats.daily_price_change > 0">
                    <div class="text-green-500">
                      <span>+{{ item.stats.daily_price_change.toFixed(2) }}%</span>
                    </div>
                  </template>
                  <template v-else-if="item.stats.daily_price_change < 0">
                    <div class="text-red-500">
                      <span>{{ item.stats.daily_price_change.toFixed(2) }}%</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-neutral-200">
                      <span>0%</span>
                    </div>
                  </template>
                </div>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
        <div class="py-6 flex justify-center">
          <Pagination :total-items="filteredAndSortedSeriesStats.length" :page-size="pageSize" v-model:current-page="itemsCurrentPage" />
        </div>
      </div>
    </template>
    <template v-else>
      <PullToRefresh @refresh="refresh" :is-refreshing="isRefreshing">
        <SeriesStatsComponent :items="filteredAndSortedSeriesStats" :sorting="sortOption" />
      </PullToRefresh>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  updateEthereumPrices,
  updateMarketInfo,
  updateSeriesStats,
  useEthereumUsdPrice,
  useSeriesStats,
  useWatchList
} from "~/composables/states";
import {SeriesStats} from "~/types/seriesStats";
import {computed, getSaleAsGweiPrice, ref, useRoute, useRouter} from "#imports";
import {ComputedRef, Ref, watch} from "vue";
import {ArrowPathIcon, AdjustmentsHorizontalIcon} from "@heroicons/vue/24/solid";
import MenuBar from "~/components/MenuBar.vue";
import {Capacitor} from "@capacitor/core";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {getLowestListing, getListingAsGweiPrice, maticToEth} from "~/composables/helpers";
import {getAllCollections, Filters} from "~/global/generations";
import {getTokenImage} from "~/global/utils";
import {openLinkWith} from "~/composables/states";
import {ethereumInLocalCurrency} from "#imports";

const router = useRouter();
const route = useRoute();
const seriesStats = useSeriesStats();
const watchList = useWatchList();
const ethereumPriceInUsd = useEthereumUsdPrice();

const searchTerm = ref<string>("");
const maxPriceEth = ref<number>(parseFloat(route.query.maxPrice as string) ?? undefined);
const filterGenOption = ref<string>(route.query.gen as string ?? "all");
const filterRarityOption = ref<string>(route.query.supply as string ?? "all");
const filterSoldOut = ref<string>(route.query.soldOut as string ?? "show");
const sortOption = ref<string>(route.query.sort as string ?? "highestPrice");
const isRefreshing = ref(false);
const showFilters = ref(false);
const layout = ref("grid");
const itemsCurrentPage = ref(1);
const pageSize = ref(100);

updateSeriesStats();

watch([maxPriceEth, filterGenOption, filterRarityOption, sortOption, filterSoldOut], () => {
  router.push({
    query: {
      maxPrice: maxPriceEth.value,
      gen: filterGenOption.value,
      supply: filterRarityOption.value,
      sort: sortOption.value,
      soldOut: filterSoldOut.value
    },
  });
})

const slicedItems = computed(() => {
  const start = (itemsCurrentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredAndSortedSeriesStats.value.slice(start, end);
});

function usingFilter(): boolean {
  return !!maxPriceEth.value || filterGenOption.value !== "all" || filterRarityOption.value !== "all" || filterSoldOut.value !== "show";
}

function clearFilters() {
  maxPriceEth.value = undefined;
  filterGenOption.value = "all";
  filterRarityOption.value = "all";
  filterSoldOut.value = "show";
}

function refresh() {
  isRefreshing.value = true;

  let promises = [];

  promises.push(updateSeriesStats());
  promises.push(updateMarketInfo());
  promises.push(updateEthereumPrices());

  Promise.all(promises).finally(() => {
    isRefreshing.value = false;
  })
}

const sortingOnShop = computed(() => {
  return sortOption.value === 'highestShopAvailableAbsolute' || sortOption.value === 'lowestShopAvailableAbsolute' || sortOption.value === 'highestShopAvailablePercentage' || sortOption.value === 'lowestShopAvailablePercentage' || sortOption.value === 'lowestShopNextMint';
});

const filteredAndSortedSeriesStats: ComputedRef<SeriesStats[]> = computed(() => {
  let filteredSeriesStats = Array.from(Object.values(seriesStats.value));

  if (route.params?.watchlist) {
    filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => watchList.value.has(seriesStat.series.name));
  }

  if (maxPriceEth.value) {
    filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => {
      const lowestListing = getLowestListing(seriesStat);

      let price = 0;

      if (!lowestListing) {
        price = 9999999999;
      } else if (lowestListing.payment_token.symbol === "ETH") {
        price = lowestListing.payment_token.base_price;
      } else if (lowestListing.payment_token.symbol === "MATIC") {
        price = maticToEth(lowestListing.payment_token.base_price);
      }

      return price <= maxPriceEth.value * ETH_TO_GWEI_MODIFIER;
    });
  }

  if (filterGenOption.value && filterGenOption.value != "all") {
    if (filterGenOption.value == "new") {
      filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => !getAllCollections().includes(seriesStat.collection.contract_address));
    } else {
      filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => Filters[filterGenOption.value].collections.includes(seriesStat.collection.contract_address));
    }
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
        const aBasePrice = getLowestListingAsGweiPrice(a);
        const bBasePrice = getLowestListingAsGweiPrice(b);

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
        const aBasePrice = getLowestListingAsGweiPrice(a);
        const bBasePrice = getLowestListingAsGweiPrice(b);

        if (aBasePrice > bBasePrice) {
          return 1;
        } else if (aBasePrice < bBasePrice) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "highestSupply":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aValue = Math.max(a.series.total_sold, a.series.total_quantity);
        const bValue = Math.max(b.series.total_sold, b.series.total_quantity);

        if (aValue > bValue) {
          return -1;
        } else if (aValue < bValue) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestSupply":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aValue = Math.max(a.series.total_sold, a.series.total_quantity);
        const bValue = Math.max(b.series.total_sold, b.series.total_quantity);

        if (aValue > bValue) {
          return 1;
        } else if (aValue < bValue) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "highestLastSale":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.last_sale ? getSaleAsGweiPrice(a.stats.last_sale) : 0;
        const bBasePrice = b.stats.last_sale ? getSaleAsGweiPrice(b.stats.last_sale) : 0;


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
        const aBasePrice = a.stats.last_sale ? getSaleAsGweiPrice(a.stats.last_sale) : 0;
        const bBasePrice = b.stats.last_sale ? getSaleAsGweiPrice(b.stats.last_sale) : 0;

        if (aBasePrice > bBasePrice) {
          return 1;
        } else if (aBasePrice < bBasePrice) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "highestFloorMintRatio":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aFloorMintRatio = getLowestListing(a) ? Math.round(((getLowestListingAsGweiPrice(a) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd.value) / (a.series.mint_price / 100) * 100) : 999999999;
        const bFloorMintRatio = getLowestListing(b) ? Math.round(((getLowestListingAsGweiPrice(b) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd.value) / (b.series.mint_price / 100) * 100) : 999999999;

        if (aFloorMintRatio > bFloorMintRatio) {
          return -1;
        } else if (aFloorMintRatio < bFloorMintRatio) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestFloorMintRatio":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aFloorMintRatio = getLowestListing(a) ? Math.round(((getLowestListingAsGweiPrice(a) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd.value) / (a.series.mint_price / 100) * 100) : 999999999;
        const bFloorMintRatio = getLowestListing(b) ? Math.round(((getLowestListingAsGweiPrice(b) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd.value) / (b.series.mint_price / 100) * 100) : 999999999;

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
        const aMarketCap = a.stats.last_sale ? (a.series.total_sold * getSaleAsGweiPrice(a.stats.last_sale)) : 0;
        const bMarketCap = b.stats.last_sale ? (b.series.total_sold * getSaleAsGweiPrice(b.stats.last_sale)) : 0;

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
        const aMarketCap = a.stats.last_sale ? (a.series.total_sold * getSaleAsGweiPrice(a.stats.last_sale)) : 0;
        const bMarketCap = b.stats.last_sale ? (b.series.total_sold * getSaleAsGweiPrice(b.stats.last_sale)) : 0;

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
        const aBaseDate = new Date(a.stats.last_sale?.date_sold ?? 0);
        const bBaseDate = new Date(b.stats.last_sale?.date_sold ?? 0);

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
    case "artistAsc":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aValue = a.collection.artist.displayName;
        const bValue = b.collection.artist.displayName;

        if (aValue > bValue) {
          return 1;
        } else if (aValue < bValue) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "artistDesc":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aValue = a.collection.artist.displayName;
        const bValue = b.collection.artist.displayName;

        if (aValue > bValue) {
          return -1;
        } else if (aValue < bValue) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "nameAsc":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aValue = a.series.name.toLowerCase();
        const bValue = b.series.name.toLowerCase();

        if (aValue > bValue) {
          return 1;
        } else if (aValue < bValue) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "nameDesc":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aValue = a.series.name.toLowerCase();
        const bValue = b.series.name.toLowerCase();

        if (aValue > bValue) {
          return -1;
        } else if (aValue < bValue) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
  }

  return sortedSeriesStats;
});
</script>

<style scoped>

</style>
