<template>
  <div class="carousel__item">
    <div class="advertisement bg-black">
      <div class="flex gap-12 items-center">
        <div class="hidden md:flex justify-center items-center">
          <img src="/images/banners/rcax_icon_banner.png" class="object-contain md:max-h-64 rounded-2xl shadow-xl">
        </div>
        <div class="flex md:flex-col gap-6 max-w-md text-left items-center md:items-start">
          <h1 class="text-white text-xl md:text-5xl font-bold">Your Banner Here?</h1>

          <p class="hidden md:block text-white font-medium">Sponsor RCAX's development by renting a banner. Prices start from $5 a day.</p>

          <NuxtLink to="/sponsoring" class="p-3 md:p-4 w-fit bg-white hover:bg-white/90 text-black/90 text-sm md:text-md font-semibold rounded-2xl duration-200">Read More</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>
