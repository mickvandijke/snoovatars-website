<template>
  <div class="px-4 md:px-6 py-12 flex flex-col gap-3 text-neutral-200 max-w-2xl">
    <h1>Delete Account</h1>

    <p>Please note that deleting your account is an irreversible process. Once your account is deleted, all associated data and information will be permanently removed.</p>

    <p>If you have any questions or encounter any issues during the account deletion process, please contact our support team at <a href="mailto:snoovatars@gmail.com">snoovatars@gmail.com</a>.</p>

    <div class="flex items-center gap-2 w-full">
      <input type="text" autocomplete="off" name=“usernameOrEmail” class="light" placeholder="Username or Email" v-model="usernameOrEmail" @keyup.enter.prevent="submitRequest">
      <button :disabled="!usernameOrEmail || loading" class="px-4 py-3 h-full bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-white disabled:text-white/20 font-medium whitespace-nowrap rounded-xl duration-200" @click="submitRequest">Submit</button>
    </div>

    <p>After submitting, you must click the confirmation link in the account's associated email.</p>
  </div>
</template>

<script setup lang="ts">
import {ref} from "#imports";
import {deleteUser} from "~/composables/api/user";

const usernameOrEmail = ref("");
const loading = ref(false);

function submitRequest() {
  if (loading.value) {
    return;
  }

  deleteUser(usernameOrEmail.value)
      .then(async (message) => {
        loading.value = false;
        alert(message);
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });
}
</script>

<style scoped>
h1 {
  @apply font-bold;
}
</style>
