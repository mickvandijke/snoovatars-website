<template>
  <VirtualGrid :items="items">
    <template #default="{ item, index }">
      <AvatarCard :item="{ name: item.token.name, contract_address: item.token.contract_address, image: item.token.image }" :series-stats="getSeriesStats(item.token.contract_address, item.token.name)">
        <SalesComponentItem :item="item" />
      </AvatarCard>
    </template>
  </VirtualGrid>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {Sale} from "~/types/sale";
import {
  getSeriesStats
} from "~/composables/states";
import SalesComponentItem from "~/components/SalesComponentItem.vue";

const props = defineProps({
  items: Array as PropType<Sale[]>
});
</script>

<style scoped>

</style>
