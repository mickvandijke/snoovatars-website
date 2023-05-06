<template>
  <div class="relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <div class="px-2 py-2 sticky top-[56px] lg:top-0 lg:relative flex justify-center gap-2 bg-neutral-800/90 backdrop-blur-lg lg:bg-transparent z-10 w-full drop-shadow-lg">
      <input v-model="walletAddress" placeholder="Wallet address: 0x.." class="p-2 rounded-md border border-neutral-600/50 bg-neutral-700/50 text-sm focus:outline-none w-full max-w-sm">
      <button @click="getWalletTokens(walletAddress)" :disabled="lookupDisabled()" class="p-2 whitespace-nowrap bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-white font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer">Add Wallet</button>
      <select v-model="valuationMethod" class="p-2 rounded-md border border-neutral-600 bg-neutral-700 text-sm focus:outline-none max-w-sm">
        <option value="floor">Value by Floor Price</option>
        <option value="lastSale">Value by Last Sale</option>
      </select>
    </div>
    <div class="mt-2 px-2 md:px-4 flex flex-col gap-2 w-full overflow-hidden">
      <div class="p-2 md:p-4 bg-neutral-800/75 flex items-center gap-2 text-sm rounded">
        <span class="text-white font-medium">Total Worth: </span>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
          <div class="text-neutral-200 font-bold">{{ (getTotalWorth() / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
          <div class="ml-1 text-neutral-200"> (${{ Math.round((getTotalWorth() / 1000000000000000000) * ethereumUsdPrice).toLocaleString("en-US") }})</div>
        </div>
      </div>
      <template v-for="[walletAddress, walletTokens] in sortedWallets().entries()">
        <div class="bg-neutral-800/75 flex flex-col items-center overflow-hidden w-full rounded">
          <div class="p-2 flex gap-2 w-full rounded">
            <div class="flex items-center overflow-hidden">
              <a :href="`https://opensea.io/${walletAddress}`" target="_blank" class="hidden md:block md:p-2 text-neutral-400 hover:text-white text-sm rounded duration-500">{{ walletAddress }}</a>
              <a :href="`https://opensea.io/${walletAddress}`" target="_blank" class="md:hidden md:p-2 text-neutral-400 hover:text-white text-sm rounded duration-500">{{ walletAddress.slice(0,4) }}..{{ walletAddress.slice(walletAddress.length - 4,walletAddress.length) }}</a>
            </div>
            <div class="md:ml-auto md:p-2 flex items-center text-sm rounded">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="text-neutral-200 font-bold">{{ (getWalletValue(walletAddress) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
              <div class="ml-1 text-neutral-200"> (${{ Math.round((getWalletValue(walletAddress) / 1000000000000000000) * ethereumUsdPrice).toLocaleString("en-US")}})</div>
            </div>
            <div class="ml-auto md:ml-0 flex gap-2">
              <button @click="removeWallet(walletAddress)" class="px-2 py-1 bg-neutral-600 hover:bg-neutral-500 disabled:bg-neutral-900 text-white font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer">
                <TrashIcon class="w-5 h-5 text-neutral-300" />
              </button>
            </div>
          </div>
          <template v-if="Object.entries(walletTokens).length > 0">
            <div class="p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 border-t border-neutral-700">
              <template v-for="[seriesName, seriesTokens] in Object.entries(sortedWalletTokens(walletTokens))">
                <div class="grid grid-cols-8 md:grid-cols-12 overflow-hidden">
                  <a :href="`https://opensea.io/collection/${getSeriesStats(seriesName)?.collection.slug}?search[query]=${seriesName}`" target="_blank" class="relative rounded w-auto aspect-square rounded overflow-hidden">
                    <img :src="getSeriesStats(seriesName)?.series.image" :alt="getSeriesStats(seriesName)?.series.name" class="w-full h-full object-cover">
                  </a>
                  <div class="col-span-3 md:col-span-4 flex flex-col justify-center overflow-hidden">
                    <span class="px-2 text-sm text-white" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{
                        getSeriesStats(seriesName)?.series.name
                      }}</span>
                    <div class="px-2 flex items-center text-xs md:text-sm overflow-hidden">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      <div class="text-neutral-200 font-bold">{{ (getSeriesValue(seriesName) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                      <div class="ml-1 text-neutral-200"> (${{ Math.round((getSeriesValue(seriesName) / 1000000000000000000) * ethereumUsdPrice).toLocaleString("en-US")}})</div>
                    </div>
                  </div>
                  <div class="flex items-center justify-center text-amber-500 text-sm overflow-hidden">
                    <span>{{ seriesTokens.length }}</span>
                  </div>
                  <div class="ml-auto col-span-3 md:col-span-5 flex items-center text-[0.8rem] md:text-sm overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                    <div class="text-neutral-200 font-bold">{{ (getSeriesValue(seriesName) / 1000000000000000000 * seriesTokens.length).toFixed(4).replace(/\.?0+$/, '') }}</div>
                    <div class="ml-1 text-neutral-200"> (${{ Math.round((getSeriesValue(seriesName) / 1000000000000000000 * seriesTokens.length) * ethereumUsdPrice).toLocaleString("en-US")}})</div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  addToWalletAddresses,
  removeFromWalletAddresses,
  updateSeriesStats,
  useEthereumUsdPrice,
  useSeriesStats,
  useWalletAddresses
} from "~/composables/states";
import {onMounted, ref} from "#imports";
import {Ref} from "@vue/reactivity";
import {fetchWalletTokens} from "~/composables/api/wallet";
import {WalletTokens} from "~/types/wallet";
import {TrashIcon} from "@heroicons/vue/24/outline";

const seriesStats = useSeriesStats();
const ethereumUsdPrice = useEthereumUsdPrice();
const walletAddresses = useWalletAddresses();

const walletAddress = ref<string>("");
const tokens: Ref<Map<string, WalletTokens>> = ref(new Map());
const valuationMethod = ref<string>("lastSale");
const loading = ref(false);

await updateSeriesStats();

onMounted(() => {
  walletAddresses.value.forEach((wallet) => {
    getWalletTokens(wallet);
  });
});

function getWalletTokens(wallet: string) {
  addToWalletAddresses(wallet);

  loading.value = true;

  fetchWalletTokens(wallet).then((walletTokens) => {
    tokens.value.set(wallet, walletTokens);

    walletAddress.value = "";

    loading.value = false;
  }).finally(() => {
    loading.value = false;
  })
}

function getSeriesStats(name: string) {
  return seriesStats.value[name];
}

function lookupDisabled(): boolean {
  return walletAddresses.value.has(walletAddress.value) || !walletAddress.value || loading.value;
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
          value += (getSeriesStats(seriesName)?.stats.lowest_listing?.payment_token.base_price * seriesTokens.length);
          break;
        case "lastSale":
          value += (getSeriesStats(seriesName)?.stats.last_sale?.payment_token.base_price * seriesTokens.length);
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
      price = getSeriesStats(series)?.stats.lowest_listing?.payment_token.base_price;
      break;
    case "lastSale":
      price = getSeriesStats(series)?.stats.last_sale?.payment_token.base_price;
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

function sortedWallets(): Map<string, WalletTokens> {
  const mapArray = Array.from(tokens.value.entries());

  mapArray.sort((a, b) => getWalletValue(a[0]) - getWalletValue(b[0]));

  return new Map(mapArray);
}

function sortedWalletTokens(walletTokens: WalletTokens): WalletTokens {
  return Object.fromEntries(
      Object.entries(walletTokens)
          .sort(([aSeriesName, aSeriesTokens], [bSeriesName, bSeriesTokens]) => ((getSeriesValue(bSeriesName) * bSeriesTokens.length) - getSeriesValue(aSeriesName) * aSeriesTokens.length))
  );
}

function removeWallet(wallet: string) {
  removeFromWalletAddresses(wallet);
  tokens.value.delete(wallet);
}
</script>

<style scoped>

</style>
