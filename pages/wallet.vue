<template>
  <div class="wallet-view pb-3 md:pb-0 relative flex flex-col items-center w-full">
    <StatsTabs class="hidden md:block" />
    <MenuBar>
      <select v-model="settings.wallet.valuationMethod">
        <option value="floor">Value by Floor Price</option>
        <option value="lastSale">Value by Last Sale</option>
        <option value="fiveLastSales">Value by Last 5 Sales Average</option>
        <option value="weeklyAvg">Value by 7 Days Average Sale Price</option>
        <option value="twoWeeklyAvg">Value by 14 Days Average Sale Price</option>
        <option value="monthlyAvg">Value by 30 Days Average Sale Price</option>
      </select>
      <select v-model="settings.wallet.filterOption">
        <option value="all">Show All</option>
        <option value="premium">Show Premium Only</option>
      </select>
      <select v-model="settings.wallet.groupMethod">
        <option value="group">Group by Series</option>
        <option value="mint">Show Mint Numbers</option>
      </select>
      <template v-if="!Capacitor.isNativePlatform()">
        <RefreshButton :action="refresh" :refreshing="isRefreshing" />
      </template>
    </MenuBar>
    <div class="flex flex-col items-center w-full max-w-[92rem]">
      <div class="lg:hidden px-2 sm:px-6 py-2 flex flex-col lg:flex-row-reverse lg:items-center lg:justify-between gap-3 w-full overflow-hidden">
        <div class="flex items-center lg:justify-end text-sm w-full">
          <div class="flex flex-nowrap gap-2 max-w-lg w-full">
            <input type="text" autocomplete="off" name=“searchTerm” v-model="walletAddress" placeholder="Reddit Username (without u/) or Wallet Address">
            <button @click="getWalletTokens(walletAddress)" :disabled="lookupDisabled()" class="px-4 h-10 flex items-center bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-white disabled:text-white/20 text-sm font-medium whitespace-nowrap rounded-lg duration-200 cursor-pointer">
              <template v-if="loading">
                <svg class="inline w-5 h-5 text-amber-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
              </template>
              <template v-else>
                <span>Add Wallet</span>
              </template>
            </button>
          </div>
        </div>
      </div>
      <PullToRefresh @refresh="refresh" :is-refreshing="isRefreshing">
        <div class="px-2 sm:px-6 py-2 flex flex-col lg:flex-row-reverse lg:items-center lg:justify-between gap-3 w-full overflow-hidden">
          <div class="hidden lg:flex items-center lg:justify-end text-sm w-full">
            <div class="flex flex-nowrap gap-2 max-w-lg w-full">
              <input type="text" autocomplete="off" name=“searchTerm” v-model="walletAddress" placeholder="Reddit Username (without u/) or Wallet Address">
              <button @click="getWalletTokens(walletAddress)" :disabled="lookupDisabled()" class="px-4 h-10 flex items-center bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-white disabled:text-white/20 text-sm font-medium whitespace-nowrap rounded-lg duration-200 cursor-pointer">
                <template v-if="loading">
                  <svg class="inline w-5 h-5 text-amber-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                  </svg>
                </template>
                <template v-else>
                  <span>Add Wallet</span>
                </template>
              </button>
            </div>
          </div>
          <div class="px-2 hidden md:flex flex-col md:flex-row items-start gap-2 text-sm rounded-2xl w-full">
            <div class="flex gap-1">
              <span class="text-white/40">Total Worth: </span>
              <div class="flex items-center font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                <div class="text-white">{{ (getTotalWorth / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                <div class="ml-1 text-white/40"> (<span class="text-amber-500">{{ ethereumInLocalCurrency(getTotalWorth) }}</span>)</div>
              </div>
            </div>
            <div class="flex gap-1">
              <span class="text-white/40">Total items:</span>
              <span class="text-white font-medium">{{ getTotalItems }}</span>
            </div>
          </div>
          <div class="px-2 flex md:hidden flex-col md:flex-row items-center gap-1 text-sm w-full">
            <div class="flex flex-col items-center gap-1">
              <span class="text-white/40">Total Worth: </span>
              <div class="flex items-center text-2xl font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-5 h-5 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                <div class="text-white">{{ (getTotalWorth / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                <div class="ml-2 text-amber-500"> {{ ethereumInLocalCurrency(getTotalWorth) }}</div>
              </div>
            </div>
            <div class="flex gap-1">
              <span class="text-white/40">Total items:</span>
              <span class="text-white font-medium">{{ getTotalItems }}</span>
            </div>
          </div>
        </div>
        <div class="mt-2 lg:mt-3 px-2 sm:px-6 flex flex-col items-center gap-3 md:gap-12 w-full overflow-hidden">
          <template v-for="[walletAddress, walletTokens] in sortedWallets().entries()">
            <div class="bg-primary-accent sm:border border-primary-border flex flex-col items-center overflow-hidden w-full rounded-lg">
              <div class="p-2 flex gap-2 w-full rounded">
                <div class="pl-2 flex items-center overflow-hidden">
                  <button @click="openLinkWith(`https://marketplace.rcax.io/portfolio/${walletAddress}`)" class="hidden md:block p-2 text-white/40 hover:text-white text-sm font-medium rounded-md duration-500">{{ walletAddress }}</button>
                  <button @click="openLinkWith(`https://marketplace.rcax.io/portfolio/${walletAddress}`)" class="md:hidden text-white/40 hover:text-white text-sm font-medium rounded-md duration-500">{{ walletAddress.slice(0,6) }}..{{ walletAddress.slice(walletAddress.length - 6, walletAddress.length) }}</button>
                </div>
                <div class="flex gap-2">
                  <button @click="removeWallet(walletAddress)" class="px-1 py-1 text-white font-semibold text-sm group border border-transparent rounded-md duration-200 cursor-pointer">
                    <XMarkIcon class="w-5 h-5 text-white/60 group-hover:text-red-400 duration-200" />
                  </button>
                </div>
                <div class="ml-auto md:p-2 flex items-center text-sm rounded-md font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                  <div class="text-white">{{ (getWalletValue(walletAddress) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                  <div class="ml-1 text-white/40"> (<span class="text-amber-500">{{ ethereumInLocalCurrency(getWalletValue(walletAddress)) }}</span>)</div>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="toggleCollapse(walletAddress)" class="px-1 py-1 font-semibold text-sm flex items-center border border-transparent rounded-md duration-200 cursor-pointer">
                    <ChevronDownIcon class="w-5 h-5 text-white/60 group-hover:text-red-400 duration-200" :class="{ 'rotate-90': isCollapsed(walletAddress) }" />
                  </button>
                </div>
              </div>
              <template v-if="!isCollapsed(walletAddress)">
                <div class="p-2 md:px-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-1 border-t border-primary-border w-full">
                  <div class="p-1 flex items-center justify-start w-full font-bold">
                    <div class="w-10 h-10 relative rounded-full overflow-hidden">
                      <button @click="openLinkWith(`https://whitepaper.rcax.io/rcax-token-v2`)">
                        <img src="/images/branding/rcax/RCAX_Round_Color.svg" class="rounded-full">
                      </button>
                    </div>
                    <div class="mx-2 flex flex-col justify-center items-start text-sm overflow-hidden">
                      <button
                          @click="openLinkWith(`https://whitepaper.rcax.io/rcax-token-v2`)"
                          class="text-white whitespace-nowrap text-ellipsis overflow-hidden"
                      >RCAX</button>
                      <span class="text-amber-500 text-[0.8rem]">{{
                          ((getRcax(walletAddress) ?? 0) / 1000000000000000000).toLocaleString()
                        }}</span>
                    </div>
                    <div @click="openLinkWith(`https://app.uniswap.org/tokens/polygon/0x875f123220024368968d9f1ab1f3f9c2f3fd190d`)" class="ml-auto flex flex-col items-end text-[0.8rem] cursor-pointer">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                        <div class="text-white">{{
                            rcaxToEth((getRcax(walletAddress) ?? 0) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '')
                          }}</div>
                        <div class="ml-1 text-white/40"> (<span class="text-amber-500">{{
                            ethereumInLocalCurrency(rcaxToEth((getRcax(walletAddress) ?? 0)))
                          }}</span>)</div>
                      </div>
                      <div class="flex items-center">
                        <div class="ml-1 text-white/40"> (<span class="text-white/70">{{
                            gweiInLocalCurrency(rcaxEthPrice)
                          }}</span>)</div>
                      </div>
                    </div>
                  </div>
                  <div class="p-1 flex items-center justify-start w-full font-bold">
                    <div class="w-10 h-10 relative rounded-full overflow-hidden">
                      <button @click="openLinkWith(`https://whitepaper.rcax.io/rcax-token-v2`)">
                        <img src="/images/branding/rcax/rcaxAppIcon.png">
                      </button>
                    </div>
                    <div class="mx-2 flex flex-col justify-center items-start text-sm overflow-hidden">
                      <button
                          @click="openLinkWith(`https://whitepaper.rcax.io/rcax-token-v2`)"
                          class="text-white whitespace-nowrap text-ellipsis overflow-hidden"
                      >RCAX Classic</button>
                      <span class="text-amber-500 text-[0.8rem]">{{
                          ((getRcaxClassic(walletAddress) ?? 0) / 1000000000000000000).toLocaleString()
                        }}</span>
                    </div>
                    <div @click="openLinkWith(`https://quickswap.exchange/#/swap/v2?currency0=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&currency1=0xc99bd85ba824de949cf088375225e3fdcdb6696c&swapIndex=0`)" class="ml-auto flex flex-col items-end text-[0.8rem] cursor-pointer">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                        <div class="text-white">{{
                            rcaxClassicToEth((getRcaxClassic(walletAddress) ?? 0) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '')
                          }}</div>
                        <div class="ml-1 text-white/40"> (<span class="text-amber-500">{{
                            ethereumInLocalCurrency(rcaxToEth((getRcaxClassic(walletAddress) ?? 0)))
                          }}</span>)</div>
                      </div>
                      <div class="flex items-center">
                        <div class="ml-1 text-white/40"> (<span class="text-white/70">{{
                            gweiInLocalCurrency(rcaxClassicEthPrice)
                          }}</span>)</div>
                      </div>
                    </div>
                  </div>
                  <div class="p-1 flex items-center justify-start w-full font-bold">
                    <div class="w-10 h-10 relative rounded-md overflow-hidden">
                      <button @click="openLinkWith(`https://quickswap.exchange/#/swap/v2?currency0=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&currency1=0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c&swapIndex=0`)">
                        <img src="/img/bitcone.png">
                      </button>
                    </div>
                    <div class="mx-2 flex flex-col justify-center items-start text-sm overflow-hidden">
                      <button
                          @click="openLinkWith(`https://quickswap.exchange/#/swap/v2?currency0=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619&currency1=0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c&swapIndex=0`)"
                          class="text-white whitespace-nowrap text-ellipsis overflow-hidden"
                      >BitCone</button>
                      <span class="text-amber-500 text-[0.8rem]">{{ ((getCones(walletAddress) ?? 0) / 1000000000000000000).toLocaleString() }}</span>
                    </div>
                    <div class="ml-auto flex flex-col items-end text-[0.8rem]">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                        <div class="text-white">{{ coneToEth((getCones(walletAddress) ?? 0) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                        <div class="ml-1 text-white/40"> (<span class="text-amber-500">{{ ethereumInLocalCurrency(coneToEth((getCones(walletAddress) ?? 0))) }}</span>)</div>
                      </div>
                      <div class="flex items-center">
                        <div class="ml-1 text-white/40"> (<span class="text-white/70">{{ gweiInLocalCurrency(cone) }}</span>)</div>
                      </div>
                    </div>
                  </div>
                  <div class="p-1 flex items-center justify-start w-full font-bold">
                    <div class="w-10 h-10 relative bg-purple-800 rounded-full overflow-hidden">
                      <button @click="openLinkWith(`https://polygonscan.com/token/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619`)" class="flex justify-center w-full h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="p-2 h-full text-white"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                      </button>
                    </div>
                    <div class="mx-2 flex flex-col justify-center items-start text-sm overflow-hidden">
                      <button
                          @click="openLinkWith(`https://polygonscan.com/token/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619?a=${ walletAddress }`)"
                          class="text-white whitespace-nowrap text-ellipsis overflow-hidden"
                      >Ethereum</button>
                      <span class="text-amber-500 text-[0.8rem]">{{ ((getWeth(walletAddress) ?? 0) / 1000000000000000000).toLocaleString() }}</span>
                    </div>
                    <div class="ml-auto flex flex-col items-end text-[0.8rem]">
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                        <div class="text-white">{{ ((getWeth(walletAddress) ?? 0) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                        <div class="ml-1 text-white/40"> (<span class="text-amber-500">{{ ethereumInLocalCurrency(((getWeth(walletAddress) ?? 0))) }}</span>)</div>
                      </div>
                      <div class="flex items-center">
                        <div class="ml-1 text-white/40"> (<span class="text-white/70">{{ ethereumInLocalCurrency(1000000000000000000) }}</span>)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="Object.entries(walletTokens).length > 0 && !isCollapsed(walletAddress)">
                <div class="p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1 border-t border-primary-border w-full">
                  <template v-if="settings.wallet.groupMethod === 'group'">
                    <template v-for="series in sortedWalletTokensGrouped(filterWalletTokensGrouped(tokensCount.get(walletAddress)))">
                      <div @click="selectAvatar(getSeriesStats(series.contract_address, series.name))" class="p-1 grid grid-cols-8 md:grid-cols-12 w-full hover:bg-primary-accent-hover rounded-lg font-bold cursor-pointer">
                        <div class="relative rounded-md overflow-hidden" style="padding-top: 100%">
                          <a @click.stop="openLinkWith(marketplaceLink(getSeriesStats(series.contract_address, series.name)))" class="cursor-pointer">
                            <img-placeholder img-class="absolute top-0 left-0 w-full h-full object-cover" :src="getTokenImage(getSeriesStats(series.contract_address, series.name)?.series.image ?? '/img/rcax_placeholder.png')" />
                          </a>
                        </div>
                        <div class="mx-2 col-span-4 md:col-span-6 flex flex-col justify-center items-start text-sm overflow-hidden">
                          <span class="text-white whitespace-nowrap text-ellipsis overflow-hidden">{{getSeriesStats(series.contract_address, series.name)?.series.name }}</span>
                          <span class="text-amber-500 text-[0.8rem]">{{ series.count }}</span>
                        </div>
                        <div class="col-span-3 md:col-span-5 flex flex-col items-end justify-center text-[0.8rem]">
                          <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                            <div class="text-white">{{ (getSeriesValue(series.contract_address, series.name) / 1000000000000000000 * series.count).toFixed(4).replace(/\.?0+$/, '') }}</div>
                            <div class="ml-1 text-white/40"> (<span class="text-amber-500">{{ ethereumInLocalCurrency(getSeriesValue(series.contract_address, series.name) * series.count) }}</span>)</div>
                          </div>
                          <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-white/40"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                            <div class="text-white">{{ (getSeriesValue(series.contract_address, series.name) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                            <div class="ml-1 text-white/40"> (<span class="text-white/70">{{ ethereumInLocalCurrency(getSeriesValue(series.contract_address, series.name)) }}</span>)</div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <template v-for="token in sortedTokens(filterWalletTokens(walletTokens))">
                      <div @click="selectAvatar(getSeriesStats(token.contract_address, token.name))" class="p-1 grid grid-cols-8 md:grid-cols-12 w-full hover:bg-primary-accent-hover rounded-lg font-bold cursor-pointer">
                        <div class="relative rounded-md overflow-hidden" style="padding-top: 100%">
                          <a @click.stop="openLinkWith(marketplaceLink(getSeriesStats(token.contract_address, token.name)))" class="cursor-pointer">
                            <template v-if="Capacitor.isNativePlatform()">
                              <img v-lazy-pix="getTokenImage(getSeriesStats(token.contract_address, token.name)?.series.image ?? '/img/rcax_placeholder.png')" src="/img/rcax_placeholder.png" :alt="getSeriesStats(token.contract_address, token.name)?.series.name" class="absolute top-0 left-0 w-full h-full object-cover">
                            </template>
                            <template v-else>
                              <img :src="getTokenImage(getSeriesStats(token.contract_address, token.name)?.series.image ?? '/img/rcax_placeholder.png')" :alt="getSeriesStats(token.contract_address, token.name)?.series.name" class="absolute top-0 left-0 w-full h-full object-cover">
                            </template>
                          </a>
                        </div>
                        <div class="px-2 col-span-3 md:col-span-5 flex flex-col justify-center items-start text-sm">
                          <span class="text-white" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{getSeriesStats(token.contract_address, token.name)?.series.name}}</span>
                          <span class="text-amber-500 text-[0.8rem]">#{{ token.mint_number }}</span>
                        </div>
                        <div class="ml-auto col-span-4 md:col-span-6 flex flex-col items-end justify-center text-[0.8rem]">
                          <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-purple-500"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                            <div class="text-white">{{ (getSeriesValue(token.contract_address, token.name) / 1000000000000000000 * (walletTokens[token.name]?.length ?? 1)).toFixed(4).replace(/\.?0+$/, '') }}</div>
                            <div class="ml-1 text-white/40"> (<span class="text-amber-500">{{ ethereumInLocalCurrency(getSeriesValue(token.contract_address, token.name) * (walletTokens[token.name]?.length ?? 1)) }}</span>)</div>
                          </div>
                          <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" fill="currentColor" class="w-3 h-3 text-white/40"><path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path></svg>
                            <div class="text-white">{{ (getSeriesValue(token.contract_address, token.name) / 1000000000000000000).toFixed(4).replace(/\.?0+$/, '') }}</div>
                            <div class="ml-1 text-white/40"> (<span class="text-white/70">{{ ethereumInLocalCurrency(getSeriesValue(token.contract_address, token.name)) }}</span>)</div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
            </div>
          </template>
        </div>
      </PullToRefresh>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  addToWalletAddresses,
  removeFromWalletAddresses,
  updateSeriesStats,
  getSeriesStats,
  useWalletAddresses,
  useConeEthPrice,
  updateEthereumPrices,
  updateMarketInfo,
  useSettings,
  useSelectedAvatar,
  useRcaxClassicEthPrice,
  useRcaxEthPrice
} from "~/composables/states";
import {getLowestListingAsGweiPrice, onMounted, ref} from "#imports";
import {Ref} from "@vue/reactivity";
import {fetchWalletTokenBalance, fetchWalletTokens} from "~/composables/api/wallet";
import {WalletTokens} from "~/types/wallet";
import {ethereumInLocalCurrency, coneToEth, gweiInLocalCurrency} from "#imports";
import {ArrowPathIcon, ChevronDownIcon, XMarkIcon} from "@heroicons/vue/24/solid";
import {Token} from "~/types/token";
import {Capacitor} from "@capacitor/core";
import {getTokenImage, isValidEthereumAddress} from "~/global/utils";
import {getSaleAsGweiPrice} from "~/composables/helpers";
import {getFreeCollections} from "~/global/generations";
import {SeriesStats} from "~/types/seriesStats";
import {computed, ComputedRef} from "vue";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {rcaxToEth, rcaxClassicToEth} from "~/composables/api/rcax";
import {marketplaceLink} from "~/global/marketplace";
import {getCryptoContactFromId, getUserInfo} from "~/composables/api/reddit";

const walletAddresses = useWalletAddresses();
const rcaxEthPrice = useRcaxEthPrice();
const rcaxClassicEthPrice = useRcaxClassicEthPrice();
const cone = useConeEthPrice();
const settings = useSettings();
const selectedAvatar = useSelectedAvatar();

const walletAddress = ref<string>("");
const tokens: Ref<Map<string, Token[]>> = ref(new Map());
const tokensCount: Ref<Map<string, Map<string, TokenGrouped>>> = ref(new Map());
const rcax: Ref<Map<string, number>> = ref(new Map());
const rcaxClassic: Ref<Map<string, number>> = ref(new Map());
const weth: Ref<Map<string, number>> = ref(new Map());
const cones: Ref<Map<string, number>> = ref(new Map());
const loading = ref(false);
const isRefreshing = ref(false);
const collapsedWallets: Ref<Set<string>> = ref(new Set<string>());

await updateSeriesStats();

onMounted(() => {
  walletAddresses.value.forEach((wallet) => {
    getWalletTokens(wallet);
  });
});

interface TokenGrouped {
  count: number;
  contract_address: string;
  name: string;
}

function filterWalletTokensGrouped(walletTokens: Map<string, TokenGrouped>): Map<string, TokenGrouped> {
  if (settings.value.wallet?.filterOption === "all") {
    return walletTokens;
  }

  let filteredTokens: Map<string, TokenGrouped> = new Map<string, TokenGrouped>();

  for (const [contractAddress, tokens] of walletTokens) {
    if (!getFreeCollections().includes(contractAddress.slice(0,42))) {
      filteredTokens.set(contractAddress, tokens);
    }
  }

  return filteredTokens;
}

function filterWalletTokens(walletTokens: Token[]): Token[] {
  if (settings.value.wallet?.filterOption === "all") {
    return walletTokens;
  }

  const filteredTokens: Token[] = [];

  for (const token of walletTokens) {
    const contractAddress = token.contract_address;

    if (!getFreeCollections().includes(contractAddress)) {
      filteredTokens.push(token);
    }
  }

  return filteredTokens;
}

function toggleCollapse(walletAddress: string) {
  if (collapsedWallets.value.has(walletAddress)) {
    collapsedWallets.value.delete(walletAddress);
  } else {
    collapsedWallets.value.add(walletAddress);
  }
}

function isCollapsed(walletAddress: string): boolean {
  return collapsedWallets.value.has(walletAddress);
}

function refresh() {
  isRefreshing.value = true;

  let promises = [];

  promises.push(updateSeriesStats());
  promises.push(updateMarketInfo());
  promises.push(updateEthereumPrices());

  walletAddresses.value.forEach((wallet) => {
    promises.push(getWalletTokens(wallet));
  });

  Promise.all(promises).finally(() => {
    isRefreshing.value = false;
  })
}

async function getWalletTokens(wallet: string) {
  loading.value = true;

  if (!isValidEthereumAddress(wallet)) {
    try {
      let userInfo = await getUserInfo(wallet);
      let userId = userInfo['data']['id'];
      let cryptoInfo = await getCryptoContactFromId(userId);
      wallet = cryptoInfo['contacts'][`t2_${userId}`][0]['address'];
    } catch(err) {
      loading.value = false;
      alert(err);
      return;
    }
  }

  await fetchWalletTokens(wallet)
      .then((data) => {
        const wallets = Object.entries(data.wallets);
        const [firstWalletAddress, firstWalletValue] = wallets[0];

        addToWalletAddresses(firstWalletAddress);

        tokensCount.value.set(firstWalletAddress, new Map<string, TokenGrouped>());

        firstWalletValue.forEach((token) => {
          if (token.contract_address === "0xa3396af20ce52bd3c7ab6d7046be617257f60eb9" && token.mint_number <= 24) {
            token.name = "Gold Hodl";
          }

          let tokenId = token.contract_address + token.name;

          if (!tokensCount.value.get(firstWalletAddress)?.has(tokenId)) {
            tokensCount.value.get(firstWalletAddress)?.set(tokenId, {
              count: 1,
              name: token.name,
              contract_address: token.contract_address
            });
          } else {
            const tokenGrouped = tokensCount.value.get(firstWalletAddress)?.get(tokenId);
            if (tokenGrouped) {
              tokenGrouped.count += 1;
            }
          }
        });

        tokens.value.set(firstWalletAddress, firstWalletValue);
        rcax.value.set(firstWalletAddress, 0);
        rcaxClassic.value.set(firstWalletAddress, 0);
        cones.value.set(firstWalletAddress, data.cones);
        weth.value.set(firstWalletAddress, data.weth ?? 0);

        getRcaxBalance(firstWalletAddress);
        getRcaxClassicBalance(firstWalletAddress);
        getConeBalance(firstWalletAddress);
        getWethBalance(firstWalletAddress);

        walletAddress.value = "";
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });

  loading.value = false;
}

async function getRcaxBalance(wallet: string) {
  loading.value = true;

  const RCAX_TOKEN_ADDRESS = "0x875f123220024368968d9f1ab1f3f9c2f3fd190d";

  await fetchWalletTokenBalance(RCAX_TOKEN_ADDRESS, wallet)
      .then((data) => {
        rcax.value.set(wallet, data);
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });

  loading.value = false;
}

async function getRcaxClassicBalance(wallet: string) {
  loading.value = true;

  const RCAX_TOKEN_ADDRESS = "0xC99BD85BA824De949cf088375225E3FdCDB6696C";

  await fetchWalletTokenBalance(RCAX_TOKEN_ADDRESS, wallet)
      .then((data) => {
        rcaxClassic.value.set(wallet, data);
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });

  loading.value = false;
}

async function getConeBalance(wallet: string) {
  loading.value = true;

  const CONE_TOKEN_ADDRESS = "0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c";

  await fetchWalletTokenBalance(CONE_TOKEN_ADDRESS, wallet)
      .then((data) => {
        cones.value.set(wallet, data);
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });

  loading.value = false;
}

async function getWethBalance(wallet: string) {
  loading.value = true;

  const WETH_TOKEN_ADDRESS = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

  await fetchWalletTokenBalance(WETH_TOKEN_ADDRESS, wallet)
      .then((data) => {
        weth.value.set(wallet, data);
      })
      .catch((err) => {
        loading.value = false;
        alert(err);
      });

  loading.value = false;
}

function getRcax(wallet: string) {
  return rcax.value.get(wallet);
}

function getRcaxClassic(wallet: string) {
  return rcaxClassic.value.get(wallet);
}

function getCones(wallet: string) {
  return cones.value.get(wallet);
}

function getWeth(wallet: string) {
  return weth.value.get(wallet);
}

function lookupDisabled(): boolean {
  return !walletAddress.value || walletAddresses.value.has(walletAddress.value) || loading.value;
}

function getWalletValue(wallet: string): number {
  let value = 0;

  let walletTokensGrouped = tokensCount.value.get(wallet);

  if (walletTokensGrouped) {
    for (let series of walletTokensGrouped.values()) {
      value += getSeriesValue(series.contract_address, series.name) * series.count;
    }
  }

  return value;
}

function getSeriesValue(contractAdres: string, name: string): number {
  let price = 0;
  let stats = getSeriesStats(contractAdres, name);

  switch (settings.value.wallet.valuationMethod) {
    case "floor":
      price = stats ? getLowestListingAsGweiPrice(stats) : 0;
      break;
    case "lastSale":
      price = stats?.stats.last_sale ? getSaleAsGweiPrice(stats.stats.last_sale) : 0;
      break;
    case "fiveLastSales":
      price = stats?.stats.eth.five_last_sales_average * 1000000000000000000 ?? 0;
      break;
    case "weeklyAvg":
      price = ((stats?.stats.eth.weekly_average_price ?? stats?.stats.eth.two_weekly_average_price ?? stats?.stats.eth.monthly_average_price)  * 1000000000000000000) ?? stats?.stats.last_sale?.payment_token.base_price ?? 0;
      break;
    case "twoWeeklyAvg":
      price = ((stats?.stats.eth.two_weekly_average_price ?? stats?.stats.eth.monthly_average_price)  * 1000000000000000000) ?? stats?.stats.last_sale?.payment_token.base_price ?? 0;
      break;
    case "monthlyAvg":
      price = (stats?.stats.eth.monthly_average_price  * 1000000000000000000) ?? stats?.stats.last_sale?.payment_token.base_price ?? 0;
      break;
  }

  return price;
}

const getTotalWorth: ComputedRef<number> = computed(() => {
  let value = 0;

  for (let walletAddress of tokens.value.keys()) {
    value += getWalletValue(walletAddress);
  }

  return value;
});

const getTotalItems: ComputedRef<number> = computed(() => {
  let items = 0;

  for (let walletTokens of tokens.value.values()) {
    items += walletTokens.length;
  }

  return items;
});

function sortedWallets(): Map<string, WalletTokens> {
  const mapArray = Array.from(tokens.value.entries());

  mapArray.sort((a, b) => getWalletValue(b[0]) - getWalletValue(a[0]));

  return new Map(mapArray);
}

function sortedWalletTokensGrouped(walletTokens: Map<string, TokenGrouped>) {
  let tokens = [];

  for (const tokenGroup of walletTokens.values()) {
    tokens.push(tokenGroup);
  }

  return tokens.sort((aTokenGroup, bTokenGroup) => ((getSeriesValue(bTokenGroup.contract_address, bTokenGroup.name) * bTokenGroup.count) - (getSeriesValue(aTokenGroup.contract_address, aTokenGroup.name) *aTokenGroup.count )));
}

function sortedTokens(tokens: Array<Token>): Array<Token> {
  return tokens.sort((a, b) => {
    const seriesValueComparison = getSeriesValue(b.contract_address, b.name) - getSeriesValue(a.contract_address, a.name);
    if (seriesValueComparison !== 0) {
      return seriesValueComparison;
    } else {
      return a.mint_number - b.mint_number;
    }
  });
}

function removeWallet(wallet: string) {
  removeFromWalletAddresses(wallet);
  tokens.value.delete(wallet);
}

const hapticsImpactLight = async () => {
  await Haptics.impact({ style: ImpactStyle.Light });
};

function selectAvatar(seriesStats: SeriesStats) {
  hapticsImpactLight();

  selectedAvatar.value = {
    seriesStats: seriesStats,
    contract: seriesStats.series.contract_address,
    series: seriesStats.series.name
  }
}
</script>

<style scoped>
.wallet-view select {
  @apply max-w-[9rem];
}
</style>
