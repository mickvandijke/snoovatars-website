<template>
  <div class="relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <div class="px-2 py-2 sticky top-[56px] lg:top-0 lg:relative flex justify-center gap-2 bg-neutral-800/90 backdrop-blur-lg lg:bg-transparent z-10 w-full drop-shadow-lg">
      <input v-model="searchTerm" placeholder="Search name" class="p-2 rounded-md border border-neutral-600/50 bg-neutral-700/50 text-sm focus:outline-none max-w-sm">
      <template v-if="feedView === 'sales'">
        <select v-model="filterOption" class="p-2 rounded-md border border-neutral-600 bg-neutral-700 text-sm focus:outline-none max-w-sm">
          <option value="all">Show All</option>
          <option value="watchlist">Show Watchlist</option>
        </select>
      </template>
      <select v-model="feedView" class="p-2 rounded-md border border-neutral-600 bg-neutral-700 text-sm focus:outline-none max-w-sm">
        <option value="sales">Latest Sales</option>
        <option value="mints">Latest Mints</option>
      </select>
    </div>
    <template v-if="feedView === 'sales'">
      <SalesComponent :items="filteredSales()" class="mt-1 lg:mt-0 px-2 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1" />
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

const watchList = useWatchList();

const salesLatest: Ref<Array<Sale>> = ref([]);
const mintsLatest: Ref<Array<Mint>> = ref([]);
const searchTerm = ref<string>("");
const filterOption = ref<string>("all");
const feedView = ref<string>("sales");

await updateSeriesStats();

updateSales();
updateMints();

watch([feedView], () => {
  if (feedView.value === "sales") {
    updateSales();
  } else {
    updateMints();
  }
})

function updateSales() {
  fetchSalesLatest().then((sales) => {
    salesLatest.value = sales;
  });
}

function updateMints() {
  fetchMintsLatest().then((mints) => {
    mintsLatest.value = mints;
  });
}

function filteredSales(): Sale[] {
  let filteredSales = Array.from(Object.values(salesLatest.value));

  if (filterOption.value == "watchlist") {
    filteredSales = filteredSales.filter((sale) => watchList.value.has(sale.token.name));
  }

  if (searchTerm.value.trim() !== "") {
    filteredSales = filteredSales.filter((sale) => sale.token.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
  }

  return filteredSales;
}

function filteredMints(): Mint[] {
  let filteredMints = Array.from(Object.values(mintsLatest.value));

  if (searchTerm.value.trim() !== "") {
    filteredMints = filteredMints.filter((mint) => mint.token.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
  }

  return filteredMints;
}
</script>

<style scoped>

</style>
