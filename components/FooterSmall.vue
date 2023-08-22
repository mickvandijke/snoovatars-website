<template>
  <div class="mt-4 md:mt-48 pb-[53px] md:pb-0 px-2 md:px-6 w-full">
    <div class="px-4 md:px-2 py-6 w-full flex flex-col justify-center gap-6 border-t border-primary-border">
      <div class="w-full flex flex-col md:flex-row justify-center items-center gap-3 md:gap-12 text-[0.8rem] text-white/60 font-medium">
        <div class="border-neutral-800/90 w-fit">&copy; 2023 RCAX.</div>
        <div class="flex items-center gap-6">
          <NuxtLink to="/privacy" class="hover:text-white">Privacy Policy</NuxtLink>
          <NuxtLink to="/tos" class="hover:text-white">Terms</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-white">Contact</NuxtLink>
          <NuxtLink to="/sponsoring" class="hover:text-white">Advertise</NuxtLink>
        </div>
        <div class="md:ml-auto flex items-center gap-6 md:gap-12">
          <div class="flex items-center gap-6">
            <a href="https://twitter.com/RCAX_io" class="p-2 md:p-1 flex items-center gap-2 text-white font-semibold">
              <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 248 204">
              <path fill="#1d9bf0" d="M221.95 51.29c.15 2.17.15 4.34.15 6.53 0 66.73-50.8 143.69-143.69 143.69v-.04c-27.44.04-54.31-7.82-77.41-22.64 3.99.48 8 .72 12.02.73 22.74.02 44.83-7.61 62.72-21.66-21.61-.41-40.56-14.5-47.18-35.07 7.57 1.46 15.37 1.16 22.8-.87-23.56-4.76-40.51-25.46-40.51-49.5v-.64c7.02 3.91 14.88 6.08 22.92 6.32C11.58 63.31 4.74 33.79 18.14 10.71c25.64 31.55 63.47 50.73 104.08 52.76-4.07-17.54 1.49-35.92 14.61-48.25 20.34-19.12 52.33-18.14 71.45 2.19 11.31-2.23 22.15-6.38 32.07-12.26-3.77 11.69-11.66 21.62-22.2 27.93 10.01-1.18 19.79-3.86 29-7.95-6.78 10.16-15.32 19.01-25.2 26.16z"/>
            </svg>
            </a>
            <a href="https://discord.gg/6VAVhjMECB" class="p-2 md:p-1 flex items-center gap-2 text-white font-semibold">
              <svg class="w-5 h-5" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><g>
                <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="#5865F2" fill-rule="nonzero"></path></g></g>
              </svg>
            </a>
          </div>
          <div class="flex items-center gap-3">
            <a class="h-8" href='https://apps.apple.com/nl/app/rcax/id6449831133'><img alt='Download on the App Store' src='/images/branding/appstore.svg' class="h-full w-auto"/></a>
            <a class="h-8" href='https://play.google.com/store/apps/details?id=io.rcax.rcax&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg' class="h-full w-auto"/></a>
          </div>
        </div>
      </div>
      <div class="w-full justify-start items-center gap-3 md:gap-12 text-[0.8rem] text-white/40">
        <p><span class="font-semibold">IMPORTANT DISCLAIMER</span>: This website is not affiliated with or endorsed by reddit Inc. or OpenSea. All content provided herein our website, hyperlinked sites, associated applications, forums, blogs, social media accounts and other platforms (“Site”) is for your general information only, procured primarily from third party sources. We make no warranties of any kind in relation to our content and services, including but not limited to accuracy, security and updatedness. No part of the content and services that we provide constitutes financial advice, legal advice or any other form of advice meant for your specific reliance for any purpose. Any use or reliance on our content and services is solely at your own risk and discretion. You should conduct your own research, review, analyse and verify our content and services before relying on or using them. Trading is a highly risky activity that can lead to major losses, please therefore consult your financial advisor before making any decision. No content on our Site is meant to be a solicitation or offer.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterSmall"
}
</script>

<style scoped>

</style>
