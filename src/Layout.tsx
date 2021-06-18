import React, {PropsWithChildren} from 'react';
import {Container, Grid, Paper} from '@material-ui/core';
import TopNavigation from './features/navigation/TopNavigation';
import {makeStyles} from '@material-ui/core/styles';
import SideNavigation from './features/navigation/SideNavigation';

const useStyles = makeStyles(() => ({
    container: {
        padding: 20,
    }
}));

const Layout = ({children}: PropsWithChildren<{}>) => {
    const classes = useStyles();

    return (
        <Container maxWidth="xl" className={classes.container}>
            <Grid container direction="row" spacing={3} alignItems="flex-start">
                <Grid item xs={12}>
                    <TopNavigation/>
                </Grid>
                <Grid item xs={3}>
                    <Paper>
                        <SideNavigation/>
                    </Paper>
                </Grid>
                <Grid item xs={9}>
                    {children}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Layout;
