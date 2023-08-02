import { useRuntimeConfig } from "#app";
import {Series, ApiResponse } from "~/types/series";

export async function fetchSeries(): Promise<Map<string, Map<string, Series>>> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/v2/series`;

    const response = await fetch(url);
    const data: ApiResponse = await response.json();

    return data.series;
}
