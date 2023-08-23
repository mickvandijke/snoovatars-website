<template>
  <div class="pb-3 relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <MenuBar>
      <SearchBar v-model:search-term="searchTerm" :placeholder="`Search by Name, Artist or Collection`" />
      <FilterMenuButton :using-filter="usingFilter()">
        <input type="number" v-model="maxPrice" :placeholder="`Max price ${paymentToken.toUpperCase()}`" class="p-2 h-9 rounded-md bg-neutral-700 text-sm border-none focus:outline-none max-w-sm">
        <input type="number" v-model="minMint" placeholder="Min mint number" class="p-2 h-9 rounded-md bg-neutral-700 text-sm border-none focus:outline-none max-w-sm">
        <input type="number" v-model="maxMint" placeholder="Max mint number" class="p-2 h-9 rounded-md bg-neutral-700 text-sm border-none focus:outline-none max-w-sm">
        <select v-model="filterGenOption" class="p-2 h-9 rounded-md border-transparent bg-neutral-700 text-sm focus:outline-none max-w-sm">
          <option value="all">Gen: All</option>
          <template v-for="gen in Object.keys(Filters)">
            <option :value="gen">{{ gen }}</option>
          </template>
        </select>
        <select v-model="filterRarityOption" class="p-2 h-9 rounded-md border-transparent bg-neutral-700 text-sm focus:outline-none max-w-sm">
          <option value="all">Supply: All</option>
          <option value="250">Supply: Max 250</option>
          <option value="777">Supply: Max 777</option>
          <option value="1000">Supply: Max 1000</option>
        </select>
        <template v-if="usingFilter()">
          <button @click="clearFilters()" class="p-2 bg-amber-500/20 text-amber-500 text-sm rounded-md">Clear All</button>
        </template>
      </FilterMenuButton>
      <select v-model="paymentToken" class="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm border-none focus:outline-none w-fit max-w-sm overflow-x-hidden">
        <option value="eth">ETH</option>
        <option value="matic">MATIC</option>
      </select>
      <RefreshButton :action="refresh" :refreshing="isRefreshing" />
    </MenuBar>
    <div class="px-2 md:px-6 w-full">
      <div class="p-2 border border-primary-border rounded-2xl">
        <div class="w-full overflow-x-auto">
          <table class="mt-3 w-full whitespace-nowrap">
            <thead>
            <tr class="border-b border-primary-border text-white/80 text-xs">
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortColumn === 'name' }" @click="sortListings('name')">Name</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortColumn === 'supply' }" @click="sortListings('supply')">Supply</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortSecondaryColumn === 'price' }" @click="sortSecondaryListings('price')">Price</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortColumn === 'mint_number' }" @click="sortListings('mint_number')">Mint</th>
              <th class="text-left px-2 py-1">Seller</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortColumn === 'date_listed' }" @click="sortListings('date_listed')">Date</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="(listing, index) in slicedListings" :key="index">
              <tr class="border-b border-primary-border hover:bg-primary-accent-hover text-white/80 text-xs">
                <td class="relative px-2 py-1 flex gap-2">
                  <button @click="openLinkWith(`https://opensea.io/collection/${listing.stats?.collection.slug}?search[query]=${listing.listing.token.name}`)">
                    <div class="relative rounded-md w-6 h-6 overflow-hidden">
                      <img :src="getTokenImage(listing.stats.series.image)" :key="listing.stats.series.image" class="object-cover" :alt="listing.stats.series.name">
                    </div>
                  </button>
                  <button @click="selectAvatar(listing.stats)" class="font-semibold">{{ listing.listing.token.name }}</button>
                </td>
                <td class="px-2 py-1">{{ listing.stats?.series.total_sold }}</td>
                <td class="px-2 py-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  <button @click="openLinkWith(`https://opensea.io/assets/matic/${listing.listing.token.contract_address}/${listing.listing.token.id}`)">
                    <span>{{ (listing.listing.payment_token.base_price / 1000000000000000000).toFixed(6).replace(/\.?0+$/, '') }} {{ listing.listing.payment_token.symbol }}</span>
                    <span class="text-white/40"> (<span class="text-amber-500">{{ ethereumInLocalCurrency(getListingAsGweiPrice(listing.listing)) }}</span>)</span>
                  </button>
                </td>
                <td class="px-2 py-1">
                  <button @click="openLinkWith(`https://opensea.io/assets/matic/${listing.listing.token.contract_address}/${listing.listing.token.id}`)" class="text-amber-500">#{{ listing.listing.token.mint_number }}</button>
                </td>
                <td class="px-2 py-1">
                  <button @click="openLinkWith(`https://opensea.io/${listing.listing.maker_address}`)" class="text-amber-500">{{ listing.listing.maker_address.slice(2, 5) }}</button>
                </td>
                <td class="px-2 py-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(listing.listing.date_listed)) }} ago</td>
              </tr>
            </template>
            </tbody>
          </table>
          <template v-if="!user">
            <div class="py-6 flex flex-col items-center text-center gap-2">
              <div class="text-neutral-300">This is a <NuxtLink to="/upgrade" class="text-amber-500 font-bold italic">Pro</NuxtLink> feature. Please sign in using your Pro account.</div>
              <NuxtLink to="/login" class="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg">Sign In</NuxtLink>
            </div>
          </template>
          <template v-else-if="user.tier < 1">
            <div class="py-6 flex flex-col items-center text-center gap-2">
              <div class="text-neutral-300">Please upgrade to <NuxtLink to="/upgrade" class="text-amber-500 font-bold italic">Pro</NuxtLink> to use this feature.</div>
              <NuxtLink to="/upgrade" class="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg">Upgrade</NuxtLink>
            </div>
          </template>
        </div>
      </div>
      <template v-if="user?.tier > 0">
        <div class="py-6 flex justify-center">
          <Pagination :total-items="filteredListings.length" :page-size="pageSize" v-model:current-page="listingsCurrentPage" />
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
import {getSeriesStats} from "~/composables/states";
import {getTokenImage} from "~/global/utils";
import {Haptics, ImpactStyle} from "@capacitor/haptics";

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

function refresh() {
  isRefreshing.value = true;

  let promises = [];

  promises.push(updateListings());
  promises.push(updateSeriesStats());
  promises.push(updateMarketInfo());
  promises.push(updateEthereumPrices());

  Promise.all(promises).finally(() => {
    isRefreshing.value = false;
  })
}

async function updateListings() {
  await fetchListings()
      .then((data) => {
        const listings = Object.values(data)
            .flatMap((innerObj) => Object.values(innerObj))
            .flatMap((nestedObj) => Object.values(nestedObj))
            .flat();

        listingsWithStats.value = listings.map((listing) => {
          return {
            listing,
            stats: getSeriesStats(listing.token.contract_address, listing.token.name)
          }
        })
      });
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
      filteredListings = filteredListings.filter((listing) => listing.listing.payment_token.symbol === "ETH");
      break;
    case "matic":
      filteredListings = filteredListings.filter((listing) => listing.listing.payment_token.symbol === "MATIC");
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
    filteredListings = filteredListings.filter((listing) => Filters[filterGenOption.value].collections.includes(listing.stats.collection.contract_address));
  }

  switch (filterRarityOption.value) {
    case "250":
      filteredListings = filteredListings.filter((listing) => listing.stats.series.total_quantity <= 250);
      break;
    case "777":
      filteredListings = filteredListings.filter((listing) => listing.stats.series.total_quantity <= 777);
      break;
    case "1000":
      filteredListings = filteredListings.filter((listing) => listing.stats.series.total_quantity <= 1000);
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
        aValue = a.stats.series.name;
        bValue = b.stats.series.name;
        break;
      case "supply":
        aValue = Math.max(a.stats.series.total_sold, a.stats.series.total_quantity);
        bValue = Math.max(b.stats.series.total_sold, b.stats.series.total_quantity);
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

</style>
