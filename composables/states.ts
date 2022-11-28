import {useState} from "nuxt/app";
import {CollectionList, CollectionSlug, RedditCollection} from "~/types/reddit_collection";
import {RedditCollectionTier, TierHash, TierList} from "~/types/reddit_collection_tier";
import {AvatarHash, AvatarList, RedditAvatar} from "~/types/reddit_avatar";
import {AccountTierAlertQuotas, Alert, AlertHash, AlertList} from "~/types/alert";
import {User} from "~/types/user";

export const useCollectionList = () => useState<CollectionList>('collection-list', () => new Map<CollectionSlug, RedditCollection>());
export const useTierList = () => useState<TierList>('tier-list', () => new Map<TierHash, RedditCollectionTier>());
export const useAvatarList = () => useState<AvatarList>('avatar-list', () => new Map<AvatarHash, RedditAvatar>());
export const useAlertQuotas = () => useState<AccountTierAlertQuotas>('alert-max-quotas', () => null);
export const useAlertList = () => useState<AlertList>('alert-list', () => new Map<AlertHash, Alert>());
export const useUser = () => useState<User>('user', () => null);
export const useToken = () => useState<string>('token', () => null);

async function update_tier_and_avatar_list() {
    let tierList: Map<TierHash, RedditCollectionTier> = new Map<TierHash, RedditCollectionTier>();
    let avatarList: Map<AvatarHash, RedditAvatar> = new Map<AvatarHash, RedditAvatar>();

    let collectionList = useCollectionList().value;

    collectionList.forEach((collection) => {
        collection.tiers.forEach( async (tier) => {
            tierList.set(await tier.calculate_hash(), tier);

            for (let mint = 1; mint <= tier.mints; mint++) {
                let avatar = new RedditAvatar(
                    await tier.calculate_hash(),
                    tier.contract_address,
                    tier.tier,
                    tier.name,
                    mint,
                    ""
                );

                avatarList.set(await avatar.calculate_hash(), avatar);
            }
        })
    })

    useTierList().value = tierList;
    useAvatarList().value = avatarList;
}

export async function set_collection_list(collectionList: CollectionList) {
    useCollectionList().value = collectionList;

    await update_tier_and_avatar_list();
}
