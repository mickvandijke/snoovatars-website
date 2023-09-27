<template>
  <div class="py-3 px-6 md:py-6 relative flex flex-col items-center gap-3 w-full">
    <template v-if="user?.tier < 1 || !user">
      <NuxtLink to="/upgrade" class="mb-3 w-full max-w-sm">
        <div class="group p-3 flex flex-col items-center gap-3 bg-amber-600 hover:bg-amber-500 rounded-2xl duration-200 cursor-pointer">
          <h1 class="text-white text-xl font-medium">Upgrade to <span class="font-bold italic">Pro</span></h1>
        </div>
      </NuxtLink>
    </template>
    <template v-if="!Capacitor.isNativePlatform()">
      <NuxtLink to="/dapps/randomavatarswap" class="w-full max-w-sm">
        <div class="group tool">
          <h1 class="text-white text-xl font-semibold">Random Avatar Swap <span class="text-purple-600 font-bold italic">dApp</span></h1>
          <ArrowPathRoundedSquareIcon class="w-8 h-8 text-neutral-500" />
          <p class="text-neutral-500 text-sm">This dApp can be used to swap your Reddit Collectible Avatar with another
            random one from the dApp pool!</p>
        </div>
      </NuxtLink>
    </template>
    <NuxtLink to="/avatar" class="w-full max-w-sm">
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
        <p class="text-neutral-500 text-sm">Browse the listings of all collections combined in one simple table. Makes it easy to snatch specific mint numbers you like!</p>
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
import {PaintBrushIcon, TagIcon, BellIcon, ArrowPathRoundedSquareIcon} from "@heroicons/vue/24/solid";
import {useUser} from "#imports";
import {Capacitor} from "@capacitor/core";

const user = useUser();
</script>

<style scoped>
.tool {
  @apply p-6 flex flex-col items-center gap-3 bg-primary-accent border border-primary-border hover:border-amber-500 rounded-2xl duration-200 cursor-pointer;
}
</style>
