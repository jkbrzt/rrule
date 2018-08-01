"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * General date-related utilities.
 * Also handles several incompatibilities between JavaScript and Python
 *
 */
var dateutil;
(function (dateutil) {
    dateutil.MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    /**
     * Number of milliseconds of one day
     */
    dateutil.ONE_DAY = 1000 * 60 * 60 * 24;
    /**
     * @see: <http://docs.python.org/library/datetime.html#datetime.MAXYEAR>
     */
    dateutil.MAXYEAR = 9999;
    /**
     * Python uses 1-Jan-1 as the base for calculating ordinals but we don't
     * want to confuse the JS engine with milliseconds > Number.MAX_NUMBER,
     * therefore we use 1-Jan-1970 instead
     */
    dateutil.ORDINAL_BASE = new Date(1970, 0, 1);
    /**
     * Python: MO-SU: 0 - 6
     * JS: SU-SAT 0 - 6
     */
    dateutil.PY_WEEKDAYS = [6, 0, 1, 2, 3, 4, 5];
    /**
     * py_date.timetuple()[7]
     */
    dateutil.getYearDay = function (date) {
        const dateNoTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return (Math.ceil((dateNoTime.valueOf() - new Date(date.getFullYear(), 0, 1).valueOf()) /
            dateutil.ONE_DAY) + 1);
    };
    dateutil.isLeapYear = function (year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };
    /**
     * @return {Number} the date's timezone offset in ms
     */
    dateutil.tzOffset = function (date) {
        return date.getTimezoneOffset() * 60 * 1000;
    };
    /**
     * @see: <http://www.mcfedries.com/JavaScript/DaysBetween.asp>
     */
    dateutil.daysBetween = function (date1, date2) {
        // The number of milliseconds in one day
        // Convert both dates to milliseconds
        const date1ms = date1.getTime() - dateutil.tzOffset(date1);
        const date2ms = date2.getTime() - dateutil.tzOffset(date2);
        // Calculate the difference in milliseconds
        const differencems = date1ms - date2ms;
        // Convert back to days and return
        return Math.round(differencems / dateutil.ONE_DAY);
    };
    /**
     * @see: <http://docs.python.org/library/datetime.html#datetime.date.toordinal>
     */
    dateutil.toOrdinal = function (date) {
        return dateutil.daysBetween(date, dateutil.ORDINAL_BASE);
    };
    /**
     * @see - <http://docs.python.org/library/datetime.html#datetime.date.fromordinal>
     */
    dateutil.fromOrdinal = function (ordinal) {
        const millisecsFromBase = ordinal * dateutil.ONE_DAY;
        return new Date(dateutil.ORDINAL_BASE.getTime() -
            dateutil.tzOffset(dateutil.ORDINAL_BASE) +
            millisecsFromBase +
            dateutil.tzOffset(new Date(millisecsFromBase)));
    };
    dateutil.getMonthDays = function (date) {
        const month = date.getMonth();
        return month === 1 && dateutil.isLeapYear(date.getFullYear())
            ? 29
            : dateutil.MONTH_DAYS[month];
    };
    /**
     * @return {Number} python-like weekday
     */
    dateutil.getWeekday = function (date) {
        return dateutil.PY_WEEKDAYS[date.getDay()];
    };
    /**
     * @see: <http://docs.python.org/library/calendar.html#calendar.monthrange>
     */
    dateutil.monthRange = function (year, month) {
        const date = new Date(year, month, 1);
        return [dateutil.getWeekday(date), dateutil.getMonthDays(date)];
    };
    /**
     * @see: <http://docs.python.org/library/datetime.html#datetime.datetime.combine>
     */
    dateutil.combine = function (date, time) {
        time = time || date;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
    };
    dateutil.clone = function (date) {
        const dolly = new Date(date.getTime());
        return dolly;
    };
    dateutil.cloneDates = function (dates) {
        const clones = [];
        for (let i = 0; i < dates.length; i++) {
            clones.push(dateutil.clone(dates[i]));
        }
        return clones;
    };
    /**
     * Sorts an array of Date or dateutil.Time objects
     */
    dateutil.sort = function (dates) {
        dates.sort(function (a, b) {
            return a.getTime() - b.getTime();
        });
    };
    dateutil.timeToUntilString = function (time) {
        let comp;
        const date = new Date(time);
        const comps = [
            date.getUTCFullYear(),
            date.getUTCMonth() + 1,
            date.getUTCDate(),
            'T',
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
            'Z'
        ];
        for (let i = 0; i < comps.length; i++) {
            comp = comps[i];
            if (!/[TZ]/.test(comp.toString()) && comp < 10) {
                comps[i] = '0' + String(comp);
            }
        }
        return comps.join('');
    };
    dateutil.untilStringToDate = function (until) {
        const re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/;
        const bits = re.exec(until);
        if (!bits)
            throw new Error('Invalid UNTIL value: ' + until);
        return new Date(Date.UTC(parseInt(bits[1], 10), parseInt(bits[2], 10) - 1, parseInt(bits[3], 10), parseInt(bits[5], 10) || 0, parseInt(bits[6], 10) || 0, parseInt(bits[7], 10) || 0));
    };
    class Time {
        constructor(hour, minute, second, millisecond) {
            this.hour = hour;
            this.minute = minute;
            this.second = second;
            this.millisecond = millisecond || 0;
        }
        getHours() {
            return this.hour;
        }
        getMinutes() {
            return this.minute;
        }
        getSeconds() {
            return this.second;
        }
        getMilliseconds() {
            return this.millisecond;
        }
        getTime() {
            return ((this.hour * 60 * 60 + this.minute * 60 + this.second) * 1000 +
                this.millisecond);
        }
    }
    dateutil.Time = Time;
})(dateutil = exports.dateutil || (exports.dateutil = {}));
exports.default = dateutil;
//# sourceMappingURL=dateutil.js.map