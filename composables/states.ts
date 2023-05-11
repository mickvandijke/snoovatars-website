import {useState} from "nuxt/app";
import {Collection} from "~/types/collection";
import {AvatarHash, AvatarList, RedditAvatar} from "~/types/reddit_avatar";
import {AccountTierAlertQuotas, Alert, AlertHash, AlertList} from "~/types/alert";
import {User} from "~/types/user";
import {calculate_hash, Series} from "~/types/series";
import {SeriesStats} from "~/types/seriesStats";
import {fetchSeriesStats} from "~/composables/api/seriesStats";
import {fetchCurrentEthereumPriceInCurrency} from "~/composables/api/ethereum";
import {fetchSeries} from "~/composables/api/series";
import {ExtraInfoOptions} from "~/types/extra_info";
import {CURRENCIES} from "~/types/currency";

export const useCollections = () => useState<Map<string, Collection>>('collection-list', () => new Map());
export const useSeries = () => useState<Map<string, Series>>('series-list', () => new Map());
export const useSeriesHashed = () => useState<Map<string, Series>>('tier-list', () => new Map());
export const useSeriesStats = () => useState<Map<string, SeriesStats>>('series-stats', () => new Map());
export const useAvatarList = () => useState<AvatarList>('avatar-list', () => new Map<AvatarHash, RedditAvatar>());
export const useAlertQuotas = () => useState<AccountTierAlertQuotas>('alert-max-quotas', () => null);
export const useAlertList = () => useState<AlertList>('alert-list', () => new Map<AlertHash, Alert>());
export const useUser = () => useState<User>('user', () => null);
export const useToken = () => useState<string>('token', () => null);
export const useEthereumUsdPrice = () => useState<number>('ethereum-usd', () => 0);
export const useEthereumPriceMap = () => useState<Map<string, number>>('ethereum-price-map', () => new Map());
export const usePreferredCurrency = () => useState<string>('preferred-currency', () => "USD");
export const useWatchList = () => useState<Set<string>>('watch-list', () => new Set());
export const useWalletAddresses = () => useState<Set<string>>('wallet-addresses', () => new Set());
export const useExtraInfoOptions = () => useState<ExtraInfoOptions>('extra-info-options', () => null);

export function updateExtraInfoOptions(options: ExtraInfoOptions) {
    useExtraInfoOptions().value = options;

    localStorage.setItem("extraInfoOptions", JSON.stringify(options));
}

export function loadExtraInfoOptions() {
    let json = localStorage.getItem("extraInfoOptions");

    if (json) {
        let options: ExtraInfoOptions = JSON.parse(json);

        if (options) {
            useExtraInfoOptions().value = options;
            return;
        }
    }

    useExtraInfoOptions().value = {
        marketData: true,
        listings: true,
        salesGraph: true,
        sales: true
    };
}

export async function updateSeriesHashed() {
    const seriesMap: Map<string, Series> = new Map();
    const promises: Promise<void>[] = [];

    const series = await fetchSeries();

    series.forEach(serie => {
        promises.push((async () => {
            const hash = await calculate_hash(serie);
            seriesMap.set(hash, serie);
        })());
    });

    await Promise.all(promises);
    useSeriesHashed().value = seriesMap;
}

export function setPreferredCurrency(currency: string) {
    usePreferredCurrency().value = currency;

    localStorage.setItem("preferredCurrency", currency);
}

export function loadPreferredCurrency() {
    let json = localStorage.getItem("preferredCurrency");

    if (json) {
        usePreferredCurrency().value = json;
    }
}

export async function updateEthereumPrices() {
    fetchCurrentEthereumPriceInCurrency("USD").then((value) => {
        useEthereumUsdPrice().value = value;
    });

    CURRENCIES.forEach((currency) => {
        fetchCurrentEthereumPriceInCurrency(currency.ticker).then((value) => {
            useEthereumPriceMap().value.set(currency.ticker, value);
        });
    });
}

export async function updateSeriesStats() {
    fetchSeriesStats().then((seriesStats) => {
        useSeriesStats().value = seriesStats;
    })
}

export function loadWatchList() {
    const defaultWatchList: Set<string> = new Set(['The Hands', 'Gummy', 'Snooze Paralysis', 'Julia Jewels']);

    const watchListJson = localStorage.getItem("watchList");

    if (watchListJson) {
        const watchList = JSON.parse(watchListJson);

        if (watchList) {
            useWatchList().value = new Set<string>(watchList);
            return;
        }
    }

    useWatchList().value = defaultWatchList;
}

export function saveWatchList() {
    localStorage.setItem("watchList", JSON.stringify(Array.from(useWatchList().value)));
}

export function addToWatchList(name: string) {
    useWatchList().value.add(name);

    saveWatchList();
}

export function removeFromWatchList(name: string) {
    useWatchList().value.delete(name);

    saveWatchList();
}

export function loadWalletAddresses() {
    const walletAddressesJson = localStorage.getItem("walletAddresses");

    if (walletAddressesJson) {
        const walletAddresses = JSON.parse(walletAddressesJson);

        if (walletAddresses) {
            useWalletAddresses().value = new Set<string>(walletAddresses);
            return;
        }
    }

    useWalletAddresses().value = new Set();
}

export function saveWalletAddresses() {
    localStorage.setItem("walletAddresses", JSON.stringify(Array.from(useWalletAddresses().value)));
}

export function addToWalletAddresses(walletAddress: string) {
    useWalletAddresses().value.add(walletAddress);

    saveWalletAddresses();
}

export function removeFromWalletAddresses(walletAddress: string) {
    useWalletAddresses().value.delete(walletAddress);

    saveWalletAddresses();
}
