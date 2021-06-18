import React from 'react';
import {AppBar, Button, createStyles, Theme, Toolbar, Typography,} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {TezosConnectionStatus, useWalletContext, WalletContextProps} from "../wallet/WalletContext";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
            marginLeft: theme.spacing(2),
        },
    })
);

function connectWallet(context: WalletContextProps) {
    const loading = context.status === TezosConnectionStatus.LOADING;
    switch (context.status) {
        case TezosConnectionStatus.NOT_CONNECTED:
            return (<Button
                variant="contained"
                onClick={context.activate}
                disabled={loading}
            >
                Connect wallet
            </Button>);
        case TezosConnectionStatus.LOADING:
            return (<Button variant="contained" disabled={true}>Loading</Button>)
        case TezosConnectionStatus.CONNECTED:
            return (<Button variant="contained" color={"secondary"} onClick={context.deactivate}>Disconnect</Button>)
    }
}


const TopNavigation = () => {
    const classes = useStyles();
    const walletContext = useWalletContext();

    return (
        <AppBar position="static">
            <Toolbar>

                <Typography variant="h6" className={classes.title}>
                    Basic Admin helper
                </Typography>
                {connectWallet(walletContext)}
            </Toolbar>
        </AppBar>
    );
};

export default TopNavigation;
