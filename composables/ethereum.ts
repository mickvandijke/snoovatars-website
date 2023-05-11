import {usePreferredCurrency} from "#build/imports";
import {abbreviateNumber} from "~/global/utils";
import {useEthereumPriceMap} from "~/composables/states";

export function ethereumInLocalCurrency(eth: number, abbreviate: boolean): string {
    let abb = "";
    let localeString = ""
    const currency = usePreferredCurrency().value;

    eth = eth / 1000000000000000000

    let price = eth * (useEthereumPriceMap().value.get(currency) ?? 0);

    switch (currency) {
        case "AUD":
        case "CNY":
        case "INR":
        case "CAD":
        case "USD":
            localeString = "en-US";
            break;
        default:
            localeString = "nl-NL";
            break;
    }

    const currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    });

    let symbol = currencyFormatter.formatToParts(0)[0].value;

    if (abbreviate) {
        [price, abb] = abbreviateNumber(price);
    } else {
        price = Math.round(price);
    }

    return `${symbol}${price.toLocaleString(localeString)}${abb}`;
}
