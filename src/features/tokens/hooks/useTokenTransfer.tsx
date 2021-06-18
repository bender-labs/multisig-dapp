import useBcdApi from "./useBcdApi";
import {useEffect, useState} from "react";
import {TokenWithBalance} from "../api/types";


const useTokenWithBalances = (address: string) => {
    const api = useBcdApi();
    const [tokens, setTokens] = useState<TokenWithBalance[]>([]);

    useEffect(() => {
        api.fetchAllBalancesOf(address)
            .then(setTokens);
    }, [api, address]);
    return {tokens};
}

export default useTokenWithBalances;
