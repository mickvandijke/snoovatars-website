import {SeriesStats} from "~/types/seriesStats";
import {Token} from "~/types/token";

export interface Sale {
    token: Token;
    permalink: string;
    date_sold: string;
    seller: string;
    buyer: string;
    payment_token: {
        symbol: string;
        base_price: number;
        eth_price: number;
    };
}

export interface ApiResponseLatest {
    sales: Array<Sale>;
    series_stats: Map<string, SeriesStats>;
}

export interface SalesResponse {
    [key: string]: Sale;
}

export interface ApiResponseForSeries {
    sales: SalesResponse;
}
