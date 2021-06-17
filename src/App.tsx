import React, {useEffect} from 'react';
import './App.css';

import Layout from "./Layout";
import {Route, Switch, useHistory, useLocation} from "react-router-dom";
import SignaturePage from "./pages/SignaturePage";
import ClaimPage from "./pages/ClaimPage";


function App() {
    const location = useLocation();
    const history = useHistory();
    useEffect(() => {
        if (location.pathname === '/') {
            history.push('/signature')
        }
    }, [location, history])
    return (

        <Layout>
            <Switch>
                <Route path="/signature"><SignaturePage/></Route>
                <Route path="/claim"><ClaimPage/></Route>
            </Switch>
        </Layout>
    );
}

export default App;
