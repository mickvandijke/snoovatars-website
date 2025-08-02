<template>
  <VirtualGrid :items="items">
    <template #default="{ item, index }">
      <AvatarCard
          :item="{ name: item.series.name, contract_address: item.series.contract_address, image: item.series.image }"
          :series-stats="item"
          :hide-floor="!sortingOnShop"
          :ranking="index + 1"
          class="h-full"
      >
        <SeriesStatsComponentItem :item="item" :sorting="sorting" />
      </AvatarCard>
    </template>
  </VirtualGrid>
</template>

<script setup lang="ts">
import {SeriesStats} from "~/types/seriesStats";
import {PropType} from "@vue/runtime-core";
import {
  useWatchList,
} from "~/composables/states";
import {computed} from "#imports";

const watchList = useWatchList();

const props = defineProps({
  items: Array as PropType<SeriesStats[]>,
  sorting: String
});

const sortingOnShop = computed(() => {
  return props.sorting === 'highestShopAvailableAbsolute' || props.sorting === 'lowestShopAvailableAbsolute' || props.sorting === 'highestShopAvailablePercentage' || props.sorting === 'lowestShopAvailablePercentage' || props.sorting === 'lowestShopNextMint';
});
</script>

<style scoped>

</style>
