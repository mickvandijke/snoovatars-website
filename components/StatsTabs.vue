<template>
  <div class="sticky top-0 z-30 w-full bg-[#141415] border-b border-zinc-800/50">
    <div class="px-4 lg:px-6 py-4">
      <div class="flex items-center justify-start gap-2 overflow-x-auto scrollbar-hide">
        <NuxtLink 
          to="/wallet" 
          active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <WalletIcon class="stats-tab-icon" />
          <span class="relative z-10">Wallet</span>
        </NuxtLink>

        <NuxtLink 
          to="/watchlist" 
          exact-active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <StarIcon class="stats-tab-icon" />
          <span class="relative z-10">Watchlist</span>
        </NuxtLink>

        <NuxtLink 
          to="/" 
          exact-active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <ChartBarIcon class="stats-tab-icon" />
          <span class="relative z-10">Stats</span>
        </NuxtLink>

        <NuxtLink 
          to="/events" 
          active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <BoltIcon class="stats-tab-icon" />
          <span class="relative z-10">Activity</span>
        </NuxtLink>

        <NuxtLink 
          to="/shop" 
          active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <ShoppingBagIcon class="stats-tab-icon" />
          <span class="relative z-10">Shop</span>
        </NuxtLink>

        <NuxtLink 
          to="/listings" 
          active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <GlobeEuropeAfricaIcon class="stats-tab-icon" />
          <span class="relative z-10">Browser</span>
        </NuxtLink>

        <NuxtLink 
          to="/alerts" 
          active-class="stats-tab-active" 
          class="stats-tab group"
        >
          <BellIcon class="stats-tab-icon" />
          <span class="relative z-10">Alerts</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {StarIcon, BellIcon, ChartBarIcon, WalletIcon, TagIcon, BoltIcon, ShoppingBagIcon, GlobeEuropeAfricaIcon} from "@heroicons/vue/24/solid";
</script>

<style scoped>
.stats-tab {
  @apply relative inline-flex items-center gap-1.5 px-3 py-2 text-zinc-400 hover:text-white bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 rounded-lg transition-all duration-200 font-medium whitespace-nowrap min-w-0 flex-shrink-0 text-sm;
}

.stats-tab-active {
  color: white !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

.stats-tab-active:hover {
  color: white !important;
  background-color: rgba(255, 255, 255, 0.15) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.stats-tab-icon {
  @apply h-4 w-4 flex-shrink-0;
}


/* Custom scrollbar for horizontal overflow on mobile */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Additional responsive improvements */
@media (max-width: 768px) {
  .stats-tab {
    @apply px-2 py-1.5 text-xs gap-1;
  }
  
  .stats-tab-icon {
    @apply h-3.5 w-3.5;
  }
}
</style>
