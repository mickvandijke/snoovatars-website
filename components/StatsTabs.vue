<template>
  <div class="z-20 w-full">
    <ul class="py-1 flex items-center justify-center -mb-px text-sm font-medium text-neutral-500 text-center border-b border-neutral-800 w-full">
      <li>
        <NuxtLink to="/wallet" class="nlink" active-class="active">
          <WalletIcon class="nlinkicon"/>
          <span class="">Wallet</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/stats/watchlist" class="nlink" exact-active-class="active">
          <StarIcon class="nlinkicon"/>
          <span class="">Watchlist</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/stats" class="nlink" exact-active-class="active">
          <ChartBarIcon class="nlinkicon"/>
          <span class="">Stats</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/events" class="nlink" active-class="active">
          <BoltIcon class="nlinkicon"/>
          <span class="">Activity</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/listings" class="nlink" active-class="active">
          <TagIcon class="nlinkicon"/>
          <span class="">Listings</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/alerts" class="nlink" active-class="active">
          <BellIcon class="nlinkicon"/>
          <span class="">Alerts</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {StarIcon, BellIcon, ChartBarIcon, WalletIcon, TagIcon, BoltIcon} from "@heroicons/vue/24/solid";
</script>

<style scoped>
.nlink {
  @apply inline-flex gap-3 py-3 px-6 text-center capitalize hover:text-neutral-200 border-b-2 border-transparent hover:border-neutral-800 duration-200;
}

.active {
  @apply text-amber-500 border-amber-500 hover:text-amber-500 hover:border-amber-500;
}

.nlinkicon {
  @apply h-5 w-5;
}
</style>
