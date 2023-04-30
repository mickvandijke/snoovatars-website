<template>
  <div class="fixed md:hidden bottom-0 left-0 right-0 h-16 bg-neutral-900/90 backdrop-blur-lg text-neutral-400/90 border-t border-neutral-800 shadow grid grid-cols-5 justify-around items-center">
    <NuxtLink to="/wallet" class="flex flex-col items-center justify-center" active-class="text-amber-500">
      <WalletIcon class="h-6 w-6"/>
      <span class="text-xs font-medium">Wallet</span>
    </NuxtLink>
    <NuxtLink to="/watchlist" class="flex flex-col items-center justify-center" active-class="text-amber-500">
      <StarIcon class="h-6 w-6"/>
      <span class="text-xs font-medium">Watchlist</span>
    </NuxtLink>
    <NuxtLink to="/stats" class="flex flex-col items-center justify-center" active-class="text-amber-500">
      <ChartBarIcon class="h-6 w-6"/>
      <span class="text-xs font-medium">Stats</span>
    </NuxtLink>
    <NuxtLink to="/sales" class="flex flex-col items-center justify-center" active-class="text-amber-500">
      <TagIcon class="h-6 w-6"/>
      <span class="text-xs font-medium">Sales</span>
    </NuxtLink>
    <NuxtLink to="/alerts" class="flex flex-col items-center justify-center" active-class="text-amber-500">
      <BellIcon class="h-6 w-6"/>
      <span class="text-xs font-medium">Alerts</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import {StarIcon, BellIcon, TagIcon, ChartBarIcon, WalletIcon} from "@heroicons/vue/24/solid";
</script>

<style>

</style>
