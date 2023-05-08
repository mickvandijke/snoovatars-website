export function abbreviateNumber(value: number): [number, string] {
    let newValue: number = value;
    let abb: string = "";

    if (value >= 1000000000) {
        newValue = (value / 1000000000);
        abb = 'B';
    } else if (value >= 1000000) {
        newValue = (value / 1000000);
        abb = 'M';
    } else if (value >= 1000) {
        newValue = (value / 1000);
        abb = 'K';
    } else {
        newValue = Math.round(value);
    }
    return [newValue, abb];
}

export function isValidEthereumAddress(address: string): boolean {
    return address.length === 42 && address.startsWith("0x");
}

export function dappLink(url: string) {
    url = url.replace("https://", "dapp://");

    return url;
}

