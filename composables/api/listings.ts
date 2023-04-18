import {useRuntimeConfig} from "#app";
import {API_UNREACHABLE, API_UNRECOGNIZED_RESPONSE} from "~/global/constants";

export async function getListings() {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;

    let url = `${BACKEND_ADDR}/listings`;

    return await fetch(url)
        .then(async (data) => {
            data = await data.json();

            if (data['listings']) {
                return Promise.resolve(data['listings']);
            }

            return Promise.reject(API_UNRECOGNIZED_RESPONSE);
        })
        .catch((err) => {
            return Promise.reject(API_UNREACHABLE);
        });
}
