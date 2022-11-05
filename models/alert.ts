import {TierHash} from "~/models/reddit_collection_tier";
import {AvatarHash} from "~/models/reddit_avatar";
import {Hasher} from "~/global/hasher";
import {ETH_TO_GWEI_MODIFIER} from "~/models/ethereum";

export type AlertHash = string;
export type AlertList = Map<AlertHash, Alert>;

export class Alert {
    public user_id: string;
    public collection_tier_hash: TierHash;
    public item_hash: AvatarHash;
    public alert_type: AlertType;
    public repeating: boolean;
    public max_mint_number: number;
    public price_threshold: number;

    public async calculate_hash(): Promise<string> {
        let encoded = this.toJson().toString();

        return await Hasher.hash(encoded)
    }

    public toJson(): Object {
        return {
            user_id: this.user_id,
            collection_tier_hash: this.collection_tier_hash,
            item_hash: this.item_hash,
            alert_type: AlertType[this.alert_type],
            repeating: this.repeating,
            max_mint_number: this.max_mint_number,
            price_threshold: this.price_threshold * ETH_TO_GWEI_MODIFIER
        }
    }

    public isValid(): boolean {
        return !!(this.user_id && this.collection_tier_hash);

    }
}

export enum AlertType {
    ListingBelow,
    SaleAbove
}

export function alert_list_from_object(alertsObject: Object): AlertList {
    let alertList: AlertList = new Map<AlertHash, Alert>();

    Object.entries(alertsObject).forEach(([alertHash, alertObject]) => {
        let alert: Alert = new Alert();

        Object.assign(alert, alertObject);

        alert.price_threshold = alertObject['price_threshold'] / ETH_TO_GWEI_MODIFIER;

        alertList.set(alertHash, alert);
    })

    return alertList;
}
