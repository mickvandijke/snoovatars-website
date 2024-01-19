<template>
  <div class="carousel__item">
    <div class="advertisement bg-black">
      <div class="relative p-4 flex gap-12 justify-center items-center w-full h-full overflow-hidden">
        <div class="hidden md:flex justify-center items-center z-20">
          <img src="/images/banners/rcax_icon_banner.png" class="object-contain md:max-h-64 rounded-2xl shadow-xl">
        </div>
        <div class="py-2 md:py-0 relative flex flex-col gap-2 md:gap-6 max-w-md md:max-w-xl text-left items-center md:items-start z-20">
          <h1 class="w-full md:w-fit text-header text-xl md:text-5xl font-bold z-10">Your Banner Here?</h1>

          <p class="text-header text-[0.8rem] md:text-[1rem] font-medium max-w-sm sm:max-w-full z-10">Sponsor RCAX's development by renting a banner. Prices start from ${{ SHARED_BANNER_PRICE_USD }} a day. <span class="inline-flex md:hidden ml-2 w-fit px-1 py-0.5 bg-secondary backdrop-blur-lg text-[0.65rem] text-details rounded-lg cursor-pointer">Read More</span></p>

          <NuxtLink to="/sponsoring" class="hidden md:block p-3 md:p-4 w-fit bg-white hover:bg-white/90 text-black/90 font-semibold rounded-2xl duration-200 z-10">Read More</NuxtLink>
          <div class="absolute left-0 top-0 right-0 bottom-0 bg-amber-700/60 opacity-80 blur-3xl z-0"></div>
        </div>
        <div class="absolute flex items-center justify-end left-0 top-0 bottom-0 right-0 overflow-hidden rounded-lg sm:rounded-2xl z-10">
        </div>
        <NuxtLink to="/sponsoring" class="md:hidden absolute top-0 left-0 right-0 bottom-0 z-30"></NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {SHARED_BANNER_PRICE_USD} from "~/global/priceList";
</script>

<style scoped>

</style>
