import {Token} from "../../indexer/api/types";
import bignumber from "bignumber.js";

export type TokenWithBalance = Token & { balance: bignumber }

export interface BcdApi {
    fetchAllBalancesOf(address:string): Promise<TokenWithBalance[]>
}

export interface BcdBalance {
    contract: string,
    network: string,
    token_id: number,
    symbol: string,
    name: string,
    decimals: number,
    thumbnail_uri: string,
    is_transferable: boolean,
    balance: string
}


export interface BcdBalanceResponse {
    balances: BcdBalance[],
    total: number
}
