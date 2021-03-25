import {Card, CardContent, CardHeader, List, ListItem, ListSubheader} from "@material-ui/core";
import React from "react";

type Props = {
    address: string;
    publicKey: string;
}

const render = (p: Props) => (
    <Card>
        <CardHeader
            title="Wallet info"
        />
        <CardContent>
            <List>
                <ListSubheader>
                    Address
                </ListSubheader>
                <ListItem>
                    {p.address}
                </ListItem>
                <ListSubheader>
                    Public key
                </ListSubheader>
                <ListItem>
                    {p.publicKey}
                </ListItem></List>
        </CardContent>
    </Card>

);
export default render