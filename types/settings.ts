export interface Settings {
    currency: {
        preferred: string;
    },
    extraInfoOptions: {
        marketData: boolean;
        listings: boolean;
        salesGraph: boolean;
        sales: boolean;
    },
    cookies: {
        accepted: boolean;
    },
    wallet: {
        valuationMethod: string;
        filterOption: string;
        groupMethod: string;
    },
    activity: {
        filterGenOption: string;
        feedView: string;
    },
    exporter: {
        avatar: {
            lastUsername?: string;
        }
    }
}

export const Default: Settings = {
    wallet: {
        filterOption: "floor",
        groupMethod: "all",
        valuationMethod: "group"
    },
    cookies: {
        accepted: false
    },
    extraInfoOptions: {
        listings: true,
        marketData: true,
        sales: true,
        salesGraph: true
    },
    currency: {
        preferred: "USD"
    },
    activity: {
        filterGenOption: "all",
        feedView: "sales"
    },
    exporter: {
        avatar: {
            lastUsername: undefined
        }
    }
}
