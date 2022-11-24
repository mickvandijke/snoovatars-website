import WalletConnectProvider from "@walletconnect/web3-provider";
import {useRuntimeConfig} from "#app";

const config = useRuntimeConfig();

export const provider = new WalletConnectProvider({
    infuraId: config.INFURA_ID,
});
