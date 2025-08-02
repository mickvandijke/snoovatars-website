<template>
  <div class="relative w-full text-xs bg-[#141415] border-b border-zinc-800/30 overflow-hidden z-40 shadow-sm" ref="barMarketInfo" :class="{ 'page-mobile-padding-top': Capacitor.isNativePlatform() }">
    <div class="px-2 sm:px-4 lg:px-6 py-2 flex whitespace-nowrap items-center overflow-x-auto scrollbar-hide duration-500 min-w-0" :class="{ 'opacity-0': hideItems }">
      <div class="inline-flex shrink-0 items-center divide-x divide-zinc-700/40">
        <button @click="openLinkWith(`https://app.uniswap.org/tokens/polygon/0x875f123220024368968d9f1ab1f3f9c2f3fd190d`)" class="market-info-item group cursor-pointer">
          <div class="flex items-center gap-3 text-xs">
            <div class="flex items-center gap-2">
              <img class="h-4 w-4" src="/images/branding/rcax/RCAX_Logo_Color.svg">
              <span class="text-zinc-400">{{ gweiInLocalCurrency(rcax) }}</span>
            </div>
<!--            <div class="flex items-center gap-1">-->
<!--              <span class="text-zinc-500">Supply:</span>-->
<!--              <span class="text-zinc-400">{{ Math.round(rcaxInfo?.data.attributes.total_supply / ETH_TO_GWEI_MODIFIER).toLocaleString() ?? 0 }}</span>-->
<!--            </div>-->
<!--            <div class="flex items-center gap-1">-->
<!--              <span class="text-zinc-500">MC:</span>-->
<!--              <span class="text-zinc-400">{{ ethereumInLocalCurrency(rcax * (rcaxInfo?.data.attributes.total_supply ?? 0)) }}</span>-->
<!--            </div>-->
          </div>
        </button>
        
        <div class="market-info-item">
          <div class="flex items-center gap-2">
            <img class="h-4 w-4" src="/images/coins/eth/icon.svg">
            <span class="text-zinc-400">{{ ethereumInLocalCurrency(ETH_TO_GWEI_MODIFIER) }}</span>
          </div>
        </div>
        
        <div class="market-info-item">
          <div class="flex items-center gap-2">
            <img class="h-4 w-4" src="/images/coins/matic/icon.svg">
            <span class="text-zinc-400">{{ ethereumInLocalCurrency(1 / ethereumPriceMap.get("MATIC") * ETH_TO_GWEI_MODIFIER) }}</span>
          </div>
        </div>
      </div>
      
      <div class="ml-4 md:ml-auto">
        <div class="market-info-item">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 flex-shrink-0">
              <img class="w-4 h-4 min-w-[1rem] min-h-[1rem]" src="/images/branding/reddit-icon.svg" alt="Reddit">
            </div>
            <div class="flex items-center gap-1">
              <span class="text-zinc-500">24h Vol:</span>
              <div class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                <span class="text-zinc-400">{{ dailyVol.toFixed(4).replace(/\.?0+$/, '') }}</span>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-zinc-500">MC:</span>
              <span class="text-zinc-400">{{ ethereumInLocalCurrency(mCap * ETH_TO_GWEI_MODIFIER) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, onBeforeUnmount,
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
import {Ref} from "@vue/reactivity";

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

const props = defineProps({
  hideItems: {
    type: Boolean,
    default: false,
  }
});

const selectedCurrency = computed(() => {
  return settings.value.currency.preferred;
});

onMounted(() => {
  updateMarketInfo();
});

watch([selectedCurrency], () => {
  updateEthereumPrices();
});

function openLinkWith(url: string) {
  if (settings.value.link.opener) {
    window.open(url, '_blank');
  } else {
    window.location.href = url;
  }
}
</script>

<style scoped>
.market-info-item {
  @apply px-3 py-1 flex-shrink-0;
}


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
