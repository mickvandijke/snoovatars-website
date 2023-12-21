<template>
  <div>
    <NuxtImg preload :src="background.path" placeholder="/img/rcax_placeholder.png" />
    <div class="mt-2 text-xs text-center font-medium truncate w-full">{{ background.name }}</div>
  </div>
</template>

<script setup lang="ts">
import {AvatarBackground} from "~/types/avatarBackgrounds";
import {ref} from "vue";

const props = defineProps({
  background: {
    type: AvatarBackground,
    required: true,
  }
});

const loaded = ref(false);
</script>

<style scoped>

</style>
