<template>
  <div class="w-full max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">More</h1>
      <p class="text-zinc-400">Discover additional tools and features</p>
    </div>

    <!-- Pro Upgrade Banner -->
    <template v-if="user?.tier < 1 || !user">
      <NuxtLink to="/upgrade" class="block mb-8">
        <div class="relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 md:p-8 hover:from-amber-500 hover:to-orange-500 transition-all duration-300 group">
          <div class="relative z-10">
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">Upgrade to Pro</h2>
            <p class="text-white/90 text-lg">Unlock premium features and enhance your experience</p>
          </div>
          <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
        </div>
      </NuxtLink>
    </template>


    <!-- Tools & Features Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <!-- Account Section -->
      <div class="col-span-full mb-4">
        <h2 class="text-xl font-semibold text-zinc-400 mb-4">Account</h2>
      </div>
      
      <!-- Currency Display -->
      <div class="col-span-full">
        <div class="max-w-md">
          <label class="text-zinc-400 text-sm block mb-2">Preferred Currency</label>
          <select 
            v-model="settings.currency.preferred"
            class="w-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-lg px-3 py-2"
          >
            <option v-for="currency in CURRENCIES" :key="currency.ticker" :value="currency.ticker">
              {{ currency.ticker }} - {{ currency.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Authentication Buttons -->
      <div class="col-span-full">
        <div class="max-w-md">
          <template v-if="user?.username">
            <button
              @click="signOut"
              class="w-full px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-all duration-200 font-medium text-sm text-center border border-zinc-700/50"
            >
              Sign Out
            </button>
          </template>
          <template v-else>
            <div class="flex flex-col sm:flex-row gap-3">
              <NuxtLink
                to="/login"
                class="flex-1 px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-all duration-200 font-medium text-sm text-center border border-zinc-700/50"
              >
                Sign In
              </NuxtLink>
              <NuxtLink
                to="/signup"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 font-medium text-sm text-center"
              >
                Create Account
              </NuxtLink>
            </div>
          </template>
        </div>
      </div>

      <!-- Free Tools Section -->
      <div class="col-span-full mt-6 mb-4">
        <h2 class="text-xl font-semibold text-zinc-400 mb-4">Free Tools</h2>
      </div>

      <NuxtLink to="/avatar" class="block">
        <div class="feature-card">
          <div class="flex items-start justify-between mb-4">
            <PhotoIcon class="w-10 h-10 text-zinc-400" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Avatar Exporter</h3>
          <p class="text-zinc-400 text-sm">Customize and download your avatar in high quality</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/shop" class="block">
        <div class="feature-card">
          <div class="flex items-start justify-between mb-4">
            <ShoppingBagIcon class="w-10 h-10 text-zinc-400" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Shop Watcher</h3>
          <p class="text-zinc-400 text-sm">Track upcoming releases and use direct shop links</p>
        </div>
      </NuxtLink>

      <NuxtLink to="/alerts" class="block">
        <div class="feature-card">
          <div class="flex items-start justify-between mb-4">
            <BellIcon class="w-10 h-10 text-zinc-400" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Price Alerts</h3>
          <p class="text-zinc-400 text-sm">Set custom alerts and get notified via push or email</p>
        </div>
      </NuxtLink>

      <!-- Premium Tools Section -->
      <div class="col-span-full mt-6 mb-4">
        <h2 class="text-xl font-semibold text-zinc-400 mb-4">Premium Tools</h2>
      </div>

      <NuxtLink to="/listings" class="block">
        <div class="feature-card premium">
          <div class="flex items-start justify-between mb-4">
            <TagIcon class="w-10 h-10 text-amber-500" />
            <span class="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-semibold rounded-lg">PRO</span>
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">Listings Browser</h3>
          <p class="text-zinc-400 text-sm">Browse all collection listings in one table with advanced filters</p>
        </div>
      </NuxtLink>

      <!-- DApps Section (Desktop Only) -->
      <template v-if="!Capacitor.isNativePlatform()">
        <div class="col-span-full mt-6 mb-4">
          <h2 class="text-xl font-semibold text-zinc-400 mb-4">Decentralized Apps</h2>
        </div>

        <NuxtLink to="/dapps/randomavatarswap" class="block">
          <div class="feature-card dapp">
            <div class="flex items-start justify-between mb-4">
              <ArrowPathRoundedSquareIcon class="w-10 h-10 text-purple-500" />
              <span class="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-lg">DAPP</span>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Random Avatar Swap</h3>
            <p class="text-zinc-400 text-sm">Swap your avatar with a random one from the pool</p>
          </div>
        </NuxtLink>

        <NuxtLink to="/dapps/convertclassic" class="block">
          <div class="feature-card dapp">
            <div class="flex items-start justify-between mb-4">
              <ArrowPathIcon class="w-10 h-10 text-purple-500" />
              <span class="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-semibold rounded-lg">DAPP</span>
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">Convert Classic Tokens</h3>
            <p class="text-zinc-400 text-sm">Convert RCAX Classic tokens to RCAX V2</p>
          </div>
        </NuxtLink>
      </template>

      <!-- External Links Section -->
      <div class="col-span-full mt-6 mb-4">
        <h2 class="text-xl font-semibold text-zinc-400 mb-4">External Resources</h2>
      </div>

      <a href="https://avatartraits.xyz" target="_blank" class="block">
        <div class="feature-card">
          <div class="flex items-start justify-between mb-4">
            <GlobeAltIcon class="w-10 h-10 text-zinc-400" />
            <ArrowTopRightOnSquareIcon class="w-5 h-5 text-zinc-500" />
          </div>
          <h3 class="text-lg font-semibold text-white mb-2">AvatarTraits.xyz</h3>
          <p class="text-zinc-400 text-sm">Explore detailed avatar traits and rarities</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  PhotoIcon, TagIcon, BellIcon, ArrowPathRoundedSquareIcon, 
  ShoppingBagIcon, ArrowPathIcon, UserCircleIcon, GlobeAltIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/vue/24/outline";
import { useUser, useSettings, watch, computed, updateEthereumPrices } from "#imports";
import { deleteToken } from '~/composables/api/user';
import { Capacitor } from "@capacitor/core";
import { CURRENCIES } from "~/types/currency";

const user = useUser();
const settings = useSettings();

const selectedCurrency = computed(() => {
  return settings.value.currency.preferred;
});

watch([selectedCurrency], () => {
  updateEthereumPrices();
});

function signOut() {
  deleteToken();
}
</script>

<style scoped>
.feature-card {
  @apply relative p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-200 cursor-pointer h-full;
}

.feature-card.premium {
  @apply border-amber-900/30 hover:border-amber-800/50 bg-gradient-to-br from-zinc-900 to-amber-950/20;
}

.feature-card.dapp {
  @apply border-purple-900/30 hover:border-purple-800/50 bg-gradient-to-br from-zinc-900 to-purple-950/20;
}
</style>