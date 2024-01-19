<template>
  <div class="px-4 md:px-6 py-12 flex flex-col sm:flex-row gap-6 max-w-6xl">
    <div class="flex flex-col items-center gap-6 w-full">
      <div class="flex flex-col gap-1 items-center">
        <h1 class="text-4xl text-header font-bold">Random Avatar Swap</h1>
        <a href="https://polygonscan.com/address/0xc44100e15553c85f2846eed703e23165c0e0b9a3" target="_blank" class="text-xs sm:text-sm md:text-md text-amber-600 font-bold hover:text-amber-500">0xc44100e15553c85f2846eed703e23165c0e0b9a3</a>
      </div>

      <div class="p-6 flex flex-col items-center gap-6 bg-black/20 w-full rounded-2xl">
        <p class="text-details">
          This dApp can be used to swap your Reddit Collectible Avatar with another
          random one from the dApp pool. The Avatars in the pool are provided by so
          called liquidity providers. The pools are separated by the release generation. So
          if you send a generation 1 Avatar, you will always get another generation 1
          Avatar in return. The first swap is free. Any swap afterwards will cost a service
          fee in $RCAX which differs per Avatar. Liquidity providers will earn half of the
          service fee whenever one of their avatars is swapped.
        </p>

        <div class="flex flex-col gap-3 w-full">
          <h2 class="text-header font-bold">COMPATIBLE AVATARS / POOLS</h2>

          <ul class="px-4 text-details list-disc">
            <li>Aww Friends / Drip Squad / Meme Team / The Singularity</li>
            <li>Generation 1</li>
            <li>Generation 2</li>
            <li>Generation 3</li>
          </ul>
        </div>

        <div class="flex flex-col gap-3 w-full">
          <h2 class="text-header font-bold">SERVICE FEES PER POOL</h2>

          <p class="text-details">
            The first swap is free. After the free swap you will have to pay the following fees.
          </p>

          <table class="text-details text-left">
            <thead>
            <th>Pool</th>
            <th>Swap Fee</th>
            </thead>
            <tbody>
            <tr>
              <td>AwwDripMemeSingu</td>
              <td class="text-amber-500">{{ amountNormalized(poolFeeAwwDripMemeSingu) }} $RCAX</td>
            </tr>
            <tr>
              <td>Generation 1</td>
              <td class="text-amber-500">{{ amountNormalized(poolFeeGen1) }} $RCAX</td>
            </tr>
            <tr>
              <td>Generation 2</td>
              <td class="text-amber-500">{{ amountNormalized(poolFeeGen2) }} $RCAX</td>
            </tr>
            <tr>
              <td>Generation 3</td>
              <td class="text-amber-500">{{ amountNormalized(poolFeeGen3) }} $RCAX</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col gap-3 w-full">
          <h2 class="text-header font-bold">WARNING BEFORE USE</h2>

          <p class="text-details">
            If the pool has low liquidity and you use the same pool multiple times, you
            might receive the same Avatar you sent earlier as it will become a part of the
            pool.
          </p>

          <p class="text-details">
            USE THIS DAPP AT YOUR OWN RISK. WE ARE NOT LIABLE FOR ANY DAMAGES
            THAT MAY BE A RESULT OF INTERACTING WITH THIS DAPP.
          </p>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center gap-6 w-full">
      <div class="mx-8 rounded-2xl flex gap-1 p-2 relative items-center bg-black/20 w-full">
        <button @click="view = View.Swap" :class="{ 'active-tab': view === View.Swap }" class="p-2 w-full flex justify-center hover:bg-secondary text-header font-medium rounded-2xl duration-200 cursor-pointer">
          <span>Swap</span>
        </button>
        <button @click="view = View.LiquidityProvider" :class="{ 'active-tab': view === View.LiquidityProvider }" class="p-2 w-full flex justify-center hover:bg-secondary text-header font-medium rounded-2xl duration-200 cursor-pointer">
          <span>Provide Liquidity</span>
        </button>
      </div>

      <template v-if="!connectedWallet">
        <button @click="buttonConnectWallet" class="px-4 h-12 flex justify-center items-center bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-header disabled:text-white/20 font-medium rounded-xl w-fit duration-200">Connect Wallet</button>
      </template>
      <template v-else>
        <RefreshButton :action="refresh" :refreshing="isRefreshing" />

        <div class="flex flex-col gap-3 w-full">
          <div class="p-4 flex bg-black/20 text-details w-full rounded-2xl">
            <div class="flex gap-2">
              <span>Connected Wallet:</span>
              <span class="text-amber-500">{{ connectedWallet.slice(0, 8) }}</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 text-details w-full">
            <div class="p-4 flex gap-2 bg-black/20 rounded-2xl w-full">
              <span>Balance:</span>
              <span class="text-amber-500">{{ amountNormalized(rcaxBalance) }} $RCAX</span>
            </div>

            <a href="https://whitepaper.rcax.io/rcax-token-v2#mining" target="_blank" class="sm:ml-auto w-full sm:w-fit px-4 h-12 flex justify-center items-center bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 text-header disabled:text-white/20 font-medium rounded-xl w-fit duration-200 cursor-pointer whitespace-nowrap">Mine ⛏️</a>
            <a href="https://app.uniswap.org/tokens/polygon/0x875f123220024368968d9f1ab1f3f9c2f3fd190d" target="_blank" class="w-full sm:w-fit px-4 h-12 flex justify-center items-center bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-header disabled:text-white/20 font-medium rounded-xl w-fit duration-200 cursor-pointer whitespace-nowrap">Buy</a>
          </div>
        </div>

        <template v-if="view === View.Swap">
          <div class="p-3 grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 h-[16rem] sm:h-[26rem] overflow-y-scroll overflow-x-hidden border border-white/10 rounded-2xl gap-3 w-full">
            <template v-for="token in connectedWalletAvatars">
              <button @click="selectAvatarToSwap(token.contract_address, token.id, token.name, token.mint_number)" :disabled="!isAvatarCompatible(token.contract_address)" :class="{ 'opacity-50': !isAvatarCompatible(token.contract_address), 'hover:bg-tertiary': isAvatarCompatible(token.contract_address) && !isAvatarSelected(token.contract_address, token.id), 'bg-amber-600': isAvatarSelected(token.contract_address, token.id), 'bg-primary-accent': !isAvatarSelected(token.contract_address, token.id) }" class="relative p-2 h-fit flex flex-col justify-center items-center text-header rounded-xl duration-200 cursor-pointer">
                <img :src="getTokenImage(getSeriesStats(token.contract_address, token.name)?.series.image ?? '/img/rcax_placeholder.png')" :alt="getSeriesStats(token.contract_address, token.name)?.series.name">
                <div class="absolute top-4 right-4 p-1 bg-primary text-xs font-medium rounded-md">#{{ token.mint_number }}</div>
                <div class="mt-2 text-xs text-center font-semibold truncate w-full">{{ token.name }}</div>
              </button>
            </template>
          </div>

          <template v-if="avatarToSwap">
            <div class="px-4 h-12 flex items-center justify-center gap-2 bg-black/20 font-medium w-full rounded-xl">
              <span class="text-white">Cost:</span>
              <template v-if="freeDemoUsed">
                <span class="text-red-500">{{ amountNormalized(selectedAvatarPoolFee) }} RCAX</span>
              </template>
              <template v-else>
                <span class="text-green-500">FREE</span>
              </template>
            </div>

            <template v-if="liquidityProviderStatus">
              <ButtonLoading @click="setLiquidityProviderStatus(false)" :disabled="waitingForTransaction" :is-loading="waitingForTransaction">Disable Liquidity Provider</ButtonLoading>
            </template>
            <template v-else>
              <template v-if="freeDemoUsed && rcaxTokenAllowance < selectedAvatarPoolFee">
                <ButtonLoading @click="setRcaxTokenAllowance(DAPP_CONTRACT_ADDRESS, selectedAvatarPoolFee)" :disabled="waitingForTransaction" :is-loading="waitingForTransaction">Approve dApp to spend {{ amountNormalized(selectedAvatarPoolFee) }} $RCAX</ButtonLoading>
              </template>
              <template v-else>
                <ButtonLoading @click="swapAvatar" :disabled="waitingForTransaction" :is-loading="waitingForTransaction">Swap {{ avatarToSwap[2] }} #{{ avatarToSwap[3] }}</ButtonLoading>
              </template>
            </template>
          </template>
          <template v-else>
            <button disabled class="px-4 h-12 flex justify-center items-center bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-header disabled:text-white/20 font-medium rounded-xl w-full duration-200">Swap</button>
          </template>

          <template v-if="swapTransactionHash && swapTransactionStatus !== TxStatus.Failed">
            <div :class="{ 'bg-gray-500/20': swapTransactionStatus === TxStatus.Pending, 'bg-green-500/20': swapTransactionStatus === TxStatus.Confirmed }" class="px-4 h-12 w-full flex items-center justify-center rounded-xl">
              <a :href="`https://polygonscan.com/tx/${swapTransactionHash}`" target="_blank" class="text-sky-500">Transaction: {{ swapTransactionHash.slice(0, 8) }}</a>
            </div>

            <template v-if="swapTransactionMessage">
              <div class="px-4 h-6 flex gap-2 items-center justify-center">
                <template v-if="swapTransactionStatus === TxStatus.Pending">
                  <ion-spinner class="w-5 h-5 text-amber-500"/>
                </template>
                <span :class="{ 'text-gray-500': swapTransactionStatus === TxStatus.Pending, 'text-green-500': swapTransactionStatus === TxStatus.Confirmed }">{{ swapTransactionMessage }}</span>
              </div>
            </template>
          </template>
          <template v-else-if="swapTransactionStatus === TxStatus.Failed && swapTransactionMessage">
            <div class="px-4 h-12 w-full flex items-center justify-center bg-red-500/20 rounded-xl">
              <span class="text-white">{{ swapTransactionMessage }}</span>
            </div>
          </template>
        </template>
        <template v-else>
          <template v-if="!liquidityProviderStatus">
            <button @click="setLiquidityProviderStatus(true)" :disabled="waitingForTransaction" class="px-4 h-12 flex justify-center items-center bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-header disabled:text-white/20 font-medium rounded-xl w-full duration-200">Enable Liquidity Provider</button>
          </template>
          <template v-else>
            <div class="p-6 w-full flex items-center justify-center bg-red-500/20 rounded-xl">
              <span class="text-white">All avatars you deposit as liquidity will very likely be swapped out for another avatar by swap initiators. So when you withdraw all avatars, you will very likely get different avatars!</span>
            </div>

            <div class="p-6 w-full flex items-center justify-center bg-red-500/20 rounded-xl">
              <span class="text-white">Liquidity providers get 50% of the service fee whenever one of their avatars gets swapped in the pool. But please note that the first swap for a user is free, so you might not always receive a service fee when your avatar is swapped!</span>
            </div>

            <div class="p-6 bg-gray-500/20 text-header rounded-xl">
              <p>Use <a href="https://opensea.io/account" target="_blank" class="text-sky-500">opensea.io</a> to transfer one or more avatars to the dApp address: {{ DAPP_CONTRACT_ADDRESS }}. As longs as the Liquidity Provider Status is true, avatars will be added to the liquidity pools instead of being swapped. You can disable the Liquidity Provider Status again in the "swap" tab.</p>
            </div>
          </template>

          <button @click="withdrawAllAvatars()" :disabled="waitingForTransaction" class="px-4 h-12 flex justify-center items-center bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-header disabled:text-white/20 font-medium rounded-xl w-full duration-200">Withdraw All Avatars</button>

          <template v-if="liquidityTransactionHash && liquidityTransactionStatus !== TxStatus.Failed">
            <div :class="{ 'bg-gray-500/20': liquidityTransactionStatus === TxStatus.Pending, 'bg-green-500/20': liquidityTransactionStatus === TxStatus.Confirmed }" class="px-4 h-12 w-full flex items-center justify-center rounded-xl">
              <a :href="`https://polygonscan.com/tx/${liquidityTransactionHash}`" target="_blank" class="text-sky-500">Transaction: {{ liquidityTransactionHash.slice(0, 8) }}</a>
            </div>

            <template v-if="liquidityTransactionMessage">
              <div class="px-4 h-6 flex items-center justify-center">
                <span class="text-green-500">{{ liquidityTransactionMessage }}</span>
              </div>
            </template>
          </template>
          <template v-else-if="liquidityTransactionStatus === TxStatus.Failed && liquidityTransactionMessage">
            <div class="px-4 h-12 w-full flex items-center justify-center bg-red-500/20 rounded-xl">
              <span class="text-white">{{ liquidityTransactionMessage }}</span>
            </div>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, getSeriesStats, markRaw, onMounted, ref, updateSeriesStats, watch} from "#imports";
import {ethers, Signer} from "ethers";
import rcaxAbi from "~/assets/dapps/rcaxclassic/abi.json"
import dappAbi from "~/assets/dapps/avatarswap/abi.json";
import {useRuntimeConfig} from "#app";
import {Raw, Ref} from "@vue/reactivity";
import {Token} from "~/types/token";
import {getTokenImage} from "~/global/utils";
import {fetchWalletTokens} from "~/composables/api/wallet";
import {findCollectionNameByContractAddress} from "~/global/generations";
import detectEthereumProvider from "@metamask/detect-provider";
import {ComputedRef} from "vue";
import {ExternalProvider, Provider} from "@ethersproject/providers";
import ButtonLoading from "~/components/ButtonLoading.vue";

enum View {
  Swap,
  LiquidityProvider
}

enum TxStatus {
  Pending,
  Confirmed,
  Failed
}

const RCAX_TOKEN_ADDRESS = "0x875f123220024368968d9f1aB1f3F9C2f3fd190d";
const DAPP_CONTRACT_ADDRESS = "0xc44100e15553C85f2846eED703E23165c0e0B9a3";

const config = useRuntimeConfig();

const view: Ref<View> = ref(View.Swap);
const connectedWallet: Ref<string | null> = ref(null);
const connectedWalletAvatars: Ref<Token[]> = ref([]);
const selectedChainId = ref(0);
const freeDemoUsed = ref(false);
const liquidityProviderStatus = ref(false);
const rcaxBalance: Ref<bigint> = ref(BigInt(0));
const rcaxTokenAllowance = ref(BigInt(0));
const waitingForTransaction = ref(false);
const avatarToSwap: Ref<[string, string, string, number] | null> = ref(null);
const selectedAvatarPoolFee = ref(BigInt(0));
const isRefreshing = ref(false);
const poolFeeAwwDripMemeSingu = ref(BigInt(0));
const poolFeeGen1 = ref(BigInt(0));
const poolFeeGen2 = ref(BigInt(0));
const poolFeeGen3 = ref(BigInt(0));
const swapTransactionHash: Ref<string | null> = ref(null);
const swapTransactionStatus: Ref<TxStatus | null> = ref(null);
const swapTransactionMessage: Ref<string | null> = ref(null);
const liquidityTransactionHash: Ref<string | null> = ref(null);
const liquidityTransactionStatus: Ref<TxStatus | null> = ref(null);
const liquidityTransactionMessage: Ref<string | null> = ref(null);

let provider: Raw<ethers.providers.Web3Provider> | null = null;
let connectedRcaxContract: Raw<ethers.Contract> | null = null;
let connectedDappContract: Raw<ethers.Contract> | null = null;

onMounted(async () => {
  await connectProvider();
});

watch([provider, connectedWallet, selectedChainId], async () => {
  if (provider) {
    await checkRequestPolygonChain();
    await connectContracts();
    await refreshPoolFees();
  } else {
    selectedChainId.value = 0;
  }
});

const checkRequestPolygonChain = async () => {
  if (provider) {
    const {chainId} = await provider.getNetwork();
    selectedChainId.value = chainId;

    if (selectedChainId.value !== 137) {
      await provider.send('wallet_switchEthereumChain', [{chainId: '0x89'}]);
      await connectProvider();

      if (selectedChainId.value === 137) {
        await refresh();
      }
    }

    if (selectedChainId.value !== 137) {
      await checkRequestPolygonChain();
    }
  }
}

const amountNormalized = (amount: bigint): number => {
  const amountString = amount.toString();
  const amountWithoutZeros = amountString.slice(0, -18); // Remove 18 trailing zeros
  return Number(amountWithoutZeros);
}

const buttonConnectWallet = async () => {
  if (!provider) {
    throw new Error("Provider not available");
  }

  await connectWallet(provider);
  await refresh();
}

const connectProvider = async () => {
  if (window.ethereum) {
    provider = markRaw(new ethers.providers.Web3Provider(window.ethereum));
  } else {
    provider = markRaw(new ethers.providers.Web3Provider((await detectEthereumProvider())));
  }
}

const connectWallet = async (provider: ethers.providers.Web3Provider) => {
  try {
    await checkRequestPolygonChain();
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    connectedWallet.value = await signer.getAddress();
  } catch (err) {
    console.error(err);
  }
};

const connectContracts = async () => {
  try {
    if (!provider) throw new Error("Can't connect contracts, no provider available");

    const signer = provider.getSigner();

    if (signer) {
      connectedRcaxContract = markRaw(new ethers.Contract(RCAX_TOKEN_ADDRESS, rcaxAbi, signer));
      connectedDappContract = markRaw(new ethers.Contract(DAPP_CONTRACT_ADDRESS, dappAbi, signer));
    } else {
      connectedRcaxContract = markRaw(new ethers.Contract(RCAX_TOKEN_ADDRESS, rcaxAbi, provider));
      connectedDappContract = markRaw(new ethers.Contract(DAPP_CONTRACT_ADDRESS, dappAbi, provider));
    }
  } catch (err) {
    console.error(err);
  }
}

const refreshPoolFees = async () => {
  poolFeeAwwDripMemeSingu.value = await getPoolFeeForToken("0x6acb8fb82880d39c2b8446f8778a14d34ee6cfb7");
  poolFeeGen1.value = await getPoolFeeForToken("0x8d0501d85becda92b89e56177ddfcea5fc1f0af2");
  poolFeeGen2.value = await getPoolFeeForToken("0xe4989961ebfdac3e65fcf0059c916452c77d8503");
  poolFeeGen3.value = await getPoolFeeForToken("0x12acf83f5e855be05dbc24b9fee087049dedfbf8");
}

const refresh = async () => {
  isRefreshing.value = true;

  await checkRequestPolygonChain();
  await connectContracts();

  if (connectedWallet.value) {
    liquidityProviderStatus.value = await getLiquidityProviderStatus(connectedWallet.value);
    freeDemoUsed.value = await getFreeDemoUsedStatus(connectedWallet.value);
    rcaxBalance.value = await getRcaxBalance(connectedWallet.value);
    rcaxTokenAllowance.value = await getRcaxTokenAllowance(connectedWallet.value, DAPP_CONTRACT_ADDRESS);
    connectedWalletAvatars.value = await getWalletTokens(connectedWallet.value);
  }

  await refreshPoolFees();
  await updateSeriesStats();

  isRefreshing.value = false;
}

const getRcaxBalance = async (address: String): Promise<bigint> => {
  if (connectedRcaxContract) {
    return await connectedRcaxContract.balanceOf(address);
  }

  return BigInt(0);
}

const getPoolFeeForToken = async (tokenAddress: String): Promise<bigint> => {
  if (connectedDappContract) {
    return await connectedDappContract.getPoolFeeForToken(tokenAddress);
  }

  return BigInt(0);
}

const getRcaxTokenAllowance = async (owner: string, spender: string): Promise<bigint> => {
  if (connectedRcaxContract) {
    return await connectedRcaxContract.allowance(owner, spender);
  }

  return BigInt(0);
};

const getFreeDemoUsedStatus = async (address: string): Promise<boolean> => {
  if (connectedDappContract) {
    return await connectedDappContract.getFreeDemoUsedStatus(address);
  }

  return false;
};

const getLiquidityProviderStatus = async (address: string): Promise<boolean> => {
  if (connectedDappContract) {
    return await connectedDappContract.getLiquidityProviderStatus(address);
  }

  return false;
};

const setRcaxTokenAllowance = async (spender: string, amount: bigint) => {
  if (waitingForTransaction.value) {
    throw new Error("Wait for the previous transaction");
  }

  if (connectedWallet.value && connectedRcaxContract) {
    await checkRequestPolygonChain();

    waitingForTransaction.value = true;

    try {
      let tx = await connectedRcaxContract.approve(spender, amount);
      await tx.wait();
      rcaxTokenAllowance.value = await getRcaxTokenAllowance(connectedWallet.value, spender);
    } catch (error) {
      console.error('Error setting RCAX token allowance:', error);
    } finally {
      waitingForTransaction.value = false;
    }
  }
};

const withdrawAllAvatars = async () => {
  if (connectedWallet.value && connectedDappContract && !waitingForTransaction.value) {
    waitingForTransaction.value = true;

    await checkRequestPolygonChain();

    try {
      let tx = await connectedDappContract.withdrawAllAvatars();
      liquidityTransactionHash.value = tx.hash;
      liquidityTransactionStatus.value = TxStatus.Pending;

      await tx.wait();

      liquidityTransactionStatus.value = TxStatus.Confirmed;
      liquidityTransactionMessage.value = "All avatars successfully withdrawn!"
    } catch (error) {
      liquidityTransactionStatus.value = TxStatus.Failed;
      liquidityTransactionMessage.value = error.data?.message ?? "Please try again.";

      console.error('Error withdrawing all avatars:', error);
      throw error;
    } finally {
      waitingForTransaction.value = false;
    }
  }
};

const setLiquidityProviderStatus = async (status: boolean) => {
  if (connectedWallet.value && connectedDappContract && !waitingForTransaction.value) {
    waitingForTransaction.value = true;

    await checkRequestPolygonChain();

    try {
      let tx = await connectedDappContract.setLiquidityProviderStatus(status);
      await tx.wait();
      liquidityProviderStatus.value = status;
    } catch (error) {
      console.error('Error setting liquidity provider status:', error);
    } finally {
      waitingForTransaction.value = false;
    }
  }
};

async function transferERC1155Token(contractAddress: string, recipientAddress: string, tokenId: string, amount: number) {
  if (provider && !waitingForTransaction.value) {
    try {
      waitingForTransaction.value = true;

      await checkRequestPolygonChain();

      let signer = provider.getSigner();

      // Create an instance of the ERC1155 contract
      const erc1155Contract = new ethers.Contract(contractAddress, ['function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes _data)'], signer);

      // Transfer tokens
      const tx = await erc1155Contract.safeTransferFrom(signer.getAddress(), recipientAddress, tokenId, amount, '0x'); // The '0x' is optional data

      swapTransactionHash.value = tx.hash;
      swapTransactionStatus.value = TxStatus.Pending;
      swapTransactionMessage.value = "Swapping.."

      await tx.wait();

      swapTransactionStatus.value = TxStatus.Confirmed;
      swapTransactionMessage.value = "Swap successful!"

      console.log(`Transferred ${amount} tokens of ID ${tokenId} to ${recipientAddress}`);
    } catch (error) {
      swapTransactionStatus.value = TxStatus.Failed;
      swapTransactionMessage.value = error.data?.message ?? "Please try again.";

      console.error('Error transferring tokens:', error);
      throw error;
    } finally {
      waitingForTransaction.value = false;
    }
  }
}

const swapAvatar = async () => {
  if (avatarToSwap.value && avatarToSwap.value[0] && avatarToSwap.value[1]) {
    try {
      await transferERC1155Token(avatarToSwap.value[0], DAPP_CONTRACT_ADDRESS, avatarToSwap.value[1], 1);
      avatarToSwap.value = null;
      await refresh();
    } catch (error) {
      console.error('Error swapping avatar:', error);
    }
  }
}

const selectAvatarToSwap = async (tokenAddress: string, tokenId: string, name: string, mintNumber: number) => {
  if (isAvatarSelected(tokenAddress, tokenId)) {
    avatarToSwap.value = null;
    selectedAvatarPoolFee.value = BigInt(0);
  } else {
    avatarToSwap.value = [tokenAddress, tokenId, name, mintNumber];
    selectedAvatarPoolFee.value = await getPoolFeeForToken(avatarToSwap.value[0]);
  }
}

const isAvatarSelected = (tokenAddress: string, tokenId: string): boolean => {
  if (!avatarToSwap.value) return false;

  return avatarToSwap.value[0] === tokenAddress && avatarToSwap.value[1] === tokenId;
}

const isAvatarCompatible = (tokenAddress: string): boolean => {
  let compatible = false;
  let gen = findCollectionNameByContractAddress(tokenAddress);

  switch (gen) {
    case "awwdripmemesingu":
      compatible = true;
      break;
    case "gen1":
      compatible = true;
      break;
    case "gen2":
      compatible = true;
      break;
    case "gen3":
      compatible = true;
      break;
  }

  return compatible;
}

const getWalletTokens = async (wallet: string): Promise<Token[]> => {
  try {
    let data = await fetchWalletTokens(wallet, true);
    const wallets = Object.entries(data.wallets);
    const [, tokens] = wallets[0];

    tokens.forEach((token) => {
      if (token.contract_address === "0xa3396af20ce52bd3c7ab6d7046be617257f60eb9" && token.mint_number <= 24) {
        token.name = "Gold Hodl";
      }
    });

    return tokens;
  } catch (err) {
    return [];
  }
}
</script>

<style scoped>
.active-tab {
  @apply bg-amber-600 hover:bg-amber-600;
}
</style>
