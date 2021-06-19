import useBcdApi from "./useBcdApi";
import {useEffect, useState} from "react";
import {TokenWithBalance} from "../api/types";


const useTokensWithBalance = (address: string) => {
    const api = useBcdApi();
    const [tokens, setTokens] = useState<TokenWithBalance[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        api.fetchAllBalancesOf(address)
            .then(setTokens)
            .finally(() => setLoading(false));
    }, [api, address]);
    return {tokens, loading};
}

export default useTokensWithBalance;
