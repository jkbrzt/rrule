import { Frequency } from './types';
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
    // Some local variables to speed things up a bit
    var dtstart = options.dtstart, freq = options.freq, interval = options.interval, wkst = options.wkst, until = options.until, bysetpos = options.bysetpos, byhour = options.byhour, byminute = options.byminute, bysecond = options.bysecond;
    var counterDate = dateutil.DateTime.fromDate(dtstart);
    var ii = new Iterinfo(options);
    ii.rebuild(counterDate.year, counterDate.month);
    var timeset = makeTimeset(ii, counterDate, options);
    var currentDay;
    var count = options.count;
    var pos;
    while (true) {
        // Get dayset with the right frequency
        var _a = ii.getdayset(freq)(counterDate.year, counterDate.month, counterDate.day), dayset = _a[0], start = _a[1], end = _a[2];
        // Do the "hard" work ;-)
        var filtered = removeFilteredDays(dayset, start, end, ii, options);
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
                var date = dateutil.fromOrdinal(ii.yearordinal + i);
                var res = dateutil.combine(date, time);
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
                var date = dateutil.fromOrdinal(ii.yearordinal + currentDay);
                for (var k = 0; k < timeset.length; k++) {
                    var time = timeset[k];
                    var res = dateutil.combine(date, time);
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
            counterDate.addYears(interval);
        }
        else if (freq === RRule.MONTHLY) {
            counterDate.addMonths(interval);
        }
        else if (freq === RRule.WEEKLY) {
            counterDate.addWeekly(interval, wkst);
        }
        else if (freq === RRule.DAILY) {
            counterDate.addDaily(interval);
        }
        else if (freq === RRule.HOURLY) {
            counterDate.addHours(interval, filtered, byhour);
            timeset = ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second);
        }
        else if (freq === RRule.MINUTELY) {
            if (counterDate.addMinutes(interval, filtered, byhour, byminute)) {
                filtered = false;
            }
            timeset = ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second);
        }
        else if (freq === RRule.SECONDLY) {
            if (counterDate.addSeconds(interval, filtered, byhour, byminute, bysecond)) {
                filtered = false;
            }
            timeset = ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second);
        }
        if (counterDate.year > dateutil.MAXYEAR) {
            return emitResult(iterResult);
        }
        ii.rebuild(counterDate.year, counterDate.month);
    }
}
function isFiltered(ii, currentDay, options) {
    var bymonth = options.bymonth, byweekno = options.byweekno, byweekday = options.byweekday, byeaster = options.byeaster, bymonthday = options.bymonthday, bynmonthday = options.bynmonthday, byyearday = options.byyearday;
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
function removeFilteredDays(dayset, start, end, ii, options) {
    var filtered = false;
    for (var dayCounter = start; dayCounter < end; dayCounter++) {
        var currentDay = dayset[dayCounter];
        filtered = isFiltered(ii, currentDay, options);
        if (filtered)
            dayset[currentDay] = null;
    }
    return filtered;
}
function freqIsDailyOrGreater(freq) {
    return freq < Frequency.HOURLY;
}
function makeTimeset(ii, counterDate, options) {
    var freq = options.freq, byhour = options.byhour, byminute = options.byminute, bysecond = options.bysecond;
    if (freqIsDailyOrGreater(freq)) {
        return buildTimeset(options);
    }
    else if ((freq >= RRule.HOURLY &&
        notEmpty(byhour) &&
        !includes(byhour, counterDate.hour)) ||
        (freq >= RRule.MINUTELY &&
            notEmpty(byminute) &&
            !includes(byminute, counterDate.minute)) ||
        (freq >= RRule.SECONDLY &&
            notEmpty(bysecond) &&
            !includes(bysecond, counterDate.second))) {
        return [];
    }
    else {
        return ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second, counterDate.millisecond);
    }
}
//# sourceMappingURL=iter.js.map