import {User, UserSettings} from "~/types/user";
import {useToken, useUser} from "#imports";
import {handleCatch, handleResponseError} from "~/composables/api/error";
import {useRuntimeConfig} from "#app";
import {API_UNREACHABLE, API_UNRECOGNIZED_RESPONSE} from "~/global/constants";
import {useFcmDeviceToken} from "~/composables/states";
import {registerFcmDeviceToken} from "~/composables/api/fcm";
import {ApiTokenBalanceResponse} from "~/types/wallet";

export function setToken(token: string) {
    localStorage.setItem("Token", token);

    useToken().value = token;
}

export function deleteToken() {
    localStorage.removeItem("Token");

    useToken().value = null;
}

export async function createUser(email: string, username: string, password: string): Promise<string> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;

    let url = `${BACKEND_ADDR}/jwt/user/create`;

    return await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            username,
            password
        })
    })
        .then(async (res) => {
            if (!res.ok) {
                throw await res.text();
            } else {
                let data = await res.json();

                if (data['message']) {
                    return Promise.resolve(data['message']);
                }

                return Promise.reject(API_UNRECOGNIZED_RESPONSE);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

export async function loginUserCredentials(username: string, password: string): Promise<string> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;

    let url = `${BACKEND_ADDR}/jwt/login/credentials`;

    return await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password
        })
    })
        .then(async (res) => {
            if (!res.ok) {
                throw "Username and password combination are wrong.";
            } else {
                let data = await res.json();

                if (data['token']) {
                    setToken(data['token']);
                    return Promise.resolve("Success!");
                }

                return Promise.reject(API_UNRECOGNIZED_RESPONSE);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

export async function getUser() {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;

    let url = `${BACKEND_ADDR}/jwt/user`;

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
                let data = await res.json();

                if (data['user']) {
                    let _user: User = new User();

                    Object.assign(_user, data['user']);

                    useUser().value = _user;

                    if (useFcmDeviceToken().value) {
                        await registerFcmDeviceToken(useFcmDeviceToken().value);
                    }
                }
            }
        })
        .catch(handleCatch);
}

export async function verifyUser(verificationCode: string) {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;

    let url = `${BACKEND_ADDR}/verify/email/${verificationCode}`;

    return await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(async (res) => {
            if (!res.ok) {
                await handleResponseError(res);
            } else {
                return Promise.resolve();
            }
        })
}

export async function getUserSettings(): Promise<UserSettings> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;

    let url = `${BACKEND_ADDR}/jwt/user/settings`;

    return await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useToken().value}`
        }
    })
        .then(async (res) => {
            let data: { user_settings: UserSettings } = await res.json();

            return Promise.resolve(data.user_settings);
        })
        .catch((err) => {
            return Promise.reject(API_UNREACHABLE);
        });
}

export async function updateUserSettings(userSettings: UserSettings): Promise<UserSettings> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;

    let url = `${BACKEND_ADDR}/jwt/user/settings`;

    return await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useToken().value}`
        },
        body: JSON.stringify({
            user_settings: userSettings
        })
    })
        .then(async (res) => {
            if (!res.ok) {
                await handleResponseError(res);

                return Promise.reject();
            } else {
                let data: { user_settings: UserSettings } = await res.json();

                return Promise.resolve(data.user_settings);
            }
        })
}

export async function deleteUser(usernameOrEmail: string): Promise<string> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;

    let url = `${BACKEND_ADDR}/user/delete`;

    return await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username_or_email: usernameOrEmail
        })
    })
        .then(async (res) => {
            if (!res.ok) {
                throw await res.text();
            } else {
                let data = await res.json();

                if (data['message']) {
                    return Promise.resolve(data['message']);
                }

                return Promise.reject(API_UNRECOGNIZED_RESPONSE);
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}
