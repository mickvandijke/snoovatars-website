import {useRuntimeConfig} from "#app";
import {ApiResponseMarket} from "~/types/info";

export async function fetchMarketInfo(): Promise<[number, number]> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;
    const url = `${BACKEND_ADDR}/info/market`;

    const response = await fetch(url);
    const data: ApiResponseMarket = await response.json();

    return [data.total_daily_volume, data.total_market_cap];
}
