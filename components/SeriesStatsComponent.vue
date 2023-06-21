<template>
  <VirtualGrid :items="items">
    <template #default="{ item, index }">
      <AvatarCard :item="{ name: item.series.name, contract_address: item.series.contract_address, image: item.series.image }" :series-stats="item" :hide-floor="!sortingOnShop" :ranking="index + 1">
        <div :set="lowestListing = getLowestListing(item)">
          <template v-if="sortingOnShop">
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
                  <div class="text-neutral-400">F/M:</div>
                  <div class="flex items-center">
                    <div class="text-neutral-200">{{ Math.round(((lowestListing.payment_token.base_price / 1000000000000000000) * ethereumPriceInUsd) / (item.series.mint_price / 100) * 100) }}%</div>
                  </div>
                </div>
              </template>
            </div>
            <div class="w-full bg-amber-900 rounded-full overflow-hidden">
              <div class="bg-amber-600 text-xs font-medium text-amber-100 text-center rounded-full overflow-hidden" :style="{ 'width': `${Math.min(100, Math.round((item.series.total_sold / item.series.total_quantity) * 100 ))}%` }"> {{ Math.round((item.series.total_sold / item.series.total_quantity) * 100 ) }}%</div>
            </div>
          </template>
          <template v-else>
            <div class="flex font-bold text-[0.7rem]">
              <template v-if="item.stats.last_sale">
                <div class="flex flex-nowrap items-center gap-1 whitespace-nowrap overflow-hidden" :set="lastSale = item.stats.last_sale">
                  <div class="flex items-center gap-0.5">
                    <div class="flex items-center gap-0.25">
                      <template v-if="lastSale.payment_token.symbol === 'ETH'">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      </template>
                      <template v-else>
                        <div class="flex items-center text-orange-500">M</div>
                      </template>
                      <div class="text-neutral-200">{{ (lastSale.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</div>
                    </div>
                  </div>
                  <span class="text-neutral-300">({{ ethereumInLocalCurrency(getSaleAsGweiPrice(lastSale)) }})</span>
                  <span class="text-neutral-400">#{{ lastSale.token.mint_number }}</span>
                  <div class="text-neutral-500" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(lastSale.date_sold)) }}</div>
                </div>
              </template>
              <div class="ml-auto flex items-center">
                <div class="flex items-center font-bold overflow-hidden">
                  <span class="text-neutral-500 mr-0.5">1D:</span>
                  <template v-if="item.stats.daily_price_change > 0">
                    <div class="flex gap-0.5 items-center text-green-500 text-[0.65rem] rounded">
                      <span>+{{ item.stats.daily_price_change.toFixed(2) }}%</span>
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
            </div>
            <div class="flex gap-2 font-bold text-[0.8rem] items-center">
              <template v-if="lowestListing">
                <div class="flex flex-col">
                  <button @click="openLinkWith(`https://opensea.io/assets/matic/${lowestListing.token.contract_address}/${lowestListing.token.id}`)" class="flex items-center gap-0.25">
                    <template v-if="lowestListing.payment_token.symbol === 'ETH'">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="flex gap-1 font-bold text-white">
                        <span>{{ (lowestListing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
                        <span class="text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(lowestListing.payment_token.base_price) }}</span>)</span>
                        <span class="text-neutral-400">#{{ lowestListing.token.mint_number }}</span>
                      </div>
                    </template>
                    <template v-else-if="lowestListing.payment_token.symbol === 'MATIC'">
                      <div class="flex items-center text-orange-500">M</div>
                      <div class="flex gap-1 font-bold text-white">
                        <span>{{ (lowestListing.payment_token.base_price / ETH_TO_GWEI_MODIFIER).toFixed(4).replace(/\.?0+$/, '') }}</span>
                        <span class="text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(lowestListing.payment_token.base_price / ethereumPriceMap.get("MATIC")) }}</span>)</span>
                        <span class="text-neutral-400">#{{ lowestListing.token.mint_number }}</span>
                      </div>
                    </template>
                  </button>
                </div>
              </template>
              <template v-else>
                <span class="text-amber-500">No floor data.</span>
              </template>
              <div class="ml-auto flex items-center gap-1 font-bold text-[0.7rem] overflow-hidden whitespace-nowrap">
                <template v-if="sorting === 'lowestFloorMintRatio'">
                  <div class="flex items-center gap-0.5 font-bold overflow-hidden">
                    <div class="text-neutral-400">Flo/Mint:</div>
                    <div class="flex items-center">
                      <div class="text-neutral-200">{{ Math.round(((getListingAsGweiPrice(lowestListing) / ETH_TO_GWEI_MODIFIER) * ethereumPriceInUsd) / (item.series.mint_price / 100) * 100) }}%</div>
                    </div>
                  </div>
                </template>
                <template v-else-if="sorting === 'lowestListedPercentage'">
                  <div class="flex items-center gap-0.5 font-bold overflow-hidden">
                    <div class="text-neutral-400">Listed:</div>
                    <div class="flex items-center">
                      <div class="text-neutral-200">{{ item.stats.listed_percentage.toFixed(2) }}%</div>
                    </div>
                  </div>
                </template>
                <template v-else-if="sorting === 'lowestWeeklyAverage' || sorting === 'highestWeeklyAverage'">
                  <div class="flex items-center gap-0.5 font-bold overflow-hidden">
                    <div class="text-neutral-400">7D Avg:</div>
                    <div class="flex gap-0.25 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="text-neutral-200">{{ (item.stats.weekly_average_price ?? 0).toFixed(4).replace(/\.?0+$/, '') }}</div>
                    </div>
                  </div>
                </template>
                <template v-else-if="sorting === 'highestVolume' || sorting === 'lowestVolume'">
                  <div class="flex items-center gap-0.5 font-bold overflow-hidden">
                    <div class="text-neutral-400">Vol:</div>
                    <div class="flex gap-0.25 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="text-neutral-200">{{ (item.stats.total_volume / 1000000000000000000).toFixed(2) }}</div>
                    </div>
                  </div>
                </template>
                <template v-else-if="sorting === 'highestDailyVolume' || sorting === 'lowestDailyVolume'">
                  <div class="flex items-center gap-0.5 font-bold overflow-hidden">
                    <div class="text-neutral-400">24h Vol:</div>
                    <div class="flex gap-0.25 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="text-neutral-200">{{ item.stats.daily_volume.toFixed(2) }}</div>
                    </div>
                  </div>
                </template>
                <template v-else-if="sorting === 'highestMarketCap' || sorting === 'lowestMarketCap'">
                  <div class="flex items-center gap-0.5 font-bold overflow-hidden">
                    <div class="text-neutral-400">MC:</div>
                    <div class="flex gap-0.25 items-center">
                      <div class="text-neutral-200">{{ ethereumInLocalCurrency(item.series.total_sold * item.stats.last_sale?.payment_token.base_price, true) }}</div>
                    </div>
                  </div>
                </template>
                <template v-else-if="sorting === 'lowestTwoWeeklyAverage' || sorting === 'highestTwoWeeklyAverage'">
                  <div class="flex items-center gap-0.5 font-bold overflow-hidden">
                    <div class="text-neutral-400">14D Avg:</div>
                    <div class="flex gap-0.25 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="text-neutral-200">{{ (item.stats.two_weekly_average_price ?? 0).toFixed(2) }}</div>
                    </div>
                  </div>
                </template>
                <template v-else-if="sorting === 'lowestMonthlyAverage' || sorting === 'highestMonthlyAverage'">
                  <div class="flex items-center gap-0.5 font-bold overflow-hidden">
                    <div class="text-neutral-400">30D Avg:</div>
                    <div class="flex gap-0.25 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="text-neutral-200">{{ (item.stats.monthly_average_price ?? 0).toFixed(2) }}</div>
                    </div>
                  </div>
                </template>
                <template v-else-if="sorting === 'artistAsc' || sorting === 'artistDesc'">
                  <div class="flex items-center gap-0.5 font-bold overflow-hidden">
                    <a :href="`https://reddit.com/u/${item.collection.artist.displayName}`" target="_blank" class="text-amber-500">{{ item.collection.artist.displayName }}</a>
                  </div>
                </template>
                <template v-else>
                  <div class="flex items-center gap-0.5 font-bold overflow-hidden">
                    <div class="text-neutral-500 whitespace-nowrap">L5S:</div>
                    <div class="flex gap-0.25 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="text-neutral-200">{{ item.stats.five_last_sales_average.toFixed(4).replace(/\.?0+$/, '') }}</div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </AvatarCard>
    </template>
  </VirtualGrid>
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
import {getLowestListing, getListingAsGweiPrice, getSaleAsGweiPrice} from "~/composables/helpers";

const watchList = useWatchList();
const ethereumPriceInUsd = useEthereumUsdPrice();
const ethereumPriceMap = useEthereumPriceMap();

const props = defineProps({
  items: Array as PropType<SeriesStats[]>,
  sorting: String
});

const sortingOnShop = computed(() => {
  return props.sorting === 'highestShopAvailableAbsolute' || props.sorting === 'lowestShopAvailableAbsolute' || props.sorting === 'highestShopAvailablePercentage' || props.sorting === 'lowestShopAvailablePercentage' || props.sorting === 'lowestShopNextMint';
});
</script>

<style scoped>

</style>
