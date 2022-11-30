<template>
  <div class="mt-12 flex flex-col items-center w-full max-w-xl">
    <div class="flex flex-col items-center w-full">
      <template v-if="!user">
        <h1 class="text-2xl font-semibold text-white">Please sign in before upgrading to PREMIUM!</h1>
      </template>
      <template v-else-if="user.tier === 0">
        <h1 class="text-2xl font-semibold text-white">Upgrade to a lifetime of PREMIUM!</h1>
        <p class="mt-6 text-white text-center">With snoovatars PREMIUM, you will enjoy all the premium features on our platform. This includes higher limits for price alerts and all the premium features we will release in the future. THANK YOU for supporting us!</p>
        <p class="mt-6 font-semibold text-amber-600 text-center">20% of all PREMIUM sales will be donated to the r/AvatarTrading community wallet.</p>
        <div class="mt-12 w-full">
          <h3 class="font-semibold text-neutral-400">Step 1. Buy a PREMIUM upgrade using Coinbase Commerce. Make sure to save your order code! The order code looks like "AAAAAAAA".</h3>
          <NuxtLink
              target="_blank"
              to="https://commerce.coinbase.com/checkout/c83f3cd4-adcf-4d3e-9349-3c1892f94472"
              class="mt-6 inline-flex p-4 bg-blue-700 hover:bg-blue-600 font-semibold text-white rounded-2xl duration-200"
          >Pay with Coinbase Commerce</NuxtLink>
        </div>
        <div class="mt-12 flex flex-col w-full">
          <h3 class="font-semibold text-neutral-400">Step 2. Redeem your PREMIUM upgrade by filling in your order code.</h3>
          <div class="mt-6 flex flex-row gap-2 w-full">
            <input v-model="orderId" type="text">
            <button @click="redeem" :disabled="!orderId" class="p-4 bg-amber-600 hover:bg-amber-500 font-semibold text-white rounded-2xl duration-200">
              <svg v-if="loading" class="inline w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
              </svg>
              <span v-else>Redeem</span>
            </button>
          </div>
        </div>
      </template>
      <template v-else-if="user.tier > 0">
        <h1 class="text-2xl font-semibold text-white">Thank you for upgrading to PREMIUM! &lt;3</h1>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {redeemOrder} from "~/composables/api/redeem";
import {onMounted, ref, useToken, useUser} from "#imports";
import {Ref} from "@vue/reactivity";
import {getUser} from "~/composables/api/user";
import {navigateTo} from "#app";

const token = useToken();
const user = useUser();

const loading = ref(false);
const orderId: Ref<string> = ref(null);

onMounted(async () => {
  if (!token.value) {
    await navigateTo("/login", {replace: true});
  }
})

function redeem() {
  if (!orderId.value) return;

  loading.value = true;

  redeemOrder(orderId.value)
      .then(() => {
        loading.value = false;
        getUser();
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      })
}
</script>

<style scoped>

</style>
