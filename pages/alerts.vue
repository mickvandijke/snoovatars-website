<template>
  <div class="relative flex flex-col items-center gap-6 w-full">
    <StatsTabs class="hidden md:block" />
    <template v-if="!user">
      <div class="py-6 flex flex-col items-center gap-2">
        <div class="text-neutral-300">Please sign in to create price alerts.</div>
        <NuxtLink to="/login" class="px-4 py-2 bg-amber-600 text-header font-bold rounded-lg">Sign In</NuxtLink>
      </div>
    </template>
    <template v-else-if="loading">
      <div class="min-h-full w-full flex flex-col items-center">
        <button disabled type="button" class="text-header border border-amber-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center">
          <svg class="inline mr-3 w-4 h-4 text-amber-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
          </svg>
          <span class="text-neutral-300">Awaiting request...</span>
        </button>
      </div>
    </template>
    <template v-else>
      <div class="px-4 md:px-6 py-6 flex flex-col gap-12 max-w-xl">
        <template v-if="userSettings">
          <div class="flex flex-col gap-6">
            <div class="px-2 flex flex-row items-center w-full">
              <h2 class="header">Settings</h2>
              <NuxtLink v-if="user.tier < 1" to="/upgrade" class="ml-auto px-4 py-1 max-w-xs flex flex-row flex-nowrap bg-amber-600 disabled:bg-gray-500 hover:bg-amber-500 text-header font-semibold rounded-2xl duration-200">Upgrade</NuxtLink>
            </div>
            <div class="p-6 flex flex-col gap-y-4 border-2 border-white/10 w-full rounded-2xl">
              <template v-if="user.tier >= 0">
                <template v-for="[key, value] in Object.entries(userSettings)">
                  <div class="flex justify-between items-center">
                    <div class="flex gap-1 items-center">
                      <span class="text-sm text-white/80">{{ key.replace(/_/g, " ") }}</span>
                      <!--                      <NuxtLink to="/home#plans" class="text-amber-500 text-xs font-bold">Pro</NuxtLink>-->
                    </div>
                    <label class="relative flex justify-between items-center group p-1 cursor-pointer">
                      <input v-model="userSettings[key]" type="checkbox" class="px-0 absolute peer appearance-none border-none" />
                      <span class="w-8 h-5 flex items-center flex-shrink-0 ml-2 p-0.5 bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-green-400 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-3 group-hover:after:translate-x-1"></span>
                    </label>
                  </div>
                </template>
              </template>
              <template v-else>
                <template v-for="[key, value] in Object.entries(userSettings)">
                  <div class="flex justify-between items-center">
                    <div class="flex gap-1 items-center">
                      <span class="text-sm text-white/80">{{ key.replace(/_/g, " ") }}</span>
                      <NuxtLink to="/home#plans" class="text-amber-500 text-xs font-bold">Pro</NuxtLink>
                    </div>
                    <label class="relative flex justify-between items-center group p-1 cursor-pointer">
                      <input value="false" type="checkbox" class="px-0 absolute peer appearance-none border-none" />
                      <span class="w-8 h-5 flex items-center flex-shrink-0 ml-2 p-0.5 bg-gray-300 rounded-full after:w-4 after:h-4 after:bg-gray-400 after:rounded-full after:shadow-md after:duration-300 group-hover:after:translate-x-1"></span>
                    </label>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </template>
        <div id="alert-list" class="flex flex-col items-center gap-6 w-full">
          <div class="px-2 flex flex-row items-center w-full">
            <h2 class="header">Price Alerts</h2>
            <button @click="openAlertModal" :disabled="alerts.size >= alertMaxQuota.alerts" class="ml-auto px-4 py-2 max-w-xs flex flex-row flex-nowrap bg-secondary disabled:bg-gray-500 hover:bg-tertiary text-header text-sm font-medium rounded-lg duration-200">Create Alert</button>
          </div>
          <template v-if="user.tier < 1">
            <div class="p-6 text-center text-sm text-white/80 border-2 border-red-500 rounded-2xl w-full">
              <span>Although you can create alerts, they will not fire until you <NuxtLink to="/upgrade" class="text-amber-500 font-bold">upgrade to Pro</NuxtLink> and enable email and/or push notifications.</span>
            </div>
          </template>
          <ul class="p-2 grid grid-cols-1 gap-2 w-full border-2 border-white/10 rounded-2xl">
            <template v-if="alerts.size > 0" v-for="[alertHash, alert] in alerts">
              <div class="p-2 flex gap-2 items-center bg-secondary text-sm rounded-lg w-full">
                <div class="flex items-center justify-center w-8 h-8 rounded-md overflow-hidden">
                  <template v-if="getSeries(alert.collection_tier_hash)">
                    <img :src="getSeries(alert.collection_tier_hash).image" class="object-cover">
                  </template>
                </div>
                <div class="col-span-6 flex flex-col">
                  <span class="text-header font-semibold">{{alert.item_hash ? (avatars.get(alert.item_hash)?.fullname() ?? 'Loading..') : (series.get(alert.collection_tier_hash)?.name ?? 'Loading..') }}</span>
                  <span class="text-details text-xs">{{ alert.alert_type.toString().replace("SaleAbove", "Sale Above").replace("ListingBelow", "Listing Below") }}: {{ alert.price_threshold }} ETH</span>
                </div>
                <div class="ml-auto col-span-5 flex items-center justify-center gap-2">
                  <button @click="openAlertModal(alertHash, alert)" class="w-8 h-8 flex items-center justify-center bg-secondary hover:bg-tertiary font-semibold text-header rounded-md duration-200">
                    <PencilSquareIcon class="text-white/40 w-4" />
                  </button>
                  <button @click="deleteAlert(alertHash)" class="w-8 h-8 flex items-center justify-center bg-secondary hover:bg-red-500/25 font-semibold text-header rounded-md duration-200">
                    <TrashIcon class="text-white/40 w-4" />
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <span class="w-full text-white/40 text-sm text-center italic">No alerts yet.</span>
            </template>
          </ul>
          <p class="px-6 text-sm text-white/40 text-center w-full">To prevent price notifications from ending up in your spam folder, you might have to whitelist service@snoovatars.com.</p>
        </div>
        <template v-if="alerts && alertQuota && alertMaxQuota">
          <div class="flex flex-col gap-6">
            <div class="px-2 flex flex-row items-center w-full">
              <h2 class="header">Quota</h2>
              <NuxtLink v-if="user.tier < 1" to="/upgrade" class="ml-auto px-4 py-1 max-w-xs flex flex-row flex-nowrap bg-amber-600 disabled:bg-gray-500 hover:bg-amber-500 text-header font-semibold rounded-2xl duration-200">Upgrade</NuxtLink>
            </div>
            <ul class="p-6 flex flex-col gap-y-4 border-2 border-white/10 w-full rounded-2xl">
              <li class="flex flex-row flex-nowrap text-details text-sm rounded-2xl block w-full">
                <span>Concurrent Alerts:</span>
                <span class="ml-auto">{{ alerts.size }}/{{ alertMaxQuota.alerts }}</span>
              </li>
              <!--              <li class="flex flex-row flex-nowrap text-details text-sm rounded-2xl block w-full">-->
              <!--                <span>Email Notifications:</span>-->
              <!--                <span class="ml-auto">{{ alertQuota.emails_sent }}/{{ alertMaxQuota.emails_sent }}</span>-->
              <!--              </li>-->
            </ul>
            <!--            <p class="px-6 text-sm text-white/40 text-center w-full">*Free tier quotas might change at any moment without notice.</p>-->
          </div>
        </template>
      </div>

      <!--modal content-->
      <template v-if="addingAlert">
        <div class="fixed inset-0 h-screen flex justify-center items-center bg-black/50 z-40">
          <div v-click-outside="cancelAlert" class="relative w-96 max-w-[80%] flex flex-col bg-secondary/90 backdrop-blur-xl border border-neutral-700 drop-shadow-2xl rounded-2xl overflow-hidden">
            <div class="px-4 py-3 absolute w-full top-0 flex items-center justify-center bg-primary/90 backdrop-blur-xl border-b border-white/10 shadow-md z-30">
              <span class="text-white/40 font-medium">{{ !!replacingAlertHash ? "Update" : "New" }} Alert</span>
              <XMarkIcon @click.stop="cancelAlert" class="absolute right-4 w-7 h-7 text-neutral-400 opacity-50 hover:opacity-100 cursor-pointer duration-200"/>
            </div>
            <div class="px-4 py-20 text-center max-h-[60vh] overflow-y-auto">
              <label for="collection" class="block mb-2 text-sm font-medium text-details text-left">Select avatar (Type to search)</label>
              <select-search
                  id="tier"
                  v-model="newAlert.collection_tier_hash"
                  :options="seriesOptions"
                  :placeholder="newAlert.collection_tier_hash ? series.get(newAlert.collection_tier_hash).name : 'Select avatar'"
                  @change="onSelectedTier"
              />
              <!--            <label for="avatar" class="mt-4 block mb-2 text-sm font-medium text-details text-left">[Optional] Select a specific mint number</label>-->
              <!--            <select-search-->
              <!--                id="avatar"-->
              <!--                v-model="newAlert.item_hash"-->
              <!--                :options="selectAvatars()"-->
              <!--                :placeholder="newAlert.item_hash ? avatars.get(newAlert.item_hash).fullname() : 'None'"-->
              <!--                :disabled="!newAlert.collection_tier_hash"-->
              <!--                @change="onSelectedAvatar()"-->
              <!--            />-->
              <label for="max-mint-number" class="mt-4 block mb-2 text-sm font-medium text-details text-left">Max mint number (0 = any mint)</label>
              <input type="number" min="0" :max="series.get(newAlert.collection_tier_hash) ? series.get(newAlert.collection_tier_hash).mints : 0" :disabled="newAlert.item_hash" required v-model="newAlert.max_mint_number" id="max-mint-number" class="lighter">
              <label for="type" class="mt-4 block mb-2 text-sm font-medium text-details text-left">Select an event type</label>
              <select required v-model="newAlert.alert_type" id="type" class="w-full">
                <option :value="AlertType.ListingBelow">Listing below price threshold</option>
                <option :value="AlertType.SaleAbove">Sale above price threshold</option>
              </select>
              <label for="price-threshold" class="mt-4 block mb-2 text-sm font-medium text-details text-left">Price threshold in ETH</label>
              <input type="number" min="0" max="1000" required v-model="newAlert.price_threshold" id="price-threshold" class="lighter">
              <label for="repeating" class="mt-4 block mb-2 text-sm font-medium text-details text-left">Repeating</label>
              <select required v-model="newAlert.repeating" id="repeating" class="w-full">
                <option :value="false">Only alert once</option>
                <option :value="true">Repeating alert</option>
              </select>
            </div>
            <div class="px-4 py-3 absolute bottom-0 w-full flex items-center gap-4 bg-primary/90 backdrop-blur-xl border-t border-white/10 shadow-md">
              <button @click="submitAlert" :disabled="!newAlert.isValid()" class="px-2 py-2 bg-secondary hover:bg-tertiary disabled:bg-white/5 text-white/80 disabled:text-white/20 text-sm font-semibold rounded-2xl w-full duration-200">
                Save
              </button>
              <button @click="cancelAlert" class="px-2 py-2 bg-red-500/40 hover:bg-red-500/80 text-white/80 text-sm font-semibold rounded-2xl w-full duration-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </template>

    </template>
  </div>
</template>

<script setup lang="ts">
import {
  loadUserSettings, setUserSettings,
  updateSeriesHashed,
  useAlertList,
  useAvatarList,
  useSeriesHashed, useToken,
  useUser, useUserSettings,
} from "~/composables/states";
import {Alert, alert_list_from_object, AlertHash, AlertType, AlertMaxQuota, AlertQuota} from "~/types/alert";
import {useRuntimeConfig} from "#app";
import {onBeforeMount, onMounted, ref, watch} from "#imports";
import {Ref} from "@vue/reactivity";
import {SelectSearchOption} from "~/types/select_search";
import {handleCatch} from "~/composables/api/error";
import {deleteToken} from "~/composables/api/user";
import {createAlert, getAlerts} from "~/composables/api/alert";
import {calculate_hash} from "~/types/series";
import {UserSettings} from "~/types/user";
import {PencilSquareIcon, TrashIcon, XMarkIcon} from "@heroicons/vue/24/solid";

const loading = ref(true);
const series = useSeriesHashed();
const avatars = useAvatarList();
const alerts = useAlertList();
const alertQuota: Ref<AlertQuota> = ref(null);
const alertMaxQuota: Ref<AlertMaxQuota> = ref(null);
const user = useUser();
const token = useToken();
const config = useRuntimeConfig();
const BACKEND_ADDR = config.API_BASE_URL;
const addingAlert = ref(false);
const newAlert: Ref<Alert> = ref(new Alert());
const replacingAlertHash: Ref<AlertHash> = ref(null);
const userSettings: Ref<UserSettings> = ref({
  shop_new_paid_avatars_alert: false,
  new_deployed_contracts_alert: false,
  email_notifications: false,
  push_notifications: false
});
const seriesOptions: Ref<Array<SelectSearchOption>> = ref([]);

onBeforeMount( () => {
  updateSeriesHashed();
});

onMounted(async () => {
  if (token.value) {
    loadAlerts();
    loadUserSettings().then(() => {
      userSettings.value = JSON.parse(JSON.stringify(useUserSettings().value));
    });
  }
});

watch([token], async () => {
  if (token.value) {
    loadAlerts();
    loadUserSettings().then(() => {
      userSettings.value = JSON.parse(JSON.stringify(useUserSettings().value));
    });
  }
});

watch(userSettings, () => {
  if (JSON.stringify(userSettings.value) !== JSON.stringify(useUserSettings().value)) {
    setUserSettings(userSettings.value);
  }
}, { deep: true });

watch([series], async () => {
  let arr = new Array<SelectSearchOption>();

  for await (const serie of series.value.values()) {
    let option: SelectSearchOption = new SelectSearchOption(`${serie.name} (${serie.contract_address.slice(0, 5)})`, await calculate_hash(serie));

    arr.push(option);
  }

  seriesOptions.value = arr;
}, { deep: true });

function getSeries(seriesHash: string) {
  return series.value.get(seriesHash);
}

function onSelectedTier() {
  if (newAlert.value.collection_tier_hash) {
    newAlert.value.item_hash = null;
  }
}

function onSelectedAvatar() {
  if (newAlert.value.item_hash) {
    newAlert.value.max_mint_number = 0;
  }
}

function selectAvatars(): Array<SelectSearchOption> {
  let array: Array<SelectSearchOption> = new Array<SelectSearchOption>();

  avatars.value.forEach(async (avatar, index) => {
    if (avatar.collection_tier_hash !== newAlert.value.collection_tier_hash) return;

    let option: SelectSearchOption = new SelectSearchOption(avatar.fullname(), await avatar.calculate_hash());

    array.push(option);
  })

  array.unshift(new SelectSearchOption("None", null));

  return array;
}

function logout() {
  deleteToken();
}

function loadAlerts() {
  loading.value = true;

  getAlerts()
      .then((res) => {
        if (res.alerts) alerts.value = res.alerts;
        if (res.alertQuota) alertQuota.value = res.alertQuota;
        if (res.alertMaxQuota) alertMaxQuota.value = res.alertMaxQuota;

        loading.value = false;
      })
      .catch((err) => {
        alert(err);

        loading.value = false;
      })
}

function submitAlert() {
  createAlert(newAlert.value, replacingAlertHash.value)
      .then(() => {
        addingAlert.value = false;
      })
      .catch((err) => {
        alert(err);
      })
}

function openAlertModal(alert_hash: AlertHash, alert: Alert) {
  newAlert.value = new Alert();

  if (alert_hash && alert) {
    let _alert: Alert = new Alert();

    Object.assign(_alert, alert)

    // This is stupid, but it works.
    _alert.alert_type = alert.toJson()['alert_type'];

    newAlert.value = _alert;

    replacingAlertHash.value = alert_hash;
  } else {
    newAlert.value.item_hash = null;
    newAlert.value.collection_tier_hash = null;
    newAlert.value.user_id = user.value.id;
    newAlert.value.alert_type = AlertType.ListingBelow;
    newAlert.value.repeating = false;
    newAlert.value.max_mint_number = 0;
    newAlert.value.price_threshold = 0;
  }

  addingAlert.value = true;
}

function cancelAlert() {
  replacingAlertHash.value = null;

  addingAlert.value = false;
}

async function deleteAlert(alertHash: AlertHash) {
  let url = `${BACKEND_ADDR}/jwt/alert/delete/${alertHash}`;

  fetch(url, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    },
  })
      .then(async (data) => {
        data = await data.json();

        if (data['alerts']) {
          useAlertList().value = alert_list_from_object(data['alerts']);

          addingAlert.value = false;
        }
      })
      .catch(handleCatch);
}
</script>

<style scoped>
.header {
  @apply text-header text-xl md:text-2xl font-semibold;
}
</style>
