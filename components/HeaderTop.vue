<template>
  <div v-if="showingBarMarketInfo" class="border-white/5 w-full text-xs overflow-hidden" ref="barMarketInfo" :class="{ 'page-mobile-padding-top bg-primary/90 backdrop-blur-lg': Capacitor.isNativePlatform() }">
    <div class="px-2 sm:px-6 py-2 flex whitespace-nowrap items-center overflow-x-auto scrollbar-hide">
      <div class="inline-flex shrink-0 gap-2 sm:gap-3">
        <button @click="openLinkWith(`https://app.uniswap.org/tokens/polygon/0x875f123220024368968d9f1ab1f3f9c2f3fd190d`)" class="px-3 py-2 flex items-center divide-x divide-white/5 bg-tertiary/50 hover:bg-tertiary rounded-xl duration-200">
          <img class="h-4 pr-2" src="/images/branding/rcax/RCAX_Logo_Color.svg">
          <span class="text-white/60 px-2">{{ gweiInLocalCurrency(rcax) }}</span>
          <div class="pl-2 flex gap-1">
            <span class="text-white/40">MC:</span>
            <span class="text-white/60">{{ ethereumInLocalCurrency(rcax * (rcaxInfo?.data.attributes.total_supply ?? 0)) }}</span>
          </div>
        </button>
        <div class="px-3 py-2 flex items-center divide-x divide-white/5 bg-tertiary/50 rounded-xl duration-200">
          <span class="text-white/60 pr-2">RCA</span>
          <div class="px-2 flex gap-1">
            <span class="text-white/40">24h Vol:</span>
            <div class="flex gap-0.25 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="flex gap-1 text-white/60">
                <span>{{ dailyVol.toFixed(4).replace(/\.?0+$/, '') }}</span>
              </div>
            </div>
          </div>
          <div class="pl-2 flex gap-1">
            <span class="text-white/40">MC:</span>
            <span class="text-white/60">{{ ethereumInLocalCurrency(mCap * ETH_TO_GWEI_MODIFIER) }}</span>
          </div>
        </div>
        <div class="px-3 py-2 flex items-center divide-x divide-white/5 bg-tertiary/50 rounded-xl duration-200">
          <img class="h-4 pr-2" src="/images/coins/cone/icon.webp">
          <span class="text-white/60 px-2">{{ gweiInLocalCurrency(cone) }}</span>
          <div class="pl-2 flex gap-1">
            <span class="text-white/40">MC:</span>
            <span class="text-white/60">{{ ethereumInLocalCurrency(cone * 600000000000 * ETH_TO_GWEI_MODIFIER) }}</span>
          </div>
        </div>
        <div class="px-3 py-2 flex items-center divide-x divide-white/5 bg-tertiary/50 rounded-xl duration-200">
          <img class="h-3 pr-2" src="/images/coins/matic/icon.svg">
          <span class="text-white/60 pl-2">{{ ethereumInLocalCurrency(1 / ethereumPriceMap.get("MATIC") * ETH_TO_GWEI_MODIFIER) }}</span>
        </div>
      </div>
      <template v-if="!Capacitor.isNativePlatform()">
        <a href="https://whitepaper.rcax.io/" target="_blank" class="hidden md:flex gap-1 ml-auto mx-1 px-3 py-1.5 text-header hover:text-header font-semibold rounded-lg duration-200 cursor-pointer">
          <span class="text-orange-500">NEW</span>
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
import {useConeEthPrice, useRcaxTokenInfo} from "~/composables/states";
import {ethereumInLocalCurrency, gweiInLocalCurrency} from "#imports";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {Capacitor} from "@capacitor/core";

const user = useUser();
const token = useToken();
const rcaxInfo = useRcaxTokenInfo();
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
