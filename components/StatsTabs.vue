<template>
  <div class="py-2">
    <ul class="flex flex-wrap -mb-px font-medium text-neutral-400 text-center border-b border-neutral-800">
      <li>
        <NuxtLink to="/watchlist" class="inline-flex gap-3 py-6 px-6 text-center text-neutral-content/50 capitalize hover:text-neutral-content border-b-2 border-transparent hover:border-white/10 duration-200" active-class="text-amber-500 border-amber-500">
          <WalletIcon class="h-6 w-6"/>
          <span class="">Watchlist</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/stats" class="inline-flex gap-3 py-6 px-6 text-center text-neutral-content/50 capitalize hover:text-neutral-content border-b-2 border-transparent hover:border-white/10 duration-200" active-class="text-amber-500 border-amber-500">
          <ChartBarIcon class="h-6 w-6"/>
          <span class="">Stats</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/sales" class="inline-flex gap-3 py-6 px-6 text-center text-neutral-content/50 capitalize hover:text-neutral-content border-b-2 border-transparent hover:border-white/10 duration-200" active-class="text-amber-500 border-amber-500">
          <TagIcon class="h-6 w-6"/>
          <span class="">Sales</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {StarIcon, BellIcon, TagIcon, ChartBarIcon, WalletIcon} from "@heroicons/vue/24/solid";
</script>

<style scoped>

</style>
