<template>
  <div class="menubar" :class="{ 'mobile-padding-top': Capacitor.isNativePlatform() }">
    <div class="menubar-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>

import {Capacitor} from "@capacitor/core";
</script>

<style>
.menubar {
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  background-color: #141415;
  border-bottom: 1px solid rgba(39, 39, 42, 0.5);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition-duration: 500ms;
}

.menubar-content {
  @apply px-4 lg:px-6 py-3 flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide relative min-w-0;
}

/* Prevent horizontal scroll when dropdowns are open */
.menubar-content:has(.filter-menu-button--menu) {
  @apply overflow-x-visible;
}

/* Fallback for browsers that don't support :has() */
.menubar-content.dropdown-open {
  @apply overflow-x-visible;
}

.menubar-content > * {
  @apply flex-shrink-0;
  height: 36px;
}

/* Special handling for SearchBar - allow it to grow but not shrink */
.menubar-content > .searchbar {
  @apply flex-grow-0 flex-shrink-0;
}

/* Push subsequent items to the right */
.menubar-content > .searchbar ~ * {
  @apply ml-auto;
}

/* Reset margin for items after the first right-aligned item */
.menubar-content > .searchbar ~ * ~ * {
  @apply ml-0;
}

/* Modern select styling */
.menubar-content > select {
  @apply px-3 py-2 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 text-sm text-zinc-400 hover:text-white placeholder-zinc-500 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 rounded-lg transition-all duration-200 cursor-pointer min-w-0 w-full max-w-[7rem] md:max-w-fit;
}

.menubar-content > select > option {
  @apply bg-zinc-800 text-zinc-400;
}

/* Modern button styling for filter buttons */
.menubar-content > button {
  @apply px-3 py-2 bg-zinc-800/30 hover:bg-zinc-700/50 border border-zinc-700/30 hover:border-zinc-600/50 text-zinc-400 hover:text-white rounded-lg transition-all duration-200 font-medium whitespace-nowrap;
}

.menubar-content > button.active {
  background-color: rgba(223, 122, 48, 0.15);
  border-color: rgba(223, 122, 48, 0.3);
  color: #df7a30;
}

.menubar-content > button.active:hover {
  color: #df7a30;
  background-color: rgba(223, 122, 48, 0.2);
}

/* Custom scrollbar for horizontal overflow on mobile */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.mobile-padding-top {
  top: env(safe-area-inset-top);
}

/* Desktop mobile padding adjustment */
@media (min-width: 1024px) {
  .mobile-padding-top {
    top: 0;
  }
}

/* Additional responsive improvements */
@media (max-width: 640px) {
  .menubar-content {
    @apply px-2 py-2;
  }
  
  .menubar-content > * {
    @apply text-sm;
    height: 32px;
  }
  
  .menubar-content > select,
  .menubar-content > button {
    @apply px-2.5 py-1.5 text-xs;
  }
}
</style>
