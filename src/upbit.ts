import axios from "axios";
import moment from "moment";
import { GetCurrentPrice, GetDayCandles } from "./types";

const HOST = "https://api.upbit.com/v1";

const COMMON_CONFIG = {
  headers: { accept: "application/json" },
};

export default class Upbit {
  constructor(
    private readonly accessKey?: string,
    private readonly secretKey?: string
  ) {}

  static async getDayCandles(
    market: string,
    count = 1,
    date = moment().toISOString(),
    result: GetDayCandles[] = []
  ): Promise<GetDayCandles[]> {
    const { data } = await axios.get<GetDayCandles[]>(
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

  static async getCurrentPrice(markets: string | string[]) {
    const { data } = await axios.get<GetCurrentPrice>(
      `${HOST}/ticker?markets=${markets.toString()}`,
      COMMON_CONFIG
    );
    return data;
  }
}
