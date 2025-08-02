<template>
  <div class="shop-page">
    <MenuBar class="shop-controls">
      <SearchBar v-model:search-term="searchTerm" :placeholder="`Search by Name or Artist`" />
      <select class="ml-auto uniform-select" v-model="settings.shop.showAvailable">
        <option :value="true">Released: Show</option>
        <option :value="false">Released: Hide</option>
      </select>
      <template v-if="!Capacitor.isNativePlatform()">
        <RefreshButton class="sm:ml-0" :action="refresh" :refreshing="isRefreshing" />
      </template>
    </MenuBar>
    
    <div class="px-4 lg:px-6 py-6">
      <!-- Newly Released Section -->
      <div v-if="newlyReleasedItems.length > 0 && settings.shop.showAvailable" class="mb-12">
        <div class="section-header">
          <div class="section-title-container">
            <h2 class="section-title">✨ Newly Released</h2>
            <p class="section-subtitle">Fresh drops from the last 48 hours</p>
          </div>
          <div class="section-badge">
            {{ newlyReleasedItems.length }} {{ newlyReleasedItems.length === 1 ? 'item' : 'items' }}
          </div>
        </div>
        <div class="shop-grid">
        <template v-for="item in newlyReleasedItems" :key="item['edge']['node']['item']['benefits']['avatarOutfit']['id']">
        <div class="avatar-card group">
          <div class="avatar-image-container">
            <a :href="`https://www.reddit.com/avatar/shop/product/storefront_nft_${item['edge']['node']['item']['benefits']['avatarOutfit']['id']}`" target="_blank" class="avatar-image-link">
              <div class="relative max-w-full z-20">
                <ImgPlaceholder :src="item['edge']['node']['item']['benefits']['avatarOutfit']['preRenderImage']['url']" class="avatar-image" />
              </div>
              <div class="absolute inset-0 z-10 flex items-center justify-center">
                <ImgPlaceholder :src="item['edge']['node']['item']['benefits']['avatarOutfit']['preRenderImage']['url']" img-class="avatar-image blur-3xl opacity-40" />
              </div>
            </a>
          </div>
          
          <div class="avatar-content">
            <div class="avatar-header">
              <h3 class="avatar-title">{{ item['edge']['node']['item']['name'] }}</h3>
              <div class="avatar-artist">
                <span class="artist-label">by</span>
                <template v-if="item['edge']['node']['artist']">
                  <a :href="`https://reddit.com/u/${item['edge']['node']['artist']['redditorInfo']['displayName']}`" target="_blank" class="artist-link">
                    {{ item['edge']['node']['artist']['redditorInfo']['displayName'] }}
                  </a>
                </template>
                <template v-else>
                  <span class="artist-unknown">Unknown Artist</span>
                </template>
              </div>
            </div>
            
            <div class="avatar-meta">
              <div class="meta-item">
                <span class="meta-label">Supply</span>
                <span class="meta-value supply-value" :class="getMintClassesText(item['edge']['node']['totalQuantity'])">
                  {{ item['edge']['node']['totalQuantity'] }}
                </span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Price</span>
                <span class="meta-value price-value">
                  ${{ item['edge']['node']['productOffer']['pricePackages'][0]['price'] / 100.00 }}
                </span>
              </div>
            </div>
            
            <div class="avatar-timing">
              <template v-if="item['date_available']">
                <span class="timing-label">Released</span>
                <span class="timing-value">{{ $timeAgo(new Date(item['date_available'])) }} ago</span>
              </template>
              <template v-else>
                <span class="timing-label">Found</span>
                <span class="timing-value">{{ $timeAgo(new Date(item['date_found'])) }} ago</span>
              </template>
            </div>
            
            <div class="avatar-actions">
              <template v-if="item['edge']['node']['status'] === 'PENDING'">
                <a :href="`https://www.reddit.com/avatar/shop/product/storefront_nft_${item['edge']['node']['item']['benefits']['avatarOutfit']['id']}`" target="_blank" class="action-button action-pending">
                  <ClockIcon class="action-icon" />
                  <span>Coming Soon</span>
                </a>
              </template>
              <template v-else-if="item['edge']['node']['status'] === 'AVAILABLE'">
                <a :href="`https://www.reddit.com/avatar/shop/product/storefront_nft_${item['edge']['node']['item']['benefits']['avatarOutfit']['id']}`" target="_blank" class="action-button action-buy">
                  <span>Buy Now</span>
                </a>
              </template>
            </div>
          </div>
        </div>
        </template>
        </div>
      </div>
      
      <!-- Pending Release Section -->
      <div v-if="pendingReleaseItems.length > 0" class="mb-12">
        <div class="section-header">
          <div class="section-title-container">
            <h2 class="section-title">⏳ Pending Release</h2>
            <p class="section-subtitle">Coming soon to the shop</p>
          </div>
          <div class="section-badge">
            {{ pendingReleaseItems.length }} {{ pendingReleaseItems.length === 1 ? 'item' : 'items' }}
          </div>
        </div>
        <div class="shop-grid">
        <template v-for="item in pendingReleaseItems" :key="item['edge']['node']['item']['benefits']['avatarOutfit']['id']">
        <div class="avatar-card group">
          <div class="avatar-image-container">
            <a :href="`https://www.reddit.com/avatar/shop/product/storefront_nft_${item['edge']['node']['item']['benefits']['avatarOutfit']['id']}`" target="_blank" class="avatar-image-link">
              <div class="relative max-w-full z-20">
                <ImgPlaceholder :src="item['edge']['node']['item']['benefits']['avatarOutfit']['preRenderImage']['url']" class="avatar-image" />
              </div>
              <div class="absolute inset-0 z-10 flex items-center justify-center">
                <ImgPlaceholder :src="item['edge']['node']['item']['benefits']['avatarOutfit']['preRenderImage']['url']" img-class="avatar-image blur-3xl opacity-40" />
              </div>
            </a>
          </div>
          
          <div class="avatar-content">
            <div class="avatar-header">
              <h3 class="avatar-title">{{ item['edge']['node']['item']['name'] }}</h3>
              <div class="avatar-artist">
                <span class="artist-label">by</span>
                <template v-if="item['edge']['node']['artist']">
                  <a :href="`https://reddit.com/u/${item['edge']['node']['artist']['redditorInfo']['displayName']}`" target="_blank" class="artist-link">
                    {{ item['edge']['node']['artist']['redditorInfo']['displayName'] }}
                  </a>
                </template>
                <template v-else>
                  <span class="artist-unknown">Unknown Artist</span>
                </template>
              </div>
            </div>
            
            <div class="avatar-meta">
              <div class="meta-item">
                <span class="meta-label">Supply</span>
                <span class="meta-value supply-value" :class="getMintClassesText(item['edge']['node']['totalQuantity'])">
                  {{ item['edge']['node']['totalQuantity'] }}
                </span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Price</span>
                <span class="meta-value price-value">
                  ${{ item['edge']['node']['productOffer']['pricePackages'][0]['price'] / 100.00 }}
                </span>
              </div>
            </div>
            
            <div class="avatar-timing">
              <template v-if="item['date_available']">
                <span class="timing-label">Released</span>
                <span class="timing-value">{{ $timeAgo(new Date(item['date_available'])) }} ago</span>
              </template>
              <template v-else>
                <span class="timing-label">Found</span>
                <span class="timing-value">{{ $timeAgo(new Date(item['date_found'])) }} ago</span>
              </template>
            </div>
            
            <div class="avatar-actions">
              <template v-if="item['edge']['node']['status'] === 'PENDING'">
                <a :href="`https://www.reddit.com/avatar/shop/product/storefront_nft_${item['edge']['node']['item']['benefits']['avatarOutfit']['id']}`" target="_blank" class="action-button action-pending">
                  <ClockIcon class="action-icon" />
                  <span>Coming Soon</span>
                </a>
              </template>
              <template v-else-if="item['edge']['node']['status'] === 'AVAILABLE'">
                <a :href="`https://www.reddit.com/avatar/shop/product/storefront_nft_${item['edge']['node']['item']['benefits']['avatarOutfit']['id']}`" target="_blank" class="action-button action-buy">
                  <span>Buy Now</span>
                </a>
              </template>
            </div>
          </div>
        </div>
        </template>
        </div>
      </div>
      
      <div class="shop-footer">
        <div class="no-more-results">
          <span class="no-more-text">No more results</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Ref} from "@vue/reactivity";
import {getUnreleasedItems} from "~/composables/api/unreleased";
import {ClockIcon} from "@heroicons/vue/24/outline";
import {getMintClassesText} from "~/global/mint";
import {ComputedRef} from "vue";
import {Filters} from "~/global/generations";
import {Capacitor} from "@capacitor/core";
import MenuBar from "~/components/MenuBar.vue";
import SearchBar from "~/components/SearchBar.vue";
import {ref, useSettings} from "#imports";

const settings = useSettings();

const items: Ref<Array<Object>> = ref([]);
const isRefreshing = ref(false);
const searchTerm = ref('');

onBeforeMount(() => {
  refresh();
})

function refresh() {
  getUnreleasedItems()
      .then((value) => {
        items.value = value
      });
}

const usingFilter: ComputedRef<boolean> = computed(() => {
  return !settings.value.shop.showAvailable;
});

const twoDaysAgo = new Date().getTime() - 172800000; // 2 days in milliseconds

const newlyReleasedItems: ComputedRef<Array<Object>> = computed(() => {
  return Object.values(items.value).filter((v) => {
    let dateAvailable = v['date_available'] ? new Date(v['date_available']) : null;
    
    // Show items that are available and released within the last 2 days
    if (dateAvailable && v['edge']['node']['status'] === 'AVAILABLE') {
      return dateAvailable.getTime() > twoDaysAgo;
    }
    
    return false;
  }).sort((a, b) => {
    // Sort by newest released to oldest
    const dateA = new Date(a['date_available']);
    const dateB = new Date(b['date_available']);
    return dateB.getTime() - dateA.getTime();
  });
});

const pendingReleaseItems: ComputedRef<Array<Object>> = computed(() => {
  return Object.values(items.value).filter((v) => {
    // Show items that are pending release
    return v['edge']['node']['status'] === 'PENDING';
  }).sort((a, b) => {
    // Sort by most recently discovered to least
    const dateA = new Date(a['date_found']);
    const dateB = new Date(b['date_found']);
    return dateB.getTime() - dateA.getTime();
  });
});

const filteredItems: ComputedRef<Array<Object>> = computed(() => {
  return Object.values(items.value).filter((v) => {
    let dateAvailable = v['date_available'] ? new Date(v['date_available']) : null;

    if (!settings.value.shop.showAvailable && dateAvailable) {
      return false;
    }

    if (dateAvailable && dateAvailable.getSeconds() < twoDaysAgo) {
      return false;
    }

    // Search functionality
    if (searchTerm.value.trim()) {
      const searchLower = searchTerm.value.toLowerCase();
      const itemName = v['edge']['node']['item']['name']?.toLowerCase() || '';
      const artistName = v['edge']['node']['artist']?.['redditorInfo']?.['displayName']?.toLowerCase() || '';
      
      const matchesName = itemName.includes(searchLower);
      const matchesArtist = artistName.includes(searchLower);
      
      if (!matchesName && !matchesArtist) {
        return false;
      }
    }

    return true;
  });
});

const sortedItems: ComputedRef<Array<Object>> = computed(() => {
  return Object.values(filteredItems.value).sort((a, b) => {
    const dateAvailableA = new Date(a['date_available']);
    const dateAvailableB = new Date(b['date_available']);

    // First, compare by date_available
    if (dateAvailableA < dateAvailableB) {
      return 1;
    } else if (dateAvailableA > dateAvailableB) {
      return -1;
    } else {
      // If date_available is equal, compare by date_released
      const dateReleasedA = new Date(a['date_found']);
      const dateReleasedB = new Date(b['date_found']);

      return dateReleasedB - dateReleasedA;
    }
  });
});
</script>

<style scoped>
.shop-page {
  @apply flex flex-col w-full min-h-screen;
}

.shop-header {
  @apply relative bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border-b border-zinc-700/50;
}

.shop-header-content {
  @apply px-4 lg:px-6 py-8 lg:py-12;
}

.shop-title-section {
  @apply text-center max-w-4xl mx-auto;
}

.shop-title {
  @apply text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white via-orange-100 to-amber-200 bg-clip-text text-transparent mb-3;
}

.shop-subtitle {
  @apply text-lg lg:text-xl text-zinc-300 font-medium max-w-2xl mx-auto;
}

.shop-grid {
  @apply grid gap-3;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
}

/* Avatar Card Styling */
.avatar-card {
  @apply relative bg-zinc-800/30 border border-zinc-700/40 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/20;
  backdrop-filter: blur(12px);
}


.avatar-image-container {
  @apply relative p-6;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image-link {
  @apply block relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  @apply object-contain;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}


.avatar-content {
  @apply p-3 space-y-2;
}

.avatar-header {
  @apply space-y-0.5;
}

.avatar-title {
  @apply text-xs font-bold text-white leading-tight truncate;
}

.avatar-artist {
  @apply flex items-center gap-1 text-xs;
}

.artist-label {
  @apply text-zinc-400;
}

.artist-link {
  @apply text-zinc-500 hover:text-zinc-400 font-medium transition-colors duration-200;
}

.artist-unknown {
  @apply text-zinc-500 italic;
}

.avatar-meta {
  @apply grid grid-cols-2 gap-2 py-2 border-y border-zinc-700/50;
}

.meta-item {
  @apply text-center;
}

.meta-label {
  @apply block text-xs text-zinc-600 font-normal uppercase tracking-wider mb-0.5;
}

.meta-value {
  @apply block text-xs font-bold;
}

.supply-value {
  @apply text-zinc-200;
}

.price-value {
  @apply text-orange-400 text-xs;
}

.avatar-timing {
  @apply flex items-center justify-center gap-2 text-xs text-zinc-400;
}

.timing-label {
  @apply font-medium;
}

.timing-value {
  @apply text-zinc-300 font-semibold;
}

.avatar-actions {
  @apply pt-1;
}

.action-button {
  @apply flex items-center justify-center gap-1 w-full py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900;
}

.action-buy {
  @apply bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500 focus:ring-amber-500 shadow-lg shadow-amber-600/25;
}

.action-pending {
  @apply bg-zinc-700/50 text-zinc-300 hover:bg-zinc-600/50 hover:text-white focus:ring-zinc-500 border border-zinc-600/50;
}

.action-icon {
  @apply w-4 h-4;
}

/* Responsive Design */
@media (max-width: 640px) {
  .shop-grid {
    @apply gap-2;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }
  
  .shop-title {
    @apply text-2xl;
  }
  
  .shop-subtitle {
    @apply text-base;
  }
  
  .avatar-content {
    @apply p-2 space-y-1.5;
  }
  
  .avatar-title {
    @apply text-xs;
  }
  
  .avatar-meta {
    @apply gap-1 py-1;
  }
  
  .action-button {
    @apply py-1.5 text-xs;
  }
  
  .section-header {
    @apply flex-col items-start gap-3;
  }
  
  .section-title {
    @apply text-xl;
  }
  
  .section-badge {
    @apply self-start;
  }
}

@media (min-width: 1024px) {
  .shop-grid {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  }
}

@media (min-width: 1536px) {
  .shop-grid {
    @apply gap-4;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

/* Ensure consistent card heights */
.avatar-card {
  @apply flex flex-col;
}

.avatar-content {
  @apply flex-1 flex flex-col;
}

.avatar-actions {
  @apply mt-auto;
}

/* Section Headers */
.section-header {
  @apply flex items-center justify-between mb-6 pb-4 border-b border-zinc-700/50;
}

.section-title-container {
  @apply flex flex-col;
}

.section-title {
  @apply text-2xl font-bold text-white;
}

.section-subtitle {
  @apply text-sm text-zinc-400 mt-1;
}

.section-badge {
  @apply px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-xs font-medium text-zinc-300 backdrop-blur-sm;
}

/* Shop Footer */
.shop-footer {
}

.no-more-results {
  @apply flex justify-center py-8;
}

.no-more-text {
  @apply text-zinc-500 text-sm font-medium;
}
</style>
