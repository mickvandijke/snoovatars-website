<template>
  <div v-if="showingBarMarketInfo" class="bg-primary-accent-solid w-full text-xs overflow-hidden" ref="barMarketInfo" :class="{ 'page-mobile-padding-top': Capacitor.isNativePlatform() }">
    <div class="px-4 sm:px-8 py-1 flex whitespace-nowrap items-center overflow-x-auto scrollbar-hide">
      <div class="inline-flex gap-2">
        <button @click="openLinkWith(`https://quickswap.exchange/#/swap/v2?currency0=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&currency1=0xc99bd85ba824de949cf088375225e3fdcdb6696c&swapIndex=0`)" class="flex items-center gap-0.5">
          <span class="text-white/60">RCAX:</span>
          <span class="text-white/60 font-medium"><span class="text-white/80">{{ coneInLocalCurrency(rcax) }}</span></span>
        </button>
        <button @click="openLinkWith(`https://quickswap.exchange/#/swap/v2?currency0=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&currency1=0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c&swapIndex=0`)" class="flex items-center gap-0.5">
          <span class="text-white/60">BitCone:</span>
          <span class="text-white/60 font-medium"><span class="text-white/80">{{ coneInLocalCurrency(cone) }}</span></span>
        </button>
        <div class="flex items-center gap-0.5">
          <span class="text-white/60">24hr Vol:</span>
          <div class="flex gap-0.25 items-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
            <div class="flex gap-1 text-white/80">
              <span>{{ dailyVol.toFixed(4).replace(/\.?0+$/, '') }}</span>
              <span class="hidden md:block text-white/60">(<span class="text-white/80">{{ ethereumInLocalCurrency(dailyVol * ETH_TO_GWEI_MODIFIER) }}</span>)</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-0.5">
          <span class="text-white/60">Market Cap:</span>
          <div class="flex gap-0.25 items-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="hidden md:block w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
            <div class="flex gap-1 text-white/80">
              <span class="hidden md:block">{{ mCap.toFixed(2).replace(/\.?0+$/, '') }}</span>
              <span class="text-white/60">(<span class="text-white/80">{{ ethereumInLocalCurrency(mCap * ETH_TO_GWEI_MODIFIER) }}</span>)</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-0.5">
          <span class="text-white/60">Matic:</span>
          <span class="text-white/60 font-medium"><span class="text-white/80">{{ ethereumInLocalCurrency(1 / ethereumPriceMap.get("MATIC") * ETH_TO_GWEI_MODIFIER) }}</span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onMounted,
  ref, updateEthereumPrices, updateMarketInfo, useEthereumPriceMap, useRcaxEthPrice, useRouter, useSettings,
  useToken, useTotalDailyVolume, useTotalMarketCap,
  useUser,
  watch
} from "#imports";
import {useConeEthPrice} from "~/composables/states";
import {ethereumInLocalCurrency, coneInLocalCurrency} from "#imports";
import {ComputedRef} from "vue";
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
const navbarHeight = ref(0);

defineExpose({ navbarHeight });

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
