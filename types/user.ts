export type WalletAddress = string;

export class User {
    public id: string;
    public wallet_address?: WalletAddress;
    public username?: string;
    public email: string;
    public tier: number;
    public snooze_holder: boolean;
}

export interface UserSettings {
    shop_new_paid_avatars_alert: boolean;
    new_deployed_contracts_alert: boolean;
    email_notifications: boolean;
    push_notifications: boolean;
}
