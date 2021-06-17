import {useConfig} from "../../runtime/config/ConfigContext";
import {useMemo} from "react";
import * as indexer from './IndexerApi';

const useIndexerApi = () => {
    const config = useConfig();
    return useMemo(() => indexer.create(config.indexerApiUrl), [config.indexerApiUrl])
}

export default useIndexerApi;
