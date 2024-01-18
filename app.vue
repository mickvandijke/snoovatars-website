<template>
  <div class="relative flex flex-col items-center min-h-screen w-full" style="max-width: 100vw;">
    <template v-if="Capacitor.isNativePlatform()">
      <div class="sticky top-0 bg-primary/80 backdrop-blur-2xl w-full max-w-full z-50">
        <HeaderTop />
        <NavigationBar ref="navbarcomp"/>
      </div>
    </template>
    <template v-else>
      <HeaderTop />
      <NavigationBar class="sticky top-0 bg-primary/80 backdrop-blur-2xl" ref="navbarcomp"/>
    </template>
    <AvatarViewer />
    <template v-if="!Capacitor.isNativePlatform()">
      <AdvertisementBanner class="" />
    </template>
    <div class="relative flex flex-col grow items-center w-full" style="max-width: 100vw;" :class="{ 'page-mobile-padding-bottom': Capacitor.isNativePlatform() }">
      <NuxtPage/>
    </div>
    <template v-if="!Capacitor.isNativePlatform()">
      <FooterSmall/>
    </template>
    <MobileNavigationBar/>
    <template v-if="!Capacitor.isNativePlatform() && !settings.cookies.accepted">
      <CookieWarning/>
    </template>
    <template v-if="prompter">
      <Prompt />
    </template>
  </div>
</template>

<script setup lang="ts">
import {useHead} from "nuxt/app";
import {
  loadWatchList,
  onBeforeMount, ref, updateMarketInfo,
  useCollections, useRouter,
  useUser,
  watch
} from "#imports";
import {
  loadSettings,
  loadWalletAddresses,
  saveSettings,
  updateEthereumPrices, useFcmDeviceToken, usePrompt,
  useSettings,
  useToken
} from "~/composables/states";
import {getUser, setToken} from "~/composables/api/user";
import {fetchCollections} from "~/composables/api/collection";
import Footer from "~/components/Footer.vue";
import { useState } from "vue-gtag-next";
import {PushNotifications, PushNotificationSchema, ActionPerformed} from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";
import { Browser } from '@capacitor/browser';
import {LocalNotifications} from "@capacitor/local-notifications";
import {registerFcmDeviceToken} from "~/composables/api/fcm";
import Prompt from "~/components/Prompt.vue";
import {computed} from "vue";
import HeaderTop from "~/components/HeaderTop.vue";
import FooterSmall from "~/components/FooterSmall.vue";

useHead({
  title: 'RCAX.io | Reddit Collectible Avatars prices, statistics, sales and more! | RCAX.io',
  link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  meta: [
    { name: "title", content: "RCAX" },
    { name: 'description', content: 'Reddit Collectible Avatars prices, statistics, sales and more!' },
    { name: 'keywords', content: 'Reddit, Collectible, Avatars, NFT, Floor, RCA, RedditCollectibleAvatars, RCAX, rcax, Polygon' },
    { name: 'robots', content: 'index, follow' },
    { 'http-equiv': "content-type", content: "text/html; charset=utf-8" },
    { name: "language", content: "English" },
    { name: "viewport", content: "viewport-fit=cover, width=device-width, initial-scale=1, maximum-scale=1"},
    { name: "apple-itunes-app", content: "app-id=6449831133" },
    { "http-equiv": "x-ua-compatible", content: "IE=edge" }
  ],
  htmlAttrs: {
    class: Capacitor.isNativePlatform() ? "scrollbar-hide" : ""
  }
});

const token = useToken();
const user = useUser();
const fcmDeviceToken = useFcmDeviceToken();
const { isEnabled } = useState();
const router = useRouter();
const prompter = usePrompt();
const settings = useSettings();

const navbarcomp = ref<HTMLInputElement | null>(null);

loadSettings();
loadWalletAddresses();
loadWatchList();
updateEthereumPrices();
addListeners();
registerNotifications();

if (settings.value.cookies?.accepted ?? false) {
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

watch([settings], () => {
  saveSettings();

  if (settings.value.cookies?.accepted ?? false) {
    loadGoogleAnalytics();
  }
}, { deep: true });

watch([token], async () => {
  if (token.value) {
    getUser();
  } else if (user.value) {
    user.value = null;
  }
});

router.afterEach(() => {
  updateEthereumPrices();
  updateMarketInfo();
  if (token.value) {
    getUser();
  }
});

function loadGoogleAnalytics() {
  if (!Capacitor.isNativePlatform()) {
    isEnabled.value = true;
  }
}

async function addListeners() {
  if (Capacitor.isNativePlatform()) {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
      fcmDeviceToken.value = token.value;

      if (user.value.username) {
        registerFcmDeviceToken(fcmDeviceToken.value);
      }
    });

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener(
        'pushNotificationReceived',
        async (notification: PushNotificationSchema) => {
          //only for android foreground push notification
          //since capacitor has still not implemented tap on android //foreground notif
          if (Capacitor.getPlatform() == "android") {
            await PushNotifications.getDeliveredNotifications().then((x) => {
              PushNotifications.removeDeliveredNotifications(x);
            });

            addLocalNotification(notification);
          }
        },
    );

    await PushNotifications.addListener('pushNotificationActionPerformed', payload => {
      if (payload.actionId === 'tap') {
        const link = payload.notification.data['link'];

        if (link) {
          handleNotificationLink(link);
        }
      }
    });

    await LocalNotifications.addListener(
        'localNotificationActionPerformed',
        (payload: ActionPerformed) => {
          if (payload.actionId === 'tap') {
            const link = payload.notification.extra['link'];

            if (link) {
              handleNotificationLink(link);
            }
          }
        },
    );
  }
}

function addLocalNotification(notification: any) {
  LocalNotifications.schedule({
    notifications: [
      {
        id: 1,
        title: notification.title,
        body: notification.body,
        schedule: { at: new Date(Date.now() + 100) },
        extra: notification.data,
        smallIcon: "ic_stat_notification_icon",
        iconColor: "#f59e0b"
      },
    ],
  });
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

function handleNotificationLink(link: string) {
  let url = link;

  if (Capacitor.isNativePlatform()) {
    // If running in a native Capacitor app
    Browser.open({ url });
  } else {
    // If running in a web browser
    window.open(url, '_blank');
  }
}

const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
}
</script>

<style>
:focus {
  outline: none !important;
}

html, body {
  @apply bg-primary;
  -webkit-tap-highlight-color: transparent;
}

select {
  @apply p-2 h-10 bg-primary-accent hover:bg-primary-accent-hover text-sm text-white capitalize placeholder-white/20 font-medium border-none focus:outline-none overflow-x-hidden rounded-lg cursor-pointer;
}

input {
  @apply p-2 h-10 bg-transparent text-white placeholder-white/40 border border-primary-border hover:border-white/25 rounded-lg w-full duration-200 cursor-text;
}

input.light, select.light {
  @apply border-neutral-800 hover:border-neutral-700;
}

input.lighter, select.lighter {
  @apply border-neutral-700 hover:border-neutral-600;
}

.page-mobile-margin-top {
  margin-top: env(safe-area-inset-top);
}

.page-mobile-padding-top {
  padding-top: env(safe-area-inset-top);
}

.page-mobile-padding-bottom {
  padding-bottom: calc(54px + env(safe-area-inset-bottom));
}

/* For Webkit-based browsers (Chrome, Safari and Opera) */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* For IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
