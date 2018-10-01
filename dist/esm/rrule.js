import dateutil from './dateutil';
import Iterinfo from './iterinfo';
import { pymod, notEmpty, includes, isPresent } from './helpers';
import IterResult from './iterresult';
import CallbackIterResult from './callbackiterresult';
import { Frequency } from './types';
import { parseOptions, initializeOptions, buildTimeset } from './parseoptions';
import { parseString } from './parsestring';
import { optionsToString } from './optionstostring';
import { Cache } from './cache';
import { Weekday } from './weekday';
import { DateWithZone } from './datewithzone';
var getnlp = function () {
    // Lazy, runtime import to avoid circular refs.
    if (!getnlp._nlp) {
        getnlp._nlp = require('./nlp');
    }
    return getnlp._nlp;
};
// =============================================================================
// RRule
// =============================================================================
export var Days = {
    MO: new Weekday(0),
    TU: new Weekday(1),
    WE: new Weekday(2),
    TH: new Weekday(3),
    FR: new Weekday(4),
    SA: new Weekday(5),
    SU: new Weekday(6)
};
export var DEFAULT_OPTIONS = {
    freq: Frequency.YEARLY,
    dtstart: null,
    interval: 1,
    wkst: Days.MO,
    count: null,
    until: null,
    tzid: null,
    bysetpos: null,
    bymonth: null,
    bymonthday: null,
    bynmonthday: null,
    byyearday: null,
    byweekno: null,
    byweekday: null,
    bynweekday: null,
    byhour: null,
    byminute: null,
    bysecond: null,
    byeaster: null
};
export var defaultKeys = Object.keys(DEFAULT_OPTIONS);
/**
 *
 * @param {Options?} options - see <http://labix.org/python-dateutil/#head-cf004ee9a75592797e076752b2a889c10f445418>
 *        The only required option is `freq`, one of RRule.YEARLY, RRule.MONTHLY, ...
 * @constructor
 */
var RRule = /** @class */ (function () {
    function RRule(options, noCache) {
        if (options === void 0) { options = {}; }
        if (noCache === void 0) { noCache = false; }
        // RFC string
        this._string = null;
        this._cache = noCache ? null : new Cache();
        // used by toString()
        this.origOptions = initializeOptions(options);
        var parsedOptions = parseOptions(options).parsedOptions;
        this.options = parsedOptions;
    }
    RRule.parseText = function (text, language) {
        return getnlp().parseText(text, language);
    };
    RRule.fromText = function (text, language) {
        return getnlp().fromText(text, language);
    };
    RRule.fromString = function (str) {
        return new RRule(RRule.parseString(str) || undefined);
    };
    RRule.prototype._cacheGet = function (what, args) {
        if (!this._cache)
            return false;
        return this._cache._cacheGet(what, args);
    };
    RRule.prototype._cacheAdd = function (what, value, args) {
        if (!this._cache)
            return;
        return this._cache._cacheAdd(what, value, args);
    };
    /**
     * @param {Function} iterator - optional function that will be called
     *                   on each date that is added. It can return false
     *                   to stop the iteration.
     * @return Array containing all recurrences.
     */
    RRule.prototype.all = function (iterator) {
        if (iterator) {
            return this._iter(new CallbackIterResult('all', {}, iterator), this.options);
        }
        else {
            var result = this._cacheGet('all');
            if (result === false) {
                result = this._iter(new IterResult('all', {}), this.options);
                this._cacheAdd('all', result);
            }
            return result;
        }
    };
    /**
     * Returns all the occurrences of the rrule between after and before.
     * The inc keyword defines what happens if after and/or before are
     * themselves occurrences. With inc == True, they will be included in the
     * list, if they are found in the recurrence set.
     * @return Array
     */
    RRule.prototype.between = function (after, before, inc, iterator) {
        if (inc === void 0) { inc = false; }
        if (!dateutil.isValidDate(after) || !dateutil.isValidDate(before))
            throw new Error('Invalid date passed in to RRule.between');
        var args = {
            before: before,
            after: after,
            inc: inc
        };
        if (iterator) {
            return this._iter(new CallbackIterResult('between', args, iterator), this.options);
        }
        var result = this._cacheGet('between', args);
        if (result === false) {
            result = this._iter(new IterResult('between', args), this.options);
            this._cacheAdd('between', result, args);
        }
        return result;
    };
    /**
     * Returns the last recurrence before the given datetime instance.
     * The inc keyword defines what happens if dt is an occurrence.
     * With inc == True, if dt itself is an occurrence, it will be returned.
     * @return Date or null
     */
    RRule.prototype.before = function (dt, inc) {
        if (inc === void 0) { inc = false; }
        if (!dateutil.isValidDate(dt))
            throw new Error('Invalid date passed in to RRule.before');
        var args = { dt: dt, inc: inc };
        var result = this._cacheGet('before', args);
        if (result === false) {
            result = this._iter(new IterResult('before', args), this.options);
            this._cacheAdd('before', result, args);
        }
        return result;
    };
    /**
     * Returns the first recurrence after the given datetime instance.
     * The inc keyword defines what happens if dt is an occurrence.
     * With inc == True, if dt itself is an occurrence, it will be returned.
     * @return Date or null
     */
    RRule.prototype.after = function (dt, inc) {
        if (inc === void 0) { inc = false; }
        if (!dateutil.isValidDate(dt))
            throw new Error('Invalid date passed in to RRule.after');
        var args = { dt: dt, inc: inc };
        var result = this._cacheGet('after', args);
        if (result === false) {
            result = this._iter(new IterResult('after', args), this.options);
            this._cacheAdd('after', result, args);
        }
        return result;
    };
    /**
     * Returns the number of recurrences in this set. It will have go trough
     * the whole recurrence, if this hasn't been done before.
     */
    RRule.prototype.count = function () {
        return this.all().length;
    };
    /**
     * Converts the rrule into its string representation
     * @see <http://www.ietf.org/rfc/rfc2445.txt>
     * @return String
     */
    RRule.prototype.toString = function () {
        return optionsToString(this.origOptions);
    };
    /**
     * Will convert all rules described in nlp:ToText
     * to text.
     */
    RRule.prototype.toText = function (gettext, language) {
        return getnlp().toText(this, gettext, language);
    };
    RRule.prototype.isFullyConvertibleToText = function () {
        return getnlp().isFullyConvertible(this);
    };
    /**
     * @return a RRule instance with the same freq and options
     *          as this one (cache is not cloned)
     */
    RRule.prototype.clone = function () {
        return new RRule(this.origOptions);
    };
    RRule.prototype._iter = function (iterResult, options) {
        /* Since JavaScript doesn't have the python's yield operator (<1.7),
            we use the IterResult object that tells us when to stop iterating.
    
        */
        var _a, _b;
        // Some local variables to speed things up a bit
        var dtstart = options.dtstart, freq = options.freq, interval = options.interval, wkst = options.wkst, until = options.until, bymonth = options.bymonth, byweekno = options.byweekno, byyearday = options.byyearday, byweekday = options.byweekday, byeaster = options.byeaster, bymonthday = options.bymonthday, bynmonthday = options.bynmonthday, bysetpos = options.bysetpos, byhour = options.byhour, byminute = options.byminute, bysecond = options.bysecond;
        var date = new dateutil.DateTime(dtstart.getUTCFullYear(), dtstart.getUTCMonth() + 1, dtstart.getUTCDate(), dtstart.getUTCHours(), dtstart.getUTCMinutes(), dtstart.getUTCSeconds(), dtstart.valueOf() % 1000);
        var ii = new Iterinfo(this);
        ii.rebuild(date.year, date.month);
        var getdayset = (_a = {},
            _a[RRule.YEARLY] = ii.ydayset,
            _a[RRule.MONTHLY] = ii.mdayset,
            _a[RRule.WEEKLY] = ii.wdayset,
            _a[RRule.DAILY] = ii.ddayset,
            _a[RRule.HOURLY] = ii.ddayset,
            _a[RRule.MINUTELY] = ii.ddayset,
            _a[RRule.SECONDLY] = ii.ddayset,
            _a)[freq];
        var timeset;
        var gettimeset;
        if (freq < RRule.HOURLY) {
            timeset = buildTimeset(options);
        }
        else {
            gettimeset = (_b = {},
                _b[RRule.HOURLY] = ii.htimeset,
                _b[RRule.MINUTELY] = ii.mtimeset,
                _b[RRule.SECONDLY] = ii.stimeset,
                _b)[freq];
            if ((freq >= RRule.HOURLY &&
                notEmpty(byhour) &&
                !includes(byhour, date.hour)) ||
                (freq >= RRule.MINUTELY &&
                    notEmpty(byminute) &&
                    !includes(byminute, date.minute)) ||
                (freq >= RRule.SECONDLY &&
                    notEmpty(bysecond) &&
                    !includes(bysecond, date.second))) {
                timeset = [];
            }
            else {
                timeset = gettimeset.call(ii, date.hour, date.minute, date.second, date.millisecond);
            }
        }
        var currentDay;
        var count = options.count;
        var pos;
        while (true) {
            // Get dayset with the right frequency
            var _c = getdayset.call(ii, date.year, date.month, date.day), dayset = _c[0], start = _c[1], end = _c[2];
            // Do the "hard" work ;-)
            var filtered = false;
            for (var dayCounter = start; dayCounter < end; dayCounter++) {
                currentDay = dayset[dayCounter];
                filtered = isFiltered(bymonth, ii, currentDay, byweekno, byweekday, byeaster, bymonthday, bynmonthday, byyearday);
                if (filtered)
                    dayset[currentDay] = null;
            }
            // Output results
            if (notEmpty(bysetpos) && notEmpty(timeset)) {
                var daypos = void 0;
                var timepos = void 0;
                var poslist = [];
                for (var j = 0; j < bysetpos.length; j++) {
                    pos = bysetpos[j];
                    if (pos < 0) {
                        daypos = Math.floor(pos / timeset.length);
                        timepos = pymod(pos, timeset.length);
                    }
                    else {
                        daypos = Math.floor((pos - 1) / timeset.length);
                        timepos = pymod(pos - 1, timeset.length);
                    }
                    var tmp = [];
                    for (var k = start; k < end; k++) {
                        var val = dayset[k];
                        if (!isPresent(val))
                            continue;
                        tmp.push(val);
                    }
                    var i = void 0;
                    if (daypos < 0) {
                        // we're trying to emulate python's aList[-n]
                        i = tmp.slice(daypos)[0];
                    }
                    else {
                        i = tmp[daypos];
                    }
                    var time = timeset[timepos];
                    var date_1 = dateutil.fromOrdinal(ii.yearordinal + i);
                    var res = dateutil.combine(date_1, time);
                    // XXX: can this ever be in the array?
                    // - compare the actual date instead?
                    if (!includes(poslist, res))
                        poslist.push(res);
                }
                dateutil.sort(poslist);
                for (var j = 0; j < poslist.length; j++) {
                    var res = poslist[j];
                    if (until && res > until) {
                        return emitResult(iterResult);
                    }
                    if (res >= dtstart) {
                        var rezonedDate = rezoneIfNeeded(res, options);
                        if (!iterResult.accept(rezonedDate)) {
                            return emitResult(iterResult);
                        }
                        if (count) {
                            --count;
                            if (!count) {
                                return emitResult(iterResult);
                            }
                        }
                    }
                }
            }
            else {
                for (var j = start; j < end; j++) {
                    currentDay = dayset[j];
                    if (!isPresent(currentDay)) {
                        continue;
                    }
                    var date_2 = dateutil.fromOrdinal(ii.yearordinal + currentDay);
                    for (var k = 0; k < timeset.length; k++) {
                        var time = timeset[k];
                        var res = dateutil.combine(date_2, time);
                        if (until && res > until) {
                            return emitResult(iterResult);
                        }
                        if (res >= dtstart) {
                            var rezonedDate = rezoneIfNeeded(res, options);
                            if (!iterResult.accept(rezonedDate)) {
                                return emitResult(iterResult);
                            }
                            if (count) {
                                --count;
                                if (!count) {
                                    return emitResult(iterResult);
                                }
                            }
                        }
                    }
                }
            }
            // Handle frequency and interval
            if (freq === RRule.YEARLY) {
                date.addYears(interval);
            }
            else if (freq === RRule.MONTHLY) {
                date.addMonths(interval);
            }
            else if (freq === RRule.WEEKLY) {
                date.addWeekly(interval, wkst);
            }
            else if (freq === RRule.DAILY) {
                date.addDaily(interval);
            }
            else if (freq === RRule.HOURLY) {
                date.addHours(interval, filtered, byhour);
                // @ts-ignore
                timeset = gettimeset.call(ii, date.hour, date.minute, date.second);
            }
            else if (freq === RRule.MINUTELY) {
                if (date.addMinutes(interval, filtered, byhour, byminute)) {
                    filtered = false;
                }
                // @ts-ignore
                timeset = gettimeset.call(ii, date.hour, date.minute, date.second);
            }
            else if (freq === RRule.SECONDLY) {
                if (date.addSeconds(interval, filtered, byhour, byminute, bysecond)) {
                    filtered = false;
                }
                // @ts-ignore
                timeset = gettimeset.call(ii, date.hour, date.minute, date.second);
            }
            if (date.year > dateutil.MAXYEAR) {
                return emitResult(iterResult);
            }
            ii.rebuild(date.year, date.month);
        }
    };
    // RRule class 'constants'
    RRule.FREQUENCIES = [
        'YEARLY',
        'MONTHLY',
        'WEEKLY',
        'DAILY',
        'HOURLY',
        'MINUTELY',
        'SECONDLY'
    ];
    RRule.YEARLY = Frequency.YEARLY;
    RRule.MONTHLY = Frequency.MONTHLY;
    RRule.WEEKLY = Frequency.WEEKLY;
    RRule.DAILY = Frequency.DAILY;
    RRule.HOURLY = Frequency.HOURLY;
    RRule.MINUTELY = Frequency.MINUTELY;
    RRule.SECONDLY = Frequency.SECONDLY;
    RRule.MO = Days.MO;
    RRule.TU = Days.TU;
    RRule.WE = Days.WE;
    RRule.TH = Days.TH;
    RRule.FR = Days.FR;
    RRule.SA = Days.SA;
    RRule.SU = Days.SU;
    RRule.parseString = parseString;
    RRule.optionsToString = optionsToString;
    return RRule;
}());
export default RRule;
function isFiltered(bymonth, ii, currentDay, byweekno, byweekday, byeaster, bymonthday, bynmonthday, byyearday) {
    return ((notEmpty(bymonth) && !includes(bymonth, ii.mmask[currentDay])) ||
        (notEmpty(byweekno) && !ii.wnomask[currentDay]) ||
        (notEmpty(byweekday) && !includes(byweekday, ii.wdaymask[currentDay])) ||
        (notEmpty(ii.nwdaymask) && !ii.nwdaymask[currentDay]) ||
        (byeaster !== null && !includes(ii.eastermask, currentDay)) ||
        ((notEmpty(bymonthday) || notEmpty(bynmonthday)) &&
            !includes(bymonthday, ii.mdaymask[currentDay]) &&
            !includes(bynmonthday, ii.nmdaymask[currentDay])) ||
        (notEmpty(byyearday) &&
            ((currentDay < ii.yearlen &&
                !includes(byyearday, currentDay + 1) &&
                !includes(byyearday, -ii.yearlen + currentDay)) ||
                (currentDay >= ii.yearlen &&
                    !includes(byyearday, currentDay + 1 - ii.yearlen) &&
                    !includes(byyearday, -ii.nextyearlen + currentDay - ii.yearlen)))));
}
function rezoneIfNeeded(date, options) {
    return new DateWithZone(date, options.tzid).rezonedDate();
}
function emitResult(iterResult) {
    return iterResult.getValue();
}
//# sourceMappingURL=rrule.js.map