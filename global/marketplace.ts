import {SeriesStats} from "~/types/seriesStats";
import {useSelectedMarketplace} from "~/composables/states";

export enum Marketplace {
  rcax,
  opensea
}

export function marketplaceLink(seriesStats: SeriesStats, noSearch: boolean): string {
  const marketplace = useSelectedMarketplace();

  let link: string;

  if (marketplace.value === Marketplace.rcax && false) {
    link = `https://marketplace.rcax.io/collection/${seriesStats.collection.contract_address}`;

    if (seriesStats.series.name === 'Gold Hodl') {
      link += '?attributes[Hat]=Gold+Hodl';
    } else if (!noSearch) {
      link += `?search=${seriesStats.series.name}`;
    }
  } else {
    link = `https://opensea.io/collection/${seriesStats.collection.slug}?searchQuery=${encodeURIComponent(seriesStats.series.name)}`
  }

  return link;
}
