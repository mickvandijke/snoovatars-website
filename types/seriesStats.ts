import {Sale} from "~/types/sale";

export interface SeriesStats {
    collection: {
        name: string;
        description: string;
        contract_address: string;
        slug: string;
    };
    series: {
        name: string;
        contract_address: string;
        image: string;
        background_image: string;
        accessory_ids: string[];
        total_quantity: number;
        total_sold: number;
        mint_price: number;
        status: string;
    };
    stats: {
        total_volume: number;
        lowest_listing: {
            token: {
                contract_address: string;
                id: string;
                name: string;
                mint_number: number;
                image: string;
            };
            permalink: string;
            date_listed: string;
            date_expiration: string;
            maker_address: string;
            payment_token: {
                symbol: string;
                base_price: number;
                eth_price: number;
            };
        }
        last_sale: Sale
    };
}

export interface ApiResponse {
    series_stats: Map<string, SeriesStats>;
}
