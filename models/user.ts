export type WalletAddress = string;

export class User {
    public wallet_address: WalletAddress;
    public email: string;
    public tier: number;
    public snooze_holder: boolean;
}
