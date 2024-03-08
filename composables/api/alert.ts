import {useRuntimeConfig} from "#app";
import {collection_list_from_object, CollectionList} from "~/types/reddit_collection";
import {set_collection_list, useAlertList, useAlertQuotas, useToken} from "~/composables/states";
import {API_UNREACHABLE, API_UNRECOGNIZED_RESPONSE} from "~/global/constants";
import {
    AccountTierAlertQuotas,
    Alert,
    alert_list_from_object, AlertHash,
    AlertList,
    AlertMaxQuota,
    AlertQuota
} from "~/types/alert";
import {handleCatch, handleResponseError} from "~/composables/api/error";

export async function createAlert(alert: Alert, old_alert_hash?: string) {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;

    let url = `${BACKEND_ADDR}/jwt/alert/create`;

    return await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useToken().value}`
        },
        body: JSON.stringify({
            alert: alert.toJson(),
            replacing_alert_hash: old_alert_hash
        }),
    })
        .then(async (res) => {
            if (!res.ok) {
                await handleResponseError(res);
            } else {
                let data = await res.json();

                if (data['alerts']) {
                    useAlertList().value = alert_list_from_object(data['alerts']);
                }
            }
        })
}

export class GetAlertsResponse {
    public alerts?: AlertList;
    public alertQuota?: AlertQuota;
    public alertMaxQuota?: AlertMaxQuota;
}

export async function getAlerts(): Promise<GetAlertsResponse> {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;

    let url = `${BACKEND_ADDR}/jwt/alerts`;

    return await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useToken().value}`
        },
    })
        .then(async (res) => {
            if (!res.ok) {
                await handleResponseError(res);
            } else {
                let data = await res.json();

                let alerts: AlertList = new Map<AlertHash, Alert>();
                let alertQuota: AlertQuota = null;
                let alertMaxQuota: AlertMaxQuota = null;

                if (data['alerts']) {
                    useAlertList().value = alert_list_from_object(data['alerts']);
                    alerts = useAlertList().value;
                }

                if (data['quota']) {
                    let _quota: AlertQuota = new AlertQuota();

                    Object.assign(_quota, data['quota']);

                    alertQuota = _quota;
                }

                if (data['max_quota']) {
                    let _max_quota: AlertMaxQuota = new AlertMaxQuota();

                    Object.assign(_max_quota, data['max_quota']);

                    alertMaxQuota = _max_quota;
                }

                let response: GetAlertsResponse = new GetAlertsResponse();

                Object.assign(response, {alerts, alertQuota, alertMaxQuota});

                return Promise.resolve(response);
            }

            return Promise.reject();
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

export async function getAlertQuotas() {
    const config = useRuntimeConfig();
    const BACKEND_ADDR = config.public.apiBaseUrl;

    let url = `${BACKEND_ADDR}/alert/quotas`;

    return await fetch(url)
        .then(async (data) => {
            data = await data.json();

            if (data['tier_0'] && data['tier_1']) {
                let max_alert_quotas: AccountTierAlertQuotas = new AccountTierAlertQuotas();

                Object.assign(max_alert_quotas, data);

                useAlertQuotas().value = max_alert_quotas;

                return Promise.resolve(max_alert_quotas);
            }

            return Promise.reject(API_UNRECOGNIZED_RESPONSE);
        })
        .catch((err) => {
            return Promise.reject(API_UNREACHABLE);
        });
}
