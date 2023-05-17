<template>
  <div class="relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <MenuBar>
      <select v-model="valuationMethod" class="p-2 rounded-md border-transparent bg-neutral-700 text-sm focus:outline-none max-w-sm">
        <option value="floor">Value by Floor Price</option>
        <option value="lastSale">Value by Last Sale</option>
        <option value="fiveLastSales">Value by 5 Last Sales Average</option>
        <option value="weeklyAvg">Value by 7 Days Average Sale Price</option>
        <option value="twoWeeklyAvg">Value by 14 Days Average Sale Price</option>
        <option value="monthlyAvg">Value by 30 Days Average Sale Price</option>
      </select>
      <select v-model="groupMethod" class="p-2 rounded-md border-transparent bg-neutral-700 text-sm focus:outline-none max-w-sm">
        <option value="group">Group by Series</option>
        <option value="mint">Show Mint Numbers</option>
      </select>
      <button @click="refresh()" :disabled="isRefreshing" class="p-2 whitespace-nowrap bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-white font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer" :class="{ 'loading': isRefreshing }">
        <ArrowPathIcon class="w-5 h-5" />
      </button>
    </MenuBar>
    <div class="px-2 py-1 lg:p-4 flex flex-col gap-2 w-full overflow-hidden">
      <div class="p-2 md:p-4 bg-neutral-800/75 flex items-center text-sm rounded-md">
        <div class="flex flex-nowrap gap-2 w-full">
          <input type="text" autocomplete="off" v-model="walletAddress" placeholder="Reddit username (without u/) or wallet address" class="p-2 rounded-md border border-neutral-600/50 bg-neutral-700/50 text-sm focus:outline-none w-full">
          <button @click="getWalletTokens(walletAddress)" :disabled="lookupDisabled()" class="p-2 flex items-center justify-center whitespace-nowrap bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 text-white font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer loading">
            <template v-if="loading">
              <svg class="inline w-5 h-5 text-amber-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
              </svg>
            </template>
            <template v-else>
              <span>Add Wallet</span>
            </template>
          </button>
        </div>
      </div>
      <div class="p-2 md:p-4 bg-neutral-800/75 flex items-center gap-2 text-sm rounded-md">
        <div class="flex gap-1 font-bold">
          <span class="text-white">Total Worth: </span>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
            <div class="text-neutral-200">{{ (getTotalWorth() / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
            <div class="ml-1 text-neutral-500"> (<span class="text-amber-500">{{ ethereumInLocalCurrency(getTotalWorth()) }}</span>)</div>
          </div>
        </div>
      </div>
      <div class="p-2 md:p-4 bg-neutral-800/75 flex items-center gap-2 text-sm rounded-md">
        <div class="flex gap-1 font-bold">
          <span class="text-white">Total items:</span>
          <span class="text-amber-500">{{ getTotalItems() }}</span>
        </div>
      </div>
      <template v-for="[walletAddress, walletTokens] in sortedWallets().entries()">
        <div class="bg-neutral-800/75 flex flex-col items-center overflow-hidden w-full rounded-md">
          <div class="p-2 flex gap-2 w-full rounded">
            <div class="flex items-center overflow-hidden">
              <a :href="`https://opensea.io/${walletAddress}`" target="_blank" class="hidden md:block md:p-2 text-neutral-400 hover:text-white text-sm rounded-md duration-500">{{ walletAddress }}</a>
              <a :href="`https://opensea.io/${walletAddress}`" target="_blank" class="md:hidden md:p-2 text-neutral-400 hover:text-white text-sm font-medium rounded-md duration-500">{{ walletAddress.slice(0,6) }}..{{ walletAddress.slice(walletAddress.length - 6, walletAddress.length) }}</a>
            </div>
            <div class="flex gap-2">
              <button @click="removeWallet(walletAddress)" class="px-1 py-1 text-white font-semibold text-sm group border border-transparent rounded-md duration-200 cursor-pointer">
                <XMarkIcon class="w-5 h-5 text-neutral-400 group-hover:text-red-400 duration-200" />
              </button>
            </div>
            <div class="ml-auto md:p-2 flex items-center text-sm rounded-md font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="text-neutral-200">{{ (getWalletValue(walletAddress) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
              <div class="ml-1 text-neutral-500"> (<span class="text-amber-500">{{ ethereumInLocalCurrency(getWalletValue(walletAddress)) }}</span>)</div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="toggleCollapse(walletAddress)" class="px-1 py-1 font-semibold text-sm flex items-center border border-transparent rounded-md duration-200 cursor-pointer">
                <ChevronDownIcon class="w-5 h-5 text-neutral-400 group-hover:text-red-400 duration-200" :class="{ 'rotate-90': isCollapsed(walletAddress) }" />
              </button>
            </div>
          </div>
          <div class="p-2 md:p-4 gap-1 border-t border-neutral-700 w-full">
            <div class="p-1 flex items-center justify-start w-full font-bold">
              <div class="w-10 h-10 relative rounded-md overflow-hidden">
                <a href="https://quickswap.exchange/#/swap/v2?currency0=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&currency1=0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c&swapIndex=0" target="_blank">
                  <img src="/img/bitcone.png">
                </a>
              </div>
              <div class="mx-2 flex flex-col justify-center items-start text-sm overflow-hidden">
                <a
                    href="https://quickswap.exchange/#/swap/v2?currency0=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&currency1=0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c&swapIndex=0" target="_blank"
                    class="text-orange-400 whitespace-nowrap text-ellipsis overflow-hidden"
                >BitCone (CONE)</a>
                <span class="text-amber-500">{{ ((getCones(walletAddress) ?? 0) / 1000000000000000000).toLocaleString() }}</span>
              </div>
              <div class="ml-auto flex flex-col items-end text-[0.8rem] md:text-sm">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="text-neutral-200">{{ coneToEth((getCones(walletAddress) ?? 0) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                  <div class="ml-1 text-neutral-500"> (<span class="text-amber-500">{{ ethereumInLocalCurrency(coneToEth((getCones(walletAddress) ?? 0))) }}</span>)</div>
                </div>
                <div class="flex items-center text-xs md:text-sm">
                  <div class="ml-1 text-neutral-500"> (<span class="text-neutral-300">{{ coneInLocalCurrency(cone) }}</span>)</div>
                </div>
              </div>
            </div>
          </div>
          <template v-if="Object.entries(walletTokens).length > 0 && !isCollapsed(walletAddress)">
            <div class="p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-1 border-t border-neutral-700 w-full">
              <template v-if="groupMethod === 'group'">
                <template v-for="[seriesName, seriesTokens] in Object.entries(sortedWalletTokens(walletTokens))">
                  <div class="p-1 grid grid-cols-8 md:grid-cols-12 w-full border-neutral-700/50 rounded-lg font-bold">
                    <div class="relative rounded-md overflow-hidden" style="padding-top: 100%">
                      <a :href="`https://opensea.io/collection/${getSeriesStats(seriesName)?.collection.slug}?search[query]=${seriesName}`" target="_blank">
                        <img :src="getSeriesStats(seriesName)?.series.image" :alt="getSeriesStats(seriesName)?.series.name" class="absolute top-0 left-0 w-full h-full object-cover">
                      </a>
                    </div>
                    <div class="mx-2 col-span-4 md:col-span-6 flex flex-col justify-center items-start text-sm overflow-hidden">
                      <span class="text-white whitespace-nowrap text-ellipsis overflow-hidden">{{getSeriesStats(seriesName)?.series.name }}</span>
                      <span class="text-amber-500">{{ seriesTokens.length }}</span>
                    </div>
                    <div class="col-span-3 md:col-span-5 flex flex-col items-end justify-center text-[0.8rem] md:text-sm md:mr-1">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                        <div class="text-neutral-200">{{ (getSeriesValue(seriesName) / 1000000000000000000 * seriesTokens.length).toFixed(4).replace(/\.?0+$/, '') }}</div>
                        <div class="ml-1 text-neutral-500"> (<span class="text-amber-500">{{ ethereumInLocalCurrency(getSeriesValue(seriesName) * seriesTokens.length) }}</span>)</div>
                      </div>
                      <div class="flex items-center text-xs md:text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                        <div class="text-neutral-200">{{ (getSeriesValue(seriesName) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                        <div class="ml-1 text-neutral-500"> (<span class="text-neutral-300">{{ ethereumInLocalCurrency(getSeriesValue(seriesName)) }}</span>)</div>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
              <template v-else>
                <template v-for="token in sortedTokens(flattenObject(walletTokens))">
                  <div class="p-1 grid grid-cols-8 md:grid-cols-12 w-full border-neutral-700/50 rounded-lg font-bold">
                    <div class="relative rounded-md overflow-hidden" style="padding-top: 100%">
                      <a :href="`https://opensea.io/collection/${getSeriesStats(token.name)?.collection.slug}?search[query]=${token.name}`" target="_blank">
                        <img :src="getSeriesStats(token.name)?.series.image" :alt="getSeriesStats(token.name)?.series.name" class="absolute top-0 left-0 w-full h-full object-cover">
                      </a>
                    </div>
                    <div class="px-2 col-span-3 md:col-span-5 flex flex-col justify-center items-start text-sm">
                      <span class="text-white" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{getSeriesStats(token.name)?.series.name}}</span>
                      <span class="text-amber-500">#{{ token.mint_number }}</span>
                    </div>
                    <div class="ml-auto col-span-4 md:col-span-6 flex flex-col items-end justify-center text-[0.8rem] md:text-sm md:pr-2">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                        <div class="text-neutral-200">{{ (getSeriesValue(token.name) / 1000000000000000000 * (walletTokens[token.name]?.length ?? 1)).toFixed(4).replace(/\.?0+$/, '') }}</div>
                        <div class="ml-1 text-neutral-500"> (<span class="text-amber-500">{{ ethereumInLocalCurrency(getSeriesValue(token.name) * (walletTokens[token.name]?.length ?? 1)) }}</span>)</div>
                      </div>
                      <div class="flex items-center text-xs md:text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-neutral-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                        <div class="text-neutral-200">{{ (getSeriesValue(token.name) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                        <div class="ml-1 text-neutral-500"> (<span class="text-neutral-300">{{ ethereumInLocalCurrency(getSeriesValue(token.name)) }}</span>)</div>
                      </div>
                    </div>
                  </div>
                </template>
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
  useSeriesStats,
  useWalletAddresses,
  useConeEthPrice
} from "~/composables/states";
import {onMounted, ref} from "#imports";
import {Ref} from "@vue/reactivity";
import {fetchWalletTokens} from "~/composables/api/wallet";
import {WalletTokens} from "~/types/wallet";
import {TrashIcon} from "@heroicons/vue/24/outline";
import {ethereumInLocalCurrency, coneToEth, coneInLocalCurrency} from "#imports";
import {isValidEthereumAddress} from "~/global/utils";
import {ArrowPathIcon, ChevronDownIcon, XMarkIcon} from "@heroicons/vue/24/solid";
import {Token} from "~/types/token";

const seriesStats = useSeriesStats();
const walletAddresses = useWalletAddresses();
const cone = useConeEthPrice();

const walletAddress = ref<string>("");
const tokens: Ref<Map<string, WalletTokens>> = ref(new Map());
const cones: Ref<Map<string, number>> = ref(new Map());
const valuationMethod = ref<string>("floor");
const groupMethod = ref<string>("group");
const loading = ref(false);
const isRefreshing = ref(false);
const collapsedWallets: Ref<Set<string>> = ref(new Set<string>());

await updateSeriesStats();

onMounted(() => {
  walletAddresses.value.forEach((wallet) => {
    getWalletTokens(wallet);
  });
});

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

  walletAddresses.value.forEach((wallet) => {
    promises.push(getWalletTokens(wallet));
  });

  Promise.all(promises).finally(() => {
    isRefreshing.value = false;
  })
}

async function getWalletTokens(wallet: string) {
  loading.value = true;

  await fetchWalletTokens(wallet).then((data) => {
    const wallets = Object.entries(data.wallets);
    const [firstWalletAddress, firstWalletValue] = wallets[0];

    addToWalletAddresses(firstWalletAddress);

    tokens.value.set(firstWalletAddress, firstWalletValue);
    cones.value.set(firstWalletAddress, data.cones);

    walletAddress.value = "";
  });

  loading.value = false;
}

function getCones(wallet: string) {
  return cones.value.get(wallet);
}

function getSeriesStats(name: string) {
  return seriesStats.value[name];
}

function lookupDisabled(): boolean {
  return !walletAddress.value || walletAddresses.value.has(walletAddress.value) || loading.value;
}

function getWalletValue(wallet: string): number {
  let value = 0;

  for (let [walletAddress, walletTokens] of tokens.value.entries()) {
    if (walletAddress !== wallet) {
      continue;
    }

    for (let [seriesName, seriesTokens] of Object.entries(walletTokens)) {
      value += getSeriesValue(seriesName) * seriesTokens.length;
    }
  }

  return value;
}

function getSeriesValue(series: string): number {
  let price = 0;
  let stats = getSeriesStats(series)?.stats;

  switch (valuationMethod.value) {
    case "floor":
      price = stats?.lowest_listing?.payment_token.base_price;
      break;
    case "lastSale":
      price = stats?.last_sale?.payment_token.base_price;
      break;
    case "fiveLastSales":
      price = stats?.five_last_sales_average * 1000000000000000000;
      break;
    case "weeklyAvg":
      price = ((stats?.weekly_average_price ?? stats.two_weekly_average_price ?? stats.monthly_average_price)  * 1000000000000000000) ?? stats.last_sale?.payment_token.base_price;
      break;
    case "twoWeeklyAvg":
      price = ((stats.two_weekly_average_price ?? stats.monthly_average_price)  * 1000000000000000000) ?? stats.last_sale?.payment_token.base_price;
      break;
    case "monthlyAvg":
      price = (stats.monthly_average_price  * 1000000000000000000) ?? stats.last_sale?.payment_token.base_price;
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

function getTotalItems(): number {
  let items = 0;

  for (let walletTokens of tokens.value.values()) {
    for (let seriesTokens of Object.values(walletTokens)) {
      items += seriesTokens.length;
    }
  }

  return items;
}

function sortedWallets(): Map<string, WalletTokens> {
  const mapArray = Array.from(tokens.value.entries());

  mapArray.sort((a, b) => getWalletValue(a[0]) - getWalletValue(b[0]));

  return new Map(mapArray);
}

function sortedWalletTokens(walletTokens: WalletTokens): WalletTokens {
  return Object.fromEntries(
      Object.entries(walletTokens)
          .sort(([aSeriesName, aSeriesTokens], [bSeriesName, bSeriesTokens]) => ((getSeriesValue(aSeriesName) * aSeriesTokens.length) - getSeriesValue(bSeriesName) * bSeriesTokens.length))
  );
}

function sortedTokens(tokens: Array<Token>): Array<Token> {
  return tokens.sort((a, b) => {
    const seriesValueComparison = getSeriesValue(a.name) - getSeriesValue(b.name);
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

function flattenObject(obj: WalletTokens): Array<Token> {
  return Object.values(obj).reduce((acc, val) => acc.concat(val), []);
}
</script>

<style scoped>

</style>
