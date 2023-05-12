<template>
  <div class="px-4 py-3 flex flex-col gap-2 bg-neutral-800/75 rounded-lg">
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <h1 class="text-xs text-neutral-200 font-bold">Advanced Details:</h1>
        <label class="relative flex justify-between items-center group p-1 cursor-pointer">
          <input v-model="options.marketData" type="checkbox" class="px-0 absolute peer appearance-none border-none" />
          <span class="w-8 h-5 flex items-center flex-shrink-0 ml-2 p-0.5 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-3 group-hover:after:translate-x-1"></span>
        </label>
      </div>
      <template v-if="options.marketData">
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
            <div class="text-neutral-400">24h Volume:</div>
            <div class="pl-0.5 flex gap-0.5 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="text-neutral-200">{{ (seriesStats.stats.daily_volume).toFixed(2) }}</div>
              <div class="text-neutral-200">({{ ethereumInLocalCurrency(seriesStats.stats.daily_volume * 1000000000000000000, true) }})</div>
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
            <div class="flex items-center">
              <div class="text-neutral-400">Floor / Mint Percentage:</div>
              <div class="pl-0.5 flex gap-0.5 items-center">
                <div class="text-neutral-200">{{ Math.round(((seriesStats.stats.lowest_listing?.payment_token.base_price / 1000000000000000000) * ethereumPriceInUsd) / (seriesStats.series.mint_price / 100) * 100) }}%</div>
              </div>
            </div>
          </template>
          <div class="flex items-center">
            <div class="text-neutral-400">5 Last Sales Avg:</div>
            <div class="pl-0.5 flex gap-0.5 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="text-neutral-200">{{ (seriesStats.stats.five_last_sales_average).toFixed(4) }}</div>
              <div class="text-neutral-200">({{ ethereumInLocalCurrency(seriesStats.stats.five_last_sales_average * 1000000000000000000) }})</div>
            </div>
          </div>
          <template v-if="seriesStats.stats.weekly_average_price">
            <div class="flex items-center">
              <div class="text-neutral-400">7D Avg Sale Price:</div>
              <div class="pl-0.5 flex gap-0.5 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                <div class="text-neutral-200">{{ (seriesStats.stats.weekly_average_price).toFixed(4) }}</div>
                <div class="text-neutral-200">({{ ethereumInLocalCurrency(seriesStats.stats.weekly_average_price * 1000000000000000000) }})</div>
              </div>
            </div>
          </template>
          <template v-if="seriesStats.stats.two_weekly_average_price">
            <div class="flex items-center">
              <div class="text-neutral-400">14D Avg Sale Price:</div>
              <div class="pl-0.5 flex gap-0.5 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                <div class="text-neutral-200">{{ (seriesStats.stats.two_weekly_average_price).toFixed(4) }}</div>
                <div class="text-neutral-200">({{ ethereumInLocalCurrency(seriesStats.stats.two_weekly_average_price * 1000000000000000000) }})</div>
              </div>
            </div>
          </template>
          <template v-if="seriesStats.stats.monthly_average_price">
            <div class="flex items-center">
              <div class="text-neutral-400">30D Avg Sale Price:</div>
              <div class="pl-0.5 flex gap-0.5 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                <div class="text-neutral-200">{{ (seriesStats.stats.monthly_average_price).toFixed(4) }}</div>
                <div class="text-neutral-200">({{ ethereumInLocalCurrency(seriesStats.stats.monthly_average_price * 1000000000000000000) }})</div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
    <template v-if="listings">
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <h1 class="text-xs text-neutral-200 font-bold">All Listings:</h1>
          <label class="relative flex justify-between items-center group p-1 cursor-pointer">
            <input v-model="options.listings" type="checkbox" class="px-0 absolute peer appearance-none border-none" />
            <span class="w-8 h-5 flex items-center flex-shrink-0 ml-2 p-0.5 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-3 group-hover:after:translate-x-1"></span>
          </label>
        </div>
        <template v-if="options.listings">
          <table class="w-full text-xs">
            <thead>
            <tr class="border-b border-neutral-600 text-neutral-200">
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortColumn === 'payment_token.base_price' }" @click="sortListings('payment_token.base_price')">Price</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortColumn === 'token.mint_number' }" @click="sortListings('token.mint_number')">Mint</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortColumn === 'maker_address' }" @click="sortListings('maker_address')">Seller</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': listingsSortColumn === 'date_listed' }" @click="sortListings('date_listed')">Date</th>
            </tr>
            </thead>
            <tbody>
            <template v-for="(listing, index) in slicedListings" :key="index">
              <tr class="border-b border-neutral-600 hover:bg-neutral-900 text-neutral-200">
                <td class="px-2 py-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  <span>{{ (listing.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }} {{ listing.payment_token.symbol }}</span>
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
          <div class="flex justify-center mt-2">
            <Pagination :total-items="listings.length" :page-size="pageSize" v-model:current-page="listingsCurrentPage" />
          </div>
        </template>
      </div>
    </template>
    <template v-if="sales">
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <h1 class="text-xs text-neutral-200 font-bold">Average Sale Price:</h1>
          <label class="relative flex justify-between items-center group p-1 cursor-pointer">
            <input v-model="options.salesGraph" type="checkbox" class="px-0 absolute peer appearance-none border-none" />
            <span class="w-8 h-5 flex items-center flex-shrink-0 ml-2 p-0.5 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-3 group-hover:after:translate-x-1"></span>
          </label>
        </div>
        <template v-if="options.salesGraph">
          <SalesChart :sales="sales" />
        </template>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <h1 class="text-xs text-neutral-200 font-bold">All Sales:</h1>
          <label class="relative flex justify-between items-center group p-1 cursor-pointer">
            <input v-model="options.sales" type="checkbox" class="px-0 absolute peer appearance-none border-none" />
            <span class="w-8 h-5 flex items-center flex-shrink-0 ml-2 p-0.5 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-3 group-hover:after:translate-x-1"></span>
          </label>
        </div>
        <template v-if="options.sales">
          <table class="w-full text-xs">
            <thead>
            <tr class="border-b border-neutral-600 text-neutral-200">
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': salesSortColumn === 'payment_token.base_price' }" @click="sortSales('payment_token.base_price')">Price</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': salesSortColumn === 'token.mint_number' }" @click="sortSales('token.mint_number')">Mint</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': salesSortColumn === 'buyer' }" @click="sortSales('buyer')">Buyer</th>
              <th class="text-left px-2 py-1 cursor-pointer" :class="{ 'text-amber-500': salesSortColumn === 'date_sold' }" @click="sortSales('date_sold')">Date</th>
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
            <Pagination :total-items="sales.length" :page-size="pageSize" v-model:current-page="salesCurrentPage" />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {Ref} from "@vue/reactivity";
import {Sale} from "~/types/sale";
import {computed, onBeforeMount, ref, useEthereumUsdPrice, watch} from "#imports";
import {fetchSalesForSeries} from "~/composables/api/sales";
import {ethereumInLocalCurrency} from "#imports";
import {PropType} from "@vue/runtime-core";
import {SeriesStats} from "~/types/seriesStats";
import {fetchListingsForSeries} from "~/composables/api/listings";
import {Listing} from "~/types/listing";
import {ExtraInfoOptions} from "~/types/extra_info";
import {useExtraInfoOptions, updateExtraInfoOptions} from "~/composables/states";

const ethereumPriceInUsd = useEthereumUsdPrice();

const pageSize = 5;
const options: Ref<ExtraInfoOptions> = ref(JSON.parse(JSON.stringify(useExtraInfoOptions().value)));

const sales: Ref<Array<Sale>> = ref([]);
const salesSortColumn = ref('date_sold');
const salesSortDirection = ref('desc');
const salesCurrentPage = ref(1);

const listings: Ref<Array<Listing>> = ref([]);
const listingsSortColumn = ref('payment_token.base_price');
const listingsSortDirection = ref('asc');
const listingsCurrentPage = ref(1);

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

watch(options, () => {
  updateExtraInfoOptions(options.value);
}, { deep: true });

const slicedSales = computed(() => {
  const start = (salesCurrentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return sortedSales().slice(start, end);
});

function sortedSales(): Sale[] {
  return sales.value.sort((a, b) => {
    let aValue = a[salesSortColumn.value];
    let bValue = b[salesSortColumn.value];

    if (salesSortColumn.value === "payment_token.base_price") {
      aValue = a.payment_token.base_price;
      bValue = b.payment_token.base_price;
    } else if (salesSortColumn.value === "token.mint_number") {
      aValue = a.token.mint_number;
      bValue = b.token.mint_number;
    }

    if (aValue > bValue) {
      return salesSortDirection.value === 'asc' ? 1 : -1;
    } else if (aValue < bValue) {
      return salesSortDirection.value === 'asc' ? -1 : 1;
    } else {
      return 0;
    }
  });
}

function sortSales(column: string) {
  if (salesSortColumn.value === column) {
    salesSortDirection.value = salesSortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    salesSortColumn.value = column;
    salesSortDirection.value = 'asc';
  }

  salesCurrentPage.value = 1;
}

const slicedListings = computed(() => {
  const start = (listingsCurrentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return sortedListings().slice(start, end);
});

function sortedListings(): Listing[] {
  return listings.value.sort((a, b) => {
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
}

function sortListings(column: string) {
  if (listingsSortColumn.value === column) {
    listingsSortDirection.value = listingsSortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    listingsSortColumn.value = column;
    listingsSortDirection.value = 'asc';
  }

  listingsCurrentPage.value = 1;
}


onBeforeMount(() => {
  fetchListingsForSeries(props.contract, props.series).then((seriesListings) => {
    listings.value = seriesListings;
  });

  fetchSalesForSeries(props.contract, props.series).then((seriesSales) => {
    sales.value = seriesSales;
  });
});
</script>
