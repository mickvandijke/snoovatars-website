import {Hasher} from "~/global/hasher";

export interface Series {
    name: string;
    contract_address: string;
    image: string;
    background_image: string;
    accessory_ids: string[];
    total_quantity: number;
    total_sold: number;
    mint_price: number;
    status: string;
}

export async function calculate_hash(series: Series): Promise<string> {
    let encoded = series.contract_address + series.name;

    return await Hasher.hash(encoded)
}

export interface ApiResponse {
    series: Record<string, Series>;
}
