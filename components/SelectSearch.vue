<template>
  <div
      class="group relative block w-full"
  >
    <div class="flex flex-row flex-nowrap">
      <input
          v-model="search"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          @focus="openList = true"
      >
    </div>
    <div
        v-if="filteredOptions.length > 0 && openList"
        id="options"
        class="absolute group-focus-within:block mt-2 z-50 rounded-2xl divide-y divide-gray-100 shadow-lg bg-neutral-700 text-neutral-300 max-h-48 w-full overflow-y-auto"
    >
      <ul class="py-1 text-sm">
        <li v-for="option in filteredOptions">
          <button
              @click.prevent="selectValue(option.value)"
              class="inline-flex py-2 px-4 w-full text-sm hover:bg-neutral-600 hover:text-header duration-200"
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
import {computed, ref} from "#imports";
import {SelectSearchOption} from "~/types/select_search";
import {ComputedRef} from "vue";

const MAX_OPTIONS_IN_LIST = 300;

const search: Ref<string> = ref("");
const openList = ref(false);

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

function selectValue(value: any) {
  console.log("selected: ", value);

  emit('update:modelValue', value);
  emit('change');
  search.value = "";
  openList.value = false;
}

const filteredOptions: ComputedRef<Array<SelectSearchOption>> = computed(() => {
  if (!search.value) {
    return props.options.slice(0, MAX_OPTIONS_IN_LIST).sort(sortOptions);
  }

  let filtered = props.options.filter((option: SelectSearchOption) => {
    return option.name.toLowerCase().indexOf(search.value.toLowerCase()) > -1;
  });

  return filtered.sort(sortOptions);
});

function sortOptions(a: SelectSearchOption, b: SelectSearchOption) {
  const nameA = a.name.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name.toUpperCase(); // ignore upper and lowercase

  if (nameA < nameB) {
    return -1;
  }

  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}
</script>

<style scoped>

</style>
