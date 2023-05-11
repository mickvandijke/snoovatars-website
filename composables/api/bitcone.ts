export async function fetchBitconePrice(): Promise<number> {
    const url = "https://api.geckoterminal.com/api/v2/networks/polygon_pos/tokens/0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c/pools";

    const response = await fetch(url);
    const data = await response.json();

    return data["data"][0]["attributes"]["base_token_price_native_currency"] ?? 0;
}
