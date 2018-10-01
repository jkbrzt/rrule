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
import RRule from './rrule';
import dateutil from './dateutil';
import { includes } from './helpers';
import { iterSet } from './iterset';
var RRuleSet = /** @class */ (function (_super) {
    __extends(RRuleSet, _super);
    /**
     *
     * @param {Boolean?} noCache
     *  The same stratagy as RRule on cache, default to false
     * @constructor
     */
    function RRuleSet(noCache) {
        if (noCache === void 0) { noCache = false; }
        var _this = _super.call(this, {}, noCache) || this;
        _this._rrule = [];
        _this._rdate = [];
        _this._exrule = [];
        _this._exdate = [];
        return _this;
    }
    RRuleSet.prototype.tzid = function (tzid) {
        if (tzid !== undefined) {
            this._tzid = tzid;
        }
        if (this._tzid !== undefined) {
            return this._tzid;
        }
        for (var i = 0; i < this._rrule.length; i++) {
            var tzid_1 = this._rrule[i].origOptions.tzid;
            if (tzid_1) {
                return tzid_1;
            }
        }
        return undefined;
    };
    RRuleSet.prototype._iter = function (iterResult) {
        return iterSet(iterResult, this._rrule, this._exrule, this._rdate, this._exdate, this.tzid());
    };
    /**
     * Adds an RRule to the set
     *
     * @param {RRule}
     */
    RRuleSet.prototype.rrule = function (rrule) {
        if (!(rrule instanceof RRule)) {
            throw new TypeError(String(rrule) + ' is not RRule instance');
        }
        if (!includes(this._rrule.map(String), String(rrule))) {
            this._rrule.push(rrule);
        }
    };
    /**
     * Adds an EXRULE to the set
     *
     * @param {RRule}
     */
    RRuleSet.prototype.exrule = function (rrule) {
        if (!(rrule instanceof RRule)) {
            throw new TypeError(String(rrule) + ' is not RRule instance');
        }
        if (!includes(this._exrule.map(String), String(rrule))) {
            this._exrule.push(rrule);
        }
    };
    /**
     * Adds an RDate to the set
     *
     * @param {Date}
     */
    RRuleSet.prototype.rdate = function (date) {
        if (!(date instanceof Date)) {
            throw new TypeError(String(date) + ' is not Date instance');
        }
        if (!includes(this._rdate.map(Number), Number(date))) {
            this._rdate.push(date);
            dateutil.sort(this._rdate);
        }
    };
    /**
     * Adds an EXDATE to the set
     *
     * @param {Date}
     */
    RRuleSet.prototype.exdate = function (date) {
        if (!(date instanceof Date)) {
            throw new TypeError(String(date) + ' is not Date instance');
        }
        if (!includes(this._exdate.map(Number), Number(date))) {
            this._exdate.push(date);
            dateutil.sort(this._exdate);
        }
    };
    RRuleSet.prototype.rdatesToString = function (param, rdates) {
        var tzid = this.tzid();
        var isUTC = !tzid || tzid.toUpperCase() === 'UTC';
        var header = isUTC ? param + ":" : param + ";TZID=" + tzid + ":";
        var dateString = rdates
            .map(function (rdate) { return dateutil.timeToUntilString(rdate.valueOf(), isUTC); })
            .join(',');
        return "" + header + dateString;
    };
    RRuleSet.prototype.valueOf = function () {
        var result = [];
        this._rrule.forEach(function (rrule) {
            result = result.concat(rrule.toString().split('\n'));
        });
        if (this._rdate.length) {
            result.push(this.rdatesToString('RDATE', this._rdate));
        }
        this._exrule.forEach(function (exrule) {
            result = result.concat(exrule.toString().split('\n')
                .map(function (line) { return line.replace(/^RRULE:/, 'EXRULE:'); })
                .filter(function (line) { return !/^DTSTART/.test(line); }));
        });
        if (this._exdate.length) {
            result.push(this.rdatesToString('EXDATE', this._exdate));
        }
        return result;
    };
    /**
     * to generate recurrence field such as:
     *   DTSTART:19970902T010000Z
     *   RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU
     *   RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH
     */
    RRuleSet.prototype.toString = function () {
        return this.valueOf().join('\n');
    };
    /**
     * Create a new RRuleSet Object completely base on current instance
     */
    RRuleSet.prototype.clone = function () {
        var rrs = new RRuleSet(!!this._cache);
        this._rrule.forEach(function (rule) { return rrs.rrule(rule.clone()); });
        this._exrule.forEach(function (rule) { return rrs.exrule(rule.clone()); });
        this._rdate.forEach(function (date) { return rrs.rdate(new Date(date.getTime())); });
        this._exdate.forEach(function (date) { return rrs.exdate(new Date(date.getTime())); });
        return rrs;
    };
    return RRuleSet;
}(RRule));
export default RRuleSet;
//# sourceMappingURL=rruleset.js.map