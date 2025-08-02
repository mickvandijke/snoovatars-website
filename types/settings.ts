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
    },
    link: {
        opener?: string;
    },
    stats: {
        layout: string;
    },
    shop: {
        showAvailable: boolean;
    }
}

export const Default: Settings = {
    wallet: {
        filterOption: "all",
        groupMethod: "mint",
        valuationMethod: "floor"
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
    },
    link: {
        opener: undefined
    },
    stats: {
        layout: "grid"
    },
    shop: {
        showAvailable: true
    },
}
