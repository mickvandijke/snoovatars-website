<template>
  <div class="listings-view relative flex flex-col w-full min-h-screen bg-[#141415]">
    <MenuBar>
      <SearchBar v-model:search-term="searchTerm" :placeholder="`Search by Name, Artist or Collection`" />
      <FilterMenuButton :using-filter="usingFilter()" class="ml-auto">
        <input type="number" v-model="maxPrice" :placeholder="`Max price ${paymentToken.toUpperCase()}`">
        <input type="number" v-model="minMint" placeholder="Min mint number">
        <input type="number" v-model="maxMint" placeholder="Max mint number">
        <select v-model="filterGenOption" class="uniform-select">
          <option value="all">Gen: All</option>
          <template v-for="gen in Object.keys(Filters)">
            <option :value="gen">{{ gen }}</option>
          </template>
        </select>
        <select v-model="filterRarityOption" class="uniform-select">
          <option value="all">Supply: All</option>
          <option value="250">Supply: Max 250</option>
          <option value="777">Supply: Max 777</option>
          <option value="1000">Supply: Max 1000</option>
        </select>
        <template v-if="usingFilter()">
          <button @click="clearFilters()" class="p-2 bg-white/10 text-white hover:bg-white/20 text-sm rounded-md transition-colors">Clear All</button>
        </template>
      </FilterMenuButton>
      <select v-model="paymentToken" class="uniform-select">
        <option value="eth">ETH</option>
        <option value="matic">MATIC</option>
      </select>
      <RefreshButton :action="refresh" :refreshing="isRefreshing" />
    </MenuBar>
    
    <div class="flex-1">
      <!-- Pro Feature Gate for non-authenticated users -->
      <template v-if="!user">
        <ProRequired />
      </template>
      
      <!-- Pro Feature Gate for non-Pro users -->
      <template v-else-if="user.tier < 1">
        <ProRequired 
          message="Please upgrade to Pro to access marketplace listings"
          button-text="Upgrade to Pro"
          button-link="/upgrade"
        />
      </template>
      
      <!-- Loading State -->
      <template v-else-if="isRefreshing && !listingsWithStats.length">
        <div class="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div class="text-center py-16 px-4">
            <div class="inline-flex items-center justify-center w-12 h-12 mb-4">
              <svg class="w-8 h-8 text-orange-500 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-sm text-zinc-400">Loading listings...</p>
          </div>
        </div>
      </template>
      
      <!-- Empty State -->
      <template v-else-if="!filteredListings.length && !isRefreshing">
        <div class="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div class="text-center py-16 px-4">
            <div class="mx-auto h-12 w-12 text-zinc-600 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-white mb-2">No listings found</h3>
            <p class="text-sm text-zinc-400">Try adjusting your filters or search terms</p>
          </div>
        </div>
      </template>
      
      <!-- Listings Table -->
      <template v-else>
        <div class="border-b border-zinc-800">
          <div class="px-4 lg:px-6 py-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 class="text-2xl font-semibold text-white">Active Listings</h1>
                <p class="mt-1 text-sm text-zinc-400">{{ filteredListings.length.toLocaleString() }} items available for purchase</p>
              </div>
              <div class="flex items-center gap-2 text-sm text-zinc-400">
                <span>Showing {{ slicedListings.length }} of {{ filteredListings.length.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="px-4 lg:px-6 py-6">
          <div class="bg-zinc-800/30 border border-zinc-700/30 rounded-xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-zinc-900/50 border-b border-zinc-700/50">
                  <tr>
                    <th class="text-left px-6 py-4 text-zinc-300 font-medium text-sm cursor-pointer hover:text-white transition-colors" :class="{ 'text-white': listingsSortColumn === 'name' }" @click="sortListings('name')">
                      <div class="flex items-center gap-2">
                        <span>Item</span>
                        <svg v-if="listingsSortColumn === 'name'" class="w-4 h-4" :class="listingsSortDirection === 'asc' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </th>
                    <th class="text-left px-6 py-4 text-zinc-300 font-medium text-sm cursor-pointer hover:text-white transition-colors" :class="{ 'text-white': listingsSortColumn === 'supply' }" @click="sortListings('supply')">
                      <div class="flex items-center gap-2">
                        <span>Supply</span>
                        <svg v-if="listingsSortColumn === 'supply'" class="w-4 h-4" :class="listingsSortDirection === 'asc' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </th>
                    <th class="text-left px-6 py-4 text-zinc-300 font-medium text-sm cursor-pointer hover:text-white transition-colors" :class="{ 'text-white': listingsSortSecondaryColumn === 'price' }" @click="sortSecondaryListings('price')">
                      <div class="flex items-center gap-2">
                        <span>Price</span>
                        <svg v-if="listingsSortSecondaryColumn === 'price'" class="w-4 h-4" :class="listingsSortSecondaryDirection === 'asc' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </th>
                    <th class="text-left px-6 py-4 text-zinc-300 font-medium text-sm cursor-pointer hover:text-white transition-colors" :class="{ 'text-white': listingsSortColumn === 'mint_number' }" @click="sortListings('mint_number')">
                      <div class="flex items-center gap-2">
                        <span>Mint</span>
                        <svg v-if="listingsSortColumn === 'mint_number'" class="w-4 h-4" :class="listingsSortDirection === 'asc' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </th>
                    <th class="text-left px-6 py-4 text-zinc-300 font-medium text-sm">
                      Seller
                    </th>
                    <th class="text-left px-6 py-4 text-zinc-300 font-medium text-sm cursor-pointer hover:text-white transition-colors" :class="{ 'text-white': listingsSortColumn === 'date_listed' }" @click="sortListings('date_listed')">
                      <div class="flex items-center gap-2">
                        <span>Date Listed</span>
                        <svg v-if="listingsSortColumn === 'date_listed'" class="w-4 h-4" :class="listingsSortDirection === 'asc' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(listing, index) in slicedListings" :key="index">
                    <tr class="border-b border-zinc-700/30 hover:bg-zinc-700/20 transition-colors group">
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-4">
                          <button @click="openLinkWith(marketplaceLink(listing.stats))" class="flex-shrink-0">
                            <div class="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-700/30">
                              <img :src="getTokenImage(listing.stats?.series?.image || '/img/rcax_placeholder.png')" :key="listing.stats?.series?.image || 'placeholder'" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" :alt="listing.stats?.series?.name || listing.listing.token.name">
                            </div>
                          </button>
                          <div class="min-w-0">
                            <button @click="selectAvatar(listing.stats)" class="text-white font-medium text-sm hover:text-zinc-300 transition-colors block truncate">
                              {{ listing.listing.token.name }}
                            </button>
                            <div class="text-zinc-400 text-xs mt-1 truncate">
                              {{ listing.stats?.collection?.name || 'Unknown Collection' }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-zinc-300 text-sm font-medium">
                          {{ listing.stats?.series?.total_sold?.toLocaleString() || 'N/A' }}
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <button @click="openLinkWith(`https://opensea.io/assets/matic/${listing.listing.token.contract_address}/${listing.listing.token.id}`)" class="text-left hover:bg-zinc-800/50 rounded-lg p-2 -m-2 transition-colors group">
                          <div class="text-white font-semibold text-sm group-hover:text-zinc-200">
                            {{ (listing.listing.payment_token.base_price / 1000000000000000000).toFixed(6).replace(/\.?0+$/, '') }} {{ listing.listing.payment_token.symbol }}
                          </div>
                          <div class="text-zinc-400 text-xs mt-0.5">
                            {{ ethereumInLocalCurrency(getListingAsGweiPrice(listing.listing)) }}
                          </div>
                        </button>
                      </td>
                      <td class="px-6 py-4">
                        <button @click="openLinkWith(`https://opensea.io/assets/matic/${listing.listing.token.contract_address}/${listing.listing.token.id}`)" class="px-2 py-1 bg-zinc-800/50 hover:bg-zinc-700/50 text-white font-medium text-sm rounded-md transition-colors">
                          #{{ listing.listing.token.mint_number }}
                        </button>
                      </td>
                      <td class="px-6 py-4">
                        <button @click="openLinkWith(`https://opensea.io/${listing.listing.maker_address}`)" class="text-zinc-400 hover:text-white font-mono text-sm transition-colors hover:bg-zinc-800/50 rounded-lg px-2 py-1 -m-1">
                          {{ listing.listing.maker_address.slice(0, 6) }}...{{ listing.listing.maker_address.slice(-4) }}
                        </button>
                      </td>
                      <td class="px-6 py-4 text-zinc-400 text-sm">
                        {{ $timeAgo(new Date(listing.listing.date_listed)) }} ago
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <div class="px-6 py-6 bg-zinc-900/20 border-t border-zinc-700/30">
              <Pagination :total-items="filteredListings.length" :page-size="pageSize" v-model:current-page="listingsCurrentPage" />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Listing} from "~/types/listing";
import {ComputedRef, Ref} from "vue";
import {
  computed,
  onMounted,
  ref,
  watch,
  updateEthereumPrices,
  updateMarketInfo,
  updateSeriesStats,
  useRoute,
  useUser,
  ethereumInLocalCurrency,
  getListingAsGweiPrice, useSelectedAvatar
} from "#imports";
import {fetchListings} from "~/composables/api/listings";
import {SeriesStats} from "~/types/seriesStats";
import {Filters} from "~/global/generations";
import {getSeriesStats, useSeriesStatsV2} from "~/composables/states";
import {fetchSeriesStats} from "~/composables/api/seriesStats";
import {getTokenImage, normalizeTokenSymbol} from "~/global/utils";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {marketplaceLink} from "~/global/marketplace";

interface ListingWithStats {
  listing: Listing;
  stats: SeriesStats;
}

const user = useUser();
const route = useRoute();

const searchTerm = ref("");
const maxPrice = ref<number>(parseFloat(route.query.maxPrice as string) ?? 0);
const minMint = ref(undefined);
const maxMint = ref(undefined);
const filterGenOption = ref<string>(route.query.gen as string ?? "all");
const filterRarityOption = ref<string>(route.query.supply as string ?? "all");
const paymentToken = ref("eth");
const listingsSortColumn = ref('mint_number');
const listingsSortDirection = ref('asc');
const listingsSortSecondaryColumn = ref('price');
const listingsSortSecondaryDirection = ref('asc');
const listingsCurrentPage = ref(1);
const listingsWithStats: Ref<Array<ListingWithStats>> = ref([]);
const isRefreshing = ref(false);
const pageSize = ref(100);
const showFilters = ref(false);

onMounted(() => {
  refresh();
});

function usingFilter(): boolean {
  return !!maxPrice.value || !!minMint.value || !!maxMint.value || filterGenOption.value !== "all" || filterRarityOption.value !== "all";
}

function clearFilters() {
  maxPrice.value = 0;
  minMint.value = undefined;
  maxMint.value = undefined;
  filterGenOption.value = "all";
  filterRarityOption.value = "all";
}

async function refresh() {
  isRefreshing.value = true;

  try {
    // Load series stats first, then listings
    console.log('Loading series stats...');
    
    // Fix the updateSeriesStats to properly await
    try {
      const seriesStats = await fetchSeriesStats();
      useSeriesStatsV2().value = seriesStats;
      console.log('Series stats loaded, keys:', Object.keys(useSeriesStatsV2().value).length);
    } catch (seriesError) {
      console.error('Error loading series stats:', seriesError);
    }
    
    const promises = [
      updateListings(),
      updateMarketInfo(),
      updateEthereumPrices()
    ];

    await Promise.allSettled(promises);
  } catch (error) {
    console.error('Error during refresh:', error);
  } finally {
    isRefreshing.value = false;
  }
}

async function updateListings() {
  try {
    const data = await fetchListings();
    const listings = Object.values(data)
        .flatMap((innerObj) => Object.values(innerObj))
        .flatMap((nestedObj) => Object.values(nestedObj))
        .flat();

    console.log('Sample listing:', listings[0]); // Debug log
    
    // Check series stats structure
    const seriesStatsData = useSeriesStatsV2().value;
    console.log('Series stats keys:', Object.keys(seriesStatsData).slice(0, 5)); // First 5 contract addresses
    const firstContract = Object.keys(seriesStatsData)[0];
    if (firstContract) {
      console.log('Series names for first contract:', Object.keys(seriesStatsData[firstContract]));
    }
    
    listingsWithStats.value = listings.map((listing) => {
      const stats = getSeriesStats(listing.token.contract_address, listing.token.name);
      if (!stats && listings.indexOf(listing) === 0) {
        console.log('No stats found for:', listing.token.contract_address, listing.token.name); // Debug log
      }
      return {
        listing,
        stats: stats // Keep even if undefined, handle in template
      }
    });
    
    console.log('Total listings with stats:', listingsWithStats.value.filter(l => l.stats).length);
    console.log('Total listings without stats:', listingsWithStats.value.filter(l => !l.stats).length);
  } catch (error) {
    console.error('Error fetching listings:', error);
    listingsWithStats.value = [];
  }
}

const slicedListings = computed(() => {
  const start = (listingsCurrentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return sortedListings.value.slice(start, end);
});

const filteredListings: ComputedRef<ListingWithStats[]> = computed(() => {
  let filteredListings = listingsWithStats.value;

  switch (paymentToken.value) {
    case "eth":
      filteredListings = filteredListings.filter((listing) => normalizeTokenSymbol(listing.listing.payment_token.symbol) === "ETH");
      break;
    case "matic":
      filteredListings = filteredListings.filter((listing) => normalizeTokenSymbol(listing.listing.payment_token.symbol) === "MATIC");
      break;
  }

  if (searchTerm.value) {
    filteredListings = filteredListings.filter((listing) => (listing.listing.token.name.toLowerCase() + listing.listing.token.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")).includes(searchTerm.value.toLowerCase()))
  }

  if (maxPrice.value) {
    filteredListings = filteredListings.filter((listing) => listing.listing.payment_token.base_price <= maxPrice.value * 1000000000000000000)
  }

  if (minMint.value) {
    filteredListings = filteredListings.filter((listing) => listing.listing.token.mint_number >= minMint.value)
  }

  if (maxMint.value) {
    filteredListings = filteredListings.filter((listing) => listing.listing.token.mint_number <= maxMint.value)
  }

  if (filterGenOption.value && filterGenOption.value != "all") {
    filteredListings = filteredListings.filter((listing) => listing.stats?.collection?.contract_address && Filters[filterGenOption.value].collections.includes(listing.stats.collection.contract_address));
  }

  switch (filterRarityOption.value) {
    case "250":
      filteredListings = filteredListings.filter((listing) => listing.stats?.series?.total_quantity && listing.stats.series.total_quantity <= 250);
      break;
    case "777":
      filteredListings = filteredListings.filter((listing) => listing.stats?.series?.total_quantity && listing.stats.series.total_quantity <= 777);
      break;
    case "1000":
      filteredListings = filteredListings.filter((listing) => listing.stats?.series?.total_quantity && listing.stats.series.total_quantity <= 1000);
      break;
  }

  return filteredListings;
});

const sortedListings: ComputedRef<ListingWithStats[]> = computed(() => {
  return filteredListings.value.sort((a, b) => {
    let aValue = undefined;
    let bValue = undefined;
    let a2Value = undefined;
    let b2Value = undefined;

    switch (listingsSortColumn.value) {
      case "name":
        aValue = a.stats?.series?.name || a.listing.token.name;
        bValue = b.stats?.series?.name || b.listing.token.name;
        break;
      case "supply":
        aValue = a.stats?.series ? Math.max(a.stats.series.total_sold || 0, a.stats.series.total_quantity || 0) : 0;
        bValue = b.stats?.series ? Math.max(b.stats.series.total_sold || 0, b.stats.series.total_quantity || 0) : 0;
        break;
      case "mint_number":
        aValue = a.listing.token.mint_number;
        bValue = b.listing.token.mint_number;
        break;
      case "date_listed":
        aValue = new Date(a.listing.date_listed).getTime();
        bValue = new Date(b.listing.date_listed).getTime();
    }

    switch (listingsSortSecondaryColumn.value) {
      case "price":
        a2Value = a.listing.payment_token.base_price;
        b2Value = b.listing.payment_token.base_price;
        break;
    }

    if (aValue > bValue) {
      return listingsSortDirection.value === 'asc' ? 1 : -1;
    } else if (aValue < bValue) {
      return listingsSortDirection.value === 'asc' ? -1 : 1;
    } else {
      if (a2Value > b2Value) {
        return listingsSortSecondaryDirection.value === 'asc' ? 1 : -1;
      } else if (a2Value < b2Value) {
        return listingsSortSecondaryDirection.value === 'asc' ? -1 : 1;
      } else {
        return 0;
      }
    }
  });
});

function sortListings(column: string) {
  if (listingsSortColumn.value === column) {
    listingsSortDirection.value = listingsSortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    listingsSortColumn.value = column;
    listingsSortDirection.value = 'asc';
  }

  listingsCurrentPage.value = 1;
}

function sortSecondaryListings(column: string) {
  if (listingsSortSecondaryColumn.value === column) {
    listingsSortSecondaryDirection.value = listingsSortSecondaryDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    listingsSortSecondaryColumn.value = column;
    listingsSortSecondaryDirection.value = 'asc';
  }

  listingsCurrentPage.value = 1;
}

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

function selectAvatar(stats: SeriesStats) {
  hapticsImpactLight();

  useSelectedAvatar().value = {
    seriesStats: stats,
    contract: stats.series.contract_address,
    series: stats.series.name
  }
}
</script>

<style scoped>
/* Custom styles for listings page */
</style>
