<template>
  <div class="px-6 pb-3 z-20 w-full">
    <ul class="flex gap-2 items-center justify-start text-sm font-medium text-header text-center w-full">
      <li>
        <NuxtLink to="/wallet" class="nlink" active-class="active">
          <WalletIcon class="nlinkicon"/>
          <span class="">Wallet</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/watchlist" class="nlink" exact-active-class="active">
          <StarIcon class="nlinkicon"/>
          <span class="">Watchlist</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/" class="nlink" exact-active-class="active">
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
        <NuxtLink to="/shop" class="nlink" active-class="active">
          <ShoppingBagIcon class="nlinkicon"/>
          <span class="">Shop</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/listings" class="nlink" active-class="active">
          <GlobeEuropeAfricaIcon class="nlinkicon"/>
          <span class="">Browser</span>
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
import {StarIcon, BellIcon, ChartBarIcon, WalletIcon, TagIcon, BoltIcon, ShoppingBagIcon, GlobeEuropeAfricaIcon} from "@heroicons/vue/24/solid";
</script>

<style scoped>
.nlink {
  @apply inline-flex gap-2 py-2.5 px-4 bg-secondary text-center capitalize text-details hover:text-header rounded-2xl duration-200;
}

.active {
  @apply bg-white text-primary hover:text-primary;
}

.nlinkicon {
  @apply h-5 w-5;
}
</style>
