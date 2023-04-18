<template>
  <div class="flex flex-col items-center w-full max-w-xl">
    <div class="w-full max-w-md">
      <ul role="list" class="divide-y divide-neutral-800">
        <template v-for="token in listingsSortedByNewest()">
          <li class="py-2">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <img class="h-20" :src="token.item.metadata.image_url" :alt="token.name">
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold truncate text-white">
                  {{ token.name }}
                </p>
                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                  email@windster.com
                </p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                $320
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {getListings} from "~/composables/api/listings";

let listings = await getListings();

function listingsSortedByNewest() {
  let allListings = [];

  for (const [k, v] of Object.entries(listings)) {
    for (let listing of v) {
      allListings.push(listing);
    }
  }

  return allListings.sort((a, b) => {
    let keyA = new Date(a.listing_date);
    let keyB = new Date(b.listing_date);

    // Compare the 2 dates
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;

    return 0;
  })
}

console.log(listings);

</script>

<style scoped>

</style>
