import React, {Dispatch, PropsWithChildren, useEffect, useMemo,} from 'react';

import {NetworkType, RequestPermissionInput} from '@airgap/beacon-sdk';
import {TezosToolkit} from '@taquito/taquito';
import {BeaconWallet} from '@taquito/beacon-wallet';
import {Tzip16Module} from '@taquito/tzip16';

export enum TezosConnectionStatus {
    NOT_CONNECTED,
    LOADING,
    CONNECTED,
}

type Account = {
    address: string, publicKey: string
}

type State = {
    status: TezosConnectionStatus;
    wallet: BeaconWallet;
    library?: TezosToolkit;
    account?: Account;
    network?: NetworkType;
};

enum ActionType {
    START_ACTION,
    CONNECT,
    DISCONNECT,
}

type Action =
    | {
    type: ActionType.START_ACTION
}
    | {
    type: ActionType.CONNECT;
    payload: {
        network: NetworkType;
        account: Account;
        library: TezosToolkit;
    }
}
    | {
    type: ActionType.DISCONNECT;
};

type Effects = {
    activate: () => Promise<Account>;

    deactivate: () => Promise<void>;
};

function reducer(state: State, action: Action): State {

    switch (action.type) {
        case ActionType.CONNECT: {
            const {network, account, library} = action.payload;
            return {
                ...state,
                network,
                status: TezosConnectionStatus.CONNECTED,
                account,
                library,
            };
        }
        case ActionType.DISCONNECT: {
            return {
                status: TezosConnectionStatus.NOT_CONNECTED,
                wallet: state.wallet,
            };
        }
        case ActionType.START_ACTION: {
            return {
                status: TezosConnectionStatus.LOADING,
                wallet: state.wallet
            }
        }
    }
}

// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols,ES6ShorthandObjectProperty
const fakeSigner = (account: string) => ({
    publicKey(): Promise<string> {
        return Promise.reject('Noop signer');
    },
    publicKeyHash(): Promise<string> {
        return Promise.resolve(account);
    },
    secretKey(): Promise<string | undefined> {
        return Promise.reject('Noop signer');
    },
    sign(
        op: {},
        magicByte: Uint8Array | undefined
    ): Promise<{
        bytes: string;
        sig: string;
        prefixSig: string;
        sbytes: string;
    }> {
        return Promise.reject('Noop signer');
    },
});

function _activate(dispatch: Dispatch<Action>) {
    return (client: BeaconWallet) => (request: RequestPermissionInput) => async () => {
        dispatch({type: ActionType.START_ACTION});
        const library = new TezosToolkit(request.network?.rpcUrl || '');
        library.addExtension(new Tzip16Module());
        await client.requestPermissions(request);
        library.setWalletProvider(client);
        const account = await client.client.getActiveAccount();
        if (!account) {
            throw new Error("Beacon not initialized")
        }
        library.setSignerProvider(fakeSigner(account!.address));
        dispatch({
            type: ActionType.CONNECT,
            payload: {
                network: request.network?.type!,
                account: {address: account!.address, publicKey: account!.publicKey},
                library,
            },
        });
        return account;
    };
}

function _reactivate(dispatch: Dispatch<Action>) {
    return (wallet: BeaconWallet) => (request: RequestPermissionInput) => async () => {
        const library = new TezosToolkit(request.network?.rpcUrl || '');
        library.addExtension(new Tzip16Module());
        library.setWalletProvider(wallet);
        const account = await wallet.client.getActiveAccount();
        library.setSignerProvider(fakeSigner(account!.address));
        dispatch({
            type: ActionType.CONNECT,
            payload: {
                network: request.network?.type!,
                account: {address: account!.address, publicKey: account!.publicKey},
                library,
            },
        });
        return account;
    };
}

function _deactivate(dispatch: Dispatch<Action>) {
    return (client: BeaconWallet) => async () => {
        dispatch({type: ActionType.START_ACTION})
        return client.clearActiveAccount().then(() => {
            dispatch({
                type: ActionType.DISCONNECT,
            });
        });
    };
}

export type WalletContextProps = State & Effects

const WalletContext = React.createContext<null | WalletContextProps>(null);

type Props = {
    getLibrary: () => BeaconWallet;
    networkId: NetworkType;
    rpcUrl: string;

};

export default function WalletProvider({
                                           getLibrary,
                                           children,
                                           networkId,
                                           rpcUrl
                                       }: PropsWithChildren<Props>) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const wallet = useMemo(() => getLibrary(), []);
    const [state, dispatch]: [State, Dispatch<Action>] = React.useReducer(reducer, {
        status: TezosConnectionStatus.NOT_CONNECTED,
        wallet: wallet
    });
    let request = useMemo(() => ({
        network: {
            type: networkId,
            rpcUrl,
        }
    }), [networkId, rpcUrl]);

    const activate = useMemo(() => _activate(dispatch)(wallet)(request), [request, wallet, dispatch]);
    const deactivate = useMemo(() => _deactivate(dispatch)(wallet), [wallet, dispatch]);
    const reactivate = useMemo(() => _reactivate(dispatch)(wallet)(request), [request, wallet, dispatch]);
    useEffect(() => {
        wallet.client.getActiveAccount().then((activeAccount) => {
            if (activeAccount) {
                // noinspection JSIgnoredPromiseFromCall
                reactivate();
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <WalletContext.Provider
            value={{...state, activate, deactivate}}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWalletContext() {
    const context = React.useContext(WalletContext);
    if (context == null) {
        throw new Error('useWalletContext must be used within a TezosContext');
    }
    return context;
}
