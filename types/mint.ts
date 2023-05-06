import {Token} from "~/types/token";

export interface Mint {
    minter: string;
    date_minted: string;
    contract_address: string;
    token_id: string;
    token: Token
}

export interface ApiResponseLatest {
    mints: Array<Mint>;
}
