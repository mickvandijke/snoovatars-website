<template>
  <div class="px-4 md:px-6 py-12 flex flex-col gap-6 max-w-6xl">
    <div class="flex flex-col items-center gap-6 w-full">
      <div class="flex flex-col gap-1 items-center">
        <h1 class="text-4xl text-header text-center font-bold">Convert RCAX Classic to V2</h1>
      </div>

      <template v-if="!connectedWallet">
        <button @click="buttonConnectWallet" class="px-4 h-12 flex justify-center items-center bg-amber-600 hover:bg-amber-500 disabled:bg-white/5 text-header disabled:text-white/20 font-medium rounded-xl w-fit duration-200">Connect wallet</button>
      </template>
      <template v-else>
        <div class="flex flex-col gap-3 w-full">
          <div class="flex items-center gap-3 text-details w-full">
            <div class="p-4 flex gap-2 bg-black/20 rounded-2xl w-full">
              <span>Connected Wallet:</span>
              <span class="text-amber-500">{{ connectedWallet.slice(0, 8) }}</span>
            </div>
            <RefreshButton :action="refresh" :refreshing="isRefreshing" />
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 text-details w-full">
            <div class="p-4 flex gap-2 bg-black/20 rounded-2xl w-full">
              <span>Balance:</span>
              <span class="text-purple-500">{{ amountNormalized(rcaxClassicBalance) }} RCAX Classic</span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 text-details w-full">
            <div class="p-4 flex gap-2 bg-black/20 rounded-2xl w-full">
              <span>Balance:</span>
              <span class="text-amber-500">{{ amountNormalized(rcaxBalance) }} RCAX</span>
            </div>
          </div>

          <template v-if="rcaxClassicBalance > 0">
            <template v-if="rcaxClassicAllowance < rcaxClassicBalance">
              <ButtonLoading @click="setRcaxClassicAllowance(RCAX_TOKEN_ADDRESS, rcaxClassicBalance)" :disabled="waitingForTransaction" :is-loading="waitingForTransaction">Approve to convert tokens</ButtonLoading>
            </template>
            <template v-else>
              <ButtonLoading @click="convertClassicTokens(rcaxClassicBalance)" :disabled="waitingForTransaction" :is-loading="waitingForTransaction">Convert classic tokens</ButtonLoading>
            </template>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {markRaw, onMounted, ref, watch} from "#imports";
import {ethers, Signer} from "ethers";
import rcaxAbi from "~/assets/dapps/rcaxv2/abi.json";
import rcaxClassicAbi from "~/assets/dapps/rcaxclassic/abi.json";
import {useRuntimeConfig} from "#app";
import {Raw, Ref} from "@vue/reactivity";
import detectEthereumProvider from "@metamask/detect-provider";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";

const RCAX_CLASSIC_ADDRESS = "0xC99BD85BA824De949cf088375225E3FdCDB6696C";
const RCAX_TOKEN_ADDRESS = "0x875f123220024368968d9f1aB1f3F9C2f3fd190d";

const config = useRuntimeConfig();

const connectedWallet: Ref<string | null> = ref(null);
const selectedChainId = ref(0);
const rcaxBalance: Ref<bigint> = ref(BigInt(0));
const rcaxClassicBalance: Ref<bigint> = ref(BigInt(0));
const rcaxClassicAllowance = ref(BigInt(0));
const waitingForTransaction = ref(false);
const isRefreshing = ref(false);
let provider: Raw<ethers.providers.Web3Provider> | null = null;
let connectedRcaxContract: Raw<ethers.Contract> | null = null;
let connectedRcaxClassicContract: Raw<ethers.Contract> | null = null;

onMounted(async () => {
  await connectProvider();
});

watch([provider, connectedWallet, selectedChainId], async () => {
  if (provider) {
    await checkRequestPolygonChain();
    await connectContracts();
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
      connectedRcaxClassicContract = markRaw(new ethers.Contract(RCAX_CLASSIC_ADDRESS, rcaxClassicAbi, signer));
    } else {
      connectedRcaxContract = markRaw(new ethers.Contract(RCAX_TOKEN_ADDRESS, rcaxAbi, provider));
      connectedRcaxClassicContract = markRaw(new ethers.Contract(RCAX_CLASSIC_ADDRESS, rcaxClassicAbi, provider));
    }
  } catch (err) {
    console.error(err);
  }
}

const refresh = async () => {
  isRefreshing.value = true;

  await checkRequestPolygonChain();
  await connectContracts();

  if (connectedWallet.value) {
    rcaxBalance.value = await getRcaxBalance(connectedWallet.value);
    rcaxClassicBalance.value = await getRcaxClassicBalance(connectedWallet.value);
    rcaxClassicAllowance.value = await getRcaxClassicAllowance(connectedWallet.value, RCAX_TOKEN_ADDRESS);
  }

  isRefreshing.value = false;
}

const getRcaxBalance = async (address: String): Promise<bigint> => {
  if (connectedRcaxContract) {
    return await connectedRcaxContract.balanceOf(address);
  }

  return BigInt(0);
}

const getRcaxClassicBalance = async (address: String): Promise<bigint> => {
  if (connectedRcaxClassicContract) {
    return await connectedRcaxClassicContract.balanceOf(address);
  }

  return BigInt(0);
}

const getRcaxClassicAllowance = async (owner: string, spender: string): Promise<bigint> => {
  if (connectedRcaxClassicContract) {
    return await connectedRcaxClassicContract.allowance(owner, spender);
  }

  return BigInt(0);
};

const setRcaxClassicAllowance = async (spender: string, amount: bigint) => {
  if (waitingForTransaction.value) {
    throw new Error("Wait for the previous transaction");
  }

  if (connectedWallet.value && connectedRcaxClassicContract) {
    await checkRequestPolygonChain();

    waitingForTransaction.value = true;

    // Give a little extra room of 1 token to avoid rounding problems
    amount = BigInt(amount) + BigInt(ETH_TO_GWEI_MODIFIER);

    try {
      let tx = await connectedRcaxClassicContract.approve(spender, amount);
      await tx.wait();
      rcaxClassicAllowance.value = await getRcaxClassicAllowance(connectedWallet.value, spender);
    } catch (error) {
      console.error('Error setting RCAX token allowance:', error);
    } finally {
      waitingForTransaction.value = false;
    }
  }
};

const convertClassicTokens = async (amount: bigint) => {
  if (waitingForTransaction.value) {
    throw new Error("Wait for the previous transaction");
  }

  if (connectedWallet.value && connectedRcaxContract) {
    await checkRequestPolygonChain();

    waitingForTransaction.value = true;

    try {
      let tx = await connectedRcaxContract.convertClassicTokens(amount);
      await tx.wait();
      rcaxBalance.value = await getRcaxBalance(connectedWallet.value);
      rcaxClassicBalance.value = await getRcaxClassicBalance(connectedWallet.value);
    } catch (error) {
      console.error('Error converting classic tokens:', error);
    } finally {
      waitingForTransaction.value = false;
    }
  }
};
</script>

<style scoped>
.active-tab {
  @apply bg-amber-600 hover:bg-amber-600;
}
</style>
