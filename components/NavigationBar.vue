<template>
  <div class="navigation-bar flex flex-col border-b border-primary-accent sm:border-primary-border z-40 w-full duration-200" :class="{ 'sm:mb-6': scrolled >= 72 }" @mouseleave="closeDropdowns()" ref="navbar">
    <nav class="py-2 px-4 sm:px-6 flex w-full items-center gap-3 md:gap-6 duration-200" :class="{ 'sm:py-4': scrolled < 72 }">
      <div class="flex flex-row items-center gap-4 lg:gap-6">
        <div class="flex flex-row flex-nowrap items-center">
          <NuxtLink class="text-2xl font-bold text-white lg:text-3xl duration-500" to="/home">RCA<span class="italic text-amber-500">X</span></NuxtLink>
        </div>
        <div class="ml-auto flex items-center flex-nowrap gap-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-4 h-4 text-white/60"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
          <span class="font-semibold text-white whitespace-nowrap">{{ ethereumInLocalCurrency(ETH_TO_GWEI_MODIFIER) }}</span>
        </div>
      </div>

      <div class="ml-auto md:ml-0 h-full">
        <select v-model="settings.currency.preferred">
          <template v-for="currency in CURRENCIES">
            <option :value="currency.ticker">{{ currency.ticker }}</option>
          </template>
        </select>
      </div>

      <ul class="md:ml-auto flex text-white/90 text-[0.95rem] font-medium gap-3 lg:flex lg:gap-0 lg:flex-row lg:items-center lg:space-x-3">
        <NuxtLink class="hidden md:block px-4 py-2 hover:text-white rounded-lg duration-200 cursor-pointer" to="/">Trading View</NuxtLink>
        <NuxtLink class="hidden md:block px-4 py-2 hover:text-white rounded-lg duration-200 cursor-pointer" to="/avatar">Avatar Exporter</NuxtLink>
        <template v-if="!Capacitor.isNativePlatform()">
          <DropDownMenu class="hidden md:block">
            <template v-slot:button>
              <span>dApps</span>
            </template>
            <template v-slot:menu>
              <NuxtLink replace to="/dapps/randomavatarswap">
                Random Avatar Swap
              </NuxtLink>
            </template>
          </DropDownMenu>
        </template>
        <UserMenuButton>
          <template v-if="user?.username">
            <template v-if="user?.tier < 1">
              <NuxtLink
                  replace
                  to="/upgrade"
              >
                Upgrade to Pro
              </NuxtLink>
            </template>
            <div @click="deleteAccount()">
              <a class="inline-flex items-center">
                <span class="flex flex-nowrap whitespace-nowrap">Delete account</span>
              </a>
            </div>
            <div @click="logout()">
              <a class="inline-flex items-center">
                <span class="flex flex-nowrap whitespace-nowrap">Sign out</span>
              </a>
            </div>
          </template>
          <template v-else>
            <NuxtLink
                replace
                to="/login"
            >
              Login
            </NuxtLink>
            <NuxtLink
                replace
                to="/signup"
            >
              Create account
            </NuxtLink>
          </template>
          <button @click="resetSettings()">Reset settings</button>
        </UserMenuButton>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import {Ref} from "@vue/reactivity";
import {
  computed, onBeforeMount, onBeforeUnmount, onMounted,
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
import {Capacitor} from "@capacitor/core";

const user = useUser();
const token = useToken();
const cone = useConeEthPrice();
const router = useRouter();
const settings = useSettings();

const showMenu: Ref<boolean> = ref(false);
const userDropDown: Ref<boolean> = ref(false);
const navbar: Ref<HTMLElement | null> = ref(null);
const navbarIsStickied = ref(false);

onMounted(() => {
  updateNavbarStickiedState();
});

router.afterEach(() => {
  showMenu.value = false;
});

const selectedCurrency = computed(() => {
  return settings.value.currency.preferred;
});

watch([selectedCurrency], () => {
  updateEthereumPrices();
});

function resetSettings() {
  useSettings().value.link.opener = undefined;
}

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

onBeforeMount(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

function updateNavbarStickiedState() {
  let stickied = false;

  if (navbar.value) {
    const rect = navbar.value?.getBoundingClientRect();

    stickied = rect.top <= 0;
  }

  navbarIsStickied.value = stickied;
}

const scrolled = ref(0);

function handleScroll() {
  // When the user scrolls, check the pageYOffset
  scrolled.value = window.pageYOffset;

  updateNavbarStickiedState();
}
</script>

<style>
.navigation-bar select {
  @apply h-8 max-h-full;
}
</style>
