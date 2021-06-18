import {TezosToolkit, WalletOperation} from "@taquito/taquito";
import {Token} from "../../indexer/api/types";
import {Dispatch, useCallback, useReducer} from "react";

export enum ActionType {
    CLAIMING,
    IDLE,
    DONE
}

type State = {
    status: ActionType,
    hash?: string
}

type Action =
    | {
    type: ActionType.CLAIMING
}
    | { type: ActionType.IDLE }
    | { type: ActionType.DONE, payload: string }

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.IDLE:
            return {...state, status: action.type};
        case ActionType.CLAIMING:
            return {status: ActionType.CLAIMING}
        case ActionType.DONE:
            return {status: ActionType.DONE, hash: action.payload}
    }
}

const _claim = (dispatch: Dispatch<Action>) => (tezos: TezosToolkit, address: string) => async (tokens: Token[]) => {
    dispatch({type: ActionType.CLAIMING});
    const contract = await tezos.wallet.at(address);
    const byContract = tokens.reduce<{ [key: string]: Token[] }>((acc, t) => {
        const arr = acc[t.contract] || [];
        arr.push(t);
        acc[t.contract] = arr;
        return acc;
    }, {});
    const batch = Object.keys(byContract).reduce((acc, c) => {
        acc.withContractCall(contract.methods.withdraw_all_tokens(c, byContract[c].map(t => t.tokenId)));
        return acc;
    }, tezos.wallet.batch());

    const opg: WalletOperation = await batch.send();
    await opg.confirmation(1);
    dispatch({type: ActionType.DONE, payload: opg.opHash})
}


const useMinterContract = (tezos: TezosToolkit, address: string) => {
    let [state, dispatch] = useReducer(reducer, {status: ActionType.IDLE});
    let claim = useCallback(_claim(dispatch)(tezos, address), [dispatch, tezos, address]);
    return {...state, claim};
}

export default useMinterContract;
