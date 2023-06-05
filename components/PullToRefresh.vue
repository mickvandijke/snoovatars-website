<template>
  <div class="w-full h-full"
       @touchstart="onTouchStart"
       @touchmove="onTouchMove"
       @touchend="onTouchEnd"
  >
    <template v-if="isRefreshing">
      <div class="flex flex-col items-center justify-center" style="height: 40px;">
        <IonSpinner class="w-5 h-5 text-neutral-200" />
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col items-center justify-center" :style="{ height: pullIndicatorHeight + 'px' }" id="pullIndicator">
        <template v-if="pullDistance > 0">
          <ArrowDownIcon class="w-5 h-5 text-amber-500" :class="{ 'rotate-180': pullDistance > pullToRefreshThreshold }" />
        </template>
      </div>
    </template>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IonSpinner } from "@ionic/vue";
import {ArrowDownIcon} from "@heroicons/vue/24/solid";

const pullToRefreshThreshold = 120;
const pullMaxDistance = 90;

const pullDistance = ref(0);
const pullIndicatorHeight = ref(null);

let startY = 0;
let currentY = 0;

const props = defineProps({
  isRefreshing: {
    required: true,
    type: Boolean
  }
});

const emit = defineEmits(["refresh"]);

const onTouchStart = (event: TouchEvent) => {
  if (props.isRefreshing) {
    return;
  }

  startY = event.touches[0].clientY;
};

const onTouchMove = (event: TouchEvent) => {
  if (props.isRefreshing) {
    return;
  }

  // Check if the user is scrolled all the way to the top
  if (window.pageYOffset === 0) {
    currentY = event.touches[0].clientY;
    if (currentY - startY > 0) {
      pullDistance.value = currentY - startY;
      pullIndicatorHeight.value = Math.min(
          (currentY - startY) / 2,
          pullMaxDistance
      ); // Limit the height to a maximum of 90 pixels
    }
  }
};

const onTouchEnd = () => {
  if (pullDistance.value > pullToRefreshThreshold) {
    emit("refresh");
  }

  pullDistance.value = 0;
  pullIndicatorHeight.value = 0
};
</script>

<style scoped>

</style>
