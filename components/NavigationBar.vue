<template>
  <div
      class="fixed top-0 flex flex-col bg-black/80 border-b border-neutral-900 z-40 w-full"
      style="backdrop-filter: blur(20px);padding-top: env(safe-area-inset-top);"
      @mouseleave="closeDropdowns()"
      ref="navbar"
  >
    <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="showingBarMarketInfo" class="px-4 py-1 text-xs md:text-sm border-b border-neutral-900 overflow-hidden" ref="barMarketInfo">
        <div class="flex whitespace-nowrap items-center sm:justify-center overflow-x-auto scrollbar-hide">
          <div class="inline-flex gap-2">
            <button @click="openLinkWith(`https://quickswap.exchange/#/swap/v2?currency0=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&currency1=0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c&swapIndex=0`)" class="flex items-center gap-0.5">
              <span class="text-neutral-400 font-bold">BitCone:</span>
              <span class="text-neutral-500 font-bold">(<span class="text-amber-500">{{ coneInLocalCurrency(cone) }}</span>)</span>
            </button>
            <div class="flex items-center gap-0.5">
              <span class="text-neutral-400 font-bold">24hr Vol:</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="flex gap-1 font-bold text-white">
                <span>{{ dailyVol.toFixed(4).replace(/\.?0+$/, '') }}</span>
                <span class="hidden md:block text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(dailyVol * 1000000000000000000) }}</span>)</span>
              </div>
            </div>
            <div class="flex items-center gap-0.5">
              <span class="text-neutral-400 font-bold">Market Cap:</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="hidden md:block w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
              <div class="flex gap-1 font-bold text-white">
                <span class="hidden md:block">{{ mCap.toFixed(2).replace(/\.?0+$/, '') }}</span>
                <span class="text-neutral-500">(<span class="text-amber-500">{{ ethereumInLocalCurrency(mCap * 1000000000000000000) }}</span>)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <nav class="py-2 px-4 lg:flex lg:justify-between lg:items-center">
      <div class="flex flex-row items-center gap-4 lg:gap-6">
        <div class="flex flex-row flex-nowrap items-center">
          <NuxtLink
              class="text-2xl font-bold text-white lg:text-3xl duration-500"
              to="/home"
          >
            RCA<span class="italic text-amber-500">X</span>.io
          </NuxtLink>
<!--          <a href="https://www.youtube.com/watch?v=xDeQVaoTvJM" class="ml-2 relative rounded overflow-hidden w-10">-->
<!--            <UkrainianFlagIcon class="w-full h-full object-cover" />-->
<!--          </a>-->
        </div>
        <div class="ml-auto flex items-center flex-nowrap gap-0.25">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-4 h-4 text-amber-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
          <span class="font-bold text-white whitespace-nowrap">{{ ethereumInLocalCurrency(1000000000000000000) }}</span>
        </div>
        <div>
          <select v-model="preferredCurrency" class="px-2 py-1.5 rounded-md bg-neutral-900 border-none text-sm focus:outline-none max-w-sm">
            <template v-for="currency in CURRENCIES">
              <option :value="currency.ticker">{{ currency.ticker }}</option>
            </template>
          </select>
        </div>
        <!-- Mobile menu button -->
        <div @click="toggleNav" class="flex lg:hidden">
          <button
              type="button"
              class="
              text-gray-100
              hover:text-gray-400
              focus:outline-none focus:text-gray-400
            "
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path
                  fill-rule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <ul
          :class="showMenu ? 'flex' : 'hidden'"
          class="flex-col my-4 lg:my-0 text-neutral-200 font-semibold gap-3 lg:flex lg:gap-0 lg:flex-row lg:items-center lg:space-x-3 lg:mt-0"
      >
        <NuxtLink class="hidden md:block px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg duration-200 cursor-pointer" active-class="text-amber-500" to="/stats">Dashboard</NuxtLink>
        <NuxtLink class="hidden md:block px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg duration-200 cursor-pointer" active-class="text-amber-500" to="/avatar/exporter">Avatar Exporter</NuxtLink>
        <NuxtLink class="hidden md:block px-4 py-2 bg-neutral-900 hover:bg-neutral-800 rounded-lg duration-200 cursor-pointer" active-class="text-amber-500" to="/alerts">Price Alerts</NuxtLink>
        <template v-if="token && user?.username">
          <div
              @mouseover="userDropDown = true"
              @click="userDropDown = !userDropDown"
              class="relative px-4 py-2 flex flex-row flex-nowrap bg-neutral-900 hover:bg-neutral-800 text-amber-500 rounded-lg duration-200 cursor-pointer">
            <div>
              <button
                  class="flex flex-row flex-nowrap"
              >
                {{ user.username }}
                <ChevronDownIcon class="ml-1 w-5 opacity-50"/>
              </button>
            </div>

            <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
              <template v-if="userDropDown">
                <div class="absolute left-0 lg:left-auto lg:right-0 top-10 z-10 mt-2 w-56 bg-neutral-900 rounded-lg shadow">
                  <ul class="p-3 font-semibold capitalize">
                    <template v-if="user?.tier < 1">
                      <NuxtLink
                          class="p-3 w-full inline-flex items-center hover:bg-neutral-700/50 text-amber-500 rounded-lg duration-200"
                          replace
                          to="/upgrade"
                      >
                        Upgrade to Pro
                      </NuxtLink>
                    </template>
                    <li @click="deleteAccount()" class="p-3 w-full inline-flex items-center hover:bg-neutral-700/50 text-neutral-400 rounded-lg duration-200">
                      <a class="inline-flex items-center">
                        <span class="flex flex-nowrap whitespace-nowrap">Delete account</span>
                      </a>
                    </li>
                    <li @click="logout()" class="p-3 w-full inline-flex items-center hover:bg-neutral-700/50 text-neutral-400 rounded-lg duration-200">
                      <a class="inline-flex items-center">
                        <span class="flex flex-nowrap whitespace-nowrap">Sign out</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </template>
            </transition>
          </div>
        </template>
        <template v-else>
          <NuxtLink class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg duration-200 cursor-pointer" to="/login">Login</NuxtLink>
        </template>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {ChevronDownIcon} from "@heroicons/vue/20/solid";
import {Ref} from "@vue/reactivity";
import {
  onBeforeUnmount,
  ref, useRouter,
  useToken, useTotalDailyVolume, useTotalMarketCap,
  useUser,
  watch
} from "#imports";
import {deleteToken, deleteUser} from "~/composables/api/user";
import {CURRENCIES} from "~/types/currency";
import {
  setPreferredCurrency,
  updateMarketInfo,
  useConeEthPrice,
  usePreferredCurrency
} from "~/composables/states";
import {ethereumInLocalCurrency, coneInLocalCurrency} from "#imports";
import {onMounted} from "vue";
import {Capacitor} from "@capacitor/core";
import {navigateTo} from "nuxt/app";

const user = useUser();
const token = useToken();
const cone = useConeEthPrice();
const dailyVol = useTotalDailyVolume();
const mCap = useTotalMarketCap();
const router = useRouter();

const showMenu: Ref<boolean> = ref(false);
const userDropDown: Ref<boolean> = ref(false);
const preferredCurrency: Ref<string> = ref(usePreferredCurrency().value);
const scrollThreshold = 10; // Adjust this threshold value as needed
const prevScrollPos = ref(window.pageYOffset);
const showingBarMarketInfo = ref(true);
const navbar = ref(null);

defineExpose({ navbar });

router.afterEach(() => {
  showMenu.value = false;
});

watch([preferredCurrency], () => {
  setPreferredCurrency(preferredCurrency.value);
})

onMounted(() => {
  updateMarketInfo();
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

async function deleteAccount() {
  if (!user.value.username) {
    return;
  }

  await navigateTo(`/accountdeletion`, {replace: true});
}

const handleScroll = () => {
  const currentScrollPos = window.pageYOffset;

  if (currentScrollPos > prevScrollPos.value) {
    // Scrolling down
    if (showingBarMarketInfo.value) {
      if (currentScrollPos > scrollThreshold) {
        // Hide barMarketInfo
        showingBarMarketInfo.value = false;
      }
    }
  } else {
    // Scrolling up
    if (!showingBarMarketInfo.value) {
      if (currentScrollPos <= scrollThreshold / 2) {
        // Show barMarketInfo
        showingBarMarketInfo.value = true;
      }
    }
  }

  prevScrollPos.value = currentScrollPos;
};

const toggleNav = () => (showMenu.value = !showMenu.value);

function logout() {
  deleteToken();
}

function closeDropdowns() {
  userDropDown.value = false;
}
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

.right-box
{
  box-shadow: inset -70px 0 90px -70px rgba(38,38,38,0.9);
}
</style>
