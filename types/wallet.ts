import {Token} from "~/types/token";

export interface WalletTokens {
    [key: string]: Token[];
}

export interface ApiResponse {
    tokens: WalletTokens;
    cones: number
}
