import axios from "axios";
import {IndexerApi} from "./types";


interface IndexerConfigPayload {
    ethereumNetwork: string;
    ethereumNetworkId: string;
    tezosNetwork: string;
    ethereumWrapContract: string;
    tezosMinterContract: string;
    tezosQuorumContract: string;
    wrapRequiredSignatures: number;
    unwrapRequiredSignatures: number;
    tokens: Array<{
        type: 'ERC20' | 'ERC721';
        ethereumSymbol: string;
        ethereumName: string;
        ethereumContractAddress: string;
        decimals: number;
        tezosWrappingContract: string;
        tezosTokenId: string | null;
        tezosSymbol: string;
        tezosName: string;
        thumbnailUri: string;
    }>;
    fees: {
        erc20WrappingFees: number;
        erc20UnwrappingFees: number;
        erc721WrappingFees: number;
        erc721UnwrappingFees: number;
    };
}

export const create = (url: string): IndexerApi => {

    const client = axios.create({
        baseURL: url
    });

    const configuration = client.get('/configuration');

    const fetchTokens = async () => {

        const config: IndexerConfigPayload = await configuration.then(({data}) => data);
        return config.tokens.filter(t => t.type === "ERC20").map(t => ({
            name: t.tezosName,
            decimals: t.decimals,
            contract: t.tezosWrappingContract,
            tokenId: t.tezosTokenId || '0'
        }));
    }

    const fetchContracts = async () => {
        const config: IndexerConfigPayload = await configuration.then(({data}) => data);
        return {minter: config.tezosMinterContract, quorum: config.tezosQuorumContract};
    }

    return {fetchTokens, fetchContracts};
}
