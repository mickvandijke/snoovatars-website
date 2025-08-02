<template>
  <div>
    <!-- Sidebar - Desktop Only -->
    <aside 
      v-if="isDesktop"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false; appsMenuOpen = false"
      class="group fixed left-0 top-0 h-full bg-[#141415] border-r border-zinc-800/50 flex flex-col transition-all duration-300 ease-in-out overflow-hidden z-50"
      :class="isCompact && !isHovered ? 'w-16' : 'w-64'"
    >
        <!-- Logo Section -->
        <div class="px-4 py-6 overflow-hidden">
          <div class="flex items-center gap-3 min-w-0">
            <div class="relative flex-shrink-0">
              <img class="h-8 w-8 transition-transform duration-300" src="/images/branding/rcax/RCAX_RoundedSquare_Color.svg">
            </div>
            <div
              class="transition-all duration-300 overflow-hidden flex-shrink-0"
              :class="isDesktop && isCompact && !isHovered ? 'w-0 opacity-0' : 'w-auto opacity-100'"
            >
              <img 
                class="h-5 w-auto whitespace-nowrap transition-opacity duration-150"
                :class="isDesktop && isCompact && !isHovered ? 'delay-150' : 'delay-0'"
                src="/images/branding/rcax/RCAX_Text_White.svg"
              >
            </div>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex-1 overflow-y-auto overflow-x-hidden px-2 py-0">
          <!-- Main Navigation -->
          <div class="space-y-1">
            
            <NuxtLink 
              to="/" 
              exact-active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
            >
              <HomeIcon class="sidebar-icon flex-shrink-0" />
              <span>Avatars</span>
            </NuxtLink>

            <NuxtLink
                to="/watchlist"
                exact-active-class="sidebar-link-active"
                class="sidebar-link"
                :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
              >
              <StarIcon class="sidebar-icon flex-shrink-0" />
              <span>Watchlist</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/events" 
              active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
            >
              <BoltIcon class="sidebar-icon flex-shrink-0" />
              <span>Activity</span>
            </NuxtLink>

            <NuxtLink 
              to="/wallet" 
              active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
            >
              <WalletIcon class="sidebar-icon flex-shrink-0" />
              <span>Wallet</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/shop" 
              active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
            >
              <ShoppingBagIcon class="sidebar-icon flex-shrink-0" />
              <span>Shop</span>
            </NuxtLink>

            <NuxtLink 
              to="/listings" 
              active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
            >
              <GlobeEuropeAfricaIcon class="sidebar-icon flex-shrink-0" />
              <span>Listings</span>
            </NuxtLink>

            <NuxtLink
                to="/avatar"
                active-class="sidebar-link-active"
                class="sidebar-link"
                :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
              >
              <PhotoIcon class="sidebar-icon flex-shrink-0" />
              <span>Exporter</span>
            </NuxtLink>

            <NuxtLink 
              to="/alerts" 
              active-class="sidebar-link-active" 
              class="sidebar-link"
              :class="{ 'compact-mode': isDesktop && isCompact && !isHovered }"
            >
              <BellIcon class="sidebar-icon flex-shrink-0" />
              <span>Alerts</span>
            </NuxtLink>
          </div>

          <!-- Apps Section -->
          <template v-if="!Capacitor.isNativePlatform() && !(isDesktop && isCompact && !isHovered)">
            <div class="mt-3 pt-3 border-t border-zinc-700/50 space-y-1">
              <NuxtLink 
                to="/dapps/randomavatarswap"
                class="sidebar-link"
                >
                <Squares2X2Icon class="sidebar-icon flex-shrink-0" />
                <span>Random Avatar Swap</span>
              </NuxtLink>
              <NuxtLink 
                to="https://avatartraits.xyz"
                target="_blank"
                class="sidebar-link"
                >
                <GlobeAltIcon class="sidebar-icon flex-shrink-0" />
                <span>AvatarTraits.xyz</span>
              </NuxtLink>
            </div>
          </template>
        </nav>

        <!-- Bottom Section -->
        <div 
          v-if="!(isDesktop && isCompact && !isHovered)"
          class="border-t border-zinc-800/50 p-4 space-y-3 overflow-hidden"
        >
          <!-- Currency Selector -->
          <div class="relative">
            <select 
              v-model="settings.currency.preferred"
              class="w-full appearance-none bg-zinc-800/30 border border-zinc-700/30 text-zinc-400 text-sm rounded-lg px-3 py-2 pr-8 hover:bg-zinc-700/40 hover:border-zinc-600/50 focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-200"
            >
              <option v-for="currency in CURRENCIES" :key="currency.ticker" :value="currency.ticker" class="bg-zinc-800">
                {{ currency.ticker }}
              </option>
            </select>
            <ChevronDownIcon class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          <!-- User Section -->
          <template v-if="user?.username">
            <div class="space-y-2">
              <div class="flex items-center space-x-3 px-3 py-2 bg-zinc-800/30 rounded-lg min-w-0">
                <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0 overflow-hidden">
                  <div class="text-white font-medium text-sm truncate">{{ user.username }}</div>
                  <div class="text-zinc-500 text-xs whitespace-nowrap">{{ user.tier < 1 ? 'Free User' : 'Pro User' }}</div>
                </div>
              </div>
              
              <template v-if="user?.tier < 1">
                <NuxtLink
                  to="/upgrade"
                      class="block w-full px-3 py-2 text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 rounded-lg transition-all duration-200 font-medium text-sm text-center"
                >
                  Upgrade to Pro
                </NuxtLink>
              </template>
              
              <button 
                @click="logout()"
                class="block w-full text-left px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-all duration-200 text-sm"
              >
                Sign out
              </button>
            </div>
          </template>
          <template v-else>
            <div class="space-y-2">
              <NuxtLink
                to="/login"
                  class="block px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-all duration-200 font-medium text-sm text-center border border-zinc-700/50"
              >
                Login
              </NuxtLink>
              <NuxtLink
                to="/signup"
                  class="block px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 font-medium text-sm text-center"
              >
                Create account
              </NuxtLink>
            </div>
          </template>
        </div>
      </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from '#imports';
import { useUser, useSettings, useRouter } from '#imports';
import { deleteToken } from '~/composables/api/user';
import { CURRENCIES } from '~/types/currency';
import { Capacitor } from '@capacitor/core';
import { 
  ChevronDownIcon, HomeIcon, PhotoIcon,
  Squares2X2Icon, WalletIcon, BoltIcon, 
  ShoppingBagIcon, GlobeEuropeAfricaIcon, BellIcon, StarIcon, GlobeAltIcon
} from '@heroicons/vue/24/outline';

const user = useUser();
const settings = useSettings();
const router = useRouter();

const appsMenuOpen = ref(false);
const isDesktop = ref(false);
const isCompact = ref(true);
const isHovered = ref(false);

const checkDesktop = () => {
  isDesktop.value = window.innerWidth >= 1024;
};

onMounted(() => {
  checkDesktop();
  window.addEventListener('resize', checkDesktop);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkDesktop);
});

function toggleAppsMenu() {
  appsMenuOpen.value = !appsMenuOpen.value;
}

function logout() {
  deleteToken();
}
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center gap-3 px-2 text-zinc-400 hover:text-white hover:bg-zinc-700/30 rounded-lg transition-all duration-200 text-sm font-medium relative h-10 min-w-0;
}

.sidebar-link span {
  @apply whitespace-nowrap flex-shrink-0 overflow-hidden transition-opacity duration-150;
}

.sidebar-link:not(.compact-mode) span {
  @apply delay-0;
}

.sidebar-link.compact-mode span {
  @apply delay-150 opacity-0;
}

.sidebar-link.compact-mode {
  @apply justify-center px-0 mx-auto w-10;
}

.sidebar-link.compact-mode span {
  @apply absolute left-14 top-1/2 transform -translate-y-1/2 text-white px-2 py-1 rounded shadow-lg z-[60] opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap;
}

.sidebar-link.compact-mode:hover span {
  @apply opacity-100;
}

.sidebar-link-active {
  @apply text-white bg-zinc-700/50 hover:bg-zinc-700/60;
}

.sidebar-sublink {
  @apply block px-3 py-1.5 text-slate-400 hover:text-white hover:bg-zinc-700/30 rounded-lg transition-all duration-200 text-sm;
}

.sidebar-icon {
  @apply h-5 w-5 flex-shrink-0;
}

</style>