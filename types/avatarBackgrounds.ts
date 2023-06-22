import avatarBackgroundsJson from '~/assets/data/avatar-backgrounds.json';
import {useSeriesHashed} from "#imports";

export class AvatarBackground {
    name: string
    path: string
    contractAddress: string

    constructor(name: string, path: string, contractAddress: string) {
        this.name = name;
        this.path = path;
        this.contractAddress = contractAddress;
    }
}
