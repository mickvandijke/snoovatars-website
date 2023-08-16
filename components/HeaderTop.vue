<template>
  <div v-if="showingBarMarketInfo" class="w-full text-xs overflow-hidden" ref="barMarketInfo">
    <div class="px-4 py-1 bg-neutral-800/90 font-medium flex whitespace-nowrap items-center overflow-x-auto scrollbar-hide">
      <div class="inline-flex gap-2">
        <button @click="openLinkWith(`https://quickswap.exchange/#/swap/v2?currency0=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&currency1=0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c&swapIndex=0`)" class="flex items-center gap-0.5">
          <span class="text-neutral-400">BitCone:</span>
          <span class="text-neutral-500"><span class="text-neutral-300">{{ coneInLocalCurrency(cone) }}</span></span>
        </button>
        <div class="flex items-center gap-0.5">
          <span class="text-neutral-400">24hr Vol:</span>
          <div class="flex gap-0.25 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
            <div class="flex gap-1 text-neutral-300">
              <span>{{ dailyVol.toFixed(4).replace(/\.?0+$/, '') }}</span>
              <span class="hidden md:block text-neutral-500">(<span class="text-neutral-300">{{ ethereumInLocalCurrency(dailyVol * ETH_TO_GWEI_MODIFIER) }}</span>)</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-0.5">
          <span class="text-neutral-400">Market Cap:</span>
          <div class="flex gap-0.25 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="hidden md:block w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
            <div class="flex gap-1 text-neutral-300">
              <span class="hidden md:block">{{ mCap.toFixed(2).replace(/\.?0+$/, '') }}</span>
              <span class="text-neutral-500">(<span class="text-neutral-300">{{ ethereumInLocalCurrency(mCap * ETH_TO_GWEI_MODIFIER) }}</span>)</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-0.5">
          <span class="text-neutral-400">Matic:</span>
          <span class="text-neutral-500"><span class="text-neutral-300">{{ ethereumInLocalCurrency(1 / ethereumPriceMap.get("MATIC") * ETH_TO_GWEI_MODIFIER) }}</span></span>
        </div>
      </div>
    </div>
    <div v-if="isBannerShowing" class="relative bg-neutral-800/90 border-y border-white/5 flex items-center justify-center max-h-32">
      <a href="https://www.the23.club" target="_blank">
        <img src="/images/banners/hodl_banner2.png" alt="Banner Image" class="max-h-32" />
      </a>
      <button @click="isBannerClosed = !isBannerClosed" class="py-1 absolute text-sm top-0 right-1 md:top-2 md:right-4 text-neutral-400">Close Banner</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref, updateEthereumPrices, useEthereumPriceMap, useRouter, useSettings,
  useToken, useTotalDailyVolume, useTotalMarketCap,
  useUser,
  watch
} from "#imports";
import {useConeEthPrice} from "~/composables/states";
import {ethereumInLocalCurrency, coneInLocalCurrency} from "#imports";
import {ComputedRef} from "vue";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {Capacitor} from "@capacitor/core";
import {abbreviateNumber} from "~/global/utils";

const user = useUser();
const token = useToken();
const cone = useConeEthPrice();
const dailyVol = useTotalDailyVolume();
const mCap = useTotalMarketCap();
const router = useRouter();
const settings = useSettings();
const ethereumPriceMap = useEthereumPriceMap();

const showingBarMarketInfo = ref(true);
const isBannerClosed = ref(false);
const navbar = ref(null);
const navbarHeight = ref(0);

defineExpose({ navbarHeight });

const selectedCurrency = computed(() => {
  return settings.value.currency.preferred;
});

watch([selectedCurrency], () => {
  updateEthereumPrices();
});

const isBannerShowing: ComputedRef<boolean> = computed(() => {
  if (Capacitor.isNativePlatform()) {
    return false;
  }

  return !isBannerClosed.value;
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
