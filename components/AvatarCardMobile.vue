<template>
  <div 
    @click="selectAvatar" 
    ref="componentRef" 
    class="group relative cursor-pointer transition-all duration-300 w-full flex items-start gap-3 p-2 border-b border-zinc-700/30"
  >
    <template v-if="seriesStats">
      <!-- Left: Avatar Image -->
      <div class="relative flex-shrink-0 w-16">
        <button 
          @click.stop="selectAvatar" 
          class="relative block"
        >
          <img-placeholder 
            img-class="w-16 h-auto object-contain scale-105" 
            :src="getTokenImage(seriesStats.series.image)" 
          />
        </button>
        
        <!-- Supply Badge - Top Left of Image -->
        <div v-if="seriesStats.series.total_quantity <= 9999" class="absolute top-0.5 left-0.5">
          <div class="flex items-center gap-1 px-1.5 py-0.5 bg-black/80 backdrop-blur-md text-xs font-semibold text-white rounded-full border border-white/20" :class="seriesStats.series.total_quantity <= 600 ? rarityInfo.color : 'text-white'">
            <span v-if="seriesStats.series.total_quantity <= 600" class="text-[10px] leading-none">{{ rarityInfo.icon }}</span>
            <span class="text-[10px] leading-none">{{ seriesStats.series.total_quantity }}</span>
          </div>
        </div>
      </div>
      
      <!-- Right: Content -->
      <div class="flex-1 min-w-0">
        <!-- Title and Watchlist Row -->
        <div class="flex items-center justify-between gap-2">
          <button 
            @click.stop="openLinkWith(marketplaceLink(seriesStats))" 
            class="text-left flex-1 text-white font-medium text-sm transition-colors duration-200 truncate whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {{ seriesStats.series.name }}
          </button>
          
          <div class="flex items-center gap-2 flex-shrink-0">
            <template v-if="ranking">
              <span class="text-xs font-medium text-zinc-400">#{{ ranking }}</span>
            </template>
            
            <!-- Watchlist Button -->
            <template v-if="watchList.has(seriesStats.collection.contract_address + seriesStats.series.name)">
              <button 
                @click.stop="removeFromWatchList(seriesStats.series.contract_address + seriesStats.series.name)" 
                class="p-1 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                <StarIcon class="w-4 h-4 text-yellow-400" />
              </button>
            </template>
            <template v-else>
              <button 
                @click.stop="addToWatchList(seriesStats.collection.contract_address + seriesStats.series.name)" 
                class="p-1 rounded-full hover:bg-white/10 transition-all duration-200 group/star"
              >
                <StarIconOutlined class="w-4 h-4 text-white/60 group-hover/star:text-yellow-400 transition-colors duration-200" />
              </button>
            </template>
          </div>
        </div>
        
        <!-- Stats Section -->
        <div>
          <slot></slot>
        </div>
        
        <!-- Footer -->
        <div v-if="!$slots.footer" class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <div class="text-xs" :class="{ 'text-green-400': seriesStats.series.total_sold < seriesStats.series.total_quantity, 'text-red-400': seriesStats.series.total_sold >= seriesStats.series.total_quantity }">
              <template v-if="seriesStats && seriesStats.series.mint_price > 0">
                ${{ seriesStats.series.mint_price / 100.00 }}
              </template>
              <template v-else>
                FREE
              </template>
            </div>
            <template v-if="item.mint_number">
              <span class="text-xs font-medium text-zinc-400">#{{ item.mint_number }}</span>
            </template>
          </div>
          <div class="text-xs text-zinc-400">{{ getGeneration }}</div>
        </div>
        
        <!-- Custom Footer Slot -->
        <div v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, useSelectedAvatar} from "#imports";
import {PropType} from "@vue/runtime-core";
import {SeriesStats} from "~/types/seriesStats";
import {InformationCircleIcon, StarIcon as StarIconOutlined} from "@heroicons/vue/24/outline";
import {useWatchList, addToWatchList, removeFromWatchList} from "#imports";
import {StarIcon} from "@heroicons/vue/20/solid";
import {getTokenImage} from "~/global/utils";
import {findCollectionNameByContractAddress} from "~/global/generations";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {marketplaceLink} from "~/global/marketplace";
import {getMintClasses, getMintClassesText, getRarityInfo} from "~/global/mint";

export interface AvatarCardItem {
  name: string;
  contract_address: string;
  image: string;
  mint_number?: number;
}

const watchList = useWatchList();
const selectedAvatar = useSelectedAvatar();

const componentRef = ref(null);

const props = defineProps({
  item: {
    type: Object as PropType<AvatarCardItem>,
    required: true
  },
  seriesStats: {
    type: Object as PropType<SeriesStats>,
    required: true
  },
  hideFloor: {
    type: Boolean,
    required: false,
    default: () => false
  },
  ranking: {
    type: Number,
    required: false
  }
});

const getGeneration = computed(() => {
  return findCollectionNameByContractAddress(props.item.contract_address);
});

const rarityInfo = computed(() => {
  return getRarityInfo(props.seriesStats.series.total_quantity);
});

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

function selectAvatar() {
  hapticsImpactLight();

  selectedAvatar.value = {
    seriesStats: props.seriesStats,
    contract: props.seriesStats.series.contract_address,
    series: props.seriesStats.series.name
  }
}
</script>