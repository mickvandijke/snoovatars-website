import {TierHash} from "~/models/reddit_collection_tier";
import {AvatarHash} from "~/models/reddit_avatar";

export type AlertHash = string;
export type AlertList = Map<AlertHash, Alert>;

export class Alert {
    public user_id: string;
    public collection_tier_hash: TierHash;
    public item_hash: AvatarHash;
    public type: AlertType;
    public repeating: boolean;
    public max_mint_number: number;
    public price_threshold: bigint;
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

        alertList.set(alertHash, alert);
    })

    return alertList;
}
