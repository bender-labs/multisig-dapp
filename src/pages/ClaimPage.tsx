import {Grid, Paper, Typography} from "@material-ui/core";
import useTokens from "../features/tokens/hooks/useTokens";
import SelectTokens from "../features/tokens/SelectTokens";
import useTezosContracts from "../features/tokens/hooks/useTezosContracts";
import {TezosConnectionStatus, useWalletContext} from "../features/wallet/WalletContext";
import ClaimFees from "../features/tokens/ClaimFees";
import useTokenClaim from "../features/tokens/hooks/useTokenClaim";
import {TezosToolkit} from "@taquito/taquito";

function ConnectedClaimPage({address, tezos}: { tezos: TezosToolkit, address: string }) {
    const {claim, reset, tokens, hash, selectTokens, status} = useTokenClaim(tezos, address);
    const {loading, tokens: availableTokens} = useTokens();
    return <><Grid item xs={4}>
        <Paper>
            {loading && <Typography>Loading...</Typography>}

            <SelectTokens tokens={availableTokens} onSelect={selectTokens}/>
        </Paper>
    </Grid>
        <Grid item xs={8}>
            <Paper>
                <ClaimFees status={status} tokens={tokens} hash={hash} onConfirm={claim} onReset={reset}/>
            </Paper>
        </Grid></>
}

export default function ClaimPage() {
    const {contracts} = useTezosContracts();
    const {library, status} = useWalletContext();

    return <Grid container spacing={2}>
        {status !== TezosConnectionStatus.CONNECTED && <Typography>Not connected</Typography>}
        {status === TezosConnectionStatus.CONNECTED && contracts?.minter &&
        <ConnectedClaimPage tezos={library!} address={contracts.minter}/>}
    </Grid>
}
