<template>
  <div class="carousel__item">
    <div class="advertisement">
      <div class="relative p-4 flex gap-12 justify-center items-center w-full h-full overflow-hidden">
        <div class="hidden md:flex justify-center items-center z-20">
          <img src="/images/banners/nyan_banner_2.png" class="object-contain md:max-h-64 rounded-2xl shadow-xl">
        </div>
        <div class="py-2 md:py-0 relative flex flex-col gap-2 md:gap-6 max-w-md text-left items-center md:items-start z-20">
          <h1 class="w-full md:w-fit text-white text-xl md:text-5xl font-bold z-10">NyanMatcher</h1>

          <p class="text-white text-[0.8rem] md:text-[1rem] font-medium max-w-sm sm:max-w-full z-10">Find the cheapest matching Nyan Cat & Fiesta Dog pairs listed on OpenSea! <span class="inline-flex md:hidden ml-2 w-fit px-1 py-0.5 bg-primary-accent backdrop-blur-lg text-[0.65rem] text-white/60 rounded-lg cursor-pointer">Click to Open</span></p>

          <a href="https://nyanmatcher.xyz/" target="_blank" class="hidden md:block p-3 md:p-4 w-fit bg-white hover:bg-white/90 text-black/90 font-semibold rounded-2xl duration-200 z-10">Get Yours</a>
          <div class="absolute left-0 top-0 right-0 bottom-0 bg-[#003466] blur-2xl md:blur-3xl z-0"></div>
        </div>
        <div alt="Banner Image" class="rainbow-gradient-to-br absolute -left-8 -top-8 -right-8 -bottom-8 blur-lg opacity-100 z-5" />
        <div class="absolute left-0.5 top-0.5 bottom-0.5 right-0.5 sm:left-1 sm:top-1 sm:bottom-1 sm:right-1 overflow-hidden rounded-lg sm:rounded-2xl z-10">
          <img src="/images/banners/nyan_banner_bg_4.png" alt="Banner Image" class="object-fill object-top" />
        </div>
        <div class="absolute flex items-center justify-end left-0.5 top-0.5 bottom-0.5 right-0.5 sm:left-1 sm:top-1 sm:bottom-1 sm:right-1 overflow-hidden rounded-lg sm:rounded-2xl z-10">
          <div class="relative">
            <img src="/images/banners/nyan_run.gif" class="object-contain z-10">
            <div class="nyan-fade absolute left-0 top-0 bottom-0 right-0 z-0"></div>
          </div>
        </div>
        <a href="https://nyanmatcher.xyz/" target="_blank" class="md:hidden absolute top-0 left-0 right-0 bottom-0 z-30"></a>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>

</style>
