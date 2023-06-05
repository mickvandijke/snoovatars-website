<template>
  <div class="py-2 px-6 md:py-6 relative flex flex-col items-center gap-3 w-full">
    <NuxtLink to="/avatar/exporter" class="w-full max-w-sm">
      <div class="group tool">
        <h1 class="text-white text-xl font-semibold">Avatar Exporter</h1>
        <PaintBrushIcon class="w-8 h-8 text-neutral-500" />
        <p class="text-neutral-500 text-sm">Customize your mashup and download it in high quality.</p>
      </div>
    </NuxtLink>
    <NuxtLink to="/listings" class="w-full max-w-sm">
      <div class="group tool w-full">
        <h1 class="text-white text-xl font-semibold">Listings Browser <span class="text-amber-500 font-bold italic">Pro</span></h1>
        <TagIcon class="w-8 h-8 text-neutral-500" />
        <p class="text-neutral-500 text-sm">Browse through all listings. Get those cheap #1's!</p>
      </div>
    </NuxtLink>
    <NuxtLink to="/alerts" class="w-full max-w-sm">
      <div class="group tool">
        <h1 class="text-white text-xl font-semibold">Price Alerts <span class="text-amber-500 font-bold italic">Pro</span></h1>
        <BellIcon class="w-8 h-8 text-neutral-500" />
        <p class="text-neutral-500 text-sm">Set Custom Real-Time Price Alerts. Get notified over Mobile Push Notifications or Email.</p>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import {PaintBrushIcon, TagIcon, BellIcon} from "@heroicons/vue/24/solid";
</script>

<style scoped>
.tool {
  @apply p-6 flex flex-col items-center gap-3 bg-neutral-900 border-2 border-neutral-800 hover:border-amber-500 rounded-2xl duration-200 cursor-pointer;
}
</style>
