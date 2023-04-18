<template>
  <div class="flex flex-col items-center">
    <NavigationBar/>
    <div class="p-4 lg:p-6 flex flex-col items-center">
      <NuxtPage/>
      <div class="mt-12 py-12 flex flex-col text-neutral-500 text-center">
        <span>This website is not affiliated with or endorsed by reddit Inc. or OpenSea.</span>
        <span>To contact us, please email snoovatars@gmail.com or message u/WarmBiertje on Reddit.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useHead} from "nuxt/app";
import {onBeforeMount, useCollections, useSeries, useUser, watch} from "#imports";
import {useToken} from "~/composables/states";
import {getUser, setToken} from "~/composables/api/user";
import {fetchCollections} from "~/composables/api/collection";
import {fetchSeries} from "~/composables/api/series";
import {calculate_hash, Series} from "~/types/series";

useHead({
  title: 'snoovatars.com',
  meta: [
    { name: 'description', content: 'Realtime price alerts for your favourite avatars!' }
  ]
})

const token = useToken();
const user = useUser();

onBeforeMount(async () => {
  let tokenOpt = localStorage.getItem("Token");

  if (tokenOpt) {
    setToken(tokenOpt);
  }

  fetchCollections().then((collections) => {
    useCollections().value = collections;
  })

  fetchSeries().then((series) => {
    let seriesMap: Map<string, Series> = new Map();

    series.forEach(async (serie) => {
      let hash = await calculate_hash(serie);

      seriesMap.set(hash, serie);
    })

    useSeries().value = seriesMap;
  })
})

watch([token], async () => {
  if (token.value) {
    getUser();
  } else if (user.value) {
    user.value = null;
  }
})
</script>

<style>
html, body {
  @apply bg-neutral-900;
}

input, select {
  @apply p-2.5 bg-transparent text-neutral-100 placeholder-neutral-400 border-2 border-neutral-800 hover:border-neutral-700 rounded-2xl w-full duration-200 cursor-pointer;
}

input.light, select.light {
  @apply border-neutral-700 hover:border-neutral-600;
}
</style>
