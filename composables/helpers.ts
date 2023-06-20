import {SeriesStats} from "~/types/seriesStats";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {useEthereumPriceMap} from "#imports";

export function getLowestListing(stats: SeriesStats) {
    let maticToEthModifier = 1 / (useEthereumPriceMap().value.get("MATIC") ?? 0)

    let eth = stats.stats.eth.lowest_listing?.payment_token.base_price / ETH_TO_GWEI_MODIFIER ?? 0;
    let matic = stats.stats.matic.lowest_listing?.payment_token.base_price / ETH_TO_GWEI_MODIFIER * maticToEthModifier;

    if (eth > matic) {
        return stats.stats.matic.lowest_listing;
    } else if (eth < matic) {
        return stats.stats.eth.lowest_listing;
    } else {
        return stats.stats.eth.lowest_listing;
    }
}

export function getLowestListingAsGweiPrice(stats: SeriesStats) {
    const lowestListing = getLowestListing(stats);

    let price = 0;

    if (!lowestListing) {
        price = 0;
    } else if (lowestListing.payment_token.symbol === "ETH") {
        price = lowestListing.payment_token.base_price;
    } else if (lowestListing.payment_token.symbol === "MATIC") {
        price = lowestListing.payment_token.base_price / (useEthereumPriceMap().value.get("MATIC") ?? 0);
    }

    return price;
}

export function getLastSale(stats: SeriesStats) {
    let eth = new Date(stats.stats.eth.last_sale?.date_sold ?? 0);
    let matic = new Date(stats.stats.matic.last_sale?.date_sold ?? 0);

    if (eth > matic) {
        return stats.stats.eth.last_sale;
    } else if (eth < matic) {
        return stats.stats.matic.last_sale;
    } else {
        return stats.stats.eth.last_sale;
    }
}

export function getLastSaleAsGweiPrice(stats: SeriesStats) {
    const lastSale = getLastSale(stats);

    let price = 0;

    if (!lastSale) {
        price = 0;
    } else if (lastSale.payment_token.symbol === "ETH") {
        price = lastSale.payment_token.base_price;
    } else if (lastSale.payment_token.symbol === "MATIC") {
        price = lastSale.payment_token.base_price / (useEthereumPriceMap().value.get("MATIC") ?? 0);
    }

    return price;
}

export function maticToEth(matic: number) {
    return matic / (useEthereumPriceMap().value.get("MATIC") ?? 0);
}
