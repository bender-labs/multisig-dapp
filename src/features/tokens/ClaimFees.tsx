import {TezosToolkit} from "@taquito/taquito";
import {Token} from "../indexer/api/types";
import useMinterContract, {ActionType} from "./hooks/useMinterContract";
import {Box, Button, Typography} from "@material-ui/core";

type ClaimFeesProps = {
    tezos: TezosToolkit,
    tokens: Token[],
    minterContract: string
}

export default function ClaimFees({minterContract, tezos, tokens}: ClaimFeesProps) {
    const context = useMinterContract(tezos, minterContract);
    return <Box padding={2}>
        <Typography>Claim fees for {tokens.length} token(s)</Typography>
        {context.status === ActionType.IDLE &&
        <Button variant={"contained"} color={"primary"} onClick={() => context.claim(tokens)}>Claim</Button>}
        {context.status === ActionType.CLAIMING && <Typography>Claiming...</Typography>}
        {context.status === ActionType.OPERATION_SENT &&
        <Box>
            <Typography>Operation sent : {context.hash}</Typography>
            <Typography variant={"subtitle1"}>Waiting for confirmation</Typography>
        </Box>}
        {context.status === ActionType.CLAIMING_DONE && <Box>
            <Typography>Done : {context.hash}</Typography>
            <Button variant={"outlined"} onClick={context.reset}>OK</Button>
        </Box>}
    </Box>
}
