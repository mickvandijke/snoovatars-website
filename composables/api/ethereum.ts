export async function fetchCurrentEthereumPriceInCurrency(currency: string): Promise<number> {
    const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${currency}`);
    const data = await response.json();

    return data[`${currency}`];
}
