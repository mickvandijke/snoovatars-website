<template>
  <div class="py-2 fixed md:hidden bottom-0 left-0 right-0 bg-secondary/90 backdrop-blur-lg text-white/40 shadow-lg z-40">
    <div class="grid grid-cols-5 justify-around items-center" style="padding-bottom: env(safe-area-inset-bottom);">
      <NuxtLink to="/wallet" class="flex flex-col items-center justify-center" active-class="text-white/80">
        <WalletIcon class="h-6 w-6"/>
        <span class="text-xs font-medium">Wallet</span>
      </NuxtLink>
      <NuxtLink to="/watchlist" class="flex flex-col items-center justify-center" exact-active-class="text-white/80">
        <StarIcon class="h-6 w-6"/>
        <span class="text-xs font-medium">Watchlist</span>
      </NuxtLink>
      <NuxtLink to="/" class="flex flex-col items-center justify-center" exact-active-class="text-white/80">
        <ChartBarIcon class="h-6 w-6"/>
        <span class="text-xs font-medium">Stats</span>
      </NuxtLink>
      <NuxtLink to="/events" class="flex flex-col items-center justify-center" active-class="text-white/80">
        <BoltIcon class="h-6 w-6"/>
        <span class="text-xs font-medium">Activity</span>
      </NuxtLink>
      <NuxtLink to="/tools" class="flex flex-col items-center justify-center" active-class="text-white/80">
        <Squares2X2Icon class="h-6 w-6"/>
        <span class="text-xs font-medium">More</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {StarIcon, BellIcon, ChartBarIcon, WalletIcon, BoltIcon, Squares2X2Icon} from "@heroicons/vue/24/solid";
</script>

<style>

</style>
