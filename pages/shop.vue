<template>
  <div class="mt-3 md:mt-0 flex flex-col gap-6 w-full">
    <StatsTabs class="hidden md:block" />
    <div class="px-2 md:px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2">
      <template v-for="item in sortedItems">
        <div class="p-4 w-full flex flex-col gap-2 border border-primary-accent-solid rounded-2xl overflow-hidden">
          <div class="relative overflow-hidden rounded-2xl">
            <a :href="`https://www.reddit.com/avatar/shop/product/storefront_nft_${item['edge']['node']['item']['benefits']['avatarOutfit']['id']}`" target="_blank">
              <img :src="item['edge']['node']['item']['benefits']['avatarOutfit']['preRenderImage']['url']">
            </a>
            <div class="absolute bottom-0 w-full px-3 py-1.5 bg-primary-accent-solid/40 backdrop-blur-2xl">
              <h2 class="text-center text-white/80 text-sm font-semibold truncate">{{ item['edge']['node']['item']['name'] }}</h2>
            </div>
          </div>
          <div class="px-2 w-full">
            <div class="flex gap-1 text-white/40 text-sm truncate">
              <span>By</span>
              <div class="font-semibold">
                <template v-if="item['edge']['node']['artist']">
                  <a :href="`https://reddit.com/u/${item['edge']['node']['artist']['redditorInfo']['displayName']}`" target="_blank" class="block text-orange-600 hover:text-orange-500 cursor-pointer">{{ item['edge']['node']['artist']['redditorInfo']['displayName'] }}</a>
                </template>
                <template v-else>
                  <span class="block">UNKNOWN</span>
                </template>
              </div>
            </div>
            <div class="flex gap-1 text-white/40 text-sm">
              <template v-if="item['date_available']">
                <span>Released</span>
                <span class="text-amber-500">{{ $timeAgo(new Date(item['date_available'])) }} ago</span>
              </template>
              <template v-else>
                <span>Found</span>
                <span class="text-amber-500">{{ $timeAgo(new Date(item['date_found'])) }} ago</span>
              </template>
            </div>
          </div>
          <div>
            <div class="grid grid-cols-2 divide-x divide-white/10 py-1.5 bg-primary-accent-solid/40 rounded-lg">
              <h2 class="text-center text-sm font-medium" :class="getMintClassesText(item['edge']['node']['totalQuantity'])">{{ item['edge']['node']['totalQuantity'] }}</h2>
              <h2 class="text-center text-white/80 text-sm font-medium">${{ item['edge']['node']['productOffer']['pricePackages'][0]['price'] / 100.00 }}</h2>
            </div>
          </div>
          <div class="w-full">
            <template v-if="item['edge']['node']['status'] === 'PENDING'">
              <a :href="`https://www.reddit.com/avatar/shop/product/storefront_nft_${item['edge']['node']['item']['benefits']['avatarOutfit']['id']}`" target="_blank" class="flex justify-center items-center gap-1 px-2 py-2 w-full bg-primary-accent-solid hover:bg-white/10 text-white/40 text-xs font-semibold uppercase rounded-lg cursor-pointer duration-300">
                <ClockIcon class="w-4 h-4" />
                <span>Direct Link</span>
              </a>
            </template>
            <template v-else-if="item['edge']['node']['status'] === 'AVAILABLE'">
              <a :href="`https://www.reddit.com/avatar/shop/product/storefront_nft_${item['edge']['node']['item']['benefits']['avatarOutfit']['id']}`" target="_blank" class="flex justify-center items-center gap-1 px-2 py-2 w-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold uppercase rounded-lg cursor-pointer duration-300">
                <span>Buy Now</span>
              </a>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Ref} from "@vue/reactivity";
import {getShopItems} from "~/composables/api/shop";
import {ClockIcon} from "@heroicons/vue/24/outline";
import {getMintClassesText} from "~/global/mint";
import {ComputedRef} from "vue";

const items: Ref<Array<Object>> = ref([]);

onBeforeMount(() => {
  getShopItems()
      .then((value) => {
        items.value = value
      })
})

const sortedItems: ComputedRef<Array<Object>> = computed(() => {
  return Object.values(items.value).sort((a, b) => {
    return a['edge']['node']['totalQuantity'] > b['edge']['node']['totalQuantity']
  })
})

</script>

<style scoped>

</style>
