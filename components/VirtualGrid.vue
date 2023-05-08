<template>
  <div class="px-2 overflow-x-hidden h-full w-full" ref="container">
    <div class="mt-1 lg:mt-0 w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1">
      <template v-for="(item, index) in visibleItems">
        <slot :item="item" :index="index"></slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {computed, onBeforeUnmount, onMounted, ref} from "#imports";

const props = defineProps({
  items: Array as PropType<any[]>
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
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

function handleScroll() {
  const containerHeight = window?.innerHeight ?? 0;
  const contentHeight = container.value?.scrollHeight ?? 0;
  const position = window?.scrollY ?? 0;

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
