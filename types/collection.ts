export type ContractAddress = string;
export type CollectionSlug = string;

export interface Collection {
    name: string;
    description: string;
    contract_address: string;
    artist: {
        id: string;
        displayName: string;
    }
}

export interface ApiResponse {
    collections: Map<string, Collection>;
}
