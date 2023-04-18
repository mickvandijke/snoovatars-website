import {useRuntimeConfig} from "#app";
import {API_UNREACHABLE, API_UNRECOGNIZED_RESPONSE} from "~/global/constants";

export async function getTokens() {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;

    let url = `${BACKEND_ADDR}/tokens`;

    return await fetch(url)
        .then(async (data) => {
            data = await data.json();

            if (data['tokens']) {
                return Promise.resolve(data['tokens']);
            }

            return Promise.reject(API_UNRECOGNIZED_RESPONSE);
        })
        .catch((err) => {
            return Promise.reject(API_UNREACHABLE);
        });
}
