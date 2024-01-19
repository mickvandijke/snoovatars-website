<template>
  <div @touchstart.self="prompter = null" @click.self="prompter = null" class="px-16 fixed inset-0 flex items-center justify-center bg-neutral-900/50 w-full h-full z-50">
    <div class="p-6 bg-neutral-900 border border-neutral-800/90 rounded-2xl shadow-lg w-full max-w-xs">
      <h2 class="text-neutral-400 text-sm mb-4">{{ prompter.title }}</h2>
      <div class="flex flex-col gap-2">
        <template v-for="option in prompter.options">
          <button class="px-4 py-2 bg-amber-600 text-header text-sm rounded-md" @click.stop="selectOption(option.value)">
            {{ option.name }}
          </button>
        </template>
        <div class="py-2 flex items-center" @click="saveDefault = !saveDefault">
          <input type="checkbox" class="form-checkbox h-4 w-4 text-red-500 rounded" v-model="saveDefault" />
          <span class="px-2 text-neutral-400 text-sm">Remember choice</span>
        </div>
        <button class="px-4 py-2 bg-red-500 text-header text-sm rounded-md" @click.stop="prompter = null">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {usePrompt} from "~/composables/states";
import {ref} from "#imports";

export interface Prompt {
  title: string;
  options: PromptOption[];
  result?: Array<any>;
}

export interface PromptOption {
  name: string;
  value: string;
}

const prompter = usePrompt();

const saveDefault = ref(false);

function selectOption(value: string) {
  prompter.value.result = [value, saveDefault.value];
}
</script>

<style scoped>

</style>
