<template>
  <div class="mt-12 flex flex-col items-center w-full max-w-xl">
    <template v-if="awaitingSignature">
      <div class="min-h-full w-full flex flex-col items-center">
        <button disabled type="button" class="text-white border border-amber-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center">
          <svg class="inline mr-3 w-4 h-4 text-amber-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
          </svg>
          <span class="text-neutral-300">Awaiting Signature...</span>
        </button>
      </div>
    </template>
    <template v-else>
      <template v-if="user">
        <div class="p-6 flex flex-col items-center border-2 border-neutral-800 rounded-2xl">
          <span class="text-sm text-neutral-400">Connected Wallet:</span>
          <span class="text-sm text-amber-600">{{ wallet_address }}</span>
          <button @click.prevent="disconnectWallet" class="mt-6 px-4 py-2 max-w-xs flex flex-row flex-nowrap bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-2xl duration-200">Disconnect Wallet</button>
        </div>
        <div id="alert-list" class="mt-6 flex flex-col items-center w-full">
          <button @click="createAlert" class="mt-6 px-4 py-2 max-w-xs flex flex-row flex-nowrap bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-2xl duration-200">Create Alert</button>
          <ul class="mt-6 p-6 flex flex-col gap-y-4 border-2 border-neutral-800 w-full rounded-2xl">
            <template v-if="alerts.size > 0">
              <li v-for="[alertHash, alert] in alerts" class="flex flex-row flex-nowrap bg-neutral-800 border border-neutral-600 text-neutral-100 text-sm rounded-2xl focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5">
                <span class="text-neutral-400">{{  !alert.item_hash ? tiers.get(alert.collection_tier_hash).name : avatars.get(alert.item_hash).fullname() }}</span>
                <button @click="createAlert(alertHash, alert)" class="ml-auto mr-2 text-blue-500">Edit</button>
                <button @click="deleteAlert(alertHash)" class="text-red-500">Delete</button>
              </li>
            </template>
            <template v-else>
              <li class="text-neutral-400 text-center">No alerts yet.</li>
            </template>
          </ul>
        </div>

        <!--modal content-->
        <div v-if="addingAlert" class="fixed mx-auto p-5 w-96 shadow-2xl rounded-2xl bg-neutral-800">
          <div class="mt-3 text-center">
            <h3 class="text-lg leading-6 font-medium text-white">{{ !!replacingAlertHash ? "Update" : "New" }} Alert</h3>
            <div class="mt-2 px-7 py-3">
              <label for="avatar" class="block mb-2 text-sm font-medium text-neutral-400 text-left">[Optional] Select a specific avatar</label>
              <select required v-model="newAlert.item_hash" @change="updateNewAlert" id="avatar" class="bg-neutral-700 border border-neutral-600 text-neutral-100 text-sm rounded-2xl focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5">
                <option :value="null" selected>None</option>
                <option v-for="[avatarHash, avatar] in avatars" :value="avatarHash">{{ avatar.fullname() }}</option>
              </select>
              <label for="collection" class="mt-4 block mb-2 text-sm font-medium text-neutral-400 text-left">Select a collection tier</label>
              <select :disabled="newAlert.item_hash" required v-model="newAlert.collection_tier_hash" id="collection" class="bg-neutral-700 border border-neutral-600 text-neutral-100 text-sm rounded-2xl focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5">
                <option :value="null" disabled selected>Select collection tier</option>
                <option v-for="[tierHash, tier] in tiers" :value="tierHash">{{ tier.name }}</option>
              </select>
              <label for="max-mint-number" class="mt-4 block mb-2 text-sm font-medium text-neutral-400 text-left">Max mint number (0 = any mint)</label>
              <input type="number" min="0" :max="tiers.get(newAlert.collection_tier_hash) ? tiers.get(newAlert.collection_tier_hash).mints : 0" :disabled="newAlert.item_hash" required v-model="newAlert.max_mint_number" id="max-mint-number" class="bg-neutral-700 border border-neutral-600 text-neutral-100 disabled:text-gray-400 text-sm rounded-2xl focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5">
              <label for="type" class="mt-4 block mb-2 text-sm font-medium text-neutral-400 text-left">Select an event type</label>
              <select required v-model="newAlert.alert_type" id="type" class="bg-neutral-700 border border-neutral-600 text-neutral-100 text-sm rounded-2xl focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5">
                <option :value="AlertType.ListingBelow">Listing below price threshold</option>
                <option :value="AlertType.SaleAbove">Sale above price threshold</option>
              </select>
              <label for="price-threshold" class="mt-4 block mb-2 text-sm font-medium text-neutral-400 text-left">Price threshold in ETH</label>
              <input type="number" min="0" max="1000" required v-model="newAlert.price_threshold" id="price-threshold" class="bg-neutral-700 border border-neutral-600 text-neutral-100 text-sm rounded-2xl focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5">
              <label for="repeating" class="mt-4 block mb-2 text-sm font-medium text-neutral-400 text-left">Repeating</label>
              <select required v-model="newAlert.repeating" id="repeating" class="bg-neutral-700 border border-neutral-600 text-neutral-100 text-sm rounded-2xl focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5">
                <option :value="false">Only alert once</option>
                <option :value="true">Repeating alert</option>
              </select>
            </div>
            <div class="items-center px-4 py-3">
              <button @click="submitAlert" :disabled="!newAlert.isValid()" class="px-4 py-2 bg-sky-500 disabled:bg-gray-500 text-white text-base font-medium rounded-2xl w-full hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                Submit
              </button>
              <button @click="cancelAlert" class="mt-2 px-4 py-2 bg-red-500 text-white text-base font-medium rounded-2xl w-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </template>
      <template v-else-if="wallet_address">
        <div class="mt-6 flex flex-col items-center w-96">
          <div class="p-6 flex flex-col items-center border-2 border-neutral-800 rounded-2xl">
            <span class="text-sm text-neutral-400">Connected Wallet:</span>
            <span class="text-sm text-amber-600">{{ wallet_address }}</span>
            <button @click.prevent="disconnectWallet" class="mt-6 px-4 py-2 max-w-xs flex flex-row flex-nowrap bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-2xl duration-200">Disconnect Wallet</button>
          </div>
          <input v-model="newEmail" type="email" id="email" placeholder="Email for alerts." class="mt-6 bg-neutral-700 border border-neutral-600 text-neutral-100 text-sm rounded-2xl focus:ring-amber-500 focus:border-amber-500 block w-full p-2.5">
          <button @click="createUser" class="mt-6 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-2xl duration-200 max-w-xs">Submit Email</button>
        </div>
      </template>
      <template v-else>
        <div class="mt-6">
          <button @click="connectWallet" class="px-4 py-2 max-w-xs flex flex-row flex-nowrap bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-2xl duration-200">Connect Wallet</button>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import {ethers} from 'ethers';
import {SiweMessage} from 'siwe';
import {useAlertList, useAvatarList, useTierList, useUser, useWalletAddress} from "~/composables/states";
import {Alert, alert_list_from_object, AlertHash, AlertType} from "~/models/alert";
import {useRuntimeConfig} from "#app";
import {ref, watch} from "#imports";
import {User} from "~/models/user";
import {Ref} from "@vue/reactivity";

const tiers = useTierList();
const avatars = useAvatarList();
const alerts = useAlertList();
const user = useUser();
const wallet_address = useWalletAddress();
const domain = window.location.host;
const origin = window.location.origin;
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const config = useRuntimeConfig();
const BACKEND_ADDR = config.API_BASE_URL;
const awaitingSignature = ref(false);
const addingAlert = ref(false);
const newEmail: Ref<string> = ref(null);
const newAlert: Ref<Alert> = ref(new Alert());
const replacingAlertHash: Ref<AlertHash> = ref(null);

watch([user], () => {
  if (user.value) {
    getAlerts()
  }
})

function updateNewAlert() {
  if (newAlert.value.item_hash) {
    newAlert.value.collection_tier_hash = avatars.value.get(newAlert.value.item_hash).collection_tier_hash;
    newAlert.value.max_mint_number = 0;
  }
}

async function createSiweMessage(address, statement) {
  const res = await fetch(`${BACKEND_ADDR}/nonce`);

  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: '1',
    nonce: await res.text()
  });

  return message.prepareMessage();
}

async function connectWallet() {
  provider.send('eth_requestAccounts', [])
      .then(() => {
        signer.getAddress()
            .then((address) => {
              wallet_address.value = address;
              getUser();
            });
      })
      .catch(() => {
        awaitingSignature.value = false;
        console.log('user rejected request')
      });

}

async function getUser() {
  let address = wallet_address.value;

  let url = `${BACKEND_ADDR}/user/${address}`;

  const message = await createSiweMessage(
      address,
      url
  );

  awaitingSignature.value = true;

  const signature = await signer.signMessage(message);

  awaitingSignature.value = false;

  fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, signature, data: {} }),
  })
      .then(async (data) => {
        data = await data.json();

        if (data['user']) {
          let _user: User = new User();

          Object.assign(_user, data['user']);

          user.value = _user;
        }
      });
}

async function createUser() {
  if (!newEmail.value) return;

  let address = wallet_address.value;

  let url = `${BACKEND_ADDR}/user/create/${address}`;

  const message = await createSiweMessage(
      address,
      url
  );

  awaitingSignature.value = true;

  const signature = await signer.signMessage(message);

  awaitingSignature.value = false;

  fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, signature, data: { email: newEmail.value } }),
  })
      .then(async (data) => {
        data = await data.json();

        if (data['user']) {
          let _user: User = new User();

          Object.assign(_user, data['user']);

          user.value = _user;
        }
      });
}

async function getAlerts() {
  let address = user.value.wallet_address;

  let url = `${BACKEND_ADDR}/alerts/${address}`;

  const message = await createSiweMessage(
      address,
      url
  );

  awaitingSignature.value = true;

  const signature = await signer.signMessage(message);

  awaitingSignature.value = false;

  fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, signature, data: {} }),
  })
      .then(async (data) => {
        data = await data.json();

        if (data['alerts']) {
          useAlertList().value = alert_list_from_object(data['alerts']);
        }
      });
}

function disconnectWallet() {
  user.value = null;
  wallet_address.value = null;
}

function createAlert(alert_hash: AlertHash, alert: Alert) {
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
    newAlert.value.user_id = user.value.wallet_address;
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

async function submitAlert() {
  let address = wallet_address.value;

  let url = `${BACKEND_ADDR}/alert/create/${await newAlert.value.calculate_hash()}`;

  const message = await createSiweMessage(
      address,
      url
  );

  awaitingSignature.value = true;

  const signature = await signer.signMessage(message);

  awaitingSignature.value = false;

  fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      signature,
      data: {
        alert: newAlert.value.toJson(),
        replacing_alert_hash: replacingAlertHash.value
      }
    }),
  })
      .then(async (data) => {
        data = await data.json();

        if (data['alerts']) {
          useAlertList().value = alert_list_from_object(data['alerts']);

          addingAlert.value = false;
        }
      });
}

async function deleteAlert(alertHash: AlertHash) {
  let address = wallet_address.value;

  let url = `${BACKEND_ADDR}/alert/delete/${alertHash}`;

  const message = await createSiweMessage(
      address,
      url
  );

  awaitingSignature.value = true;

  const signature = await signer.signMessage(message);

  awaitingSignature.value = false;

  fetch(url, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      signature,
      data: alertHash
    }),
  })
      .then(async (data) => {
        data = await data.json();

        if (data['alerts']) {
          useAlertList().value = alert_list_from_object(data['alerts']);

          addingAlert.value = false;
        }
      });
}
</script>

<style scoped>

</style>
