<template>
  <div class="flex flex-col items-center">
    <NavigationBar/>
    <div class="flex flex-col items-center w-full">
      <NuxtPage/>
    </div>
    <div class="bg-neutral-800/50 text-sm md:text-md mt-6 mb-20 md:mt-12 md:mb-0 mx-4 px-4 md:px-6 py-4 md:py-12 flex flex-col text-neutral-500 text-center rounded-md md:rounded-none md:w-full">
      <span>This website is not affiliated with or endorsed by reddit Inc. or OpenSea.</span>
      <span>To contact us, please email snoovatars@gmail.com or message u/WarmBiertje on Reddit.</span>
    </div>
    <MobileNavigationBar/>
    <!-- Google tag (gtag.js) -->
    <Script async src="https://www.googletagmanager.com/gtag/js?id=G-GF6HFN0CSP"></Script>
    <Script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-GF6HFN0CSP');
    </Script>
  </div>
</template>

<script setup lang="ts">
import {useHead} from "nuxt/app";
import {loadWatchList, onBeforeMount, useCollections, useNuxtApp, useSeries, useUser, watch} from "#imports";
import {updateEthereumUsdPrice, useToken} from "~/composables/states";
import {getUser, setToken} from "~/composables/api/user";
import {fetchCollections} from "~/composables/api/collection";
import {fetchSeries} from "~/composables/api/series";
import {calculate_hash, Series} from "~/types/series";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
// @ts-ignore
import VueVirtualScroller from "vue-virtual-scroller";

useNuxtApp().vueApp.use(VueVirtualScroller);

useHead({
  title: 'rcax.io',
  meta: [
    { name: 'description', content: 'Realtime price alerts for your favourite avatars!' }
  ]
})

const token = useToken();
const user = useUser();

loadWatchList();
updateEthereumUsdPrice();

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
});

watch([token], async () => {
  if (token.value) {
    getUser();
  } else if (user.value) {
    user.value = null;
  }
});

useHead({
  meta: [{
    name: "viewport",
    content: "width=device-width, initial-scale=1, maximum-scale=1"
  }]
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
