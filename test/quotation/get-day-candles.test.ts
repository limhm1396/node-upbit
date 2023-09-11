import axios from "axios";
import Upbit from "../../src";

describe("getDayCandles", () => {
  beforeEach(() => {
    jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({ data: [{ market: "KRW-BTC" }] })
      .mockResolvedValueOnce({ data: [{ market: "KRW-BTC" }] })
      .mockResolvedValue({ data: [] });
  });

  it("will pass with count that is 1 ", async () => {
    const data = await Upbit.getDayCandles("KRW-BTC", 1);
    expect(data.length).toBe(1);
    expect(axios.get).toBeCalledTimes(1);
  });

  it("will pass with count that is 2", async () => {
    const data = await Upbit.getDayCandles("KRW-BTC", 2);
    expect(data.length).toBe(2);
    expect(axios.get).toBeCalledTimes(2);
  });
});
