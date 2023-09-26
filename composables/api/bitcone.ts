export async function fetchBitconePrice(): Promise<number> {
    const url = "https://api.geckoterminal.com/api/v2/networks/polygon_pos/tokens/0xbA777aE3a3C91fCD83EF85bfe65410592Bdd0f7c/pools";

    const response = await fetch(url);
    const data = await response.json();

    let price = 0;

    for (const pool of data["data"]) {
        if (pool["id"] === "polygon_pos_0xc3266f3ce2433e0fb83d3ae8be49a155f6230a6f") {
            price = pool["attributes"]["base_token_price_native_currency"] ?? 0
        }
    }

    return price;
}
