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
    TextField
} from "@material-ui/core";
import React, {FormEvent, useState} from "react";

export type SignatureFormProps = {
    onSubmit: (p: string) => Promise<any>
    signature?: string
};

function Render({onSubmit, signature}: SignatureFormProps) {
    const [payload, setPayload] = useState("");

    const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        payload && onSubmit(payload);

    }
    return (
        <Card>
            <CardHeader
                title="Sign"
            />
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <Box>
                        <TextField
                            id="standard-basic"
                            label="Payload"
                            multiline
                            fullWidth
                            value={payload}
                            onChange={e => setPayload(e.target.value)}/>
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
                    <Button color="primary" variant="contained" type="submit"
                            value="Submit">Signer</Button>
                </CardActions>
            </form>
        </Card>
    )
}

export default Render