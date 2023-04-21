import {SeriesStats} from "~/types/seriesStats";

export interface Sale {
    token: {
        contract_address: string;
        id: string;
        name: string;
        mint_number: number;
        image: string;
    };
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
}
