<template>
  <div>
    <ImgPlaceholder :src="background.path" />
    <div class="mt-2 text-xs text-center font-medium truncate w-full text-zinc-400">{{ background.name }}</div>
  </div>
</template>

<script setup lang="ts">
import {AvatarBackground} from "~/types/avatarBackgrounds";

const props = defineProps({
  background: {
    type: AvatarBackground,
    required: true,
  }
});
</script>

<style scoped>

</style>
