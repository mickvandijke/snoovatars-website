import {useEthereumEurPrice, useEthereumGbpPrice, useEthereumUsdPrice, usePreferredCurrency} from "#build/imports";
import {abbreviateNumber} from "~/global/utils";

export function ethereumInLocalCurrency(eth: number, abbreviate: boolean): string {
    let price = 0;
    let symbol = "";
    let abb = "";
    let localeString = ""

    eth = eth / 1000000000000000000;

    switch (usePreferredCurrency().value) {
        case "USD":
            price = eth * useEthereumUsdPrice().value;
            symbol = "$";
            localeString = "en-US";
            break;
        case "EUR":
            price = eth * useEthereumEurPrice().value;
            symbol = "€";
            localeString = "nl-NL";
            break;
        case "GBP":
            price = eth * useEthereumGbpPrice().value;
            symbol = "£";
            localeString = "en-GB";
            break;
    }

    if (abbreviate) {
        [price, abb] = abbreviateNumber(price);
    } else {
        price = Math.round(price);
    }

    return `${symbol}${price.toLocaleString(localeString)}${abb}`;
}
