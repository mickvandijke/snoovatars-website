import {SeriesStats} from "~/types/seriesStats";
import {useSelectedMarketplace} from "~/composables/states";

export enum Marketplace {
  rcax,
  opensea
}

export function marketplaceLink(seriesStats: SeriesStats): string {
  const marketplace = useSelectedMarketplace();

  let link: string;

  if (marketplace.value === Marketplace.rcax) {
    link = `https://marketplace.rcax.io/collection/${seriesStats.collection.contract_address}?search=${seriesStats.series.name}`;

    if (seriesStats.series.name === 'Gold Hodl') {
      link += '&attributes[Hat]=Gold+Hodl';
    }
  } else {
    link = `https://opensea.io/collection/${seriesStats.collection.slug}?search[query]=${seriesStats.series.name}`
  }

  return link;
}
