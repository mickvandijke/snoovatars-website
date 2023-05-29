<template>
  <div class="relative flex flex-col items-center min-h-screen w-full" style="max-width: 100vw;">
    <NavigationBar/>
    <div class="relative flex flex-col grow items-center w-full" style="max-width: 100vw;">
      <NuxtPage/>
    </div>
    <Footer/>
    <MobileNavigationBar/>
    <template v-if="!cookies">
      <CookieWarning/>
    </template>
  </div>
</template>

<script setup lang="ts">
import {useHead} from "nuxt/app";
import {
  loadWatchList,
  onBeforeMount, ref,
  useCollections, useCookies,
  useUser,
  watch
} from "#imports";
import {
  loadCookiesPreference,
  loadExtraInfoOptions,
  loadPreferredCurrency,
  loadWalletAddresses,
  updateEthereumPrices, useFcmDeviceToken,
  useToken
} from "~/composables/states";
import {getUser, setToken} from "~/composables/api/user";
import {fetchCollections} from "~/composables/api/collection";
import Footer from "~/components/Footer.vue";
import { useState } from "vue-gtag-next";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";
import { Browser } from '@capacitor/browser';

useHead({
  title: 'RCA Real-Time Floor Prices, Sales and More! | RCAX.io',
  link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  meta: [
    { name: "title", content: "RCAX" },
    { name: 'description', content: 'Real-time data tracking and price alerts for the Reddit Collectible Avatars space!' },
    { name: 'keywords', content: 'Reddit, Collectible, Avatars, NFT, Floor, RCA, RedditCollectibleAvatars, RCAX, rcax, Polygon' },
    { name: 'robots', content: 'index, follow' },
    { 'http-equiv': "content-type", content: "text/html; charset=utf-8" },
    { name: "language", content: "English" },
    { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1"},
  ]
});

const token = useToken();
const user = useUser();
const cookies = useCookies();
const fcmDeviceToken = useFcmDeviceToken();
const { isEnabled } = useState();

loadCookiesPreference();
loadWalletAddresses();
loadWatchList();
loadPreferredCurrency();
loadExtraInfoOptions();
updateEthereumPrices();
addListeners();
registerNotifications();

if (cookies.value) {
  loadGoogleAnalytics();
}

onBeforeMount(async () => {
  let tokenOpt = localStorage.getItem("Token");

  if (tokenOpt) {
    setToken(tokenOpt);
  }

  fetchCollections().then((collections) => {
    useCollections().value = collections;
  });
});

watch([token], async () => {
  if (token.value) {
    getUser();
  } else if (user.value) {
    user.value = null;
  }
});

watch([cookies], () => {
  if (cookies.value) {
    loadGoogleAnalytics();
  }
});

function loadGoogleAnalytics() {
  isEnabled.value = true;
}

async function addListeners() {
  if (Capacitor.isNativePlatform()) {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
      fcmDeviceToken.value = token.value;
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
      console.log(JSON.stringify(notification));
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
      console.log(JSON.stringify(notification));

      if (notification.notification.data['link']) {
        let url = notification.notification.data['link'];

        if (Capacitor.isNativePlatform()) {
          // If running in a native Capacitor app
          Browser.open({ url });
        } else {
          // If running in a web browser
          window.open(url, '_blank');
        }
      }
    });
  }
}

async function registerNotifications() {
  if (Capacitor.isNativePlatform()) {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }
}

const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log('delivered notifications', notificationList);
}
</script>

<style>
html, body {
  @apply bg-neutral-900;
}

input, select {
  @apply p-2.5 bg-transparent text-neutral-100 placeholder-neutral-400 border-2 border-neutral-800 hover:border-neutral-700 rounded-2xl w-full duration-200 cursor-pointer;
}

input.light, select.light {
  @apply border-neutral-700 hover:border-neutral-600;
}
</style>
