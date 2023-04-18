export type ContractAddress = string;
export type CollectionSlug = string;

export interface Collection {
    name: string;
    description: string;
    contract_address: string;
}

export interface ApiResponse {
    collections: Record<string, Collection>;
}
