<template>
  <div class="carousel__item">
    <div class="advertisement bg-black">
      <div class="relative p-4 flex gap-12 justify-center items-center w-full h-full overflow-hidden">
        <div class="hidden md:flex justify-center items-center z-20">
          <img src="/images/banners/rcax_polygon.png" class="object-contain md:max-h-64 rounded-2xl shadow-xl">
        </div>
        <div class="py-2 md:py-0 relative flex flex-col gap-2 md:gap-6 max-w-md md:max-w-xl text-left items-center md:items-start z-20">
          <h1 class="w-full md:w-fit text-white text-xl md:text-5xl font-bold z-10">RCAX Halving Timer</h1>

          <div class="flex items-center gap-1 md:gap-2 text-white text-xl md:text-3xl font-bold max-w-sm sm:max-w-full z-10">
            <template v-if="countdownValues[0] === 0 && countdownValues[1] === 0 && countdownValues[2] === 0 && countdownValues[3] === 0">
              <div>{{ countdownText }}</div>
            </template>
            <template v-else>
              <div class="px-1.5 py-1 bg-white/20 rounded-lg">{{ countdownValues[0] }}</div>
              <div class="px-1.5 py-1 bg-white/20 rounded-lg">{{ countdownValues[1] }}</div>
              <div class="px-1.5 py-1 bg-white/20 rounded-lg">{{ countdownValues[2] }}</div>
              <div class="px-1.5 py-1 bg-white/20 rounded-lg">{{ countdownValues[3] }}</div>
            </template>
            <div class="block md:hidden ml-2">
              <span class="px-1 py-0.5 bg-primary-accent backdrop-blur-lg text-[0.65rem] text-white/60 font-medium rounded-lg cursor-pointer">Read More</span>
            </div>
          </div>

          <a href="https://whitepaper.rcax.io/rcax-token" target="_blank" class="hidden md:block p-3 md:p-4 w-fit bg-white hover:bg-white/90 text-black/90 font-semibold rounded-2xl duration-200 z-10">Mine RCAX</a>
          <div class="absolute left-0 top-0 right-0 bottom-0 bg-[#8247e5]/60 opacity-80 blur-3xl z-0"></div>
        </div>
        <div class="absolute flex items-center justify-end left-0 top-0 bottom-0 right-0 overflow-hidden rounded-lg sm:rounded-2xl z-10">
        </div>
        <a href="https://whitepaper.rcax.io/rcax-token" target="_blank" class="md:hidden absolute top-0 left-0 right-0 bottom-0 z-30"></a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {nowInSeconds} from "../../global/utils";

// Replace these values with your target block number and Polygon RPC URL
const targetBlockNumber = 48576056; // Replace with your target block number
const polygonRPCUrl = 'https://polygon-rpc.com'; // Replace with your Polygon RPC URL

const timeOfCurrentBlock = ref(nowInSeconds());
const currentBlockNumber = ref(0);
const countdownText = ref("");
const countdownValues = ref([]);

async function fetchCurrentBlockNumber() {
  try {
    const response = await fetch(polygonRPCUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_blockNumber',
        params: [],
      }),
    });
    const data = await response.json();
    currentBlockNumber.value = parseInt(data.result, 16);
    timeOfCurrentBlock.value = nowInSeconds();
  } catch (error) {
    console.error('Error fetching current block number:', error);
  }
}

function updateCountdown() {
  const blocksRemaining = targetBlockNumber - currentBlockNumber.value;
  if (blocksRemaining > 0) {
    let secondsRemaining = blocksRemaining * 2.20; // Each block takes ~2.20 seconds
    secondsRemaining = secondsRemaining - (nowInSeconds() - timeOfCurrentBlock.value);
    const days = Math.floor(secondsRemaining / 86400); // 86400 seconds in a day
    const hours = Math.floor((secondsRemaining % 86400) / 3600);
    const minutes = Math.floor(((secondsRemaining % 86400) % 3600) / 60);
    const seconds = Math.floor(secondsRemaining % 60);
    countdownText.value = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    countdownValues.value = [`${days}d`, `${hours}h`, `${minutes}m`, `${seconds}s`]
  } else {
    countdownText.value = 'RCAX Halving #1 Completed!';
  }
}

onMounted(() => {
  fetchCurrentBlockNumber();
  setInterval(updateCountdown, 1000); // Update the countdown every second
});
</script>

<style scoped>

</style>
