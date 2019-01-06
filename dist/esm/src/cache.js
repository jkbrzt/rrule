import IterResult from './iterresult';
import dateutil from './dateutil';
import { isArray } from './helpers';
var Cache = /** @class */ (function () {
    function Cache() {
        this.all = false;
        this.before = [];
        this.after = [];
        this.between = [];
    }
    /**
     * @param {String} what - all/before/after/between
     * @param {Array,Date} value - an array of dates, one date, or null
     * @param {Object?} args - _iter arguments
     */
    Cache.prototype._cacheAdd = function (what, value, args) {
        if (value) {
            value =
                value instanceof Date
                    ? dateutil.clone(value)
                    : dateutil.cloneDates(value);
        }
        if (what === 'all') {
            this.all = value;
        }
        else {
            args._value = value;
            this[what].push(args);
        }
    };
    /**
     * @return false - not in the cache
     *         null  - cached, but zero occurrences (before/after)
     *         Date  - cached (before/after)
     *         []    - cached, but zero occurrences (all/between)
     *         [Date1, DateN] - cached (all/between)
     */
    Cache.prototype._cacheGet = function (what, args) {
        var cached = false;
        var argsKeys = args ? Object.keys(args) : [];
        var findCacheDiff = function (item) {
            for (var i = 0; i < argsKeys.length; i++) {
                var key = argsKeys[i];
                if (String(args[key]) !== String(item[key])) {
                    return true;
                }
            }
            return false;
        };
        var cachedObject = this[what];
        if (what === 'all') {
            cached = this.all;
        }
        else if (isArray(cachedObject)) {
            // Let's see whether we've already called the
            // 'what' method with the same 'args'
            for (var i = 0; i < cachedObject.length; i++) {
                var item = cachedObject[i];
                if (argsKeys.length && findCacheDiff(item))
                    continue;
                cached = item._value;
                break;
            }
        }
        if (!cached && this.all) {
            // Not in the cache, but we already know all the occurrences,
            // so we can find the correct dates from the cached ones.
            var iterResult = new IterResult(what, args);
            for (var i = 0; i < this.all.length; i++) {
                if (!iterResult.accept(this.all[i]))
                    break;
            }
            cached = iterResult.getValue();
            this._cacheAdd(what, cached, args);
        }
        return isArray(cached)
            ? dateutil.cloneDates(cached)
            : cached instanceof Date
                ? dateutil.clone(cached)
                : cached;
    };
    return Cache;
}());
export { Cache };
//# sourceMappingURL=cache.js.map