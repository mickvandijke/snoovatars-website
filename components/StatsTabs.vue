<template>
  <div class="bg-neutral-900 z-20 w-full">
    <ul class="flex items-center justify-center -mb-px font-medium text-neutral-400 text-center border-b border-neutral-800 w-full">
      <li>
        <NuxtLink to="/wallet" class="inline-flex gap-3 py-6 px-6 text-center text-neutral-content/50 capitalize hover:text-neutral-content border-b-2 border-transparent hover:border-white/10 duration-200" active-class="text-amber-500 border-amber-500">
          <WalletIcon class="h-6 w-6"/>
          <span class="">Wallet</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/stats/watchlist" class="inline-flex gap-3 py-6 px-6 text-center text-neutral-content/50 capitalize hover:text-neutral-content border-b-2 border-transparent hover:border-white/10 duration-200" exact-active-class="text-amber-500 border-amber-500">
          <StarIcon class="h-6 w-6"/>
          <span class="">Watchlist</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/stats" class="inline-flex gap-3 py-6 px-6 text-center text-neutral-content/50 capitalize hover:text-neutral-content border-b-2 border-transparent hover:border-white/10 duration-200" exact-active-class="text-amber-500 border-amber-500">
          <ChartBarIcon class="h-6 w-6"/>
          <span class="">Stats</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/events" class="inline-flex gap-3 py-6 px-6 text-center text-neutral-content/50 capitalize hover:text-neutral-content border-b-2 border-transparent hover:border-white/10 duration-200" active-class="text-amber-500 border-amber-500">
          <BoltIcon class="h-6 w-6"/>
          <span class="">Events</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/alerts" class="inline-flex gap-3 py-6 px-6 text-center text-neutral-content/50 capitalize hover:text-neutral-content border-b-2 border-transparent hover:border-white/10 duration-200" active-class="text-amber-500 border-amber-500">
          <BellIcon class="h-6 w-6"/>
          <span class="">Alerts</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {StarIcon, BellIcon, TagIcon, ChartBarIcon, WalletIcon, BoltIcon} from "@heroicons/vue/24/solid";
</script>

<style scoped>

</style>
