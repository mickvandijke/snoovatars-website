<template>
  <div class="px-4 py-6 sm:py-12 flex flex-col gap-6 items-center w-full max-w-md">
    <h1 class="text-xl md:text-3xl text-white font-bold">Avatar Exporter</h1>
    <div class="flex items-center gap-2 w-full">
      <input type="text" autocomplete="off" name=“searchTerm” class="light" placeholder='Reddit username. Eg: "WarmBiertje".' v-model="user" @keyup.enter.prevent="searchUser">
      <button :disabled="!user" class="px-4 py-3 h-full bg-amber-600 hover:bg-amber-500 disabled:bg-neutral-800 text-white disabled:text-neutral-400 font-medium whitespace-nowrap rounded-md duration-200" @click="searchUser">Let's go!</button>
    </div>
    <div class="w-72 h-96">
      <img
          class="w-full h-full"
          :src="exampleImage"
          alt="u/WarmBiertje's avatar"
      >
    </div>
  </div>
</template>

<script setup>
import {navigateTo} from "nuxt/app";
import {ref} from "vue";

const exampleImages = [
  '/images/examples/1.png',
  '/images/examples/2.png',
  '/images/examples/3.png',
  '/images/examples/4.png',
  '/images/examples/5.png',
  '/images/examples/6.png',
  '/images/examples/7.png',
  '/images/examples/8.png',
  '/images/examples/9.png',
  '/images/examples/10.png',
  '/images/examples/11.png',
  '/images/examples/12.png',
  '/images/examples/13.png',
  '/images/examples/14.png',
  '/images/examples/15.png',
  '/images/examples/16.png',
  '/images/examples/17.png',
];

const exampleImage = exampleImages[Math.floor(Math.random()*exampleImages.length)]

const user = ref('');

async function searchUser() {
  if (user.value) {
    await navigateTo(`/avatar/user/${user.value}`, {replace: true});
  }
}
</script>

<style scoped>

</style>
