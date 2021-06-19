import useBcdApi from "./useBcdApi";
import {useEffect, useState} from "react";
import {TokenWithBalance} from "../api/types";


const useTokenTransfer = (address: string) => {
    const api = useBcdApi();
    const [tokens, setTokens] = useState<TokenWithBalance[]>([]);
    const [destination, setDestination] = useState<string|undefined>();
    const [selectedTokens, setSelectedTokens] = useState<TokenWithBalance[]>([])


    useEffect(() => {
        api.fetchAllBalancesOf(address)
            .then(setTokens);
    }, [api, address]);
    return {state: {tokens, selectedTokens, destination}, selectTokens: setSelectedTokens, setDestination};
}

export default useTokenTransfer;
