import {useRcaxEthPrice} from "~/composables/states";

export async function fetchRcaxPrice(): Promise<number> {
    const url = "https://api.geckoterminal.com/api/v2/networks/polygon_pos/tokens/0xc99bd85ba824de949cf088375225e3fdcdb6696c/pools";

    const response = await fetch(url);
    const data = await response.json();

    let price = 0;

    for (const pool of data["data"]) {
        if (pool["id"] === "polygon_pos_0xf56d604f32dec33a9f2c1573d7741ab9ba517164") {
            price = pool["attributes"]["base_token_price_native_currency"] ?? 0
        }
    }

    return price;
}

export function rcaxToEth(cone: number): number {
    return cone * useRcaxEthPrice().value;
}
