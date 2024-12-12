import { CurrentPrice, DaysCandle, Market } from "./types";
export default class Upbit {
    private readonly accessKey?;
    private readonly secretKey?;
    constructor(accessKey?: string | undefined, secretKey?: string | undefined);
    static getDayCandles(market: string, count?: number, date?: string, result?: DaysCandle[]): Promise<DaysCandle[]>;
    static getCurrentPrice(markets: String[]): Promise<CurrentPrice[]>;
    static getCurrentPrices(quote_currencies: string): Promise<CurrentPrice[]>;
    static getMarkets(): Promise<Market[]>;
}
