import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListSubheader,
    TextField,
    Typography
} from "@material-ui/core";
import React, {FormEvent, useState} from "react";
import {emitMicheline, Expr} from "@taquito/michel-codec";

export type SignatureFormProps = {
    onValidate: (p: string) => void
    onSubmit: () => Promise<void>
    onReset: () => void
    micheline?: Expr
    signature?: string
};

function Render({onSubmit, signature, onValidate, micheline, onReset}: SignatureFormProps) {
    const [payload, setPayload] = useState("");

    const handleValidate = (evt: FormEvent<HTMLButtonElement>) => {
        evt.preventDefault();
        payload && onValidate(payload);
    }
    const handleSubmit = (evt: FormEvent<HTMLButtonElement>) => {
        evt.preventDefault();
        payload && onSubmit();
    }

    const handleReset = (evt: FormEvent<HTMLButtonElement>) => {
        evt.preventDefault();
        setPayload("");
        onReset();
    }

    return (
        <Card>
            <CardHeader
                title="Sign"
            />
            <CardContent>
                <Box>
                    {!signature && !micheline && <TextField
                        id="standard-basic"
                        label="Payload"
                        multiline
                        fullWidth
                        value={payload}
                        onChange={e => setPayload(e.target.value)}/>}
                    {!signature && micheline && <Typography component="pre">{emitMicheline(micheline, {
                        indent: "    ",
                        newline: "\n",
                    })}</Typography>}
                    {signature &&
                    <List>
                        <ListSubheader>
                            Signature
                        </ListSubheader>
                        <ListItem>
                            {signature}
                        </ListItem>
                    </List>
                    }
                </Box>
            </CardContent>
            <CardActions>
                {!micheline && <Button
                    color="primary"
                    variant="contained"
                    type="button"
                    onClick={handleValidate}
                >
                    NEXT
                </Button>}
                {!signature && micheline &&
                <>
                    <Button color="primary" variant="contained" type="button" onClick={handleReset}
                            value="Submit">RESET</Button>
                    <Button color="secondary" variant="contained" type="button" onClick={handleSubmit}
                            value="Submit">SIGN</Button>
                </>}
                {signature && <Button color="primary" variant="contained" type="button" onClick={handleReset}
                                      value="Submit">RESET</Button>}
            </CardActions>
        </Card>
    )
}

export default Render