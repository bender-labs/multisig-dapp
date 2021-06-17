import useSignature from "./hooks/useSignature";
import SignatureForm from "./SignatureForm";
import {BeaconWallet} from "@taquito/beacon-wallet";

type Props = {
    client: BeaconWallet
}

export default function Signature({client}: Props) {
    const context = useSignature(client);
    return <SignatureForm onValidate={context.validate} onSubmit={context.sign} onReset={context.reset}
                          signature={context.signature} micheline={context.micheline}/>
}
