export type WalletAddress = string;

export class User {
    wallet_address: WalletAddress;
    email: string;
    tier: number;
    snooze_holder: boolean;
}
