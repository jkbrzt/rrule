"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterresult_1 = require("./iterresult");
/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
class CallbackIterResult extends iterresult_1.default {
    constructor(method, args, iterator) {
        super(method, args);
        this.iterator = iterator;
    }
    add(date) {
        if (this.iterator(date, this._result.length)) {
            this._result.push(date);
            return true;
        }
        return false;
    }
}
exports.default = CallbackIterResult;
//# sourceMappingURL=callbackiterresult.js.map