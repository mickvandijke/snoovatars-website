<template>
  <div class="px-6 z-20 w-full">
    <ul class="flex items-center justify-start text-sm font-medium text-white/90 text-center border-b border-primary-border w-full">
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
  @apply inline-flex gap-3 py-4 px-6 text-center capitalize hover:text-white border-b-2 border-transparent duration-200;
}

.active {
  @apply text-white border-white hover:text-white;
}

.nlinkicon {
  @apply h-5 w-5;
}
</style>
