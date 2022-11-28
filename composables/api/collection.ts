import {collection_list_from_object, CollectionList} from "~/types/reddit_collection";
import {set_collection_list} from "~/composables/states";
import {useRuntimeConfig} from "#app";
import {API_UNREACHABLE, API_UNRECOGNIZED_RESPONSE} from "~/global/constants";

export async function getCollections() {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;

    let url = `${BACKEND_ADDR}/collections`;

    return await fetch(url)
        .then(async (data) => {
            data = await data.json();

            if (data['collections']) {
                let collectionList: CollectionList = collection_list_from_object(data['collections']);

                await set_collection_list(collectionList);

                return Promise.resolve(true);
            }

            return Promise.reject(API_UNRECOGNIZED_RESPONSE);
        })
        .catch((err) => {
            return Promise.reject(API_UNREACHABLE);
        });
}
