import {useRuntimeConfig} from "#app";
import {ApiResponse, ApiTokenBalanceResponse} from "~/types/wallet";

export async function fetchWalletTokens(wallet_address: string, forceRefresh?: boolean): Promise<ApiResponse> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/v2/wallet/${wallet_address}?force=${forceRefresh ?? false}`;

    try {
        const response = await fetch(url);

        if (response.ok) {
            const data: ApiResponse = await response.json();
            return data;
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function fetchWalletTokenBalance(token_address: string, wallet_address: string): Promise<number> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/token/${token_address}/${wallet_address}`;

    try {
        const response = await fetch(url);

        if (response.ok) {
            const data: ApiTokenBalanceResponse = await response.json();
            return data.balance;
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

