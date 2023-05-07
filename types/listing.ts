import {Token} from "~/types/token";

export interface Listing {
    token: Token;
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

export interface ApiResponseLatest {
    listings: Array<Listing>;
}

export interface ListingsResponse {
    [key: string]: Listing;
}

export interface ApiResponseForSeries {
    listings: ListingsResponse;
}
