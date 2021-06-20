import {TezosConnectionStatus, useWalletContext} from "../features/wallet/WalletContext";
import {Box, Button, Grid, Paper, Typography} from "@material-ui/core";
import SelectTokens from "../features/tokens/SelectTokens";
import useTokenTransfer, {TransferState} from "../features/tokens/hooks/useTokenTransfer";
import {TokenWithBalance} from "../features/tokens/api/types";
import SelectDestination from "../features/tokens/SelectDestination";
import useTokensWithBalance from "../features/tokens/hooks/useTokensWithBalance";
import {TezosToolkit} from "@taquito/taquito";

function ConnectedTransferPage({address, library}: { address: string, library: TezosToolkit }) {
    const {tokens, refresh} = useTokensWithBalance(address, library);
    const {
        selectDestination,
        selectTokens,
        transfer,
        status,
        hash,
        destination,
        reset
    } = useTokenTransfer(address, library);

    const handleTransfer = async () => {
        await transfer();
        // noinspection ES6MissingAwait
        refresh();
    }

    return <>
        <Grid item xs={4}>
            <Paper>
                <SelectTokens tokens={tokens} onSelect={(t) => selectTokens(t.map(e => e as TokenWithBalance))}/>
            </Paper>
        </Grid>
        <Grid item xs={8}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper>
                        <SelectDestination value={destination} onSelect={selectDestination}/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>

                    {status !== TransferState.NOT_READY && <Paper>
                        <Box padding={2}>
                            <Typography>Send {tokens.length} token(s) from {address} to {destination}</Typography>
                            {status === TransferState.READY &&
                            <Button variant={"outlined"} onClick={handleTransfer}>Transfer</Button>}
                            {status === TransferState.TRANSFERRING && <Typography>Transferring…</Typography>}
                            {status === TransferState.TRANSFER_DONE && <div>
                                <Typography>Done {hash}</Typography>
                                <Button onClick={reset}>Reset</Button>
                            </div>}
                        </Box>
                    </Paper>}
                </Grid>
            </Grid>
        </Grid>
    </>
}

export default function TransferPage() {

    const {status, account, library} = useWalletContext();


    return <Grid container spacing={2}>
        {status !== TezosConnectionStatus.CONNECTED && <Typography>Not connected</Typography>}
        {status === TezosConnectionStatus.CONNECTED &&
        <ConnectedTransferPage address={account!.address} library={library!}/>}
    </Grid>
}
