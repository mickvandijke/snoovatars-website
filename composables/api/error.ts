import {deleteToken} from "~/composables/api/user";
import {API_UNREACHABLE} from "~/global/constants";

export async function handleResponseError(res: Response) {
    // If unauthorized, delete invalid or expired token.
    if (res.status === 401) {
        deleteToken();
    }

    throw await res.text();
}

export function handleCatch(_e) {
    throw API_UNREACHABLE;
}
