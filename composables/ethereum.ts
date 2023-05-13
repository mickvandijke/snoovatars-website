import {usePreferredCurrency} from "#build/imports";
import {abbreviateNumber} from "~/global/utils";
import {useConeEthPrice, useEthereumPriceMap} from "~/composables/states";

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

export function coneInLocalCurrency(eth: number): string {
    let localeString = ""
    const currency = usePreferredCurrency().value;

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

    let fullString = `${symbol}${price.toLocaleString(localeString, { minimumFractionDigits: 10 })}`;

    let zeroDecimalsString = '';

    let skipLength = symbol.length + 3

    for (let i = skipLength; i < fullString.length; i++) {
        const char = fullString.charAt(i);

        if (/[1-9]/.test(char)) { // Stop when the character is a number higher than 0
            break;
        } else {
            zeroDecimalsString += char;
        }
    }

    const smallCharacters = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉", "₁₀"];

    let shortenedString = fullString.slice(symbol.length + 3, fullString.length);

    if (zeroDecimalsString.length > 1 && zeroDecimalsString.length < 10) {
        shortenedString = shortenedString.replace(zeroDecimalsString, smallCharacters[zeroDecimalsString.length + 1]);
    }

    shortenedString = `${fullString.slice(0, symbol.length + 3)}${shortenedString}`;

    return shortenedString;
}

export function coneToEth(cone: number): number {
    return cone * useConeEthPrice().value;
}
