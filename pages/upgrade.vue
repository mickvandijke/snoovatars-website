<template>
  <div class="py-6 md:py-12 px-4 flex flex-col items-center w-full max-w-xl">
    <div class="flex flex-col items-center w-full">
      <template v-if="!user">
        <h1 class="text-2xl font-semibold text-white">Please sign in before upgrading to PRO.</h1>
      </template>
      <template v-else-if="user.tier === 0">
        <h1 class="text-2xl font-semibold text-white">Upgrade to RCAX PRO!</h1>
        <p class="mt-6 text-header text-center">With PRO, you will enjoy all the current and future Pro features on our platform. This includes price alerts, drop notifications and an all-in-one listings browser! The upgrade is a one-time payment and will support the development of RCAX :).</p>
        <template v-if="Capacitor.getPlatform() !== 'ios'">
          <p class="mt-6 text-header text-center">Accounts are cross-platform, so you can share your PRO account on Web, Android and iOS!</p>
        </template>
        <template v-if="Capacitor.isNativePlatform()">
          <div class="mt-6 flex flex-col items-center w-full shadow">
            <template v-for="product in iapProducts">
              <div class="px-2 py-2 flex justify-between gap-3 bg-secondary text-white/80 rounded-2xl w-full">
                <div class="px-2 flex flex-col">
                  <h2 class="text-amber-500 font-bold">PRO Upgrade</h2>
                  <p class="text-sm">{{ product.description }}</p>
                </div>
                <button @click="orderIap(product.id)" class="p-2 flex items-center justify-center whitespace-nowrap bg-secondary hover:bg-tertiary text-header disabled:text-white/20 font-semibold text-sm border border-transparent rounded-md duration-200 cursor-pointer loading" :disabled="buttonDisabled()">
                  <template v-if="buttonDisabled()">
                    <svg class="inline w-5 h-5 text-amber-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                  </template>
                  <template v-else>
                    <span>{{ product.pricing.price }} {{ product.pricing.currency }}</span>
                  </template>
                </button>
              </div>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="mt-6 w-full">
            <h3 class="font-semibold text-white">The RCAX website only allows purchases with cryptocurrency. If you like to pay with your native fiat currency, you can upgrade using the iOS or Android APP.</h3>
          </div>
          <div class="mt-6 w-full">
            <h3 class="font-semibold text-amber-500">Step 1. Buy a PRO upgrade using Coinbase Commerce. Make sure to save your order code! The order code looks like "AAAAAAAA".</h3>
            <NuxtLink
                target="_blank"
                to="https://commerce.coinbase.com/checkout/c83f3cd4-adcf-4d3e-9349-3c1892f94472"
                class="mt-6 inline-flex p-4 bg-blue-700 hover:bg-blue-600 font-semibold text-header rounded-2xl duration-200"
            >Pay with Crypto</NuxtLink>
          </div>
          <div class="mt-12 flex flex-col w-full">
            <h3 class="font-semibold text-amber-500">Step 2. Redeem your PRO upgrade by filling in your order code.</h3>
            <div class="mt-6 flex flex-row gap-2 w-full">
              <input v-model="coinbaseCommerceOrderId" type="text" class="h-14">
              <button @click="redeemOrderIdCoinbaseCommerce" :disabled="!coinbaseCommerceOrderId" class="p-4 bg-amber-600 hover:bg-amber-500 font-semibold text-header rounded-2xl duration-200">
                <svg v-if="loading" class="inline w-4 h-4 text-header animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                <span v-else>Redeem</span>
              </button>
            </div>
          </div>
        </template>
      </template>
      <template v-else-if="user.tier > 0">
        <h1 class="text-2xl font-semibold text-white">Thank you for upgrading to PRO! &lt;3</h1>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {redeemOrder} from "~/composables/api/redeem";
import {onMounted, ref, useToken, useUser} from "#imports";
import {Ref} from "@vue/reactivity";
import {getUser} from "~/composables/api/user";
import {navigateTo} from "#app";
import {Capacitor} from "@capacitor/core";
import "cordova-plugin-purchase";
import {postAppleOrder, postGoogleOrder} from "~/composables/api/order";

const PRODUCT_ID = 'pro';

const token = useToken();
const user = useUser();

const loading = ref(false);
const coinbaseCommerceOrderId: Ref<string> = ref(null);
const iapProducts = ref([]);
const iapOrderInProcess = ref(false);

onMounted(async () => {
  if (!token.value) {
    await navigateTo("/login", {replace: true});
  }

  if (Capacitor.isNativePlatform()) {
    if (!window.CdvPurchase) {
      console.log("This device does not support IAP.");
      return;
    }

    const {store} = CdvPurchase;

    store.register({
      id: PRODUCT_ID,
      type: CdvPurchase.ProductType.CONSUMABLE,
      platform: store.defaultPlatform(),
    });

    store.when()
        .approved((tx: CdvPurchase.Transaction) => {
          console.log(`[IAP] approved ${JSON.stringify(tx)}`);

          if (Capacitor.getPlatform() == "android") {
            sendGoogleOrder(tx);
          } else if (Capacitor.getPlatform() == "ios") {
            if (!tx.transactionId.includes("appstore.application")) {
              sendAppleOrder(tx);
            }
          }

          tx.verify();
        });

    store.when()
        .verified((rc: CdvPurchase.VerifiedReceipt) => {
          console.log(`[IAP] receipt ${JSON.stringify(rc)}`);
          rc.finish()
        });

    // Track all store errors
    store.error((err) => {
      console.error(`[IAP] error ${JSON.stringify(err)}`);
    });

    await store.initialize([store.defaultPlatform()]);
    await store.update();

    console.log(store.products);

    iapProducts.value = store.products;
  }
});

async function orderIap(code: string) {
  const {store} = CdvPurchase;

  const myProduct = CdvPurchase.store.get(code, store.defaultPlatform());

  console.log(`[IAP] Order product: ${JSON.stringify(myProduct)}`);

  const offer = myProduct.getOffer();

  console.log(`[IAP] Order offer: ${JSON.stringify(offer)}`);

  iapOrderInProcess.value = true;

  await offer.order().catch((err) => {
    console.error(`[IAP] Order error: ${err}`);
  });

  iapOrderInProcess.value = false;
}

async function sendGoogleOrder(order: CdvPurchase.Transaction) {
  loading.value = true;

  await postGoogleOrder(order)
      .then(async (orderId) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        redeemOrder(orderId)
            .then(() => {
              loading.value = false;
              getUser();
            })
            .catch((err) => {
              loading.value = false;
              alert(err);
            });
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });
}

async function sendAppleOrder(order: CdvPurchase.Transaction) {
  loading.value = true;

  await postAppleOrder(order)
      .then(async (orderId) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        redeemOrder(orderId)
            .then(() => {
              loading.value = false;
              getUser();
            })
            .catch((err) => {
              loading.value = false;
              alert(err);
            });
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });
}

function redeemOrderIdCoinbaseCommerce() {
  if (!coinbaseCommerceOrderId.value) return;

  loading.value = true;

  redeemOrder(coinbaseCommerceOrderId.value)
      .then(() => {
        loading.value = false;
        getUser();
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });
}

function buttonDisabled(): boolean {
  return loading.value || iapOrderInProcess.value;
}
</script>

<style scoped>

</style>
