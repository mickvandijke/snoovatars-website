import {useRuntimeConfig} from "#app";
import {ApiResponseForSeries, ApiResponseLatest, Listing} from "~/types/listing";

export async function fetchListingsLatest(): Promise<Array<Listing>> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/listings/latest`;

    const response = await fetch(url);
    const data: ApiResponseLatest = await response.json();

    return data.listings;
}

export async function fetchListingsForSeries(contract_address: string, series: string): Promise<Array<Listing>> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/listings/${contract_address}/${series}`;

    const response = await fetch(url);
    const data: ApiResponseForSeries = await response.json();

    if (!data.listings) {
        return [];
    }

    const listings: Listing[] = Object.values(data.listings);

    listings.sort((listingA, listingB) => {
        const dateA = new Date(listingA.date_listed);
        const dateB = new Date(listingB.date_listed);
        return dateB.getTime() - dateA.getTime(); // newest date should be earlier in the array
    });

    return listings;
}
