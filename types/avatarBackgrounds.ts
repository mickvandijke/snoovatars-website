import avatarBackgroundsJson from '~/assets/data/avatar-backgrounds.json';
import {useSeries} from "#imports";

export class AvatarBackground {
    name: string
    path: string

    constructor(name: string, path: string) {
        this.name = name;
        this.path = path;
    }
}
