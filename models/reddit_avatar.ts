import {TierHash} from "~/models/reddit_collection_tier";
import {Hasher} from "~/global/hasher";

export type AvatarHash = string;
export type AvatarList = Map<AvatarHash, RedditAvatar>;

export class RedditAvatar {
    collection_tier_hash: TierHash;
    contract_address: string;
    tier: number;
    name: string;
    mint_number: number;
    // Purchase link.
    link: string;

    public constructor(
        collection_tier_hash: TierHash,
        contract_address: string,
        tier: number,
        name: string,
        mint_number: number,
        link: string
    ) {
        this.collection_tier_hash = collection_tier_hash;
        this.contract_address = contract_address;
        this.tier = tier;
        this.name = name;
        this.mint_number = mint_number;
        this.link = link;
    }

    public async calculate_hash(): Promise<string> {
        let encoded = this.contract_address + this.name + this.mint_number;

        return await Hasher.hash(encoded)
    }
}
