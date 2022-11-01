<template>
  <div class="mt-12 flex flex-col items-center w-full max-w-xl">
    <h1 class="text-2xl text-white font-bold">OpenSea.io Price Alerts</h1>
    <div id="alert-list" class="mt-6 flex flex-col items-center w-full">
      <button class="p-4 max-w-xs flex flex-row flex-nowrap bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-2xl drop-shadow-lg duration-200">Create Alert</button>
      <ul class="mt-4 p-6 flex flex-col gap-y-4 border-2 border-neutral-800 w-full rounded-2xl">
        <li v-for="[alertHash, alert] in alerts" class="p-4 flex flex-row flex-nowrap bg-neutral-800 rounded-2xl drop-shadow-lg">
          <span class="text-neutral-400">{{ tiers.get(alert.collection_tier_hash).name }}</span>
          <button class="ml-auto mr-2 text-blue-500">Edit</button>
          <button class="text-red-500">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useAlertList, useTierList} from "~/composables/states";

const tiers = useTierList();
const alerts = useAlertList();
</script>

<style scoped>

</style>
