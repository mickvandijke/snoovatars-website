<template>
  <div class="p-4 lg:p-6 flex flex-col items-center">
    <div class="flex flex-col items-center">
      <NuxtLink class="pb-6 text-lg md:text-3xl text-white font-bold" to="/">snoovatars.com</NuxtLink>
      <h3 class="text-md text-neutral-400 font-semibold text-center">Instant price alerts for all Reddit Collectible Avatars on OpenSea.io!</h3>
    </div>
    <NuxtPage/>
    <div class="py-12 flex flex-col text-neutral-600 text-center">
      <span>This website is not affiliated with or endorsed by reddit Inc. or OpenSea.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useHead} from "nuxt/app";
import {set_collection_list, useAlertList} from "~/composables/states";
import {collection_list_from_object, CollectionList} from "~/models/reddit_collection";

useHead({
  title: 'snoovatars.com',
  meta: [
    { name: 'description', content: 'Realtime price alerts for your favourite avatars!' }
  ]
})

await fetch("http://localhost:3000/lists")
    .then(async (data) => {
      data = await data.json();

      if (data['collections']) {
        let collectionList: CollectionList = collection_list_from_object(data['collections']);

        await set_collection_list(collectionList);
      }
    });
</script>

<style>
html, body {
  @apply bg-zinc-900;
}

input.input, select.input {
  /*@apply py-2 px-4 w-full text-white bg-neutral-800 border border-neutral-700 rounded-md text-sm shadow-sm cursor-pointer placeholder-neutral-400 hover:border-sky-500 focus:bg-neutral-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition duration-200;*/
  @apply px-4 py-3.5 block w-full max-w-xl bg-transparent text-neutral-200 placeholder-neutral-400 font-medium border-2 border-neutral-800 hover:border-neutral-600 focus:border-neutral-400 text-sm rounded-2xl outline-0 duration-200;
}

label.input-label {
  @apply block mb-2 text-sm font-medium text-neutral-400;
}
</style>
