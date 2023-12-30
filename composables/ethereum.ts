import {abbreviateNumber} from "~/global/utils";
import {useConeEthPrice, useEthereumPriceMap, useSettings} from "~/composables/states";

export function ethereumInLocalCurrency(eth: number, abbreviate: boolean): string {
    let abb = "";
    let localeString = ""
    const currency = useSettings().value.currency.preferred;

    eth = eth / 1000000000000000000

    let price = eth * (useEthereumPriceMap().value.get(currency) ?? 0);

    if (isNaN(price)) {
        price = 0;
    }

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

    const currencyFormatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
    });

    let symbol = currencyFormatter.formatToParts(0)[0].value;

    if (symbol.startsWith("US")) {
        symbol = symbol.slice(2, symbol.length);
    }

    if (abbreviate) {
        [price, abb] = abbreviateNumber(price);
    } else if (price >= 100) {
        price = Math.round(price);
    } else {
         price = +price.toFixed(2);
    }

    let priceString = price.toLocaleString(localeString);

    if (priceString.includes('.') && priceString.split('.')[1].length === 1 || priceString.includes(',') && priceString.split(',')[1].length === 1) {
        priceString += '0';
    }

    return `${symbol}${priceString}${abb}`;
}

export function gweiInLocalCurrency(eth: number): string {
    let localeString = ""
    const currency = useSettings().value.currency.preferred;

    let price = Number((eth * (useEthereumPriceMap().value.get(currency) ?? 0)).toPrecision(5));

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

    const currencyFormatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
    });

    let symbol = currencyFormatter.formatToParts(0)[0].value;

    if (symbol.startsWith("US")) {
        symbol = symbol.slice(2, symbol.length);
    }

    let fullString = `${symbol}${price.toLocaleString(localeString, { maximumFractionDigits: 9 })}`;

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
