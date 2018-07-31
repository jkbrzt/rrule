"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterresult_1 = require("./iterresult");
const helpers_1 = require("./helpers");
/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
class CallbackIterResult extends iterresult_1.default {
    constructor(method, args, iterator) {
        const allowedMethods = ['all', 'between'];
        if (!helpers_1.contains(allowedMethods, method)) {
            throw new Error('Invalid method "' +
                method +
                '". Only all and between works with iterator.');
        }
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