import React, {PropsWithChildren} from 'react';
import {Config, initialConfig} from './types';
import {IndexerApi} from "../../features/indexer/api/types";
import * as indexer from "../../features/indexer/api/IndexerApi";
import {BcdApi} from "../../features/tokens/api/types";
import * as bcd from "../../features/tokens/api/BcdApi";

type ContextValue = Config & { indexerApi: IndexerApi, bcdApi: BcdApi };
const ConfigContext = React.createContext<ContextValue>({} as ContextValue);

export function useConfig() {
    const config = React.useContext(ConfigContext);
    if (config == null)
        throw new Error('config consumer must be used within a config provider');
    return config;
}

const indexerApi = indexer.create(initialConfig.indexerApiUrl);
const bcdApi = bcd.create(initialConfig.bcdApiUrl, initialConfig.tezos.networkId)

export default function Provider({children}: PropsWithChildren<{}>) {

    return (
        <ConfigContext.Provider value={{...initialConfig, indexerApi, bcdApi}}>{children}</ConfigContext.Provider>
    );
}
