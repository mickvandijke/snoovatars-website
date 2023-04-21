import {useRuntimeConfig} from "#app";
import {ApiResponseLatest, Sale} from "~/types/sale";

export async function fetchSalesLatest(): Promise<Array<Sale>> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/sales/latest`;

    const response = await fetch(url);
    const data: ApiResponseLatest = await response.json();

    return data.sales;
}
