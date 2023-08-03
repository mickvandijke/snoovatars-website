<template>
  <div
      class="sticky top-0 flex flex-col bg-neutral-900/90 z-40 sm:border-b border-neutral-800 w-full"
      style="backdrop-filter: blur(20px);padding-top: env(safe-area-inset-top);"
      @mouseleave="closeDropdowns()"
      ref="navbar"
  >
    <nav class="py-2 px-4 flex w-full justify-between items-center">
      <div class="flex flex-row items-center gap-4 lg:gap-6">
        <div class="flex flex-row flex-nowrap items-center">
          <NuxtLink
              class="text-2xl font-bold text-white lg:text-3xl duration-500"
              to="/home"
          >
            RCA<span class="italic text-amber-500">X</span>.io
          </NuxtLink>
        </div>
        <div class="ml-auto flex items-center flex-nowrap gap-0.25">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-4 h-4 text-amber-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
          <span class="font-bold text-white whitespace-nowrap">{{ ethereumInLocalCurrency(ETH_TO_GWEI_MODIFIER) }}</span>
        </div>
        <div>
          <select v-model="settings.currency.preferred" class="px-2 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 border-none text-sm focus:outline-none max-w-sm">
            <template v-for="currency in CURRENCIES">
              <option :value="currency.ticker">{{ currency.ticker }}</option>
            </template>
          </select>
        </div>
      </div>

      <ul class="flex text-neutral-300 text-sm font-medium gap-3 lg:flex lg:gap-0 lg:flex-row lg:items-center lg:space-x-3">
        <NuxtLink class="hidden md:block px-4 py-2 hover:text-amber-500 rounded-lg duration-200 cursor-pointer" active-class="text-amber-500" to="/stats">Dashboard</NuxtLink>
        <NuxtLink class="hidden md:block px-4 py-2 hover:text-amber-500 rounded-lg duration-200 cursor-pointer" active-class="text-amber-500" to="/avatar/exporter">Avatar Exporter</NuxtLink>
        <NuxtLink class="hidden md:block px-4 py-2 hover:text-amber-500 rounded-lg duration-200 cursor-pointer" active-class="text-amber-500" to="/alerts">Price Alerts</NuxtLink>
        <template v-if="token && user?.username">
          <div
              @mouseover="userDropDown = true"
              @click="userDropDown = !userDropDown"
              class="relative md:px-2 md:py-1 flex flex-row flex-nowrap items-center md:hover:bg-neutral-800 hover:text-amber-500 rounded-lg duration-200 cursor-pointer">
            <div>
              <UserCircleIcon class="w-7 h-7" />
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
                <div class="absolute right-0 lg:left-auto lg:right-0 top-10 z-10 mt-2 w-56 bg-neutral-800 border border-neutral-700 rounded-lg shadow">
                  <ul class="p-3 font-medium text-sm capitalize">
                    <template v-if="user?.tier < 1">
                      <NuxtLink
                          class="p-3 w-full inline-flex items-center hover:bg-neutral-700/50 text-amber-500 rounded-lg duration-200"
                          replace
                          to="/upgrade"
                      >
                        Upgrade to Pro
                      </NuxtLink>
                    </template>
                    <li @click="deleteAccount()" class="p-3 w-full inline-flex items-center hover:bg-neutral-700/50 text-neutral-400 rounded-lg duration-200">
                      <a class="inline-flex items-center">
                        <span class="flex flex-nowrap whitespace-nowrap">Delete account</span>
                      </a>
                    </li>
                    <li @click="logout()" class="p-3 w-full inline-flex items-center hover:bg-neutral-700/50 text-neutral-400 rounded-lg duration-200">
                      <a class="inline-flex items-center">
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
          <NuxtLink class="text-neutral-400 hover:text-amber-500 font-medium rounded-lg duration-200 cursor-pointer" to="/login">Login</NuxtLink>
        </template>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {ChevronDownIcon, UserCircleIcon} from "@heroicons/vue/20/solid";
import {Ref} from "@vue/reactivity";
import {
  computed,
  ref, updateEthereumPrices, useRouter, useSettings,
  useToken,
  useUser,
  watch
} from "#imports";
import {deleteToken} from "~/composables/api/user";
import {CURRENCIES} from "~/types/currency";
import {
  useConeEthPrice,
} from "~/composables/states";
import {ethereumInLocalCurrency} from "#imports";
import {navigateTo} from "nuxt/app";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";

const user = useUser();
const token = useToken();
const cone = useConeEthPrice();
const router = useRouter();
const settings = useSettings();

const showMenu: Ref<boolean> = ref(false);
const userDropDown: Ref<boolean> = ref(false);
const navbar = ref(null);
const navbarHeight = ref(0);

defineExpose({ navbarHeight });

router.afterEach(() => {
  showMenu.value = false;
});

const selectedCurrency = computed(() => {
  return settings.value.currency.preferred;
});

watch([selectedCurrency], () => {
  updateEthereumPrices();
});

async function deleteAccount() {
  if (!user.value.username) {
    return;
  }

  await navigateTo(`/accountdeletion`, {replace: true});
}

function logout() {
  deleteToken();
}

function closeDropdowns() {
  userDropDown.value = false;
}
</script>

<style scoped>

</style>
