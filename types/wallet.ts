import {Token} from "~/types/token";
import {WalletAddress} from "~/types/user";

export interface WalletTokens {
    [key: string]: Token[];
}

export interface ApiResponse {
    wallets: Record<WalletAddress, Record<string, Token[]>>;
    cones: number;
    weth: number;
}
