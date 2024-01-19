<template>
  <div class="px-4 md:px-6 py-12 flex flex-col items-center gap-6 text-neutral-200 w-full sm:max-w-2xl">
    <h1 class="text-xl font-bold text-header duration-500">Reddit Identity <span class="italic text-amber-500">Lookup</span></h1>

    <div class="p-6 flex flex-col gap-6 w-full bg-secondary rounded-lg">
      <div class="flex flex-col items-center gap-2 w-full">
        <h2>Username to Address</h2>
        <input type="text" autocomplete="off" name=“username” class="" placeholder="Username (without u/)" v-model="usernameQuery" @keyup.enter.prevent="getAddressFromUsername()">
        <button :disabled="!usernameQuery || loading" class="px-4 h-10 bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-header text-sm disabled:text-white/20 font-medium whitespace-nowrap rounded-lg duration-200 w-full" @click="getAddressFromUsername()">Lookup</button>
      </div>
      <template v-if="foundAddress">
        <div class="flex flex-col items-center gap-2 w-full">
          <h2 class="text-green-500 text-sm">FOUND ADDRESS</h2>
          <input disabled :value="foundAddress" class="text-amber-500 text-center">
        </div>
      </template>
    </div>

    <div class="p-6 flex flex-col gap-6 w-full bg-secondary rounded-lg">
      <div class="flex flex-col items-center gap-2 w-full">
        <h2>Address to Username</h2>
        <input type="text" autocomplete="off" name=“address” class="" placeholder="0x.." v-model="addressQuery" @keyup.enter.prevent="getUsernameFromAddress()">
        <button :disabled="!addressQuery || loading" class="px-4 h-10 bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-header text-sm disabled:text-white/20 font-medium whitespace-nowrap rounded-lg duration-200 w-full" @click="getUsernameFromAddress()">Lookup</button>
      </div>
      <template v-if="foundUsername">
        <div class="flex flex-col items-center gap-2 w-full">
          <h2 class="text-green-500 text-sm">FOUND USERNAME</h2>
          <a :href="`https://reddit.com/u/${foundUsername}`" target="_blank" class="text-orange-600 text-center">{{ foundUsername }}</a>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "#imports";
import {clipboard, isValidEthereumAddress} from "~/global/utils";
import {getCryptoContactFromAddress, getCryptoContactFromId, getUserInfo} from "~/composables/api/reddit";
import {Ref} from "@vue/reactivity";

const usernameQuery: Ref<string | null> = ref(null);
const foundUsername: Ref<string | null> = ref(null);
const addressQuery: Ref<string | null> = ref(null);
const foundAddress: Ref<string | null> = ref(null);
const loading = ref(false);

async function getAddressFromUsername() {
  if (usernameQuery.value && !loading.value) {
    loading.value = true;

    try {
      let userInfo = await getUserInfo(usernameQuery.value);
      let userId = userInfo['data']['id'];
      let cryptoInfo = await getCryptoContactFromId(userId);
      foundAddress.value = cryptoInfo['contacts'][`t2_${userId}`][0]['address'];
      loading.value = false;
    } catch(err) {
      foundAddress.value = null;
      loading.value = false;
      alert(err);
    }
  }
}

async function getUsernameFromAddress() {
  if (addressQuery.value && !loading.value) {
    loading.value = true;

    try {
      let cryptoInfo = await getCryptoContactFromAddress(addressQuery.value);
      let userId = Object.keys(cryptoInfo['contacts'])[0];
      foundUsername.value = cryptoInfo['contacts'][userId][0]['username'];
      loading.value = false;
    } catch(err) {
      foundUsername.value = null;
      loading.value = false;
      alert(err);
    }
  }
}
</script>

<style scoped>
h1 {
  @apply font-bold;
}
</style>
