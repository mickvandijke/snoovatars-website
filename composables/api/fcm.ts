import {useRuntimeConfig} from "#app";
import {useToken} from "~/composables/states";
import {handleCatch, handleResponseError} from "~/composables/api/error";
import {deleteToken} from "~/composables/api/user";

export async function registerFcmDeviceToken(token: string) {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;

    let url = `${BACKEND_ADDR}/jwt/user/fcm/token`;

    await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useToken().value}`
        },
        body: JSON.stringify({
            device_token: token
        })
    })
        .then(async (res) => {
            if (!res.ok) {
                // If user not found.
                if (res.status == 404) {
                    deleteToken();
                }

                await handleResponseError(res);
            }
        })
        .catch(handleCatch);
}
