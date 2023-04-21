import {ApiResponse, SeriesStats} from "~/types/seriesStats";
import {useRuntimeConfig} from "#app";

export async function fetchSeriesStats(): Promise<Map<string, SeriesStats>> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/series/stats`;

    const response = await fetch(url);
    const data: ApiResponse = await response.json();

    return data.series_stats;
}
