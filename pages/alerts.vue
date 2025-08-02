<template>
  <div class="alerts-view relative flex flex-col w-full min-h-screen bg-[#141415]">
    <MenuBar>
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-semibold text-white">Price Alerts</h1>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <template v-if="user && !loading">
          <button 
            @click="openAlertModal" 
            :disabled="alerts.size >= alertMaxQuota?.alerts" 
            class="px-4 py-2.5 bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:hover:bg-zinc-800 text-black disabled:text-zinc-600 text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>Create Alert</span>
          </button>
        </template>
      </div>
    </MenuBar>
    
    <div class="flex-1">
      <!-- Authentication Required State -->
      <template v-if="!user">
        <AuthenticationRequired />
      </template>

      <!-- Loading State -->
      <template v-else-if="loading">
        <div class="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div class="text-center py-16 px-4">
            <div class="inline-flex items-center justify-center w-12 h-12 mb-4">
              <svg class="w-8 h-8 text-orange-500 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p class="text-sm text-zinc-400">Loading alerts...</p>
          </div>
        </div>
      </template>

      <!-- Main Content -->
      <template v-else>
        <div class="px-4 lg:px-6 py-6 space-y-8">
          
          <!-- Pro Upgrade Notice -->
          <template v-if="user.tier < 1">
            <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
              <div class="flex items-start gap-4">
                <div class="flex-shrink-0">
                  <svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-amber-400 mb-1">Pro Features Required</h3>
                  <p class="text-sm text-zinc-300 mb-3">
                    Although you can create price alerts, they will not fire until you upgrade to Pro and enable email and/or push notifications.
                  </p>
                  <NuxtLink 
                    to="/upgrade" 
                    class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-all duration-200"
                  >
                    <span>Upgrade to Pro</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </template>

          <!-- Alert Settings -->
          <template v-if="userSettings">
            <div class="bg-zinc-800/30 rounded-xl border border-zinc-700/30 overflow-hidden">
              <div class="px-6 py-4 border-b border-zinc-800">
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-semibold text-white">Notification Settings</h2>
                  <template v-if="user.tier < 1">
                    <NuxtLink 
                      to="/upgrade" 
                      class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-all duration-200"
                    >
                      Upgrade
                    </NuxtLink>
                  </template>
                </div>
              </div>
              <div class="px-6 py-4">
                <div class="space-y-4">
                  <template v-if="user.tier >= 0">
                    <template v-for="[key, value] in Object.entries(userSettings)" :key="key">
                      <div class="flex items-center justify-between py-2">
                        <div>
                          <label class="text-sm font-medium text-white">{{ key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) }}</label>
                          <p class="text-xs text-zinc-400 mt-0.5">
                            {{ getSettingDescription(key) }}
                          </p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input 
                            v-model="userSettings[key]" 
                            type="checkbox" 
                            class="sr-only peer"
                          />
                          <div class="relative w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <template v-for="[key, value] in Object.entries(userSettings)" :key="key">
                      <div class="flex items-center justify-between py-2 opacity-60">
                        <div>
                          <label class="text-sm font-medium text-white">{{ key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) }}</label>
                          <div class="flex items-center gap-2 mt-0.5">
                            <p class="text-xs text-zinc-400">{{ getSettingDescription(key) }}</p>
                            <NuxtLink to="/upgrade" class="text-amber-400 text-xs font-medium hover:text-amber-300">Pro</NuxtLink>
                          </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-not-allowed">
                          <input 
                            type="checkbox" 
                            disabled
                            class="sr-only peer"
                          />
                          <div class="relative w-11 h-6 bg-zinc-700/50 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-500 after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </template>

          <!-- Active Alerts -->
          <div class="bg-zinc-800/30 rounded-xl border border-zinc-700/30 overflow-hidden">
            <div class="px-6 py-4 border-b border-zinc-800">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-white">Active Alerts</h2>
                <div class="flex items-center gap-2 text-sm text-zinc-400">
                  <span>{{ alerts.size }}</span>
                  <span>/</span>
                  <span>{{ alertMaxQuota?.alerts || 0 }}</span>
                </div>
              </div>
            </div>
            <div class="px-6 py-4">
              <template v-if="alerts.size > 0">
                <div class="space-y-3">
                  <template v-for="[alertHash, alert] in alerts" :key="alertHash">
                    <div class="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/30">
                      <div class="flex items-center gap-4">
                        <!-- Avatar Image -->
                        <div class="flex-shrink-0">
                          <div class="w-12 h-12 rounded-lg overflow-hidden bg-zinc-700">
                            <template v-if="getSeries(alert.collection_tier_hash)">
                              <img 
                                :src="getSeries(alert.collection_tier_hash).image" 
                                :alt="getSeries(alert.collection_tier_hash).name"
                                class="w-full h-full object-cover"
                                @error="$event.target.style.display='none'"
                              >
                            </template>
                            <template v-else>
                              <div class="w-full h-full flex items-center justify-center">
                                <template v-if="isAlertDataLoaded(alert)">
                                  <svg class="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                </template>
                                <template v-else>
                                  <svg class="w-4 h-4 text-zinc-500 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                </template>
                              </div>
                            </template>
                          </div>
                        </div>
                        
                        <!-- Alert Details -->
                        <div class="flex-1 min-w-0">
                          <h3 class="text-sm font-medium text-white truncate">
                            {{ getAlertTitle(alert) }}
                          </h3>
                          <div class="flex items-center gap-4 mt-1">
                            <span class="text-xs text-zinc-400">
                              {{ alert.alert_type.toString().replace("SaleAbove", "Sale Above").replace("ListingBelow", "Listing Below") }}
                            </span>
                            <div class="flex items-center gap-1">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-zinc-400">
                                <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
                              </svg>
                              <span class="text-xs font-medium text-white">{{ alert.price_threshold }}</span>
                            </div>
                            <template v-if="alert.max_mint_number > 0">
                              <span class="text-xs text-zinc-400">Max mint: {{ alert.max_mint_number }}</span>
                            </template>
                            <template v-if="alert.repeating">
                              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
                                Repeating
                              </span>
                            </template>
                          </div>
                        </div>
                        
                        <!-- Actions -->
                        <div class="flex items-center gap-2">
                          <button 
                            @click="openAlertModal(alertHash, alert)"
                            :disabled="!isAlertDataLoaded(alert)"
                            class="p-2 hover:bg-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed text-zinc-400 hover:text-white rounded-lg transition-all duration-200"
                            title="Edit Alert"
                          >
                            <PencilSquareIcon class="w-4 h-4" />
                          </button>
                          <button 
                            @click="deleteAlert(alertHash)"
                            class="p-2 hover:bg-zinc-700/50 text-zinc-400 hover:text-red-400 rounded-lg transition-all duration-200"
                            title="Delete Alert"
                          >
                            <TrashIcon class="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-else>
                <div class="text-center py-12">
                  <div class="mx-auto h-12 w-12 text-zinc-600 mb-4">
                    <BellIcon class="w-full h-full" />
                  </div>
                  <h3 class="text-sm font-medium text-white mb-2">No alerts created</h3>
                  <p class="text-sm text-zinc-400 mb-4">Create your first price alert to get notified when items meet your criteria</p>
                  <button 
                    @click="openAlertModal" 
                    :disabled="alerts.size >= alertMaxQuota?.alerts"
                    class="px-4 py-2 bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:hover:bg-zinc-800 text-black disabled:text-zinc-600 text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                  >
                    Create Alert
                  </button>
                </div>
              </template>
            </div>
          </div>

          <!-- Usage Information -->
          <div class="bg-zinc-800/30 rounded-xl border border-zinc-700/30 overflow-hidden">
            <div class="px-6 py-4 border-b border-zinc-800">
              <h2 class="text-lg font-semibold text-white">Usage & Limits</h2>
            </div>
            <div class="px-6 py-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-zinc-400">Concurrent Alerts</span>
                    <span class="text-sm font-medium text-white">{{ alerts.size }}/{{ alertMaxQuota?.alerts || 0 }}</span>
                  </div>
                  <div class="w-full bg-zinc-700 rounded-full h-2">
                    <div 
                      class="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                      :style="{ width: `${alertMaxQuota?.alerts ? (alerts.size / alertMaxQuota.alerts) * 100 : 0}%` }"
                    ></div>
                  </div>
                </div>
                <div v-if="user.tier >= 1">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-zinc-400">Plan</span>
                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-amber-500/20 text-amber-400">
                      Pro User
                    </span>
                  </div>
                  <p class="text-xs text-zinc-500">Unlimited alerts and notifications</p>
                </div>
                <div v-else>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-zinc-400">Plan</span>
                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-zinc-600/50 text-zinc-400">
                      Free User
                    </span>
                  </div>
                  <p class="text-xs text-zinc-500">Limited alerts, upgrade for more features</p>
                </div>
              </div>
              
              <div class="mt-6 p-4 bg-zinc-900/50 rounded-lg">
                <p class="text-xs text-zinc-400 flex items-start gap-2">
                  <svg class="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>To prevent price notifications from ending up in your spam folder, you might have to whitelist service@snoovatars.com in your email settings.</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </template>
    </div>

    <!-- Alert Modal -->
    <template v-if="addingAlert">
      <div class="fixed inset-0 h-screen flex justify-center items-center bg-black/50 z-50">
        <div v-click-outside="cancelAlert" class="relative w-full max-w-lg mx-4 flex flex-col bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-zinc-800">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-white">{{ !!replacingAlertHash ? "Update" : "Create" }} Alert</h3>
              <button @click="cancelAlert" class="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-all duration-200">
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <!-- Modal Content -->
          <div class="px-6 py-6 max-h-[60vh] overflow-y-auto">
            <div class="space-y-6">
              <!-- Avatar Selection -->
              <div>
                <label class="block text-sm font-medium text-white mb-2">Select Avatar</label>
                <select-search
                  id="tier"
                  v-model="newAlert.collection_tier_hash"
                  :options="seriesOptions"
                  :placeholder="newAlert.collection_tier_hash ? series.get(newAlert.collection_tier_hash).name : 'Type to search for an avatar'"
                  @change="onSelectedTier"
                />
                <p class="text-xs text-zinc-400 mt-1">Start typing to search for a specific avatar collection</p>
              </div>

              <!-- Max Mint Number -->
              <div>
                <label for="max-mint-number" class="block text-sm font-medium text-white mb-2">Max Mint Number</label>
                <input 
                  type="number" 
                  min="0" 
                  :max="series.get(newAlert.collection_tier_hash) ? series.get(newAlert.collection_tier_hash).mints : 0" 
                  :disabled="newAlert.item_hash" 
                  required 
                  v-model="newAlert.max_mint_number" 
                  id="max-mint-number" 
                  class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="0"
                >
                <p class="text-xs text-zinc-400 mt-1">Enter 0 to alert on any mint number</p>
              </div>

              <!-- Alert Type -->
              <div>
                <label for="type" class="block text-sm font-medium text-white mb-2">Alert Type</label>
                <select 
                  required 
                  v-model="newAlert.alert_type" 
                  id="type" 
                  class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                >
                  <option :value="AlertType.ListingBelow">Listing below price threshold</option>
                  <option :value="AlertType.SaleAbove">Sale above price threshold</option>
                </select>
              </div>

              <!-- Price Threshold -->
              <div>
                <label for="price-threshold" class="block text-sm font-medium text-white mb-2">Price Threshold (ETH)</label>
                <input 
                  type="number" 
                  min="0" 
                  max="1000" 
                  step="0.001"
                  required 
                  v-model="newAlert.price_threshold" 
                  id="price-threshold" 
                  class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  placeholder="0.0"
                >
              </div>

              <!-- Repeating -->
              <div>
                <label for="repeating" class="block text-sm font-medium text-white mb-2">Frequency</label>
                <select 
                  required 
                  v-model="newAlert.repeating" 
                  id="repeating" 
                  class="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                >
                  <option :value="false">Only alert once</option>
                  <option :value="true">Repeating alert</option>
                </select>
                <p class="text-xs text-zinc-400 mt-1">Repeating alerts will notify you every time the condition is met</p>
              </div>
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-zinc-800 flex items-center gap-3">
            <button 
              @click="submitAlert" 
              :disabled="!newAlert.isValid()" 
              class="flex-1 px-4 py-2 bg-white hover:bg-zinc-100 disabled:bg-zinc-800 disabled:hover:bg-zinc-800 text-black disabled:text-zinc-600 text-sm font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              {{ !!replacingAlertHash ? "Update" : "Create" }} Alert
            </button>
            <button 
              @click="cancelAlert" 
              class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-medium rounded-lg transition-all duration-200"
            >
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
import {PencilSquareIcon, TrashIcon, XMarkIcon, BellIcon} from "@heroicons/vue/24/solid";

const loading = ref(true);
const series = useSeriesHashed();
const avatars = useAvatarList();
const alerts = useAlertList();
const alertQuota: Ref<AlertQuota> = ref(null);
const alertMaxQuota: Ref<AlertMaxQuota> = ref(null);
const user = useUser();
const token = useToken();
const config = useRuntimeConfig();
const BACKEND_ADDR = config.public.apiBaseUrl;
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

onBeforeMount(async () => {
  await updateSeriesHashed();
});

onMounted(async () => {
  if (token.value) {
    // Ensure series data is loaded before loading alerts
    await updateSeriesHashed();
    loadAlerts();
    loadUserSettings().then(() => {
      userSettings.value = JSON.parse(JSON.stringify(useUserSettings().value));
    });
  }
});

watch([token], async () => {
  if (token.value) {
    // Ensure series data is loaded before loading alerts
    await updateSeriesHashed();
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

// Watch for series data changes to re-render alerts when data becomes available
watch([series], () => {
  // Force reactivity update when series data changes
  // This helps with alerts that were loaded before series data was available
}, { deep: true });

function getSeries(seriesHash: string) {
  return series.value.get(seriesHash);
}

function getSettingDescription(key: string): string {
  const descriptions = {
    'shop_new_paid_avatars_alert': 'Get notified when new premium avatars are released in the shop',
    'new_deployed_contracts_alert': 'Get notified when new avatar collections are deployed',
    'email_notifications': 'Receive price alerts and updates via email',
    'push_notifications': 'Receive price alerts and updates via push notifications'
  };
  return descriptions[key] || 'Toggle this notification setting';
}

function getAlertTitle(alert: Alert): string {
  if (alert.item_hash) {
    const avatar = avatars.value.get(alert.item_hash);
    return avatar?.fullname() || 'Avatar Data Loading...';
  } else {
    const seriesData = series.value.get(alert.collection_tier_hash);
    return seriesData?.name || 'Series Data Loading...';
  }
}

function isAlertDataLoaded(alert: Alert): boolean {
  if (alert.item_hash) {
    return avatars.value.has(alert.item_hash);
  } else {
    return series.value.has(alert.collection_tier_hash);
  }
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

async function loadAlerts() {
  loading.value = true;

  try {
    const res = await getAlerts();
    if (res.alerts) alerts.value = res.alerts;
    if (res.alertQuota) alertQuota.value = res.alertQuota;
    if (res.alertMaxQuota) alertMaxQuota.value = res.alertMaxQuota;

    // Ensure series data is available for all alerts
    if (res.alerts && res.alerts.size > 0) {
      const alertArray = Array.from(res.alerts.values());
      const missingSeriesHashes = alertArray
        .map(alert => alert.collection_tier_hash)
        .filter(hash => !series.value.has(hash));
      
      if (missingSeriesHashes.length > 0) {
        // Wait a bit more for series data to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        // If still missing, try to update series data one more time
        if (missingSeriesHashes.some(hash => !series.value.has(hash))) {
          await updateSeriesHashed();
        }
      }
    }

    loading.value = false;
  } catch (err) {
    alert(err);
    loading.value = false;
  }
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
.alerts-view {
  /* Add any specific styles for the alerts view if needed */
}
</style>
