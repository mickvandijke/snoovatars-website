<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-80px)]">
    <div class="text-center py-16 px-4">
      <div class="mx-auto h-12 w-12 text-zinc-600 mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="w-full h-full">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-white mb-2">Pro Feature</h3>
      <p class="text-sm text-zinc-400 mb-6">{{ message }}</p>
      <NuxtLink 
        :to="buttonLink" 
        class="inline-flex items-center px-4 py-2.5 bg-white hover:bg-zinc-100 text-black text-sm font-medium rounded-lg transition-colors"
      >
        {{ buttonText }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  message: {
    type: String,
    default: "Please sign in with your Pro account to access this feature"
  },
  buttonText: {
    type: String,
    default: "Sign In"
  },
  buttonLink: {
    type: String,
    default: "/login"
  }
});
</script>

<style scoped>
</style>