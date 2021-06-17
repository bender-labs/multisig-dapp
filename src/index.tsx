import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ConfigProvider from './runtime/config/ConfigContext';
import WalletProvider from './features/wallet/WalletContext';
import {initialConfig} from "./runtime/config/types";
import {BeaconWallet} from "@taquito/beacon-wallet";
import {CssBaseline} from "@material-ui/core";
import {BrowserRouter as Router} from 'react-router-dom';

const getLibrary = () => new BeaconWallet({name: 'Multisig dAPP'});

ReactDOM.render(
    <React.StrictMode>
        <ConfigProvider>
            <WalletProvider getLibrary={getLibrary} networkId={initialConfig.tezos.networkId}
                            rpcUrl={initialConfig.tezos.rpcUrl}>
                <Router>

                    <CssBaseline/>
                    <App/>
                </Router>
            </WalletProvider>

        </ConfigProvider>

    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
