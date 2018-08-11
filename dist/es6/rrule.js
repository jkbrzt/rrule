"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weekday_1 = require("./weekday");
const dateutil_1 = require("./dateutil");
const iterinfo_1 = require("./iterinfo");
const helpers_1 = require("./helpers");
const iterresult_1 = require("./iterresult");
const callbackiterresult_1 = require("./callbackiterresult");
const types_1 = require("./types");
const parseoptions_1 = require("./parseoptions");
const parsestring_1 = require("./parsestring");
const getnlp = function () {
    // Lazy, runtime import to avoid circular refs.
    if (!getnlp._nlp) {
        getnlp._nlp = require('./nlp');
    }
    return getnlp._nlp;
};
// =============================================================================
// RRule
// =============================================================================
exports.DEFAULT_OPTIONS = {
    freq: types_1.Frequency.YEARLY,
    dtstart: null,
    interval: 1,
    wkst: types_1.Days.MO,
    count: null,
    until: null,
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
exports.defaultKeys = Object.keys(exports.DEFAULT_OPTIONS);
/**
 *
 * @param {Options?} options - see <http://labix.org/python-dateutil/#head-cf004ee9a75592797e076752b2a889c10f445418>
 *        The only required option is `freq`, one of RRule.YEARLY, RRule.MONTHLY, ...
 * @constructor
 */
class RRule {
    constructor(options = {}, noCache = false) {
        // RFC string
        this._string = null;
        this._cache = noCache
            ? null
            : {
                all: false,
                before: [],
                after: [],
                between: []
            };
        // used by toString()
        this.origOptions = parseoptions_1.initializeOptions(options);
        const { parsedOptions, timeset } = parseoptions_1.parseOptions(options);
        this.options = parsedOptions;
        this.timeset = timeset;
    }
    static parseText(text, language) {
        return getnlp().parseText(text, language);
    }
    static fromText(text, language) {
        return getnlp().fromText(text, language);
    }
    static parseString(rfcString) {
        return parsestring_1.parseString(rfcString);
    }
    static fromString(str) {
        return new RRule(RRule.parseString(str) || undefined);
    }
    static optionsToString(options) {
        const pairs = [];
        const keys = Object.keys(options);
        const defaultKeys = Object.keys(exports.DEFAULT_OPTIONS);
        for (let i = 0; i < keys.length; i++) {
            if (!helpers_1.includes(defaultKeys, keys[i]))
                continue;
            let key = keys[i].toUpperCase();
            let value = options[keys[i]];
            let strValues = [];
            if (!helpers_1.isPresent(value) || (helpers_1.isArray(value) && !value.length))
                continue;
            switch (key) {
                case 'FREQ':
                    value = RRule.FREQUENCIES[options.freq];
                    break;
                case 'WKST':
                    if (helpers_1.isNumber(value)) {
                        value = new weekday_1.default(value);
                    }
                    break;
                case 'BYWEEKDAY':
                    /*
                    NOTE: BYWEEKDAY is a special case.
                    RRule() deconstructs the rule.options.byweekday array
                    into an array of Weekday arguments.
                    On the other hand, rule.origOptions is an array of Weekdays.
                    We need to handle both cases here.
                    It might be worth change RRule to keep the Weekdays.
          
                    Also, BYWEEKDAY (used by RRule) vs. BYDAY (RFC)
          
                    */
                    key = 'BYDAY';
                    if (!helpers_1.isArray(value))
                        value = [value];
                    for (let j = 0; j < value.length; j++) {
                        let wday = value[j];
                        if (wday instanceof weekday_1.default) {
                            // good
                        }
                        else if (helpers_1.isArray(wday)) {
                            wday = new weekday_1.default(wday[0], wday[1]);
                        }
                        else {
                            wday = new weekday_1.default(wday);
                        }
                        strValues[j] = wday.toString();
                    }
                    value = strValues;
                    break;
                case 'DTSTART':
                case 'UNTIL':
                    value = dateutil_1.default.timeToUntilString(value);
                    break;
                default:
                    if (helpers_1.isArray(value)) {
                        for (let j = 0; j < value.length; j++) {
                            strValues[j] = String(value[j]);
                        }
                        value = strValues;
                    }
                    else {
                        value = String(value);
                    }
            }
            pairs.push([key, value]);
        }
        const strings = [];
        for (let i = 0; i < pairs.length; i++) {
            const attr = pairs[i];
            strings.push(attr[0] + '=' + attr[1].toString());
        }
        return strings.join(';');
    }
    /**
     * @param {Function} iterator - optional function that will be called
     *                   on each date that is added. It can return false
     *                   to stop the iteration.
     * @return Array containing all recurrences.
     */
    all(iterator) {
        if (iterator) {
            return this._iter(new callbackiterresult_1.default('all', {}, iterator));
        }
        else {
            let result = this._cacheGet('all');
            if (result === false) {
                result = this._iter(new iterresult_1.default('all', {}));
                this._cacheAdd('all', result);
            }
            return result;
        }
    }
    /**
     * Returns all the occurrences of the rrule between after and before.
     * The inc keyword defines what happens if after and/or before are
     * themselves occurrences. With inc == True, they will be included in the
     * list, if they are found in the recurrence set.
     * @return Array
     */
    between(after, before, inc = false, iterator) {
        const args = {
            before,
            after,
            inc
        };
        if (iterator) {
            return this._iter(new callbackiterresult_1.default('between', args, iterator));
        }
        let result = this._cacheGet('between', args);
        if (result === false) {
            result = this._iter(new iterresult_1.default('between', args));
            this._cacheAdd('between', result, args);
        }
        return result;
    }
    /**
     * Returns the last recurrence before the given datetime instance.
     * The inc keyword defines what happens if dt is an occurrence.
     * With inc == True, if dt itself is an occurrence, it will be returned.
     * @return Date or null
     */
    before(dt, inc = false) {
        const args = { dt: dt, inc: inc };
        let result = this._cacheGet('before', args);
        if (result === false) {
            result = this._iter(new iterresult_1.default('before', args));
            this._cacheAdd('before', result, args);
        }
        return result;
    }
    /**
     * Returns the first recurrence after the given datetime instance.
     * The inc keyword defines what happens if dt is an occurrence.
     * With inc == True, if dt itself is an occurrence, it will be returned.
     * @return Date or null
     */
    after(dt, inc = false) {
        const args = { dt: dt, inc: inc };
        let result = this._cacheGet('after', args);
        if (result === false) {
            result = this._iter(new iterresult_1.default('after', args));
            this._cacheAdd('after', result, args);
        }
        return result;
    }
    /**
     * Returns the number of recurrences in this set. It will have go trough
     * the whole recurrence, if this hasn't been done before.
     */
    count() {
        return this.all().length;
    }
    /**
     * Converts the rrule into its string representation
     * @see <http://www.ietf.org/rfc/rfc2445.txt>
     * @return String
     */
    toString() {
        return RRule.optionsToString(this.origOptions);
    }
    /**
     * Will convert all rules described in nlp:ToText
     * to text.
     */
    toText(gettext, language) {
        return getnlp().toText(this, gettext, language);
    }
    isFullyConvertibleToText() {
        return getnlp().isFullyConvertible(this);
    }
    /**
     * @param {String} what - all/before/after/between
     * @param {Array,Date} value - an array of dates, one date, or null
     * @param {Object?} args - _iter arguments
     */
    _cacheAdd(what, value, args) {
        if (!this._cache)
            return;
        if (value) {
            value =
                value instanceof Date
                    ? dateutil_1.default.clone(value)
                    : dateutil_1.default.cloneDates(value);
        }
        if (what === 'all') {
            this._cache.all = value;
        }
        else {
            args._value = value;
            this._cache[what].push(args);
        }
    }
    /**
     * @return false - not in the cache
     *         null  - cached, but zero occurrences (before/after)
     *         Date  - cached (before/after)
     *         []    - cached, but zero occurrences (all/between)
     *         [Date1, DateN] - cached (all/between)
     */
    _cacheGet(what, args) {
        if (!this._cache)
            return false;
        let cached = false;
        const argsKeys = args ? Object.keys(args) : [];
        const findCacheDiff = function (item) {
            for (let i = 0; i < argsKeys.length; i++) {
                const key = argsKeys[i];
                if (String(args[key]) !== String(item[key])) {
                    return true;
                }
            }
            return false;
        };
        const cachedObject = this._cache[what];
        if (what === 'all') {
            cached = this._cache.all;
        }
        else if (helpers_1.isArray(cachedObject)) {
            // Let's see whether we've already called the
            // 'what' method with the same 'args'
            for (let i = 0; i < cachedObject.length; i++) {
                const item = cachedObject[i];
                if (argsKeys.length && findCacheDiff(item))
                    continue;
                cached = item._value;
                break;
            }
        }
        if (!cached && this._cache.all) {
            // Not in the cache, but we already know all the occurrences,
            // so we can find the correct dates from the cached ones.
            const iterResult = new iterresult_1.default(what, args);
            for (let i = 0; i < this._cache.all.length; i++) {
                if (!iterResult.accept(this._cache.all[i]))
                    break;
            }
            cached = iterResult.getValue();
            this._cacheAdd(what, cached, args);
        }
        return helpers_1.isArray(cached)
            ? dateutil_1.default.cloneDates(cached)
            : cached instanceof Date
                ? dateutil_1.default.clone(cached)
                : cached;
    }
    /**
     * @return a RRule instance with the same freq and options
     *          as this one (cache is not cloned)
     */
    clone() {
        return new RRule(this.origOptions);
    }
    _iter(iterResult) {
        /* Since JavaScript doesn't have the python's yield operator (<1.7),
            we use the IterResult object that tells us when to stop iterating.
    
        */
        const dtstart = this.options.dtstart;
        const dtstartMillisecondModulo = this.options.dtstart.valueOf() % 1000;
        let year = dtstart.getUTCFullYear();
        let month = dtstart.getUTCMonth() + 1;
        let day = dtstart.getUTCDate();
        let hour = dtstart.getUTCHours();
        let minute = dtstart.getUTCMinutes();
        let second = dtstart.getUTCSeconds();
        let weekday = dateutil_1.default.getWeekday(dtstart);
        // Some local variables to speed things up a bit
        const { freq, interval, wkst, until, bymonth, byweekno, byyearday, byweekday, byeaster, bymonthday, bynmonthday, bysetpos, byhour, byminute, bysecond } = this.options;
        const ii = new iterinfo_1.default(this);
        ii.rebuild(year, month);
        const getdayset = {
            [RRule.YEARLY]: ii.ydayset,
            [RRule.MONTHLY]: ii.mdayset,
            [RRule.WEEKLY]: ii.wdayset,
            [RRule.DAILY]: ii.ddayset,
            [RRule.HOURLY]: ii.ddayset,
            [RRule.MINUTELY]: ii.ddayset,
            [RRule.SECONDLY]: ii.ddayset
        }[freq];
        let timeset;
        let gettimeset;
        if (freq < RRule.HOURLY) {
            timeset = this.timeset;
        }
        else {
            gettimeset = {
                [RRule.HOURLY]: ii.htimeset,
                [RRule.MINUTELY]: ii.mtimeset,
                [RRule.SECONDLY]: ii.stimeset
            }[freq];
            if ((freq >= RRule.HOURLY && helpers_1.notEmpty(byhour) && !helpers_1.includes(byhour, hour)) ||
                (freq >= RRule.MINUTELY &&
                    helpers_1.notEmpty(byminute) &&
                    !helpers_1.includes(byminute, minute)) ||
                (freq >= RRule.SECONDLY &&
                    helpers_1.notEmpty(bysecond) &&
                    !helpers_1.includes(bysecond, second))) {
                timeset = [];
            }
            else {
                timeset = gettimeset.call(ii, hour, minute, second, dtstartMillisecondModulo);
            }
        }
        let currentDay;
        let total = 0;
        let count = this.options.count;
        let dm;
        let div;
        let mod;
        let pos;
        while (true) {
            // Get dayset with the right frequency
            const [dayset, start, end] = getdayset.call(ii, year, month, day);
            // Do the "hard" work ;-)
            let filtered = false;
            for (let dayCounter = start; dayCounter < end; dayCounter++) {
                currentDay = dayset[dayCounter];
                filtered = isFiltered(bymonth, ii, currentDay, byweekno, byweekday, byeaster, bymonthday, bynmonthday, byyearday);
                if (filtered)
                    dayset[currentDay] = null;
            }
            // Output results
            if (helpers_1.notEmpty(bysetpos) && helpers_1.notEmpty(timeset)) {
                let daypos;
                let timepos;
                const poslist = [];
                for (let j = 0; j < bysetpos.length; j++) {
                    pos = bysetpos[j];
                    if (pos < 0) {
                        daypos = Math.floor(pos / timeset.length);
                        timepos = helpers_1.pymod(pos, timeset.length);
                    }
                    else {
                        daypos = Math.floor((pos - 1) / timeset.length);
                        timepos = helpers_1.pymod(pos - 1, timeset.length);
                    }
                    const tmp = [];
                    for (let k = start; k < end; k++) {
                        const val = dayset[k];
                        if (!helpers_1.isPresent(val))
                            continue;
                        tmp.push(val);
                    }
                    let i;
                    if (daypos < 0) {
                        // we're trying to emulate python's aList[-n]
                        i = tmp.slice(daypos)[0];
                    }
                    else {
                        i = tmp[daypos];
                    }
                    const time = timeset[timepos];
                    const date = dateutil_1.default.fromOrdinal(ii.yearordinal + i);
                    const res = dateutil_1.default.combine(date, time);
                    // XXX: can this ever be in the array?
                    // - compare the actual date instead?
                    if (!helpers_1.includes(poslist, res))
                        poslist.push(res);
                }
                dateutil_1.default.sort(poslist);
                for (let j = 0; j < poslist.length; j++) {
                    const res = poslist[j];
                    if (until && res > until) {
                        this._len = total;
                        return iterResult.getValue();
                    }
                    else if (res >= dtstart) {
                        ++total;
                        if (!iterResult.accept(res)) {
                            return iterResult.getValue();
                        }
                        if (count) {
                            --count;
                            if (!count) {
                                this._len = total;
                                return iterResult.getValue();
                            }
                        }
                    }
                }
            }
            else {
                for (let j = start; j < end; j++) {
                    currentDay = dayset[j];
                    if (!helpers_1.isPresent(currentDay)) {
                        continue;
                    }
                    const date = dateutil_1.default.fromOrdinal(ii.yearordinal + currentDay);
                    for (let k = 0; k < timeset.length; k++) {
                        const time = timeset[k];
                        const res = dateutil_1.default.combine(date, time);
                        if (until && res > until) {
                            this._len = total;
                            return iterResult.getValue();
                        }
                        else if (res >= dtstart) {
                            ++total;
                            if (!iterResult.accept(res)) {
                                return iterResult.getValue();
                            }
                            if (count) {
                                --count;
                                if (!count) {
                                    this._len = total;
                                    return iterResult.getValue();
                                }
                            }
                        }
                    }
                }
            }
            // Handle frequency and interval
            let fixday = false;
            if (freq === RRule.YEARLY) {
                year += interval;
                if (year > dateutil_1.default.MAXYEAR) {
                    this._len = total;
                    return iterResult.getValue();
                }
                ii.rebuild(year, month);
            }
            else if (freq === RRule.MONTHLY) {
                month += interval;
                if (month > 12) {
                    div = Math.floor(month / 12);
                    mod = helpers_1.pymod(month, 12);
                    month = mod;
                    year += div;
                    if (month === 0) {
                        month = 12;
                        --year;
                    }
                    if (year > dateutil_1.default.MAXYEAR) {
                        this._len = total;
                        return iterResult.getValue();
                    }
                }
                ii.rebuild(year, month);
            }
            else if (freq === RRule.WEEKLY) {
                if (wkst > weekday) {
                    day += -(weekday + 1 + (6 - wkst)) + interval * 7;
                }
                else {
                    day += -(weekday - wkst) + interval * 7;
                }
                weekday = wkst;
                fixday = true;
            }
            else if (freq === RRule.DAILY) {
                day += interval;
                fixday = true;
            }
            else if (freq === RRule.HOURLY) {
                if (filtered) {
                    // Jump to one iteration before next day
                    hour += Math.floor((23 - hour) / interval) * interval;
                }
                while (true) {
                    hour += interval;
                    dm = helpers_1.divmod(hour, 24);
                    div = dm.div;
                    mod = dm.mod;
                    if (div) {
                        hour = mod;
                        day += div;
                        fixday = true;
                    }
                    if (helpers_1.empty(byhour) || helpers_1.includes(byhour, hour))
                        break;
                }
                // @ts-ignore
                timeset = gettimeset.call(ii, hour, minute, second);
            }
            else if (freq === RRule.MINUTELY) {
                if (filtered) {
                    // Jump to one iteration before next day
                    minute +=
                        Math.floor((1439 - (hour * 60 + minute)) / interval) * interval;
                }
                while (true) {
                    minute += interval;
                    dm = helpers_1.divmod(minute, 60);
                    div = dm.div;
                    mod = dm.mod;
                    if (div) {
                        minute = mod;
                        hour += div;
                        dm = helpers_1.divmod(hour, 24);
                        div = dm.div;
                        mod = dm.mod;
                        if (div) {
                            hour = mod;
                            day += div;
                            fixday = true;
                            filtered = false;
                        }
                    }
                    if ((helpers_1.empty(byhour) || helpers_1.includes(byhour, hour)) &&
                        (helpers_1.empty(byminute) || helpers_1.includes(byminute, minute))) {
                        break;
                    }
                }
                // @ts-ignore
                timeset = gettimeset.call(ii, hour, minute, second);
            }
            else if (freq === RRule.SECONDLY) {
                if (filtered) {
                    // Jump to one iteration before next day
                    second +=
                        Math.floor((86399 - (hour * 3600 + minute * 60 + second)) / interval) * interval;
                }
                while (true) {
                    second += interval;
                    dm = helpers_1.divmod(second, 60);
                    div = dm.div;
                    mod = dm.mod;
                    if (div) {
                        second = mod;
                        minute += div;
                        dm = helpers_1.divmod(minute, 60);
                        div = dm.div;
                        mod = dm.mod;
                        if (div) {
                            minute = mod;
                            hour += div;
                            dm = helpers_1.divmod(hour, 24);
                            div = dm.div;
                            mod = dm.mod;
                            if (div) {
                                hour = mod;
                                day += div;
                                fixday = true;
                            }
                        }
                    }
                    if ((helpers_1.empty(byhour) || helpers_1.includes(byhour, hour)) &&
                        (helpers_1.empty(byminute) || helpers_1.includes(byminute, minute)) &&
                        (helpers_1.empty(bysecond) || helpers_1.includes(bysecond, second))) {
                        break;
                    }
                }
                // @ts-ignore
                timeset = gettimeset.call(ii, hour, minute, second);
            }
            if (fixday && day > 28) {
                let daysinmonth = dateutil_1.default.monthRange(year, month - 1)[1];
                if (day > daysinmonth) {
                    while (day > daysinmonth) {
                        day -= daysinmonth;
                        ++month;
                        if (month === 13) {
                            month = 1;
                            ++year;
                            if (year > dateutil_1.default.MAXYEAR) {
                                this._len = total;
                                return iterResult.getValue();
                            }
                        }
                        daysinmonth = dateutil_1.default.monthRange(year, month - 1)[1];
                    }
                    ii.rebuild(year, month);
                }
            }
        }
    }
}
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
RRule.YEARLY = types_1.Frequency.YEARLY;
RRule.MONTHLY = types_1.Frequency.MONTHLY;
RRule.WEEKLY = types_1.Frequency.WEEKLY;
RRule.DAILY = types_1.Frequency.DAILY;
RRule.HOURLY = types_1.Frequency.HOURLY;
RRule.MINUTELY = types_1.Frequency.MINUTELY;
RRule.SECONDLY = types_1.Frequency.SECONDLY;
RRule.MO = types_1.Days.MO;
RRule.TU = types_1.Days.TU;
RRule.WE = types_1.Days.WE;
RRule.TH = types_1.Days.TH;
RRule.FR = types_1.Days.FR;
RRule.SA = types_1.Days.SA;
RRule.SU = types_1.Days.SU;
exports.default = RRule;
function isFiltered(bymonth, ii, currentDay, byweekno, byweekday, byeaster, bymonthday, bynmonthday, byyearday) {
    return ((helpers_1.notEmpty(bymonth) && !helpers_1.includes(bymonth, ii.mmask[currentDay])) ||
        (helpers_1.notEmpty(byweekno) && !ii.wnomask[currentDay]) ||
        (helpers_1.notEmpty(byweekday) && !helpers_1.includes(byweekday, ii.wdaymask[currentDay])) ||
        (helpers_1.notEmpty(ii.nwdaymask) && !ii.nwdaymask[currentDay]) ||
        (byeaster !== null && !helpers_1.includes(ii.eastermask, currentDay)) ||
        ((helpers_1.notEmpty(bymonthday) || helpers_1.notEmpty(bynmonthday)) &&
            !helpers_1.includes(bymonthday, ii.mdaymask[currentDay]) &&
            !helpers_1.includes(bynmonthday, ii.nmdaymask[currentDay])) ||
        (helpers_1.notEmpty(byyearday) &&
            ((currentDay < ii.yearlen &&
                !helpers_1.includes(byyearday, currentDay + 1) &&
                !helpers_1.includes(byyearday, -ii.yearlen + currentDay)) ||
                (currentDay >= ii.yearlen &&
                    !helpers_1.includes(byyearday, currentDay + 1 - ii.yearlen) &&
                    !helpers_1.includes(byyearday, -ii.nextyearlen + currentDay - ii.yearlen)))));
}
//# sourceMappingURL=rrule.js.map