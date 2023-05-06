export interface Currency {
    name: string;
    ticker: string;
}

export const CURRENCIES: Array<Currency> = [
    { name: "US Dollar", ticker: "USD" },
    { name: "Euro", ticker: "EUR" },
    { name: "British Pound", ticker: "GBP" }
]

