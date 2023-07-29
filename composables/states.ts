import {useState} from "nuxt/app";
import {Collection} from "~/types/collection";
import {AvatarHash, AvatarList, RedditAvatar} from "~/types/reddit_avatar";
import {AccountTierAlertQuotas, Alert, AlertHash, AlertList} from "~/types/alert";
import {User, UserSettings} from "~/types/user";
import {calculate_hash, Series} from "~/types/series";
import {SeriesStats} from "~/types/seriesStats";
import {fetchSeriesStats} from "~/composables/api/seriesStats";
import {fetchCurrentEthereumPriceInCurrency} from "~/composables/api/ethereum";
import {fetchSeries} from "~/composables/api/series";
import {fetchBitconePrice} from "~/composables/api/bitcone";
import {getUserSettings, updateUserSettings} from "~/composables/api/user";
import {fetchMarketInfo} from "~/composables/api/info";
import {Capacitor} from "@capacitor/core";
import {Prompt, PromptOption} from "~/components/Prompt.vue";
import {Default, Settings} from "~/types/settings";
import {SelectedAvatar} from "~/types/SelectedAvatar";

export const useCollections = () => useState<Map<string, Collection>>('collection-list', () => new Map());
export const useSeriesHashed = () => useState<Map<string, Series>>('tier-list', () => new Map());
export const useSeriesStats = () => useState<Map<string, SeriesStats>>('series-stats', () => new Map());
export const useAvatarList = () => useState<AvatarList>('avatar-list', () => new Map<AvatarHash, RedditAvatar>());
export const useAlertQuotas = () => useState<AccountTierAlertQuotas>('alert-max-quotas', () => null);
export const useAlertList = () => useState<AlertList>('alert-list', () => new Map<AlertHash, Alert>());
export const useUser = () => useState<User>('user', () => null);
export const useToken = () => useState<string>('token', () => null);
export const useFcmDeviceToken = () => useState<string>('fcm-device-token', () => null);
export const useEthereumUsdPrice = () => useState<number>('ethereum-usd', () => 0);
export const useEthereumPriceMap = () => useState<Map<string, number>>('ethereum-price-map', () => new Map());
export const useTotalDailyVolume = () => useState<number>('total-daily-volume', () => 0);
export const useTotalMarketCap = () => useState<number>('total-market-cap', () => 0);
export const useConeEthPrice = () => useState<number>('cone-eth', () => 0);
export const useWatchList = () => useState<Set<string>>('watch-list', () => new Set());
export const useWalletAddresses = () => useState<Set<string>>('wallet-addresses', () => new Set());
export const useUserSettings = () => useState<UserSettings>('user-settings', () => null);
export const usePrompt = () => useState<Prompt>('prompt', () => null);
export const useSettings = () => useState<Settings>('settings', () => null);
export const useSelectedAvatar = () => useState<SelectedAvatar>('selected-avatar', () => null);

export function loadSettings() {
    let json = localStorage.getItem("settings");

    if (json) {
        useSettings().value = Object.assign({}, Default, JSON.parse(json));
    } else {
        useSettings().value = Default;
    }
}

export function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(useSettings().value));
}

export function promptOptions(title: string, options: PromptOption[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const prompter = usePrompt();

        prompter.value = {
            title,
            options
        };

        const checkResult = () => {
            if (prompter.value?.result) {
                const result = prompter.value.result;
                prompter.value = null;
                resolve(result);
            } else if (!prompter) {
                reject("exited");
            } else {
                setTimeout(checkResult, 100); // Check again after a delay
            }
        };

        checkResult();
    });
}

export async function openLinkWith(link: string) {
    if (Capacitor.getPlatform() === "ios") {
        return;
    }

    if (Capacitor.isNativePlatform() || window.matchMedia('(max-width: 640px)').matches) {
        if (useSettings().value.link.opener) {
            link = link.replace("https://", useSettings().value.link.opener);
        } else {
            let [linkOpener, savedAsDefault] = await promptOptions("Open link using:", [
                {
                    name: "Browser",
                    value: "https://"
                },
                {
                    name: "Wallet App",
                    value: "dapp://"
                }
            ]);

            if (savedAsDefault) {
                useSettings().value.link.opener = linkOpener;
            }

            link = link.replace("https://", linkOpener);
        }
    }

    window.open(link, '_blank');
}

export function openLink(link: string): string {
    if (Capacitor.getPlatform() === "ios") {
        return "";
    }

    if (Capacitor.isNativePlatform()) {
        link = link.replace("https://", "dapp://");
    }

    return link;
}

export async function updateMarketInfo() {
    fetchMarketInfo().then(([vol, mc]) => {
        useTotalDailyVolume().value = vol;
        useTotalMarketCap().value = mc;
    });

    updateConeEthPrice();
}

export async function loadUserSettings() {
    await getUserSettings().then((value) => {
        useUserSettings().value = value;
    });
}

export async function setUserSettings(userSettings: UserSettings) {
    await updateUserSettings(userSettings).then((value) => {
        useUserSettings().value = value;
    })
}

export function updateConeEthPrice() {
    fetchBitconePrice().then((price) => {
        useConeEthPrice().value = Number(price);
    });
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

export async function updateEthereumPrices() {
    fetchCurrentEthereumPriceInCurrency("USD").then((value) => {
        useEthereumUsdPrice().value = value;
    });

    let ticker = useSettings().value.currency.preferred;

    fetchCurrentEthereumPriceInCurrency("MATIC").then((value) => {
        useEthereumPriceMap().value.set("MATIC", value);
    });

    fetchCurrentEthereumPriceInCurrency(ticker).then((value) => {
        useEthereumPriceMap().value.set(ticker, value);
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
        const walletAddresses: string[] = JSON.parse(walletAddressesJson);

        if (walletAddresses) {
            let was: Set<string> = new Set<string>();

            walletAddresses.forEach((wa) => {
                was.add(wa.toLowerCase());
            });

            useWalletAddresses().value = was;
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
