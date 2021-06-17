import {NetworkType} from '@airgap/beacon-sdk';

export enum Environment {
    TESTNET = 'TESTNET',
    MAINNET = 'MAINNET',
}

export interface Config {
    environmentName: Environment;
    tezos: {
        rpcUrl: string;
        networkId: NetworkType;
        networkName: string;
    };
    indexerApiUrl: string;
}

const env =
    Environment[
        (process.env.REACT_APP_WRAP_ENVIRONMENT ||
            'TESTNET') as keyof typeof Environment
        ];

export const initialConfig: Config = {
    environmentName: env,
    tezos: {
        rpcUrl: process.env.REACT_APP_TZ_RPC!,
        networkId: process.env.REACT_APP_TZ_NETWORK_ID! as NetworkType,
        networkName: process.env.REACT_APP_TZ_NETWORK_NAME!,
    },
    indexerApiUrl: process.env.REACT_APP_INDEXER!
};
