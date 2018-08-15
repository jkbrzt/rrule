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
import { divmod, pymod, empty, includes, padStart } from './helpers';
/**
 * General date-related utilities.
 * Also handles several incompatibilities between JavaScript and Python
 *
 */
export var dateutil;
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
    dateutil.ORDINAL_BASE = new Date(Date.UTC(1970, 0, 1));
    /**
     * Python: MO-SU: 0 - 6
     * JS: SU-SAT 0 - 6
     */
    dateutil.PY_WEEKDAYS = [6, 0, 1, 2, 3, 4, 5];
    /**
     * py_date.timetuple()[7]
     */
    dateutil.getYearDay = function (date) {
        var dateNoTime = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        return (Math.ceil((dateNoTime.valueOf() -
            new Date(date.getUTCFullYear(), 0, 1).valueOf()) /
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
        var date1ms = date1.getTime() - dateutil.tzOffset(date1);
        var date2ms = date2.getTime() - dateutil.tzOffset(date2);
        // Calculate the difference in milliseconds
        var differencems = date1ms - date2ms;
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
        return new Date(dateutil.ORDINAL_BASE.getTime() + ordinal * dateutil.ONE_DAY);
    };
    dateutil.getMonthDays = function (date) {
        var month = date.getUTCMonth();
        return month === 1 && dateutil.isLeapYear(date.getUTCFullYear())
            ? 29
            : dateutil.MONTH_DAYS[month];
    };
    /**
     * @return {Number} python-like weekday
     */
    dateutil.getWeekday = function (date) {
        return dateutil.PY_WEEKDAYS[date.getUTCDay()];
    };
    /**
     * @see: <http://docs.python.org/library/calendar.html#calendar.monthrange>
     */
    dateutil.monthRange = function (year, month) {
        var date = new Date(Date.UTC(year, month, 1));
        return [dateutil.getWeekday(date), dateutil.getMonthDays(date)];
    };
    /**
     * @see: <http://docs.python.org/library/datetime.html#datetime.datetime.combine>
     */
    dateutil.combine = function (date, time) {
        time = time || date;
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds()));
    };
    dateutil.clone = function (date) {
        var dolly = new Date(date.getTime());
        return dolly;
    };
    dateutil.cloneDates = function (dates) {
        var clones = [];
        for (var i = 0; i < dates.length; i++) {
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
    dateutil.timeToUntilString = function (time, utc) {
        if (utc === void 0) { utc = true; }
        var date = new Date(time);
        return [
            padStart(date.getUTCFullYear().toString(), 4, '0'),
            padStart(date.getUTCMonth() + 1, 2, '0'),
            padStart(date.getUTCDate(), 2, '0'),
            'T',
            padStart(date.getUTCHours(), 2, '0'),
            padStart(date.getUTCMinutes(), 2, '0'),
            padStart(date.getUTCSeconds(), 2, '0'),
            utc ? 'Z' : ''
        ].join('');
    };
    dateutil.untilStringToDate = function (until) {
        var re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/;
        var bits = re.exec(until);
        if (!bits)
            throw new Error("Invalid UNTIL value: " + until);
        return new Date(Date.UTC(parseInt(bits[1], 10), parseInt(bits[2], 10) - 1, parseInt(bits[3], 10), parseInt(bits[5], 10) || 0, parseInt(bits[6], 10) || 0, parseInt(bits[7], 10) || 0));
    };
    var Time = /** @class */ (function () {
        function Time(hour, minute, second, millisecond) {
            this.hour = hour;
            this.minute = minute;
            this.second = second;
            this.millisecond = millisecond || 0;
        }
        Time.prototype.getHours = function () {
            return this.hour;
        };
        Time.prototype.getMinutes = function () {
            return this.minute;
        };
        Time.prototype.getSeconds = function () {
            return this.second;
        };
        Time.prototype.getMilliseconds = function () {
            return this.millisecond;
        };
        Time.prototype.getTime = function () {
            return ((this.hour * 60 * 60 + this.minute * 60 + this.second) * 1000 +
                this.millisecond);
        };
        return Time;
    }());
    dateutil.Time = Time;
    var DateTime = /** @class */ (function (_super) {
        __extends(DateTime, _super);
        function DateTime(year, month, day, hour, minute, second, millisecond) {
            var _this = _super.call(this, hour, minute, second, millisecond) || this;
            _this.year = year;
            _this.month = month;
            _this.day = day;
            return _this;
        }
        DateTime.prototype.getWeekday = function () {
            return dateutil.getWeekday(new Date(this.getTime()));
        };
        DateTime.prototype.getTime = function () {
            return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond)).getTime();
        };
        DateTime.prototype.getDay = function () {
            return this.day;
        };
        DateTime.prototype.getMonth = function () {
            return this.month;
        };
        DateTime.prototype.getYear = function () {
            return this.year;
        };
        DateTime.prototype.addYears = function (years) {
            this.year += years;
        };
        DateTime.prototype.addMonths = function (months) {
            this.month += months;
            if (this.month > 12) {
                var yearDiv = Math.floor(this.month / 12);
                var monthMod = pymod(this.month, 12);
                this.month = monthMod;
                this.year += yearDiv;
                if (this.month === 0) {
                    this.month = 12;
                    --this.year;
                }
            }
        };
        DateTime.prototype.addWeekly = function (days, wkst) {
            if (wkst > this.getWeekday()) {
                this.day += -(this.getWeekday() + 1 + (6 - wkst)) + days * 7;
            }
            else {
                this.day += -(this.getWeekday() - wkst) + days * 7;
            }
            this.fixDay();
        };
        DateTime.prototype.addDaily = function (days) {
            this.day += days;
            this.fixDay();
        };
        DateTime.prototype.addHours = function (hours, filtered, byhour) {
            var fixday = false;
            if (filtered) {
                // Jump to one iteration before next day
                this.hour += Math.floor((23 - this.hour) / hours) * hours;
            }
            while (true) {
                this.hour += hours;
                var _a = divmod(this.hour, 24), dayDiv = _a.div, hourMod = _a.mod;
                if (dayDiv) {
                    this.hour = hourMod;
                    this.addDaily(dayDiv);
                    fixday = true;
                }
                if (empty(byhour) || includes(byhour, this.hour))
                    break;
            }
            return fixday;
        };
        DateTime.prototype.addMinutes = function (minutes, filtered, byhour, byminute) {
            var fixday = false;
            if (filtered) {
                // Jump to one iteration before next day
                this.minute +=
                    Math.floor((1439 - (this.hour * 60 + this.minute)) / minutes) * minutes;
            }
            while (true) {
                this.minute += minutes;
                var _a = divmod(this.minute, 60), hourDiv = _a.div, minuteMod = _a.mod;
                if (hourDiv) {
                    this.minute = minuteMod;
                    fixday = this.addHours(hourDiv, false, byhour);
                }
                if ((empty(byhour) || includes(byhour, this.hour)) &&
                    (empty(byminute) || includes(byminute, this.minute))) {
                    break;
                }
            }
            return fixday;
        };
        DateTime.prototype.addSeconds = function (seconds, filtered, byhour, byminute, bysecond) {
            var fixday = false;
            if (filtered) {
                // Jump to one iteration before next day
                this.second +=
                    Math.floor((86399 - (this.hour * 3600 + this.minute * 60 + this.second)) / seconds) * seconds;
            }
            while (true) {
                this.second += seconds;
                var _a = divmod(this.second, 60), minuteDiv = _a.div, secondMod = _a.mod;
                if (minuteDiv) {
                    this.second = secondMod;
                    fixday = this.addMinutes(minuteDiv, false, byhour, byminute);
                }
                if ((empty(byhour) || includes(byhour, this.hour)) &&
                    (empty(byminute) || includes(byminute, this.minute)) &&
                    (empty(bysecond) || includes(bysecond, this.second))) {
                    break;
                }
            }
            return fixday;
        };
        DateTime.prototype.fixDay = function () {
            if (this.day <= 28) {
                return;
            }
            var daysinmonth = dateutil.monthRange(this.year, this.month - 1)[1];
            if (this.day <= daysinmonth) {
                return;
            }
            while (this.day > daysinmonth) {
                this.day -= daysinmonth;
                ++this.month;
                if (this.month === 13) {
                    this.month = 1;
                    ++this.year;
                    if (this.year > dateutil.MAXYEAR) {
                        return;
                    }
                }
                daysinmonth = dateutil.monthRange(this.year, this.month - 1)[1];
            }
        };
        return DateTime;
    }(Time));
    dateutil.DateTime = DateTime;
})(dateutil || (dateutil = {}));
export default dateutil;
//# sourceMappingURL=dateutil.js.map