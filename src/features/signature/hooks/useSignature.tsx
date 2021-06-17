import {Expr, unpackData} from "@taquito/michel-codec";
import {SigningType} from "@airgap/beacon-sdk";
import {useState} from "react";
import {BeaconWallet} from "@taquito/beacon-wallet";


export type UseSignatureState = {
    payload?: string
    micheline?: Expr
    signature?: string
}

const useSignature = (wallet: BeaconWallet) => {

    let [state, setState] = useState<UseSignatureState>({});


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
        const sigResult = await wallet.client.requestSignPayload({
            payload: state.payload,
            signingType: SigningType.MICHELINE
        });
        setState({...state, signature: sigResult.signature})
    };

    const reset = () => {
        setState({...state, micheline: undefined, signature: undefined, payload: undefined});
    }

    return {...state, validate, sign, reset}
}

export default useSignature;
