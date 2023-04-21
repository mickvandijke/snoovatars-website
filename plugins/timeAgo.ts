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
        return 'just now';
    } else if (diff < hour) {
        const mins = Math.round(diff / minute);
        return `${mins} ${mins === 1 ? 'minute' : 'mins'} ago`;
    } else if (diff < day) {
        const hours = Math.round(diff / hour);
        return `${hours} ${hours === 1 ? 'hour' : 'hrs'} ago`;
    } else if (diff < week) {
        const days = Math.round(diff / day);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (diff < month) {
        const weeks = Math.round(diff / week);
        return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diff < year) {
        const months = Math.round(diff / month);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
        const years = Math.round(diff / year);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
}

export default defineNuxtPlugin(nuxtApp => {
    return {
        provide: {
            timeAgo
        }
    }
})
