import {Token} from "../indexer/api/types";
import {Box, Button, Checkbox, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {useCallback, useState} from "react";
import {TokenWithBalance} from "./api/types";

type SelectTokensProps = {
    tokens: Token[] | TokenWithBalance[];
    onSelect: (tokens: Token[] | TokenWithBalance[]) => void
}

export default function SelectTokens({tokens, onSelect}: SelectTokensProps) {

    const [checked, setChecked] = useState<Token[]>([]);

    const handleToggle = (value: Token) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
        onSelect(newChecked);
    };

    const selectAll = useCallback(() => {
        setChecked(tokens);
        onSelect(tokens);
    }, [tokens, onSelect])

    function hasBalance(t: Token | TokenWithBalance): t is TokenWithBalance {
        return (t as TokenWithBalance).balance !== undefined;
    }

    const tokenItem = (t: Token) => {
        const labelId = `checkbox-list-label-${t.name}`;
        return <ListItem key={t.name} onClick={handleToggle(t)}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={checked.indexOf(t) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{'aria-labelledby': labelId}}
                />
            </ListItemIcon>
            <ListItemText id={labelId} primary={t.name}
                          secondary={hasBalance(t) && t.balance.shiftedBy(-t.decimals).toString(10)}/>

        </ListItem>
    }

    return <Box padding={2}>
        <Button onClick={selectAll} variant={"outlined"}>Select all</Button>
        <List>

            {tokens.sort((a, b) => a.contract.localeCompare(b.contract)).map(tokenItem)}
        </List>
    </Box>

}
