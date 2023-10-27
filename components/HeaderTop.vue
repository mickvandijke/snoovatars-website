<template>
  <div v-if="showingBarMarketInfo" class="sm:py-2 border-b border-primary-accent sm:border-primary-border w-full text-xs overflow-hidden" ref="barMarketInfo" :class="{ 'page-mobile-padding-top': Capacitor.isNativePlatform() }">
    <div class="px-4 sm:px-6 py-1 flex whitespace-nowrap items-center overflow-x-auto scrollbar-hide">
      <div class="inline-flex gap-2 sm:gap-3">
        <button @click="openLinkWith(`https://app.uniswap.org/tokens/polygon/0x875f123220024368968d9f1ab1f3f9c2f3fd190d`)" class="flex items-center gap-1 text-amber-500 hover:text-amber-400 duration-200">
          <span class="text-white/60">RCAX:</span>
          <span class="font-medium">{{ coneInLocalCurrency(rcax) }}</span>
        </button>
        <button @click="openLinkWith(`https://quickswap.exchange/#/swap/v2?currency0=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&currency1=0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c&swapIndex=0`)" class="flex items-center gap-1 text-amber-500 hover:text-amber-400 duration-200">
          <span class="text-white/60">CONE:</span>
          <span class="font-medium">{{ coneInLocalCurrency(cone) }}</span>
        </button>
        <div class="flex items-center gap-0.5">
          <span class="text-white/60">24h Vol:</span>
          <div class="flex gap-0.25 items-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
            <div class="flex gap-1 text-white/80">
              <span>{{ dailyVol.toFixed(4).replace(/\.?0+$/, '') }}</span>
              <span class="text-amber-500 font-medium">{{ ethereumInLocalCurrency(dailyVol * ETH_TO_GWEI_MODIFIER) }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-white/60">Total Market Cap:</span>
          <span class="text-amber-500 font-medium">{{ ethereumInLocalCurrency(mCap * ETH_TO_GWEI_MODIFIER) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-white/60">Matic:</span>
          <span class="text-amber-500 font-medium">{{ ethereumInLocalCurrency(1 / ethereumPriceMap.get("MATIC") * ETH_TO_GWEI_MODIFIER) }}</span>
        </div>
      </div>
      <template v-if="!Capacitor.isNativePlatform()">
        <a href="https://whitepaper.rcax.io/" target="_blank" class="hidden md:flex gap-1 ml-auto mx-1 px-3 py-1.5 text-white/80 hover:text-white font-semibold rounded-lg duration-200 cursor-pointer">
          <span class="text-amber-500">NEW</span>
          <span>RCAX Token Launch!</span>
        </a>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  updateEthereumPrices,
  updateMarketInfo,
  useEthereumPriceMap,
  useRcaxEthPrice,
  useRouter,
  useSettings,
  useToken,
  useTotalDailyVolume,
  useTotalMarketCap,
  useUser,
  watch
} from "#imports";
import {useConeEthPrice} from "~/composables/states";
import {ethereumInLocalCurrency, coneInLocalCurrency} from "#imports";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {Capacitor} from "@capacitor/core";

const user = useUser();
const token = useToken();
const rcax = useRcaxEthPrice();
const cone = useConeEthPrice();
const dailyVol = useTotalDailyVolume();
const mCap = useTotalMarketCap();
const router = useRouter();
const settings = useSettings();
const ethereumPriceMap = useEthereumPriceMap();

const showingBarMarketInfo = ref(true);
const navbar = ref(null);

const selectedCurrency = computed(() => {
  return settings.value.currency.preferred;
});

onMounted(() => {
  updateMarketInfo();
});

watch([selectedCurrency], () => {
  updateEthereumPrices();
});
</script>

<style scoped>
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
