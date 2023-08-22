<template>
  <Slide :key="slideKey">
    <div class="carousel__item">
      <div class="advertisement relative">
        <a :href="link" target="_blank" class="flex h-full items-center z-20">
          <img :src="imgSrc" alt="Banner Image" class="object-contain h-full max-h-44" />
        </a>
        <img :src="imgSrc" alt="Banner Image" class="absolute left-0 top-0 right-0 bottom-0 h-full w-full blur-3xl opacity-50 z-10" />
      </div>
    </div>
  </Slide>
</template>

<script setup>
import {Slide} from "vue3-carousel";

const props = defineProps({
  slideKey: {
    type: Number,
    required: true
  },
  imgSrc: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.advertisement {
  @apply flex justify-center items-center min-w-full w-full h-full overflow-hidden;
}

.carousel__item {
  @apply w-full flex justify-center items-center h-24 md:h-96;
}
</style>
