<template>
  <!-- The overlay is used to cover the main content when the drawer is open -->
  <div class="fixed inset-0 bg-black opacity-50 z-40" v-if="open()" @click="close"></div>

  <!-- The drawer content -->
  <transition name="slide">
    <div v-if="open()" class="fixed top-0 left-0 sm:right-0 sm:left-auto h-full overflow-y-auto scrollbar-hide w-96 max-w-[95%] bg-neutral-900 shadow-lg z-50" :class="{ 'page-mobile-padding-top page-mobile-padding-bottom': Capacitor.isNativePlatform() }">
      <!-- Add your drawer content here -->
      <div class="p-4 sticky top-0 flex items-center justify-center bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-800 z-10">
        <span class="text-neutral-400 font-semibold">{{ selectedAvatar.series }}</span>
        <XMarkIcon @click="close" class="absolute right-4 w-7 h-7 text-neutral-400 opacity-50 hover:opacity-100 cursor-pointer duration-200" />
      </div>
      <div class="px-6 py-4 w-full flex flex-col items-center gap-6">
        <div class="relative max-w-[18rem]">
          <img :src="avatarImage" class="blur opacity-50">
          <img :src="avatarImage" class="absolute inset-0">
        </div>
        <div class="flex flex-col items-center gap-3">
          <h2 class="text-neutral-400">{{ selectedAvatar.series }}</h2>
          <div class="flex gap-2 text-sm">
            <div class="p-2 border border-neutral-800 rounded-lg">
              <span class="text-neutral-400">${{ selectedAvatar.seriesStats.series.mint_price / 100 }}</span>
            </div>
            <div class="p-2 border border-neutral-800 rounded-lg">
              <span class="text-neutral-400">{{ selectedAvatar.seriesStats.series.status.toUpperCase().replace("_", " ") }}</span>
            </div>
            <div class="px-3 py-2 border rounded-lg" :class="getMintClasses(selectedAvatar.seriesStats.series.total_quantity)">
              <span>{{ Math.max(selectedAvatar.seriesStats.series.total_quantity, selectedAvatar.seriesStats.series.total_sold) }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2 w-full">
          <div class="flex flex-col gap-2">
            <div @click="settings.extraInfoOptions.marketData = !settings.extraInfoOptions.marketData" class="px-2 flex justify-between items-center text-neutral-500 hover:text-white cursor-pointer duration-200">
              <h1>Advanced Details</h1>
              <ChevronDownIcon class="w-6 h-6" :class="{ 'rotate-90': !settings.extraInfoOptions.marketData }" />
            </div>
            <template v-if="settings.extraInfoOptions.marketData">
              <div class="p-4 border border-neutral-800 flex flex-col gap-1 text-xs font-semibold rounded-lg">
                <div class="flex items-center">
                  <div class="text-neutral-400">Name:</div>
                  <div class="pl-0.5 flex gap-0.5 items-center">
                    <button @click="openLinkWith(`https://opensea.io/collection/${seriesStats.collection.slug}?search[query]=${seriesStats.series.name}`)" class="text-amber-500" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ seriesStats.series.name }}</button>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="text-neutral-400">Collection:</div>
                  <div class="pl-0.5 flex gap-0.5 items-center overflow-hidden w-full truncate">
                    <button @click="openLinkWith(`https://opensea.io/collection/${seriesStats?.collection.slug}`)" class="text-amber-500">{{ seriesStats.collection.name.replace("x Reddit Collectible Avatars", "") }}</button>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="text-neutral-400">Artist:</div>
                  <div class="pl-0.5 flex gap-0.5 items-center">
                    <a :href="`https://reddit.com/u/${seriesStats?.collection.artist.displayName}`" target="_blank" class="text-amber-500">{{ seriesStats.collection.artist.displayName }}</a>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="text-neutral-400">Shop Supply:</div>
                  <div class="pl-0.5 flex gap-0.5 items-center">
                    <div class="text-neutral-200">{{ seriesStats.series.total_quantity }}</div>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="text-neutral-400">Total Minted:</div>
                  <div class="pl-0.5 flex gap-0.5 items-center">
                    <div class="text-neutral-200">{{ seriesStats.series.total_sold }}</div>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="text-neutral-400">Listed:</div>
                  <div class="pl-0.5 flex gap-0.5 items-center">
                    <div class="text-neutral-200">{{ seriesStats.stats.listed_percentage.toFixed(2) }}%</div>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="text-neutral-400">24h Volume:</div>
                  <div class="pl-0.5 flex gap-0.5 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                    <div class="text-neutral-200">{{ (seriesStats.stats.daily_volume).toFixed(2) }}</div>
                    <span class="text-neutral-500 font-bold">(<span class="text-amber-500">{{ ethereumInLocalCurrency(seriesStats.stats.daily_volume * 1000000000000000000, true) }}</span>)</span>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="text-neutral-400">Total Volume:</div>
                  <div class="pl-0.5 flex gap-0.5 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                    <div class="text-neutral-200">{{ (seriesStats.stats.total_volume / 1000000000000000000).toFixed(2) }}</div>
                    <span class="text-neutral-500 font-bold">(<span class="text-amber-500">{{ ethereumInLocalCurrency(seriesStats.stats.total_volume, true) }}</span>)</span>
                  </div>
                </div>
                <template v-if="seriesStats.stats.lowest_listing">
                  <div class="flex items-center">
                    <div class="text-neutral-400">Market Cap:</div>
                    <div class="pl-0.5 flex gap-0.5 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="text-neutral-200">{{ (seriesStats.series.total_sold * seriesStats.stats.lowest_listing?.payment_token.base_price / 1000000000000000000).toFixed(2) }}</div>
                      <span class="text-neutral-500 font-bold">(<span class="text-amber-500">{{ ethereumInLocalCurrency(seriesStats.series.total_sold * seriesStats.stats.lowest_listing?.payment_token.base_price, true) }}</span>)</span>
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
                  <div class="text-neutral-400">Last 5 Sales Avg:</div>
                  <div class="pl-0.5 flex gap-0.5 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                    <div class="text-neutral-200">{{ (seriesStats.stats.five_last_sales_average).toFixed(4) }}</div>
                    <span class="text-neutral-500 font-bold">(<span class="text-amber-500">{{ ethereumInLocalCurrency(seriesStats.stats.five_last_sales_average * 1000000000000000000) }}</span>)</span>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="text-neutral-400">7D Avg Sale Price:</div>
                  <div class="pl-0.5 flex gap-0.5 items-center">
                    <template v-if="seriesStats.stats.weekly_average_price">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="text-neutral-200">{{ (seriesStats.stats.weekly_average_price).toFixed(4) }}</div>
                      <span class="text-neutral-500 font-bold">(<span class="text-amber-500">{{ ethereumInLocalCurrency(seriesStats.stats.weekly_average_price * 1000000000000000000) }}</span>)</span>
                    </template>
                    <template v-else>
                      <span class="text-neutral-500 italic">No sales.</span>
                    </template>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="text-neutral-400">14D Avg Sale Price:</div>
                  <div class="pl-0.5 flex gap-0.5 items-center">
                    <template v-if="seriesStats.stats.two_weekly_average_price">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="text-neutral-200">{{ (seriesStats.stats.two_weekly_average_price).toFixed(4) }}</div>
                      <span class="text-neutral-500 font-bold">(<span class="text-amber-500">{{ ethereumInLocalCurrency(seriesStats.stats.two_weekly_average_price * 1000000000000000000) }}</span>)</span>
                    </template>
                    <template v-else>
                      <span class="text-neutral-500 italic">No sales.</span>
                    </template>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="text-neutral-400">30D Avg Sale Price:</div>
                  <div class="pl-0.5 flex gap-0.5 items-center">
                    <template v-if="seriesStats.stats.monthly_average_price">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="text-neutral-200">{{ (seriesStats.stats.monthly_average_price).toFixed(4) }}</div>
                      <span class="text-neutral-500 font-bold">(<span class="text-amber-500">{{ ethereumInLocalCurrency(seriesStats.stats.monthly_average_price * 1000000000000000000) }}</span>)</span>
                    </template>
                    <template v-else>
                      <span class="text-neutral-500 italic">No sales.</span>
                    </template>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <template v-if="listings">
            <div class="flex flex-col gap-2">
              <div @click="settings.extraInfoOptions.listings = !settings.extraInfoOptions.listings" class="px-2 group flex justify-between items-center text-neutral-500 hover:text-white cursor-pointer duration-200">
                <h1>All Listings <NuxtLink to="/upgrade" class="group-hover:text-amber-500 italic font-bold duration-200">Pro</NuxtLink></h1>
                <ChevronDownIcon class="w-6 h-6" :class="{ 'rotate-90': !settings.extraInfoOptions.listings }" />
              </div>
              <template v-if="settings.extraInfoOptions.listings">
                <template v-if="user?.tier > 0">
                  <div class="p-4 border border-neutral-800 rounded-lg">
                    <div class="overflow-x-auto">
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
                              <button @click="openLinkWith(`https://opensea.io/assets/matic/${listing.token.contract_address}/${listing.token.id}`)" class="text-amber-500">#{{ listing.token.mint_number }}</button>
                            </td>
                            <td class="px-2 py-1">
                              <button @click="openLinkWith(`https://opensea.io/${listing.maker_address}`)" class="text-amber-500">{{ listing.maker_address.slice(2, 5) }}</button>
                            </td>
                            <td class="px-2 py-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(listing.date_listed)) }}</td>
                          </tr>
                        </template>
                        </tbody>
                      </table>
                    </div>
                    <div class="flex justify-center mt-2">
                      <Pagination :total-items="listings.length" :page-size="pageSize" v-model:current-page="listingsCurrentPage" />
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="p-4 flex flex-col items-center text-center gap-2 border border-neutral-800 rounded-lg">
                    <div class="text-neutral-300">Please upgrade to <NuxtLink to="/upgrade" class="text-amber-500 font-bold italic">Pro</NuxtLink> to browse and sort through all listings.</div>
                    <NuxtLink to="/upgrade" class="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg">Upgrade</NuxtLink>
                  </div>
                </template>
              </template>
            </div>
          </template>
          <template v-if="sales">
            <div class="flex flex-col gap-2">
              <div @click="settings.extraInfoOptions.salesGraph = !settings.extraInfoOptions.salesGraph" class="px-2 group flex justify-between items-center text-neutral-500 hover:text-white cursor-pointer duration-200">
                <h1>Sales Chart</h1>
                <ChevronDownIcon class="w-6 h-6" :class="{ 'rotate-90': !settings.extraInfoOptions.salesGraph }" />
              </div>
              <template v-if="settings.extraInfoOptions.salesGraph">
                <SalesChart :sales="sales" class="p-4 border border-neutral-800 rounded-lg" />
              </template>
            </div>
            <div class="flex flex-col gap-2">
              <div @click="settings.extraInfoOptions.sales = !settings.extraInfoOptions.sales" class="px-2 group flex justify-between items-center text-neutral-500 hover:text-white cursor-pointer duration-200">
                <h1>All Sales</h1>
                <ChevronDownIcon class="w-6 h-6" :class="{ 'rotate-90': !settings.extraInfoOptions.sales }" />
              </div>
              <template v-if="settings.extraInfoOptions.sales">
                <div class="p-4 border border-neutral-800 rounded-lg">
                  <div class="overflow-x-auto">
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
                            <button @click="openLinkWith(`https://opensea.io/assets/matic/${sale.token.contract_address}/${sale.token.id}`)" class="text-amber-500">#{{ sale.token.mint_number }}</button>
                          </td>
                          <td class="px-2 py-1">
                            <button @click="openLinkWith(`https://opensea.io/${sale.buyer}`)" class="text-amber-500">{{ sale.buyer.slice(2, 5) }}</button>
                          </td>
                          <td class="px-2 py-1" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(sale.date_sold)) }}</td>
                        </tr>
                      </template>
                      </tbody>
                    </table>
                  </div>
                  <div class="flex justify-center mt-2">
                    <Pagination :total-items="sales.length" :page-size="pageSize" v-model:current-page="salesCurrentPage" />
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {useEthereumUsdPrice, useSelectedAvatar, useSettings, useUser} from "#imports";
import {XMarkIcon, ChevronDownIcon} from "@heroicons/vue/24/solid";
import {getTokenImage} from "~/global/utils";
import {Ref} from "@vue/reactivity";
import {Sale} from "~/types/sale";
import {Listing} from "~/types/listing";
import {fetchListingsForSeries} from "~/composables/api/listings";
import {fetchSalesForSeries} from "~/composables/api/sales";
import {Capacitor} from "@capacitor/core";

const selectedAvatar = useSelectedAvatar();
const ethereumPriceInUsd = useEthereumUsdPrice();
const user = useUser();
const settings = useSettings();

const pageSize = 5;
const sales: Ref<Array<Sale>> = ref([]);
const salesSortColumn = ref('date_sold');
const salesSortDirection = ref('desc');
const salesCurrentPage = ref(1);

const listings: Ref<Array<Listing>> = ref([]);
const listingsSortColumn = ref('payment_token.base_price');
const listingsSortDirection = ref('asc');
const listingsCurrentPage = ref(1);

watch([selectedAvatar], () => {
  if (selectedAvatar.value) {
    refresh();
  }
});

function open() {
  return !!selectedAvatar.value;
}

function close() {
  selectedAvatar.value = null;
}

const avatarImage = computed(() => {
  return getTokenImage(selectedAvatar.value.seriesStats.series.image);
});

const seriesStats = computed(() => {
  return selectedAvatar.value.seriesStats;
});

const contract = computed(() => {
  return selectedAvatar.value.contract;
});

const series = computed(() => {
  return selectedAvatar.value.series;
});

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

function refresh() {
  if (user.value?.tier > 0) {
    fetchListingsForSeries(contract.value, series.value).then((seriesListings) => {
      listings.value = seriesListings;
    });
  }

  fetchSalesForSeries(contract.value, series.value).then((seriesSales) => {
    sales.value = seriesSales;
  });
}

function getMintClasses(totalQuantity: number) {
  if (totalQuantity <= 250) {
    return ["bg-yellow-500/10 text-yellow-500 border-yellow-500/50"];
  } else if (totalQuantity <= 777) {
    return ["bg-gray-300/10 text-gray-300 border-gray-300/50"];
  } else {
    return ["bg-neutral-400/10 text-neutral-400 border-neutral-400/50"];
  }
}
</script>

<style scoped>
.slide-enter-active {
  transition: all 0.2s ease-in-out;
}

.slide-leave-active {
  transition: all 0.2s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-240px);
  opacity: 0;
}

@media screen and (min-width: 640px) {
  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(240px);
  }
}

/* For Webkit-based browsers (Chrome, Safari and Opera) */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
