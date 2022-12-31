<template>
  <div class="max-w-6xl flex flex-col items-center">
    <div id="jumbotron" class="relative w-full h-[36rem] flex flex-row justify-center items-center overflow-hidden">
      <div id="avatar-grid" class="w-full flex flex-col justify-center items-center">
        <div class="w-full flex flex-row justify-center">
          <img v-for="i in 12" :src="getRandomAvatarImgSrc()" class="w-16">
        </div>
        <div class="w-full ml-16 flex flex-row justify-center">
          <img v-for="i in 12" :src="getRandomAvatarImgSrc()" class="w-16">
        </div>
        <div class="flex flex-row justify-center">
          <h1 class="max-w-lg py-4 text-center text-4xl text-white font-bold">Collecting <span class="text-amber-500">avatars</span> has never been this <span class="text-amber-500">easy.</span></h1>
        </div>
        <div class="w-full flex flex-row justify-center">
          <img v-for="i in 12" :src="getRandomAvatarImgSrc()" class="w-16">
        </div>
        <div class="w-full ml-16 flex flex-row justify-center">
          <img v-for="i in 12" :src="getRandomAvatarImgSrc()" class="w-16">
        </div>
      </div>
    </div>

    <div id="price-alerts" class="relative w-full py-16 flex flex-col-reverse lg:flex-row">
      <div class="w-full lg:w-1/2 flex flex-col items-center justify-center">
        <div class="rounded-2xl shadow-lg overflow-hidden">
          <img src="/img/price-alerts.png" style="filter: invert(0.85);">
        </div>
      </div>
      <div class="mb-12 lg:mb-0 w-full lg:w-1/2 lg:px-6 flex flex-col items-center text-white">
        <h2 class="text-3xl font-bold text-center mb-12">Lightning Fast Price Alerts ⚡️</h2>
        <p class="max-w-xl text-neutral-400 font-bold">
          <strong class="text-amber-500">Be the first to know when there is a new listing for your favourite avatar!</strong>
          Snoovatars lets you create price alerts for all the Reddit Collectible Avatars on Opensea. Because of our realtime connection with Opensea, we are able to send you price notifications instantly whenever your alert's conditions are met! Price alerts can not only be set for an entire collection tier, such as "The Eyes" or "Rainbow Foustling", but also for a specific mint number such as "Rainbow Foustling #580"!
        </p>
      </div>
    </div>

    <div id="plans" class="mt-12 max-w-2xl w-full flex flex-col text-white">
      <h2 class="text-3xl font-bold text-center mb-12">Plans</h2>

      <div class="grid lg:grid-cols-2 gap-6 lg:gap-x-12">

        <div class="mb-6 lg:mb-0 flex flex-col items-center">
          <div class="block max-w-xs w-full shadow-lg bg-neutral-800 border-2 border-neutral-700 h-full rounded-2xl">
            <div class="p-6 border-b border-neutral-700 text-center">
              <p class="uppercase mb-4 text-sm">
                <strong>Free</strong>
              </p>
              <h3 class="text-2xl mb-6">
                <strong>Free</strong>
              </h3>

              <NuxtLink
                  type="button"
                  class="signup"
                  to="/signup"
              >
                Sign up for free
              </NuxtLink>
            </div>
            <div class="p-6">
              <ol class="list-inside text-neutral-200 font-semibold text-sm">
                <li class="mb-4 flex items-center">
                  <CheckBadgeIcon class="w-5 mr-2 text-green-600"/>
                  *2 concurrent price alerts
                </li>
                <li class="mb-4 flex items-center">
                  <CheckBadgeIcon class="w-5 mr-2 text-green-600"/>
                  *5 price alert notifications
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div class="mb-6 lg:mb-0 flex flex-col items-center">
          <div class="block max-w-xs w-full shadow-lg bg-neutral-800 border-2 border-amber-500 h-full rounded-2xl">
            <div class="p-6 border-b border-neutral-700 text-center">
              <p class="uppercase mb-4 text-sm">
                <strong class="text-amber-500">Premium</strong>
              </p>
              <h3 class="text-2xl mb-6">
                <strong>€ 10</strong>
                <small class="text-neutral-400"> / lifetime</small>
              </h3>
              <NuxtLink
                  class="signup"
                  target="_blank"
                  to="https://commerce.coinbase.com/checkout/c83f3cd4-adcf-4d3e-9349-3c1892f94472"
              >
                Buy a premium code
              </NuxtLink>
              <p class="mt-3 text-sm text-neutral-400">You can redeem your premium code by signing up for a free account and then going to <a href="/upgrade" class="text-amber-500 hover:text-amber-400 duration-200  cursor-pointer">upgrade</a>.</p>
            </div>
            <div class="p-6">
              <ol class="list-inside text-neutral-200 font-semibold text-sm">
                <li class="mb-4 flex items-center">
                  <CheckBadgeIcon class="w-5 mr-2 text-green-600"/>
                  *50 concurrent price alerts
                </li>
                <li class="mb-4 flex items-center">
                  <CheckBadgeIcon class="w-5 mr-2 text-green-600"/>
                  *Unlimited price alert notifications
                </li>
              </ol>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {CheckBadgeIcon} from "@heroicons/vue/24/solid";

function getRandomAvatarImgSrc() {
  return `/img/${Math.floor(Math.random() * (16 - 1 + 1) + 1)}.png`;
}
</script>

<style scoped>
.signup {
  @apply inline-block px-6 py-2.5 bg-amber-600 text-white font-medium text-sm leading-tight rounded-2xl shadow-md hover:bg-amber-500 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full;
}
</style>
