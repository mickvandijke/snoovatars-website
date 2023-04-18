<template>
  <div class="mt-12 flex flex-col items-center w-full max-w-xl">
    <div class="mx-auto p-5 w-96 max-w-full border-2 border-neutral-700 shadow-lg rounded-2xl bg-neutral-800">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-medium text-white">Forgot</h3>
        <div class="mt-2 px-4 py-3 max-h-xs overflow-y-auto">
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-neutral-400 text-left">Email</label>
            <input type="text" required v-model="email" id="username" class="light">
          </div>
        </div>
        <div class="items-center px-4 py-3">
          <button :disabled="!isFormValid() || loading" @click="login" class="px-4 h-10 flex justify-center items-center bg-sky-500 disabled:bg-gray-500 text-white text-base font-medium rounded-2xl w-full hover:bg-sky-600 disabled:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300 duration-200">
            <svg v-if="loading" class="inline mr-3 w-4 h-4 text-sky-500 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
            <span v-else>Send password reset link</span>
          </button>
          <NuxtLink to="/login" class="block mt-2 px-4 py-2 text-white text-base font-medium rounded-2xl w-full duration-200">
            Sign in
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "#imports";
import {Ref} from "@vue/reactivity";

const loading: Ref<boolean> = ref(false);
const email: Ref<string> = ref(null);

function isFormValid(): boolean {
  return !!email.value
}
</script>

<style scoped>

</style>
