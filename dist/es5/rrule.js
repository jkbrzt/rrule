(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("luxon"));
	else if(typeof define === 'function' && define.amd)
		define(["luxon"], factory);
	else if(typeof exports === 'object')
		exports["rrule"] = factory(require("luxon"));
	else
		root["rrule"] = factory(root["luxon"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE__2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return isPresent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return isNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return range; });
/* unused harmony export clone */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return repeat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return toArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return padStart; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return split; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return pymod; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return divmod; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return empty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return notEmpty; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return includes; });
// =============================================================================
// Helper functions
// =============================================================================
var isPresent = function (value) {
    return value !== null && value !== undefined;
};
var isNumber = function (value) {
    return typeof value === 'number';
};
var isArray = Array.isArray;
/**
 * Simplified version of python's range()
 */
var range = function (start, end) {
    if (end === void 0) { end = start; }
    if (arguments.length === 1) {
        end = start;
        start = 0;
    }
    var rang = [];
    for (var i = start; i < end; i++)
        rang.push(i);
    return rang;
};
var clone = function (array) {
    return [].concat(array);
};
var repeat = function (value, times) {
    var i = 0;
    var array = [];
    if (isArray(value)) {
        for (; i < times; i++)
            array[i] = [].concat(value);
    }
    else {
        for (; i < times; i++)
            array[i] = value;
    }
    return array;
};
var toArray = function (item) {
    if (isArray(item)) {
        return item;
    }
    return [item];
};
function padStart(item, targetLength, padString) {
    if (padString === void 0) { padString = ' '; }
    var str = String(item);
    targetLength = targetLength >> 0;
    if (str.length > targetLength) {
        return String(str);
    }
    targetLength = targetLength - str.length;
    if (targetLength > padString.length) {
        padString += repeat(padString, targetLength / padString.length);
    }
    return padString.slice(0, targetLength) + String(str);
}
/**
 * Python like split
 */
var split = function (str, sep, num) {
    var splits = str.split(sep);
    return num
        ? splits.slice(0, num).concat([splits.slice(num).join(sep)])
        : splits;
};
/**
 * closure/goog/math/math.js:modulo
 * Copyright 2006 The Closure Library Authors.
 * The % operator in JavaScript returns the remainder of a / b, but differs from
 * some other languages in that the result will have the same sign as the
 * dividend. For example, -1 % 8 == -1, whereas in some other languages
 * (such as Python) the result would be 7. This function emulates the more
 * correct modulo behavior, which is useful for certain applications such as
 * calculating an offset index in a circular list.
 *
 * @param {number} a The dividend.
 * @param {number} b The divisor.
 * @return {number} a % b where the result is between 0 and b (either 0 <= x < b
 *     or b < x <= 0, depending on the sign of b).
 */
var pymod = function (a, b) {
    var r = a % b;
    // If r and b differ in sign, add b to wrap the result to the correct sign.
    return r * b < 0 ? r + b : r;
};
/**
 * @see: <http://docs.python.org/library/functions.html#divmod>
 */
var divmod = function (a, b) {
    return { div: Math.floor(a / b), mod: pymod(a, b) };
};
var empty = function (obj) {
    return !isPresent(obj) || obj.length === 0;
};
/**
 * Python-like boolean
 * @return {Boolean} value of an object/primitive, taking into account
 * the fact that in Python an empty list's/tuple's
 * boolean value is False, whereas in JS it's true
 */
var notEmpty = function (obj) {
    return !empty(obj);
};
/**
 * Return true if a value is in an array
 */
var includes = function (arr, val) {
    return notEmpty(arr) && arr.indexOf(val) !== -1;
};
//# sourceMappingURL=helpers.js.map

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./dist/esm/helpers.js
var helpers = __webpack_require__(0);

// CONCATENATED MODULE: ./dist/esm/dateutil.js
var __extends = (undefined && undefined.__extends) || (function () {
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

/**
 * General date-related utilities.
 * Also handles several incompatibilities between JavaScript and Python
 *
 */
var dateutil_dateutil;
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
            Object(helpers["h" /* padStart */])(date.getUTCFullYear().toString(), 4, '0'),
            Object(helpers["h" /* padStart */])(date.getUTCMonth() + 1, 2, '0'),
            Object(helpers["h" /* padStart */])(date.getUTCDate(), 2, '0'),
            'T',
            Object(helpers["h" /* padStart */])(date.getUTCHours(), 2, '0'),
            Object(helpers["h" /* padStart */])(date.getUTCMinutes(), 2, '0'),
            Object(helpers["h" /* padStart */])(date.getUTCSeconds(), 2, '0'),
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
                var monthMod = Object(helpers["i" /* pymod */])(this.month, 12);
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
                var _a = Object(helpers["a" /* divmod */])(this.hour, 24), dayDiv = _a.div, hourMod = _a.mod;
                if (dayDiv) {
                    this.hour = hourMod;
                    this.addDaily(dayDiv);
                    fixday = true;
                }
                if (Object(helpers["b" /* empty */])(byhour) || Object(helpers["c" /* includes */])(byhour, this.hour))
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
                var _a = Object(helpers["a" /* divmod */])(this.minute, 60), hourDiv = _a.div, minuteMod = _a.mod;
                if (hourDiv) {
                    this.minute = minuteMod;
                    fixday = this.addHours(hourDiv, false, byhour);
                }
                if ((Object(helpers["b" /* empty */])(byhour) || Object(helpers["c" /* includes */])(byhour, this.hour)) &&
                    (Object(helpers["b" /* empty */])(byminute) || Object(helpers["c" /* includes */])(byminute, this.minute))) {
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
                var _a = Object(helpers["a" /* divmod */])(this.second, 60), minuteDiv = _a.div, secondMod = _a.mod;
                if (minuteDiv) {
                    this.second = secondMod;
                    fixday = this.addMinutes(minuteDiv, false, byhour, byminute);
                }
                if ((Object(helpers["b" /* empty */])(byhour) || Object(helpers["c" /* includes */])(byhour, this.hour)) &&
                    (Object(helpers["b" /* empty */])(byminute) || Object(helpers["c" /* includes */])(byminute, this.minute)) &&
                    (Object(helpers["b" /* empty */])(bysecond) || Object(helpers["c" /* includes */])(bysecond, this.second))) {
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
})(dateutil_dateutil || (dateutil_dateutil = {}));
/* harmony default export */ var esm_dateutil = (dateutil_dateutil);
//# sourceMappingURL=dateutil.js.map
// CONCATENATED MODULE: ./dist/esm/masks.js

// =============================================================================
// Date masks
// =============================================================================
// Every mask is 7 days longer to handle cross-year weekly periods.
var M365MASK = Object(helpers["k" /* repeat */])(1, 31).concat(Object(helpers["k" /* repeat */])(2, 28), Object(helpers["k" /* repeat */])(3, 31), Object(helpers["k" /* repeat */])(4, 30), Object(helpers["k" /* repeat */])(5, 31), Object(helpers["k" /* repeat */])(6, 30), Object(helpers["k" /* repeat */])(7, 31), Object(helpers["k" /* repeat */])(8, 31), Object(helpers["k" /* repeat */])(9, 30), Object(helpers["k" /* repeat */])(10, 31), Object(helpers["k" /* repeat */])(11, 30), Object(helpers["k" /* repeat */])(12, 31), Object(helpers["k" /* repeat */])(1, 7));
var M366MASK = Object(helpers["k" /* repeat */])(1, 31).concat(Object(helpers["k" /* repeat */])(2, 29), Object(helpers["k" /* repeat */])(3, 31), Object(helpers["k" /* repeat */])(4, 30), Object(helpers["k" /* repeat */])(5, 31), Object(helpers["k" /* repeat */])(6, 30), Object(helpers["k" /* repeat */])(7, 31), Object(helpers["k" /* repeat */])(8, 31), Object(helpers["k" /* repeat */])(9, 30), Object(helpers["k" /* repeat */])(10, 31), Object(helpers["k" /* repeat */])(11, 30), Object(helpers["k" /* repeat */])(12, 31), Object(helpers["k" /* repeat */])(1, 7));
var M28 = Object(helpers["j" /* range */])(1, 29);
var M29 = Object(helpers["j" /* range */])(1, 30);
var M30 = Object(helpers["j" /* range */])(1, 31);
var M31 = Object(helpers["j" /* range */])(1, 32);
var MDAY366MASK = M31.concat(M29, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
var MDAY365MASK = M31.concat(M28, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
var NM28 = Object(helpers["j" /* range */])(-28, 0);
var NM29 = Object(helpers["j" /* range */])(-29, 0);
var NM30 = Object(helpers["j" /* range */])(-30, 0);
var NM31 = Object(helpers["j" /* range */])(-31, 0);
var NMDAY366MASK = NM31.concat(NM29, NM31, NM30, NM31, NM30, NM31, NM31, NM30, NM31, NM30, NM31, NM31.slice(0, 7));
var NMDAY365MASK = NM31.concat(NM28, NM31, NM30, NM31, NM30, NM31, NM31, NM30, NM31, NM30, NM31, NM31.slice(0, 7));
var M366RANGE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
var M365RANGE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
var WDAYMASK = (function () {
    var wdaymask = [];
    for (var i = 0; i < 55; i++)
        wdaymask = wdaymask.concat(Object(helpers["j" /* range */])(7));
    return wdaymask;
})();

//# sourceMappingURL=masks.js.map
// CONCATENATED MODULE: ./dist/esm/iterinfo.js




// =============================================================================
// Iterinfo
// =============================================================================
var iterinfo_Iterinfo = /** @class */ (function () {
    function Iterinfo(rrule) {
        this.yearlen = 365;
        this.nextyearlen = 365;
        this.rrule = rrule;
        this.mmask = null;
        this.mrange = null;
        this.mdaymask = null;
        this.nmdaymask = null;
        this.wdaymask = null;
        this.wnomask = null;
        this.nwdaymask = null;
        this.eastermask = null;
    }
    Iterinfo.prototype.easter = function (y, offset) {
        if (offset === void 0) { offset = 0; }
        var a = y % 19;
        var b = Math.floor(y / 100);
        var c = y % 100;
        var d = Math.floor(b / 4);
        var e = b % 4;
        var f = Math.floor((b + 8) / 25);
        var g = Math.floor((b - f + 1) / 3);
        var h = Math.floor(19 * a + b - d - g + 15) % 30;
        var i = Math.floor(c / 4);
        var k = c % 4;
        var l = Math.floor(32 + 2 * e + 2 * i - h - k) % 7;
        var m = Math.floor((a + 11 * h + 22 * l) / 451);
        var month = Math.floor((h + l - 7 * m + 114) / 31);
        var day = ((h + l - 7 * m + 114) % 31) + 1;
        var date = Date.UTC(y, month - 1, day + offset);
        var yearStart = Date.UTC(y, 0, 1);
        return [Math.ceil((date - yearStart) / (1000 * 60 * 60 * 24))];
    };
    Iterinfo.prototype.rebuild = function (year, month) {
        var rr = this.rrule;
        if (year !== this.lastyear) {
            this.rebuildYear(year);
        }
        if (Object(helpers["g" /* notEmpty */])(rr.options.bynweekday) &&
            (month !== this.lastmonth || year !== this.lastyear)) {
            this.rebuildMonth(year, month);
        }
        if (Object(helpers["f" /* isPresent */])(rr.options.byeaster)) {
            this.eastermask = this.easter(year, rr.options.byeaster);
        }
    };
    Iterinfo.prototype.rebuildYear = function (year) {
        var rr = this.rrule;
        this.yearlen = esm_dateutil.isLeapYear(year) ? 366 : 365;
        this.nextyearlen = esm_dateutil.isLeapYear(year + 1) ? 366 : 365;
        var firstyday = new Date(Date.UTC(year, 0, 1));
        this.yearordinal = esm_dateutil.toOrdinal(firstyday);
        this.yearweekday = esm_dateutil.getWeekday(firstyday);
        var wday = esm_dateutil.getWeekday(firstyday);
        if (this.yearlen === 365) {
            this.mmask = M365MASK;
            this.mdaymask = MDAY365MASK;
            this.nmdaymask = NMDAY365MASK;
            this.wdaymask = WDAYMASK.slice(wday);
            this.mrange = M365RANGE;
        }
        else {
            this.mmask = M366MASK;
            this.mdaymask = MDAY366MASK;
            this.nmdaymask = NMDAY366MASK;
            this.wdaymask = WDAYMASK.slice(wday);
            this.mrange = M366RANGE;
        }
        if (Object(helpers["b" /* empty */])(rr.options.byweekno)) {
            this.wnomask = null;
        }
        else {
            this.wnomask = Object(helpers["k" /* repeat */])(0, this.yearlen + 7);
            var no1wkst = void 0;
            var firstwkst = void 0;
            var wyearlen = void 0;
            no1wkst = firstwkst = Object(helpers["i" /* pymod */])(7 - this.yearweekday + rr.options.wkst, 7);
            if (no1wkst >= 4) {
                no1wkst = 0;
                // Number of days in the year, plus the days we got
                // from last year.
                wyearlen =
                    this.yearlen + Object(helpers["i" /* pymod */])(this.yearweekday - rr.options.wkst, 7);
            }
            else {
                // Number of days in the year, minus the days we
                // left in last year.
                wyearlen = this.yearlen - no1wkst;
            }
            var div = Math.floor(wyearlen / 7);
            var mod = Object(helpers["i" /* pymod */])(wyearlen, 7);
            var numweeks = Math.floor(div + mod / 4);
            for (var j = 0; j < rr.options.byweekno.length; j++) {
                var i = void 0;
                var n = rr.options.byweekno[j];
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
                for (var k = 0; k < 7; k++) {
                    this.wnomask[i] = 1;
                    i++;
                    if (this.wdaymask[i] === rr.options.wkst)
                        break;
                }
            }
            if (Object(helpers["c" /* includes */])(rr.options.byweekno, 1)) {
                // Check week number 1 of next year as well
                // orig-TODO : Check -numweeks for next year.
                var i = no1wkst + numweeks * 7;
                if (no1wkst !== firstwkst)
                    i -= 7 - firstwkst;
                if (i < this.yearlen) {
                    // If week starts in next year, we
                    // don't care about it.
                    for (var j = 0; j < 7; j++) {
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
                var lnumweeks = void 0;
                if (!Object(helpers["c" /* includes */])(rr.options.byweekno, -1)) {
                    var lyearweekday = esm_dateutil.getWeekday(new Date(Date.UTC(year - 1, 0, 1)));
                    var lno1wkst = Object(helpers["i" /* pymod */])(7 - lyearweekday.valueOf() + rr.options.wkst, 7);
                    var lyearlen = esm_dateutil.isLeapYear(year - 1) ? 366 : 365;
                    if (lno1wkst >= 4) {
                        lno1wkst = 0;
                        lnumweeks = Math.floor(52 +
                            Object(helpers["i" /* pymod */])(lyearlen + Object(helpers["i" /* pymod */])(lyearweekday - rr.options.wkst, 7), 7) /
                                4);
                    }
                    else {
                        lnumweeks = Math.floor(52 + Object(helpers["i" /* pymod */])(this.yearlen - no1wkst, 7) / 4);
                    }
                }
                else {
                    lnumweeks = -1;
                }
                if (Object(helpers["c" /* includes */])(rr.options.byweekno, lnumweeks)) {
                    for (var i = 0; i < no1wkst; i++)
                        this.wnomask[i] = 1;
                }
            }
        }
    };
    Iterinfo.prototype.rebuildMonth = function (year, month) {
        var rr = this.rrule;
        var ranges = [];
        if (rr.options.freq === esm_rrule.YEARLY) {
            if (Object(helpers["g" /* notEmpty */])(rr.options.bymonth)) {
                for (var j = 0; j < rr.options.bymonth.length; j++) {
                    month = rr.options.bymonth[j];
                    ranges.push(this.mrange.slice(month - 1, month + 1));
                }
            }
            else {
                ranges = [[0, this.yearlen]];
            }
        }
        else if (rr.options.freq === esm_rrule.MONTHLY) {
            ranges = [this.mrange.slice(month - 1, month + 1)];
        }
        if (Object(helpers["g" /* notEmpty */])(ranges)) {
            // Weekly frequency won't get here, so we may not
            // care about cross-year weekly periods.
            this.nwdaymask = Object(helpers["k" /* repeat */])(0, this.yearlen);
            for (var j = 0; j < ranges.length; j++) {
                var rang = ranges[j];
                var first = rang[0];
                var last = rang[1];
                last -= 1;
                for (var k = 0; k < rr.options.bynweekday.length; k++) {
                    var i = void 0;
                    var wday = rr.options.bynweekday[k][0];
                    var n = rr.options.bynweekday[k][1];
                    if (n < 0) {
                        i = last + (n + 1) * 7;
                        i -= Object(helpers["i" /* pymod */])(this.wdaymask[i] - wday, 7);
                    }
                    else {
                        i = first + (n - 1) * 7;
                        i += Object(helpers["i" /* pymod */])(7 - this.wdaymask[i] + wday, 7);
                    }
                    if (first <= i && i <= last)
                        this.nwdaymask[i] = 1;
                }
            }
        }
        this.lastyear = year;
        this.lastmonth = month;
    };
    Iterinfo.prototype.ydayset = function () {
        return [Object(helpers["j" /* range */])(this.yearlen), 0, this.yearlen];
    };
    Iterinfo.prototype.mdayset = function (_, month, __) {
        var start = this.mrange[month - 1];
        var end = this.mrange[month];
        var set = Object(helpers["k" /* repeat */])(null, this.yearlen);
        for (var i = start; i < end; i++)
            set[i] = i;
        return [set, start, end];
    };
    Iterinfo.prototype.wdayset = function (year, month, day) {
        // We need to handle cross-year weeks here.
        var set = Object(helpers["k" /* repeat */])(null, this.yearlen + 7);
        var i = esm_dateutil.toOrdinal(new Date(Date.UTC(year, month - 1, day))) -
            this.yearordinal;
        var start = i;
        for (var j = 0; j < 7; j++) {
            set[i] = i;
            ++i;
            if (this.wdaymask[i] === this.rrule.options.wkst)
                break;
        }
        return [set, start, i];
    };
    Iterinfo.prototype.ddayset = function (year, month, day) {
        var set = Object(helpers["k" /* repeat */])(null, this.yearlen);
        var i = esm_dateutil.toOrdinal(new Date(Date.UTC(year, month - 1, day))) -
            this.yearordinal;
        set[i] = i;
        return [set, i, i + 1];
    };
    Iterinfo.prototype.htimeset = function (hour, minute, second, millisecond) {
        var set = [];
        var rr = this.rrule;
        for (var i = 0; i < rr.options.byminute.length; i++) {
            minute = rr.options.byminute[i];
            for (var j = 0; j < rr.options.bysecond.length; j++) {
                second = rr.options.bysecond[j];
                set.push(new esm_dateutil.Time(hour, minute, second, millisecond));
            }
        }
        esm_dateutil.sort(set);
        return set;
    };
    Iterinfo.prototype.mtimeset = function (hour, minute, second, millisecond) {
        var set = [];
        var rr = this.rrule;
        for (var j = 0; j < rr.options.bysecond.length; j++) {
            second = rr.options.bysecond[j];
            set.push(new esm_dateutil.Time(hour, minute, second, millisecond));
        }
        esm_dateutil.sort(set);
        return set;
    };
    Iterinfo.prototype.stimeset = function (hour, minute, second, millisecond) {
        return [new esm_dateutil.Time(hour, minute, second, millisecond)];
    };
    return Iterinfo;
}());
/* harmony default export */ var iterinfo = (iterinfo_Iterinfo);
//# sourceMappingURL=iterinfo.js.map
// CONCATENATED MODULE: ./dist/esm/iterresult.js
/**
 * This class helps us to emulate python's generators, sorta.
 */
var IterResult = /** @class */ (function () {
    function IterResult(method, args) {
        this.minDate = null;
        this.maxDate = null;
        this._result = [];
        this.total = 0;
        this.method = method;
        this.args = args;
        if (method === 'between') {
            this.maxDate = args.inc
                ? args.before
                : new Date(args.before.getTime() - 1);
            this.minDate = args.inc ? args.after : new Date(args.after.getTime() + 1);
        }
        else if (method === 'before') {
            this.maxDate = args.inc ? args.dt : new Date(args.dt.getTime() - 1);
        }
        else if (method === 'after') {
            this.minDate = args.inc ? args.dt : new Date(args.dt.getTime() + 1);
        }
    }
    /**
     * Possibly adds a date into the result.
     *
     * @param {Date} date - the date isn't necessarly added to the result
     *                      list (if it is too late/too early)
     * @return {Boolean} true if it makes sense to continue the iteration
     *                   false if we're done.
     */
    IterResult.prototype.accept = function (date) {
        ++this.total;
        var tooEarly = this.minDate && date < this.minDate;
        var tooLate = this.maxDate && date > this.maxDate;
        if (this.method === 'between') {
            if (tooEarly)
                return true;
            if (tooLate)
                return false;
        }
        else if (this.method === 'before') {
            if (tooLate)
                return false;
        }
        else if (this.method === 'after') {
            if (tooEarly)
                return true;
            this.add(date);
            return false;
        }
        return this.add(date);
    };
    /**
     *
     * @param {Date} date that is part of the result.
     * @return {Boolean} whether we are interested in more values.
     */
    IterResult.prototype.add = function (date) {
        this._result.push(date);
        return true;
    };
    /**
     * 'before' and 'after' return only one date, whereas 'all'
     * and 'between' an array.
     * @return {Date,Array?}
     */
    IterResult.prototype.getValue = function () {
        var res = this._result;
        switch (this.method) {
            case 'all':
            case 'between':
                return res;
            case 'before':
            case 'after':
                return res.length ? res[res.length - 1] : null;
        }
    };
    IterResult.prototype.clone = function () {
        return new IterResult(this.method, this.args);
    };
    return IterResult;
}());
/* harmony default export */ var iterresult = (IterResult);
//# sourceMappingURL=iterresult.js.map
// CONCATENATED MODULE: ./dist/esm/callbackiterresult.js
var callbackiterresult_extends = (undefined && undefined.__extends) || (function () {
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

/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
var CallbackIterResult = /** @class */ (function (_super) {
    callbackiterresult_extends(CallbackIterResult, _super);
    function CallbackIterResult(method, args, iterator) {
        var _this = _super.call(this, method, args) || this;
        _this.iterator = iterator;
        return _this;
    }
    CallbackIterResult.prototype.add = function (date) {
        if (this.iterator(date, this._result.length)) {
            this._result.push(date);
            return true;
        }
        return false;
    };
    return CallbackIterResult;
}(iterresult));
/* harmony default export */ var callbackiterresult = (CallbackIterResult);
//# sourceMappingURL=callbackiterresult.js.map
// CONCATENATED MODULE: ./dist/esm/types.js
var Frequency;
(function (Frequency) {
    Frequency[Frequency["YEARLY"] = 0] = "YEARLY";
    Frequency[Frequency["MONTHLY"] = 1] = "MONTHLY";
    Frequency[Frequency["WEEKLY"] = 2] = "WEEKLY";
    Frequency[Frequency["DAILY"] = 3] = "DAILY";
    Frequency[Frequency["HOURLY"] = 4] = "HOURLY";
    Frequency[Frequency["MINUTELY"] = 5] = "MINUTELY";
    Frequency[Frequency["SECONDLY"] = 6] = "SECONDLY";
})(Frequency || (Frequency = {}));
//# sourceMappingURL=types.js.map
// CONCATENATED MODULE: ./dist/esm/weekday.js
// =============================================================================
// Weekday
// =============================================================================
var WDAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
var Weekday = /** @class */ (function () {
    function Weekday(weekday, n) {
        if (n === 0)
            throw new Error("Can't create weekday with n == 0");
        this.weekday = weekday;
        this.n = n;
    }
    // __call__ - Cannot call the object directly, do it through
    // e.g. RRule.TH.nth(-1) instead,
    Weekday.prototype.nth = function (n) {
        return this.n === n ? this : new Weekday(this.weekday, n);
    };
    // __eq__
    Weekday.prototype.equals = function (other) {
        return this.weekday === other.weekday && this.n === other.n;
    };
    // __repr__
    Weekday.prototype.toString = function () {
        var s = WDAYS[this.weekday];
        if (this.n)
            s = (this.n > 0 ? '+' : '') + String(this.n) + s;
        return s;
    };
    Weekday.prototype.getJsWeekday = function () {
        return this.weekday === 6 ? 0 : this.weekday + 1;
    };
    return Weekday;
}());

//# sourceMappingURL=weekday.js.map
// CONCATENATED MODULE: ./dist/esm/parseoptions.js




function initializeOptions(options) {
    var invalid = [];
    var keys = Object.keys(options);
    var initializedOptions = {};
    // Shallow copy for options and origOptions and check for invalid
    keys.forEach(function (key) {
        initializedOptions[key] = options[key];
        if (!Object(helpers["c" /* includes */])(rrule_defaultKeys, key))
            invalid.push(key);
    });
    if (invalid.length) {
        throw new Error('Invalid options: ' + invalid.join(', '));
    }
    return initializedOptions;
}
function parseOptions(options) {
    var opts = initializeOptions(options);
    var keys = Object.keys(options);
    // Merge in default options
    rrule_defaultKeys.forEach(function (key) {
        if (!Object(helpers["c" /* includes */])(keys, key))
            opts[key] = DEFAULT_OPTIONS[key];
    });
    if (Object(helpers["f" /* isPresent */])(opts.byeaster))
        opts.freq = esm_rrule.YEARLY;
    if (!(Object(helpers["f" /* isPresent */])(opts.freq) && esm_rrule.FREQUENCIES[opts.freq])) {
        throw new Error("Invalid frequency: " + opts.freq);
    }
    if (!opts.dtstart)
        opts.dtstart = new Date(new Date().setMilliseconds(0));
    var millisecondModulo = opts.dtstart.getTime() % 1000;
    if (!Object(helpers["f" /* isPresent */])(opts.wkst)) {
        opts.wkst = esm_rrule.MO.weekday;
    }
    else if (Object(helpers["e" /* isNumber */])(opts.wkst)) {
        // cool, just keep it like that
    }
    else {
        opts.wkst = opts.wkst.weekday;
    }
    if (Object(helpers["f" /* isPresent */])(opts.bysetpos)) {
        if (Object(helpers["e" /* isNumber */])(opts.bysetpos))
            opts.bysetpos = [opts.bysetpos];
        for (var i = 0; i < opts.bysetpos.length; i++) {
            var v = opts.bysetpos[i];
            if (v === 0 || !(v >= -366 && v <= 366)) {
                throw new Error('bysetpos must be between 1 and 366,' + ' or between -366 and -1');
            }
        }
    }
    if (!(Boolean(opts.byweekno) ||
        Object(helpers["g" /* notEmpty */])(opts.byweekno) ||
        Object(helpers["g" /* notEmpty */])(opts.byyearday) ||
        Boolean(opts.bymonthday) ||
        Object(helpers["g" /* notEmpty */])(opts.bymonthday) ||
        Object(helpers["f" /* isPresent */])(opts.byweekday) ||
        Object(helpers["f" /* isPresent */])(opts.byeaster))) {
        switch (opts.freq) {
            case esm_rrule.YEARLY:
                if (!opts.bymonth)
                    opts.bymonth = opts.dtstart.getUTCMonth() + 1;
                opts.bymonthday = opts.dtstart.getUTCDate();
                break;
            case esm_rrule.MONTHLY:
                opts.bymonthday = opts.dtstart.getUTCDate();
                break;
            case esm_rrule.WEEKLY:
                opts.byweekday = [esm_dateutil.getWeekday(opts.dtstart)];
                break;
        }
    }
    // bymonth
    if (Object(helpers["f" /* isPresent */])(opts.bymonth) && !Object(helpers["d" /* isArray */])(opts.bymonth)) {
        opts.bymonth = [opts.bymonth];
    }
    // byyearday
    if (Object(helpers["f" /* isPresent */])(opts.byyearday) &&
        !Object(helpers["d" /* isArray */])(opts.byyearday) &&
        Object(helpers["e" /* isNumber */])(opts.byyearday)) {
        opts.byyearday = [opts.byyearday];
    }
    // bymonthday
    if (!Object(helpers["f" /* isPresent */])(opts.bymonthday)) {
        opts.bymonthday = [];
        opts.bynmonthday = [];
    }
    else if (Object(helpers["d" /* isArray */])(opts.bymonthday)) {
        var bymonthday = [];
        var bynmonthday = [];
        for (var i = 0; i < opts.bymonthday.length; i++) {
            var v = opts.bymonthday[i];
            if (v > 0) {
                bymonthday.push(v);
            }
            else if (v < 0) {
                bynmonthday.push(v);
            }
        }
        opts.bymonthday = bymonthday;
        opts.bynmonthday = bynmonthday;
    }
    else if (opts.bymonthday < 0) {
        opts.bynmonthday = [opts.bymonthday];
        opts.bymonthday = [];
    }
    else {
        opts.bynmonthday = [];
        opts.bymonthday = [opts.bymonthday];
    }
    // byweekno
    if (Object(helpers["f" /* isPresent */])(opts.byweekno) && !Object(helpers["d" /* isArray */])(opts.byweekno)) {
        opts.byweekno = [opts.byweekno];
    }
    // byweekday / bynweekday
    if (!Object(helpers["f" /* isPresent */])(opts.byweekday)) {
        opts.bynweekday = null;
    }
    else if (Object(helpers["e" /* isNumber */])(opts.byweekday)) {
        opts.byweekday = [opts.byweekday];
        opts.bynweekday = null;
    }
    else if (opts.byweekday instanceof Weekday) {
        if (!opts.byweekday.n || opts.freq > esm_rrule.MONTHLY) {
            opts.byweekday = [opts.byweekday.weekday];
            opts.bynweekday = null;
        }
        else {
            opts.bynweekday = [[opts.byweekday.weekday, opts.byweekday.n]];
            opts.byweekday = null;
        }
    }
    else {
        var byweekday = [];
        var bynweekday = [];
        for (var i = 0; i < opts.byweekday.length; i++) {
            var wday = opts.byweekday[i];
            if (Object(helpers["e" /* isNumber */])(wday)) {
                byweekday.push(wday);
                continue;
            }
            var wd = wday;
            if (!wd.n || opts.freq > esm_rrule.MONTHLY) {
                byweekday.push(wd.weekday);
            }
            else {
                bynweekday.push([wd.weekday, wd.n]);
            }
        }
        opts.byweekday = Object(helpers["g" /* notEmpty */])(byweekday) ? byweekday : null;
        opts.bynweekday = Object(helpers["g" /* notEmpty */])(bynweekday) ? bynweekday : null;
    }
    // byhour
    if (!Object(helpers["f" /* isPresent */])(opts.byhour)) {
        opts.byhour =
            opts.freq < esm_rrule.HOURLY ? [opts.dtstart.getUTCHours()] : null;
    }
    else if (Object(helpers["e" /* isNumber */])(opts.byhour)) {
        opts.byhour = [opts.byhour];
    }
    // byminute
    if (!Object(helpers["f" /* isPresent */])(opts.byminute)) {
        opts.byminute =
            opts.freq < esm_rrule.MINUTELY ? [opts.dtstart.getUTCMinutes()] : null;
    }
    else if (Object(helpers["e" /* isNumber */])(opts.byminute)) {
        opts.byminute = [opts.byminute];
    }
    // bysecond
    if (!Object(helpers["f" /* isPresent */])(opts.bysecond)) {
        opts.bysecond =
            opts.freq < esm_rrule.SECONDLY ? [opts.dtstart.getUTCSeconds()] : null;
    }
    else if (Object(helpers["e" /* isNumber */])(opts.bysecond)) {
        opts.bysecond = [opts.bysecond];
    }
    var timeset;
    if (opts.freq >= esm_rrule.HOURLY) {
        timeset = null;
    }
    else {
        timeset = [];
        for (var i = 0; i < opts.byhour.length; i++) {
            var hour = opts.byhour[i];
            for (var j = 0; j < opts.byminute.length; j++) {
                var minute = opts.byminute[j];
                for (var k = 0; k < opts.bysecond.length; k++) {
                    var second = opts.bysecond[k];
                    // python:
                    // datetime.time(hour, minute, second,
                    // tzinfo=self._tzinfo))
                    timeset.push(new esm_dateutil.Time(hour, minute, second, millisecondModulo));
                }
            }
        }
        esm_dateutil.sort(timeset);
    }
    return { parsedOptions: opts, timeset: timeset };
}
//# sourceMappingURL=parseoptions.js.map
// CONCATENATED MODULE: ./dist/esm/parsestring.js




function parseString(rfcString) {
    rfcString = rfcString.replace(/^\s+|\s+$/, '');
    if (!rfcString.length)
        return null;
    var options = {};
    var dtstartWithZone = /^DTSTART;TZID=(.+?):([^;]+)$/.exec(rfcString);
    if (dtstartWithZone) {
        var _ = dtstartWithZone[0], tzid = dtstartWithZone[1], dtstart = dtstartWithZone[2];
        options.tzid = tzid;
        options.dtstart = esm_dateutil.untilStringToDate(dtstart);
        return options;
    }
    var attrs = rfcString.split(';');
    for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i].split('=');
        var key = attr[0];
        var value = attr[1];
        switch (key) {
            case 'FREQ':
                options.freq = Frequency[value];
                break;
            case 'WKST':
                options.wkst = Days[value];
                break;
            case 'COUNT':
            case 'INTERVAL':
            case 'BYSETPOS':
            case 'BYMONTH':
            case 'BYMONTHDAY':
            case 'BYYEARDAY':
            case 'BYWEEKNO':
            case 'BYHOUR':
            case 'BYMINUTE':
            case 'BYSECOND':
                var num = void 0;
                if (value.indexOf(',') !== -1) {
                    var values = value.split(',');
                    num = values.map(function (val) {
                        if (/^[+-]?\d+$/.test(val.toString())) {
                            return Number(val);
                        }
                        else {
                            return val;
                        }
                    });
                }
                else if (/^[+-]?\d+$/.test(value)) {
                    num = Number(value);
                }
                else {
                    num = value;
                }
                var optionKey = key.toLowerCase();
                // @ts-ignore
                options[optionKey] = num;
                break;
            case 'BYDAY': // => byweekday
                var n = void 0;
                var wday = void 0;
                var day = void 0;
                var days = value.split(',');
                options.byweekday = [];
                for (var j = 0; j < days.length; j++) {
                    day = days[j];
                    if (day.length === 2) {
                        // MO, TU, ...
                        wday = Days[day]; // wday instanceof Weekday
                        options.byweekday.push(wday);
                    }
                    else {
                        // -1MO, +3FR, 1SO, ...
                        var parts = day.match(/^([+-]?\d)([A-Z]{2})$/);
                        n = Number(parts[1]);
                        var wdaypart = parts[2];
                        wday = Days[wdaypart].weekday;
                        options.byweekday.push(new Weekday(wday, n));
                    }
                }
                break;
            case 'DTSTART':
                options.dtstart = esm_dateutil.untilStringToDate(value);
                break;
            case 'UNTIL':
                options.until = esm_dateutil.untilStringToDate(value);
                break;
            case 'BYEASTER':
                options.byeaster = Number(value);
                break;
            default:
                throw new Error("Unknown RRULE property '" + key + "'");
        }
    }
    return options;
}
//# sourceMappingURL=parsestring.js.map
// CONCATENATED MODULE: ./dist/esm/optionstostring.js




function optionsToString(options) {
    var pairs = [];
    var keys = Object.keys(options);
    var defaultKeys = Object.keys(DEFAULT_OPTIONS);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] === 'tzid')
            continue;
        if (!Object(helpers["c" /* includes */])(defaultKeys, keys[i]))
            continue;
        var key = keys[i].toUpperCase();
        var value = options[keys[i]];
        var outValue = '';
        if (!Object(helpers["f" /* isPresent */])(value) || (Object(helpers["d" /* isArray */])(value) && !value.length))
            continue;
        switch (key) {
            case 'FREQ':
                outValue = esm_rrule.FREQUENCIES[options.freq];
                break;
            case 'WKST':
                if (Object(helpers["e" /* isNumber */])(value)) {
                    outValue = new Weekday(value).toString();
                }
                else {
                    outValue = value.toString();
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
                var arrayValue = Object(helpers["m" /* toArray */])(value);
                outValue = Object(helpers["m" /* toArray */])(value).map(function (wday) {
                    if (wday instanceof Weekday) {
                        return wday;
                    }
                    else if (Object(helpers["d" /* isArray */])(wday)) {
                        return new Weekday(wday[0], wday[1]);
                    }
                    else {
                        return new Weekday(wday);
                    }
                }).toString();
                break;
            case 'DTSTART':
            case 'UNTIL':
                outValue = esm_dateutil.timeToUntilString(value, !options.tzid);
                if (options.tzid) {
                    outValue = ";TZID=" + options.tzid + ":" + outValue;
                }
                break;
            default:
                if (Object(helpers["d" /* isArray */])(value)) {
                    var strValues = [];
                    for (var j = 0; j < value.length; j++) {
                        strValues[j] = String(value[j]);
                    }
                    outValue = strValues.toString();
                }
                else {
                    outValue = String(value);
                }
        }
        pairs.push([key, outValue]);
    }
    var strings = [];
    for (var i = 0; i < pairs.length; i++) {
        var _a = pairs[i], key = _a[0], value = _a[1];
        if (value.indexOf(';') === 0) {
            strings.push("" + key + value);
        }
        else {
            strings.push(key + "=" + value.toString());
        }
    }
    return strings.join(';');
}
//# sourceMappingURL=optionstostring.js.map
// CONCATENATED MODULE: ./dist/esm/cache.js



var cache_Cache = /** @class */ (function () {
    function Cache() {
        this.all = false;
        this.before = [];
        this.after = [];
        this.between = [];
    }
    /**
     * @param {String} what - all/before/after/between
     * @param {Array,Date} value - an array of dates, one date, or null
     * @param {Object?} args - _iter arguments
     */
    Cache.prototype._cacheAdd = function (what, value, args) {
        if (value) {
            value =
                value instanceof Date
                    ? esm_dateutil.clone(value)
                    : esm_dateutil.cloneDates(value);
        }
        if (what === 'all') {
            this.all = value;
        }
        else {
            args._value = value;
            this[what].push(args);
        }
    };
    /**
     * @return false - not in the cache
     *         null  - cached, but zero occurrences (before/after)
     *         Date  - cached (before/after)
     *         []    - cached, but zero occurrences (all/between)
     *         [Date1, DateN] - cached (all/between)
     */
    Cache.prototype._cacheGet = function (what, args) {
        var cached = false;
        var argsKeys = args ? Object.keys(args) : [];
        var findCacheDiff = function (item) {
            for (var i = 0; i < argsKeys.length; i++) {
                var key = argsKeys[i];
                if (String(args[key]) !== String(item[key])) {
                    return true;
                }
            }
            return false;
        };
        var cachedObject = this[what];
        if (what === 'all') {
            cached = this.all;
        }
        else if (Object(helpers["d" /* isArray */])(cachedObject)) {
            // Let's see whether we've already called the
            // 'what' method with the same 'args'
            for (var i = 0; i < cachedObject.length; i++) {
                var item = cachedObject[i];
                if (argsKeys.length && findCacheDiff(item))
                    continue;
                cached = item._value;
                break;
            }
        }
        if (!cached && this.all) {
            // Not in the cache, but we already know all the occurrences,
            // so we can find the correct dates from the cached ones.
            var iterResult = new iterresult(what, args);
            for (var i = 0; i < this.all.length; i++) {
                if (!iterResult.accept(this.all[i]))
                    break;
            }
            cached = iterResult.getValue();
            this._cacheAdd(what, cached, args);
        }
        return Object(helpers["d" /* isArray */])(cached)
            ? esm_dateutil.cloneDates(cached)
            : cached instanceof Date
                ? esm_dateutil.clone(cached)
                : cached;
    };
    return Cache;
}());

//# sourceMappingURL=cache.js.map
// EXTERNAL MODULE: external "luxon"
var external_luxon_ = __webpack_require__(2);

// CONCATENATED MODULE: ./dist/esm/rrule.js












var getnlp = function () {
    // Lazy, runtime import to avoid circular refs.
    if (!getnlp._nlp) {
        getnlp._nlp = __webpack_require__(3);
    }
    return getnlp._nlp;
};
// =============================================================================
// RRule
// =============================================================================
var Days = {
    MO: new Weekday(0),
    TU: new Weekday(1),
    WE: new Weekday(2),
    TH: new Weekday(3),
    FR: new Weekday(4),
    SA: new Weekday(5),
    SU: new Weekday(6)
};
var DEFAULT_OPTIONS = {
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
var rrule_defaultKeys = Object.keys(DEFAULT_OPTIONS);
/**
 *
 * @param {Options?} options - see <http://labix.org/python-dateutil/#head-cf004ee9a75592797e076752b2a889c10f445418>
 *        The only required option is `freq`, one of RRule.YEARLY, RRule.MONTHLY, ...
 * @constructor
 */
var rrule_RRule = /** @class */ (function () {
    function RRule(options, noCache) {
        if (options === void 0) { options = {}; }
        if (noCache === void 0) { noCache = false; }
        // RFC string
        this._string = null;
        this._cache = noCache ? null : new cache_Cache();
        // used by toString()
        this.origOptions = initializeOptions(options);
        var _a = parseOptions(options), parsedOptions = _a.parsedOptions, timeset = _a.timeset;
        this.options = parsedOptions;
        this.timeset = timeset;
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
            return this._iter(new callbackiterresult('all', {}, iterator));
        }
        else {
            var result = this._cacheGet('all');
            if (result === false) {
                result = this._iter(new iterresult('all', {}));
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
        var args = {
            before: before,
            after: after,
            inc: inc
        };
        if (iterator) {
            return this._iter(new callbackiterresult('between', args, iterator));
        }
        var result = this._cacheGet('between', args);
        if (result === false) {
            result = this._iter(new iterresult('between', args));
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
        var args = { dt: dt, inc: inc };
        var result = this._cacheGet('before', args);
        if (result === false) {
            result = this._iter(new iterresult('before', args));
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
        var args = { dt: dt, inc: inc };
        var result = this._cacheGet('after', args);
        if (result === false) {
            result = this._iter(new iterresult('after', args));
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
    RRule.prototype._iter = function (iterResult) {
        /* Since JavaScript doesn't have the python's yield operator (<1.7),
            we use the IterResult object that tells us when to stop iterating.
    
        */
        var _a, _b;
        var dtstart = this.options.dtstart;
        var date = new esm_dateutil.DateTime(dtstart.getUTCFullYear(), dtstart.getUTCMonth() + 1, dtstart.getUTCDate(), dtstart.getUTCHours(), dtstart.getUTCMinutes(), dtstart.getUTCSeconds(), dtstart.valueOf() % 1000);
        // Some local variables to speed things up a bit
        var _c = this.options, freq = _c.freq, interval = _c.interval, wkst = _c.wkst, until = _c.until, bymonth = _c.bymonth, byweekno = _c.byweekno, byyearday = _c.byyearday, byweekday = _c.byweekday, byeaster = _c.byeaster, bymonthday = _c.bymonthday, bynmonthday = _c.bynmonthday, bysetpos = _c.bysetpos, byhour = _c.byhour, byminute = _c.byminute, bysecond = _c.bysecond;
        var ii = new iterinfo(this);
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
            timeset = this.timeset;
        }
        else {
            gettimeset = (_b = {},
                _b[RRule.HOURLY] = ii.htimeset,
                _b[RRule.MINUTELY] = ii.mtimeset,
                _b[RRule.SECONDLY] = ii.stimeset,
                _b)[freq];
            if ((freq >= RRule.HOURLY &&
                Object(helpers["g" /* notEmpty */])(byhour) &&
                !Object(helpers["c" /* includes */])(byhour, date.hour)) ||
                (freq >= RRule.MINUTELY &&
                    Object(helpers["g" /* notEmpty */])(byminute) &&
                    !Object(helpers["c" /* includes */])(byminute, date.minute)) ||
                (freq >= RRule.SECONDLY &&
                    Object(helpers["g" /* notEmpty */])(bysecond) &&
                    !Object(helpers["c" /* includes */])(bysecond, date.second))) {
                timeset = [];
            }
            else {
                timeset = gettimeset.call(ii, date.hour, date.minute, date.second, date.millisecond);
            }
        }
        var currentDay;
        var count = this.options.count;
        var pos;
        while (true) {
            // Get dayset with the right frequency
            var _d = getdayset.call(ii, date.year, date.month, date.day), dayset = _d[0], start = _d[1], end = _d[2];
            // Do the "hard" work ;-)
            var filtered = false;
            for (var dayCounter = start; dayCounter < end; dayCounter++) {
                currentDay = dayset[dayCounter];
                filtered = isFiltered(bymonth, ii, currentDay, byweekno, byweekday, byeaster, bymonthday, bynmonthday, byyearday);
                if (filtered)
                    dayset[currentDay] = null;
            }
            // Output results
            if (Object(helpers["g" /* notEmpty */])(bysetpos) && Object(helpers["g" /* notEmpty */])(timeset)) {
                var daypos = void 0;
                var timepos = void 0;
                var poslist = [];
                for (var j = 0; j < bysetpos.length; j++) {
                    pos = bysetpos[j];
                    if (pos < 0) {
                        daypos = Math.floor(pos / timeset.length);
                        timepos = Object(helpers["i" /* pymod */])(pos, timeset.length);
                    }
                    else {
                        daypos = Math.floor((pos - 1) / timeset.length);
                        timepos = Object(helpers["i" /* pymod */])(pos - 1, timeset.length);
                    }
                    var tmp = [];
                    for (var k = start; k < end; k++) {
                        var val = dayset[k];
                        if (!Object(helpers["f" /* isPresent */])(val))
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
                    var date_1 = esm_dateutil.fromOrdinal(ii.yearordinal + i);
                    var res = esm_dateutil.combine(date_1, time);
                    // XXX: can this ever be in the array?
                    // - compare the actual date instead?
                    if (!Object(helpers["c" /* includes */])(poslist, res))
                        poslist.push(res);
                }
                esm_dateutil.sort(poslist);
                for (var j = 0; j < poslist.length; j++) {
                    var res = poslist[j];
                    if (until && res > until) {
                        return this.emitResult(iterResult);
                    }
                    if (res >= dtstart) {
                        var rezonedDate = this.rezoneIfNeeded(res);
                        if (!iterResult.accept(rezonedDate)) {
                            return this.emitResult(iterResult);
                        }
                        if (count) {
                            --count;
                            if (!count) {
                                return this.emitResult(iterResult);
                            }
                        }
                    }
                }
            }
            else {
                for (var j = start; j < end; j++) {
                    currentDay = dayset[j];
                    if (!Object(helpers["f" /* isPresent */])(currentDay)) {
                        continue;
                    }
                    var date_2 = esm_dateutil.fromOrdinal(ii.yearordinal + currentDay);
                    for (var k = 0; k < timeset.length; k++) {
                        var time = timeset[k];
                        var res = esm_dateutil.combine(date_2, time);
                        if (until && res > until) {
                            return this.emitResult(iterResult);
                        }
                        if (res >= dtstart) {
                            var rezonedDate = this.rezoneIfNeeded(res);
                            if (!iterResult.accept(rezonedDate)) {
                                return this.emitResult(iterResult);
                            }
                            if (count) {
                                --count;
                                if (!count) {
                                    return this.emitResult(iterResult);
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
            if (date.year > esm_dateutil.MAXYEAR) {
                return this.emitResult(iterResult);
            }
            ii.rebuild(date.year, date.month);
        }
    };
    RRule.prototype.emitResult = function (iterResult) {
        this._len = iterResult.total;
        return iterResult.getValue();
    };
    RRule.prototype.rezoneIfNeeded = function (date) {
        var tzid = this.options.tzid;
        if (!tzid) {
            return date;
        }
        try {
            var datetime = external_luxon_["DateTime"]
                .fromJSDate(date);
            var rezoned = datetime.setZone(tzid, { keepLocalTime: true });
            return rezoned.toJSDate();
        }
        catch (e) {
            if (e instanceof TypeError) {
                console.error('Using TZID without Luxon available is unsupported. Returned times are in UTC, not the requested time zone');
            }
            return date;
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
/* harmony default export */ var esm_rrule = (rrule_RRule);
function isFiltered(bymonth, ii, currentDay, byweekno, byweekday, byeaster, bymonthday, bynmonthday, byyearday) {
    return ((Object(helpers["g" /* notEmpty */])(bymonth) && !Object(helpers["c" /* includes */])(bymonth, ii.mmask[currentDay])) ||
        (Object(helpers["g" /* notEmpty */])(byweekno) && !ii.wnomask[currentDay]) ||
        (Object(helpers["g" /* notEmpty */])(byweekday) && !Object(helpers["c" /* includes */])(byweekday, ii.wdaymask[currentDay])) ||
        (Object(helpers["g" /* notEmpty */])(ii.nwdaymask) && !ii.nwdaymask[currentDay]) ||
        (byeaster !== null && !Object(helpers["c" /* includes */])(ii.eastermask, currentDay)) ||
        ((Object(helpers["g" /* notEmpty */])(bymonthday) || Object(helpers["g" /* notEmpty */])(bynmonthday)) &&
            !Object(helpers["c" /* includes */])(bymonthday, ii.mdaymask[currentDay]) &&
            !Object(helpers["c" /* includes */])(bynmonthday, ii.nmdaymask[currentDay])) ||
        (Object(helpers["g" /* notEmpty */])(byyearday) &&
            ((currentDay < ii.yearlen &&
                !Object(helpers["c" /* includes */])(byyearday, currentDay + 1) &&
                !Object(helpers["c" /* includes */])(byyearday, -ii.yearlen + currentDay)) ||
                (currentDay >= ii.yearlen &&
                    !Object(helpers["c" /* includes */])(byyearday, currentDay + 1 - ii.yearlen) &&
                    !Object(helpers["c" /* includes */])(byyearday, -ii.nextyearlen + currentDay - ii.yearlen)))));
}
//# sourceMappingURL=rrule.js.map
// CONCATENATED MODULE: ./dist/esm/rruleset.js
var rruleset_extends = (undefined && undefined.__extends) || (function () {
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



/**
 *
 * @param {Boolean?} noCache
 *  The same stratagy as RRule on cache, default to false
 * @constructor
 */
var rruleset_RRuleSet = /** @class */ (function (_super) {
    rruleset_extends(RRuleSet, _super);
    function RRuleSet(noCache) {
        if (noCache === void 0) { noCache = false; }
        var _this = _super.call(this, {}, noCache) || this;
        _this._rrule = [];
        _this._rdate = [];
        _this._exrule = [];
        _this._exdate = [];
        return _this;
    }
    /**
     * Adds an RRule to the set
     *
     * @param {RRule}
     */
    RRuleSet.prototype.rrule = function (rrule) {
        if (!(rrule instanceof esm_rrule)) {
            throw new TypeError(String(rrule) + ' is not RRule instance');
        }
        if (!Object(helpers["c" /* includes */])(this._rrule.map(String), String(rrule))) {
            this._rrule.push(rrule);
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
        if (!Object(helpers["c" /* includes */])(this._rdate.map(Number), Number(date))) {
            this._rdate.push(date);
            esm_dateutil.sort(this._rdate);
        }
    };
    /**
     * Adds an EXRULE to the set
     *
     * @param {RRule}
     */
    RRuleSet.prototype.exrule = function (rrule) {
        if (!(rrule instanceof esm_rrule)) {
            throw new TypeError(String(rrule) + ' is not RRule instance');
        }
        if (!Object(helpers["c" /* includes */])(this._exrule.map(String), String(rrule))) {
            this._exrule.push(rrule);
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
        if (!Object(helpers["c" /* includes */])(this._exdate.map(Number), Number(date))) {
            this._exdate.push(date);
            esm_dateutil.sort(this._exdate);
        }
    };
    RRuleSet.prototype.valueOf = function () {
        var result = [];
        if (this._rrule.length) {
            this._rrule.forEach(function (rrule) {
                result.push('RRULE:' + rrule);
            });
        }
        if (this._rdate.length) {
            result.push('RDATE:' +
                this._rdate
                    .map(function (rdate) {
                    return esm_dateutil.timeToUntilString(rdate.valueOf());
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
                    return esm_dateutil.timeToUntilString(exdate.valueOf());
                })
                    .join(','));
        }
        return result;
    };
    /**
     * to generate recurrence field sush as:
     *   ["RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU;DTSTART=19970902T010000Z","RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH;DTSTART=19970902T010000Z"]
     */
    RRuleSet.prototype.toString = function () {
        return JSON.stringify(this.valueOf());
    };
    RRuleSet.prototype._iter = function (iterResult) {
        var _exdateHash = {};
        var _exrule = this._exrule;
        var _accept = iterResult.accept;
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
            var dt = Number(date);
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
                var dt = Number(date);
                if (!_exdateHash[dt]) {
                    _exdateHash[dt] = true;
                    return _accept.call(this, date);
                }
                return true;
            };
        }
        for (var i = 0; i < this._rdate.length; i++) {
            if (!iterResult.accept(new Date(this._rdate[i].valueOf())))
                break;
        }
        this._rrule.forEach(function (rrule) {
            rrule._iter(iterResult);
        });
        var res = iterResult._result;
        esm_dateutil.sort(res);
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
    };
    /**
     * Create a new RRuleSet Object completely base on current instance
     */
    RRuleSet.prototype.clone = function () {
        var rrs = new RRuleSet(!!this._cache);
        var i;
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
    };
    return RRuleSet;
}(esm_rrule));
/* harmony default export */ var rruleset = (rruleset_RRuleSet);
//# sourceMappingURL=rruleset.js.map
// CONCATENATED MODULE: ./dist/esm/rrulestr.js





/**
 * RRuleStr
 *  To parse a set of rrule strings
 */
var rrulestr_RRuleStr = /** @class */ (function () {
    function RRuleStr() {
        // tslint:disable:variable-name
        this._handle_BYDAY = this._handle_BYWEEKDAY;
        this._handle_INTERVAL = this._handle_int;
        this._handle_COUNT = this._handle_int;
        this._handle_BYSETPOS = this._handle_int_list;
        this._handle_BYMONTH = this._handle_int_list;
        this._handle_BYMONTHDAY = this._handle_int_list;
        this._handle_BYYEARDAY = this._handle_int_list;
        this._handle_BYEASTER = this._handle_int_list;
        this._handle_BYWEEKNO = this._handle_int_list;
        this._handle_BYHOUR = this._handle_int_list;
        this._handle_BYMINUTE = this._handle_int_list;
        this._handle_BYSECOND = this._handle_int_list;
        // tslint:enable:variable-name
    }
    // tslint:disable-next-line:variable-name
    RRuleStr.prototype._handle_DTSTART = function (rrkwargs, _, value, __) {
        var parms = /^DTSTART(?:;TZID=([^:=]+))?(?::|=)(.*)/.exec(value);
        var ___ = parms[0], tzid = parms[1], dtstart = parms[2];
        rrkwargs['dtstart'] = esm_dateutil.untilStringToDate(dtstart);
        if (tzid) {
            rrkwargs['tzid'] = tzid;
        }
    };
    RRuleStr.prototype._handle_int = function (rrkwargs, name, value) {
        // @ts-ignore
        rrkwargs[name.toLowerCase()] = parseInt(value, 10);
    };
    RRuleStr.prototype._handle_int_list = function (rrkwargs, name, value) {
        // @ts-ignore
        rrkwargs[name.toLowerCase()] = value.split(',').map(function (x) { return parseInt(x, 10); });
    };
    RRuleStr.prototype._handle_FREQ = function (rrkwargs, _, value, __) {
        rrkwargs['freq'] = RRuleStr._freq_map[value];
    };
    RRuleStr.prototype._handle_UNTIL = function (rrkwargs, _, value, __) {
        try {
            rrkwargs['until'] = esm_dateutil.untilStringToDate(value);
        }
        catch (error) {
            throw new Error('invalid until date');
        }
    };
    RRuleStr.prototype._handle_WKST = function (rrkwargs, _, value, __) {
        rrkwargs['wkst'] = RRuleStr._weekday_map[value];
    };
    RRuleStr.prototype._handle_BYWEEKDAY = function (rrkwargs, _, value, __) {
        // Two ways to specify this: +1MO or MO(+1)
        var splt;
        var i;
        var j;
        var n;
        var w;
        var wday;
        var l = [];
        var wdays = value.split(',');
        for (i = 0; i < wdays.length; i++) {
            wday = wdays[i];
            if (wday.indexOf('(') > -1) {
                // If it's of the form TH(+1), etc.
                splt = wday.split('(');
                w = splt[0];
                n = parseInt(splt.slice(1, -1)[0], 10);
            }
            else {
                // # If it's of the form +1MO
                for (j = 0; j < wday.length; j++) {
                    if ('+-0123456789'.indexOf(wday[j]) === -1)
                        break;
                }
                n = wday.slice(0, j) || null;
                w = wday.slice(j);
                if (n)
                    n = parseInt(n, 10);
            }
            var weekday = new Weekday(RRuleStr._weekday_map[w], n);
            l.push(weekday);
        }
        rrkwargs['byweekday'] = l;
    };
    RRuleStr.prototype._parseRfcRRule = function (line, options) {
        if (options === void 0) { options = {}; }
        options.dtstart = options.dtstart || null;
        options.cache = options.cache || false;
        var name;
        var value;
        var parts;
        var nameRegex = /^([A-Z]+):(.*)$/;
        var nameParts = nameRegex.exec(line);
        if (nameParts && nameParts.length >= 3) {
            name = nameParts[1];
            value = nameParts[2];
            if (name !== 'RRULE')
                throw new Error("unknown parameter name " + name);
        }
        else {
            value = line;
        }
        var rrkwargs = {};
        var dtstart = /DTSTART(?:;TZID=[^:]+:)?[^;]+/.exec(line);
        if (dtstart && dtstart.length > 0) {
            var dtstartClause = dtstart[0];
            this._handle_DTSTART(rrkwargs, 'DTSTART', dtstartClause);
        }
        var pairs = value.split(';');
        for (var i = 0; i < pairs.length; i++) {
            parts = pairs[i].split('=');
            name = parts[0].toUpperCase();
            if (/DTSTART|TZID/.test(name)) {
                continue;
            }
            value = parts[1].toUpperCase();
            // @ts-ignore
            var paramHandler = this["_handle_" + name];
            if (typeof paramHandler !== 'function') {
                throw new Error("unknown parameter '" + name + "':" + value);
            }
            paramHandler(rrkwargs, name, value);
        }
        rrkwargs.dtstart = rrkwargs.dtstart || options.dtstart;
        rrkwargs.tzid = rrkwargs.tzid || options.tzid;
        return new esm_rrule(rrkwargs, !options.cache);
    };
    RRuleStr.prototype._parseRfc = function (s, options) {
        if (options.compatible) {
            options.forceset = true;
            options.unfold = true;
        }
        s = s && s.trim();
        if (!s)
            throw new Error('Invalid empty string');
        var i = 0;
        var line;
        var lines;
        // More info about 'unfold' option
        // Go head to http://www.ietf.org/rfc/rfc2445.txt
        if (options.unfold) {
            lines = s.split('\n');
            while (i < lines.length) {
                // TODO
                line = lines[i] = lines[i].replace(/\s+$/g, '');
                if (!line) {
                    lines.splice(i, 1);
                }
                else if (i > 0 && line[0] === ' ') {
                    lines[i - 1] += line.slice(1);
                    lines.splice(i, 1);
                }
                else {
                    i += 1;
                }
            }
        }
        else {
            lines = s.split(/\s/);
        }
        var rrulevals = [];
        var rdatevals = [];
        var exrulevals = [];
        var exdatevals = [];
        var name;
        var value;
        var parts;
        var dtstart;
        var tzid;
        var rset;
        var j;
        var k;
        var datestrs;
        var datestr;
        if (!options.forceset &&
            lines.length === 1 &&
            (s.indexOf(':') === -1 || s.indexOf('RRULE:') === 0)) {
            return this._parseRfcRRule(lines[0], {
                cache: options.cache,
                dtstart: options.dtstart
            });
        }
        else {
            for (var i_1 = 0; i_1 < lines.length; i_1++) {
                line = lines[i_1];
                if (!line)
                    continue;
                if (line.indexOf(':') === -1) {
                    name = 'RRULE';
                    value = line;
                }
                else {
                    parts = Object(helpers["l" /* split */])(line, ':', 1);
                    name = parts[0];
                    value = parts[1];
                }
                var parms = name.split(';');
                if (!parms)
                    throw new Error('empty property name');
                name = parms[0].toUpperCase();
                parms = parms.slice(1);
                if (name === 'RRULE') {
                    for (j = 0; j < parms.length; j++) {
                        var parm = parms[j];
                        throw new Error('unsupported RRULE parm: ' + parm);
                    }
                    rrulevals.push(value);
                }
                else if (name === 'RDATE') {
                    for (j = 0; j < parms.length; j++) {
                        var parm = parms[j];
                        if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
                            throw new Error('unsupported RDATE parm: ' + parm);
                        }
                    }
                    rdatevals.push(value);
                }
                else if (name === 'EXRULE') {
                    for (j = 0; j < parms.length; j++) {
                        var parm = parms[j];
                        throw new Error('unsupported EXRULE parm: ' + parm);
                    }
                    exrulevals.push(value);
                }
                else if (name === 'EXDATE') {
                    for (j = 0; j < parms.length; j++) {
                        var parm = parms[j];
                        if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
                            throw new Error('unsupported EXDATE parm: ' + parm);
                        }
                    }
                    exdatevals.push(value);
                }
                else if (name === 'DTSTART') {
                    dtstart = esm_dateutil.untilStringToDate(value);
                    if (parms.length) {
                        var _a = parms[0].split('='), key = _a[0], value_1 = _a[1];
                        if (key === 'TZID') {
                            tzid = value_1;
                        }
                    }
                }
                else {
                    throw new Error('unsupported property: ' + name);
                }
            }
            if (options.forceset ||
                rrulevals.length > 1 ||
                rdatevals.length ||
                exrulevals.length ||
                exdatevals.length) {
                rset = new rruleset(!options.cache);
                for (j = 0; j < rrulevals.length; j++) {
                    rset.rrule(this._parseRfcRRule(rrulevals[j], {
                        // @ts-ignore
                        dtstart: options.dtstart || dtstart
                    }));
                }
                for (j = 0; j < rdatevals.length; j++) {
                    datestrs = rdatevals[j].split(',');
                    for (k = 0; k < datestrs.length; k++) {
                        datestr = datestrs[k];
                        rset.rdate(esm_dateutil.untilStringToDate(datestr));
                    }
                }
                for (j = 0; j < exrulevals.length; j++) {
                    rset.exrule(this._parseRfcRRule(exrulevals[j], {
                        // @ts-ignore
                        dtstart: options.dtstart || dtstart
                    }));
                }
                for (j = 0; j < exdatevals.length; j++) {
                    datestrs = exdatevals[j].split(',');
                    for (k = 0; k < datestrs.length; k++) {
                        datestr = datestrs[k];
                        rset.exdate(esm_dateutil.untilStringToDate(datestr));
                    }
                }
                // @ts-ignore
                if (options.compatible && options.dtstart)
                    rset.rdate(dtstart);
                return rset;
            }
            else {
                return this._parseRfcRRule(rrulevals[0], {
                    // @ts-ignore
                    dtstart: options.dtstart || dtstart,
                    cache: options.cache,
                    // @ts-ignore
                    tzid: options.tzid || tzid
                });
            }
        }
    };
    RRuleStr.prototype.parse = function (s, options) {
        if (options === void 0) { options = {}; }
        var invalid = [];
        var keys = Object.keys(options);
        var defaultKeys = Object.keys(RRuleStr.DEFAULT_OPTIONS);
        keys.forEach(function (key) {
            if (!Object(helpers["c" /* includes */])(defaultKeys, key))
                invalid.push(key);
        }, this);
        if (invalid.length) {
            throw new Error('Invalid options: ' + invalid.join(', '));
        }
        // Merge in default options
        defaultKeys.forEach(function (key) {
            if (!Object(helpers["c" /* includes */])(keys, key))
                options[key] = RRuleStr.DEFAULT_OPTIONS[key];
        });
        return this._parseRfc(s, options);
    };
    // tslint:disable-next-line:variable-name
    RRuleStr._weekday_map = {
        MO: 0,
        TU: 1,
        WE: 2,
        TH: 3,
        FR: 4,
        SA: 5,
        SU: 6
    };
    // tslint:disable-next-line:variable-name
    RRuleStr._freq_map = {
        YEARLY: esm_rrule.YEARLY,
        MONTHLY: esm_rrule.MONTHLY,
        WEEKLY: esm_rrule.WEEKLY,
        DAILY: esm_rrule.DAILY,
        HOURLY: esm_rrule.HOURLY,
        MINUTELY: esm_rrule.MINUTELY,
        SECONDLY: esm_rrule.SECONDLY
    };
    RRuleStr.DEFAULT_OPTIONS = {
        dtstart: null,
        cache: false,
        unfold: false,
        forceset: false,
        compatible: false,
        tzid: null
    };
    return RRuleStr;
}());
/* harmony default export */ var rrulestr = (rrulestr_RRuleStr);
//# sourceMappingURL=rrulestr.js.map
// CONCATENATED MODULE: ./dist/esm/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rrulestr", function() { return esm_rrulestr; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Frequency", function() { return Frequency; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "Weekday", function() { return Weekday; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "RRule", function() { return esm_rrule; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "RRuleSet", function() { return rruleset; });
/*!
 * rrule.js - Library for working with recurrence rules for calendar dates.
 * https://github.com/jakubroztocil/rrule
 *
 * Copyright 2010, Jakub Roztocil and Lars Schoning
 * Licenced under the BSD licence.
 * https://github.com/jakubroztocil/rrule/blob/master/LICENCE
 *
 * Based on:
 * python-dateutil - Extensions to the standard Python datetime module.
 * Copyright (c) 2003-2011 - Gustavo Niemeyer <gustavo@niemeyer.net>
 * Copyright (c) 2012 - Tomi Pieviläinen <tomi.pievilainen@iki.fi>
 * https://github.com/jakubroztocil/rrule/blob/master/LICENCE
 *
 */





// =============================================================================
// Export
// =============================================================================
// Only one RRuleStr instance for all rrule string parsing work.
var rruleStr = new rrulestr();
var esm_rrulestr = function () {
    return rruleStr.parse.apply(rruleStr, arguments);
};

/* harmony default export */ var esm = __webpack_exports__["default"] = (esm_rrule);
//# sourceMappingURL=index.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./dist/esm/nlp/i18n.js
// =============================================================================
// i18n
// =============================================================================
var ENGLISH = {
    dayNames: [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
    ],
    monthNames: [
        'January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September', 'October',
        'November', 'December'
    ],
    tokens: {
        'SKIP': /^[ \r\n\t]+|^\.$/,
        'number': /^[1-9][0-9]*/,
        'numberAsText': /^(one|two|three)/i,
        'every': /^every/i,
        'day(s)': /^days?/i,
        'weekday(s)': /^weekdays?/i,
        'week(s)': /^weeks?/i,
        'hour(s)': /^hours?/i,
        'minute(s)': /^minutes?/i,
        'month(s)': /^months?/i,
        'year(s)': /^years?/i,
        'on': /^(on|in)/i,
        'at': /^(at)/i,
        'the': /^the/i,
        'first': /^first/i,
        'second': /^second/i,
        'third': /^third/i,
        'nth': /^([1-9][0-9]*)(\.|th|nd|rd|st)/i,
        'last': /^last/i,
        'for': /^for/i,
        'time(s)': /^times?/i,
        'until': /^(un)?til/i,
        'monday': /^mo(n(day)?)?/i,
        'tuesday': /^tu(e(s(day)?)?)?/i,
        'wednesday': /^we(d(n(esday)?)?)?/i,
        'thursday': /^th(u(r(sday)?)?)?/i,
        'friday': /^fr(i(day)?)?/i,
        'saturday': /^sa(t(urday)?)?/i,
        'sunday': /^su(n(day)?)?/i,
        'january': /^jan(uary)?/i,
        'february': /^feb(ruary)?/i,
        'march': /^mar(ch)?/i,
        'april': /^apr(il)?/i,
        'may': /^may/i,
        'june': /^june?/i,
        'july': /^july?/i,
        'august': /^aug(ust)?/i,
        'september': /^sep(t(ember)?)?/i,
        'october': /^oct(ober)?/i,
        'november': /^nov(ember)?/i,
        'december': /^dec(ember)?/i,
        'comma': /^(,\s*|(and|or)\s*)+/i
    }
};
/* harmony default export */ var i18n = (ENGLISH);
//# sourceMappingURL=i18n.js.map
// EXTERNAL MODULE: ./dist/esm/index.js + 14 modules
var esm = __webpack_require__(1);

// EXTERNAL MODULE: ./dist/esm/helpers.js
var helpers = __webpack_require__(0);

// CONCATENATED MODULE: ./dist/esm/nlp/totext.js



// =============================================================================
// Helper functions
// =============================================================================
/**
 * Return true if a value is in an array
 */
var contains = function (arr, val) {
    return arr.indexOf(val) !== -1;
};
var defaultGetText = function (id) { return id.toString(); };
/**
 *
 * @param {RRule} rrule
 * Optional:
 * @param {Function} gettext function
 * @param {Object} language definition
 * @constructor
 */
var totext_ToText = /** @class */ (function () {
    function ToText(rrule, gettext, language) {
        if (gettext === void 0) { gettext = defaultGetText; }
        if (language === void 0) { language = i18n; }
        this.text = [];
        this.language = language || i18n;
        this.gettext = gettext;
        this.rrule = rrule;
        this.options = rrule.options;
        this.origOptions = rrule.origOptions;
        if (this.origOptions.bymonthday) {
            var bymonthday = [].concat(this.options.bymonthday);
            var bynmonthday = [].concat(this.options.bynmonthday);
            bymonthday.sort(function (a, b) { return a - b; });
            bynmonthday.sort(function (a, b) { return b - a; });
            // 1, 2, 3, .., -5, -4, -3, ..
            this.bymonthday = bymonthday.concat(bynmonthday);
            if (!this.bymonthday.length)
                this.bymonthday = null;
        }
        if (Object(helpers["f" /* isPresent */])(this.origOptions.byweekday)) {
            var byweekday = !Object(helpers["d" /* isArray */])(this.origOptions.byweekday)
                ? [this.origOptions.byweekday]
                : this.origOptions.byweekday;
            var days = String(byweekday);
            this.byweekday = {
                allWeeks: byweekday.filter(function (weekday) {
                    return !weekday.n;
                }),
                someWeeks: byweekday.filter(function (weekday) {
                    return Boolean(weekday.n);
                }),
                isWeekdays: days.indexOf('MO') !== -1 &&
                    days.indexOf('TU') !== -1 &&
                    days.indexOf('WE') !== -1 &&
                    days.indexOf('TH') !== -1 &&
                    days.indexOf('FR') !== -1 &&
                    days.indexOf('SA') === -1 &&
                    days.indexOf('SU') === -1,
                isEveryDay: days.indexOf('MO') !== -1 &&
                    days.indexOf('TU') !== -1 &&
                    days.indexOf('WE') !== -1 &&
                    days.indexOf('TH') !== -1 &&
                    days.indexOf('FR') !== -1 &&
                    days.indexOf('SA') !== -1 &&
                    days.indexOf('SU') !== -1
            };
            var sortWeekDays = function (a, b) {
                return a.weekday - b.weekday;
            };
            this.byweekday.allWeeks.sort(sortWeekDays);
            this.byweekday.someWeeks.sort(sortWeekDays);
            if (!this.byweekday.allWeeks.length)
                this.byweekday.allWeeks = null;
            if (!this.byweekday.someWeeks.length)
                this.byweekday.someWeeks = null;
        }
        else {
            this.byweekday = null;
        }
    }
    /**
     * Test whether the rrule can be fully converted to text.
     * @param {RRule} rrule
     * @return {Boolean}
     */
    ToText.isFullyConvertible = function (rrule) {
        var canConvert = true;
        if (!(rrule.options.freq in ToText.IMPLEMENTED))
            return false;
        if (rrule.origOptions.until && rrule.origOptions.count)
            return false;
        for (var key in rrule.origOptions) {
            if (contains(['dtstart', 'wkst', 'freq'], key))
                return true;
            if (!contains(ToText.IMPLEMENTED[rrule.options.freq], key))
                return false;
        }
        return canConvert;
    };
    ToText.prototype.isFullyConvertible = function () {
        return ToText.isFullyConvertible(this.rrule);
    };
    /**
     * Perform the conversion. Only some of the frequencies are supported.
     * If some of the rrule's options aren't supported, they'll
     * be omitted from the output an "(~ approximate)" will be appended.
     * @return {*}
     */
    ToText.prototype.toString = function () {
        var gettext = this.gettext;
        if (!(this.options.freq in ToText.IMPLEMENTED)) {
            return gettext('RRule error: Unable to fully convert this rrule to text');
        }
        this.text = [gettext('every')];
        // @ts-ignore
        this[esm["default"].FREQUENCIES[this.options.freq]]();
        if (this.options.until) {
            this.add(gettext('until'));
            var until = this.options.until;
            this.add(this.language.monthNames[until.getUTCMonth()])
                .add(until.getUTCDate() + ',')
                .add(until.getUTCFullYear().toString());
        }
        else if (this.options.count) {
            this.add(gettext('for'))
                .add(this.options.count.toString())
                .add(this.plural(this.options.count) ? gettext('times') : gettext('time'));
        }
        if (!this.isFullyConvertible())
            this.add(gettext('(~ approximate)'));
        return this.text.join('');
    };
    ToText.prototype.HOURLY = function () {
        var gettext = this.gettext;
        if (this.options.interval !== 1)
            this.add(this.options.interval.toString());
        this.add(this.plural(this.options.interval) ? gettext('hours') : gettext('hour'));
    };
    ToText.prototype.MINUTELY = function () {
        var gettext = this.gettext;
        if (this.options.interval !== 1)
            this.add(this.options.interval.toString());
        this.add(this.plural(this.options.interval)
            ? gettext('minutes')
            : gettext('minutes'));
    };
    ToText.prototype.DAILY = function () {
        var gettext = this.gettext;
        if (this.options.interval !== 1)
            this.add(this.options.interval.toString());
        if (this.byweekday && this.byweekday.isWeekdays) {
            this.add(this.plural(this.options.interval)
                ? gettext('weekdays')
                : gettext('weekday'));
        }
        else {
            this.add(this.plural(this.options.interval) ? gettext('days') : gettext('day'));
        }
        if (this.origOptions.bymonth) {
            this.add(gettext('in'));
            this._bymonth();
        }
        if (this.bymonthday) {
            this._bymonthday();
        }
        else if (this.byweekday) {
            this._byweekday();
        }
        else if (this.origOptions.byhour) {
            this._byhour();
        }
    };
    ToText.prototype.WEEKLY = function () {
        var gettext = this.gettext;
        if (this.options.interval !== 1) {
            this.add(this.options.interval.toString()).add(this.plural(this.options.interval) ? gettext('weeks') : gettext('week'));
        }
        if (this.byweekday && this.byweekday.isWeekdays) {
            if (this.options.interval === 1) {
                this.add(this.plural(this.options.interval)
                    ? gettext('weekdays')
                    : gettext('weekday'));
            }
            else {
                this.add(gettext('on')).add(gettext('weekdays'));
            }
        }
        else if (this.byweekday && this.byweekday.isEveryDay) {
            this.add(this.plural(this.options.interval) ? gettext('days') : gettext('day'));
        }
        else {
            if (this.options.interval === 1)
                this.add(gettext('week'));
            if (this.origOptions.bymonth) {
                this.add(gettext('in'));
                this._bymonth();
            }
            if (this.bymonthday) {
                this._bymonthday();
            }
            else if (this.byweekday) {
                this._byweekday();
            }
        }
    };
    ToText.prototype.MONTHLY = function () {
        var gettext = this.gettext;
        if (this.origOptions.bymonth) {
            if (this.options.interval !== 1) {
                this.add(this.options.interval.toString()).add(gettext('months'));
                if (this.plural(this.options.interval))
                    this.add(gettext('in'));
            }
            else {
                // this.add(gettext('MONTH'))
            }
            this._bymonth();
        }
        else {
            if (this.options.interval !== 1)
                this.add(this.options.interval.toString());
            this.add(this.plural(this.options.interval)
                ? gettext('months')
                : gettext('month'));
        }
        if (this.bymonthday) {
            this._bymonthday();
        }
        else if (this.byweekday && this.byweekday.isWeekdays) {
            this.add(gettext('on')).add(gettext('weekdays'));
        }
        else if (this.byweekday) {
            this._byweekday();
        }
    };
    ToText.prototype.YEARLY = function () {
        var gettext = this.gettext;
        if (this.origOptions.bymonth) {
            if (this.options.interval !== 1) {
                this.add(this.options.interval.toString());
                this.add(gettext('years'));
            }
            else {
                // this.add(gettext('YEAR'))
            }
            this._bymonth();
        }
        else {
            if (this.options.interval !== 1)
                this.add(this.options.interval.toString());
            this.add(this.plural(this.options.interval) ? gettext('years') : gettext('year'));
        }
        if (this.bymonthday) {
            this._bymonthday();
        }
        else if (this.byweekday) {
            this._byweekday();
        }
        if (this.options.byyearday) {
            this.add(gettext('on the'))
                .add(this.list(this.options.byyearday, this.nth, gettext('and')))
                .add(gettext('day'));
        }
        if (this.options.byweekno) {
            this.add(gettext('in'))
                .add(this.plural(this.options.byweekno.length)
                ? gettext('weeks')
                : gettext('week'))
                .add(this.list(this.options.byweekno, undefined, gettext('and')));
        }
    };
    ToText.prototype._bymonthday = function () {
        var gettext = this.gettext;
        if (this.byweekday && this.byweekday.allWeeks) {
            this.add(gettext('on'))
                .add(this.list(this.byweekday.allWeeks, this.weekdaytext, gettext('or')))
                .add(gettext('the'))
                .add(this.list(this.bymonthday, this.nth, gettext('or')));
        }
        else {
            this.add(gettext('on the')).add(this.list(this.bymonthday, this.nth, gettext('and')));
        }
        // this.add(gettext('DAY'))
    };
    ToText.prototype._byweekday = function () {
        var gettext = this.gettext;
        if (this.byweekday.allWeeks && !this.byweekday.isWeekdays) {
            this.add(gettext('on')).add(this.list(this.byweekday.allWeeks, this.weekdaytext));
        }
        if (this.byweekday.someWeeks) {
            if (this.byweekday.allWeeks)
                this.add(gettext('and'));
            this.add(gettext('on the')).add(this.list(this.byweekday.someWeeks, this.weekdaytext, gettext('and')));
        }
    };
    ToText.prototype._byhour = function () {
        var gettext = this.gettext;
        this.add(gettext('at')).add(this.list(this.origOptions.byhour, undefined, gettext('and')));
    };
    ToText.prototype._bymonth = function () {
        this.add(this.list(this.options.bymonth, this.monthtext, this.gettext('and')));
    };
    ToText.prototype.nth = function (n) {
        n = parseInt(n.toString(), 10);
        var nth;
        var npos;
        var gettext = this.gettext;
        if (n === -1)
            return gettext('last');
        npos = Math.abs(n);
        switch (npos) {
            case 1:
            case 21:
            case 31:
                nth = npos + gettext('st');
                break;
            case 2:
            case 22:
                nth = npos + gettext('nd');
                break;
            case 3:
            case 23:
                nth = npos + gettext('rd');
                break;
            default:
                nth = npos + gettext('th');
        }
        return n < 0 ? nth + ' ' + gettext('last') : nth;
    };
    ToText.prototype.monthtext = function (m) {
        return this.language.monthNames[m - 1];
    };
    ToText.prototype.weekdaytext = function (wday) {
        var weekday = Object(helpers["e" /* isNumber */])(wday) ? (wday + 1) % 7 : wday.getJsWeekday();
        return ((wday.n ? this.nth(wday.n) + ' ' : '') + this.language.dayNames[weekday]);
    };
    ToText.prototype.plural = function (n) {
        return n % 100 !== 1;
    };
    ToText.prototype.add = function (s) {
        this.text.push(' ');
        this.text.push(s);
        return this;
    };
    ToText.prototype.list = function (arr, callback, finalDelim, delim) {
        if (delim === void 0) { delim = ','; }
        if (!Object(helpers["d" /* isArray */])(arr)) {
            arr = [arr];
        }
        var delimJoin = function (array, delimiter, finalDelimiter) {
            var list = '';
            for (var i = 0; i < array.length; i++) {
                if (i !== 0) {
                    if (i === array.length - 1) {
                        list += ' ' + finalDelimiter + ' ';
                    }
                    else {
                        list += delimiter + ' ';
                    }
                }
                list += array[i];
            }
            return list;
        };
        callback =
            callback ||
                function (o) {
                    return o.toString();
                };
        var self = this;
        var realCallback = function (arg) {
            return callback && callback.call(self, arg);
        };
        if (finalDelim) {
            return delimJoin(arr.map(realCallback), delim, finalDelim);
        }
        else {
            return arr.map(realCallback).join(delim + ' ');
        }
    };
    return ToText;
}());
/* harmony default export */ var totext = (totext_ToText);
//# sourceMappingURL=totext.js.map
// CONCATENATED MODULE: ./dist/esm/nlp/parsetext.js


// =============================================================================
// Parser
// =============================================================================
var Parser = /** @class */ (function () {
    function Parser(rules) {
        this.done = true;
        this.rules = rules;
    }
    Parser.prototype.start = function (text) {
        this.text = text;
        this.done = false;
        return this.nextSymbol();
    };
    Parser.prototype.isDone = function () {
        return this.done && this.symbol === null;
    };
    Parser.prototype.nextSymbol = function () {
        var best;
        var bestSymbol;
        var p = this;
        this.symbol = null;
        this.value = null;
        do {
            if (this.done)
                return false;
            var rule = void 0;
            best = null;
            for (var name_1 in this.rules) {
                rule = this.rules[name_1];
                var match = rule.exec(p.text);
                if (match) {
                    if (best === null || match[0].length > best[0].length) {
                        best = match;
                        bestSymbol = name_1;
                    }
                }
            }
            if (best != null) {
                this.text = this.text.substr(best[0].length);
                if (this.text === '')
                    this.done = true;
            }
            if (best == null) {
                this.done = true;
                this.symbol = null;
                this.value = null;
                return;
            }
            // @ts-ignore
        } while (bestSymbol === 'SKIP');
        // @ts-ignore
        this.symbol = bestSymbol;
        this.value = best;
        return true;
    };
    Parser.prototype.accept = function (name) {
        if (this.symbol === name) {
            if (this.value) {
                var v = this.value;
                this.nextSymbol();
                return v;
            }
            this.nextSymbol();
            return true;
        }
        return false;
    };
    Parser.prototype.acceptNumber = function () {
        return this.accept('number');
    };
    Parser.prototype.expect = function (name) {
        if (this.accept(name))
            return true;
        throw new Error('expected ' + name + ' but found ' + this.symbol);
    };
    return Parser;
}());
function parseText(text, language) {
    if (language === void 0) { language = i18n; }
    var options = {};
    var ttr = new Parser(language.tokens);
    if (!ttr.start(text))
        return null;
    S();
    return options;
    function S() {
        // every [n]
        ttr.expect('every');
        var n = ttr.acceptNumber();
        if (n)
            options.interval = parseInt(n[0], 10);
        if (ttr.isDone())
            throw new Error('Unexpected end');
        switch (ttr.symbol) {
            case 'day(s)':
                options.freq = esm["default"].DAILY;
                if (ttr.nextSymbol()) {
                    AT();
                    F();
                }
                break;
            // FIXME Note: every 2 weekdays != every two weeks on weekdays.
            // DAILY on weekdays is not a valid rule
            case 'weekday(s)':
                options.freq = esm["default"].WEEKLY;
                options.byweekday = [
                    esm["default"].MO,
                    esm["default"].TU,
                    esm["default"].WE,
                    esm["default"].TH,
                    esm["default"].FR
                ];
                ttr.nextSymbol();
                F();
                break;
            case 'week(s)':
                options.freq = esm["default"].WEEKLY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'hour(s)':
                options.freq = esm["default"].HOURLY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'minute(s)':
                options.freq = esm["default"].MINUTELY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'month(s)':
                options.freq = esm["default"].MONTHLY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'year(s)':
                options.freq = esm["default"].YEARLY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'monday':
            case 'tuesday':
            case 'wednesday':
            case 'thursday':
            case 'friday':
            case 'saturday':
            case 'sunday':
                options.freq = esm["default"].WEEKLY;
                var key = ttr.symbol.substr(0, 2).toUpperCase();
                options.byweekday = [esm["default"][key]];
                if (!ttr.nextSymbol())
                    return;
                // TODO check for duplicates
                while (ttr.accept('comma')) {
                    if (ttr.isDone())
                        throw new Error('Unexpected end');
                    var wkd = decodeWKD();
                    if (!wkd) {
                        throw new Error('Unexpected symbol ' + ttr.symbol + ', expected weekday');
                    }
                    // @ts-ignore
                    options.byweekday.push(esm["default"][wkd]);
                    ttr.nextSymbol();
                }
                MDAYs();
                F();
                break;
            case 'january':
            case 'february':
            case 'march':
            case 'april':
            case 'may':
            case 'june':
            case 'july':
            case 'august':
            case 'september':
            case 'october':
            case 'november':
            case 'december':
                options.freq = esm["default"].YEARLY;
                options.bymonth = [decodeM()];
                if (!ttr.nextSymbol())
                    return;
                // TODO check for duplicates
                while (ttr.accept('comma')) {
                    if (ttr.isDone())
                        throw new Error('Unexpected end');
                    var m = decodeM();
                    if (!m) {
                        throw new Error('Unexpected symbol ' + ttr.symbol + ', expected month');
                    }
                    options.bymonth.push(m);
                    ttr.nextSymbol();
                }
                ON();
                F();
                break;
            default:
                throw new Error('Unknown symbol');
        }
    }
    function ON() {
        var on = ttr.accept('on');
        var the = ttr.accept('the');
        if (!(on || the))
            return;
        do {
            var nth = decodeNTH();
            var wkd = decodeWKD();
            var m = decodeM();
            // nth <weekday> | <weekday>
            if (nth) {
                // ttr.nextSymbol()
                if (wkd) {
                    ttr.nextSymbol();
                    if (!options.byweekday)
                        options.byweekday = [];
                    // @ts-ignore
                    options.byweekday.push(esm["default"][wkd].nth(nth));
                }
                else {
                    if (!options.bymonthday)
                        options.bymonthday = [];
                    // @ts-ignore
                    options.bymonthday.push(nth);
                    ttr.accept('day(s)');
                }
                // <weekday>
            }
            else if (wkd) {
                ttr.nextSymbol();
                if (!options.byweekday)
                    options.byweekday = [];
                // @ts-ignore
                options.byweekday.push(esm["default"][wkd]);
            }
            else if (ttr.symbol === 'weekday(s)') {
                ttr.nextSymbol();
                if (!options.byweekday) {
                    options.byweekday = [
                        esm["default"].MO,
                        esm["default"].TU,
                        esm["default"].WE,
                        esm["default"].TH,
                        esm["default"].FR
                    ];
                }
            }
            else if (ttr.symbol === 'week(s)') {
                ttr.nextSymbol();
                var n = ttr.acceptNumber();
                if (!n) {
                    throw new Error('Unexpected symbol ' + ttr.symbol + ', expected week number');
                }
                options.byweekno = [parseInt(n[0], 10)];
                while (ttr.accept('comma')) {
                    n = ttr.acceptNumber();
                    if (!n) {
                        throw new Error('Unexpected symbol ' + ttr.symbol + '; expected monthday');
                    }
                    options.byweekno.push(parseInt(n[0], 10));
                }
            }
            else if (m) {
                ttr.nextSymbol();
                if (!options.bymonth)
                    options.bymonth = [];
                // @ts-ignore
                options.bymonth.push(m);
            }
            else {
                return;
            }
        } while (ttr.accept('comma') || ttr.accept('the') || ttr.accept('on'));
    }
    function AT() {
        var at = ttr.accept('at');
        if (!at)
            return;
        do {
            var n = ttr.acceptNumber();
            if (!n) {
                throw new Error('Unexpected symbol ' + ttr.symbol + ', expected hour');
            }
            options.byhour = [parseInt(n[0], 10)];
            while (ttr.accept('comma')) {
                n = ttr.acceptNumber();
                if (!n) {
                    throw new Error('Unexpected symbol ' + ttr.symbol + '; expected hour');
                }
                options.byhour.push(parseInt(n[0], 10));
            }
        } while (ttr.accept('comma') || ttr.accept('at'));
    }
    function decodeM() {
        switch (ttr.symbol) {
            case 'january':
                return 1;
            case 'february':
                return 2;
            case 'march':
                return 3;
            case 'april':
                return 4;
            case 'may':
                return 5;
            case 'june':
                return 6;
            case 'july':
                return 7;
            case 'august':
                return 8;
            case 'september':
                return 9;
            case 'october':
                return 10;
            case 'november':
                return 11;
            case 'december':
                return 12;
            default:
                return false;
        }
    }
    function decodeWKD() {
        switch (ttr.symbol) {
            case 'monday':
            case 'tuesday':
            case 'wednesday':
            case 'thursday':
            case 'friday':
            case 'saturday':
            case 'sunday':
                return ttr.symbol.substr(0, 2).toUpperCase();
            default:
                return false;
        }
    }
    function decodeNTH() {
        switch (ttr.symbol) {
            case 'last':
                ttr.nextSymbol();
                return -1;
            case 'first':
                ttr.nextSymbol();
                return 1;
            case 'second':
                ttr.nextSymbol();
                return ttr.accept('last') ? -2 : 2;
            case 'third':
                ttr.nextSymbol();
                return ttr.accept('last') ? -3 : 3;
            case 'nth':
                var v = parseInt(ttr.value[1], 10);
                if (v < -366 || v > 366)
                    throw new Error('Nth out of range: ' + v);
                ttr.nextSymbol();
                return ttr.accept('last') ? -v : v;
            default:
                return false;
        }
    }
    function MDAYs() {
        ttr.accept('on');
        ttr.accept('the');
        var nth = decodeNTH();
        if (!nth)
            return;
        options.bymonthday = [nth];
        ttr.nextSymbol();
        while (ttr.accept('comma')) {
            nth = decodeNTH();
            if (!nth) {
                throw new Error('Unexpected symbol ' + ttr.symbol + '; expected monthday');
            }
            options.bymonthday.push(nth);
            ttr.nextSymbol();
        }
    }
    function F() {
        if (ttr.symbol === 'until') {
            var date = Date.parse(ttr.text);
            if (!date)
                throw new Error('Cannot parse until date:' + ttr.text);
            options.until = new Date(date);
        }
        else if (ttr.accept('for')) {
            options.count = parseInt(ttr.value[0], 10);
            ttr.expect('number');
            // ttr.expect('times')
        }
    }
}
//# sourceMappingURL=parsetext.js.map
// CONCATENATED MODULE: ./dist/esm/nlp/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromText", function() { return fromText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isFullyConvertible", function() { return isFullyConvertible; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toText", function() { return toText; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "parseText", function() { return parseText; });




/*!
* rrule.js - Library for working with recurrence rules for calendar dates.
* https://github.com/jakubroztocil/rrule
*
* Copyright 2010, Jakub Roztocil and Lars Schoning
* Licenced under the BSD licence.
* https://github.com/jakubroztocil/rrule/blob/master/LICENCE
*
*/
/**
 *
 * Implementation of RRule.fromText() and RRule::toText().
 *
 *
 * On the client side, this file needs to be included
 * when those functions are used.
 *
 */
// =============================================================================
// fromText
// =============================================================================
/**
 * Will be able to convert some of the below described rules from
 * text format to a rule object.
 *
 *
 * RULES
 *
 * Every ([n])
 *       day(s)
 *     | [weekday], ..., (and) [weekday]
 *     | weekday(s)
 *     | week(s)
 *     | month(s)
 *     | [month], ..., (and) [month]
 *     | year(s)
 *
 *
 * Plus 0, 1, or multiple of these:
 *
 * on [weekday], ..., (or) [weekday] the [monthday], [monthday], ... (or) [monthday]
 *
 * on [weekday], ..., (and) [weekday]
 *
 * on the [monthday], [monthday], ... (and) [monthday] (day of the month)
 *
 * on the [nth-weekday], ..., (and) [nth-weekday] (of the month/year)
 *
 *
 * Plus 0 or 1 of these:
 *
 * for [n] time(s)
 *
 * until [date]
 *
 * Plus (.)
 *
 *
 * Definitely no supported for parsing:
 *
 * (for year):
 *     in week(s) [n], ..., (and) [n]
 *
 *     on the [yearday], ..., (and) [n] day of the year
 *     on day [yearday], ..., (and) [n]
 *
 *
 * NON-TERMINALS
 *
 * [n]: 1, 2 ..., one, two, three ..
 * [month]: January, February, March, April, May, ... December
 * [weekday]: Monday, ... Sunday
 * [nth-weekday]: first [weekday], 2nd [weekday], ... last [weekday], ...
 * [monthday]: first, 1., 2., 1st, 2nd, second, ... 31st, last day, 2nd last day, ..
 * [date]:
 *     [month] (0-31(,) ([year])),
 *     (the) 0-31.(1-12.([year])),
 *     (the) 0-31/(1-12/([year])),
 *     [weekday]
 *
 * [year]: 0000, 0001, ... 01, 02, ..
 *
 * Definitely not supported for parsing:
 *
 * [yearday]: first, 1., 2., 1st, 2nd, second, ... 366th, last day, 2nd last day, ..
 *
 * @param {String} text
 * @return {Object, Boolean} the rule, or null.
 */
var fromText = function (text, language) {
    if (language === void 0) { language = i18n; }
    return new esm["default"](parseText(text, language) || undefined);
};
var common = [
    'count',
    'until',
    'interval',
    'byweekday',
    'bymonthday',
    'bymonth'
];
totext.IMPLEMENTED = [];
totext.IMPLEMENTED[esm["default"].HOURLY] = common;
totext.IMPLEMENTED[esm["default"].MINUTELY] = common;
totext.IMPLEMENTED[esm["default"].DAILY] = ['byhour'].concat(common);
totext.IMPLEMENTED[esm["default"].WEEKLY] = common;
totext.IMPLEMENTED[esm["default"].MONTHLY] = common;
totext.IMPLEMENTED[esm["default"].YEARLY] = ['byweekno', 'byyearday'].concat(common);
// =============================================================================
// Export
// =============================================================================
var toText = function (rrule, gettext, language) {
    return new totext(rrule, gettext, language).toString();
};
var isFullyConvertible = totext.isFullyConvertible;

//# sourceMappingURL=index.js.map

/***/ })
/******/ ]);
});
//# sourceMappingURL=rrule.js.map