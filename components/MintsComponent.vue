<template>
  <VirtualGrid :items="items">
    <template #default="{ item, index }">
      <AvatarCard :item="{ name: item.token.name, contract_address: item.token.contract_address, image: item.token.image }" :series-stats="getSeriesStats(item.token.contract_address, item.token.name)">
        <MintsComponentItem :item="item" />
      </AvatarCard>
    </template>
  </VirtualGrid>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {
  getSeriesStats
} from "~/composables/states";
import {Mint} from "~/types/mint";
import MintsComponentItem from "~/components/MintsComponentItem.vue";

const props = defineProps({
  items: Array as PropType<Mint[]>
});
</script>

<style scoped>

</style>
