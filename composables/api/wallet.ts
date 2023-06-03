import {useRuntimeConfig} from "#app";
import {ApiResponse} from "~/types/wallet";

export async function fetchWalletTokens(wallet_address: string): Promise<ApiResponse> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/wallet/${wallet_address}`;

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

