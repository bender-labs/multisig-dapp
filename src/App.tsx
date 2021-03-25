import React from 'react';
import './App.css';
import {AppBar, Box, Button, CircularProgress, Container, CssBaseline, Toolbar, Typography} from "@material-ui/core";
import {useBeacon, UseBeaconState} from './features/wallet/useBeacon';
import {BeaconProvider, useBeaconClient} from "./runtime/BeaconProvider";
import WalletInfo from "./features/wallet/WalletInfo";
import SignatureForm from "./features/wallet/SignatureForm";

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
    const dapp = useBeaconClient();
    const beacon = useBeacon(dapp);

    return (
        <BeaconProvider>
            <CssBaseline/>
            <Container maxWidth="md">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">
                            Simple multisig helper
                        </Typography>
                        {connectWallet(beacon)}
                    </Toolbar>
                </AppBar>
                <Box mt={5}>
                    {beacon.state.wallet &&
                    <WalletInfo
                        address={beacon.state.wallet.address}
                        publicKey={beacon.state.wallet.publicKey}
                    />
                    }
                </Box>
                <Box mt={5}>
                    {beacon.state.wallet &&
                    <SignatureForm
                        onSubmit={v => beacon.sign(v)}
                        signature={beacon.state.signature}
                    />
                    }
                </Box>

            </Container>
        </BeaconProvider>
    );
}

export default App;
