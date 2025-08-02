import {useRuntimeConfig} from "#app";

export async function getUnreleasedItems(): Promise<Array<Object>> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;
    const url = `${BACKEND_ADDR}/shop/items`;

    const response = await fetch(url);
    const data = await response.json();

    return data.items;
}
