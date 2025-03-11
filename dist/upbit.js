"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("uuid");
const querystring_1 = require("querystring");
const crypto_1 = require("crypto");
const utils_1 = require("./utils");
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
    async getAccounts() {
        const token = (0, jsonwebtoken_1.sign)({ access_key: this.accessKey, nonce: (0, uuid_1.v4)() }, this.secretKey);
        const response = await axios_1.default.request({
            method: "GET",
            url: HOST + "/accounts",
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    }
    async invest(body) {
        const query = (0, querystring_1.encode)(body);
        const hash = (0, crypto_1.createHash)("sha512");
        const queryHash = hash.update(query, "utf-8").digest("hex");
        const token = (0, jsonwebtoken_1.sign)({
            access_key: this.accessKey,
            nonce: (0, uuid_1.v4)(),
            query_hash: queryHash,
            query_hash_alg: "SHA512",
        }, this.secretKey);
        try {
            await axios_1.default.request({
                method: "POST",
                url: HOST + "/orders",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                data: body,
            });
        }
        catch (error) {
            console.log("error:", error.response?.data);
        }
    }
    async sell(market, volume, price) {
        const ord_type = price ? "limit" : "market";
        await this.invest({
            market,
            side: "ask",
            volume: volume.toString(),
            price: price?.toString() || null,
            ord_type,
        });
    }
    async buy(market, price, volume) {
        const ord_type = volume ? "limit" : "price";
        await this.invest({
            market,
            side: "bid",
            price: price.toString(),
            volume: volume?.toString() || null,
            ord_type,
        });
    }
    static async getDayCandles(market, count = 1, date = (0, moment_1.default)().toISOString(), result = []) {
        await (0, utils_1.sleep)(0.125);
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