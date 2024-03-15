<template>
  <div class="fixed md:hidden bottom-0 w-full z-40 bg-secondary/90 backdrop-blur-lg" style="padding-bottom: env(safe-area-inset-bottom);">
    <div class="py-5 grid grid-cols-5 justify-around items-center text-white/40" :class="{ 'py-4': Capacitor.isNativePlatform() }">
      <NuxtLink to="/wallet" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/wallet') }">
        <component :is="iconForRoute('/wallet')" class="icon-size"/>
      </NuxtLink>
      <NuxtLink to="/watchlist" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/watchlist') }">
        <component :is="iconForRoute('/watchlist')" class="icon-size"/>
      </NuxtLink>
      <NuxtLink to="/" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/') }">
        <component :is="iconForRoute('/')" class="icon-size"/>
      </NuxtLink>
      <NuxtLink to="/events" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/events') }">
        <component :is="iconForRoute('/events')" class="icon-size"/>
      </NuxtLink>
      <NuxtLink to="/tools" class="flex flex-col items-center justify-center" :class="{ 'active-tab': isActive('/tools') }">
        <component :is="iconForRoute('/tools')" class="icon-size"/>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {Capacitor} from "@capacitor/core";
import {
  StarIcon, BellIcon, ChartBarIcon, WalletIcon, BoltIcon, Squares2X2Icon,
  StarIcon as StarIconOutline, BellIcon as BellIconOutline, ChartBarIcon as ChartBarIconOutline, WalletIcon as WalletIconOutline, BoltIcon as BoltIconOutline, Squares2X2Icon as Squares2X2IconOutline
} from "@heroicons/vue/24/outline";
import {
  StarIcon as StarIconSolid, BellIcon as BellIconSolid, ChartBarIcon as ChartBarIconSolid, WalletIcon as WalletIconSolid, BoltIcon as BoltIconSolid, Squares2X2Icon as Squares2X2IconSolid
} from "@heroicons/vue/24/solid";

const route = useRoute();

function isActive(targetRoute) {
  return route.path === targetRoute;
}

function iconForRoute(targetRoute) {
  const icons = {
    '/wallet': isActive('/wallet') ? WalletIconSolid : WalletIconOutline,
    '/watchlist': isActive('/watchlist') ? StarIconSolid : StarIconOutline,
    '/': isActive('/') ? ChartBarIconSolid : ChartBarIconOutline,
    '/events': isActive('/events') ? BoltIconSolid : BoltIconOutline,
    '/tools': isActive('/tools') ? Squares2X2IconSolid : Squares2X2IconOutline,
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
