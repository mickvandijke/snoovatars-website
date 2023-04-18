import { useRuntimeConfig } from "#app";
import {Series, ApiResponse } from "~/types/series";

export async function fetchSeries(): Promise<Series[]> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/series`;

    const response = await fetch(url);
    const data: ApiResponse = await response.json();

    return Object.values(data.series);
}
