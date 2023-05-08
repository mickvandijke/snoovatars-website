<template>
  <div class="overflow-x-hidden overflow-y-auto w-full" :class="containerClasses" :style="{ 'max-height': containerMaxHeight }" ref="container" @scroll="handleScroll">
    <div class="mt-1 lg:mt-0 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1">
      <template v-for="(item, index) in visibleItems">
        <slot :item="item" :index="index"></slot>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {computed, ref, watchEffect} from "#imports";

const props = defineProps({
  items: Array as PropType<any[]>
});

const loadThreshold = computed(() => {
  return window.innerHeight / 2;
});

const buffer = computed(() => {
  if (window?.innerWidth < 800) {
    return 24;
  }

  return 60;
});

const container = ref<HTMLInputElement | null>(null);
const visibleItems = ref<any[]>([]);
const loadingMore = ref(false);

const containerClasses = computed(() => {
  if (visibleItems.value.length < buffer.value) {
    return ['max-h-fit'];
  }

  return ['h-screen'];
});

const containerMaxHeight = computed(() => {
  let maxHeight = "100%";

  if (window) {
    if (window.innerWidth < 800) {
      maxHeight = window.innerHeight - 176 + "px";
    } else {
      maxHeight = window.innerHeight - 353 + "px";
    }
  }

  return maxHeight;
});

function handleScroll() {
  const containerHeight = container.value.offsetHeight;
  const contentHeight = container.value.scrollHeight;
  const position = container.value.scrollTop;

  if (contentHeight - (position + containerHeight) < loadThreshold.value) {
    loadMoreItems();
  }
}

const loadMoreItems = () => {
  if (loadingMore.value) {
    return;
  }

  loadingMore.value = true;

  const startIndex = visibleItems.value.length;
  const endIndex = startIndex + buffer.value;

  visibleItems.value = visibleItems.value.concat(props.items.slice(startIndex, endIndex));
  loadingMore.value = false;
};

watchEffect(() => {
  visibleItems.value = props.items.slice(0, buffer.value);
});
</script>

<style scoped>

</style>
