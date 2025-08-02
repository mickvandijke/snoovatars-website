<template>
  <VirtualGrid :items="items">
    <template #default="{ item, index }">
      <AvatarCard :item="{ name: item.token.name, contract_address: item.token.contract_address, image: item.token.image, mint_number: item.token.mint_number }" :series-stats="getSeriesStats(item.token.contract_address, item.token.name)">
        <template #footer>
          <ListingsComponentItem :item="item" />
        </template>
      </AvatarCard>
    </template>
  </VirtualGrid>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {
  getSeriesStats
} from "~/composables/states";
import {Listing} from "~/types/listing";
import ListingsComponentItem from "~/components/ListingsComponentItem.vue";

const props = defineProps({
  items: Array as PropType<Listing[]>
});
</script>

<style scoped>

</style>
