import { CurrentPrice, DaysCandle, Market } from "./types";
import { Account } from "./types/account";
export default class Upbit {
    private readonly accessKey?;
    private readonly secretKey?;
    constructor(accessKey?: string | undefined, secretKey?: string | undefined);
    getAccounts(): Promise<Account[]>;
    invest(body: any): Promise<void>;
    sell(market: string, amount: number): Promise<void>;
    buy(market: string, amount: number): Promise<void>;
    static getDayCandles(market: string, count?: number, date?: string, result?: DaysCandle[]): Promise<DaysCandle[]>;
    static getCurrentPrice(markets: String[]): Promise<CurrentPrice[]>;
    static getCurrentPrices(quote_currencies: string): Promise<CurrentPrice[]>;
    static getMarkets(): Promise<Market[]>;
}
