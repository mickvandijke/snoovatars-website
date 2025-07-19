import {SeriesStats} from "~/types/seriesStats";
import {ETH_TO_GWEI_MODIFIER} from "~/types/ethereum";
import {useEthereumPriceMap} from "#imports";
import {Sale} from "~/types/sale";
import {Listing} from "~/types/listing";
import {normalizeTokenSymbol} from "~/global/utils";

export function getLowestListing(stats: SeriesStats) {
    let maticToEthModifier = 1 / (useEthereumPriceMap().value.get("MATIC") ?? 0)

    let eth = stats.stats.eth.lowest_listing?.payment_token.base_price / ETH_TO_GWEI_MODIFIER;
    let matic = stats.stats.matic.lowest_listing?.payment_token.base_price / ETH_TO_GWEI_MODIFIER * maticToEthModifier;

    if (!eth && !!matic) {
        return stats.stats.matic.lowest_listing;
    } else if (!matic && !!eth) {
        return stats.stats.eth.lowest_listing;
    }

    if (eth > matic) {
        return stats.stats.matic.lowest_listing;
    } else if (eth < matic) {
        return stats.stats.eth.lowest_listing;
    } else {
        return stats.stats.eth.lowest_listing;
    }
}

export function getListingAsGweiPrice(listing: Listing) {
    let price = 0;

    if (!listing) {
        price = 0;
    } else if (normalizeTokenSymbol(listing.payment_token.symbol) === "ETH") {
        price = listing.payment_token.base_price;
    } else if (normalizeTokenSymbol(listing.payment_token.symbol) === "MATIC") {
        price = listing.payment_token.base_price / (useEthereumPriceMap().value.get("MATIC") ?? 0);
    }

    return price;
}

export function getLowestListingAsGweiPrice(stats: SeriesStats) {
    const lowestListing = getLowestListing(stats);

    let price = 0;

    if (!lowestListing) {
        price = 0;
    } else if (normalizeTokenSymbol(lowestListing.payment_token.symbol) === "ETH") {
        price = lowestListing.payment_token.base_price;
    } else if (normalizeTokenSymbol(lowestListing.payment_token.symbol) === "MATIC") {
        price = lowestListing.payment_token.base_price / (useEthereumPriceMap().value.get("MATIC") ?? 0);
    }

    return price;
}

export function getSaleAsGweiPrice(sale: Sale) {
    let price = 0;

    if (!sale) {
        price = 0;
    } else if (normalizeTokenSymbol(sale.payment_token.symbol) === "ETH") {
        price = sale.payment_token.base_price;
    } else if (normalizeTokenSymbol(sale.payment_token.symbol) === "MATIC") {
        price = sale.payment_token.base_price / (useEthereumPriceMap().value.get("MATIC") ?? 0);
    }

    return price;
}

export function maticToEth(matic: number) {
    return matic / (useEthereumPriceMap().value.get("MATIC") ?? 0);
}
