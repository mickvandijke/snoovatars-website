export interface Currency {
    name: string;
    ticker: string;
}

export const CURRENCIES: Array<Currency> = [
    { name: "US Dollar", ticker: "USD" },
    { name: "Euro", ticker: "EUR" },
    { name: "British Pound", ticker: "GBP" },
    { name: "Canadian Dollar", ticker: "CAD" },
    { name: "Japanese Yen", ticker: "JPY" },
    { name: "Australian Dollar", ticker: "AUD" },
    { name: "Chinese Yuan", ticker: "CNY" },
    { name: "Indian Rupee", ticker: "INR" },
    { name: "Brazilian Real", ticker: "BRL" },
    { name: "Indonesian Rupiah", ticker: "IDR" },
    { name: "Mexican Peso", ticker: "MXN" },
    { name: "Turkish Lira", ticker: "TRY" },
    { name: "Saudi Arabian Riyal", ticker: "SAR" },
    { name: "Malaysian Ringgit", ticker: "MYR" },
    { name: "Philippine Peso", ticker: "PHP" },
    { name: "South Korean Won", ticker: "KRW" },
    { name: "Swedish Krona", ticker: "SEK" },
    { name: "Norwegian Krone", ticker: "NOK" }
];
