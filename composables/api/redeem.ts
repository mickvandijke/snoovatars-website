import {useRuntimeConfig} from "#app";
import {useToken} from "~/composables/states";
import {handleResponseError} from "~/composables/api/error";
import {deleteToken} from "~/composables/api/user";

export async function redeemOrder(orderId: string) {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;

    let url = `${BACKEND_ADDR}/jwt/redeem/${orderId}`;

    await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useToken().value}`
        }
    })
        .then(async (res) => {
            if (!res.ok) {
                // If user not found.
                if (res.status == 404) {
                    deleteToken();
                }

                await handleResponseError(res);
            } else {
                let data = await res.text();

                return Promise.resolve(data);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}
