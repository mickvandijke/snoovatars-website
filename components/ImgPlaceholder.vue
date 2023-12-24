<template>
  <div>
    <img v-show="!loaded" src="/img/rcax_placeholder.png" :class="imgClass" />
    <img v-show="loaded" :src="src" @load="loaded = true" @error="loaded = false" :class="imgClass" />
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  imgClass: {
    type: String
  }
})

const loaded = ref(false);
</script>

<style scoped>

</style>
