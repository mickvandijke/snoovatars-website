<template>
  <div class="avatar-view px-4 py-4 sm:px-8 flex flex-col items-center gap-6 w-full">
    <div class="flex flex-col gap-6 items-center w-full max-w-md">
      <h1 class="text-xl font-bold text-header duration-500">Avatar <span class="italic text-amber-500">Exporter</span></h1>
      <div class="flex items-center gap-2 w-full">
        <input v-model="userSearch" placeholder="Reddit Username (without u/)" @keyup.enter.prevent="searchUser(userSearch)" />
        <button :disabled="!userSearch || pending || userSearch === user" class="px-4 h-10 flex items-center bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-header disabled:text-white/20 text-sm font-medium whitespace-nowrap rounded-lg duration-200" @click="searchUser(userSearch)">
          <template v-if="!pending">
            <span>Let's go!</span>
          </template>
          <template v-else>
            <IonSpinner class="w-5 h-5" />
          </template>
        </button>
      </div>
    </div>
    <template v-if="error">
      <div class="p-4 bg-red-500/20 rounded-2xl">
        <span class="text-white/80">{{ error }}</span>
      </div>
    </template>
    <div class="flex flex-col md:flex-row md:justify-center md:items-center gap-6 md:gap-12 w-full" :class="{ 'hidden': !avatar }">
      <div class="flex flex-col items-center md:w-3/4 max-w-3xl gap-3">
        <div class="sm:px-3 flex gap-2 md:items-start w-full">
          <SearchBar v-model:search-term="searchTerm" :placeholder="`Search by Name`" class="w-full" />
          <select v-model="filterGenOption" class="w-fit">
            <option value="all">Gen: All</option>
            <template v-for="gen in Object.keys(Filters)">
              <option :value="gen">{{ gen }}</option>
            </template>
          </select>
        </div>
        <VirtualContainerGrid :items="filteredAvatarBackgrounds" :buffer-mobile="12" :buffer-desktop="20" class="p-1.5 h-[16rem] sm:h-[28rem] md:h-[38rem] w-full border border-white/10 rounded-2xl">
          <template #default="{ item, index }">
            <BackgroundItem @click="setBackground(getBackgroundIndex(item))" :background="item" class="p-2 h-fit flex flex-col justify-center items-center bg-secondary text-header rounded-xl hover:bg-tertiary duration-200 cursor-pointer"/>
          </template>
        </VirtualContainerGrid>
      </div>
      <div class="flex flex-col gap-4 items-center md:w-1/4">
        <div class="flex justify-center">
          <div class="w-72 h-96 relative">
            <img
                class="w-full h-full absolute z-20"
                :src="selectedBackground.path"
                :alt="avatarAltText"
            >
            <img
                class="absolute z-30"
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
            <a :href="marketplaceLink(bgSeriesStats)" target="_blank" class="mb-2 py-2 px-3 max-w-full flex items-center gap-1.5 border border-white/10 hover:border-amber-500 rounded-lg duration-300">
              Buy <span class="text-header font-semibold truncate">{{ selectedBackground.name }}</span> on <img src="/images/branding/rcax/rcaxIcon.svg" class="w-5 h-5">
              <span class="text-sm text-details">({{ ethereumInLocalCurrency(getLowestListingAsGweiPrice(bgSeriesStats)) }})</span>
            </a>
          </template>
          <label>Avatar Size</label>
          <select v-model="avatarSize" @change="drawAvatar">
            <option v-for="size in AvatarSize" :value="size">{{ size }}</option>
          </select>
          <label class="mt-2">Avatar Position</label>
          <select v-model="avatarPosition" @change="drawAvatar">
            <option v-for="position in AvatarPosition" :value="position">{{ position }}</option>
          </select>
          <button :disabled="savingImage || pending" class="mt-4 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-header font-medium rounded-xl duration-200" @click="saveImage">Download</button>
        </div>
        <img ref="background" crossorigin="anonymous" class="hidden" :src="`${selectedBackground.path}?not-from-cache-please`" alt="background">
        <img ref="foreground" crossorigin="anonymous" class="hidden" :src="`${avatar}?not-from-cache-please`" alt="foreground">
        <canvas ref="canvas" width="552" height="736" class="hidden"></canvas>
      </div>
    </div>
    <template v-if="!avatar">
      <div class="w-72 h-96">
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
  return `https://www.reddit.com/user/${user.value}/about.json`;
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
      .then(async (data) => {
        data = await data.json();

        if (data['data'] && data['data']['snoovatar_img']) {
          avatar.value = data['data']['snoovatar_img'];
        } else {
          avatar.value = "";
          error.value = `Could not find user: ${user.value}`;
        }

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
.avatar-view .searchbar {
  @apply h-10;
}

.avatar-view img.normal {
  bottom: 10%;
  transform: translate(-50%, 0%);
}

.avatar-view img.centered {
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar-view select {
  @apply w-full;
}

.avatar-view input {
  @apply p-2 h-10 bg-transparent text-header placeholder-white/40 border border-white/10 hover:border-neutral-600 rounded-lg w-full duration-200 cursor-pointer;
}
</style>
