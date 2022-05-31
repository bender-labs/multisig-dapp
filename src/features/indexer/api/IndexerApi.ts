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

    let configPromise = client.get('/configuration').then(({data}) => data);

    const fetchTokens = async () => {
        const config: IndexerConfigPayload = await configPromise;
        return config.tokens.concat([
            {
              'type': 'ERC20',
              'ethereumSymbol': "USDT",
              "ethereumName": "Tether USD",
              "ethereumContractAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7",
              "decimals": 6,
              "tezosWrappingContract": "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
              "tezosTokenId": '18',
              "tezosSymbol": "wUSDT",
              "tezosName": "Wrapped USDT",
              "thumbnailUri": "ipfs://QmVbiHa37pe2U9FfXBYfvrLNpb38rbXwaN19HwZD2speFA"
            },
            {
              "type": 'ERC20',
              "ethereumSymbol": "USDC",
              "ethereumName": "USD Coin",
              "ethereumContractAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
              "decimals": 6,
              "tezosWrappingContract": "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
              "tezosTokenId": '17',
              "tezosSymbol": "wUSDC",
              "tezosName": "Wrapped USDC",
              "thumbnailUri": "ipfs://QmQfHU9mYLRDU4yh2ihm3zrvVFxDrLPiXNYtMovUQE2S2t"
            },
            {
              "type": 'ERC20',
              "ethereumSymbol": "BUSD",
              "ethereumName": "Binance USD",
              "ethereumContractAddress": "0x4fabb145d64652a948d72533023f6e7a623c7c53",
              "decimals": 18,
              "tezosWrappingContract": "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
              "tezosTokenId": '1',
              "tezosSymbol": "wBUSD",
              "tezosName": "Wrapped BUSD",
              "thumbnailUri": "ipfs://QmRB63vb8ThpmxHKF4An3XD8unHyCUuLYm5bZNhXwU4gAZ"
            },
            {
              "type": 'ERC20',
              "ethereumSymbol": "WBTC",
              "ethereumName": "Wrapped BTC",
              "ethereumContractAddress": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
              "decimals": 8,
              "tezosWrappingContract": "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
              "tezosTokenId": '19',
              "tezosSymbol": "wWBTC",
              "tezosName": "Wrapped WBTC",
              "thumbnailUri": "ipfs://Qmdj6n9T48LDWex8NkBMKUQJfZgardxZVdtRRibYQVzLCJ"
            },
            {
              "type": 'ERC20',
              "ethereumSymbol": "WETH",
              "ethereumName": "Wrapped Ether",
              "ethereumContractAddress": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
              "decimals": 18,
              "tezosWrappingContract": "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
              "tezosTokenId": '20',
              "tezosSymbol": "wWETH",
              "tezosName": "Wrapped WETH",
              "thumbnailUri": "ipfs://Qmezz1ztvo5JFshHupBEdUzVppyMfJH6K4kPjQRSZp8cLq"
            },
            {
              "type": 'ERC20',
              "ethereumSymbol": "MATIC",
              "ethereumName": "Matic Token",
              "ethereumContractAddress": "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
              "decimals": 18,
              "tezosWrappingContract": "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
              "tezosTokenId": '11',
              "tezosSymbol": "wMATIC",
              "tezosName": "Wrapped MATIC",
              "thumbnailUri": "ipfs://QmchBnjRjpweznHes7bVKHwgzd8D6Q7Yzwf6KmA4KS6Dgi"
            },
            {
              "type": 'ERC20',
              "ethereumSymbol": "DAI",
              "ethereumName": "Dai Stablecoin",
              "ethereumContractAddress": "0x6b175474e89094c44da98b954eedeac495271d0f",
              "decimals": 18,
              "tezosWrappingContract": "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
              "tezosTokenId": '5',
              "tezosSymbol": "wDAI",
              "tezosName": "Wrapped DAI",
              "thumbnailUri": "ipfs://QmVov6RtfRNzuQGvGKmhnABUsfCiDKvn31amg8DUxzowtM"
            },
            {
              "type": 'ERC20',
              "ethereumSymbol": "LINK",
              "ethereumName": "ChainLink Token",
              "ethereumContractAddress": "0x514910771af9ca656af840dff83e8264ecf986ca",
              "decimals": 18,
              "tezosWrappingContract": "KT18fp5rcTW7mbWDmzFwjLDUhs5MeJmagDSZ",
              "tezosTokenId": '10',
              "tezosSymbol": "wLINK",
              "tezosName": "Wrapped LINK",
              "thumbnailUri": "ipfs://QmeaRuB578Xgy8jxbTxqmQ9s5wyioAEP85V7qbJFnn2uT8"
            },
          ]).filter(t => t.type === "ERC20").map(t => ({
            name: t.tezosName,
            decimals: t.decimals,
            contract: t.tezosWrappingContract,
            tokenId: t.tezosTokenId || '0'
        }));
    }

    const fetchContracts = async () => {
        const config: IndexerConfigPayload = await configPromise;
        return {minter: config.tezosMinterContract, quorum: config.tezosQuorumContract};
    }

    return {fetchTokens, fetchContracts};
}
