import {useConfig} from "../../../runtime/config/ConfigContext";

const useIndexerApi = () => {
    const config = useConfig();
    return config.indexerApi;
}

export default useIndexerApi;
