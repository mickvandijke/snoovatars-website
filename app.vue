<template>
  <div class="p-4 lg:p-6 flex flex-col items-center">
    <div class="flex flex-col items-center">
      <NuxtLink class="pb-6 text-lg md:text-3xl text-white font-bold" to="/">snoovatars.com</NuxtLink>
      <h3 class="text-md text-amber-600 font-semibold text-center">Instant price alerts for all Reddit Collectible Avatars on OpenSea.io!</h3>
    </div>
    <NuxtPage/>
    <div class="py-12 flex flex-col text-neutral-600 text-center">
      <span>This website is not affiliated with or endorsed by reddit Inc. or OpenSea.</span>
      <span>To contact us, please email snoovatars@gmail.com or message u/WarmBiertje on Reddit.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useHead} from "nuxt/app";
import {onBeforeMount, useUser, watch} from "#imports";
import {useToken} from "~/composables/states";
import {getUser, setToken} from "~/composables/api/user";
import {getCollections} from "~/composables/api/collection";

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

  await getCollections();
})

watch([token], async () => {
  if (token.value) {
    await getUser();
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
