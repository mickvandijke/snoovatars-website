<template>
  <div class="relative flex flex-col items-center min-h-screen w-full overflow-hidden">
    <NavigationBar/>
    <div class="relative flex flex-col grow items-center w-full overflow-hidden">
      <NuxtPage/>
    </div>
    <Footer/>
    <MobileNavigationBar/>
  </div>
</template>

<script setup lang="ts">
import {useHead} from "nuxt/app";
import {
  loadWatchList,
  onBeforeMount,
  useCollections,
  useUser,
  watch
} from "#imports";
import {
  loadExtraInfoOptions,
  loadPreferredCurrency,
  loadWalletAddresses,
  updateEthereumPrices,
  useToken
} from "~/composables/states";
import {getUser, setToken} from "~/composables/api/user";
import {fetchCollections} from "~/composables/api/collection";
import Footer from "~/components/Footer.vue";

useHead({
  title: 'RCA Real-Time Floor Prices, Sales and More! | RCAX.io',
  link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  meta: [
    { name: "title", content: "RCAX" },
    { name: 'description', content: 'Real-time data tracking and price alerts for the Reddit Collectible Avatars space!' },
    { name: 'keywords', content: 'Reddit, Collectible, Avatars, NFT, Floor, RCA, RedditCollectibleAvatars, RCAX, rcax, Polygon' },
    { name: 'robots', content: 'index, follow' },
    { 'http-equiv': "content-type", content: "text/html; charset=utf-8" },
    { name: "language", content: "English" }
  ]
});

const token = useToken();
const user = useUser();

loadWalletAddresses();
loadWatchList();
loadPreferredCurrency();
loadExtraInfoOptions();
updateEthereumPrices();

onBeforeMount(async () => {
  let tokenOpt = localStorage.getItem("Token");

  if (tokenOpt) {
    setToken(tokenOpt);
  }

  fetchCollections().then((collections) => {
    useCollections().value = collections;
  });
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
