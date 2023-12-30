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

export function getTokenImage(url: string): string {
    if (url === "https://i.seadn.io/gae/nrOMmeEyGTOEqGrTu9oXLC1iHo6pdY4gaIW4NxpmTEk4Z6weZf3-PIGLRCUv5cybrw6qDCNbRUNay_cY84O6jucgxiqTEhuZlz6T8?auto=format&w=1920") {
        url = "ipfs://QmUmDVhqUUZN3JzC2v1pCk8HNXtffwUBogFThZ4kv5VrKy";
    }

    if (url.startsWith("ipfs://")) {
        url = url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    return url;
}

export function nowInSeconds(): number {
    return Math.floor(Date.now() / 1000);
}

export async function clipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        alert('Copied');
    } catch($e) {
        alert('Cannot copy');
    }
}
