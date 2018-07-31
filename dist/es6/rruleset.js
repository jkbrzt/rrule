"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rrule_1 = require("./rrule");
const dateutil_1 = require("./dateutil");
const helpers_1 = require("./helpers");
/**
 *
 * @param {Boolean?} noCache
 *  The same stratagy as RRule on cache, default to false
 * @constructor
 */
class RRuleSet extends rrule_1.default {
    constructor(noCache = false) {
        super({}, noCache);
        this._rrule = [];
        this._rdate = [];
        this._exrule = [];
        this._exdate = [];
    }
    /**
     * @param {RRule}
     */
    rrule(rrule) {
        if (!(rrule instanceof rrule_1.default)) {
            throw new TypeError(String(rrule) + ' is not RRule instance');
        }
        if (!helpers_1.contains(this._rrule.map(String), String(rrule))) {
            this._rrule.push(rrule);
        }
    }
    /**
     * @param {Date}
     */
    rdate(date) {
        if (!(date instanceof Date)) {
            throw new TypeError(String(date) + ' is not Date instance');
        }
        if (!helpers_1.contains(this._rdate.map(Number), Number(date))) {
            this._rdate.push(date);
            dateutil_1.default.sort(this._rdate);
        }
    }
    /**
     * @param {RRule}
     */
    exrule(rrule) {
        if (!(rrule instanceof rrule_1.default)) {
            throw new TypeError(String(rrule) + ' is not RRule instance');
        }
        if (!helpers_1.contains(this._exrule.map(String), String(rrule))) {
            this._exrule.push(rrule);
        }
    }
    /**
     * @param {Date}
     */
    exdate(date) {
        if (!(date instanceof Date)) {
            throw new TypeError(String(date) + ' is not Date instance');
        }
        if (!helpers_1.contains(this._exdate.map(Number), Number(date))) {
            this._exdate.push(date);
            dateutil_1.default.sort(this._exdate);
        }
    }
    valueOf() {
        const result = [];
        if (this._rrule.length) {
            this._rrule.forEach(function (rrule) {
                result.push('RRULE:' + rrule);
            });
        }
        if (this._rdate.length) {
            result.push('RDATE:' +
                this._rdate
                    .map(function (rdate) {
                    return dateutil_1.default.timeToUntilString(rdate.valueOf());
                })
                    .join(','));
        }
        if (this._exrule.length) {
            this._exrule.forEach(function (exrule) {
                result.push('EXRULE:' + exrule);
            });
        }
        if (this._exdate.length) {
            result.push('EXDATE:' +
                this._exdate
                    .map(function (exdate) {
                    return dateutil_1.default.timeToUntilString(exdate.valueOf());
                })
                    .join(','));
        }
        return result;
    }
    /**
     * to generate recurrence field sush as:
     *   ["RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU;DTSTART=19970902T010000Z","RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH;DTSTART=19970902T010000Z"]
     */
    toString() {
        return JSON.stringify(this.valueOf());
    }
    _iter(iterResult) {
        const _exdateHash = {};
        const _exrule = this._exrule;
        const _accept = iterResult.accept;
        function evalExdate(after, before) {
            _exrule.forEach(function (rrule) {
                rrule.between(after, before, true).forEach(function (date) {
                    _exdateHash[Number(date)] = true;
                });
            });
        }
        this._exdate.forEach(function (date) {
            _exdateHash[Number(date)] = true;
        });
        iterResult.accept = function (date) {
            const dt = Number(date);
            if (!_exdateHash[dt]) {
                evalExdate(new Date(dt - 1), new Date(dt + 1));
                if (!_exdateHash[dt]) {
                    _exdateHash[dt] = true;
                    return _accept.call(this, date);
                }
            }
            return true;
        };
        if (iterResult.method === 'between') {
            evalExdate(iterResult.args.after, iterResult.args.before);
            iterResult.accept = function (date) {
                const dt = Number(date);
                if (!_exdateHash[dt]) {
                    _exdateHash[dt] = true;
                    return _accept.call(this, date);
                }
                return true;
            };
        }
        for (let i = 0; i < this._rdate.length; i++) {
            if (!iterResult.accept(new Date(this._rdate[i].valueOf())))
                break;
        }
        this._rrule.forEach(function (rrule) {
            rrule._iter(iterResult);
        });
        const res = iterResult._result;
        dateutil_1.default.sort(res);
        switch (iterResult.method) {
            case 'all':
            case 'between':
                return res;
            case 'before':
                return (res.length && res[res.length - 1]) || null;
            case 'after':
                return (res.length && res[0]) || null;
            default:
                return null;
        }
    }
    /**
     * Create a new RRuleSet Object completely base on current instance
     */
    clone() {
        const rrs = new RRuleSet(!!this._cache);
        let i;
        for (i = 0; i < this._rrule.length; i++) {
            rrs.rrule(this._rrule[i].clone());
        }
        for (i = 0; i < this._rdate.length; i++) {
            rrs.rdate(new Date(this._rdate[i].valueOf()));
        }
        for (i = 0; i < this._exrule.length; i++) {
            rrs.exrule(this._exrule[i].clone());
        }
        for (i = 0; i < this._exdate.length; i++) {
            rrs.exdate(new Date(this._exdate[i].valueOf()));
        }
        return rrs;
    }
}
exports.default = RRuleSet;
//# sourceMappingURL=rruleset.js.map