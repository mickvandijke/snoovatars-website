<template>
  <div class="px-4 py-3 flex flex-col gap-2 bg-neutral-800 rounded-lg">
    <h1 class="text-xs text-neutral-400 font-bold">Last 5 sales:</h1>
    <div class="flex flex-col gap-2">
      <template v-for="(sale, index) in sales.slice(0, 5)" :key="index">
        <div class="grid grid-cols-11 items-center font-bold text-xs gap-2">
          <div class="flex items-center col-span-5">
            <div class="flex items-center gap-0.5">
              <template v-if="sale.payment_token.symbol === 'ETH'">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="text-neutral-200 font-bold">{{( sale.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                </div>
                <div class="text-neutral-300 font-bold">({{ ethereumInLocalCurrency(sale.payment_token.base_price) }})</div>
                <a :href="`https://opensea.io/assets/matic/${sale.token.contract_address}/${sale.token.id}`" target="_blank" class="text-amber-500">#{{ sale.token.mint_number }}</a>
              </template>
              <template v-else>
                <div class="flex items-center w-3 h-3 text-orange-500">M</div>
                <div class="text-neutral-200 font-bold">{{ (sale.payment_token.base_price / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
              </template>
            </div>
          </div>
          <div class="flex items-center gap-1 col-span-3">
            <div class="text-neutral-400 text-xs">Buyer:</div>
            <div class="px-1.5 py-1 flex items-center bg-black/10 rounded-md">
              <a :href="`https://opensea.io/${sale.buyer}`" target="_blank" class="text-amber-500">{{ sale.buyer.slice(2, 6) }}</a>
            </div>
          </div>
          <div class="text-neutral-400 col-span-3 text-right" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ $timeAgo(new Date(sale.date_sold)) }} ago</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Ref} from "@vue/reactivity";
import {Sale} from "~/types/sale";
import {onBeforeMount, ref} from "#imports";
import {fetchSalesForSeries} from "~/composables/api/sales";
import {ethereumInLocalCurrency} from "#imports";

const sales: Ref<Array<Sale>> = ref([]);

const props = defineProps({
  contract: {
    type: String,
    required: true
  },
  series: {
    type: String,
    required: true
  }
});

onBeforeMount(() => {
  fetchSalesForSeries(props.contract, props.series).then((seriesSales) => {
    sales.value = seriesSales;
  });
});
</script>

<style scoped>

</style>
