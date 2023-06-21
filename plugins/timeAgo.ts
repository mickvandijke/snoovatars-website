import {defineNuxtPlugin} from "#app";

function timeAgo(date: Date): string {
    const now = Date.now();
    const diff = now - date.getTime();

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    if (diff < minute) {
        const secs = Math.round(diff / 1000);
        return `${secs}${secs === 1 ? 's' : 's'}`;
    } else if (diff < hour) {
        const mins = Math.round(diff / minute);
        return `${mins}${mins === 1 ? 'm' : 'm'}`;
    } else if (diff < day) {
        const hours = Math.round(diff / hour);
        return `${hours}${hours === 1 ? 'h' : 'h'}`;
    } else if (diff < year) {
        const days = Math.round(diff / day);
        return `${days}${days === 1 ? 'd' : 'd'}`;
    } else {
        const years = Math.round(diff / year);
        return `${years}${years === 1 ? 'y' : 'y'}`;
    }
}

export default defineNuxtPlugin(nuxtApp => {
    return {
        provide: {
            timeAgo
        }
    }
})
