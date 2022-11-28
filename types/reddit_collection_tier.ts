import {Hasher} from "~/global/hasher";


export type TierHash = string;
export type TierList = Map<TierHash, RedditCollectionTier>;

export class RedditCollectionTier {
    collection_slug: string;
    contract_address: string;
    tier: number;
    name: string;
    mints: number;

    public async calculate_hash(): Promise<string> {
        let encoded = this.contract_address + this.name;

        return await Hasher.hash(encoded)
    }
}
