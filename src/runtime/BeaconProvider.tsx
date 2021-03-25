import {DAppClient} from "@airgap/beacon-sdk";
import React, {useContext} from "react";

const dAppClient = new DAppClient({name: 'Basic Multisig helper'});
const BeaconContext = React.createContext<DAppClient>(dAppClient);

export const useBeaconClient = () => useContext(BeaconContext);

export const BeaconProvider: React.FC = ({children}) => {
    return (<BeaconContext.Provider value={dAppClient}>
        {children}
    </BeaconContext.Provider>)
}

