import {Token} from "~/types/token";
import {WalletAddress} from "~/types/user";

export interface WalletTokens {
    [key: string]: Token[];
}

export interface ApiResponse {
    wallets: Record<WalletAddress, Token[]>;
    cones: number;
    weth: number;
}

export interface ApiTokenBalanceResponse {
    balance: number;
}
