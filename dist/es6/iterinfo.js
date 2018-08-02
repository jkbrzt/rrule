"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const masks_1 = require("./masks");
const rrule_1 = require("./rrule");
const dateutil_1 = require("./dateutil");
const helpers_1 = require("./helpers");
// =============================================================================
// Iterinfo
// =============================================================================
class Iterinfo {
    constructor(rrule) {
        this.rrule = rrule;
        this.lastyear = null;
        this.lastmonth = null;
        this.yearlen = null;
        this.nextyearlen = null;
        this.yearordinal = null;
        this.yearweekday = null;
        this.mmask = null;
        this.mrange = null;
        this.mdaymask = null;
        this.nmdaymask = null;
        this.wdaymask = null;
        this.wnomask = null;
        this.nwdaymask = null;
        this.eastermask = null;
    }
    easter(y, offset = 0) {
        const a = y % 19;
        const b = Math.floor(y / 100);
        const c = y % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = Math.floor(19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = Math.floor(32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        const date = Date.UTC(y, month - 1, day + offset);
        const yearStart = Date.UTC(y, 0, 1);
        return [Math.ceil((date - yearStart) / (1000 * 60 * 60 * 24))];
    }
    rebuild(year, month) {
        const rr = this.rrule;
        if (year !== this.lastyear) {
            this.yearlen = dateutil_1.default.isLeapYear(year) ? 366 : 365;
            this.nextyearlen = dateutil_1.default.isLeapYear(year + 1) ? 366 : 365;
            const firstyday = new Date(year, 0, 1);
            this.yearordinal = dateutil_1.default.toOrdinal(firstyday);
            this.yearweekday = dateutil_1.default.getWeekday(firstyday);
            const wday = dateutil_1.default.getWeekday(new Date(year, 0, 1));
            if (this.yearlen === 365) {
                this.mmask = [].concat(masks_1.M365MASK);
                this.mdaymask = [].concat(masks_1.MDAY365MASK);
                this.nmdaymask = [].concat(masks_1.NMDAY365MASK);
                this.wdaymask = masks_1.WDAYMASK.slice(wday);
                this.mrange = [].concat(masks_1.M365RANGE);
            }
            else {
                this.mmask = [].concat(masks_1.M366MASK);
                this.mdaymask = [].concat(masks_1.MDAY366MASK);
                this.nmdaymask = [].concat(masks_1.NMDAY366MASK);
                this.wdaymask = masks_1.WDAYMASK.slice(wday);
                this.mrange = [].concat(masks_1.M366RANGE);
            }
            if (!helpers_1.notEmpty(rr.options.byweekno)) {
                this.wnomask = null;
            }
            else {
                this.wnomask = helpers_1.repeat(0, this.yearlen + 7);
                let no1wkst;
                let firstwkst;
                let wyearlen;
                no1wkst = firstwkst = helpers_1.pymod(7 - this.yearweekday + rr.options.wkst, 7);
                if (no1wkst >= 4) {
                    no1wkst = 0;
                    // Number of days in the year, plus the days we got
                    // from last year.
                    wyearlen =
                        this.yearlen + helpers_1.pymod(this.yearweekday - rr.options.wkst, 7);
                }
                else {
                    // Number of days in the year, minus the days we
                    // left in last year.
                    wyearlen = this.yearlen - no1wkst;
                }
                const div = Math.floor(wyearlen / 7);
                const mod = helpers_1.pymod(wyearlen, 7);
                const numweeks = Math.floor(div + mod / 4);
                for (let j = 0; j < rr.options.byweekno.length; j++) {
                    let i;
                    let n = rr.options.byweekno[j];
                    if (n < 0) {
                        n += numweeks + 1;
                    }
                    if (!(n > 0 && n <= numweeks)) {
                        continue;
                    }
                    if (n > 1) {
                        i = no1wkst + (n - 1) * 7;
                        if (no1wkst !== firstwkst) {
                            i -= 7 - firstwkst;
                        }
                    }
                    else {
                        i = no1wkst;
                    }
                    for (let k = 0; k < 7; k++) {
                        this.wnomask[i] = 1;
                        i++;
                        if (this.wdaymask[i] === rr.options.wkst)
                            break;
                    }
                }
                if (helpers_1.contains(rr.options.byweekno, 1)) {
                    // Check week number 1 of next year as well
                    // orig-TODO : Check -numweeks for next year.
                    let i = no1wkst + numweeks * 7;
                    if (no1wkst !== firstwkst)
                        i -= 7 - firstwkst;
                    if (i < this.yearlen) {
                        // If week starts in next year, we
                        // don't care about it.
                        for (let j = 0; j < 7; j++) {
                            this.wnomask[i] = 1;
                            i += 1;
                            if (this.wdaymask[i] === rr.options.wkst)
                                break;
                        }
                    }
                }
                if (no1wkst) {
                    // Check last week number of last year as
                    // well. If no1wkst is 0, either the year
                    // started on week start, or week number 1
                    // got days from last year, so there are no
                    // days from last year's last week number in
                    // this year.
                    let lnumweeks;
                    if (!helpers_1.contains(rr.options.byweekno, -1)) {
                        const lyearweekday = dateutil_1.default.getWeekday(new Date(year - 1, 0, 1));
                        let lno1wkst = helpers_1.pymod(7 - lyearweekday.valueOf() + rr.options.wkst, 7);
                        const lyearlen = dateutil_1.default.isLeapYear(year - 1) ? 366 : 365;
                        if (lno1wkst >= 4) {
                            lno1wkst = 0;
                            lnumweeks = Math.floor(52 +
                                helpers_1.pymod(lyearlen + helpers_1.pymod(lyearweekday - rr.options.wkst, 7), 7) /
                                    4);
                        }
                        else {
                            lnumweeks = Math.floor(52 + helpers_1.pymod(this.yearlen - no1wkst, 7) / 4);
                        }
                    }
                    else {
                        lnumweeks = -1;
                    }
                    if (helpers_1.contains(rr.options.byweekno, lnumweeks)) {
                        for (let i = 0; i < no1wkst; i++)
                            this.wnomask[i] = 1;
                    }
                }
            }
        }
        if (helpers_1.notEmpty(rr.options.bynweekday) &&
            (month !== this.lastmonth || year !== this.lastyear)) {
            let ranges = [];
            if (rr.options.freq === rrule_1.default.YEARLY) {
                if (helpers_1.notEmpty(rr.options.bymonth) && rr.options.bymonth instanceof Array) {
                    for (let j = 0; j < rr.options.bymonth.length; j++) {
                        month = rr.options.bymonth[j];
                        ranges.push(this.mrange.slice(month - 1, month + 1));
                    }
                }
                else {
                    ranges = [[0, this.yearlen]];
                }
            }
            else if (rr.options.freq === rrule_1.default.MONTHLY) {
                ranges = [this.mrange.slice(month - 1, month + 1)];
            }
            if (helpers_1.notEmpty(ranges)) {
                // Weekly frequency won't get here, so we may not
                // care about cross-year weekly periods.
                this.nwdaymask = helpers_1.repeat(0, this.yearlen);
                for (let j = 0; j < ranges.length; j++) {
                    const rang = ranges[j];
                    const first = rang[0];
                    let last = rang[1];
                    last -= 1;
                    for (let k = 0; k < rr.options.bynweekday.length; k++) {
                        let i;
                        const wday = rr.options.bynweekday[k][0];
                        const n = rr.options.bynweekday[k][1];
                        if (n < 0) {
                            i = last + (n + 1) * 7;
                            i -= helpers_1.pymod(this.wdaymask[i] - wday, 7);
                        }
                        else {
                            i = first + (n - 1) * 7;
                            i += helpers_1.pymod(7 - this.wdaymask[i] + wday, 7);
                        }
                        if (first <= i && i <= last)
                            this.nwdaymask[i] = 1;
                    }
                }
            }
            this.lastyear = year;
            this.lastmonth = month;
        }
        if (rr.options.byeaster !== null) {
            this.eastermask = this.easter(year, rr.options.byeaster);
        }
    }
    ydayset() {
        return [helpers_1.range(this.yearlen), 0, this.yearlen];
    }
    mdayset(_, month, __) {
        const start = this.mrange[month - 1];
        const end = this.mrange[month];
        const set = helpers_1.repeat(null, this.yearlen);
        for (let i = start; i < end; i++)
            set[i] = i;
        return [set, start, end];
    }
    wdayset(year, month, day) {
        // We need to handle cross-year weeks here.
        const set = helpers_1.repeat(null, this.yearlen + 7);
        let i = dateutil_1.default.toOrdinal(new Date(year, month - 1, day)) - this.yearordinal;
        const start = i;
        for (let j = 0; j < 7; j++) {
            set[i] = i;
            ++i;
            if (this.wdaymask[i] === this.rrule.options.wkst)
                break;
        }
        return [set, start, i];
    }
    ddayset(year, month, day) {
        const set = helpers_1.repeat(null, this.yearlen);
        const i = dateutil_1.default.toOrdinal(new Date(year, month - 1, day)) - this.yearordinal;
        set[i] = i;
        return [set, i, i + 1];
    }
    htimeset(hour, minute, second, millisecond) {
        const set = [];
        const rr = this.rrule;
        for (let i = 0; i < rr.options.byminute.length; i++) {
            minute = (rr.options.byminute)[i];
            for (let j = 0; j < rr.options.bysecond.length; j++) {
                second = rr.options.bysecond[j];
                set.push(new dateutil_1.default.Time(hour, minute, second, millisecond));
            }
        }
        dateutil_1.default.sort(set);
        return set;
    }
    mtimeset(hour, minute, second, millisecond) {
        const set = [];
        const rr = this.rrule;
        for (let j = 0; j < rr.options.bysecond.length; j++) {
            second = rr.options.bysecond[j];
            set.push(new dateutil_1.default.Time(hour, minute, second, millisecond));
        }
        dateutil_1.default.sort(set);
        return set;
    }
    stimeset(hour, minute, second, millisecond) {
        return [new dateutil_1.default.Time(hour, minute, second, millisecond)];
    }
}
exports.default = Iterinfo;
//# sourceMappingURL=iterinfo.js.map