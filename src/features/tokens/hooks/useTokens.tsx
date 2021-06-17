import {useEffect, useState} from "react";
import {IndexerApi, Token} from "../../indexer/types";

type UseTokensState = {
    tokens: Token[],
    loading: boolean
}

const useTokens = (api: IndexerApi) => {

    const [state, setState] = useState<UseTokensState>({tokens: [], loading: false});

    useEffect(() => {
        const fetch = async () => {
            setState({loading: true, tokens: []});
            const tokens = await api.fetchTokens();
            setState({loading: false, tokens});
        };
        // noinspection JSIgnoredPromiseFromCall
        fetch();
    }, [api]);

    return state;
}

export default useTokens;
