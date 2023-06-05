<template>
  <div class="relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <MenuBar>
      <input v-model="searchTerm" placeholder="Search filter" class="p-2 rounded-md bg-neutral-800 text-sm border-none focus:outline-none max-w-sm">
      <input type="number" v-model="maxMint" placeholder="Max mint number" class="p-2 rounded-md bg-neutral-800 text-sm border-none focus:outline-none max-w-sm">
      <select v-model="paymentToken" class="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm border-none focus:outline-none max-w-sm overflow-x-hidden">
        <option value="eth">ETH</option>
        <option value="matic">MATIC</option>
      </select>
      <button @click="refresh()" :disabled="isRefreshing" class="p-2 whitespace-nowrap bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-white font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer" :class="{ 'loading': isRefreshing }">
        <ArrowPathIcon class="w-5 h-5" />
      </button>
    </MenuBar>
    <div class="px-2 md:px-4 w-full">
        <div class="w-full overflow-x-auto">
          <table class="mt-3 w-full text-xs whitespace-nowrap">
            <thead>
            <tr class="border-b border-neutral-600 text-neutral-200">
              <th class="text-left px-2 py-1">Name</th>
              <th class="text-left px-2 py-1">Supply</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortColumn === 'payment_token.base_price' }" @click="sortListings('payment_token.base_price')">Price</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortColumn === 'token.mint_number' }" @click="sortListings('token.mint_number')">Mint</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortColumn === 'maker_address' }" @click="sortListings('maker_address')">Seller</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortColumn === 'date_listed' }" @click="sortListings('date_listed')">Date</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="(listing, index) in slicedListings" :key="index">
              <tr class="border-b border-neutral-600 hover:bg-neutral-900 text-neutral-200">
                <td class="px-2 py-1">
                  <a :href="`https://opensea.io/collection/${getSeriesStats(listing.token.name)?.collection.slug}?search[query]=${listing.token.name}`" target="_blank" class="text-amber-500">{{ listing.token.name }}</a>
                </td>
                <td class="px-2 py-1">
                  {{ getSeriesStats(listing.token.name)?.series.total_sold }}
                </td>
                <td class="px-2 py-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  <span>{{ (listing.payment_token.base_price / 1000000000000000000).toFixed(6).replace(/\.?0+$/, '') }} {{ listing.payment_token.symbol }}</span>
                  <template v-if="listing.payment_token.symbol === 'ETH'">
                    <span> ({{ ethereumInLocalCurrency(listing.payment_token.base_price) }})</span>
                  </template>
                </td>
                <td class="px-2 py-1">
                  <a :href="`https://opensea.io/assets/matic/${listing.token.contract_address}/${listing.token.id}`" target="_blank" class="text-amber-500">#{{ listing.token.mint_number }}</a>
                </td>
                <td class="px-2 py-1">
                  <a :href="`https://opensea.io/${listing.maker_address}`" target="_blank" class="text-amber-500">{{ listing.maker_address.slice(2, 5) }}</a>
                </td>
                <td class="px-2 py-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(listing.date_listed)) }}</td>
              </tr>
            </template>
            </tbody>
          </table>
          <div class="py-6 flex justify-center">
            <Pagination :total-items="listings.length" :page-size="pageSize" v-model:current-page="listingsCurrentPage" />
          </div>
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
  useSeriesStats, useUser
} from "#imports";
import {fetchListings} from "~/composables/api/listings";
import {ArrowPathIcon} from "@heroicons/vue/24/solid";

const user = useUser();
const seriesStats = useSeriesStats();

const searchTerm = ref("");
const maxMint = ref(undefined);
const paymentToken = ref("eth");
const listingsSortColumn = ref('payment_token.base_price');
const listingsSortDirection = ref('asc');
const listingsCurrentPage = ref(1);
const listings: Ref<Array<Listing>> = ref([]);
const isRefreshing = ref(false);
const pageSize = ref(100);

onMounted(() => {
  refresh();
});

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
        listings.value = Object.values(data)
            .flatMap((innerObj) => Object.values(innerObj))
            .flatMap((nestedObj) => Object.values(nestedObj))
            .flat();
      });
}

const slicedListings = computed(() => {
  const start = (listingsCurrentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return sortedListings.value.slice(start, end);
});

const filteredListings: ComputedRef<Listing[]> = computed(() => {
  let filteredListings = listings.value;

  switch (paymentToken.value) {
    case "eth":
      filteredListings = filteredListings.filter((listing) => listing.payment_token.symbol === "ETH");
      break;
    case "matic":
      filteredListings = filteredListings.filter((listing) => listing.payment_token.symbol === "MATIC");
      break;
  }

  if (searchTerm.value) {
    filteredListings = filteredListings.filter((listing) => (listing.token.name.toLowerCase() + listing.token.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")).includes(searchTerm.value.toLowerCase()))
  }

  if (maxMint.value) {
    filteredListings = filteredListings.filter((listing) => listing.token.mint_number <= maxMint.value)
  }

  return filteredListings;
});

const sortedListings: ComputedRef<Listing[]> = computed(() => {
  return filteredListings.value.sort((a, b) => {
    let aValue = a[listingsSortColumn.value];
    let bValue = b[listingsSortColumn.value];

    if (listingsSortColumn.value === "payment_token.base_price") {
      aValue = a.payment_token.base_price;
      bValue = b.payment_token.base_price;
    } else if (listingsSortColumn.value === "token.mint_number") {
      aValue = a.token.mint_number;
      bValue = b.token.mint_number;
    }

    if (aValue > bValue) {
      return listingsSortDirection.value === 'asc' ? 1 : -1;
    } else if (aValue < bValue) {
      return listingsSortDirection.value === 'asc' ? -1 : 1;
    } else {
      return 0;
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

function getSeriesStats(name: string) {
  return seriesStats.value[name];
}
</script>

<style scoped>

</style>
