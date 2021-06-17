import {useEffect, useState} from "react";
import {Contracts, IndexerApi} from "../../indexer/types";

type UseTezosContractsState = {
    contracts?: Contracts,
    loading: boolean
}

const useTezosContracts = (api: IndexerApi) => {

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
