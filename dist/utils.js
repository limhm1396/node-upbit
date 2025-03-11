"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));
exports.sleep = sleep;
//# sourceMappingURL=utils.js.map