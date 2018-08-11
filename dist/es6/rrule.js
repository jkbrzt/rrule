"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dateutil_1 = require("./dateutil");
const iterinfo_1 = require("./iterinfo");
const helpers_1 = require("./helpers");
const iterresult_1 = require("./iterresult");
const callbackiterresult_1 = require("./callbackiterresult");
const types_1 = require("./types");
const parseoptions_1 = require("./parseoptions");
const parsestring_1 = require("./parsestring");
const optionstostring_1 = require("./optionstostring");
const cache_1 = require("./cache");
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
            : new cache_1.Cache();
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
    static fromString(str) {
        return new RRule(RRule.parseString(str) || undefined);
    }
    _cacheGet(what, args) {
        if (!this._cache)
            return false;
        return this._cache._cacheGet(what, args);
    }
    _cacheAdd(what, value, args) {
        if (!this._cache)
            return;
        return this._cache._cacheAdd(what, value, args);
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
        return optionstostring_1.optionsToString(this.origOptions);
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
        let date = new dateutil_1.default.DateTime(dtstart.getUTCFullYear(), dtstart.getUTCMonth() + 1, dtstart.getUTCDate(), dtstart.getUTCHours(), dtstart.getUTCMinutes(), dtstart.getUTCSeconds(), dtstart.valueOf() % 1000);
        // Some local variables to speed things up a bit
        const { freq, interval, wkst, until, bymonth, byweekno, byyearday, byweekday, byeaster, bymonthday, bynmonthday, bysetpos, byhour, byminute, bysecond } = this.options;
        const ii = new iterinfo_1.default(this);
        ii.rebuild(date.year, date.month);
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
            if ((freq >= RRule.HOURLY && helpers_1.notEmpty(byhour) && !helpers_1.includes(byhour, date.hour)) ||
                (freq >= RRule.MINUTELY &&
                    helpers_1.notEmpty(byminute) &&
                    !helpers_1.includes(byminute, date.minute)) ||
                (freq >= RRule.SECONDLY &&
                    helpers_1.notEmpty(bysecond) &&
                    !helpers_1.includes(bysecond, date.second))) {
                timeset = [];
            }
            else {
                timeset = gettimeset.call(ii, date.hour, date.minute, date.second, date.millisecond);
            }
        }
        let currentDay;
        let total = 0;
        let count = this.options.count;
        let pos;
        while (true) {
            // Get dayset with the right frequency
            const [dayset, start, end] = getdayset.call(ii, date.year, date.month, date.day);
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
            if (date.year > dateutil_1.default.MAXYEAR) {
                this._len = total;
                return iterResult.getValue();
            }
            ii.rebuild(date.year, date.month);
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
RRule.parseString = parsestring_1.parseString;
RRule.optionsToString = optionstostring_1.optionsToString;
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