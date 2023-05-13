import {useRuntimeConfig} from "#app";
import {ApiResponse} from "~/types/wallet";

export async function fetchWalletTokens(wallet_address: string): Promise<ApiResponse> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/wallet/${wallet_address}`;

    const response = await fetch(url);
    const data: ApiResponse = await response.json();

    if (!data.tokens) {
        return {};
    }

    return data;
}
