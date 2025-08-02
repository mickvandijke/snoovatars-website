<template>
  <div class="wallet-view relative flex flex-col w-full min-h-screen bg-[#141415]">
    <MenuBar>
      <SearchBar v-model:search-term="searchTerm" :placeholder="`Search by Name, Artist or Collection`" />
      <div class="ml-auto flex items-center gap-2 menubar-overrides">
        <select v-model="settings.wallet.valuationMethod">
          <option value="floor">Value by Floor Price</option>
          <option value="lastSale">Value by Last Sale</option>
          <option value="fiveLastSales">Value by Last 5 Sales Average</option>
          <option value="weeklyAvg">Value by 7 Days Average Sale Price</option>
          <option value="twoWeeklyAvg">Value by 14 Days Average Sale Price</option>
          <option value="monthlyAvg">Value by 30 Days Average Sale Price</option>
        </select>
        <select v-model="settings.wallet.filterOption">
          <option value="all">Show All</option>
          <option value="premium">Show Premium Only</option>
        </select>
        <select v-model="settings.wallet.groupMethod">
          <option value="group">Group by Series</option>
          <option value="mint">Show Mint Numbers</option>
        </select>
        <template v-if="!Capacitor.isNativePlatform()">
          <RefreshButton :action="refresh" :refreshing="isRefreshing" />
        </template>
      </div>
    </MenuBar>
    
    <div class="flex-1">
      <!-- Add Wallet Section -->
      <div class="border-b border-zinc-800">
        <div class="px-4 lg:px-6  py-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 class="text-2xl font-semibold text-white">Portfolio Overview</h1>
              <p class="mt-1 text-sm text-zinc-400">Track and manage your Reddit Collectible Avatars</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                v-model="walletAddress" 
                placeholder="Enter wallet address (0x...)" 
                class="px-4 py-2.5 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-zinc-400 placeholder-zinc-500 rounded-lg transition-all duration-200 focus:outline-none w-full sm:w-96"
              >
              <button 
                @click="getWalletTokens(walletAddress)" 
                :disabled="lookupDisabled()" 
                class="px-6 py-2.5 bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:hover:bg-zinc-800 text-black disabled:text-zinc-600 text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <template v-if="loading">
                  <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Adding...</span>
                </template>
                <template v-else>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span>Add Wallet</span>
                </template>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <PullToRefresh @refresh="refresh" :is-refreshing="isRefreshing">
        <!-- Portfolio Summary -->
        <div v-if="walletAddresses.size > 0" class="border-b border-zinc-800">
          <div class="px-4 lg:px-6 py-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p class="text-sm text-zinc-400">Total Portfolio Value</p>
                <div class="mt-1 flex items-baseline gap-2">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-5 h-5 text-zinc-400 mr-1.5"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                    <span class="text-2xl font-semibold text-white">{{ (getTotalWorth / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</span>
                  </div>
                  <span class="text-sm text-zinc-400">({{ ethereumInLocalCurrency(getTotalWorth) }})</span>
                </div>
              </div>
              <div>
                <p class="text-sm text-zinc-400">Total Items</p>
                <p class="mt-1 text-2xl font-semibold text-white">{{ getTotalItems.toLocaleString() }}</p>
              </div>
              <div>
                <p class="text-sm text-zinc-400">Active Wallets</p>
                <p class="mt-1 text-2xl font-semibold text-white">{{ walletAddresses.size }}</p>
              </div>
              <div>
                <p class="text-sm text-zinc-400">Average Item Value</p>
                <div class="mt-1 flex items-baseline gap-2">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-4 h-4 text-zinc-400 mr-1"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                    <span class="text-2xl font-semibold text-white">{{ getTotalItems > 0 ? ((getTotalWorth / getTotalItems) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') : '0' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Wallets List -->
        <div class="px-4 lg:px-6 py-6">
          <div v-if="walletAddresses.size === 0" class="text-center py-16">
            <svg class="mx-auto h-12 w-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h3 class="mt-3 text-lg font-medium text-white">No wallets added</h3>
            <p class="mt-1 text-sm text-zinc-400">Add a wallet address above to start tracking your collection</p>
          </div>
          
          <div v-else class="space-y-4">
            <template v-for="[walletAddress, walletTokens] in sortedWallets().entries()">
              <div class="bg-zinc-800/30 rounded-xl border border-zinc-700/30 overflow-hidden">
                <!-- Wallet Header -->
                <div class="px-6 py-4" :class="{ 'border-b border-zinc-800': !isCollapsed(walletAddress) }">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <button @click="openLinkWith(`https://opensea.io/${walletAddress}`)" class="text-white hover:text-zinc-300 font-medium transition-colors duration-200">
                          <span class="hidden sm:inline">{{ walletAddress }}</span>
                          <span class="sm:hidden">{{ walletAddress.slice(0,6) }}...{{ walletAddress.slice(-4) }}</span>
                        </button>
                        <div class="flex items-center gap-4 mt-1">
                          <div class="flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3.5 h-3.5 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                            <span class="text-sm font-medium text-white">{{ (getWalletValue(walletAddress) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</span>
                            <span class="text-sm text-zinc-400">({{ ethereumInLocalCurrency(getWalletValue(walletAddress)) }})</span>
                          </div>
                          <span class="text-sm text-zinc-400">{{ Object.keys(walletTokens).length }} items</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button 
                        @click="toggleCollapse(walletAddress)" 
                        class="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all duration-200"
                      >
                        <ChevronDownIcon class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-180': !isCollapsed(walletAddress) }" />
                      </button>
                      <button 
                        @click="removeWallet(walletAddress)" 
                        class="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 rounded-lg transition-all duration-200"
                      >
                        <XMarkIcon class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Wallet Content -->
                <template v-if="!isCollapsed(walletAddress)">
                  <!-- Token Balances -->
                  <div class="px-6 py-4 border-b border-zinc-800">
                    <h3 class="text-sm font-medium text-zinc-400 mb-3">Token Balances</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <!-- RCAX -->
                      <div class="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                        <div class="flex items-center gap-3">
                          <img src="/images/branding/rcax/RCAX_Round_Color.svg" class="w-8 h-8">
                          <div>
                            <p class="text-sm font-medium text-white">RCAX</p>
                            <p class="text-xs text-zinc-400">{{ ((getRcax(walletAddress) ?? 0) / 1000000000000000000).toLocaleString() }}</p>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="flex items-center text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400 mr-1"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                            <span class="text-zinc-300">{{ rcaxToEth((getRcax(walletAddress) ?? 0) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</span>
                          </div>
                          <p class="text-xs text-zinc-500">{{ ethereumInLocalCurrency(rcaxToEth((getRcax(walletAddress) ?? 0))) }}</p>
                        </div>
                      </div>
                      
                      <!-- WETH -->
                      <div class="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 bg-purple-900/50 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-4 h-4 text-purple-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                          </div>
                          <div>
                            <p class="text-sm font-medium text-white">WETH</p>
                            <p class="text-xs text-zinc-400">{{ ((getWeth(walletAddress) ?? 0) / 1000000000000000000).toLocaleString() }}</p>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="flex items-center text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400 mr-1"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                            <span class="text-zinc-300">{{ ((getWeth(walletAddress) ?? 0) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</span>
                          </div>
                          <p class="text-xs text-zinc-500">{{ ethereumInLocalCurrency(((getWeth(walletAddress) ?? 0))) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- NFT Collection -->
                  <div v-if="Object.entries(walletTokens).length > 0" class="px-6 py-4">
                    <h3 class="text-sm font-medium text-zinc-400 mb-4">NFT Collection</h3>
                    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-3">
                      <template v-if="settings.wallet.groupMethod === 'group'">
                        <template v-for="series in sortedWalletTokensGrouped(filterWalletTokensGrouped(tokensCount.get(walletAddress)))">
                          <div @click="selectAvatar(getSeriesStats(series.contract_address, series.name))" class="group cursor-pointer">
                            <div class="relative aspect-square rounded-md overflow-hidden bg-zinc-800">
                              <img-placeholder 
                                img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                                :src="getTokenImage(getSeriesStats(series.contract_address, series.name)?.series.image ?? '/img/rcax_placeholder.png')" 
                              />
                              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                                <span class="text-[10px] font-medium text-white bg-black/60 px-1.5 py-0.5 rounded">{{ series.count }}x</span>
                              </div>
                            </div>
                            <div class="mt-1.5">
                              <p class="text-xs font-medium text-white truncate group-hover:text-zinc-300 transition-colors">{{ getSeriesStats(series.contract_address, series.name)?.series.name }}</p>
                              <div class="space-y-0.5">
                                <div @click.stop="openLinkWith(marketplaceLink(getSeriesStats(series.contract_address, series.name)))" class="flex items-center gap-0.5 cursor-pointer hover:text-orange-400 transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                                  <span class="text-xs text-zinc-400 font-medium">{{ (getSeriesValue(series.contract_address, series.name) / 1000000000000000000 * series.count).toFixed(3).replace(/\.?0+$/, '') }}</span>
                                  <span class="text-xs font-normal text-zinc-500">({{ getGroupedFiatPrice(series.contract_address, series.name, series.count) }})</span>
                                </div>
                                <div v-if="series.count > 1" class="flex items-center gap-0.5 text-xs text-zinc-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-2.5 h-2.5"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                                  <span>{{ (getSeriesValue(series.contract_address, series.name) / 1000000000000000000).toFixed(3).replace(/\.?0+$/, '') }}</span>
                                  <span class="text-zinc-600">({{ getIndividualFiatPrice(series.contract_address, series.name) }})</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                      </template>
                      <template v-else>
                        <template v-for="token in sortedTokens(filterWalletTokens(walletTokens))">
                          <div @click="selectAvatar(getSeriesStats(token.contract_address, token.name))" class="group cursor-pointer">
                            <div class="relative aspect-square rounded-md overflow-hidden bg-zinc-800">
                              <template v-if="Capacitor.isNativePlatform()">
                                <img 
                                  v-lazy-pix="getTokenImage(getSeriesStats(token.contract_address, token.name)?.series.image ?? '/img/rcax_placeholder.png')" 
                                  src="/img/rcax_placeholder.png" 
                                  :alt="getSeriesStats(token.contract_address, token.name)?.series.name" 
                                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                >
                              </template>
                              <template v-else>
                                <img 
                                  :src="getTokenImage(getSeriesStats(token.contract_address, token.name)?.series.image ?? '/img/rcax_placeholder.png')" 
                                  :alt="getSeriesStats(token.contract_address, token.name)?.series.name" 
                                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                >
                              </template>
                              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                                <span class="text-[10px] font-medium text-white bg-black/60 px-1.5 py-0.5 rounded">#{{ token.mint_number }}</span>
                              </div>
                            </div>
                            <div class="mt-1.5">
                              <p class="text-xs font-medium text-white truncate group-hover:text-zinc-300 transition-colors">{{ getSeriesStats(token.contract_address, token.name)?.series.name }}</p>
                              <div @click.stop="openLinkWith(marketplaceLink(getSeriesStats(token.contract_address, token.name)))" class="flex items-center gap-0.5 mt-0.5 cursor-pointer hover:text-orange-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                                <span class="text-xs text-zinc-400 font-medium">{{ (getSeriesValue(token.contract_address, token.name) / 1000000000000000000).toFixed(3).replace(/\.?0+$/, '') }}</span>
                                <span class="text-xs font-normal text-zinc-500">({{ getIndividualFiatPrice(token.contract_address, token.name) }})</span>
                              </div>
                            </div>
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
      </PullToRefresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  addToWalletAddresses,
  removeFromWalletAddresses,
  updateSeriesStats,
  getSeriesStats,
  useWalletAddresses,
  useConeEthPrice,
  updateEthereumPrices,
  updateMarketInfo,
  useSettings,
  useSelectedAvatar,
  useRcaxEthPrice,
  useEthereumPriceMap
} from "~/composables/states";
import {getLowestListingAsGweiPrice, onMounted, ref} from "#imports";
import {Ref} from "@vue/reactivity";
import {fetchWalletTokenBalance, fetchWalletTokens} from "~/composables/api/wallet";
import {WalletTokens} from "~/types/wallet";
import {ethereumInLocalCurrency, coneToEth, gweiInLocalCurrency} from "#imports";
import {ArrowPathIcon, ChevronDownIcon, XMarkIcon} from "@heroicons/vue/24/solid";
import {Token} from "~/types/token";
import {Capacitor} from "@capacitor/core";
import {getTokenImage, isValidEthereumAddress} from "~/global/utils";
import {getSaleAsGweiPrice} from "~/composables/helpers";
import {getFreeCollections} from "~/global/generations";
import {SeriesStats} from "~/types/seriesStats";
import {computed, ComputedRef} from "vue";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {rcaxToEth} from "~/composables/api/rcax";
import {marketplaceLink} from "~/global/marketplace";

const walletAddresses = useWalletAddresses();
const rcaxEthPrice = useRcaxEthPrice();
const cone = useConeEthPrice();
const settings = useSettings();
const selectedAvatar = useSelectedAvatar();
const ethereumPriceMap = useEthereumPriceMap();

const walletAddress = ref<string>("");
const searchTerm = ref<string>("");
const tokens: Ref<Map<string, Token[]>> = ref(new Map());
const tokensCount: Ref<Map<string, Map<string, TokenGrouped>>> = ref(new Map());
const rcax: Ref<Map<string, number>> = ref(new Map());
const weth: Ref<Map<string, number>> = ref(new Map());
const cones: Ref<Map<string, number>> = ref(new Map());
const loading = ref(false);
const isRefreshing = ref(false);
const collapsedWallets: Ref<Set<string>> = ref(new Set<string>());

await updateSeriesStats();

onMounted(() => {
  walletAddresses.value.forEach((wallet) => {
    getWalletTokens(wallet);
  });
});

interface TokenGrouped {
  count: number;
  contract_address: string;
  name: string;
}

function filterWalletTokensGrouped(walletTokens: Map<string, TokenGrouped>): Map<string, TokenGrouped> {
  let filteredTokens: Map<string, TokenGrouped> = new Map<string, TokenGrouped>();

  for (const [contractAddress, tokens] of walletTokens) {
    // Apply premium filter
    if (settings.value.wallet?.filterOption === "premium" && getFreeCollections().includes(contractAddress.slice(0,42))) {
      continue;
    }

    // Apply search filter
    if (searchTerm.value) {
      const searchTermLower = searchTerm.value.toLowerCase();
      const seriesStats = getSeriesStats(tokens.contract_address, tokens.name);
      
      const matchesName = tokens.name.toLowerCase().includes(searchTermLower);
      const matchesArtist = seriesStats?.collection?.artist?.displayName?.toLowerCase().includes(searchTermLower);
      const matchesCollection = seriesStats?.collection?.name?.toLowerCase().includes(searchTermLower);
      
      if (!matchesName && !matchesArtist && !matchesCollection) {
        continue;
      }
    }

    filteredTokens.set(contractAddress, tokens);
  }

  return filteredTokens;
}

function filterWalletTokens(walletTokens: Token[]): Token[] {
  const filteredTokens: Token[] = [];

  for (const token of walletTokens) {
    const contractAddress = token.contract_address;

    // Apply premium filter
    if (settings.value.wallet?.filterOption === "premium" && getFreeCollections().includes(contractAddress)) {
      continue;
    }

    // Apply search filter
    if (searchTerm.value) {
      const searchTermLower = searchTerm.value.toLowerCase();
      const seriesStats = getSeriesStats(token.contract_address, token.name);
      
      const matchesName = token.name.toLowerCase().includes(searchTermLower);
      const matchesArtist = seriesStats?.collection?.artist?.displayName?.toLowerCase().includes(searchTermLower);
      const matchesCollection = seriesStats?.collection?.name?.toLowerCase().includes(searchTermLower);
      
      if (!matchesName && !matchesArtist && !matchesCollection) {
        continue;
      }
    }

    filteredTokens.push(token);
  }

  return filteredTokens;
}

function toggleCollapse(walletAddress: string) {
  if (collapsedWallets.value.has(walletAddress)) {
    collapsedWallets.value.delete(walletAddress);
  } else {
    collapsedWallets.value.add(walletAddress);
  }
}

function isCollapsed(walletAddress: string): boolean {
  return collapsedWallets.value.has(walletAddress);
}

function refresh() {
  isRefreshing.value = true;

  let promises = [];

  promises.push(updateSeriesStats());
  promises.push(updateMarketInfo());
  promises.push(updateEthereumPrices());

  walletAddresses.value.forEach((wallet) => {
    promises.push(getWalletTokens(wallet));
  });

  Promise.all(promises).finally(() => {
    isRefreshing.value = false;
  })
}

async function getWalletTokens(wallet: string) {
  loading.value = true;

  if (!isValidEthereumAddress(wallet)) {
    loading.value = false;
    alert('Invalid Ethereum address');
    return;
  }

  await fetchWalletTokens(wallet)
      .then((data) => {
        const wallets = Object.entries(data.wallets);
        const [firstWalletAddress, firstWalletValue] = wallets[0];

        addToWalletAddresses(firstWalletAddress);

        tokensCount.value.set(firstWalletAddress, new Map<string, TokenGrouped>());

        firstWalletValue.forEach((token) => {
          if (token.contract_address === "0xa3396af20ce52bd3c7ab6d7046be617257f60eb9" && token.mint_number <= 24) {
            token.name = "Gold Hodl";
          }

          let tokenId = token.contract_address + token.name;

          if (!tokensCount.value.get(firstWalletAddress)?.has(tokenId)) {
            tokensCount.value.get(firstWalletAddress)?.set(tokenId, {
              count: 1,
              name: token.name,
              contract_address: token.contract_address
            });
          } else {
            const tokenGrouped = tokensCount.value.get(firstWalletAddress)?.get(tokenId);
            if (tokenGrouped) {
              tokenGrouped.count += 1;
            }
          }
        });

        tokens.value.set(firstWalletAddress, firstWalletValue);
        rcax.value.set(firstWalletAddress, 0);
        cones.value.set(firstWalletAddress, data.cones);
        weth.value.set(firstWalletAddress, data.weth ?? 0);

        getRcaxBalance(firstWalletAddress);
        getConeBalance(firstWalletAddress);
        getWethBalance(firstWalletAddress);

        walletAddress.value = "";
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });

  loading.value = false;
}

async function getRcaxBalance(wallet: string) {
  loading.value = true;

  const RCAX_TOKEN_ADDRESS = "0x875f123220024368968d9f1ab1f3f9c2f3fd190d";

  await fetchWalletTokenBalance(RCAX_TOKEN_ADDRESS, wallet)
      .then((data) => {
        rcax.value.set(wallet, data);
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });

  loading.value = false;
}

async function getConeBalance(wallet: string) {
  loading.value = true;

  const CONE_TOKEN_ADDRESS = "0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c";

  await fetchWalletTokenBalance(CONE_TOKEN_ADDRESS, wallet)
      .then((data) => {
        cones.value.set(wallet, data);
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });

  loading.value = false;
}

async function getWethBalance(wallet: string) {
  loading.value = true;

  const WETH_TOKEN_ADDRESS = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

  await fetchWalletTokenBalance(WETH_TOKEN_ADDRESS, wallet)
      .then((data) => {
        weth.value.set(wallet, data);
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });

  loading.value = false;
}

function getRcax(wallet: string) {
  return rcax.value.get(wallet);
}

function getCones(wallet: string) {
  return cones.value.get(wallet);
}

function getWeth(wallet: string) {
  return weth.value.get(wallet);
}

function lookupDisabled(): boolean {
  return !walletAddress.value || walletAddresses.value.has(walletAddress.value) || loading.value;
}

function getWalletValue(wallet: string): number {
  let value = 0;

  let walletTokensGrouped = tokensCount.value.get(wallet);

  if (walletTokensGrouped) {
    for (let series of walletTokensGrouped.values()) {
      value += getSeriesValue(series.contract_address, series.name) * series.count;
    }
  }

  return value;
}

function getSeriesValue(contractAdres: string, name: string): number {
  let price = 0;
  let stats = getSeriesStats(contractAdres, name);

  switch (settings.value.wallet.valuationMethod) {
    case "floor":
      price = stats ? getLowestListingAsGweiPrice(stats) : 0;
      break;
    case "lastSale":
      price = stats?.stats.last_sale ? getSaleAsGweiPrice(stats.stats.last_sale) : 0;
      break;
    case "fiveLastSales":
      price = stats?.stats.eth.five_last_sales_average * 1000000000000000000 ?? 0;
      break;
    case "weeklyAvg":
      price = ((stats?.stats.eth.weekly_average_price ?? stats?.stats.eth.two_weekly_average_price ?? stats?.stats.eth.monthly_average_price)  * 1000000000000000000) ?? stats?.stats.last_sale?.payment_token.base_price ?? 0;
      break;
    case "twoWeeklyAvg":
      price = ((stats?.stats.eth.two_weekly_average_price ?? stats?.stats.eth.monthly_average_price)  * 1000000000000000000) ?? stats?.stats.last_sale?.payment_token.base_price ?? 0;
      break;
    case "monthlyAvg":
      price = (stats?.stats.eth.monthly_average_price  * 1000000000000000000) ?? stats?.stats.last_sale?.payment_token.base_price ?? 0;
      break;
  }

  return price;
}

const getTotalWorth: ComputedRef<number> = computed(() => {
  let value = 0;

  for (let walletAddress of tokens.value.keys()) {
    value += getWalletValue(walletAddress);
  }

  return value;
});

const getTotalItems: ComputedRef<number> = computed(() => {
  let items = 0;

  for (let walletTokens of tokens.value.values()) {
    items += walletTokens.length;
  }

  return items;
});

function sortedWallets(): Map<string, WalletTokens> {
  const mapArray = Array.from(tokens.value.entries());

  mapArray.sort((a, b) => getWalletValue(b[0]) - getWalletValue(a[0]));

  return new Map(mapArray);
}

function sortedWalletTokensGrouped(walletTokens: Map<string, TokenGrouped>) {
  let tokens = [];

  for (const tokenGroup of walletTokens.values()) {
    tokens.push(tokenGroup);
  }

  return tokens.sort((aTokenGroup, bTokenGroup) => ((getSeriesValue(bTokenGroup.contract_address, bTokenGroup.name) * bTokenGroup.count) - (getSeriesValue(aTokenGroup.contract_address, aTokenGroup.name) *aTokenGroup.count )));
}

function sortedTokens(tokens: Array<Token>): Array<Token> {
  return tokens.sort((a, b) => {
    const seriesValueComparison = getSeriesValue(b.contract_address, b.name) - getSeriesValue(a.contract_address, a.name);
    if (seriesValueComparison !== 0) {
      return seriesValueComparison;
    } else {
      return a.mint_number - b.mint_number;
    }
  });
}

function removeWallet(wallet: string) {
  removeFromWalletAddresses(wallet);
  tokens.value.delete(wallet);
}

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

function selectAvatar(seriesStats: SeriesStats) {
  hapticsImpactLight();

  selectedAvatar.value = {
    seriesStats: seriesStats,
    contract: seriesStats.series.contract_address,
    series: seriesStats.series.name
  }
}

function getGroupedFiatPrice(contractAddress: string, name: string, count: number): string {
  const ethPrice = getSeriesValue(contractAddress, name) / 1000000000000000000 * count;
  const currency = settings.value.currency.preferred;
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
}

function getIndividualFiatPrice(contractAddress: string, name: string): string {
  const ethPrice = getSeriesValue(contractAddress, name) / 1000000000000000000;
  const currency = settings.value.currency.preferred;
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
}
</script>

<style scoped>
/* Override global select styles to match SearchBar component exactly */
.menubar-overrides select {
  @apply px-2.5 py-2 bg-zinc-800/30 hover:bg-zinc-700/50 text-sm text-zinc-400 rounded-lg transition-all duration-200 focus:outline-none cursor-pointer;
  border: 1px solid rgb(63 63 70 / 0.3);
  height: 36px;
  min-width: fit-content;
}

.menubar-overrides select:hover {
  border-color: rgb(82 82 91 / 0.5);
}

.menubar-overrides select:focus {
  border-color: rgb(249 115 22 / 0.5);
  box-shadow: 0 0 0 2px rgb(249 115 22 / 0.5);
}

.menubar-overrides select:hover {
  @apply text-zinc-300;
}

.menubar-overrides select:focus {
  @apply text-zinc-200;
}

.menubar-overrides select > option {
  @apply bg-zinc-800 text-zinc-200;
}

/* Mobile responsive adjustments to match SearchBar */
@media (max-width: 640px) {
  .menubar-overrides select {
    @apply px-2 text-xs;
    height: 32px;
    gap: 1.5px;
  }
}
</style>