<template>
  <Slide :key="1">
    <div class="carousel__item">
      <div class="advertisement">
        <div class="relative p-4 flex gap-12 justify-center items-center w-full h-full overflow-hidden">
          <div class="hidden md:flex justify-center items-center z-20">
            <img src="/images/banners/arcone_promotional.png" class="object-contain md:max-h-64 rounded-2xl shadow-xl">
          </div>
          <div class="py-2 md:py-0 relative flex flex-col gap-2 md:gap-6 max-w-md text-left items-center md:items-start z-20">
            <h1 class="w-full md:w-fit text-header text-xl md:text-5xl font-bold z-10">ArCone Games</h1>

            <p class="text-header text-[0.8rem] md:text-[1rem] font-medium max-w-sm sm:max-w-full z-10">$CONE Games that reward those that hold and play! <span class="inline-flex md:hidden ml-1 w-fit px-1 py-0.5 bg-secondary backdrop-blur-lg text-[0.65rem] text-details rounded-lg cursor-pointer">Click to Open</span></p>

            <a href="https://nyanmatcher.xyz/" target="_blank" class="hidden md:block p-3 md:p-4 w-fit bg-white hover:bg-white/90 text-black/90 font-semibold rounded-2xl duration-200 z-10">Play Now</a>
            <div class="absolute left-0 top-0 right-0 bottom-0 bg-black/50 blur-2xl md:blur-3xl z-0"></div>
          </div>
          <div class="absolute left-0.5 top-0.5 bottom-0.5 right-0.5 sm:left-1 sm:top-1 sm:bottom-1 sm:right-1 overflow-hidden rounded-lg sm:rounded-2xl z-10">
            <img src="/images/banners/arcone_banner.png" alt="Banner Image" class="object-fill" />
          </div>
          <a href="https://nyanmatcher.xyz/" target="_blank" class="md:hidden absolute top-0 left-0 right-0 bottom-0 z-30"></a>
        </div>
      </div>
    </div>
  </Slide>
</template>

<script>
export default {
  name: "AdvertisementBannerTemplatePromo"
}
</script>

<style scoped>

</style>
