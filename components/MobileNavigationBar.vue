<template>
  <div class="fixed md:hidden bottom-0 w-full z-40 bg-secondary/90 backdrop-blur-lg border-t border-white/5" style="padding-bottom: env(safe-area-inset-bottom);">
    <div class="py-2 grid grid-cols-5 justify-around items-center text-white/40">
      <NuxtLink to="/wallet" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/wallet') }">
        <component :is="iconForRoute('/wallet')" class="icon-size"/>
        <span class="text-xs font-medium">Wallet</span>
      </NuxtLink>
      <NuxtLink to="/watchlist" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/watchlist') }">
        <component :is="iconForRoute('/watchlist')" class="icon-size"/>
        <span class="text-xs font-medium">Watchlist</span>
      </NuxtLink>
      <NuxtLink to="/" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/') }">
        <component :is="iconForRoute('/')" class="icon-size"/>
        <span class="text-xs font-medium">Stats</span>
      </NuxtLink>
      <NuxtLink to="/events" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/events') }">
        <component :is="iconForRoute('/events')" class="icon-size"/>
        <span class="text-xs font-medium">Activity</span>
      </NuxtLink>
      <NuxtLink to="/more" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/more') }">
        <component :is="iconForRoute('/more')" class="icon-size"/>
        <span class="text-xs font-medium">More</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {Capacitor} from "@capacitor/core";
import {
  ChartBarIcon, StarIcon, WalletIcon, BoltIcon, Squares2X2Icon
} from "@heroicons/vue/24/outline";
import {
  ChartBarIcon as ChartBarIconSolid, StarIcon as StarIconSolid, WalletIcon as WalletIconSolid, BoltIcon as BoltIconSolid, Squares2X2Icon as Squares2X2IconSolid
} from "@heroicons/vue/24/solid";

const route = useRoute();

function isActive(targetRoute) {
  return route.path === targetRoute;
}

function iconForRoute(targetRoute) {
  const icons = {
    '/wallet': isActive('/wallet') ? WalletIconSolid : WalletIcon,
    '/watchlist': isActive('/watchlist') ? StarIconSolid : StarIcon,
    '/': isActive('/') ? ChartBarIconSolid : ChartBarIcon,
    '/events': isActive('/events') ? BoltIconSolid : BoltIcon,
    '/more': isActive('/more') ? Squares2X2IconSolid : Squares2X2Icon,
  };
  return icons[targetRoute] || null; // Return null or a default icon if route is not matched
}
</script>

<style>
.active-tab {
  @apply text-white;
}

.icon-size {
  @apply h-7 w-7;
}
</style>
