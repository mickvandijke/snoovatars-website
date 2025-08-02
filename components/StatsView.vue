<template>
  <div class="stats-view relative flex flex-col items-center w-full">
    <MenuBar>
      <SearchBar v-model:search-term="searchTerm" :placeholder="`Search by Name, Artist or Collection`" />
      <FilterMenuButton :using-filter="usingFilter">
        <input type="number" v-model="maxPriceEth" placeholder="Max price (ETH)">
        <select v-model="filterGenOption" class="uniform-select">
          <option value="all">Gen: All</option>
          <template v-for="gen in Object.keys(Filters)">
            <option :value="gen">{{ gen }}</option>
          </template>
          <option value="new">new</option>
        </select>
        <select v-model="filterArtistOption" class="uniform-select">
          <option value="all">Artist: All</option>
          <template v-for="artist in artists">
            <option :value="artist">{{ artist }}</option>
          </template>
        </select>
        <select v-model="filterRarityOption" class="uniform-select">
          <option value="all">Supply: All</option>
          <option value="250">Supply: Max 250</option>
          <option value="777">Supply: Max 777</option>
          <option value="1000">Supply: Max 1000</option>
        </select>
        <select v-model="filterSoldOut" class="uniform-select">
          <option value="show">Sold Out: Show</option>
          <option value="hide">Sold Out: Hide</option>
          <option value="only">Sold Out: Only</option>
        </select>
        <select v-model="filterNoListings" class="uniform-select">
          <option value="show">No Listings: Show</option>
          <option value="hide">No Listings: Hide</option>
        </select>
        <template v-if="usingFilter">
          <button @click="clearFilters()" class="p-2 bg-amber-500/20 text-amber-500 text-sm rounded-md">Clear All</button>
        </template>
      </FilterMenuButton>
      <select v-model="sortOption">
        <option value="highestLastSale">Sort by Highest Last Sale</option>
        <option value="lowestLastSale">Sort by Lowest Last Sale</option>
        <option value="highestFiveLastSales">Sort by Highest Last 5 Sales Average</option>
        <option value="lowestFiveLastSales">Sort by Lowest Last 5 Sales Average</option>
        <option value="highestPrice">Sort by Highest Floor</option>
        <option value="lowestPrice">Sort by Lowest Floor</option>
        <option value="highestFloorMintRatio">Sort by Highest Mint Profit</option>
        <option value="lowestFloorMintRatio">Sort by Lowest Mint Profit</option>
        <option value="highestSupply">Sort by Highest Supply</option>
        <option value="lowestSupply">Sort by Lowest Supply</option>
        <option value="highestMarketCap">Sort by Highest Market Cap</option>
        <option value="lowestMarketCap">Sort by Lowest Market Cap</option>
        <option value="highestDailyVolume">Sort by Highest Daily Volume</option>
        <option value="lowestDailyVolume">Sort by Lowest Daily Volume</option>
        <option value="highestWeeklyVolume">Sort by Highest Weekly Volume</option>
        <option value="lowestWeeklyVolume">Sort by Lowest Weekly Volume</option>
        <option value="highestVolume">Sort by Highest Total Volume</option>
        <option value="lowestVolume">Sort by Lowest Total Volume</option>
        <option value="highestDailyChange">Sort by Today's Biggest Risers</option>
        <option value="lowestDailyChange">Sort by Today's Biggest Fallers</option>
        <option value="recentSale">Sort by Most Recent Sale</option>
        <option value="lowestShopAvailablePercentage">Sort by Least Stock in Shop (Percentage)</option>
        <option value="highestShopAvailablePercentage">Sort by Most Stock in Shop (Percentage)</option>
        <option value="lowestShopAvailableAbsolute">Sort by Least Stock in Shop</option>
        <option value="highestShopAvailableAbsolute">Sort by Most Stock in Shop</option>
        <option value="lowestShopNextMint">Sort by Lowest Next Mint Number in Shop</option>
        <option value="highestWeeklyAverage">Sort by Highest 7 Days Average Sale</option>
        <option value="highestTwoWeeklyAverage">Sort by Highest 14 Days Average Sale</option>
        <option value="highestMonthlyAverage">Sort by Highest 30 Days Average Sale</option>
        <option value="lowestWeeklyAverage">Sort by Lowest 7 Days Average Sale</option>
        <option value="lowestTwoWeeklyAverage">Sort by Lowest 14 Days Average Sale</option>
        <option value="lowestMonthlyAverage">Sort by Lowest 30 Days Average Sale</option>
        <option value="lowestListedPercentage">Sort by Lowest Listed Percentage</option>
        <option value="artistAsc">Sort by Artist (Ascending)</option>
        <option value="artistDesc">Sort by Artist (Descending)</option>
        <option value="nameAsc">Sort by Name (Ascending)</option>
        <option value="nameDesc">Sort by Name (Descending)</option>
      </select>
      <select v-model="settings.stats.layout" class="uniform-select">
        <option value="grid">Grid</option>
        <option value="table">Table</option>
      </select>
      <template v-if="!Capacitor.isNativePlatform() || settings.stats.layout === 'table'">
        <RefreshButton :action="refresh" :refreshing="isRefreshing" />
      </template>
    </MenuBar>
    <template v-if="settings.stats.layout === 'table'">
      <div class="px-2 pb-3 md:px-6 w-full">
        <div class="px-2 border border-white/10 rounded-2xl">
          <div class="w-full overflow-x-auto">
            <table class="text-xs font-medium w-full whitespace-nowrap">
              <thead>
              <tr class="border-b-b border-white/10 text-details">
                <th class="table--cell"></th>
                <th @click="setTableSort('name')" class="border-b border-white/10 text-left px-2 py-3 cursor-pointer" :class="{ 'text-amber-500': sortOption.includes('name') }">Name</th>
                <th @click="setTableSort('supply')" class="table--cell cursor-pointer" :class="{ 'text-amber-500': sortOption.includes('Supply') }">Supply</th>
                <th @click="setTableSort('floor')" class="table--cell cursor-pointer" :class="{ 'text-amber-500': sortOption.includes('Price') }">Floor</th>
                <th @click="setTableSort('last sale')" class="table--cell cursor-pointer" :class="{ 'text-amber-500': sortOption.includes('estLastSale') }">Last Sale</th>
                <th @click="setTableSort('last 5 sales')" class="table--cell cursor-pointer" :class="{ 'text-amber-500': sortOption.includes('FiveLastSales') }">Last 5 Sales</th>
                <th @click="setTableSort('total vol')" class="table--cell cursor-pointer" :class="{ 'text-amber-500': sortOption.includes('estVol') }">Total Vol</th>
                <th @click="setTableSort('daily vol')" class="table--cell cursor-pointer" :class="{ 'text-amber-500': sortOption.includes('DailyVol') }">Vol (24h)</th>
                <th @click="setTableSort('cap')" class="table--cell cursor-pointer" :class="{ 'text-amber-500': sortOption.includes('MarketCap') }">Market Cap</th>
                <th @click="setTableSort('change')" class="border-b border-white/10 text-right px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': sortOption.includes('DailyChange') }">Change (24h)</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="(item, index) in slicedItems" :key="index">
                <tr class="hover:bg-tertiary text-white/80" :set="listing = getLowestListing(item)">
                  <td class="border-b border-white/10 max-w-fit">
                    <span class="text-white/40">#{{ index + 1 + (pageSize * (itemsCurrentPage - 1)) }}</span>
                  </td>
                  <td class="table--cell flex items-center gap-2">
                    <button @click="openLinkWith(marketplaceLink(item))">
                      <div class="relative rounded-md w-6 h-6 flex items-center overflow-hidden">
                        <img :src="getTokenImage(item.series.image)" :key="item.series.image" class="object-cover" :alt="item.series.name">
                      </div>
                    </button>
                    <button @click="selectAvatar(item)" class="font-semibold">{{ item.series.name }}</button>
                  </td>
                  <td class="table--cell">{{ Math.max(item.series.total_quantity, item.series.total_sold) }}</td>
                  <td class="table--cell">
                    <template v-if="listing">
                      <div class="flex items-center justify-start gap-0.5">
                        <button @click.stop="openLinkWith(`https://opensea.io/assets/matic/${getLowestListing(item).token.contract_address}/${getLowestListing(item).token.id}`)" class="flex items-center group">
                          <template v-if="normalizeTokenSymbol(listing.payment_token.symbol) === 'ETH'">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                            <div class="flex gap-1">
                              <span>{{ (listing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(6).replace(/\.?0+$/, '') }}</span>
                              <span class="text-white/40">(<span class="text-amber-500">{{ ethereumInLocalCurrency(listing.payment_token.base_price) }}</span>)</span>
                              <span class="text-details">#{{ listing.token.mint_number }}</span>
                            </div>
                          </template>
                          <template v-else-if="normalizeTokenSymbol(listing.payment_token.symbol) === 'MATIC'">
                            <div class="flex items-center text-orange-500">M</div>
                            <div class="flex gap-1">
                              <span>{{ (listing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
                              <span class="text-white/40">(<span class="text-amber-500">{{ ethereumInLocalCurrency(getListingAsGweiPrice(listing)) }}</span>)</span>
                              <span class="text-details">#{{ listing.token.mint_number }}</span>
                            </div>
                          </template>
                        </button>
                      </div>
                    </template>
                    <template v-else>
                      <span class="text-white/40 italic">No listings.</span>
                    </template>
                  </td>
                  <td class="table--cell">
                    <template v-if="item.stats.last_sale">
                      <div class="flex flex-nowrap items-center justify-start gap-1 whitespace-nowrap overflow-hidden" :set="lastSale = item.stats.last_sale">
                        <div class="flex items-center gap-0.5">
                          <div class="flex items-center gap-0.5">
                            <template v-if="normalizeTokenSymbol(lastSale.payment_token.symbol) === 'ETH'">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-white/40"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                            </template>
                            <template v-else-if="normalizeTokenSymbol(lastSale.payment_token.symbol) === 'MATIC'">
                              <div class="flex items-center text-orange-500">M</div>
                            </template>
                            <div class="text-white/80">{{ (lastSale.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</div>
                          </div>
                        </div>
                        <span class="text-white/70">({{ ethereumInLocalCurrency(getSaleAsGweiPrice(lastSale)) }})</span>
                        <span class="text-details">#{{ lastSale.token.mint_number }}</span>
                        <div class="text-white/40" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(lastSale.date_sold)) }}</div>
                      </div>
                    </template>
                    <template v-else>
                      <span class="text-white/40 italic">No sales yet.</span>
                    </template>
                  </td>
                  <td class="table--cell">
                    <div class="flex items-center justify-start gap-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="flex gap-1">
                        <span>{{ (item.stats.eth.five_last_sales_average).toFixed(6).replace(/\.?0+$/, '') }}</span>
                        <span class="text-white/40">(<span class="text-amber-500">{{ ethereumInLocalCurrency(item.stats.eth.five_last_sales_average * ETH_TO_GWEI_MODIFIER) }}</span>)</span>
                      </div>
                    </div>
                  </td>
                  <td class="table--cell">
                    <div class="flex items-center justify-start gap-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <span>{{ (item.stats.total_volume / ETH_TO_GWEI_MODIFIER).toFixed(2) }}</span>
                    </div>
                  </td>
                  <td class="table--cell">
                    <div class="flex items-center justify-start gap-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <span>{{ (item.stats.daily_volume).toFixed(2) }}</span>
                    </div>
                  </td>
                  <td class="table--cell">
                    <div class="flex items-center justify-start gap-0.5">
                      <span>{{ ethereumInLocalCurrency(item.stats.eth.last_sale ? (item.stats.eth.last_sale.payment_token.base_price * item.series.total_sold) : 0) }}</span>
                    </div>
                  </td>
                  <td class="table--cell">
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
                        <div class="text-white/80">
                          <span>0%</span>
                        </div>
                      </template>
                    </div>
                  </td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>
          <div class="py-6 flex justify-center">
            <Pagination :total-items="filteredAndSortedSeriesStats.length" :page-size="pageSize" v-model:current-page="itemsCurrentPage" />
          </div>
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
  useEthereumUsdPrice, useSelectedAvatar,
  useSeriesStatsV2, useSettings,
  useWatchList
} from "~/composables/states";
import {SeriesStats} from "~/types/seriesStats";
import {computed, getLowestListingAsGweiPrice, getSaleAsGweiPrice, ref, useRoute, useRouter} from "#imports";
import {ComputedRef, watch} from "vue";
import MenuBar from "~/components/MenuBar.vue";
import {Capacitor} from "@capacitor/core";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {getLowestListing, getListingAsGweiPrice, maticToEth} from "~/composables/helpers";
import {getAllCollections, Filters} from "~/global/generations";
import {getTokenImage, normalizeTokenSymbol} from "~/global/utils";
import {openLinkWith} from "~/composables/states";
import {ethereumInLocalCurrency} from "#imports";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {marketplaceLink} from "~/global/marketplace";

const router = useRouter();
const route = useRoute();
const seriesStats = useSeriesStatsV2();
const watchList = useWatchList();
const ethereumPriceInUsd = useEthereumUsdPrice();
const settings = useSettings();

const searchTerm = ref<string>("");
const maxPriceEth = ref<number>(parseFloat(route.query.maxPrice as string) ?? undefined);
const filterGenOption = ref<string>(route.query.gen as string ?? "all");
const filterArtistOption = ref<string>(route.query.artist as string ?? "all");
const filterRarityOption = ref<string>(route.query.supply as string ?? "all");
const filterSoldOut = ref<string>(route.query.soldOut as string ?? "show");
const filterNoListings = ref<string>(route.query.noListings as string ?? "show");
const sortOption = ref<string>(route.query.sort as string ?? "highestLastSale");
const isRefreshing = ref(false);
const itemsCurrentPage = ref(1);
const pageSize = ref(100);

updateSeriesStats();

watch([maxPriceEth, filterGenOption, filterArtistOption, filterRarityOption, sortOption, filterSoldOut], () => {
  router.push({
    query: {
      maxPrice: maxPriceEth.value,
      gen: filterGenOption.value,
      artist: filterArtistOption.value,
      supply: filterRarityOption.value,
      sort: sortOption.value,
      soldOut: filterSoldOut.value,
      noListings: filterNoListings.value
    },
  });
});

const slicedItems = computed(() => {
  const start = (itemsCurrentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredAndSortedSeriesStats.value.slice(start, end);
});

const artists = computed(() => {
  let artists: Set<String> = new Set();

  for (const collection of Object.entries(seriesStats.value)) {
    artists.add(Object.values(collection[1])[0].collection.artist.displayName);
  }

  let artistsArray = Array.from(artists);

  artistsArray = artistsArray.filter((v) => !!v);

  artistsArray.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  return artistsArray;
});

const usingFilter: ComputedRef<boolean> = computed(() => {
  return !!maxPriceEth.value || filterGenOption.value !== "all" || filterArtistOption.value !== "all" || filterRarityOption.value !== "all" || filterSoldOut.value !== "show" || filterNoListings.value !== "show";
});

function clearFilters() {
  maxPriceEth.value = undefined;
  filterGenOption.value = "all";
  filterArtistOption.value = "all";
  filterRarityOption.value = "all";
  filterSoldOut.value = "show";
  filterNoListings.value = "show";
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
  let filteredSeriesStats: SeriesStats[] = [];

  for (const collection of Object.entries(seriesStats.value)) {
    filteredSeriesStats = filteredSeriesStats.concat(Object.values(collection[1]));
  }

  if (route.path.includes("watchlist")) {
    filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => watchList.value.has(seriesStat.series.contract_address + seriesStat.series.name));
  }

  if (maxPriceEth.value) {
    filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => {
      const lowestListing = getLowestListing(seriesStat);

      let price = 0;

      if (!lowestListing) {
        price = 9999999999;
      } else if (normalizeTokenSymbol(lowestListing.payment_token.symbol) === "ETH") {
        price = lowestListing.payment_token.base_price;
      } else if (normalizeTokenSymbol(lowestListing.payment_token.symbol) === "MATIC") {
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

  if (filterArtistOption.value && filterArtistOption.value != "all") {
    filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => seriesStat.collection.artist.displayName === filterArtistOption.value);
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

  if (filterSoldOut.value === "hide") {
    filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => seriesStat.series.total_sold < seriesStat.series.total_quantity);
  }

  if (filterSoldOut.value === "only") {
    filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => seriesStat.series.total_sold >= seriesStat.series.total_quantity);
  }

  if (filterNoListings.value === "hide") {
    filteredSeriesStats = filteredSeriesStats.filter((seriesStat) => !!seriesStat.stats.lowest_listing);
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
        const aFloorMintRatio = getLowestListing(a) ? Math.round(((getLowestListingAsGweiPrice(a) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd.value) / (a.series.mint_price / 100) * 100 - 100) : 0;
        const bFloorMintRatio = getLowestListing(b) ? Math.round(((getLowestListingAsGweiPrice(b) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd.value) / (b.series.mint_price / 100) * 100 - 100) : 0;

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
        const aFloorMintRatio = getLowestListing(a) ? Math.round(((getLowestListingAsGweiPrice(a) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd.value) / (a.series.mint_price / 100) * 100 - 100) : 0;
        const bFloorMintRatio = getLowestListing(b) ? Math.round(((getLowestListingAsGweiPrice(b) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd.value) / (b.series.mint_price / 100) * 100 - 100) : 0;

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
    case "lowestDailyVolume":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aVolume = a.stats.daily_volume;
        const bVolume = b.stats.daily_volume;

        if (aVolume > bVolume) {
          return 1;
        } else if (aVolume < bVolume) {
          return -1;
        } else {
          return 0;
        }
      });
      break;
    case "highestWeeklyVolume":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aVolume = a.stats.weekly_volume;
        const bVolume = b.stats.weekly_volume;

        if (aVolume > bVolume) {
          return -1;
        } else if (aVolume < bVolume) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "lowestWeeklyVolume":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aVolume = a.stats.weekly_volume;
        const bVolume = b.stats.weekly_volume;

        if (aVolume > bVolume) {
          return 1;
        } else if (aVolume < bVolume) {
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
    case "highestFiveLastSales":
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
    case "lowestFiveLastSales":
      sortedSeriesStats = filteredSeriesStats.sort((a, b) => {
        const aBasePrice = a.stats.five_last_sales_average;
        const bBasePrice = b.stats.five_last_sales_average;

        if (aBasePrice > bBasePrice) {
          return 1;
        } else if (aBasePrice < bBasePrice) {
          return -1;
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

function setTableSort(sort: string) {
  switch (sort) {
    case "name":
      if (sortOption.value === "nameAsc") {
        sortOption.value = "nameDesc";
      } else {
        sortOption.value = "nameAsc";
      }
      break;
    case "supply":
      if (sortOption.value === "lowestSupply") {
        sortOption.value = "highestSupply";
      } else {
        sortOption.value = "lowestSupply";
      }
      break;
    case "floor":
      if (sortOption.value === "highestPrice") {
        sortOption.value = "lowestPrice";
      } else {
        sortOption.value = "highestPrice";
      }
      break;
    case "last sale":
      if (sortOption.value === "highestLastSale") {
        sortOption.value = "lowestLastSale";
      } else {
        sortOption.value = "highestLastSale";
      }
      break;
    case "last 5 sales":
      if (sortOption.value === "highestFiveLastSales") {
        sortOption.value = "lowestFiveLastSales";
      } else {
        sortOption.value = "highestFiveLastSales";
      }
      break;
    case "total vol":
      if (sortOption.value === "highestVolume") {
        sortOption.value = "lowestVolume";
      } else {
        sortOption.value = "highestVolume";
      }
      break;
    case "daily vol":
      if (sortOption.value === "highestDailyVolume") {
        sortOption.value = "lowestDailyVolume";
      } else {
        sortOption.value = "highestDailyVolume";
      }
      break;
    case "cap":
      if (sortOption.value === "highestMarketCap") {
        sortOption.value = "lowestMarketCap";
      } else {
        sortOption.value = "highestMarketCap";
      }
      break;
    case "change":
      if (sortOption.value === "highestDailyChange") {
        sortOption.value = "lowestDailyChange";
      } else {
        sortOption.value = "highestDailyChange";
      }
      break;
  }
}

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

function selectAvatar(seriesStats: SeriesStats) {
  hapticsImpactLight();

  useSelectedAvatar().value = {
    seriesStats: seriesStats,
    contract: seriesStats.series.contract_address,
    series: seriesStats.series.name
  }
}
</script>

<style>
.stats-view .searchbar {
  @apply w-fit md:w-full;
}

.stats-view .menubar > select {
  @apply max-w-[5rem] md:max-w-fit;
}

.table--cell {
  @apply border-b border-white/10 px-2 py-1 text-left;
}
</style>
