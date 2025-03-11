import axios from "axios";
import moment from "moment";
import { CurrentPrice, DaysCandle, Market } from "./types";
import { sign } from "jsonwebtoken";
import { v4 } from "uuid";
import { Account } from "./types/account";
import { encode } from "querystring";
import { createHash } from "crypto";
import { sleep } from "./utils";

const HOST = "https://api.upbit.com/v1";

const COMMON_CONFIG = {
  headers: { accept: "application/json" },
};

export default class Upbit {
  constructor(
    private readonly accessKey?: string,
    private readonly secretKey?: string
  ) {}

  async getAccounts(): Promise<Account[]> {
    const token = sign(
      { access_key: this.accessKey, nonce: v4() },
      this.secretKey!
    );

    const response = await axios.request({
      method: "GET",
      url: HOST + "/accounts",
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  }

  async invest(body: any) {
    const query = encode(body);
    const hash = createHash("sha512");
    const queryHash = hash.update(query, "utf-8").digest("hex");

    const token = sign(
      {
        access_key: this.accessKey,
        nonce: v4(),
        query_hash: queryHash,
        query_hash_alg: "SHA512",
      },
      this.secretKey!
    );

    try {
      await axios.request({
        method: "POST",
        url: HOST + "/orders",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: body,
      });
    } catch (error: any) {
      console.log("error:", error.response?.data);
    }
  }

  async sell(market: string, volume: number, price?: number) {
    const ord_type = price ? "limit" : "market";
    await this.invest({
      market,
      side: "ask",
      volume: volume.toString(),
      price: price?.toString() || null,
      ord_type,
    });
  }

  async buy(market: string, price: number, volume?: number) {
    const ord_type = volume ? "limit" : "price";
    await this.invest({
      market,
      side: "bid",
      price: price.toString(),
      volume: volume?.toString() || null,
      ord_type,
    });
  }

  static async getDayCandles(
    market: string,
    count = 1,
    date = moment().toISOString(),
    result: DaysCandle[] = []
  ): Promise<DaysCandle[]> {
    await sleep(0.125);

    const { data } = await axios.get<DaysCandle[]>(
      `${HOST}/candles/days?market=${market}&to=${date}&count=${count}`,
      COMMON_CONFIG
    );

    const lastCandle = data.at(-1);

    const remainCount = count - data.length;

    const stack = [...result, ...data];

    if (!lastCandle || remainCount < 1) {
      return stack;
    }

    const previousDate = moment(lastCandle.candle_date_time_kst)
      .subtract(1, "days")
      .toISOString();

    return this.getDayCandles(market, remainCount, previousDate, stack);
  }

  static async getCurrentPrice(markets: String[]) {
    const { data } = await axios.get<CurrentPrice[]>(
      `${HOST}/ticker?markets=${markets.join(",")}`,
      COMMON_CONFIG
    );
    return data;
  }

  static async getCurrentPrices(quote_currencies: string) {
    const { data } = await axios.get<CurrentPrice[]>(
      `${HOST}/ticker/all?quote_currencies=${quote_currencies}`,
      COMMON_CONFIG
    );
    return data;
  }

  static async getMarkets() {
    const { data } = await axios.get<Market[]>(
      `${HOST}/market/all`,
      COMMON_CONFIG
    );
    return data;
  }
}
