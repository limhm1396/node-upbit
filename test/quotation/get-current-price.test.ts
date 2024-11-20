import axios from "axios";
import Upbit from "../../src";

describe("getCurrentPrice", () => {
  beforeEach(() => {
    jest.spyOn(axios, "get").mockResolvedValue({
      data: [
        {
          market: "KRW-BTC",
          trade_date: "20180418",
          trade_time: "102340",
          trade_date_kst: "20180418",
          trade_time_kst: "192340",
          trade_timestamp: 1524047020000,
          opening_price: 8450000,
          high_price: 8679000,
          low_price: 8445000,
          trade_price: 8621000,
          prev_closing_price: 8450000,
          change: "RISE",
          change_price: 171000,
          change_rate: 0.0202366864,
          signed_change_price: 171000,
          signed_change_rate: 0.0202366864,
          trade_volume: 0.02467802,
          acc_trade_price: 108024804862.58253,
          acc_trade_price_24h: 232702901371.09308,
          acc_trade_volume: 12603.53386105,
          acc_trade_volume_24h: 27181.31137002,
          highest_52_week_price: 28885000,
          highest_52_week_date: "2018-01-06",
          lowest_52_week_price: 4175000,
          lowest_52_week_date: "2017-09-25",
          timestamp: 1524047026072,
        },
      ],
    });
  });

  it("will pass", async () => {
    const data = await Upbit.getCurrentPrice(["KRW-BTC"]);
    expect(data).toMatchSnapshot();
  });
});
