<template>
  <div class="overflow-y-auto" ref="container" @scroll="handleScroll">
    <div class="overflow-x-hidden" ref="content">
      <div class="mx-auto w-full h-full grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 overflow-x-hidden gap-1.5">
        <template v-for="(item, index) in visibleItems">
          <slot :item="item" :index="index"></slot>
        </template>
      </div>
      <template v-if="visibleItems.length < items.length">
        <div class="py-6 flex flex-col gap-3 items-center">
          <span class="sm:text-lg text-neutral-500">Loading..</span>
          <IonSpinner class="w-5 h-5 text-neutral-500" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {computed, onBeforeUnmount, onMounted, ref} from "#imports";
import {IonSpinner} from "@ionic/vue";
import {ComputedRef} from "vue";

const props = defineProps({
  items: Array as PropType<any[]>,
  bufferMobile: {
    type: Number,
    required: false,
    default: 12
  },
  bufferDesktop: {
    type: Number,
    required: false,
    default: 90
  },
});

const buffer = computed(() => {
  if (window?.innerWidth < 640) {
    return props.bufferMobile;
  }

  return props.bufferDesktop;
});

const container = ref<HTMLInputElement | null>(null);
const endIndex = ref(buffer.value);

function handleScroll() {
  if (visibleItems.value.length === props.items?.length) return;

  const contentHeight = container.value?.scrollHeight ?? 0;
  const contentScrollTop = container.value?.scrollTop ?? 0;
  const contentClientHeight = container.value?.clientHeight ?? 0;

  if (contentHeight - contentScrollTop <= contentClientHeight) {
      const newIndex = visibleItems.value.length + buffer.value;

      if (endIndex.value !== newIndex) {
        endIndex.value = newIndex;
      }
  }
}

const visibleItems: ComputedRef<any[]> = computed(() => {
  return props.items.slice(0, endIndex.value);
});
</script>

<style scoped>

</style>
