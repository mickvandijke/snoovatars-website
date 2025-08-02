<template>
  <div class="relative flex flex-col w-full min-h-screen bg-[#141415]">
    <div class="flex-1 flex items-start justify-center pt-16 md:pt-24 pb-8">
      <div class="w-full max-w-md mx-auto px-4">
        <!-- Signup Card -->
        <div class="bg-zinc-800/30 rounded-xl border border-zinc-700/30 overflow-hidden">
          <!-- Header -->
          <div class="px-6 py-6 border-b border-zinc-800">
            <div class="text-center">
              <div class="flex items-center justify-center gap-3">
                <img src="/images/branding/rcax/RCAX_Logo_Color.svg" class="w-8 h-8" alt="RCAX Logo">
                <h1 class="text-2xl font-semibold text-white">Sign up for RCAX</h1>
              </div>
            </div>
          </div>
          
          <!-- Form -->
          <div class="px-6 py-6">
            <div class="space-y-4">
              <div>
                <label for="email" class="block text-sm font-medium text-zinc-400 mb-2">Email</label>
                <input 
                  type="email" 
                  required 
                  v-model="email" 
                  id="email" 
                  class="w-full px-4 py-2.5 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 rounded-lg transition-all duration-200 focus:outline-none"
                  placeholder="Enter your email address"
                >
                <span v-if="emailError()" class="mt-2 block text-red-400 text-sm">{{ emailError() }}</span>
              </div>
              
              <template v-if="email">
                <div>
                  <label for="password" class="block text-sm font-medium text-zinc-400 mb-2">Password</label>
                  <input 
                    type="password" 
                    required 
                    v-model="password" 
                    id="password" 
                    class="w-full px-4 py-2.5 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 rounded-lg transition-all duration-200 focus:outline-none"
                    placeholder="Choose a secure password"
                  >
                  <span v-if="passwordError()" class="mt-2 block text-red-400 text-sm">{{ passwordError() }}</span>
                </div>
                <div>
                  <label for="repeat-password" class="block text-sm font-medium text-zinc-400 mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    required 
                    v-model="repeatPassword" 
                    id="repeat-password" 
                    class="w-full px-4 py-2.5 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white placeholder-zinc-500 rounded-lg transition-all duration-200 focus:outline-none"
                    placeholder="Confirm your password"
                  >
                  <span v-if="repeatPasswordError()" class="mt-2 block text-red-400 text-sm">{{ repeatPasswordError() }}</span>
                </div>
              </template>
            </div>
            
            <!-- Create Account Button -->
            <button 
              :disabled="!isFormValid() || loading" 
              @click="register" 
              class="mt-6 w-full px-6 py-2.5 bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:hover:bg-zinc-800 text-black disabled:text-zinc-600 text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <template v-if="loading">
                <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating account...</span>
              </template>
              <template v-else>
                <span>Create Account</span>
              </template>
            </button>
            
            <!-- Links -->
            <div class="mt-6">
              <NuxtLink 
                to="/login" 
                class="block w-full text-center px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium rounded-lg hover:bg-zinc-800/50 transition-all duration-200"
              >
                Already have an account? Sign in
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "#imports";
import {Ref} from "@vue/reactivity";
import {navigateTo} from "#app";
import {createUser} from "~/composables/api/user";

const loading: Ref<boolean> = ref(false);
const email: Ref<string> = ref(null);
const username: Ref<string> = ref(null);
const password: Ref<string> = ref(null);
const repeatPassword: Ref<string> = ref(null);

function generateRandomUsername(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let username = '';

  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    username += characters[randomIndex];
  }

  return username;
}

function emailError() {
  if (!email.value) {
    return "Email is required.";
  }

  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)))
  {
    return "Invalid email."
  }
}

function usernameError() {
  if (!username.value) {
    return "Username is required.";
  }

  if (username.value.length < 3) {
    return "Username is too short.";
  }

  if (username.value.length > 20) {
    return "Username is too long.";
  }

  if (username.value.startsWith("0x"))
  {
    return "Username may not start with '0x'.";
  }
}

function passwordError() {
  if (!password.value) {
    return "Password is required.";
  }

  if (password.value.length < 6) {
    return "Password is too short.";
  }

  if (password.value.length > 64) {
    return "Password is too long.";
  }
}

function repeatPasswordError() {
  if (repeatPassword.value !== password.value) {
    return "Passwords do not match.";
  }
}

function isFormValid(): boolean {
  return !emailError() && !passwordError() && !repeatPasswordError();
}

function register() {
  username.value = generateRandomUsername();

  if (!isFormValid()) {
    return;
  }

  loading.value = true;

  createUser(email.value, username.value, password.value)
      .then(async (message) => {
        loading.value = false;
        alert(message);
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      })
}

async function navigateToAfterLoginView() {
  await navigateTo("/alerts", { replace: true });
}
</script>

<style scoped>

</style>
