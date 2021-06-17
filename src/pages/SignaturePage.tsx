import {Box, Typography} from "@material-ui/core";
import WalletInfo from "../features/wallet/WalletInfo";
import React from "react";
import {TezosConnectionStatus, useWalletContext} from "../features/wallet/WalletContext";
import Signature from "../features/signature/Signature";

export default function SignaturePage() {
    let {status, account, wallet} = useWalletContext();
    if (status !== TezosConnectionStatus.CONNECTED) {
        return <Typography>Not Connected</Typography>
    }
    return <Box>
        <Box>

            <WalletInfo
                address={account!.address}
                publicKey={account!.publicKey}
            />

        </Box>
        <Box mt={5}>

            <Signature client={wallet}/>

        </Box>
    </Box>
}
