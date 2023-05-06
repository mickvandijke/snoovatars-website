import {useState} from "nuxt/app";
import {Collection} from "~/types/collection";
import {AvatarHash, AvatarList, RedditAvatar} from "~/types/reddit_avatar";
import {AccountTierAlertQuotas, Alert, AlertHash, AlertList} from "~/types/alert";
import {User} from "~/types/user";
import {Series} from "~/types/series";
import {SeriesStats} from "~/types/seriesStats";
import {fetchSeriesStats} from "~/composables/api/seriesStats";
import {fetchCurrentEthereumPriceInCurrency, fetchCurrentEthereumPriceInUSD} from "~/composables/api/ethereum";

export const useCollections = () => useState<Map<string, Collection>>('collection-list', () => new Map());
export const useSeries = () => useState<Map<string, Series>>('tier-list', () => new Map());
export const useSeriesStats = () => useState<Map<string, SeriesStats>>('series-stats', () => new Map());
export const useAvatarList = () => useState<AvatarList>('avatar-list', () => new Map<AvatarHash, RedditAvatar>());
export const useAlertQuotas = () => useState<AccountTierAlertQuotas>('alert-max-quotas', () => null);
export const useAlertList = () => useState<AlertList>('alert-list', () => new Map<AlertHash, Alert>());
export const useUser = () => useState<User>('user', () => null);
export const useToken = () => useState<string>('token', () => null);
export const useEthereumUsdPrice = () => useState<number>('ethereum-usd', () => 0);
export const useEthereumEurPrice = () => useState<number>('ethereum-eur', () => 0);
export const useEthereumGbpPrice = () => useState<number>('ethereum-gbp', () => 0);
export const usePreferredCurrency = () => useState<string>('preferred-currency', () => "USD");
export const useWatchList = () => useState<Set<string>>('watch-list', () => new Set());
export const useWalletAddresses = () => useState<Set<string>>('wallet-addresses', () => new Set());

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

    fetchCurrentEthereumPriceInCurrency("EUR").then((value) => {
        useEthereumEurPrice().value = value;
    });

    fetchCurrentEthereumPriceInCurrency("GBP").then((value) => {
        useEthereumGbpPrice().value = value;
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
