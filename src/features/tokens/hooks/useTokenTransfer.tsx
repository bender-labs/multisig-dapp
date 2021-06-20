import {Dispatch, useCallback, useReducer} from "react";
import {TokenWithBalance} from "../api/types";
import actionCreatorFactory, {isType} from "typescript-fsa";
import {TezosToolkit, WalletOperation} from "@taquito/taquito";
import {Action} from "../../types";

const actionCreator = actionCreatorFactory();

const selectTokens = actionCreator<TokenWithBalance[]>('SELECT_TOKENS')
const selectDestination = actionCreator<string>('SELECT_DESTINATION')
const transfer = actionCreator.async<void, string>('TRANSFER')
const reset = actionCreator('RESET');

export enum TransferState {
    NOT_READY,
    READY,
    TRANSFERRING,
    TRANSFER_DONE
}


interface State {
    tokens: TokenWithBalance[],
    destination: string,
    status: TransferState,
    hash?: string
}

const nextState = (currentState: TransferState, tokens: TokenWithBalance[], destination?: string) => {
    if (currentState === TransferState.TRANSFERRING || currentState === TransferState.TRANSFER_DONE) {
        return currentState;
    }
    return tokens.length > 0 && destination ? TransferState.READY : TransferState.NOT_READY;
}

const reducer = (state: State, a: Action): State => {
    if (isType(a, selectTokens)) {
        return {...state, tokens: a.payload, status: nextState(state.status, a.payload, state.destination)}
    }
    if (isType(a, selectDestination)) {
        return {...state, destination: a.payload, status: nextState(state.status, state.tokens, a.payload)}
    }
    if (isType(a, transfer.started)) {
        return {...state, status: TransferState.TRANSFERRING}
    }
    if (isType(a, transfer.done)) {
        return {...state, status: TransferState.TRANSFER_DONE, hash: a.payload.result}
    }
    if (isType(a, reset)) {
        return {...state, hash: undefined, status: nextState(TransferState.NOT_READY, state.tokens, state.destination)};
    }
    return state;
}

const _transfer = (dispatch: Dispatch<Action>, address: string, library: TezosToolkit) => async (tokens: TokenWithBalance[], destination: string) => {
    dispatch(transfer.started());
    const byContract = tokens.reduce<{ [key: string]: TokenWithBalance[] }>((acc, t) => {
        const arr = acc[t.contract] || [];
        arr.push(t);
        acc[t.contract] = arr;
        return acc;
    }, {});

    const calls = await Promise.all(Object.keys(byContract).map(async c => {
        const contract = await library.wallet.at(c);
        let txs = byContract[c].map(a => ({amount: a.balance.toString(10), to_: destination, token_id: a.tokenId}));
        return contract.methods.transfer([{from_: address, txs: txs}]);
    }));

    const batch = calls.reduce((acc, c) => {
        acc.withContractCall(c);
        return acc;
    }, library.wallet.batch());

    const opg: WalletOperation = await batch.send();
    await opg.confirmation(1);
    dispatch(transfer.done({result: opg.opHash}));
}

const useTokenTransfer = (address: string, library: TezosToolkit) => {

    const [state, dispatch] = useReducer(reducer, {tokens: [], status: TransferState.NOT_READY, destination: ""});
    const transfer = useCallback((tokens: TokenWithBalance[], destination: string) => _transfer(dispatch, address, library)(tokens, destination), [dispatch, address, library]);
    const tokens: (tokens: TokenWithBalance[]) => void = useCallback(tokens => dispatch(selectTokens(tokens)), [dispatch]);
    const destination: (value: string) => void = useCallback((value) => dispatch(selectDestination(value)), [dispatch]);
    const res = useCallback(() => dispatch(reset()), [dispatch]);
    return {
        ...state,
        transfer: () => transfer(state.tokens, state.destination),
        selectTokens: tokens,
        selectDestination: destination,
        reset: res
    }

}

export default useTokenTransfer;
