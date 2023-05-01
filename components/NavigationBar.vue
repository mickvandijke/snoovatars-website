<template>
  <div
      class="flex flex-col sticky top-0 bg-neutral-900/90 md:bg-neutral-800/50 border-b border-neutral-800 md:border-none z-40 w-full"
      style="backdrop-filter: blur(20px);"
      @mouseleave="closeDropdowns()"
  >
    <nav class="container py-3 px-4 md:py-5 mx-auto md:flex md:justify-between md:items-center">
      <div class="flex flex-row items-center gap-6">
        <div class="flex flex-row flex-nowrap items-center">
          <NuxtLink
              class="text-2xl font-bold text-white md:text-3xl duration-500"
              to="/home"
          >
            RCA<span class="italic text-amber-500">X</span>.io
          </NuxtLink>
        </div>
        <div class="ml-auto flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-4 h-4 text-amber-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
          <span class="font-bold text-white">$ {{ ethereumUsdPrice }}</span>
        </div>
        <!-- Mobile menu button -->
        <div @click="toggleNav" class="flex md:hidden">
          <button
              type="button"
              class="
              text-gray-100
              hover:text-gray-400
              focus:outline-none focus:text-gray-400
            "
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path
                  fill-rule="evenodd"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <ul
          :class="showMenu ? 'flex' : 'hidden'"
          class="flex-col mt-8 space-y-4 md:flex md:space-y-0 md:flex-row md:items-center md:space-x-3 md:mt-0"
      >
        <NuxtLink class="px-4 py-2 bg-neutral-700/50 hover:bg-neutral-600/50 text-neutral-400 font-semibold rounded-2xl duration-200 cursor-pointer" to="/stats">Dashboard</NuxtLink>
        <NuxtLink class="px-4 py-2 bg-neutral-700/50 hover:bg-neutral-600/50 text-neutral-400 font-semibold rounded-2xl duration-200 cursor-pointer" to="/avatar/exporter">Avatar Exporter</NuxtLink>
        <NuxtLink class="px-4 py-2 bg-neutral-700/50 hover:bg-neutral-600/50 text-neutral-400 font-semibold rounded-2xl duration-200 cursor-pointer" to="/alerts">Price Alerts</NuxtLink>
        <template v-if="token && user?.username">
          <div
              @mouseover="userDropDown = true"
              @click="userDropDown = !userDropDown"
              class="relative px-4 py-2 flex flex-row flex-nowrap bg-neutral-700/50 hover:bg-neutral-600/50 text-amber-500 font-semibold rounded-2xl duration-200 cursor-pointer">
            <div>
              <button
                  class="flex flex-row flex-nowrap font-semibold"
              >
                {{ user.username }}
                <ChevronDownIcon class="ml-1 w-5 opacity-50"/>
              </button>
            </div>

            <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
              <template v-if="userDropDown">
                <div class="absolute left-0 md:left-auto md:right-0 top-10 z-10 mt-2 w-56 bg-neutral-800 rounded-2xl shadow">
                  <ul class="p-3 font-semibold capitalize">
                    <template v-if="user?.tier < 1">
                      <NuxtLink
                          class="p-3 w-full inline-flex items-center hover:bg-neutral-700/50 text-amber-500 rounded-2xl duration-200"
                          replace
                          to="/upgrade"
                      >
                        Upgrade to premium
                      </NuxtLink>
                    </template>
                    <li class="p-3 w-full inline-flex items-center hover:bg-neutral-700/50 text-neutral-400 rounded-2xl duration-200">
                      <a @click="logout()" class="inline-flex items-center">
                        <span class="flex flex-nowrap whitespace-nowrap">Sign out</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </template>
            </transition>
          </div>
        </template>
        <template v-else>
          <NuxtLink class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-2xl duration-200 cursor-pointer" to="/login">Login</NuxtLink>
        </template>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {ChevronDownIcon} from "@heroicons/vue/20/solid";

import {Ref} from "@vue/reactivity";
import {ref, useEthereumUsdPrice, useToken, useUser} from "#imports";
import {deleteToken} from "~/composables/api/user";

const user = useUser();
const token = useToken();
const ethereumUsdPrice = useEthereumUsdPrice();

const showMenu: Ref<boolean> = ref(false);
const userDropDown: Ref<boolean> = ref(false);

const toggleNav = () => (showMenu.value = !showMenu.value);

function logout() {
  deleteToken();
}

function closeDropdowns() {
  userDropDown.value = false;
}
</script>

<style scoped>

</style>
