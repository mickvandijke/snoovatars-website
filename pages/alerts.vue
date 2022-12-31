<template>
  <div class="mt-12 flex flex-col items-center w-full max-w-xl">
    <template v-if="!user">
      <div class="min-h-full w-full flex flex-col items-center">
        <button disabled type="button" class="text-white border border-amber-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center">
          <svg class="inline mr-3 w-4 h-4 text-amber-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
          </svg>
          <span class="text-neutral-300">Awaiting request...</span>
        </button>
      </div>
    </template>
    <template v-else>
<!--      <div class="p-6 flex flex-col items-center border-2 border-neutral-800 rounded-2xl w-full">-->
<!--        <span class="text-sm text-neutral-400">Connected Account:</span>-->
<!--        <span class="mt-2 text-sm text-amber-600 text-nowrap overflow-hidden truncate">{{ user.id }}</span>-->
<!--        <span class="mt-2 text-sm text-amber-600 text-nowrap">Premium: <span class="text-neutral-400">{{ user.tier !== 0 }}</span></span>-->
<!--        <div class="mt-2 p-3 bg-neutral-800 text-neutral-400 rounded-2xl">{{ user.email }}</div>-->
<!--        <button @click.prevent="logout" class="mt-6 px-4 py-2 max-w-xs flex flex-row flex-nowrap bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-2xl duration-200">Logout</button>-->
<!--      </div>-->
      <div id="alert-list" class="flex flex-col items-center w-full">
        <div class="flex flex-row items-center w-full">
          <h2 class="text-neutral-100 text-3xl font-semibold">Alerts</h2>
          <button @click="openAlertModal" :disabled="alerts.size >= alertMaxQuota.alerts" class="ml-auto px-4 py-2 max-w-xs flex flex-row flex-nowrap bg-amber-600 disabled:bg-gray-500 hover:bg-amber-500 text-white font-semibold rounded-2xl duration-200">Create Alert</button>
          <NuxtLink v-if="user.tier < 1 && alerts.size >= alertMaxQuota.alerts" to="/upgrade" class="ml-3 px-4 py-2 max-w-xs flex flex-row flex-nowrap bg-amber-600 disabled:bg-gray-500 hover:bg-amber-500 text-white font-semibold rounded-2xl duration-200">Upgrade</NuxtLink>
        </div>
        <ul class="mt-6 p-6 flex flex-col gap-y-4 border-2 border-neutral-800 w-full rounded-2xl">
          <template v-if="alerts.size > 0">
            <li v-for="[alertHash, alert] in alerts" class="p-3 flex flex-row flex-nowrap items-center bg-neutral-800 text-sm rounded-2xl focus:ring-amber-500 focus:border-amber-500 block w-full">
              <span class="px-2 font-semibold text-neutral-300">{{  alert.item_hash ? (avatars.get(alert.item_hash)?.fullname() ?? 'Loading..') : (tiers.get(alert.collection_tier_hash)?.name ?? 'Loading..') }}, {{ alert.alert_type }}: {{ alert.price_threshold }} ETH</span>
              <button @click="openAlertModal(alertHash, alert)" class="ml-auto px-4 py-2 bg-sky-600 hover:bg-sky-500 font-semibold text-white rounded-2xl duration-200">Edit</button>
              <button @click="deleteAlert(alertHash)" class="ml-2 px-4 py-2 bg-red-600 hover:bg-red-500 font-semibold text-white rounded-2xl duration-200">Delete</button>
            </li>
          </template>
          <template v-else>
            <li class="text-neutral-400 text-center">No alerts yet.</li>
          </template>
        </ul>
        <p class="p-6 text-sm text-neutral-500 text-center w-full">To prevent price notifications from ending up in your spam folder, you might have to whitelist service@snoovatars.com.</p>
      </div>
      <div v-if="alerts && alertQuota && alertMaxQuota" class="mt-12 w-full">
        <div class="flex flex-row items-center w-full">
          <h2 class="text-neutral-100 text-3xl font-semibold">Quota</h2>
          <NuxtLink v-if="user.tier < 1" to="/upgrade" class="ml-auto px-4 py-2 max-w-xs flex flex-row flex-nowrap bg-amber-600 disabled:bg-gray-500 hover:bg-amber-500 text-white font-semibold rounded-2xl duration-200">Upgrade</NuxtLink>
        </div>
        <div v-if="user.tier < 1" class="mt-6 p-3 flex flex-col items-center gap-y-4 border-2 border-amber-500 w-full rounded-2xl">
          <span class="text-sm text-amber-500 text-center">Upgrade to PREMIUM to get 50 concurrent alerts and unlimited email notifications.</span>
        </div>
        <ul class="mt-6 p-6 flex flex-col gap-y-4 border-2 border-neutral-800 w-full rounded-2xl">
          <li class="flex flex-row flex-nowrap text-neutral-400 text-sm rounded-2xl block w-full">
            <span>Concurrent Alerts:</span>
            <span class="ml-auto">{{ alerts.size }}/{{ alertMaxQuota.alerts }}</span>
          </li>
          <li class="flex flex-row flex-nowrap text-neutral-400 text-sm rounded-2xl block w-full">
            <span>Email Notifications:</span>
            <span class="ml-auto">{{ alertQuota.emails_sent }}/{{ alertMaxQuota.emails_sent }}</span>
          </li>
        </ul>
        <p class="p-6 text-sm text-neutral-500 text-center w-full">*Free tier quotas might change at any moment without notice.</p>
      </div>

      <!--modal content-->
      <div v-if="addingAlert" class="fixed mx-auto p-5 w-96 border-2 border-neutral-700 drop-shadow-2xl rounded-2xl bg-neutral-800">
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-white">{{ !!replacingAlertHash ? "Update" : "New" }} Alert</h3>
          <div class="mt-2 px-7 py-3 max-h-xs overflow-y-auto">
            <label for="collection" class="block mb-2 text-sm font-medium text-neutral-400 text-left">Select avatar</label>
            <select-search
                id="tier"
                v-model="newAlert.collection_tier_hash"
                :options="selectTiers()"
                :placeholder="newAlert.collection_tier_hash ? tiers.get(newAlert.collection_tier_hash).name : 'Select avatar'"
                @change="onSelectedTier()"
            >
            </select-search>
            <label for="avatar" class="mt-4 block mb-2 text-sm font-medium text-neutral-400 text-left">[Optional] Select a specific mint number</label>
            <select-search
                id="avatar"
                v-model="newAlert.item_hash"
                :options="selectAvatars()"
                :placeholder="newAlert.item_hash ? avatars.get(newAlert.item_hash).fullname() : 'None'"
                :disabled="!newAlert.collection_tier_hash"
                @change="onSelectedAvatar()"
            >
            </select-search>
            <label for="max-mint-number" class="mt-4 block mb-2 text-sm font-medium text-neutral-400 text-left">Max mint number (0 = any mint)</label>
            <input type="number" min="0" :max="tiers.get(newAlert.collection_tier_hash) ? tiers.get(newAlert.collection_tier_hash).mints : 0" :disabled="newAlert.item_hash" required v-model="newAlert.max_mint_number" id="max-mint-number" class="light">
            <label for="type" class="mt-4 block mb-2 text-sm font-medium text-neutral-400 text-left">Select an event type</label>
            <select required v-model="newAlert.alert_type" id="type" class="light">
              <option :value="AlertType.ListingBelow">Listing below price threshold</option>
              <option :value="AlertType.SaleAbove">Sale above price threshold</option>
            </select>
            <label for="price-threshold" class="mt-4 block mb-2 text-sm font-medium text-neutral-400 text-left">Price threshold in ETH</label>
            <input type="number" min="0" max="1000" required v-model="newAlert.price_threshold" id="price-threshold" class="light">
            <label for="repeating" class="mt-4 block mb-2 text-sm font-medium text-neutral-400 text-left">Repeating</label>
            <select required v-model="newAlert.repeating" id="repeating" class="light">
              <option :value="false">Only alert once</option>
              <option :value="true">Repeating alert</option>
            </select>
          </div>
          <div class="items-center px-4 py-3">
            <button @click="submitAlert" :disabled="!newAlert.isValid()" class="px-4 py-2 bg-sky-500 disabled:bg-gray-500 text-white text-base font-medium rounded-2xl w-full hover:bg-sky-600 disabled:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-green-300 duration-200">
              Submit
            </button>
            <button @click="cancelAlert" class="mt-2 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-2xl w-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 duration-200">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  useAlertList,
  useAvatarList,
  useTierList, useToken,
  useUser,
} from "~/composables/states";
import {Alert, alert_list_from_object, AlertHash, AlertType, AlertMaxQuota, AlertQuota} from "~/types/alert";
import {navigateTo, useRuntimeConfig} from "#app";
import {onMounted, ref, watch} from "#imports";
import {Ref} from "@vue/reactivity";
import {SelectSearchOption} from "~/types/select_search";
import {handleCatch} from "~/composables/api/error";
import {deleteToken} from "~/composables/api/user";
import {createAlert, getAlerts} from "~/composables/api/alert";

const tiers = useTierList();
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

onMounted(async () => {
  if (!token.value) {
    await navigateTo("/login", {replace: true});
  } else {
    loadAlerts();
  }
})

watch([token], async () => {
  if (!token.value) {
    await navigateTo("/login", {replace: true});
  } else {
    loadAlerts();
  }
})

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

function selectTiers(): Array<SelectSearchOption> {
  let array: Array<SelectSearchOption> = new Array<SelectSearchOption>();

  tiers.value.forEach(async (tier, index) => {
    let option: SelectSearchOption = new SelectSearchOption(tier.name, await tier.calculate_hash());

    array.push(option);
  })

  return array;
}

function logout() {
  deleteToken();
}

function loadAlerts() {
  getAlerts()
      .then((res) => {
        if (res.alerts) alerts.value = res.alerts;
        if (res.alertQuota) alertQuota.value = res.alertQuota;
        if (res.alertMaxQuota) alertMaxQuota.value = res.alertMaxQuota;
      })
      .catch((err) => {
        alert(err);
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

</style>
