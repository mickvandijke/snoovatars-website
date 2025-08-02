<template>
  <div class="relative flex min-h-screen w-full max-w-full">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col w-full lg:ml-16 min-w-0 max-w-full">
      <HeaderTop :hide-items="scrolled >= 48" :class="{ 'sticky -top-[48px]': Capacitor.isNativePlatform(), 'lg:ml-0': true }" ref="barMarketInfo" />
      <AvatarViewer />
      <template v-if="!Capacitor.isNativePlatform()">
        <AdvertisementBanner class="" />
      </template>
      <div class="relative flex flex-col grow items-center w-full min-w-0" :class="{ 'page-mobile-padding-bottom': Capacitor.isNativePlatform() }">
        <NuxtPage/>
      </div>
      <template v-if="!Capacitor.isNativePlatform()">
        <FooterSmall/>
      </template>
    </div>
    
    <!-- Mobile Navigation -->
    <MobileNavigationBar />
    
    <!-- Modals and Overlays -->
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
  onBeforeMount, onBeforeUnmount, ref, updateMarketInfo,
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
import Sidebar from "~/components/Sidebar.vue";
import MobileNavigationBar from "~/components/MobileNavigationBar.vue";
import {Ref} from "@vue/reactivity";

useHead({
  title: 'RCAX | Reddit Collectible Avatars prices, statistics, sales and more!',
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
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

const barMarketInfo: Ref<HTMLElement | null> = ref(null);
const scrolled = ref(0);

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
  window.addEventListener('scroll', handleScroll);

  let tokenOpt = localStorage.getItem("Token");

  if (tokenOpt) {
    setToken(tokenOpt);
  }

  fetchCollections().then((collections) => {
    useCollections().value = collections;
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
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

function handleScroll() {
  // When the user scrolls, check the pageYOffset
  scrolled.value = window.pageYOffset;
}

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
  @apply bg-[#141415];
  -webkit-tap-highlight-color: transparent;
}

/* Prevent horizontal scroll on mobile without breaking sticky */
@media (max-width: 768px) {
  body {
    overflow-x: hidden;
    position: relative;
  }
}

select {
  @apply p-2 h-10 bg-secondary hover:bg-tertiary text-sm text-header capitalize placeholder-white/20 font-medium border-none focus:outline-none overflow-x-hidden rounded-2xl cursor-pointer;
}

input {
  @apply p-2 h-10 bg-transparent text-header placeholder-white/40 border border-white/10 hover:border-white/25 rounded-lg w-full duration-200 cursor-text;
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
  padding-bottom: calc(60px + 12px + env(safe-area-inset-bottom));
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
