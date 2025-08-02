<template>
  <div class="events-view relative flex flex-col items-center w-full">
    <MenuBar>
      <SearchBar v-model:search-term="searchTerm" :placeholder="`Search by Name`" />
      <select v-model="settings.activity.filterGenOption" class="uniform-select">
        <option value="all">Show All</option>
        <option value="eth">Show ETH Only</option>
        <option value="premium">Show Premium Only</option>
        <option value="watchlist">Show Watchlist Only</option>
      </select>
      <select v-model="settings.activity.feedView" class="uniform-select">
        <option value="sales">Latest Sales</option>
        <option value="listings">Latest Listings</option>
      </select>
      <template v-if="!Capacitor.isNativePlatform()">
        <RefreshButton :action="refresh" :refreshing="isRefreshing" />
      </template>
    </MenuBar>
    <PullToRefresh @refresh="refresh" :is-refreshing="isRefreshing">
      <template v-if="settings.activity.feedView === 'sales'">
        <SalesComponent :items="filteredSales"/>
      </template>
      <template v-else-if="settings.activity.feedView === 'listings'">
        <ListingsComponent :items="filteredListings"/>
      </template>
      <template v-else-if="settings.activity.feedView === 'mints'">
        <MintsComponent :items="filteredMints"/>
      </template>
    </PullToRefresh>
  </div>
</template>

<script setup lang="ts">
import {
  updateEthereumPrices,
  updateMarketInfo,
  updateSeriesStats,
  useSeriesStatsV2, useSettings,
  useWatchList
} from "~/composables/states";
import {computed, ref, useRoute, useRouter, watch} from "#imports";
import {fetchSalesLatest} from "~/composables/api/sales";
import SalesComponent from "~/components/SalesComponent.vue";
import {Ref} from "@vue/reactivity";
import {Sale} from "~/types/sale";
import MintsComponent from "~/components/MintsComponent.vue";
import {Mint} from "~/types/mint";
import {fetchMintsLatest} from "~/composables/api/mints";
import {Listing} from "~/types/listing";
import {fetchListingsLatest} from "~/composables/api/listings";
import {Capacitor} from "@capacitor/core";
import {ComputedRef} from "vue";
import {getFreeCollections} from "~/global/generations";
import {normalizeTokenSymbol} from "~/global/utils";

const watchList = useWatchList();
const router = useRouter();
const route = useRoute();
const settings = useSettings();

const salesLatest: Ref<Array<Sale>> = ref([]);
const listingsLatest: Ref<Array<Listing>> = ref([]);
const mintsLatest: Ref<Array<Mint>> = ref([]);
const searchTerm = ref<string>("");
const feedViewQuery = ref<string>(route.query.feed as string);
const isRefreshing = ref(false);

if (feedViewQuery.value) {
  settings.value.activity.feedView = feedViewQuery.value;
}

refresh();

const feedView = computed(() => {
  return settings.value.activity.feedView;
});

watch([feedView], () => {
  router.push({
    query: {
      feed: settings.value.activity.feedView
    },
  });

  refresh();
})

function refresh() {
  isRefreshing.value = true;

  let promises = [];

  if (settings.value.activity.feedView === "sales") {
    promises.push(updateSales());
  } else if (settings.value.activity.feedView === "listings") {
    promises.push(updateListings());
    promises.push(updateSeriesStats());
  } else if (settings.value.activity.feedView === "mints") {
    promises.push(updateMints());
    promises.push(updateSeriesStats());
  }

  promises.push(updateMarketInfo());
  promises.push(updateEthereumPrices());

  Promise.all(promises).finally(() => {
    isRefreshing.value = false;
  })
}

async function updateSales() {
  await fetchSalesLatest().then(([sales, seriesStats]) => {
    useSeriesStatsV2().value = seriesStats;
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

const filteredSales: ComputedRef<Sale[]> = computed(() => {
  let filteredSales = Array.from(Object.values(salesLatest.value));

  if (settings.value.activity.filterGenOption && settings.value.activity.filterGenOption != "all") {
    if (settings.value.activity.filterGenOption === "watchlist") {
      filteredSales = filteredSales.filter((sale) => watchList.value.has(sale.token.contract_address + sale.token.name));
    } else if (settings.value.activity.filterGenOption === "eth") {
      filteredSales = filteredSales.filter((sale) => normalizeTokenSymbol(sale.payment_token.symbol) == "ETH");
    } else {
      filteredSales = filteredSales.filter((sale) => !getFreeCollections().includes(sale.token.contract_address));
    }
  }

  if (searchTerm.value.trim() !== "") {
    filteredSales = filteredSales.filter((sale) => (sale.token.name.toLowerCase() + sale.token.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")).includes(searchTerm.value.toLowerCase()));
  }

  return filteredSales;
});

const filteredListings: ComputedRef<Listing[]> = computed(() => {
  let filteredListings = Array.from(Object.values(listingsLatest.value));

  if (settings.value.activity.filterGenOption && settings.value.activity.filterGenOption != "all") {
    if (settings.value.activity.filterGenOption === "watchlist") {
      filteredListings = filteredListings.filter((listing) => watchList.value.has(listing.token.contract_address + listing.token.name));
    } else if (settings.value.activity.filterGenOption === "eth") {
      filteredListings = filteredListings.filter((listing) => normalizeTokenSymbol(listing.payment_token.symbol) == "ETH");
    } else {
      filteredListings = filteredListings.filter((listing) => !getFreeCollections().includes(listing.token.contract_address));
    }
  }

  if (searchTerm.value.trim() !== "") {
    filteredListings = filteredListings.filter((listing) => (listing.token.name.toLowerCase() + listing.token.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")).includes(searchTerm.value.toLowerCase()));
  }

  return filteredListings;
});

const filteredMints: ComputedRef<Mint[]> = computed(() => {
  let filteredMints = Array.from(Object.values(mintsLatest.value));

  if (settings.value.activity.filterGenOption && settings.value.activity.filterGenOption != "all" && settings.value.activity.filterGenOption != "eth") {
    if (settings.value.activity.filterGenOption === "watchlist") {
      filteredMints = filteredMints.filter((mint) => watchList.value.has(mint.token.contract_address + mint.token.name));
    } else {
      filteredMints = filteredMints.filter((mint) => !getFreeCollections().includes(mint.token.contract_address));
    }
  }

  if (searchTerm.value.trim() !== "") {
    filteredMints = filteredMints.filter((mint) => (mint.token.name.toLowerCase() + mint.token.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")).includes(searchTerm.value.toLowerCase()));
  }

  return filteredMints;
});
</script>

<style>
.events-view .searchbar {
  @apply w-fit md:w-full;
}
</style>
