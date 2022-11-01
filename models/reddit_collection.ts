import {RedditCollectionTier} from "~/models/reddit_collection_tier";

export type CollectionSlug = string;
export type CollectionList = Map<CollectionSlug, RedditCollection>;

export class RedditCollection {
    public name: string;
    public slug: CollectionSlug;
    public tiers: Array<RedditCollectionTier>;
}

export function collection_list_from_object(collectionsObject): CollectionList {
    let collectionList: CollectionList = new Map<CollectionSlug, RedditCollection>();

    Object.entries(collectionsObject).forEach(([slug, collectionObject]) => {
        let collection: RedditCollection = new RedditCollection();

        let tiers: Array<RedditCollectionTier> = new Array<RedditCollectionTier>();

        collectionObject['tiers'].forEach((tierObject, index) => {
            let tier: RedditCollectionTier = new RedditCollectionTier();

            Object.assign(tier, JSON.parse(JSON.stringify(tierObject)));

            tiers.push(tier);
        })

        collectionObject['tiers'] = [];

        Object.assign(collection, JSON.parse(JSON.stringify(collectionObject)));

        collection.tiers = tiers;

        collectionList.set(collection.slug, collection);
    })

    return collectionList;
}
