"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const HOST = "https://api.upbit.com/v1";
const COMMON_CONFIG = {
    headers: { accept: "application/json" },
};
class Upbit {
    accessKey;
    secretKey;
    constructor(accessKey, secretKey) {
        this.accessKey = accessKey;
        this.secretKey = secretKey;
    }
    static async getDayCandles(market, count = 1, date = (0, moment_1.default)().toISOString(), result = []) {
        const { data } = await axios_1.default.get(`${HOST}/candles/days?market=${market}&to=${date}&count=${count}`, COMMON_CONFIG);
        const lastCandle = data.at(-1);
        const remainCount = count - data.length;
        const stack = [...result, ...data];
        if (!lastCandle || remainCount < 1) {
            return stack;
        }
        const previousDate = (0, moment_1.default)(lastCandle.candle_date_time_kst)
            .subtract(1, "days")
            .toISOString();
        return this.getDayCandles(market, remainCount, previousDate, stack);
    }
    static async getCurrentPrice(markets) {
        const { data } = await axios_1.default.get(`${HOST}/ticker?markets=${markets.join(",")}`, COMMON_CONFIG);
        return data;
    }
    static async getCurrentPrices(quote_currencies) {
        const { data } = await axios_1.default.get(`${HOST}/ticker/all?quote_currencies=${quote_currencies}`, COMMON_CONFIG);
        return data;
    }
    static async getMarkets() {
        const { data } = await axios_1.default.get(`${HOST}/market/all`, COMMON_CONFIG);
        return data;
    }
}
exports.default = Upbit;
//# sourceMappingURL=upbit.js.map