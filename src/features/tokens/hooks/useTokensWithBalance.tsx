import {useEffect, useMemo, useState} from "react";
import {TokenWithBalance} from "../api/types";
import useTokens from "./useTokens";
import {TezosToolkit} from "@taquito/taquito";
import {Token} from "../../indexer/api/types";
import {tzip16, View} from "@taquito/tzip16";
import BigNumber from "bignumber.js";

const _refresh = (tokensByContract: { [key: string]: Token[] }, tezos: TezosToolkit, tokensList: Token[], address: string, setter: (t: TokenWithBalance[]) => void) => async () => {
    const metadata = await Promise.all(Object.keys(tokensByContract)
        .map(c => tezos.wallet.at(c, tzip16)
            .then(contract => contract.tzip16().metadataViews())
            .then(views => ({contract: c, views}))));
    let viewsByContract = metadata.reduce<{ [key: string]: { [p: string]: () => View } }>((acc, {
        contract,
        views
    }) => {
        acc[contract] = views;
        return acc;
    }, {});
    const balancesPromise = tokensList.map<Promise<TokenWithBalance>>(async token => {
        const balance = await viewsByContract[token.contract].get_balance().executeView(address, token.tokenId);
        return {...token, balance: new BigNumber(balance)}
    })
    const res = await Promise.all(balancesPromise);
    setter(res)
}


const useTokensWithBalance = (address: string, tezos: TezosToolkit) => {
    const {tokens: tokensList} = useTokens();
    const [tokens, setTokens] = useState<TokenWithBalance[]>([]);

    const tokensByContract = useMemo(() => tokensList.reduce<{ [key: string]: Token[] }>((acc, t) => {
        const arr = acc[t.contract] || [];
        arr.push(t);
        acc[t.contract] = arr;
        return acc;
    }, {}), [tokensList]);

    const refresh = useMemo(() => _refresh(tokensByContract, tezos, tokensList, address, setTokens), [tokensByContract, tezos, tokensList, address, setTokens]);

    useEffect(() => {
        // noinspection JSIgnoredPromiseFromCall
        refresh();
    }, [refresh])


    return {tokens, refresh};
}

export default useTokensWithBalance;
