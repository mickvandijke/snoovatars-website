import {Sale} from "~/types/sale";
import {Listing} from "~/types/listing";

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
        lowest_listing: Listing;
        last_sale: Sale;
        daily_price_change: number;
        weekly_average_price: number;
        two_weekly_average_price: number;
        monthly_average_price: number;
        daily_volume: number;
        five_last_sales_average: number;
    };
}

export interface ApiResponse {
    series_stats: Map<string, SeriesStats>;
}
