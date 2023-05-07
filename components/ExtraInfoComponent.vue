<template>
  <div class="px-4 py-3 flex flex-col gap-4 bg-neutral-800 rounded-lg">
    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1 text-xs font-semibold">
        <div class="flex items-center">
          <div class="text-neutral-400">Collection:</div>
          <div class="pl-0.5 flex gap-0.5 items-center">
            <a :href="`https://opensea.io/collection/${seriesStats?.collection.slug}`" target="_blank" class="text-amber-500">{{ seriesStats.collection.name.replace("x Reddit Collectible Avatars", "") }}</a>
          </div>
        </div>
        <div class="flex items-center">
          <div class="text-neutral-400">Total Shop:</div>
          <div class="pl-0.5 flex gap-0.5 items-center">
            <div class="text-neutral-200">{{ seriesStats.series.total_quantity }}</div>
          </div>
        </div>
        <div class="flex items-center">
          <div class="text-neutral-400">Total Minted (DELAYED):</div>
          <div class="pl-0.5 flex gap-0.5 items-center">
            <div class="text-neutral-200">{{ seriesStats.series.total_sold }}</div>
          </div>
        </div>
        <div class="flex items-center">
          <div class="text-neutral-400">Total Volume:</div>
          <div class="pl-0.5 flex gap-0.5 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
            <div class="text-neutral-200">{{ (seriesStats.stats.total_volume / 1000000000000000000).toFixed(2) }}</div>
            <div class="text-neutral-200">({{ ethereumInLocalCurrency(seriesStats.stats.total_volume, true) }})</div>
          </div>
        </div>
        <template v-if="seriesStats.stats.lowest_listing">
          <div class="flex items-center">
            <div class="text-neutral-400">Market Cap:</div>
            <div class="pl-0.5 flex gap-0.5 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="text-neutral-200">{{ (seriesStats.series.total_sold * seriesStats.stats.lowest_listing?.payment_token.base_price / 1000000000000000000).toFixed(2) }}</div>
              <div class="text-neutral-200">({{ ethereumInLocalCurrency(seriesStats.series.total_sold * seriesStats.stats.lowest_listing?.payment_token.base_price, true) }})</div>
            </div>
          </div>
        </template>
        <template v-if="seriesStats.stats.weekly_average_price">
          <div class="flex items-center">
            <div class="text-neutral-400">7D Average Price:</div>
            <div class="pl-0.5 flex gap-0.5 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="text-neutral-200">{{ (seriesStats.stats.weekly_average_price).toFixed(4) }}</div>
              <div class="text-neutral-200">({{ ethereumInLocalCurrency(seriesStats.stats.weekly_average_price) }})</div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <h1 class="text-xs text-neutral-400 font-bold">Average Price:</h1>
      <SalesChart :sales="sales" />
    </div>
    <div class="flex flex-col gap-2">
      <h1 class="text-xs text-neutral-400 font-bold">All Sales:</h1>
      <table class="w-full text-xs">
        <thead>
        <tr class="border-b border-neutral-600 text-neutral-200">
          <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': sortColumn === 'payment_token.base_price' }" @click="sortSales('payment_token.base_price')">Price</th>
          <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': sortColumn === 'token.mint_number' }" @click="sortSales('token.mint_number')">Mint</th>
          <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': sortColumn === 'buyer' }" @click="sortSales('buyer')">Buyer</th>
          <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': sortColumn === 'date_sold' }" @click="sortSales('date_sold')">Date</th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(sale, index) in slicedSales" :key="index">
          <tr class="border-b border-neutral-600 hover:bg-neutral-900 text-neutral-200">
            <td class="px-2 py-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              <span>{{ (sale.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }} {{ sale.payment_token.symbol }}</span>
              <template v-if="sale.payment_token.symbol === 'ETH'">
                <span> ({{ ethereumInLocalCurrency(sale.payment_token.base_price) }})</span>
              </template>
            </td>
            <td class="px-2 py-1">
              <a :href="`https://opensea.io/assets/matic/${sale.token.contract_address}/${sale.token.id}`" target="_blank" class="text-amber-500">#{{ sale.token.mint_number }}</a>
            </td>
            <td class="px-2 py-1">
              <a :href="`https://opensea.io/${sale.buyer}`" target="_blank" class="text-amber-500">{{ sale.buyer.slice(2, 5) }}</a>
            </td>
            <td class="px-2 py-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(sale.date_sold)) }}</td>
          </tr>
        </template>
        </tbody>
      </table>
      <div class="flex justify-center mt-2">
        <Pagination :total-items="sales.length" :page-size="pageSize" v-model:current-page="currentPage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Ref} from "@vue/reactivity";
import {Sale} from "~/types/sale";
import {computed, onBeforeMount, ref} from "#imports";
import {fetchSalesForSeries} from "~/composables/api/sales";
import {ethereumInLocalCurrency} from "#imports";
import {PropType} from "@vue/runtime-core";
import {SeriesStats} from "~/types/seriesStats";

const sales: Ref<Array<Sale>> = ref([]);
const sortColumn = ref('date_sold');
const sortDirection = ref('desc');

const props = defineProps({
  seriesStats: {
    type: Object as PropType<SeriesStats>,
    required: true
  },
  contract: {
    type: String,
    required: true
  },
  series: {
    type: String,
    required: true
  }
});

const pageSize = 5;
const currentPage = ref(1);

const slicedSales = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return sortedSales().slice(start, end);
});

function sortedSales(): Sale[] {
  return sales.value.sort((a, b) => {
    let aValue = a[sortColumn.value];
    let bValue = b[sortColumn.value];

    if (sortColumn.value === "payment_token.base_price") {
      aValue = a.payment_token.base_price;
      bValue = b.payment_token.base_price;
    } else if (sortColumn.value === "token.mint_number") {
      aValue = a.token.mint_number;
      bValue = b.token.mint_number;
    }

    if (aValue > bValue) {
      return sortDirection.value === 'asc' ? 1 : -1;
    } else if (aValue < bValue) {
      return sortDirection.value === 'asc' ? -1 : 1;
    } else {
      return 0;
    }
  });
}

function sortSales(column: string) {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
}

onBeforeMount(() => {
  fetchSalesForSeries(props.contract, props.series).then((seriesSales) => {
    sales.value = seriesSales;
  });
});
</script>
