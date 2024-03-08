import {ApiResponse, SeriesStats} from "~/types/seriesStats";
import {useRuntimeConfig} from "#app";

export async function fetchSeriesStats(): Promise<Map<string, Map<string, SeriesStats>>> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;
    const url = `${BACKEND_ADDR}/v2/series/stats`;

    const response = await fetch(url);
    const data: ApiResponse = await response.json();

    return data.series_stats;
}
