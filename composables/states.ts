import {useState} from "nuxt/app";
import {Collection} from "~/types/collection";
import {AvatarHash, AvatarList, RedditAvatar} from "~/types/reddit_avatar";
import {AccountTierAlertQuotas, Alert, AlertHash, AlertList} from "~/types/alert";
import {User} from "~/types/user";
import {Series} from "~/types/series";
import {SeriesStats} from "~/types/seriesStats";
import {fetchSeriesStats} from "~/composables/api/seriesStats";
import {fetchCurrentEthereumPriceInUSD} from "~/composables/api/ethereum";

export const useCollections = () => useState<Map<string, Collection>>('collection-list', () => new Map());
export const useSeries = () => useState<Map<string, Series>>('tier-list', () => new Map());
export const useSeriesStats = () => useState<Map<string, SeriesStats>>('series-stats', () => new Map());
export const useAvatarList = () => useState<AvatarList>('avatar-list', () => new Map<AvatarHash, RedditAvatar>());
export const useAlertQuotas = () => useState<AccountTierAlertQuotas>('alert-max-quotas', () => null);
export const useAlertList = () => useState<AlertList>('alert-list', () => new Map<AlertHash, Alert>());
export const useUser = () => useState<User>('user', () => null);
export const useToken = () => useState<string>('token', () => null);
export const useEthereumUsdPrice = () => useState<number>('ethereum-usd', () => 0);
export const useWatchList = () => useState<Set<string>>('watch-list', () => new Set());

export async function updateSeriesStats() {
    fetchSeriesStats().then((seriesStats) => {
        useSeriesStats().value = seriesStats;
    })
}

export async function updateEthereumUsdPrice() {
    fetchCurrentEthereumPriceInUSD().then((usd) => {
        useEthereumUsdPrice().value = usd;
    })
}

export function loadWatchList() {
    const defaultWatchList: Set<string> = new Set(['The Hands', 'Gummy', 'Snooze Paralysis', 'Julia Jewels']);

    const watchListJson = localStorage.getItem("watchList");

    if (watchListJson) {
        console.log(watchListJson);

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
