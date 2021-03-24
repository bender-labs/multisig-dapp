import React, {FormEvent, useState} from 'react';
import './App.css';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Container,
    CssBaseline,
    List,
    ListItem,
    ListSubheader,
    TextField
} from "@material-ui/core";
import {useBeacon, UseBeaconState} from './features/wallet/useBeacon';

function connectWallet(beacon: { state: UseBeaconState; connect: () => Promise<void> }) {
    if (beacon.state.wallet == null)
        return (
            <Box>
                <Button
                    variant="contained"
                    onClick={beacon.connect}
                    disabled={beacon.state.loading}
                >
                    Connect wallet
                </Button>
                {beacon.state.loading && <CircularProgress/>}
            </Box>
        )
    if (beacon.state.loading) {
        return (<Button variant="contained" disabled={true}>Loading</Button>)
    }
    return (<Button disabled={true}>Connected</Button>)
}

function App() {
    const beacon = useBeacon();
    const [payload, setPayload] = useState<string>();

    const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
        payload && beacon.sign(payload);
        evt.preventDefault();
    }

    return (
        <Box>
            <CssBaseline/>
            <Container maxWidth="md">
                <Card>
                    <CardHeader
                        title="Basic Multisig helper"
                        action={connectWallet(beacon)}
                    />

                    <CardContent>
                        {beacon.state.wallet &&
                        <Box>
                            <List>
                                <ListSubheader>
                                    Address
                                </ListSubheader>
                                <ListItem>
                                    {beacon.state.wallet.address}
                                </ListItem>
                                <ListSubheader>
                                    Public key
                                </ListSubheader>
                                <ListItem>
                                    {beacon.state.wallet.publicKey}
                                </ListItem>
                                <ListSubheader>
                                    Signature
                                </ListSubheader>
                                <ListItem>
                                    {beacon.state.signature}
                                </ListItem>
                            </List>
                            <form onSubmit={handleSubmit}>
                                <TextField id="standard-basic" label="Payload" value={payload}
                                           onChange={(e) => setPayload(e.target.value)}/>
                                <Button color="primary" variant="contained" type="submit" value="Submit">Signer</Button>
                            </form>
                        </Box>

                        }
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default App;
