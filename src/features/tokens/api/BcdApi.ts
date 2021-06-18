import axios from "axios";
import bignumber from "bignumber.js";
import {BcdApi, BcdBalanceResponse, TokenWithBalance} from "./types";

export function create(url: string, network: string): BcdApi {
    let client = axios.create({baseURL: url});

    async function* fetchAll(address: string) {

        let offset = 0;
        let total = 0;

        const fetchOne: () => Promise<[number, TokenWithBalance[]]> = async () => {
            const {data} = await client.get<BcdBalanceResponse>(`/account/${network}/${address}/token_balances`, {
                params: {
                    offset
                }
            });
            return [data.total, data.balances.map<TokenWithBalance>(b => ({
                balance: new bignumber(b.balance),
                tokenId: '' + b.token_id,
                contract: b.contract,
                name: b.name,
                decimals: b.decimals
            }))]
        }
        let target = 0;
        do {
            const [targetFetched, page] = await fetchOne();
            target = targetFetched;
            total += page.length;
            offset += page.length;
            yield page;
        } while (total < target)
    }

    const fetchAllBalancesOf = async (address: string) => {
        const result: TokenWithBalance[] = [];
        for await(const i of fetchAll(address)) result.push(...i);
        return result.filter(t => t.name !== undefined);
    }
    return {fetchAllBalancesOf};
}
