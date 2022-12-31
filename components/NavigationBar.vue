<template>
  <div class="flex flex-col sticky top-0 bg-neutral-800/50 z-40 w-full" style="backdrop-filter: blur(20px);">
    <nav
        class="
        container
        px-4
        py-5
        mx-auto
        md:flex md:justify-between md:items-center
      "
    >
      <div class="flex items-center justify-between">
        <router-link
            to="/"
            class="
            text-xl
            font-bold
            text-amber-500
            md:text-3xl
            hover:text-amber-400
            duration-500
          "
        >snoovatars.com
        </router-link>
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

      <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
      <ul
          :class="showMenu ? 'flex' : 'hidden'"
          class="
          flex-col
          mt-8
          space-y-4
          md:flex md:space-y-0 md:flex-row md:items-center md:space-x-3 md:mt-0
        "
      >
        <NuxtLink class="px-4 py-2 bg-neutral-700/50 hover:bg-neutral-700 text-amber-500 font-semibold rounded-2xl duration-200 cursor-pointer" to="/alerts">Price Alerts</NuxtLink>
        <div
            v-if="token && user?.username"
            @click.self="userDropDown = !userDropDown"
            class="relative px-4 py-2 flex flex-row flex-nowrap bg-neutral-700/50 hover:bg-neutral-700 text-neutral-400 font-semibold rounded-2xl duration-200 cursor-pointer">
          <span
              @click="userDropDown = !userDropDown"
              class="flex flex-row flex-nowrap"
          >
            {{ user.username }}
            <ChevronDownIcon class="ml-1 w-5 opacity-50"/>
          </span>
          <div
              class="absolute w-56 -ml-4 top-12 z-10"
              :class="{hidden: !userDropDown}"
          >
            <div class="divide-y bg-neutral-700 rounded-2xl overflow-hidden shadow-lg">
              <ul class="p-4 space-y-3 text-sm">
                <li v-if="user.tier < 1" class="px-4 py-2 w-full bg-amber-600 hover:bg-amber-500 text-white rounded-2xl shadow duration-200">
                  <NuxtLink
                      target="_blank"
                      to="https://commerce.coinbase.com/checkout/c83f3cd4-adcf-4d3e-9349-3c1892f94472"
                  >
                    Upgrade to premium
                  </NuxtLink>
                </li>
                <li class="px-4 py-2 w-full bg-red-600 hover:bg-red-500 text-white rounded-2xl shadow duration-200">
                  <a @click="logout()" class="inline-flex items-center">
                    <span class="flex flex-nowrap whitespace-nowrap">Sign out</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <NuxtLink v-else class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-2xl duration-200 cursor-pointer" to="/login">Login</NuxtLink>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {ChevronDownIcon} from "@heroicons/vue/20/solid";

import {Ref} from "@vue/reactivity";
import {ref, useToken, useUser} from "#imports";
import {deleteToken} from "~/composables/api/user";

const user = useUser();
const token = useToken();

const showMenu: Ref<boolean> = ref(false);
const userDropDown: Ref<boolean> = ref(false);

const toggleNav = () => (showMenu.value = !showMenu.value);

function logout() {
  deleteToken();
}
</script>

<style scoped>

</style>
