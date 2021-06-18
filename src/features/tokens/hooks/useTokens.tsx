import {useEffect, useState} from "react";
import {Token} from "../../indexer/api/types";
import useIndexerApi from "../../indexer/hooks/useIndexerApi";

type UseTokensState = {
    tokens: Token[],
    loading: boolean
}

const useTokens = () => {
    const api = useIndexerApi();
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
