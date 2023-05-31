import {useRuntimeConfig} from "#app";
import {handleResponseError} from "~/composables/api/error";

export async function postGoogleOrder(order: CdvPurchase.Transaction): Promise<string> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.API_BASE_URL;

    let url = `${BACKEND_ADDR}/webhooks/google/order/confirm`;

    return await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
    })
        .then(async (res) => {
            if (!res.ok) {
                await handleResponseError(res);

                return Promise.reject();
            } else {
                return Promise.resolve(order.transactionId);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}
