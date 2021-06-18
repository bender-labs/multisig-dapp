import {useConfig} from "../../../runtime/config/ConfigContext";

const useIndexerApi = () => {
    const {indexerApi} = useConfig();
    return indexerApi;
}

export default useIndexerApi;
