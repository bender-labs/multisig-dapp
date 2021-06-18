import {useEffect, useState} from "react";
import {Contracts} from "../../indexer/api/types";
import useIndexerApi from "../../indexer/hooks/useIndexerApi";

type UseTezosContractsState = {
    contracts?: Contracts,
    loading: boolean
}

const useTezosContracts = () => {
    const api = useIndexerApi();
    const [state, setState] = useState<UseTezosContractsState>({loading: false});

    useEffect(() => {
        const fetch = async () => {
            setState({loading: true});
            const contracts = await api.fetchContracts();
            setState({loading: false, contracts});
        };
        // noinspection JSIgnoredPromiseFromCall
        fetch();
    }, [api]);

    return state;
}

export default useTezosContracts;
