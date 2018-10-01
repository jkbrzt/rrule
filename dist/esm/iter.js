import dateutil from './dateutil';
import Iterinfo from './iterinfo';
import RRule from './rrule';
import { buildTimeset } from './parseoptions';
import { notEmpty, includes, pymod, isPresent } from './helpers';
import { DateWithZone } from './datewithzone';
export function iter(iterResult, options) {
    /* Since JavaScript doesn't have the python's yield operator (<1.7),
        we use the IterResult object that tells us when to stop iterating.
  
    */
    var _a, _b;
    // Some local variables to speed things up a bit
    var dtstart = options.dtstart, freq = options.freq, interval = options.interval, wkst = options.wkst, until = options.until, bymonth = options.bymonth, byweekno = options.byweekno, byyearday = options.byyearday, byweekday = options.byweekday, byeaster = options.byeaster, bymonthday = options.bymonthday, bynmonthday = options.bynmonthday, bysetpos = options.bysetpos, byhour = options.byhour, byminute = options.byminute, bysecond = options.bysecond;
    var date = new dateutil.DateTime(dtstart.getUTCFullYear(), dtstart.getUTCMonth() + 1, dtstart.getUTCDate(), dtstart.getUTCHours(), dtstart.getUTCMinutes(), dtstart.getUTCSeconds(), dtstart.valueOf() % 1000);
    var ii = new Iterinfo(options);
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
}
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
//# sourceMappingURL=iter.js.map