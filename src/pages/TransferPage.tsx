import {TezosConnectionStatus, useWalletContext} from "../features/wallet/WalletContext";
import {Box, Button, Grid, Paper, Typography} from "@material-ui/core";
import SelectTokens from "../features/tokens/SelectTokens";
import useTokenTransfer from "../features/tokens/hooks/useTokenTransfer";
import {TokenWithBalance} from "../features/tokens/api/types";
import SelectDestination from "../features/tokens/SelectDestination";

function ConnectedTransferPage({address}: { address: string }) {
    const {state: {tokens, destination, selectedTokens}, selectTokens, setDestination} = useTokenTransfer(address);

    return <>
        <Grid item xs={4}>
            <Paper>
                <SelectTokens tokens={tokens} onSelect={(t) => selectTokens(t.map(e => e as TokenWithBalance))}/>
            </Paper>
        </Grid>
        <Grid item xs={8}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {selectedTokens.length > 0 && <Paper>
                        <SelectDestination value={destination} onSelect={setDestination}/>
                    </Paper>}
                </Grid>
                <Grid item xs={12}>

                    {selectedTokens.length > 0 && destination && <Paper>
                        <Box padding={2}>
                            <Typography>Send {tokens.length} token(s) to {destination}</Typography>
                            <Button variant={"outlined"}>Transfer</Button>
                        </Box>
                    </Paper>}
                </Grid>
            </Grid>
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
