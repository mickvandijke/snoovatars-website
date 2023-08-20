<template>
  <div class="px-4 md:px-6 py-12 flex flex-col gap-3 text-neutral-200 max-w-2xl">
    <h1 class="text-2xl">Sponsor RCAX's Development</h1>

    <p>You can sponsor RCAX by renting a advertisement banner. Prices start from $5 a day.</p>

    <p class="italic">$5 a day if you want your banner to be one of the maximum 5 advertisement banners. This will mean that your banner will alternate with other advertisement banners.</p>

    <p class="italic">$20 a day if you want your banner to be the only advertisement banner.</p>

    <p>The minimum amount is 30 days. The advertisement banners will only show up on the RCAX website. They will NOT be shown on the app. Users may dismiss the advertisement banners for the duration of their session.</p>

    <p>If you are interested, please contact <a href="mailto:snoovatars@gmail.com" class="text-amber-500">snoovatars@gmail.com</a>.</p>

    <h1 class="mt-6 text-xl">Donations</h1>

    <p>If you want to sponsor RCAX's development anonymously, you can do so by sending something to:</p>

    <p>ETH: <span class="font-bold">0xB0753614730408d91Ccc46c1f4210efF0bee648B</span></p>

    <p>BTC: <span class="font-bold">bc1qpztwrlapl330gn74uqn3p03egekdpxcvkv7vtk</span></p>

    <p class="italic">Thank you !!! :D</p>
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
