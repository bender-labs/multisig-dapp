import React from 'react';
import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';

import CreateIcon from '@material-ui/icons/Create';
import TransitEnterexitIcon from '@material-ui/icons/TransitEnterexit';
import {Link as RouterLink} from 'react-router-dom';

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    secondary?: string;
    to: string;
}

export function ListItemLink(props: ListItemLinkProps) {
    const {icon, primary, secondary, to} = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef<any,
                Omit<React.ComponentProps<typeof RouterLink>, 'to'>>((itemProps, ref) => <RouterLink to={to}
                                                                                                     ref={ref} {...itemProps} />),
        [to]
    );

    return (
        <ListItem button component={renderLink}>
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            <ListItemText primary={primary} secondary={secondary}/>
        </ListItem>
    );
}


const SideNavigation = () => {

    return (
        <List component="nav" aria-label="main mailbox folders">
            <ListItemLink
                to="/signature"
                primary="Signature"
                icon={<CreateIcon/>}
            />

            <ListItemLink
                to="/claim"
                primary="Claim"
                icon={<TransitEnterexitIcon/>}
            />

        </List>
    );
};

export default SideNavigation;
