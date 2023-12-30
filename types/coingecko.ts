export interface GeckoInfo {
  data: {
    id: string,
    attributes: {
      address: string,
      name: string,
      symbol: string,
      total_supply: BigInt,
      price_usd: number,
      fdv_usd: number,
      total_reserve_in_usd: number,
      volume_usd: {
        h24: number
      }
    }
  }
}
