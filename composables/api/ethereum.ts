export async function fetchCurrentEthereumPriceInUSD(): Promise<number> {
    const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
    const data = await response.json();

    return data.USD;
}

export async function fetchCurrentEthereumPriceInCurrency(): Promise<number> {
    const response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
    const data = await response.json();

    return data.USD;
}
