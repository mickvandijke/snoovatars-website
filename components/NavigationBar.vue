<template>
  <div class="sticky top-0 flex flex-col bg-primary border-white/5 z-40 w-full duration-200" :class="{ 'nav-top': Capacitor.isNativePlatform() }" @mouseleave="closeDropdowns()" ref="navbar">
    <nav class="py-2 sm:py-3 px-4 sm:px-6 flex w-full items-center gap-3 md:gap-6 duration-200">
      <div class="flex flex-row items-center gap-4 lg:gap-6">
        <NuxtLink to="/" class="flex flex-row flex-nowrap items-center">
          <img class="h-8 mr-2.5" src="/images/branding/rcax/RCAX_Logo_Color.svg">
          <img class="h-5" src="/images/branding/rcax/rcaxLogo2024Light.svg">
        </NuxtLink>
      </div>

      <ul class="flex text-white/60 text-[0.95rem] gap-3 lg:flex lg:gap-0 lg:flex-row lg:items-center lg:space-x-3">
        <NuxtLink class="hidden md:block px-4 py-2 hover:text-white rounded-lg duration-200 cursor-pointer" to="/" exact-active-class="text-white">Avatars</NuxtLink>
        <NuxtLink class="hidden md:block px-4 py-2 hover:text-white rounded-lg duration-200 cursor-pointer" to="/avatar" active-class="text-white">Exporter</NuxtLink>
        <template v-if="!Capacitor.isNativePlatform()">
          <DropDownMenu class="hidden md:block">
            <template v-slot:button>
              <span class="text-white/60 hover:text-white px-4 py-2">Apps</span>
            </template>
            <template v-slot:menu>
              <NuxtLink replace to="/dapps/randomavatarswap">
                Random Avatar Swap
              </NuxtLink>
              <NuxtLink replace to="/lookup">
                Reddit Identity Lookup
              </NuxtLink>
              <NuxtLink to="https://avatartraits.xyz">
                AvatarTraits.xyz
              </NuxtLink>
            </template>
          </DropDownMenu>
        </template>

      </ul>

      <UserMenuButton class="ml-auto sm:px-2">
        <select class="bg-transparent hover:bg-transparent hover:text-white text-white/40" v-model="settings.currency.preferred">
          <template v-for="currency in CURRENCIES">
            <option :value="currency.ticker">{{ currency.ticker }}</option>
          </template>
        </select>
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

<style scoped>
.navigation-bar select {
  @apply h-8 max-h-full;
}

.nav-top {
  top: env(safe-area-inset-top);
}
</style>
