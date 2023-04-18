import {useState} from "nuxt/app";
import {Collections} from "~/types/collection";
import {AvatarHash, AvatarList, RedditAvatar} from "~/types/reddit_avatar";
import {AccountTierAlertQuotas, Alert, AlertHash, AlertList} from "~/types/alert";
import {User} from "~/types/user";
import {Series} from "~/types/series";

export const useCollections = () => useState<Collections>('collection-list', () => ({}));
export const useSeries = () => useState<Map<string, Series>>('tier-list', () => new Map());
export const useAvatarList = () => useState<AvatarList>('avatar-list', () => new Map<AvatarHash, RedditAvatar>());
export const useAlertQuotas = () => useState<AccountTierAlertQuotas>('alert-max-quotas', () => null);
export const useAlertList = () => useState<AlertList>('alert-list', () => new Map<AlertHash, Alert>());
export const useUser = () => useState<User>('user', () => null);
export const useToken = () => useState<string>('token', () => null);
