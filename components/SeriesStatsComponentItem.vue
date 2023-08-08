<template>
  <div>
    <template v-if="sortingOnShop">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-1 font-bold text-[0.7rem] w-full overflow-hidden">
          <div class="flex items-center gap-0.5 overflow-hidden">
            <div class="text-neutral-400">Available:</div>
            <div class="flex items-center gap-0.5">
              <span class="text-amber-500">{{ Math.max((item.series.total_quantity - item.series.total_sold), 0) }}</span>
            </div>
          </div>
          <template v-if="item.series.total_sold < item.series.total_quantity">
            <div class="flex items-center gap-0.5 overflow-hidden">
              <div class="text-neutral-400">Next Mint:</div>
              <div class="flex items-center gap-0.5">
                <span class="text-amber-500">#{{ item.series.total_quantity - (item.series.total_quantity - item.series.total_sold) + 1 }}</span>
              </div>
            </div>
          </template>
          <template v-if="lowestListing">
            <div class="flex items-center gap-0.5 overflow-hidden">
              <div class="text-neutral-400">MP:</div>
              <div class="flex items-center">
                <div :class="{ 'text-green-500': mintProfitInPercentage >= 0, 'text-red-500': mintProfitInPercentage < 0 }">{{ mintProfitInPercentage }}%</div>
              </div>
            </div>
          </template>
        </div>
        <div class="w-full bg-amber-900 rounded-full overflow-hidden">
          <div class="bg-amber-600 text-xs font-medium text-amber-100 text-center rounded-full overflow-hidden" :style="{ 'width': `${Math.min(100, Math.round((item.series.total_sold / item.series.total_quantity) * 100 ))}%` }"> {{ Math.round((item.series.total_sold / item.series.total_quantity) * 100 ) }}%</div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-row justify-between gap-1">
        <div class="flex flex-col">
          <div class="flex gap-2 font-bold text-[0.7rem] items-center">
            <div class="flex gap-1">
              <span class="text-neutral-500 font-medium">Floor:</span>
              <template v-if="lowestListing">
                <div class="flex flex-col">
                  <button @click.stop="openLinkWith(`https://opensea.io/assets/matic/${lowestListing.token.contract_address}/${lowestListing.token.id}`)" class="flex items-center group">
                    <template v-if="lowestListing.payment_token.symbol === 'ETH'">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="flex gap-0.5 font-bold text-white group-hover:text-neutral-300">
                        <span>{{ (lowestListing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
                        <span class="text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(lowestListing.payment_token.base_price) }}</span>)</span>
                        <span class="text-neutral-400">#{{ lowestListing.token.mint_number }}</span>
                      </div>
                    </template>
                    <template v-else-if="lowestListing.payment_token.symbol === 'MATIC'">
                      <div class="pr-0.5 flex items-center text-orange-500">M</div>
                      <div class="flex gap-0.5 font-bold text-white group-hover:text-neutral-300">
                        <span>{{ (lowestListing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
                        <span class="text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(lowestListing.payment_token.base_price / ethereumPriceMap.get("MATIC")) }}</span>)</span>
                        <span class="text-neutral-400">#{{ lowestListing.token.mint_number }}</span>
                      </div>
                    </template>
                  </button>
                </div>
              </template>
              <template v-else>
                <div class="flex text-[0.7rem]">
                  <span class="text-neutral-400 font-medium">No listings found.</span>
                </div>
              </template>
            </div>
          </div>
          <div class="flex font-bold text-[0.7rem]">
            <div class="flex gap-1">
              <span class="text-neutral-500 font-medium">Sale:</span>
              <template v-if="item.stats.last_sale">
                <div class="flex flex-nowrap items-center gap-1 whitespace-nowrap overflow-hidden">
                  <div class="flex items-center">
                    <div class="flex items-center">
                      <template v-if="item.stats.last_sale.payment_token.symbol === 'ETH'">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      </template>
                      <template v-else>
                        <div class="pr-0.5 flex items-center text-orange-500">M</div>
                      </template>
                      <div class="text-neutral-200">{{ (item.stats.last_sale.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</div>
                    </div>
                  </div>
                  <span class="text-neutral-400">#{{ item.stats.last_sale.token.mint_number }}</span>
                  <div class="text-neutral-500" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(item.stats.last_sale.date_sold)) }} ago</div>
                </div>
              </template>
              <template v-else>
                <span class="text-neutral-400 font-medium">No sales yet.</span>
              </template>
            </div>
          </div>
          <div class="flex font-bold text-[0.7rem]">
            <div class="flex gap-1">
              <template v-if="sorting === 'lowestFloorMintRatio' || sorting === 'highestFloorMintRatio'">
                <div class="flex items-center gap-0.5 font-bold overflow-hidden">
                  <span class="text-neutral-500 font-medium">Mint Profit:</span>
                  <div class="flex gap-0.25 items-center">
                    <div :class="{ 'text-green-500': mintProfitInPercentage >= 0, 'text-red-500': mintProfitInPercentage < 0 }">{{ mintProfitInPercentage }}%</div>
                  </div>
                </div>
              </template>
              <template v-else-if="sorting === 'lowestListedPercentage'">
                <span class="text-neutral-500 font-medium">Listed:</span>
                <div class="flex gap-0.25 items-center">
                  <div class="text-neutral-200">{{ item.stats.listed_percentage.toFixed(2) }}%</div>
                </div>
              </template>
              <template v-else-if="sorting === 'lowestWeeklyAverage' || sorting === 'highestWeeklyAverage'">
                <span class="text-neutral-500 font-medium">7d Avg:</span>
                <div class="flex gap-0.25 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="text-neutral-200">{{ (item.stats.weekly_average_price ?? 0).toFixed(4).replace(/\.?0+$/, '') }}</div>
                </div>
              </template>
              <template v-else-if="sorting === 'lowestTwoWeeklyAverage' || sorting === 'highestTwoWeeklyAverage'">
              <span class="text-neutral-500 font-medium">14d Avg:</span>
              <div class="flex gap-0.25 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                <div class="text-neutral-200">{{ (item.stats.two_weekly_average_price ?? 0).toFixed(2) }}</div>
              </div>
              </template>
              <template v-else-if="sorting === 'lowestMonthlyAverage' || sorting === 'highestMonthlyAverage'">
                <span class="text-neutral-500 font-medium">30d Avg:</span>
                <div class="flex gap-0.25 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="text-neutral-200">{{ (item.stats.monthly_average_price ?? 0).toFixed(2) }}</div>
                </div>
              </template>
              <template v-else-if="sorting === 'artistAsc' || sorting === 'artistDesc'">
                <span class="text-neutral-500 font-medium">Artist:</span>
                <div class="flex gap-0.25 items-center">
                  <a :href="`https://reddit.com/u/${item.collection.artist.displayName}`" target="_blank" class="text-amber-500">{{ item.collection.artist.displayName }}</a>
                </div>
              </template>
              <template v-else-if="sorting === 'lowestDailyVolume' || sorting === 'highestDailyVolume'">
                <span class="text-neutral-500 font-medium">24h Vol:</span>
                <div class="flex gap-0.25 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="text-neutral-200">{{ item.stats.daily_volume.toFixed(2) }}</div>
                </div>
              </template>
              <template v-else>
                <span class="text-neutral-500 font-medium">Last 5 Sales:</span>
                <div class="flex gap-0.25 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="text-neutral-200">{{ item.stats.five_last_sales_average.toFixed(4).replace(/\.?0+$/, '') }}</div>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="flex font-medium text-[0.7rem]">
            <div class="flex gap-1">
              <span class="text-neutral-500 font-medium">24h:</span>
              <template v-if="item.stats.daily_price_change > 0">
                <div class="flex gap-0.5 items-center text-green-500 text-[0.65rem] rounded">
                  <span>+{{ dailyPriceChange }}%</span>
                </div>
              </template>
              <template v-else-if="item.stats.daily_price_change < 0">
                <div class="flex gap-0.5 items-center text-red-500 text-[0.65rem] rounded">
                  <span>{{ item.stats.daily_price_change.toFixed(2) }}%</span>
                </div>
              </template>
              <template v-else>
                <div class="flex gap-0.5 items-center text-neutral-400 text-[0.65rem] rounded">
                  <span>0%</span>
                </div>
              </template>
            </div>
          </div>
          <div class="flex font-medium text-[0.7rem]">
            <div class="flex gap-1">
              <span class="text-neutral-500 font-medium">Vol:</span>
              <div class="flex gap-0.25 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                <div class="text-neutral-500">{{ (item.stats.total_volume / 1000000000000000000).toFixed(2) }}</div>
              </div>
            </div>
          </div>
          <div class="flex font-medium text-[0.7rem]">
            <div class="flex gap-1">
              <span class="text-neutral-500 font-medium">Cap:</span>
              <div class="flex gap-0.25 items-center">
                <div class="text-neutral-500">{{ ethereumInLocalCurrency(item.series.total_sold * item.stats.last_sale?.payment_token.base_price ?? 0, true) }}</div>
              </div>
            </div>
          </div>
        </div>
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
  useEthereumPriceMap
} from "~/composables/states";
import {computed, ethereumInLocalCurrency} from "#imports";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {getLowestListing, getListingAsGweiPrice} from "~/composables/helpers";

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

const dailyPriceChange = computed(() => {
  let change = props.item.stats.daily_price_change;

  if (change >= 100 || change <= -100) {
    return change.toFixed(0);
  }

  return change.toFixed(2);
});
</script>

<style scoped>

</style>