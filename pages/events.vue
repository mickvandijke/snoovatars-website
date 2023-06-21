<template>
  <div class="relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <MenuBar>
      <input v-model="searchTerm" placeholder="Search filter" class="p-2 rounded-md bg-neutral-800 text-sm border-none focus:outline-none max-w-sm">
      <select v-model="settings.activity.filterGenOption" class="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm border-none focus:outline-none max-w-sm overflow-x-hidden">
        <option value="all">Show All</option>
        <option value="premium">Show Premium Only</option>
      </select>
      <select v-model="settings.activity.feedView" class="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm border-none focus:outline-none max-w-sm overflow-x-hidden">
        <option value="sales">Latest Sales</option>
        <option value="listings">Latest Listings</option>
        <option value="mints">Latest Mints</option>
      </select>
      <template v-if="!Capacitor.isNativePlatform()">
        <button @click="refresh()" :disabled="isRefreshing" class="p-2 whitespace-nowrap bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-white font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer" :class="{ 'loading': isRefreshing }">
          <ArrowPathIcon class="w-5 h-5" />
        </button>
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
  useSeriesStats, useSettings,
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
import {ArrowPathIcon} from "@heroicons/vue/24/solid";
import {Listing} from "~/types/listing";
import {fetchListingsLatest} from "~/composables/api/listings";
import {Capacitor} from "@capacitor/core";
import {PremiumCollections} from "~/global/generations";
import {ComputedRef} from "vue";

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
    useSeriesStats().value = seriesStats;
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
    filteredSales = filteredSales.filter((sale) => PremiumCollections.includes(sale.token.contract_address));
  }

  if (searchTerm.value.trim() !== "") {
    filteredSales = filteredSales.filter((sale) => (sale.token.name.toLowerCase() + sale.token.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")).includes(searchTerm.value.toLowerCase()));
  }

  return filteredSales;
});

const filteredListings: ComputedRef<Listing[]> = computed(() => {
  let filteredListings = Array.from(Object.values(listingsLatest.value));

  if (settings.value.activity.filterGenOption && settings.value.activity.filterGenOption != "all") {
    filteredListings = filteredListings.filter((listing) => PremiumCollections.includes(listing.token.contract_address));
  }

  if (searchTerm.value.trim() !== "") {
    filteredListings = filteredListings.filter((listing) => (listing.token.name.toLowerCase() + listing.token.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")).includes(searchTerm.value.toLowerCase()));
  }

  return filteredListings;
});

const filteredMints: ComputedRef<Mint[]> = computed(() => {
  let filteredMints = Array.from(Object.values(mintsLatest.value));

  if (settings.value.activity.filterGenOption && settings.value.activity.filterGenOption != "all") {
    filteredMints = filteredMints.filter((mint) => PremiumCollections.includes(mint.token.contract_address));
  }

  if (searchTerm.value.trim() !== "") {
    filteredMints = filteredMints.filter((mint) => (mint.token.name.toLowerCase() + mint.token.name.toLowerCase().replace(/[^a-zA-Z ]/g, "")).includes(searchTerm.value.toLowerCase()));
  }

  return filteredMints;
});
</script>

<style scoped>

</style>
