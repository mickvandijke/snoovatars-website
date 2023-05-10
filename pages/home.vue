<template>
  <div class="px-4 lg:p-6 max-w-6xl flex flex-col items-center">
    <div id="jumbotron" class="relative w-full h-[36rem] flex flex-row justify-center items-center overflow-hidden">
      <div id="avatar-grid" class="w-full flex flex-col justify-center items-center">
        <div class="w-full flex flex-row justify-center">
          <img v-for="i in 12" :src="getRandomAvatarImgSrc()" class="w-16">
        </div>
        <div class="w-full ml-16 flex flex-row justify-center">
          <img v-for="i in 12" :src="getRandomAvatarImgSrc()" class="w-16">
        </div>
        <div class="flex flex-col justify-center items-center">
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

    <div id="shop-alerts" class="relative w-full py-16 flex flex-col lg:flex-row">
      <div class="mb-12 lg:mb-0 w-full lg:w-1/2 lg:px-6 flex flex-col items-center justify-center text-white">
        <h2 class="text-xl md:text-3xl font-bold text-center"><span class="text-amber-500 italic mr-1">NEW</span> Reddit Shop Alerts 🚨️</h2>
        <h3 class="mb-12 font-semibold text-amber-500">PREMIUM ONLY</h3>
        <p class="max-w-xl text-neutral-200 font-bold">
          Get notified whenever a new collection is available on the Reddit Avatar Shop! Along with a link to take you directly to the shop gallery.
        </p>
      </div>
      <div class="w-full lg:w-1/2 flex flex-col items-center justify-center">
        <div class="rounded-2xl shadow-lg overflow-hidden">
          <img src="/img/shop-alerts.png" style="filter: invert(0.85);">
        </div>
      </div>
    </div>

    <div id="price-alerts" class="relative w-full py-16 flex flex-col-reverse lg:flex-row">
      <div class="w-full lg:w-1/2 flex flex-col items-center justify-center">
        <div class="rounded-2xl shadow-lg overflow-hidden">
          <img src="/img/price-alerts.png" style="filter: invert(0.85);">
        </div>
      </div>
      <div class="mb-12 lg:mb-0 w-full lg:w-1/2 lg:px-6 flex flex-col items-center justify-center text-white">
        <h2 class="text-xl md:text-3xl font-bold text-center mb-12">Realtime Custom Price Alerts ⚡️</h2>
        <p class="max-w-xl text-neutral-200 font-bold">
          With our highly customizable price alerts, you will be able to snipe the best deals before anyone else.
        </p>
      </div>
    </div>

    <div id="collection-alerts" class="relative w-full py-16 flex flex-col lg:flex-row">
      <div class="mb-12 lg:mb-0 w-full lg:w-1/2 lg:px-6 flex flex-col items-center justify-center text-white">
        <h2 class="text-xl md:text-3xl font-bold text-center">New Collection Warnings 🚨️</h2>
        <h3 class="mb-12 font-semibold text-amber-500">PREMIUM ONLY</h3>
        <p class="max-w-xl text-neutral-200 font-bold">
          With our realtime connection to the Polygon transaction pool, we are able to tell whenever Reddit deploys a new contract. We will send you an email notification before the contract is even confirmed on the network!
        </p>
      </div>
      <div class="w-full lg:w-1/2 flex flex-col items-center justify-center">
        <div class="rounded-2xl shadow-lg overflow-hidden">
          <img src="/img/new-contract.png" style="filter: invert(0.85);">
        </div>
      </div>
    </div>

    <h2 class="mb-12 text-xl text-white font-bold text-center">We continually want to improve the service, so stay tuned for new updates!</h2>

    <NuxtLink
        class="px-6 py-4 max-w-xs bg-neutral-700/50 hover:bg-amber-500/20 font-bold text-lg text-amber-500 rounded-2xl duration-200"
        to="/signup"
    >
      Sign up for free
    </NuxtLink>

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
                  *Unlimited price alert notifications
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
                <strong>€ 20</strong>
                <small class="text-neutral-400"> / lifetime</small>
              </h3>
              <NuxtLink
                  class="signup"
                  target="_blank"
                  to="/upgrade"
              >
                Buy a premium code
              </NuxtLink>
              <p class="mt-3 text-sm text-neutral-400">You can redeem your premium code by signing up for a free account and then going to <a href="/upgrade" class="text-amber-500 hover:text-amber-400 duration-200  cursor-pointer">upgrade</a>.</p>
            </div>
            <div class="p-6">
              <ol class="list-inside text-neutral-200 font-semibold text-sm">
                <li class="mb-4 flex items-center">
                  <CheckBadgeIcon class="w-5 mr-2 text-green-600"/>
                  *Reddit shop alerts
                </li>
                <li class="mb-4 flex items-center">
                  <CheckBadgeIcon class="w-5 mr-2 text-green-600"/>
                  *50 concurrent price alerts
                </li>
                <li class="mb-4 flex items-center">
                  <CheckBadgeIcon class="w-5 mr-2 text-green-600"/>
                  *Unlimited price alert notifications
                </li>
                <li class="mb-4 flex items-center">
                  <CheckBadgeIcon class="w-5 mr-2 text-green-600"/>
                  *New collection warnings
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
