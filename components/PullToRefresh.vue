<template>
  <div class="w-full h-full"
       @touchstart="onTouchStart"
       @touchmove="onTouchMove"
       @touchend="onTouchEnd"
  >
    <transition
        leave-active-class="transition ease-in duration-300"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
    >
      <template v-if="isRefreshing">
        <div class="flex flex-col items-center justify-center" style="height: 40px;">
          <IonSpinner class="w-5 h-5 text-amber-500" />
        </div>
      </template>
    </transition>
    <template v-if="!isRefreshing">
      <div class="flex flex-col items-center justify-center" ref="pullIndicator">
        <template v-if="pullDistance > 0">
          <ArrowDownIcon class="w-5 h-5 text-neutral-500 duration-200" :class="{ 'rotate-180': pullDistance > pullToRefreshThreshold }" />
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
const pullIndicator = ref(null);
const startY = ref(0);
const currentY = ref(0);

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

  startY.value = event.touches[0].clientY;
};

const onTouchMove = (event: TouchEvent) => {
  if (props.isRefreshing) {
    return;
  }

  // Check if the user is scrolled all the way to the top
  if (window.pageYOffset === 0) {
    currentY.value = event.touches[0].clientY;

    if (currentY.value - startY.value > 0) {
      pullDistance.value = currentY.value - startY.value;
      pullIndicator.value.style.height = Math.min(
          (currentY.value - startY.value) / 2,
          pullMaxDistance
      ) + "px"; // Limit the height to a maximum of 90 pixels
    }
  }
};

const onTouchEnd = () => {
  if (pullDistance.value > pullToRefreshThreshold) {
    emit("refresh");
  }

  pullDistance.value = 0;
  pullIndicator.value.style.height = 0 + "px"
};
</script>

<style scoped>

</style>
