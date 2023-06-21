import {useRuntimeConfig} from "#app";
import {ApiResponse, ApiResponseForSeries, ApiResponseLatest, Listing} from "~/types/listing";
import {useToken} from "~/composables/states";
import {handleResponseError} from "~/composables/api/error";

export async function fetchListings(): Promise<Record<string, Record<string, Record<string, Listing>>>> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;

    let url = `${BACKEND_ADDR}/listings`;

    return await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useToken().value}`
        }
    })
        .then(async (res) => {
            if (!res.ok) {
                return Promise.reject();
            }

            const data: ApiResponse = await res.json();

            return Promise.resolve(data.listings);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

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

    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useToken().value}`
        }
    });

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
