import { useRuntimeConfig } from "#app";
import {ApiResponse, Collection} from "~/types/collection";

export async function fetchCollections(): Promise<Collection[]> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;
    const url = `${BACKEND_ADDR}/collections`;

    const response = await fetch(url);
    const data: ApiResponse = await response.json();

    return Object.values(data.collections);
}
