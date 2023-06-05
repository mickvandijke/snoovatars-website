<template>
  <div class="px-4 py-6 sm:py-12 flex flex-col items-center gap-6 w-full">
    <div class="flex items-center gap-3">
      <NuxtLink to="/avatar/exporter" class="px-4 py-2 flex gap-1 items-center bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-md duration-200"><ChevronLeftIcon class="w-4"/>Back</NuxtLink>
      <h2 class="px-4 py-2 bg-neutral-800 text-white rounded-md">u/{{ user }}</h2>
    </div>
    <div class="flex flex-col">
      <div v-if="pending" class="w-24 w-24 bg-neutral-800 rounded-xl animate-pulse"></div>
      <div v-else-if="avatar" class="w-24">
        <img :src="avatar" :alt="avatarAltText" class="m-auto max-w-full max-h-full">
      </div>
      <h2 v-else class="px-4 py-2 bg-red-600/10 text-red-500 font-semibold rounded-3xl">Could not load avatar!</h2>
    </div>
    <div class="flex flex-col md:flex-row gap-6 w-full">
      <div class="flex flex-col items-center md:w-2/3 gap-3">
        <div class="px-3 flex md:items-start w-full">
          <input v-model="searchTerm" placeholder="Filter backgrounds" class="light">
        </div>
        <div class="p-3 grid grid-cols-3 md:grid-cols-5 max-h-[16rem] md:max-h-[38rem] overflow-y-scroll overflow-x-hidden border-2 border-neutral-700 rounded-3xl gap-3 w-full h-full">
          <template v-for="(background, index) in filteredAvatarBackgrounds()">
            <div @click="setBackground(getBackgroundIndex(background))" class="p-2 flex flex-col justify-center items-center bg-neutral-800 text-neutral-200 rounded-xl hover:bg-neutral-700 drop-shadow duration-200">
              <img v-lazy-pix="background.path" src="/img/rcax_placeholder.png" :alt="background.name">
              <div class="mt-2 text-xs text-center font-semibold">{{ background.name }}</div>
            </div>
          </template>
        </div>
      </div>
      <div class="flex flex-col gap-6 items-center md:w-1/3">
        <div class="flex justify-center">
          <div class="w-72 h-96 relative">
            <img
                class="w-full h-full absolute"
                :src="selectedBackground().path"
                :alt="avatarAltText"
            >
            <img
                class="absolute"
                :class="{ 'w-36': avatarSize === 'small', 'w-48': avatarSize === AvatarSize.Normal, 'centered': avatarPosition === AvatarPosition.Centered, 'normal': avatarPosition === AvatarPosition.Normal }"
                style="left: 50%;"
                :src="avatar"
                :alt="avatarAltText"
            >
          </div>
        </div>
        <div class="mt-2 flex flex-col items-center text-neutral-400 w-full max-w-xs">
          <label class="">Avatar size</label>
          <select class="mt-2 p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm capitalize border-none focus:outline-none max-w-sm overflow-x-hidden" v-model="avatarSize" @change="drawAvatar">
            <option v-for="size in AvatarSize" :value="size">{{ size }}</option>
          </select>
          <label class="mt-6">Avatar position</label>
          <select class="mt-2 p-2 rounded-md bg-neutral-800 hover:bg-neutral-700 text-sm capitalize border-none focus:outline-none max-w-sm overflow-x-hidden" v-model="avatarPosition" @change="drawAvatar">
            <option v-for="position in AvatarPosition" :value="position">{{ position }}</option>
          </select>
          <button v-if="!pending && avatar" :disabled="savingImage" class="mt-6 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-2xl duration-200" @click="saveImage">Download</button>
        </div>
        <img ref="background" crossorigin="anonymous" class="hidden" :src="`${selectedBackground().path}?not-from-cache-please`" alt="background">
        <img ref="foreground" crossorigin="anonymous" class="hidden" :src="`${avatar}?not-from-cache-please`" alt="foreground">
        <canvas ref="canvas" width="552" height="736" class="hidden"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "nuxt/app";
import {onMounted, Ref, ref, watch} from 'vue';
import {AvatarBackground} from "~/types/avatarBackgrounds";
import {updateSeriesHashed, useSeriesHashed} from "~/composables/states";
import { Capacitor } from "@capacitor/core";
import {Share, ShareOptions} from "@capacitor/share";
import { Media, MediaSaveOptions } from "@capacitor-community/media";
import {ChevronLeftIcon} from "@heroicons/vue/24/solid";

enum AvatarSize {
  Normal = "normal",
  Small = "small"
}

enum AvatarPosition {
  Normal = "normal",
  Centered = "centered"
}

const router = useRouter();
const route = useRoute();
const user = route.params.user;
const series = useSeriesHashed();

const avatar = ref("");
const queryBackgroundIndex: Ref<number> = ref(route.query.background ? parseInt(route.query.background as string) : -1);
const randomBackgroundIndex: number = Math.floor(Math.random() * avatarBackgrounds().length);
const searchTerm = ref<string>("");
const avatarSize: Ref<AvatarSize> = ref(AvatarSize.Normal);
const savingImage = ref(false);

function selectedBackgroundIndex(): number {
  if (queryBackgroundIndex.value >= 0 && queryBackgroundIndex.value <= avatarBackgrounds().length) {
    return queryBackgroundIndex.value;
  } else {
    return randomBackgroundIndex;
  }
}

function selectedBackground(): AvatarBackground {
  return avatarBackgrounds()[selectedBackgroundIndex()] ?? avatarBackgrounds()[0];
}

switch(route.query.size) {
  case AvatarSize.Small:
    avatarSize.value = AvatarSize.Small;
    break;
  default:
    avatarSize.value = AvatarSize.Normal;
}

const avatarPosition: Ref<AvatarPosition> = ref(AvatarPosition.Normal);

switch(route.query.position) {
  case AvatarPosition.Centered:
    avatarPosition.value = AvatarPosition.Centered;
    break;
  default:
    avatarPosition.value = AvatarPosition.Normal;
}

const avatarIntrinsicWidth = ref(380);
const avatarIntrinsicHeight = ref(498);

const background = ref(null);
const foreground = ref(null);
const canvas = ref(null);

const apiRoute = `https://www.reddit.com/user/${user}/about.json`;
const pending = ref(true);

watch([queryBackgroundIndex, avatarSize, avatarPosition, series], () => {
  let background = queryBackgroundIndex.value >= 0 ? queryBackgroundIndex.value : randomBackgroundIndex;

  router.push({
    query: {
      background: background,
      size: avatarSize.value,
      position: avatarPosition.value },
  });
})

await updateSeriesHashed();

fetch(apiRoute)
    .then(async (data) => {
      data = await data.json();

      if (data['data']['snoovatar_img']) {
        avatar.value = data['data']['snoovatar_img'];
      } else {
        avatar.value = "";
      }

      pending.value = false;
    });

onMounted(() => {
  background.value.onload = () => {
    drawAvatar();
  }

  foreground.value.onload = () => {
    avatarIntrinsicWidth.value = foreground.value.width;
    avatarIntrinsicHeight.value = foreground.value.height;
    drawAvatar();
  }
});

function getBackgroundIndex(background: AvatarBackground): number {
  let index = 0;

  avatarBackgrounds().forEach((entry, i) => {
    if (entry.name == background.name) {
      index = i;
    }
  });

  return index;
}

function filteredAvatarBackgrounds(): AvatarBackground[] {
  let backgrounds = avatarBackgrounds();

  if (searchTerm.value.trim() !== "") {
    backgrounds = backgrounds.filter((entry) => entry.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
  }

  return backgrounds;
}

function avatarBackgrounds(): AvatarBackground[] {
  let avatarBackgrounds: Array<AvatarBackground> = [
    new AvatarBackground("Transparent", "/images/others/Transparent.png"),
    new AvatarBackground("Black", "/images/others/Black.png"),
    new AvatarBackground("Aww Friends", "/images/nfts/AwwFriends.png"),
    new AvatarBackground("Drip Squad", "/images/nfts/DripSquad.png"),
    new AvatarBackground("Meme Team", "/images/nfts/MemeTeam.png"),
    new AvatarBackground("The Singularity", "/images/nfts/TheSingularity.png"),
  ]

  for (let entry of useSeriesHashed().value.values()) {
    avatarBackgrounds.push(new AvatarBackground(entry.name, entry.background_image));
  }

  return avatarBackgrounds;
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
  return `${user}'s avatar`;
}

async function saveImage() {
  if (savingImage.value) {
    return;
  }

  savingImage.value = true;

  const fileName = `${user}.png`;

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

<style scoped>
img.normal {
  bottom: 10%;
  transform: translate(-50%, 0%);
}

img.centered {
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
