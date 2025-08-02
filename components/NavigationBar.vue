<template>
  <div class="sticky top-0 flex flex-col bg-gradient-to-r from-[#141415] via-[#1a1a1b] to-[#141415] border-b border-zinc-800/50 backdrop-blur-xl z-50 w-full shadow-lg" :class="{ 'nav-top': Capacitor.isNativePlatform() }" @mouseleave="closeDropdowns()" ref="navbar">
    <nav class="relative py-2 px-4 lg:px-6 flex w-full items-center">
      <!-- Logo Section -->
      <div class="flex items-center space-x-4">
        <NuxtLink to="/" class="flex items-center space-x-3 group">
          <div class="relative">
            <img class="h-8 w-auto transition-transform duration-300 group-hover:scale-105" src="/images/branding/rcax/RCAX_Logo_Color.svg">
            <div class="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <img class="h-5 w-auto transition-opacity duration-300 group-hover:opacity-80" src="/images/branding/rcax/rcaxLogo2024Light.svg">
        </NuxtLink>
      </div>

      <!-- Desktop Navigation Links -->
      <div class="hidden lg:flex items-center space-x-6 ml-6">
        <NuxtLink 
          to="/" 
          exact-active-class="nav-link-active" 
          class="relative px-3 py-1.5 text-gray-400 hover:text-white transition-all duration-200 font-medium group"
        >
          <span class="relative z-10">Avatars</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/avatar" 
          active-class="nav-link-active" 
          class="relative px-3 py-1.5 text-gray-400 hover:text-white transition-all duration-200 font-medium group"
        >
          <span class="relative z-10">Exporter</span>
        </NuxtLink>

        <template v-if="!Capacitor.isNativePlatform()">
          <DropDownMenu class="relative" :usingUser="false">
            <template v-slot:button>
              <button class="relative px-3 py-1.5 text-gray-400 hover:text-white transition-all duration-200 font-medium group flex items-center space-x-1">
                <span class="relative z-10">Apps</span>
                <ChevronDownIcon class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              </button>
            </template>
            <template v-slot:menu>
              <NuxtLink 
                replace 
                to="/dapps/randomavatarswap"
              >
                Random Avatar Swap
              </NuxtLink>
              <NuxtLink 
                to="https://avatartraits.xyz"
              >
                AvatarTraits.xyz
              </NuxtLink>
            </template>
          </DropDownMenu>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <button 
        @click="toggleMobileMenu()"
        class="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-all duration-200 ml-auto"
      >
        <Bars3Icon v-if="!mobileMenuOpen" class="w-5 h-5" />
        <XMarkIcon v-else class="w-5 h-5" />
      </button>

      <!-- Right Side Actions -->
      <div class="hidden lg:flex items-center space-x-3 ml-auto">
        <!-- Currency Selector -->
        <div class="relative">
          <select 
            v-model="settings.currency.preferred"
            class="appearance-none bg-zinc-800/30 border border-zinc-700/30 text-zinc-400 text-sm rounded-lg px-3 py-1.5 pr-7 hover:bg-zinc-700/40 hover:border-zinc-600/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-200 cursor-pointer"
          >
            <option v-for="currency in CURRENCIES" :key="currency.ticker" :value="currency.ticker" class="bg-zinc-800">
              {{ currency.ticker }}
            </option>
          </select>
          <ChevronDownIcon class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        </div>

        <!-- User Menu -->
        <template v-if="user?.username">
          <UserMenuButton class="relative" :usingUser="true">
            <template v-if="user?.tier < 1">
              <NuxtLink
                replace
                to="/upgrade"
                class="text-amber-400 hover:text-amber-300"
              >
                Upgrade to Pro
              </NuxtLink>
            </template>
            <button 
              @click="deleteAccount()"
              class="text-red-400 hover:text-red-300"
            >
              Delete account
            </button>
            <button 
              @click="logout()"
            >
              Sign out
            </button>
            <button 
              @click="resetSettings()"
              class="text-zinc-400 hover:text-zinc-400 text-sm"
            >
              Reset settings
            </button>
          </UserMenuButton>
        </template>
        <template v-else>
          <div class="flex items-center space-x-3">
            <NuxtLink
              replace
              to="/login"
              class="px-3 py-1.5 text-zinc-400 hover:text-slate-200 hover:bg-zinc-700/30 rounded-lg transition-all duration-200 font-medium"
            >
              Login
            </NuxtLink>
            <NuxtLink
              replace
              to="/signup"
              class="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Create account
            </NuxtLink>
          </div>
        </template>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="mobileMenuOpen" class="lg:hidden absolute top-full left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-700/50 shadow-xl">
        <div class="px-4 py-6 space-y-4">
          <!-- Mobile Navigation Links -->
          <div class="space-y-2">
            <NuxtLink 
              to="/" 
              @click="closeMobileMenu()"
              exact-active-class="nav-link-active" 
              class="block px-4 py-3 text-gray-400 hover:text-white transition-all duration-200 font-medium"
            >
              Avatars
            </NuxtLink>
            <NuxtLink 
              to="/avatar" 
              @click="closeMobileMenu()"
              active-class="nav-link-active" 
              class="block px-4 py-3 text-gray-400 hover:text-white transition-all duration-200 font-medium"
            >
              Exporter
            </NuxtLink>
            
            <template v-if="!Capacitor.isNativePlatform()">
              <div class="pl-4 pt-2 pb-1">
                <div class="text-zinc-400 text-sm font-medium uppercase tracking-wide mb-2">Apps</div>
                <div class="space-y-1">
                  <NuxtLink 
                    replace 
                    to="/dapps/randomavatarswap"
                    @click="closeMobileMenu()"
                    class="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-all duration-200"
                  >
                    Random Avatar Swap
                  </NuxtLink>
                  <NuxtLink 
                    to="https://avatartraits.xyz"
                    @click="closeMobileMenu()"
                    class="block px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-all duration-200"
                  >
                    AvatarTraits.xyz
                  </NuxtLink>
                </div>
              </div>
            </template>
          </div>

          <!-- Mobile User Section -->
          <div class="pt-4 border-t border-zinc-700/50 space-y-3">
            <!-- Currency Selector -->
            <div class="flex items-center justify-between">
              <span class="text-zinc-400 text-sm font-medium">Currency</span>
              <select 
                v-model="settings.currency.preferred"
                class="bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
              >
                <option v-for="currency in CURRENCIES" :key="currency.ticker" :value="currency.ticker" class="bg-zinc-800">
                  {{ currency.ticker }}
                </option>
              </select>
            </div>

            <!-- User Actions -->
            <template v-if="user?.username">
              <div class="flex items-center space-x-3 px-4 py-3 bg-zinc-800/30 rounded-lg">
                <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ user.username.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="text-white font-medium">{{ user.username }}</div>
                  <div class="text-zinc-400 text-sm">{{ user.tier < 1 ? 'Free User' : 'Pro User' }}</div>
                </div>
              </div>
              
              <template v-if="user?.tier < 1">
                <NuxtLink
                  replace
                  to="/upgrade"
                  @click="closeMobileMenu()"
                  class="block px-4 py-3 text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 rounded-lg transition-all duration-200 font-medium text-center"
                >
                  Upgrade to Pro
                </NuxtLink>
              </template>
              
              <button 
                @click="deleteAccount(); closeMobileMenu()"
                class="block w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-200"
              >
                Delete account
              </button>
              <button 
                @click="logout(); closeMobileMenu()"
                class="block w-full text-left px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-all duration-200"
              >
                Sign out
              </button>
            </template>
            <template v-else>
              <div class="space-y-2">
                <NuxtLink
                  replace
                  to="/login"
                  @click="closeMobileMenu()"
                  class="block px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-700/50 rounded-lg transition-all duration-200 font-medium text-center border border-zinc-700/50"
                >
                  Login
                </NuxtLink>
                <NuxtLink
                  replace
                  to="/signup"
                  @click="closeMobileMenu()"
                  class="block px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 font-medium text-center shadow-lg"
                >
                  Create account
                </NuxtLink>
              </div>
            </template>
            
            <button 
              @click="resetSettings()"
              class="block w-full text-left px-4 py-2 text-zinc-400 hover:text-zinc-400 hover:bg-zinc-700/50 rounded-lg transition-all duration-200 text-sm"
            >
              Reset settings
            </button>
          </div>
        </div>
      </div>
    </Transition>
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
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";

const user = useUser();
const token = useToken();
const cone = useConeEthPrice();
const router = useRouter();
const settings = useSettings();

const showMenu: Ref<boolean> = ref(false);
const userDropDown: Ref<boolean> = ref(false);
const navbar: Ref<HTMLElement | null> = ref(null);
const navbarIsStickied = ref(false);
const mobileMenuOpen: Ref<boolean> = ref(false);

onMounted(() => {
  updateNavbarStickiedState();
});

router.afterEach(() => {
  showMenu.value = false;
  mobileMenuOpen.value = false;
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
  mobileMenuOpen.value = false;
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function closeMobileMenu() {
  mobileMenuOpen.value = false;
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
/* RCAX Brand Orange Active State */
.nav-link-active {
  color: #df7a30 !important;
}

.navigation-bar select {
  @apply h-8 max-h-full;
}

.nav-top {
  top: env(safe-area-inset-top);
}
</style>
