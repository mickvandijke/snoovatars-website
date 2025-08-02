<template>
  <div class="space-y-0 sm:space-y-1">
    <template v-if="sortingOnShop">
      <!-- Shop Mode Stats -->
      <!-- Stock Info -->
      <div class="flex items-center justify-between text-xs">
        <span class="text-zinc-500">Stock</span>
        <span class="font-medium text-white">{{ Math.max((item.series.total_quantity - item.series.total_sold), 0) }} left</span>
      </div>
      
      <!-- Progress Info -->
      <div class="flex items-center justify-between text-xs">
        <span class="text-zinc-500">Progress</span>
        <span class="font-medium text-blue-400">{{ Math.round((item.series.total_sold / item.series.total_quantity) * 100 ) }}%</span>
      </div>
      
      <!-- Progress Bar -->
      <div class="w-full bg-white/10 rounded-full overflow-hidden h-1">
        <div 
          class="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300" 
          :style="{ 'width': `${Math.min(100, Math.round((item.series.total_sold / item.series.total_quantity) * 100 ))}%` }"
        ></div>
      </div>
      
      <!-- Next Mint / Status -->
      <div class="flex items-center justify-between text-xs pt-1 border-t border-white/10">
        <span class="text-zinc-500">Status</span>
        <template v-if="item.series.total_sold < item.series.total_quantity">
          <span class="text-blue-400 font-medium">#{{ item.series.total_quantity - (item.series.total_quantity - item.series.total_sold) + 1 }}</span>
        </template>
        <template v-else>
          <span class="text-red-400 font-medium">Sold Out</span>
        </template>
      </div>
    </template>
    
    <template v-else>
      <!-- Regular Mode Stats -->
      <!-- Floor Price -->
      <div class="flex items-center justify-between text-xs">
        <span class="text-zinc-500">Floor</span>
        <template v-if="lowestListing">
          <ListingPrice :listing="lowestListing" variant="default" class="text-xs font-medium" />
        </template>
        <template v-else>
          <span class="text-zinc-600">—</span>
        </template>
      </div>
      
      <!-- Last Sale -->
      <div class="flex items-center justify-between text-xs">
        <span class="text-zinc-500">Last Sale</span>
        <template v-if="item.stats.last_sale">
          <div class="flex items-center gap-1">
            <LastSale :sale="item.stats.last_sale" class="text-xs font-medium" />
            <span class="text-xs font-normal text-zinc-500 sm:hidden">#{{ item.stats.last_sale.token.mint_number }} • {{ $timeAgo(new Date(item.stats.last_sale.date_sold)) }} ago</span>
          </div>
        </template>
        <template v-else>
          <span class="text-zinc-600">—</span>
        </template>
      </div>
      
      <!-- Last Sale Time - Hidden on mobile -->
      <div class="hidden sm:flex items-center justify-end text-xs">
        <template v-if="item.stats.last_sale">
          <span class="text-xs font-normal text-zinc-500">#{{ item.stats.last_sale.token.mint_number }} • {{ $timeAgo(new Date(item.stats.last_sale.date_sold)) }} ago</span>
        </template>
        <template v-else>
          <span class="text-zinc-600">—</span>
        </template>
      </div>
      
      <!-- Dynamic Secondary Stat -->
      <div class="flex items-center justify-between text-xs">
        <template v-if="sorting === 'lowestFloorMintRatio' || sorting === 'highestFloorMintRatio'">
          <span class="text-zinc-500">Profit</span>
          <span :class="{ 'text-green-400': mintProfitInPercentage >= 0, 'text-red-400': mintProfitInPercentage < 0 }" class="font-medium">{{ mintProfitInPercentage }}%</span>
        </template>
        
        <template v-else-if="sorting === 'lowestListedPercentage'">
          <span class="text-zinc-500">Listed</span>
          <span class="font-medium text-white">{{ item.stats.listed_percentage.toFixed(2) }}%</span>
        </template>
        
        <template v-else-if="sorting === 'lowestWeeklyAverage' || sorting === 'highestWeeklyAverage'">
          <span class="text-zinc-500">7d Avg</span>
          <span class="font-medium text-white">{{ (item.stats.weekly_average_price ?? 0).toFixed(3).replace(/\.?0+$/, '') }}</span>
        </template>
        
        <template v-else-if="sorting === 'lowestTwoWeeklyAverage' || sorting === 'highestTwoWeeklyAverage'">
          <span class="text-zinc-500">14d Avg</span>
          <span class="font-medium text-white">{{ (item.stats.two_weekly_average_price ?? 0).toFixed(2) }}</span>
        </template>
        
        <template v-else-if="sorting === 'lowestMonthlyAverage' || sorting === 'highestMonthlyAverage'">
          <span class="text-zinc-500">30d Avg</span>
          <span class="font-medium text-white">{{ (item.stats.monthly_average_price ?? 0).toFixed(2) }}</span>
        </template>
        
        <template v-else-if="sorting === 'artistAsc' || sorting === 'artistDesc'">
          <span class="text-zinc-500">Artist</span>
          <a :href="`https://reddit.com/u/${item.collection.artist.displayName}`" target="_blank" class="font-medium text-blue-400 hover:text-blue-300 transition-colors">{{ item.collection.artist.displayName }}</a>
        </template>
        
        <template v-else-if="sorting === 'lowestDailyVolume' || sorting === 'highestDailyVolume'">
          <span class="text-zinc-500">24h Vol</span>
          <span class="font-medium text-white">{{ item.stats.daily_volume.toFixed(2) }}</span>
        </template>
        
        <template v-else-if="sorting === 'lowestWeeklyVolume' || sorting === 'highestWeeklyVolume'">
          <span class="text-zinc-500">7d Vol</span>
          <span class="font-medium text-white">{{ item.stats.weekly_volume.toFixed(2) }}</span>
        </template>
        
        <template v-else>
          <span class="text-zinc-500">L5SA</span>
          <div class="flex items-center gap-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-2.5 h-2.5 text-zinc-400">
              <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
            </svg>
            <span class="font-medium text-zinc-400">{{ item.stats.five_last_sales_average.toFixed(3).replace(/\.?0+$/, '') }}</span>
            <span class="text-xs font-normal text-zinc-500">({{ fiveSalesFiatPrice }})</span>
          </div>
        </template>
      </div>
      
    </template>
  </div>
</template>

<script setup lang="ts">
import {SeriesStats} from "~/types/seriesStats";
import {PropType} from "@vue/runtime-core";
import {
  useWatchList,
  useEthereumUsdPrice,
  useEthereumPriceMap,
  useSettings
} from "~/composables/states";
import {computed, ethereumInLocalCurrency} from "#imports";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {getLowestListing, getListingAsGweiPrice} from "~/composables/helpers";
import {ClockIcon} from "@heroicons/vue/24/outline";

const watchList = useWatchList();
const ethereumPriceInUsd = useEthereumUsdPrice();
const ethereumPriceMap = useEthereumPriceMap();

const props = defineProps({
  item: {
    type: Object as PropType<SeriesStats>,
    required: true
  },
  sorting: String
});

const sortingOnShop = computed(() => {
  return props.sorting === 'highestShopAvailableAbsolute' || props.sorting === 'lowestShopAvailableAbsolute' || props.sorting === 'highestShopAvailablePercentage' || props.sorting === 'lowestShopAvailablePercentage' || props.sorting === 'lowestShopNextMint';
});

const lowestListing = computed(() => {
  return getLowestListing(props.item);
});

const mintProfitInPercentage = computed(() => {
  return Math.round(((getListingAsGweiPrice(lowestListing.value) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd.value) / (props.item.series.mint_price / 100) * 100 -100);
});


const fiveSalesFiatPrice = computed(() => {
  const ethPrice = props.item.stats.five_last_sales_average;
  const settings = useSettings();
  const currency = settings.value.currency.preferred;
  const ethereumPriceMap = useEthereumPriceMap();
  const exchangeRate = ethereumPriceMap.value.get(currency) ?? 0;
  const fiatValue = ethPrice * exchangeRate;
  
  if (fiatValue >= 1000) {
    const formattedK = new Intl.NumberFormat(undefined, { style: 'currency', currency, minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(fiatValue / 1000);
    return formattedK.replace(/\.0/, '') + 'k';
  }
  
  const minimumFractionDigits = fiatValue >= 100 ? 0 : 2;
  const maximumFractionDigits = fiatValue >= 100 ? 0 : 2;
  
  return new Intl.NumberFormat(undefined, { 
    style: 'currency', 
    currency, 
    minimumFractionDigits, 
    maximumFractionDigits 
  }).format(fiatValue);
});
</script>

<style scoped>

</style>
