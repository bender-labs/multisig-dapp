import {TezosToolkit, WalletOperation} from "@taquito/taquito";
import {Token} from "../../indexer/api/types";
import {Dispatch, useMemo, useReducer} from "react";
import actionCreatorFactory, {isType} from "typescript-fsa";
import {Action} from "../../types";

const actionCreator = actionCreatorFactory()

const selectTokens = actionCreator<Token[]>('SELECT_TOKENS');

const claim = actionCreator.async("CLAIM")

const reset = actionCreator('RESET');

const operationSent = actionCreator<string>('OPERATION_SENT');

export enum ClaimStatus {
    NOT_READY,
    READY,
    CLAIMING,
    CLAIMING_DONE,
}

type State = {
    status: ClaimStatus,
    tokens: Token[],
    hash?: string
}

const reducer = (state: State, action: Action) => {
    if (isType(action, claim.started)) {
        return {...state, status: ClaimStatus.CLAIMING};
    }
    if (isType(action, claim.done)) {
        return {...state, status: ClaimStatus.CLAIMING_DONE};
    }
    if (isType(action, operationSent)) {
        return {...state, hash: action.payload}
    }
    if (isType(action, reset)) {
        return {...state, hash: undefined, status: state.tokens.length > 0 ? ClaimStatus.READY : ClaimStatus.NOT_READY};
    }
    if (isType(action, selectTokens)) {
        return {
            ...state,
            tokens: action.payload,
            status: state.status === ClaimStatus.NOT_READY ? ClaimStatus.READY : state.status
        };
    }
    return state;
}


const _claim = (dispatch: Dispatch<Action>) => (tezos: TezosToolkit, address: string) => async (tokens: Token[]) => {
    dispatch(claim.started({}));
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
    dispatch(operationSent(opg.opHash));
    await opg.confirmation(1);
    dispatch(claim.done({result: {}, params: {}}))
}

const _reset = (dispatch: Dispatch<Action>) => () => dispatch(reset)

const _selectTokens = (dispatch: Dispatch<Action>) => (tokens: Token[]) => dispatch(selectTokens(tokens));

const useTokenClaim = (tezos: TezosToolkit, address: string) => {
    const [state, dispatch] = useReducer(reducer, {status: ClaimStatus.NOT_READY, tokens: []});
    const claim = useMemo(() => _claim(dispatch)(tezos, address), [dispatch, tezos, address]);
    const reset = useMemo(() => _reset(dispatch), [dispatch]);
    const select = useMemo(() => _selectTokens(dispatch), [dispatch]);
    return {...state, claim: () => claim(state.tokens), reset, selectTokens: select};
}

export default useTokenClaim;
