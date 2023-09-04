import axios from "axios";

export default class Upbit {
  HOST = "https://api.upbit.com/v1";

  constructor(
    private readonly accessKey?: string,
    private readonly secretKey?: string
  ) {}

  static async getCurrentPrice(markets: string | string[]) {
    const resp = await axios.get(
      `https://api.upbit.com/v1/ticker?markets=${markets.toString()}`,
      {
        headers: { accept: "application/json" },
      }
    );
    return resp.data;
  }
}
