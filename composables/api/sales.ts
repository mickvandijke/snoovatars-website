import {useRuntimeConfig} from "#app";
import {ApiResponseForSeries, ApiResponseLatest, Sale} from "~/types/sale";
import {SeriesStats} from "~/types/seriesStats";

export async function fetchSalesLatest(): Promise<[Array<Sale>, Map<string, SeriesStats>]> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/sales/latest`;

    const response = await fetch(url);
    const data: ApiResponseLatest = await response.json();

    return [data.sales, data.series_stats];
}

export async function fetchSalesForSeries(contract_address: string, series: string): Promise<Array<Sale>> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/sales/${contract_address}/${series}`;

    const response = await fetch(url);
    const data: ApiResponseForSeries = await response.json();

    if (!data.sales) {
        return [];
    }

    const sales: Sale[] = Object.values(data.sales);

    sales.sort((saleA, saleB) => {
        const dateA = new Date(saleA.date_sold);
        const dateB = new Date(saleB.date_sold);
        return dateB.getTime() - dateA.getTime(); // newest date should be earlier in the array
    });

    return sales;
}
