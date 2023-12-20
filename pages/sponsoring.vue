<template>
  <div class="px-4 md:px-6 py-12 flex flex-col gap-3 text-white/80 max-w-4xl">
    <h1 class="mb-6 text-2xl">Sponsor RCAX's Development:</h1>

    <h1 class="text-xl">Advertise on RCAX</h1>

    <p>Drive visibility for your brand by becoming an RCAX sponsor through our eye-catching advertisement banners. With affordable pricing options starting at just ${{ SHARED_BANNER_PRICE_USD }} per day, you can effectively reach your target audience. Note that these prices are not final and might be subject to change. Always message warmbiertje@rcax.io for a final quote.</p>

    <h2>Option 1: Shared Banner Display ({{ SHARED_BANNER_PRICE_USD }} / day)</h2>
    <p>Make your mark alongside a select group of advertisers with our shared banner display. For as low as ${{ SHARED_BANNER_PRICE_USD }} a day, your banner will take its place among a maximum of 5 rotating advertisement banners. This dynamic arrangement ensures your brand gets noticed as it alternates with other compelling ads. This option has a minimum booking of 14 days.</p>

    <h2>Option 2: Exclusive Banner Showcase (${{ EXCLUSIVE_BANNER_PRICE_USD }} / day)</h2>
    <p>For unparalleled prominence, opt for our exclusive banner showcase at ${{ EXCLUSIVE_BANNER_PRICE_USD }} per day. Your banner will reign supreme as the sole advertisement displayed. Be sure to reserve ahead of time to guarantee availability. This option has a minimum booking of 7 days.</p>

    <h2>Important</h2>
    <p>Your advertisement banners will exclusively appear on the RCAX website. It's important to note that these banners will not be featured on the app, because of restrictions by Apple and Google. Users also have the option to dismiss the advertisement banners during their browsing session.</p>

    <h2>Banner design</h2>
    <p>Don't have a banner yet? Let us take care of it! Our skilled team can craft a captivating banner that perfectly encapsulates your brand's essence.</p>

    <h2>Sign me up!</h2>
    <p>If you're ready to take your brand to the next level, reach out to us at <a href="mailto:warmbiertje@rcax.io" class="text-white font-semibold">warmbiertje@rcax.io</a> to express your interest or secure your sponsorship spot. Make sure to be on time, cause there are only a limited amount of spots available!</p>

    <h1 class="mt-6 text-xl">Partnering & Sponsorships</h1>
    <p>Interested in sponsoring or partnering up with RCAX? Reach out to us at <a href="mailto:warmbiertje@rcax.io" class="text-white font-semibold">warmbiertje@rcax.io</a>!</p>

    <h1 class="mt-6 text-xl">Donate</h1>

    <p>If you want to sponsor RCAX's development anonymously, you can do so by sending something to:</p>

    <p>ETH: <span class="font-bold break-all">0xB0753614730408d91Ccc46c1f4210efF0bee648B</span></p>

    <p>BTC: <span class="font-bold break-all">bc1qpztwrlapl330gn74uqn3p03egekdpxcvkv7vtk</span></p>

    <p class="italic">Thank you !!! :D</p>
  </div>
</template>

<script setup lang="ts">
import {SHARED_BANNER_PRICE_USD, EXCLUSIVE_BANNER_PRICE_USD} from "~/global/priceList";
</script>

<style scoped>
h1, h2 {
  @apply font-bold text-white;
}
</style>
