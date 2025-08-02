<template>
  <footer class="relative mt-16 md:mt-24 pb-[53px] md:pb-0 w-full bg-[#141415] border-t border-zinc-800/50">
    <!-- Main Footer Content -->
    <div class="relative px-4 md:px-6 py-8 md:py-12 w-full">
      <!-- Footer Grid -->
      <div class="px-4 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        <!-- Brand Section -->
        <div class="col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <span class="text-lg font-semibold text-white">RCAX</span>
            <span class="text-xs text-zinc-500 uppercase tracking-wide">© 2025</span>
          </div>
          <p class="text-sm text-zinc-400 leading-relaxed mb-6">
            The hub for Reddit Collectible Avatars
          </p>
          <!-- Social Links -->
          <div class="flex items-center gap-2">
            <a href="https://twitter.com/RCAX_io" 
               class="group p-2 rounded-lg bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200">
              <svg class="w-5 h-5 text-zinc-400 group-hover:text-[#1d9bf0] transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 248 204">
                <path fill="currentColor" d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"/>
              </svg>
            </a>
            <a href="https://discord.gg/6VAVhjMECB" 
               class="group p-2 rounded-lg bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200">
              <svg class="w-5 h-5 text-zinc-400 group-hover:text-[#5865F2] transition-colors duration-200" viewBox="0 -28.5 256 256" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"/>
              </svg>
            </a>
            <a href="https://www.reddit.com/r/avatartrading/" 
               class="group p-2 rounded-lg bg-zinc-800/30 border border-zinc-700/50 hover:bg-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200">
              <svg class="w-5 h-5 text-zinc-400 group-hover:text-[#FF4500] transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r="45" fill="currentColor"/>
                <path d="M 75.011 45 c -0.134 -3.624 -3.177 -6.454 -6.812 -6.331 c -1.611 0.056 -3.143 0.716 -4.306 1.823 c -5.123 -3.49 -11.141 -5.403 -17.327 -5.537 l 2.919 -14.038 l 9.631 2.025 c 0.268 2.472 2.483 4.262 4.955 3.993 c 2.472 -0.268 4.262 -2.483 3.993 -4.955 s -2.483 -4.262 -4.955 -3.993 c -1.421 0.145 -2.696 0.973 -3.4 2.204 L 48.68 17.987 c -0.749 -0.168 -1.499 0.302 -1.667 1.063 c 0 0.011 0 0.011 0 0.022 l -3.322 15.615 c -6.264 0.101 -12.36 2.025 -17.55 5.537 c -2.64 -2.483 -6.801 -2.36 -9.284 0.291 c -2.483 2.64 -2.36 6.801 0.291 9.284 c 0.515 0.481 1.107 0.895 1.767 1.186 c -0.045 0.66 -0.045 1.32 0 1.98 c 0 10.078 11.745 18.277 26.23 18.277 c 14.485 0 26.23 -8.188 26.23 -18.277 c 0.045 -0.66 0.045 -1.32 0 -1.98 C 73.635 49.855 75.056 47.528 75.011 45 z M 30.011 49.508 c 0 -2.483 2.025 -4.508 4.508 -4.508 c 2.483 0 4.508 2.025 4.508 4.508 s -2.025 4.508 -4.508 4.508 C 32.025 53.993 30.011 51.991 30.011 49.508 z M 56.152 62.058 v -0.179 c -3.199 2.405 -7.114 3.635 -11.119 3.468 c -4.005 0.168 -7.919 -1.063 -11.119 -3.468 c -0.425 -0.515 -0.347 -1.286 0.168 -1.711 c 0.447 -0.369 1.085 -0.369 1.544 0 c 2.707 1.98 6.007 2.987 9.362 2.83 c 3.356 0.179 6.667 -0.783 9.407 -2.74 c 0.492 -0.481 1.297 -0.47 1.779 0.022 C 56.655 60.772 56.644 61.577 56.152 62.058 z M 55.537 54.34 c -0.078 0 -0.145 0 -0.224 0 l 0.034 -0.168 c -2.483 0 -4.508 -2.025 -4.508 -4.508 s 2.025 -4.508 4.508 -4.508 s 4.508 2.025 4.508 4.508 C 59.955 52.148 58.02 54.239 55.537 54.34 z" fill="#141415"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="col-span-1">
          <h3 class="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-4">Platform</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink to="/privacy" class="text-sm text-zinc-500 hover:text-white transition-colors duration-200">
                Privacy Policy
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/tos" class="text-sm text-zinc-500 hover:text-white transition-colors duration-200">
                Terms of Service
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/contact" class="text-sm text-zinc-500 hover:text-white transition-colors duration-200">
                Contact
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/sponsoring" class="text-sm text-zinc-500 hover:text-white transition-colors duration-200">
                Advertising & Sponsoring
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Mobile Apps -->
        <div class="col-span-1">
          <h3 class="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-4">Download App</h3>
          <div class="flex flex-col gap-3">
            <a href="https://apps.apple.com/nl/app/rcax/id6449831133" 
               class="inline-flex items-center gap-3 px-4 py-2 bg-zinc-800/30 border border-zinc-700/50 rounded-lg hover:bg-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200">
              <svg class="w-5 h-5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div class="flex flex-col">
                <span class="text-[10px] text-zinc-500">Download on the</span>
                <span class="text-sm text-zinc-300 font-medium">App Store</span>
              </div>
            </a>
            <a href="https://play.google.com/store/apps/details?id=io.rcax.rcax" 
               class="inline-flex items-center gap-3 px-4 py-2 bg-zinc-800/30 border border-zinc-700/50 rounded-lg hover:bg-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200">
              <svg class="w-5 h-5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div class="flex flex-col">
                <span class="text-[10px] text-zinc-500">Get it on</span>
                <span class="text-sm text-zinc-300 font-medium">Google Play</span>
              </div>
            </a>
          </div>
        </div>

        <!-- Developer Credits -->
        <div class="col-span-1 flex flex-col">
          <h3 class="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-4 text-center">Developed By</h3>
          <div class="flex justify-center items-center flex-1">
            <a href="https://dutchbits.nl" 
               class="inline-flex items-center gap-2 group">
              <img class="h-10 w-auto grayscale group-hover:grayscale-0 transition-all duration-200" 
                   src="~/assets/images/logo-dutchbits.svg" 
                   alt="Dutchbits">
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Disclaimer Section -->
    <div class="border-t border-zinc-800/50">
      <div class="px-4 md:px-6 py-4 mx-auto">
        <div class="p-4">
          <p class="text-xs text-zinc-500 leading-relaxed">
            <span class="font-semibold text-zinc-400 uppercase tracking-wide">Important Disclaimer:</span>
            This website is not affiliated with or endorsed by reddit Inc. or OpenSea. All content provided herein our website, hyperlinked sites, associated applications, forums, blogs, social media accounts and other platforms ("Site") is for your general information only, procured primarily from third party sources. We make no warranties of any kind in relation to our content and services, including but not limited to accuracy, security and updatedness. No part of the content and services that we provide constitutes financial advice, legal advice or any other form of advice meant for your specific reliance for any purpose. Any use or reliance on our content and services is solely at your own risk and discretion. You should conduct your own research, review, analyse and verify our content and services before relying on or using them. Trading is a highly risky activity that can lead to major losses, please therefore consult your financial advisor before making any decision. No content on our Site is meant to be a solicitation or offer.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterSmall"
}
</script>

<style scoped>

</style>