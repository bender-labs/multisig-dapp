import {TezosConnectionStatus, useWalletContext} from "../features/wallet/WalletContext";
import {useState} from "react";
import {Token} from "../features/indexer/api/types";
import {Grid, Paper, Typography} from "@material-ui/core";
import SelectTokens from "../features/tokens/SelectTokens";
import useTokenWithBalances from "../features/tokens/hooks/useTokenTransfer";

function ConnectedTransferPage({address}: { address: string }) {
    const {tokens} = useTokenWithBalances(address);
    const [, setTokens] = useState<Token[]>([]);
    return <>
        <Grid item xs={4}>
            <Paper>
                <SelectTokens tokens={tokens} onSelect={setTokens}/>
            </Paper>
        </Grid>
        <Grid item xs={8}>
            <Paper>

            </Paper>
        </Grid>
    </>
}

export default function TransferPage() {

    const {status, account} = useWalletContext();


    return <Grid container spacing={2}>
        {status !== TezosConnectionStatus.CONNECTED && <Typography>Not connected</Typography>}
        {status === TezosConnectionStatus.CONNECTED && <ConnectedTransferPage address={account!.address}/>}
    </Grid>
}
