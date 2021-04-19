import {DAppClient, NetworkType, PermissionScope, SigningType} from '@airgap/beacon-sdk'
import {useEffect, useState} from "react";
import {Expr, unpackData} from "@taquito/michel-codec";

type WalletInfo = {
    publicKey: string
    address: string
}

export type UseBeaconState = {
    loading: boolean
    wallet?: WalletInfo
    payload?: string
    micheline?: Expr
    signature?: string
}

export function useBeacon(client: DAppClient) {
    const [state, setState] = useState<UseBeaconState>({loading: false});

    useEffect(() => {
        const fetch = async () => {
            const account = await client.getActiveAccount()
            if (account) {
                setState({...state, wallet: {publicKey: account.publicKey, address: account.address}});
            }
        }
        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client])

    const connect = async () => {
        setState({...state, loading: true});
        const response = await client.requestPermissions({
            network: {
                type: NetworkType.MAINNET,
            },
            scopes: [PermissionScope.SIGN]
        });
        const info = {publicKey: response.publicKey, address: response.address};
        setState({loading: false, wallet: info});
    };

    const validate = (payload: string) => {
        const sanitized = payload.startsWith("0x") ? payload.substr(2) : payload;
        const hex = Uint8Array.from(Buffer.from(sanitized, 'hex'));
        const micheline = unpackData(hex);
        setState({...state, payload: sanitized, micheline});
    }

    const sign = async () => {
        if (!state.payload) {
            return;
        }
        const sigResult = await client.requestSignPayload({payload: state.payload, signingType: SigningType.MICHELINE});
        setState({...state, signature: sigResult.signature})
    };

    const disconnect = async () => {
        setState({...state, loading: true});
        await client.clearActiveAccount();
        setState({loading: false})
    };

    const reset = () => {
        setState({...state, micheline: undefined, signature: undefined, payload: undefined});
    }

    return {connect, sign, validate, disconnect, reset, state};
}
