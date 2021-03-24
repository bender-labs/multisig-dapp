import {DAppClient, SigningType} from '@airgap/beacon-sdk'
import {useState} from "react";

type WalletInfo = {
    publicKey: string
    address: string
}

export type UseBeaconState = {
    loading: boolean
    wallet?: WalletInfo
    signature?: string
}

const client = new DAppClient({name: 'Basic Multisig helper'});

export function useBeacon() {
    const [state, setState] = useState<UseBeaconState>({loading: false});

    const connect = async () => {
        setState({...state, loading: true});
        const response = await client.requestPermissions();
        const info = {publicKey: response.publicKey, address: response.address};
        setState({loading: false, wallet: info});
    };

    const sign = async (payload: string) => {
        const sigResult = await client.requestSignPayload({payload, signingType: SigningType.RAW});
        setState({...state, signature: sigResult.signature})
    };

    return {connect, sign, state};
}
