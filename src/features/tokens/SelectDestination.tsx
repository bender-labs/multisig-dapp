import {Box, TextField} from "@material-ui/core";

type SelectDestinationProps = {
    value?: string
    onSelect: (address: string) => void
}

export default function SelectDestination({onSelect, value}: SelectDestinationProps) {
    return <Box padding={2}>
        <TextField fullWidth id="destination" label="Destination address" variant="filled" value={value}
                   onChange={(v) => onSelect(v.target.value)}/>
    </Box>
}
