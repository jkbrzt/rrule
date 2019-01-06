var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import IterResult from './iterresult';
/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
var CallbackIterResult = /** @class */ (function (_super) {
    __extends(CallbackIterResult, _super);
    function CallbackIterResult(method, args, iterator) {
        var _this = _super.call(this, method, args) || this;
        _this.iterator = iterator;
        return _this;
    }
    CallbackIterResult.prototype.add = function (date) {
        if (this.iterator(date, this._result.length)) {
            this._result.push(date);
            return true;
        }
        return false;
    };
    return CallbackIterResult;
}(IterResult));
export default CallbackIterResult;
//# sourceMappingURL=callbackiterresult.js.map