<template>
  <div class="px-2 md:px-6 relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <div class="px-2 py-2 sticky top-[56px] lg:top-0 lg:relative flex justify-center gap-2 bg-neutral-900/90 backdrop-blur-lg lg:bg-transparent z-10 w-full">
      <input v-model="walletAddress" placeholder="Wallet address: 0x.." class="p-2 rounded-md border border-neutral-600/50 bg-neutral-700/50 text-sm focus:outline-none w-full max-w-sm">
      <button @click="getWalletTokens(walletAddress)" :disabled="lookupDisabled()" class="p-2 whitespace-nowrap bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-white font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer">Add Wallet</button>
      <select v-model="valuationMethod" class="p-2 rounded-md border border-neutral-600 bg-neutral-700 text-sm focus:outline-none max-w-sm">
        <option value="floor">Floor Price</option>
        <option value="lastSale">Last Sale</option>
      </select>
    </div>
    <div class="flex flex-col gap-2 w-full overflow-hidden">
      <div class="p-2 bg-neutral-800 flex items-center gap-2 text-sm rounded">
        <span class="text-white font-bold">Total Worth: </span>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
          <div class="text-neutral-200 font-bold">{{ (getTotalWorth() / 1000000000000000000).toFixed(5).replace(/\.?0+$/, '') }}</div>
          <div class="ml-1 text-neutral-200"> (${{ Math.round((getTotalWorth() / 1000000000000000000) * ethereumUsdPrice) }})</div>
        </div>
      </div>
      <template v-for="[walletAddress, walletTokens] in tokens.entries()">
        <div class="p-2 bg-neutral-800/50 flex flex-col gap-2 overflow-hidden w-full rounded">
          <div class="flex justify-between gap-2 w-full">
            <div class="flex overflow-hidden">
              <div class="p-2 text-amber-500 text-sm rounded" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ walletAddress }}</div>
            </div>
            <div class="flex gap-2">
              <div class="p-2 flex items-center text-sm rounded">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                <div class="text-neutral-200 font-bold">{{ (getWalletValue(walletAddress) / 1000000000000000000).toFixed(5).replace(/\.?0+$/, '') }}</div>
                <div class="ml-1 text-neutral-200"> (${{ Math.round((getWalletValue(walletAddress) / 1000000000000000000) * ethereumUsdPrice) }})</div>
              </div>
              <button @click="removeWallet(walletAddress)" class="p-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-white font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer">Remove</button>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <template v-for="[seriesName, seriesTokens] in Object.entries(walletTokens)">
              <div class="grid grid-cols-12">
                <div class="relative rounded">
                  <img v-lazy-pix="getSeries(seriesName)?.series.image" :alt="getSeries(seriesName)?.series.name">
                </div>
                <div class="col-span-11 flex items-center bg-neutral-800 rounded">
                  <div class="overflow-hidden">
                    <span class="px-2 text-sm text-white" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ getSeries(seriesName)?.series.name }}</span>
                  </div>
                  <span class="text-amber-500 text-sm">x{{ seriesTokens.length }}</span>
                  <div class="ml-auto p-2 bg-neutral-800 flex items-center text-sm rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                    <div class="text-neutral-200 font-bold">{{ (getSeriesValue(seriesName) / 1000000000000000000 * seriesTokens.length).toFixed(5).replace(/\.?0+$/, '') }}</div>
                    <div class="ml-1 text-neutral-200"> (${{ Math.round((getSeriesValue(seriesName) / 1000000000000000000 * seriesTokens.length) * ethereumUsdPrice) }})</div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  addToWalletAddresses, removeFromWalletAddresses,
  updateSeriesStats,
  useEthereumUsdPrice,
  useSeriesStats,
  useWalletAddresses,
  useWatchList
} from "~/composables/states";
import {SeriesStats} from "~/types/seriesStats";
import {onMounted, ref} from "#imports";
import {fetchSalesLatest} from "~/composables/api/sales";
import SalesComponent from "~/components/SalesComponent.vue";
import {Ref} from "@vue/reactivity";
import {Sale} from "~/types/sale";
import {fetchWalletTokens} from "~/composables/api/wallet";
import {Token} from "~/types/token";
import {WalletTokens} from "~/types/wallet";

const seriesStats = useSeriesStats();
const ethereumUsdPrice = useEthereumUsdPrice();
const walletAddresses = useWalletAddresses();

const walletAddress = ref<string>("");
const tokens: Ref<Map<string, WalletTokens>> = ref(new Map());
const valuationMethod = ref<string>("floor");

await updateSeriesStats();

onMounted(() => {
  walletAddresses.value.forEach((wallet) => {
    getWalletTokens(wallet);
  });
});

function getWalletTokens(wallet: string) {
  addToWalletAddresses(wallet);

  fetchWalletTokens(wallet).then((walletTokens) => {
    tokens.value.set(wallet, walletTokens);
  })
}

function getSeries(name: string) {
  return seriesStats.value[name];
}

function lookupDisabled(): boolean {
  return walletAddresses.value.has(walletAddress.value) || !walletAddress.value;
}

function getWalletValue(wallet: string): number {
  let value = 0;

  for (let [walletAddress, walletTokens] of tokens.value.entries()) {
    if (walletAddress !== wallet) {
      continue;
    }

    for (let [seriesName, seriesTokens] of Object.entries(walletTokens)) {
      switch (valuationMethod.value) {
        case "floor":
          value += (getSeries(seriesName)?.stats.lowest_listing?.payment_token.base_price * seriesTokens.length);
          break;
        case "lastSale":
          value += (getSeries(seriesName)?.stats.last_sale?.payment_token.base_price * seriesTokens.length);
          break;
      }
    }
  }

  return value;
}

function getSeriesValue(series: string): number {
  let price = 0;

  switch (valuationMethod.value) {
    case "floor":
      price = getSeries(series)?.stats.last_sale?.payment_token.base_price;
      break;
    case "lastSale":
      price = getSeries(series)?.stats.lowest_listing?.payment_token.base_price;
      break;
  }

  return price;
}

function getTotalWorth(): number {
  let value = 0;

  for (let walletAddress of tokens.value.keys()) {
    value += getWalletValue(walletAddress);
  }

  return value;
}

function removeWallet(wallet: string) {
  removeFromWalletAddresses(wallet);
  tokens.value.delete(wallet);
}
</script>

<style scoped>

</style>
