import {useRuntimeConfig} from "#app";
import {ApiResponseLatest, Mint} from "~/types/mint";

export async function fetchMintsLatest(): Promise<Array<Mint>> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/mints/latest`;

    const response = await fetch(url);
    const data: ApiResponseLatest = await response.json();

    return data.mints.reverse();
}
