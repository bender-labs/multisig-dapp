export interface Token {
    name: string;
    contract: string;
    tokenId: string;
    decimals: number;
}

export interface Contracts {
    minter: string;
    quorum: string;
}

export interface IndexerApi {
    fetchTokens: () => Promise<Token[]>
    fetchContracts: () => Promise<Contracts>
}
