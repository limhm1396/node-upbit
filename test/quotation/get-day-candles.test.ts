import axios from "axios";
import Upbit from "../../src";

describe("getDayCandles", () => {
  beforeEach(() => {
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({
        data: [
          {
            market: "KRW-BTC",
            candle_date_time_utc: "2018-04-18T00:00:00",
            candle_date_time_kst: "2018-04-18T09:00:00",
            opening_price: 8450000,
            high_price: 8679000,
            low_price: 8445000,
            trade_price: 8626000,
            timestamp: 1524046650532,
            candle_acc_trade_price: 107184005903.68721,
            candle_acc_trade_volume: 12505.93101659,
            prev_closing_price: 8450000,
            change_price: 176000,
            change_rate: 0.0208284024,
          },
        ],
      })
      .mockResolvedValue({ data: [] });
  });

  it("will pass", async () => {
    const data = await Upbit.getDayCandles("KRW-BTC", 2);
    expect(data.length).toBe(1);
    expect(data).toMatchSnapshot();
  });
});
