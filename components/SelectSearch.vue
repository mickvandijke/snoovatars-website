<template>
  <div class="relative block w-full">
    <div class="flex flex-row flex-nowrap">
      <input
          class="p-2.5 border-2 border-neutral-700 hover:border-neutral-600 rounded-2xl duration-200"
          v-model="search"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          @focus="focussed = true"
          @blur="focussed = false"
      >
    </div>
    <div
        v-if="(focussed || hoveringOptions) && filteredOptions().length > 0"
        id="options"
        class="absolute block mt-2 z-50 rounded-2xl divide-y divide-gray-100 shadow-lg bg-neutral-700 text-neutral-300 max-h-48 w-full overflow-y-auto"
        @mouseover="hoveringOptions = true"
        @mouseleave="hoveringOptions = false"
    >
      <ul class="py-1 text-sm">
        <li v-for="option in filteredOptions()">
          <button
              @click.prevent="selectValue(option.value)"
              class="inline-flex py-2 px-4 w-full text-sm hover:bg-neutral-600 hover:text-white duration-200"
          >
            <div class="inline-flex items-center">
              {{ option.name }}
            </div>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import {Ref} from "@vue/reactivity";
import {ref} from "#imports";
import {SelectSearchOption} from "~/types/select_search";

const focussed: Ref<boolean> = ref(false);
const hoveringOptions: Ref<boolean> = ref(false);
const search: Ref<string> = ref("");

const props = defineProps({
  modelValue: String,
  options: {
    type: Array as PropType<Array<SelectSearchOption>>,
    required: true
  },
  placeholder: String,
  disabled: Boolean
})

const emit = defineEmits(['update:modelValue', 'change'])

function selectValue(value) {
  emit('update:modelValue', value);
  emit('change');
  search.value = "";
  hoveringOptions.value = false;
}

function filteredOptions(): Array<SelectSearchOption> {
  if (search.value.length == 0) {
    return props.options.slice(0, 20);
  }

  return props.options.filter((option: SelectSearchOption) => {
    return option.name.toLowerCase().indexOf(search.value.toLowerCase()) > -1;
  });
}
</script>

<style scoped>

</style>
