export async function fetchRcaxPrice(): Promise<number> {
    const url = "https://api.geckoterminal.com/api/v2/networks/polygon_pos/tokens/0xc99bd85ba824de949cf088375225e3fdcdb6696c/pools";

    const response = await fetch(url);
    const data = await response.json();

    return data["data"][0]["attributes"]["base_token_price_native_currency"] ?? 0;
}
