<template>
  <div class="avatar-view pb-3 md:pb-0 relative flex flex-col items-center w-full">
    <MenuBar class="mb-3">
      <SearchBar v-model:search-term="userSearch" placeholder="Reddit Username (without u/)"></SearchBar>
      <button :disabled="!userSearch || pending || userSearch === user" class="px-4 h-10 flex items-center bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700/50 disabled:text-zinc-400 text-white text-sm font-medium whitespace-nowrap rounded-lg transition-all duration-200" @click="searchUser(userSearch)">
        <template v-if="!pending">
          <span>Let's go!</span>
        </template>
        <template v-else>
          <IonSpinner class="w-5 h-5" />
        </template>
      </button>
    </MenuBar>
    <template v-if="error">
      <div class="mx-6 mt-6 p-4 bg-gradient-to-br from-red-500/10 to-red-600/20 border border-red-500/30 rounded-2xl backdrop-blur-sm">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          <span class="text-red-300 font-medium">{{ error }}</span>
        </div>
      </div>
    </template>
    <div class="px-6 pt-6 flex flex-col md:flex-row md:justify-center md:items-center gap-6 md:gap-12 w-full" :class="{ 'hidden': !avatar }">
      <div class="flex flex-col items-center md:w-3/4 gap-3">
        <div class="flex gap-2 md:items-start w-full">
          <SearchBar v-model:search-term="searchTerm" :placeholder="`Search by Name`" />
          <select v-model="filterGenOption" class="px-3 py-2 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 text-sm text-zinc-400 hover:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 rounded-lg transition-all duration-200 cursor-pointer w-fit">
            <option value="all">Gen: All</option>
            <template v-for="gen in Object.keys(Filters)">
              <option :value="gen">{{ gen }}</option>
            </template>
          </select>
        </div>
        <VirtualContainerGrid :items="filteredAvatarBackgrounds" :buffer-mobile="12" :buffer-desktop="20" class="p-1.5 h-[16rem] sm:h-[28rem] md:h-[42rem] w-full border border-white/5 rounded-2xl">
          <template #default="{ item, index }">
            <BackgroundItem @click="setBackground(getBackgroundIndex(item))" :background="item" class="p-2 h-fit flex flex-col justify-center items-center bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 text-zinc-400 hover:text-white rounded-lg transition-all duration-200 cursor-pointer"/>
          </template>
        </VirtualContainerGrid>
      </div>
      <div class="flex flex-col gap-4 items-center md:w-1/4">
        <div class="flex justify-center">
          <div class="w-72 h-96 relative">
            <img
                class="w-full h-full absolute z-10"
                :src="selectedBackground.path"
                :alt="avatarAltText"
            >
            <img
                class="absolute z-20"
                :class="{ 'w-36': avatarSize === 'small', 'w-48': avatarSize === AvatarSize.Normal, 'w-60': avatarSize === 'large', 'centered': avatarPosition === AvatarPosition.Centered, 'normal': avatarPosition === AvatarPosition.Normal }"
                style="left: 50%;"
                :src="avatar"
                :alt="avatarAltText"
            >
            <div class="absolute top-0 z-10">
              <img :src="selectedBackground.path" class="blur-2xl opacity-40">
            </div>
          </div>
        </div>
        <div class="mt-2 flex flex-col items-center gap-2 text-white/80 w-full max-w-xs">
          <template v-if="!Capacitor.isNativePlatform() && bgSeriesStats">
            <a :href="marketplaceLink(bgSeriesStats)" target="_blank" class="mb-2 px-4 py-3 bg-[#2081E2] hover:bg-[#1868B7] border border-[#2081E2] hover:border-[#1868B7] rounded-xl transition-all duration-200 w-full">
              <div class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4" viewBox="0 0 90 90" fill="none">
                  <path d="M45 0C20.151 0 0 20.151 0 45C0 69.849 20.151 90 45 90C69.849 90 90 69.849 90 45C90 20.151 69.858 0 45 0ZM22.203 46.512L22.392 46.206L34.101 27.891C34.272 27.63 34.677 27.657 34.803 27.945C36.756 32.328 38.448 37.782 37.656 41.175C37.323 42.57 36.396 44.46 35.352 46.206C35.217 46.458 35.073 46.71 34.911 46.953C34.839 47.061 34.713 47.124 34.578 47.124H22.545C22.221 47.124 22.032 46.773 22.203 46.512ZM74.376 52.812C74.376 52.983 74.277 53.127 74.133 53.19C73.224 53.577 70.119 55.008 68.832 56.799C65.538 61.38 63.027 67.932 57.402 67.932H33.948C25.632 67.932 18.9 61.173 18.9 52.83V52.56C18.9 52.344 19.08 52.164 19.305 52.164H32.373C32.634 52.164 32.823 52.398 32.805 52.659C32.706 53.505 32.878 54.378 33.273 55.17C34.047 56.745 35.658 57.726 37.395 57.726H43.866V52.677H37.467C37.143 52.677 36.945 52.299 37.134 52.029C37.206 51.921 37.278 51.813 37.368 51.687C37.971 50.823 38.835 49.491 39.699 47.97C40.284 46.944 40.851 45.846 41.31 44.748C41.4 44.55 41.472 44.343 41.553 44.145C41.679 43.794 41.805 43.461 41.895 43.137C41.985 42.858 42.066 42.57 42.138 42.3C42.354 41.364 42.444 40.374 42.444 39.348C42.444 38.943 42.426 38.52 42.39 38.124C42.372 37.683 42.318 37.242 42.264 36.801C42.228 36.414 42.156 36.027 42.084 35.631C41.985 35.046 41.859 34.461 41.715 33.876L41.661 33.651C41.553 33.246 41.454 32.868 41.328 32.463C40.959 31.203 40.545 29.97 40.095 28.818C39.933 28.359 39.753 27.918 39.564 27.486C39.294 26.82 39.015 26.217 38.763 25.650C38.628 25.389 38.52 25.155 38.412 24.912C38.286 24.642 38.16 24.372 38.025 24.111C37.935 23.913 37.827 23.724 37.755 23.544L36.963 22.086C36.855 21.888 37.035 21.645 37.251 21.708L42.201 23.049H42.219C42.228 23.049 42.228 23.049 42.237 23.049L42.885 23.238L43.605 23.436L43.866 23.508V20.574C43.866 19.152 45 18 46.413 18C47.115 18 47.754 18.288 48.204 18.756C48.663 19.224 48.951 19.863 48.951 20.574V24.939L49.482 25.083C49.518 25.101 49.563 25.119 49.599 25.146C49.725 25.236 49.914 25.38 50.148 25.56C50.337 25.704 50.535 25.884 50.769 26.073C51.246 26.46 51.822 26.955 52.443 27.522C52.605 27.666 52.767 27.81 52.92 27.963C53.721 28.710 54.621 29.583 55.485 30.555C55.728 30.834 55.962 31.104 56.205 31.401C56.439 31.698 56.7 31.986 56.916 32.274C57.213 32.661 57.519 33.066 57.798 33.489C57.924 33.687 58.077 33.894 58.194 34.092C58.554 34.623 58.86 35.172 59.157 35.721C59.283 35.973 59.409 36.252 59.517 36.522C59.85 37.26 60.111 38.007 60.273 38.763C60.327 38.925 60.363 39.096 60.381 39.258V39.294C60.435 39.51 60.453 39.744 60.471 39.987C60.543 40.752 60.507 41.526 60.345 42.3C60.273 42.624 60.183 42.93 60.075 43.263C59.958 43.578 59.85 43.902 59.706 44.217C59.427 44.856 59.103 45.504 58.716 46.098C58.59 46.323 58.437 46.557 58.293 46.782C58.131 47.016 57.96 47.241 57.816 47.457C57.609 47.736 57.393 48.024 57.168 48.285C56.97 48.555 56.772 48.825 56.547 49.068C56.241 49.437 55.944 49.779 55.629 50.112C55.449 50.328 55.251 50.553 55.044 50.751C54.846 50.976 54.639 51.174 54.459 51.354C54.144 51.669 53.892 51.903 53.676 52.11L53.163 52.569C53.091 52.641 52.992 52.677 52.893 52.677H48.951V57.726H53.91C55.017 57.726 56.07 57.339 56.925 56.61C57.213 56.358 58.482 55.26 59.985 53.604C60.039 53.541 60.102 53.505 60.174 53.487L73.863 49.527C74.124 49.455 74.376 49.644 74.376 49.914V52.812V52.812Z" fill="white"/>
                </svg>
                <span class="text-white font-medium text-sm truncate">{{ selectedBackground.name }}</span>
                <span v-if="getLowestListingAsGweiPrice(bgSeriesStats) > 0" class="text-white text-sm font-normal">{{ ethereumInLocalCurrency(getLowestListingAsGweiPrice(bgSeriesStats)) }}</span>
              </div>
            </a>
          </template>
          <label>Avatar Size</label>
          <select v-model="avatarSize" @change="drawAvatar" class="w-full px-3 py-2 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 text-sm text-zinc-400 hover:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 rounded-lg transition-all duration-200 cursor-pointer">
            <option v-for="size in AvatarSize" :value="size">{{ size }}</option>
          </select>
          <label class="mt-2">Avatar Position</label>
          <select v-model="avatarPosition" @change="drawAvatar" class="w-full px-3 py-2 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 text-sm text-zinc-400 hover:text-white font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 rounded-lg transition-all duration-200 cursor-pointer">
            <option v-for="position in AvatarPosition" :value="position">{{ position }}</option>
          </select>
          <button :disabled="savingImage || pending" class="mt-4 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-400 text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 flex items-center justify-center gap-2 w-full" @click="saveImage">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span class="text-sm">Download Image</span>
          </button>
        </div>
        <img ref="background" crossorigin="anonymous" class="hidden" :src="`${selectedBackground.path}?not-from-cache-please`" alt="background">
        <img ref="foreground" crossorigin="anonymous" class="hidden" :src="`${avatar}?not-from-cache-please`" alt="foreground">
        <canvas ref="canvas" width="552" height="736" class="hidden"></canvas>
      </div>
    </div>
    <template v-if="!avatar">
      <div class="mt-8 w-72 h-96">
        <img
            class="w-full h-full"
            :src="exampleImage"
            alt="u/WarmBiertje's avatar"
        >
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {navigateTo, useRoute, useRouter} from "nuxt/app";
import {ComputedRef, onMounted, Ref, ref, watch} from 'vue';
import {AvatarBackground} from "~/types/avatarBackgrounds";
import {updateSeriesHashed, updateSeriesStats, useSeriesHashed, useSettings} from "~/composables/states";
import { Capacitor } from "@capacitor/core";
import { Media, MediaSaveOptions } from "@capacitor-community/media";
import {Filters} from "~/global/generations";
import {computed, onBeforeMount} from "#imports";
import {IonSpinner} from "@ionic/vue";
import {marketplaceLink} from "~/global/marketplace";
import {getSeriesStats} from "~/composables/states";
import {SeriesStats} from "~/types/seriesStats";
import {ethereumInLocalCurrency} from "#imports";
import {getLowestListingAsGweiPrice} from "#imports";
import BackgroundItem from "~/components/pages/avatar/user/BackgroundItem.vue";

enum AvatarSize {
  Normal = "normal",
  Small = "small",
  Large = "large"
}

enum AvatarPosition {
  Normal = "normal",
  Centered = "centered"
}

const exampleImages = [
  '/images/examples/1.png',
  '/images/examples/2.png',
  '/images/examples/3.png',
  '/images/examples/4.png',
  '/images/examples/5.png',
  '/images/examples/6.png',
  '/images/examples/7.png',
  '/images/examples/8.png',
  '/images/examples/9.png',
  '/images/examples/10.png',
  '/images/examples/11.png',
  '/images/examples/12.png',
  '/images/examples/13.png',
  '/images/examples/14.png',
  '/images/examples/15.png',
  '/images/examples/16.png',
  '/images/examples/17.png',
];

const router = useRouter();
const route = useRoute();
const series = useSeriesHashed();
const settings = useSettings();

const exampleImage = exampleImages[Math.floor(Math.random() * exampleImages.length)];
const userSearch = ref(route.params.user ?? "");
const user = ref(route.params.user ?? "");
const avatar = ref("");
const queryBackgroundIndex: Ref<number> = ref(route.query.background ? parseInt(route.query.background as string) : -1);
const randomBackgroundIndex: Ref<number> = ref(0);
const searchTerm = ref<string>("");
const filterGenOption = ref("all")
const avatarSize: Ref<AvatarSize> = ref(AvatarSize.Normal);
const avatarPosition: Ref<AvatarPosition> = ref(AvatarPosition.Normal);
const savingImage = ref(false);
const avatarIntrinsicWidth = ref(380);
const avatarIntrinsicHeight = ref(498);
const background = ref(null);
const foreground = ref(null);
const canvas = ref(null);
const pending = ref(false);
const error = ref("");

const bgSeriesStats: ComputedRef<SeriesStats | null> = computed(() => {
  if (!selectedBackground.value?.contractAddress) {
    return null;
  }

  return getSeriesStats(selectedBackground.value.contractAddress, selectedBackground.value.name);
});

const filteredAvatarBackgrounds: ComputedRef<AvatarBackground[]> = computed(() => {
  let backgrounds = avatarBackgrounds.value;

  if (filterGenOption.value && filterGenOption.value != "all") {
    backgrounds = backgrounds.filter((entry) => Filters[filterGenOption.value].collections.includes(entry.contractAddress));
  }

  if (searchTerm.value.trim() !== "") {
    backgrounds = backgrounds.filter((entry) => entry.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
  }

  return backgrounds;
});

const avatarBackgrounds: ComputedRef<AvatarBackground[]> = computed(() => {
  let avatarBackgrounds: Array<AvatarBackground> = [
    new AvatarBackground("Transparent", "/images/others/Transparent.png", ""),
    new AvatarBackground("Black", "/images/others/Black.png", ""),
  ]

  for (let entry of useSeriesHashed().value.values()) {
    avatarBackgrounds.push(new AvatarBackground(entry.name, entry.background_image, entry.contract_address));
  }

  return avatarBackgrounds;
});

const selectedBackgroundIndex: ComputedRef<number> = computed(() => {
  if (queryBackgroundIndex.value >= 0 && queryBackgroundIndex.value <= avatarBackgrounds.value.length) {
    return queryBackgroundIndex.value;
  } else {
    return randomBackgroundIndex;
  }
});

const selectedBackground: ComputedRef<AvatarBackground> = computed(() => {
  return avatarBackgrounds.value[selectedBackgroundIndex.value] ?? avatarBackgrounds.value[0];
});

const apiRoute = computed(() => {
  return `https://corsproxy.io/?${encodeURIComponent(`https://www.reddit.com/user/${user.value}/about.json`)}`;
});

watch([queryBackgroundIndex, avatarSize, avatarPosition, series, user], () => {
  let background = queryBackgroundIndex.value >= 0 ? queryBackgroundIndex.value : randomBackgroundIndex.value;

  router.push({
    params: { user: user.value },
    query: {
      background: background,
      size: avatarSize.value,
      position: avatarPosition.value },
  });
});

watch([avatar], () => {
  if (avatar.value) {
    initImage();
  }
});

onBeforeMount(() => {
  updateSeriesHashed();
  updateSeriesStats();
});

onMounted(async () => {
  randomBackgroundIndex.value = Math.floor(Math.random() * avatarBackgrounds.value.length);

  if (!user.value && settings.value.exporter.avatar.lastUsername) {
    user.value = settings.value.exporter.avatar.lastUsername;
  }

  if (user.value) {
    await fetchUserImage();
  }
});

function initImage() {
  background.value.onload = () => {
    drawAvatar();
  }

  foreground.value.onload = () => {
    avatarIntrinsicWidth.value = foreground.value.width;
    avatarIntrinsicHeight.value = foreground.value.height;
    drawAvatar();
  }
}

function getBackgroundIndex(background: AvatarBackground): number {
  let index = 0;

  avatarBackgrounds.value.forEach((entry, i) => {
    if (entry.name == background.name && entry.contractAddress == background.contractAddress) {
      index = i;
    }
  });

  return index;
}

async function searchUser(username: string) {
  if (username) {
    settings.value.exporter.avatar.lastUsername = username;
    user.value = username;

    await fetchUserImage();
  }
}

async function fetchUserImage() {
  pending.value = true;
  error.value = "";

  await fetch(apiRoute.value)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();

        if (data['data'] && data['data']['snoovatar_img']) {
          avatar.value = data['data']['snoovatar_img'];
        } else {
          avatar.value = "";
          error.value = `Could not find user: ${user.value}`;
        }
      })
      .catch((err) => {
        avatar.value = "";
        error.value = `Could not find user: ${user.value}`;
      })
      .finally(() => {
        pending.value = false;
      });
}

switch(route.query.size) {
  case AvatarSize.Small:
    avatarSize.value = AvatarSize.Small;
    break;
  case AvatarSize.Large:
    avatarSize.value = AvatarSize.Large;
    break;
  default:
    avatarSize.value = AvatarSize.Normal;
}

switch(route.query.position) {
  case AvatarPosition.Centered:
    avatarPosition.value = AvatarPosition.Centered;
    break;
  default:
    avatarPosition.value = AvatarPosition.Normal;
}

function setBackground(index: number) {
  queryBackgroundIndex.value = index;
}

function getCanvasAvatarWidth() {
  switch (avatarSize.value) {
    case AvatarSize.Normal: {
      return avatarIntrinsicWidth.value;
    }
    case AvatarSize.Small: {
      return avatarIntrinsicWidth.value * 0.75;
    }
    case AvatarSize.Large: {
      return avatarIntrinsicWidth.value * 1.25;
    }
  }
}

function getCanvasAvatarHeight() {
  switch (avatarSize.value) {
    case AvatarSize.Normal: {
      return avatarIntrinsicHeight.value;
    }
    case AvatarSize.Small: {
      return avatarIntrinsicHeight.value * 0.75;
    }
    case AvatarSize.Large: {
      return avatarIntrinsicHeight.value * 1.25;
    }
  }
}

function getAvatarPositionTop(canvasHeight, avatarHeight) {
  switch (avatarPosition.value) {
    case AvatarPosition.Normal: {
      return canvasHeight - avatarHeight - 75;
    }
    case AvatarPosition.Centered: {
      return (canvasHeight / 2 - avatarHeight / 2)
    }
  }
}

function drawAvatar() {
  const context = canvas.value.getContext('2d');

  context.clearRect(0, 0, canvas.value.width, canvas.value.height);

  context.globalAlpha = 1.0;
  context.drawImage(background.value, 0, 0);

  const avatarWidth = getCanvasAvatarWidth();
  const avatarHeight = getCanvasAvatarHeight();

  const top = getAvatarPositionTop(canvas.value.height, avatarHeight);
  const left = canvas.value.width / 2 - avatarWidth / 2;

  context.drawImage(foreground.value, left, top, avatarWidth, avatarHeight);
}

function avatarAltText() {
  return `${user.value}'s avatar`;
}

async function saveImage() {
  if (savingImage.value) {
    return;
  }

  savingImage.value = true;

  const fileName = `${user.value}.png`;

  if (Capacitor.isNativePlatform()) {
    try {
      const albumName = "RCAX";
      const { albums } = await Media.getAlbums();

      let album = albums.find(a => a.name === albumName);

      if (!album) {
        await Media.createAlbum({ name: albumName });
        album = albums.find(a => a.name === albumName);
      }

      const dataUrl = canvas.value.toDataURL();

      let opts: MediaSaveOptions = { path: dataUrl, albumIdentifier: album.identifier };
      let savedFile = await Media.savePhoto(opts);

      alert("Mashup saved to gallery!");

      // console.log(JSON.stringify(savedFile));
      //
      // // Get the file URL
      // const fileUrl = savedFile.filePath;
      //
      // // Prepare the options for sharing
      // const shareOptions: ShareOptions = {
      //   title: 'Share your mashup',
      //   text: 'Share your mashup with friends!',
      //   url: `file://${fileUrl}`,
      //   dialogTitle: 'Share your mashup'
      // };
      //
      // // Open the sharing dialog
      // await Share.share(shareOptions);

    } catch (error) {
      console.error('Error saving or sharing image:', error);
    }
  } else {
    let link = document.createElement("a");
    link.download = fileName;
    link.href = canvas.value.toDataURL("image/png").replace("image/png", "image/octet-stream");

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }

  savingImage.value = false;
}

async function savePermissions() {
  if (Capacitor.isNativePlatform()) {
    let permStatus = await Filesystem.checkPermissions();

    if (permStatus.publicStorage === 'prompt') {
      permStatus = await Filesystem.requestPermissions();
    }

    if (permStatus.publicStorage !== 'granted') {
      throw new Error('User denied permissions!');
    }
  }
}
</script>

<style>
.avatar-view img.normal {
  bottom: 10%;
  transform: translate(-50%, 0%);
}

.avatar-view img.centered {
  top: 50%;
  transform: translate(-50%, -50%);
}

/* Modern input and select styling now applied inline */
</style>
