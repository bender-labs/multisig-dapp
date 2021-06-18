import {useConfig} from "../../../runtime/config/ConfigContext";

export default function useBcdApi() {
    const {bcdApi} = useConfig();
    return bcdApi;
}
