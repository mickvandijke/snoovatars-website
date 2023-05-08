<template>
  <div class="px-2 overflow-x-hidden overflow-y-auto w-full" :class="containerClasses" :style="{ 'max-height': containerMaxHeight }" ref="container" @scroll="handleScroll">
    <div class="mt-1 lg:mt-0 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1">
      <template v-for="(item, index) in visibleItems">
        <slot :item="item" :index="index"></slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {computed, ref} from "#imports";

const props = defineProps({
  items: Array as PropType<any[]>
});

const loadThreshold = computed(() => {
  return window.innerHeight / 3;
});

const buffer = computed(() => {
  if (window?.innerWidth < 800) {
    return 24;
  }

  return 60;
});

const container = ref<HTMLInputElement | null>(null);
const endIndex = ref(buffer.value);

const containerClasses = computed(() => {
  if (visibleItems.value.length < buffer.value) {
    return ['max-h-fit'];
  }

  return ['h-screen'];
});

const containerMaxHeight = computed(() => {
  let maxHeight = "100%";

  if (window) {
    if (window.innerWidth < 800 && false) {
      maxHeight = window.innerHeight - 176 + "px";
    } else {
      maxHeight = "100vh";
    }
  }

  return maxHeight;
});

function handleScroll() {
  const containerHeight = container.value?.offsetHeight ?? 0;
  const contentHeight = container.value?.scrollHeight ?? 0;
  const position = container.value?.scrollTop ?? 0;

  if (contentHeight - (position + containerHeight) < loadThreshold.value) {
    const newIndex = visibleItems.value.length + buffer.value;

    if (endIndex.value !== newIndex)
      endIndex.value = newIndex;
  }
}

const visibleItems = computed(() => {
  return props.items.slice(0, endIndex.value);
});
</script>

<style scoped>

</style>
