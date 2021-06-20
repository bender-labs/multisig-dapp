import {Token} from "../indexer/api/types";
import {ClaimStatus} from "./hooks/useTokenClaim";
import {Box, Button, Typography} from "@material-ui/core";

type ClaimFeesProps = {
    tokens: Token[]
    onConfirm: () => Promise<void>,
    onReset: () => void,
    status: ClaimStatus,
    hash?: string
}

export default function ClaimFees({tokens, onConfirm, onReset, status, hash}: ClaimFeesProps) {
    return <Box padding={2}>
        <Typography>Claim fees for {tokens.length} token(s)</Typography>
        {status === ClaimStatus.READY &&
        <Button variant={"contained"} color={"primary"} onClick={onConfirm}>Claim</Button>}
        {status === ClaimStatus.CLAIMING && <Typography>Claiming...</Typography>}
        {hash && status !== ClaimStatus.CLAIMING_DONE &&
        <Box>
            <Typography>Operation sent : {hash}</Typography>
            <Typography variant={"subtitle1"}>Waiting for confirmation</Typography>
        </Box>}
        {status === ClaimStatus.CLAIMING_DONE && <Box>
            <Typography>Done : {hash}</Typography>
            <Button variant={"outlined"} onClick={onReset}>OK</Button>
        </Box>}
    </Box>
}
