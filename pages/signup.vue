<template>
  <div class="px-4 py-12 flex flex-col items-center w-full max-w-xl">
    <div class="mx-auto p-6 md:w-96 w-full max-w-full">
      <div class="mt-3 text-center">
        <h3 class="text-2xl font-bold text-neutral-200 text-left">Sign up for RCAX</h3>
        <div class="mt-2 py-3 overflow-y-auto">
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-neutral-500 text-left">Email</label>
            <input type="email" required v-model="email" id="email" class="light">
            <span v-if="emailError()" class="mt-2 block text-red-400 text-sm">{{ emailError() }}</span>
          </div>
          <template v-if="email">
            <!--          <div class="mt-4">-->
            <!--            <label for="username" class="block mb-2 text-sm font-medium text-neutral-500 text-left">Username</label>-->
            <!--            <input type="text" required v-model="username" id="username" class="light">-->
            <!--            <span v-if="usernameError()" class="mt-2 block text-red-400 text-sm">{{ usernameError() }}</span>-->
            <!--          </div>-->
            <div class="mt-4">
              <label for="password" class="block mb-2 text-sm font-medium text-neutral-500 text-left">Password</label>
              <input type="password" required v-model="password" id="password" class="light">
              <span v-if="passwordError()" class="mt-2 block text-red-400 text-sm">{{ passwordError() }}</span>
            </div>
            <div class="mt-4">
              <label for="repeat-password" class="block mb-2 text-sm font-medium text-neutral-500 text-left">Repeat Password</label>
              <input type="password" required v-model="repeatPassword" id="repeat-password" class="light">
              <span v-if="repeatPasswordError()" class="mt-2 block text-red-400 text-sm">{{ repeatPasswordError() }}</span>
            </div>
          </template>
        </div>
        <div class="items-center py-3">
          <button :disabled="!isFormValid() || loading" @click="register" class="px-4 h-12 flex justify-center items-center bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-white disabled:text-white/20 font-medium rounded-xl w-full duration-200">
            <svg v-if="loading" class="inline mr-3 w-4 h-4 text-sky-500 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
            <span v-else>Submit</span>
          </button>
          <NuxtLink to="/login" class="block mt-2 px-4 py-2 text-white/60 hover:text-white text-base font-medium rounded-2xl w-full duration-200">
            Already have an account
          </NuxtLink>
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
