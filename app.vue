<template>
  <div class="flex flex-col items-center min-h-screen">
    <NavigationBar/>
    <div class="flex flex-col grow items-center w-full">
      <NuxtPage/>
    </div>
    <footer class="text-sm md:text-lg pb-20 pt-4 md:pb-0 px-2 md:px-0 text-neutral-500 text-center w-full">
      <div class="p-4 md:p-0 bg-neutral-800/50 flex flex-col gap-2 rounded-md md:rounded-none w-full">
        <div class="py-4 md:py-16 flex flex-col md:flex-row md:justify-between md:items-center gap-6 w-full">
          <div class="md:w-1/2 justify-center md:justify-start text-center">
            <h2 class="text-xl text-neutral-200 font-bold mb-2">Our Partners</h2>
            <div class="flex items-center justify-center">
              <div class="flex flex-col items-center">
                <a href="https://Discord.gg/AvatarAlpha" class="flex items-center gap-2 text-white font-semibold">
                  <svg class="w-5 h-5" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero"> </path> </g> </g></svg>
                  <span>Avatar Alpha Anonymous</span>
                </a>
                <span class="text-sm text-neutral-400">Always get the latest RCA news and updates!</span>
              </div>
            </div>
          </div>
          <div class="md:w-1/2 justify-center md:justify-start text-center">
            <h2 class="text-xl font-bold mb-2 text-neutral-200">Contact Us</h2>
            <div class="flex flex-col items-center justify-center">
              <span class="text-sm md:text-[1rem] text-neutral-400">u/WarmBiertje on Reddit</span>
              <a href="mailto:snoovatars@gmail.com" class="text-sm md:text-[1rem] text-amber-500">snoovatars@gmail.com</a>
            </div>
          </div>
        </div>
        <div class="bg-neutral-800 text-sm py-4 rounded-lg md:rounded-none">
          <div class="px-3 mx-auto text-center">
            <p>&copy; 2023 RCAX.io. This website is not affiliated with or endorsed by reddit Inc. or OpenSea.</p>
          </div>
        </div>
      </div>
    </footer>
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
import * as amplitude from '@amplitude/analytics-browser';

useHead({
  title: 'RCA Floor Prices - RCAX.io',
  meta: [
    { name: "title", content: "RCAX" },
    { name: 'description', content: 'Real-time data tracking and price alerts for the Reddit Collectible Avatars space!' },
    { name: 'keywords', content: 'Reddit, Collectible, Avatars, NFT, Floor, RCA, RedditCollectibleAvatars, RCAX, rcax, Polygon' },
    { name: 'robots', content: 'index, follow' },
    { 'http-equiv': "content-type", content: "text/html; charset=utf-8" },
    { name: "language", content: "English" }
  ]
});

amplitude.init('29c98e31f025b6d6a70bfcba0e1767d4', undefined, { defaultTracking: { sessions: true, pageViews: true, formInteractions: true, fileDownloads: true }});

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
