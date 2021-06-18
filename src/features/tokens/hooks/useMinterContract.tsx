import {TezosToolkit, WalletOperation} from "@taquito/taquito";
import {Token} from "../../indexer/api/types";
import {Dispatch, useCallback, useReducer} from "react";

export enum ActionType {
    IDLE,
    CLAIMING,
    OPERATION_SENT,
    CLAIMING_DONE
}

type State = {
    status: ActionType,
    hash?: string
}

type Action =
    | {
    type: ActionType.CLAIMING
}
    | { type: ActionType.OPERATION_SENT, payload: string }
    | { type: ActionType.IDLE }
    | { type: ActionType.CLAIMING_DONE }

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.IDLE:
            return {...state, status: action.type};
        case ActionType.CLAIMING:
            return {status: ActionType.CLAIMING}
        case ActionType.OPERATION_SENT:
            return {status: ActionType.OPERATION_SENT, hash: action.payload}
        case ActionType.CLAIMING_DONE:
            return {...state, status: ActionType.CLAIMING_DONE}
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
    dispatch({type: ActionType.OPERATION_SENT, payload: opg.opHash})
    await opg.confirmation(1);
    dispatch({type: ActionType.CLAIMING_DONE})
}

const _reset = (dispatch: Dispatch<Action>) => () => dispatch({type: ActionType.IDLE})

const useMinterContract = (tezos: TezosToolkit, address: string) => {
    const [state, dispatch] = useReducer(reducer, {status: ActionType.IDLE});
    const claim = useCallback(_claim(dispatch)(tezos, address), [dispatch, tezos, address]);
    const reset = useCallback(_reset(dispatch), [dispatch]);
    return {...state, claim, reset};
}

export default useMinterContract;
