import {Grid, Paper, Typography} from "@material-ui/core";
import useTokens from "../features/tokens/hooks/useTokens";
import SelectTokens from "../features/tokens/SelectTokens";
import {Token} from "../features/indexer/api/types";
import useTezosContracts from "../features/tokens/hooks/useTezosContracts";
import {useWalletContext} from "../features/wallet/WalletContext";
import ClaimFees from "../features/tokens/ClaimFees";
import {useState} from "react";



export default function ClaimPage() {
    const {loading, tokens} = useTokens();
    const {contracts} = useTezosContracts();
    const {library} = useWalletContext();

    const [selected, setTokens] = useState<Token[]>([]);


    return <Grid container spacing={2}>
        <Grid item xs={4}>
            <Paper>
                {loading && <Typography>Loading...</Typography>}

                <SelectTokens tokens={tokens} onSelect={setTokens}/>
            </Paper>
        </Grid>
        <Grid item xs={8}>
            <Paper>
                {library && contracts && selected.length > 0 &&
                <ClaimFees tezos={library} tokens={selected} minterContract={contracts.minter}/>}
            </Paper>
        </Grid>
    </Grid>
}
