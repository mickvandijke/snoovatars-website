<template>
  <div class="relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <div class="px-2 py-2 sticky top-[56px] lg:top-0 lg:relative flex justify-center gap-2 bg-neutral-800/90 backdrop-blur-lg lg:bg-transparent z-10 w-full drop-shadow-lg">
      <input v-model="searchTerm" placeholder="Search name" class="p-2 rounded-md border border-neutral-600/50 bg-neutral-700/50 text-sm focus:outline-none max-w-sm">
      <template v-if="feedView !== 'mints'">
        <select v-model="filterOption" class="p-2 rounded-md border border-neutral-600 bg-neutral-700 text-sm focus:outline-none max-w-sm">
          <option value="all">Show All</option>
          <option value="watchlist">Show Watchlist</option>
        </select>
      </template>
      <select v-model="feedView" class="p-2 rounded-md border border-neutral-600 bg-neutral-700 text-sm focus:outline-none max-w-sm">
        <option value="sales">Latest Sales</option>
        <option value="listings">Latest Listings</option>
        <option value="mints">Latest Mints</option>
      </select>
      <button @click="refresh()" :disabled="isRefreshing" class="p-2 whitespace-nowrap bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-white font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer" :class="{ 'loading': isRefreshing }">
        <ArrowPathIcon class="w-5 h-5" />
      </button>
    </div>
    <template v-if="feedView === 'sales'">
      <SalesComponent :items="filteredSales()" class="mt-1 lg:mt-0 px-2 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1" />
    </template>
    <template v-else-if="feedView === 'listings'">
      <ListingsComponent :items="filteredListings()" class="mt-1 lg:mt-0 px-2 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1" />
    </template>
    <template v-else-if="feedView === 'mints'">
      <MintsComponent :items="filteredMints()" class="mt-1 lg:mt-0 px-2 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1" />
    </template>
  </div>
</template>

<script setup lang="ts">
import {updateSeriesStats, useSeriesStats, useWatchList} from "~/composables/states";
import {SeriesStats} from "~/types/seriesStats";
import {ref, watch} from "#imports";
import {fetchSalesLatest} from "~/composables/api/sales";
import SalesComponent from "~/components/SalesComponent.vue";
import {Ref} from "@vue/reactivity";
import {Sale} from "~/types/sale";
import MintsComponent from "~/components/MintsComponent.vue";
import {Mint} from "~/types/mint";
import {fetchMintsLatest} from "~/composables/api/mints";
import {ArrowPathIcon} from "@heroicons/vue/24/solid";
import {Listing} from "~/types/listing";
import {fetchListingsLatest} from "~/composables/api/listings";

const watchList = useWatchList();

const salesLatest: Ref<Array<Sale>> = ref([]);
const listingsLatest: Ref<Array<Listing>> = ref([]);
const mintsLatest: Ref<Array<Mint>> = ref([]);
const searchTerm = ref<string>("");
const filterOption = ref<string>("all");
const feedView = ref<string>("sales");
const isRefreshing = ref(false);

refresh();

watch([feedView], () => {
  refresh();
})

function refresh() {
  isRefreshing.value = true;

  let promises = [];

  promises.push(updateSeriesStats());

  if (feedView.value === "sales") {
    promises.push(updateSales());
  } else if (feedView.value === "listings") {
    promises.push(updateListings());
  } else if (feedView.value === "mints") {
    promises.push(updateMints());
  }

  Promise.all(promises).finally(() => {
    isRefreshing.value = false;
  })
}

async function updateSales() {
  await fetchSalesLatest().then((sales) => {
    salesLatest.value = sales;
  });
}

async function updateListings() {
  await fetchListingsLatest().then((listings) => {
    listingsLatest.value = listings;
  });
}

async function updateMints() {
  await fetchMintsLatest().then((mints) => {
    mintsLatest.value = mints;
  });
}

function filteredSales(): Sale[] {
  let filteredSales = Array.from(Object.values(salesLatest.value));

  if (filterOption.value == "watchlist") {
    filteredSales = filteredSales.filter((sale) => watchList.value.has(sale.token.name));
  }

  if (searchTerm.value.trim() !== "") {
    filteredSales = filteredSales.filter((sale) => (sale.token.name.toLowerCase() + sale.token.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")).includes(searchTerm.value.toLowerCase()));
  }

  return filteredSales;
}

function filteredListings(): Listing[] {
  let filteredListings = Array.from(Object.values(listingsLatest.value));

  if (filterOption.value == "watchlist") {
    filteredListings = filteredListings.filter((listing) => watchList.value.has(listing.token.name));
  }

  if (searchTerm.value.trim() !== "") {
    filteredListings = filteredListings.filter((listing) => (listing.token.name.toLowerCase() + listing.token.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")).includes(searchTerm.value.toLowerCase()));
  }

  return filteredListings;
}

function filteredMints(): Mint[] {
  let filteredMints = Array.from(Object.values(mintsLatest.value));

  if (searchTerm.value.trim() !== "") {
    filteredMints = filteredMints.filter((mint) => (mint.token.name.toLowerCase() + mint.token.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")).includes(searchTerm.value.toLowerCase()));
  }

  return filteredMints;
}
</script>

<style scoped>

</style>
