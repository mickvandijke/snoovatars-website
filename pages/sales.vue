<template>
  <div class="relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <div class="px-2 py-2 sticky top-[56px] lg:top-0 lg:relative flex justify-center gap-2 bg-neutral-900/90 backdrop-blur-lg lg:bg-transparent z-10 w-full">
      <input v-model="searchTerm" placeholder="Search name" class="p-2 rounded-md border border-neutral-600/50 bg-neutral-700/50 text-sm focus:outline-none max-w-sm">
      <select v-model="filterOption" class="p-2 rounded-md border border-neutral-600 bg-neutral-700 text-sm focus:outline-none max-w-sm">
        <option value="all">Show All</option>
        <option value="watchlist">Show Watchlist</option>
      </select>
    </div>
    <SalesComponent :items="filteredSales()" class="mt-1 lg:mt-0 px-2 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1" />
  </div>
</template>

<script setup lang="ts">
import {updateSeriesStats, useSeriesStats, useWatchList} from "~/composables/states";
import {SeriesStats} from "~/types/seriesStats";
import {ref} from "#imports";
import {fetchSalesLatest} from "~/composables/api/sales";
import SalesComponent from "~/components/SalesComponent.vue";
import {Ref} from "@vue/reactivity";
import {Sale} from "~/types/sale";

const watchList = useWatchList();

const salesLatest: Ref<Array<Sale>> = ref([]);
const searchTerm = ref<string>("");
const filterOption = ref<string>("all");

await updateSeriesStats();

fetchSalesLatest().then((sales) => {
  salesLatest.value = sales;
});

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
</script>

<style scoped>

</style>
