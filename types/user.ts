export type WalletAddress = string;

export class User {
    public id: string;
    public wallet_address?: WalletAddress;
    public username?: string;
    public email: string;
    public tier: number;
    public snooze_holder: boolean;
}
