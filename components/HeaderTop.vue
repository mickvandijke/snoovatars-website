<template>
  <div v-if="showingBarMarketInfo" class="sm:py-2 bg-secondary w-full text-xs overflow-hidden" ref="barMarketInfo" :class="{ 'page-mobile-padding-top': Capacitor.isNativePlatform() }">
    <div class="px-4 sm:px-6 py-1 flex whitespace-nowrap items-center overflow-x-auto scrollbar-hide">
      <div class="inline-flex gap-2 sm:gap-3">
        <button @click="openLinkWith(`https://app.uniswap.org/tokens/polygon/0x875f123220024368968d9f1ab1f3f9c2f3fd190d`)" class="flex items-center gap-1 text-header hover:text-amber-400 duration-200">
          <span class="text-details">RCAX:</span>
          <span class="font-medium">{{ gweiInLocalCurrency(rcax) }}</span>
        </button>
        <button @click="openLinkWith(`https://app.uniswap.org/tokens/polygon/0x875f123220024368968d9f1ab1f3f9c2f3fd190d`)" class="flex items-center gap-1 text-header hover:text-amber-400 duration-200">
          <span class="text-details">RCAX Market Cap:</span>
          <span class="font-medium">{{ ethereumInLocalCurrency(rcax * (rcaxInfo?.data.attributes.total_supply ?? 0)) }}</span>
        </button>
        <div class="flex items-center gap-0.5">
          <span class="text-details">Avatar 24h Vol:</span>
          <div class="flex gap-0.25 items-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
            <div class="flex gap-1 text-header">
              <span>{{ dailyVol.toFixed(4).replace(/\.?0+$/, '') }}</span>
<!--              <span class="text-header font-medium">{{ ethereumInLocalCurrency(dailyVol * ETH_TO_GWEI_MODIFIER) }}</span>-->
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-details">Avatar Market Cap:</span>
          <span class="text-header font-medium">{{ ethereumInLocalCurrency(mCap * ETH_TO_GWEI_MODIFIER) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-details">CONE:</span>
          <span class="text-header font-medium">{{ gweiInLocalCurrency(cone) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-details">MATIC:</span>
          <span class="text-header font-medium">{{ ethereumInLocalCurrency(1 / ethereumPriceMap.get("MATIC") * ETH_TO_GWEI_MODIFIER) }}</span>
        </div>
      </div>
      <template v-if="!Capacitor.isNativePlatform()">
        <a href="https://whitepaper.rcax.io/" target="_blank" class="hidden md:flex gap-1 ml-auto mx-1 px-3 py-1.5 text-header hover:text-header font-semibold rounded-lg duration-200 cursor-pointer">
          <span class="text-orange-600">NEW</span>
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
