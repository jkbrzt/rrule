(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["rrule"] = factory();
	else
		root["rrule"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./dist/es6/weekday.js
const WDAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
// =============================================================================
// Weekday
// =============================================================================
class Weekday {
    constructor(weekday, n) {
        if (n === 0)
            throw new Error("Can't create weekday with n == 0");
        this.weekday = weekday;
        this.n = n;
    }
    // __call__ - Cannot call the object directly, do it through
    // e.g. RRule.TH.nth(-1) instead,
    nth(n) {
        return this.n === n ? this : new Weekday(this.weekday, n);
    }
    // __eq__
    equals(other) {
        return this.weekday === other.weekday && this.n === other.n;
    }
    // __repr__
    toString() {
        let s = WDAYS[this.weekday];
        if (this.n)
            s = (this.n > 0 ? '+' : '') + String(this.n) + s;
        return s;
    }
    getJsWeekday() {
        return this.weekday === 6 ? 0 : this.weekday + 1;
    }
}
//# sourceMappingURL=weekday.js.map
// CONCATENATED MODULE: ./dist/es6/dateutil.js
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
/**
 * General date-related utilities.
 * Also handles several incompatibilities between JavaScript and Python
 *
 */
const dateutil = {
    MONTH_DAYS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    /**
     * Number of milliseconds of one day
     */
    ONE_DAY: 1000 * 60 * 60 * 24,
    /**
     * @see: <http://docs.python.org/library/datetime.html#datetime.MAXYEAR>
     */
    MAXYEAR: 9999,
    /**
     * Python uses 1-Jan-1 as the base for calculating ordinals but we don't
     * want to confuse the JS engine with milliseconds > Number.MAX_NUMBER,
     * therefore we use 1-Jan-1970 instead
     */
    ORDINAL_BASE: new Date(1970, 0, 1),
    /**
     * Python: MO-SU: 0 - 6
     * JS: SU-SAT 0 - 6
     */
    PY_WEEKDAYS: [6, 0, 1, 2, 3, 4, 5],
    /**
     * py_date.timetuple()[7]
     */
    getYearDay: function (date) {
        const dateNoTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return (Math.ceil((dateNoTime.valueOf() - new Date(date.getFullYear(), 0, 1).valueOf()) /
            dateutil.ONE_DAY) + 1);
    },
    isLeapYear: function (year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    },
    /**
     * @return {Number} the date's timezone offset in ms
     */
    tzOffset: function (date) {
        return date.getTimezoneOffset() * 60 * 1000;
    },
    /**
     * @see: <http://www.mcfedries.com/JavaScript/DaysBetween.asp>
     */
    daysBetween: function (date1, date2) {
        // The number of milliseconds in one day
        // Convert both dates to milliseconds
        const date1ms = date1.getTime() - dateutil.tzOffset(date1);
        const date2ms = date2.getTime() - dateutil.tzOffset(date2);
        // Calculate the difference in milliseconds
        const differencems = date1ms - date2ms;
        // Convert back to days and return
        return Math.round(differencems / dateutil.ONE_DAY);
    },
    /**
     * @see: <http://docs.python.org/library/datetime.html#datetime.date.toordinal>
     */
    toOrdinal: function (date) {
        return dateutil.daysBetween(date, dateutil.ORDINAL_BASE);
    },
    /**
     * @see - <http://docs.python.org/library/datetime.html#datetime.date.fromordinal>
     */
    fromOrdinal: function (ordinal) {
        const millisecsFromBase = ordinal * dateutil.ONE_DAY;
        return new Date(dateutil.ORDINAL_BASE.getTime() -
            dateutil.tzOffset(dateutil.ORDINAL_BASE) +
            millisecsFromBase +
            dateutil.tzOffset(new Date(millisecsFromBase)));
    },
    /**
     * @see: <http://docs.python.org/library/calendar.html#calendar.monthrange>
     */
    monthRange: function (year, month) {
        const date = new Date(year, month, 1);
        return [dateutil.getWeekday(date), dateutil.getMonthDays(date)];
    },
    getMonthDays: function (date) {
        const month = date.getMonth();
        return month === 1 && dateutil.isLeapYear(date.getFullYear())
            ? 29
            : dateutil.MONTH_DAYS[month];
    },
    /**
     * @return {Number} python-like weekday
     */
    getWeekday: function (date) {
        return dateutil.PY_WEEKDAYS[date.getDay()];
    },
    /**
     * @see: <http://docs.python.org/library/datetime.html#datetime.datetime.combine>
     */
    combine: function (date, time) {
        time = time || date;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
    },
    clone: function (date) {
        const dolly = new Date(date.getTime());
        return dolly;
    },
    cloneDates: function (dates) {
        const clones = [];
        for (let i = 0; i < dates.length; i++) {
            clones.push(dateutil.clone(dates[i]));
        }
        return clones;
    },
    /**
     * Sorts an array of Date or dateutil.Time objects
     */
    sort: function (dates) {
        dates.sort(function (a, b) {
            return a.getTime() - b.getTime();
        });
    },
    timeToUntilString: function (time) {
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
    },
    untilStringToDate: function (until) {
        const re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/;
        const bits = re.exec(until);
        if (!bits)
            throw new Error('Invalid UNTIL value: ' + until);
        return new Date(Date.UTC(parseInt(bits[1], 10), parseInt(bits[2], 10) - 1, parseInt(bits[3], 10), parseInt(bits[5], 10) || 0, parseInt(bits[6], 10) || 0, parseInt(bits[7], 10) || 0));
    },
    Time
};
/* harmony default export */ var es6_dateutil = (dateutil);
//# sourceMappingURL=dateutil.js.map
// CONCATENATED MODULE: ./dist/es6/helpers.js
// =============================================================================
// Helper functions
// =============================================================================
/**
 * Simplified version of python's range()
 */
const range = function (start, end) {
    if (arguments.length === 1) {
        end = start;
        start = 0;
    }
    const rang = [];
    for (let i = start; i < end; i++)
        rang.push(i);
    return rang;
};
const repeat = function (value, times) {
    let i = 0;
    const array = [];
    if (value instanceof Array) {
        for (; i < times; i++)
            array[i] = [].concat(value);
    }
    else {
        for (; i < times; i++)
            array[i] = value;
    }
    return array;
};
/**
 * Python like split
 */
const split = function (str, sep, num) {
    const splits = str.split(sep);
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
const pymod = function (a, b) {
    const r = a % b;
    // If r and b differ in sign, add b to wrap the result to the correct sign.
    return r * b < 0 ? r + b : r;
};
/**
 * @see: <http://docs.python.org/library/functions.html#divmod>
 */
const divmod = function (a, b) {
    return { div: Math.floor(a / b), mod: pymod(a, b) };
};
/**
 * Python-like boolean
 * @return {Boolean} value of an object/primitive, taking into account
 * the fact that in Python an empty list's/tuple's
 * boolean value is False, whereas in JS it's true
 */
const plb = function (obj) {
    return obj instanceof Array && obj.length === 0 ? false : Boolean(obj);
};
/**
 * Return true if a value is in an array
 */
const contains = function (arr, val) {
    return arr.indexOf(val) !== -1;
};

//# sourceMappingURL=helpers.js.map
// CONCATENATED MODULE: ./dist/es6/masks.js

// =============================================================================
// Date masks
// =============================================================================
// Every mask is 7 days longer to handle cross-year weekly periods.
const M365MASK = [].concat(repeat(1, 31), repeat(2, 28), repeat(3, 31), repeat(4, 30), repeat(5, 31), repeat(6, 30), repeat(7, 31), repeat(8, 31), repeat(9, 30), repeat(10, 31), repeat(11, 30), repeat(12, 31), repeat(1, 7));
const M366MASK = [].concat(repeat(1, 31), repeat(2, 29), repeat(3, 31), repeat(4, 30), repeat(5, 31), repeat(6, 30), repeat(7, 31), repeat(8, 31), repeat(9, 30), repeat(10, 31), repeat(11, 30), repeat(12, 31), repeat(1, 7));
let M28 = range(1, 29);
let M29 = range(1, 30);
let M30 = range(1, 31);
let M31 = range(1, 32);
const MDAY366MASK = [].concat(M31, M29, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
const MDAY365MASK = [].concat(M31, M28, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
M28 = range(-28, 0);
M29 = range(-29, 0);
M30 = range(-30, 0);
M31 = range(-31, 0);
const NMDAY366MASK = [].concat(M31, M29, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
const NMDAY365MASK = [].concat(M31, M28, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
const M366RANGE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
const M365RANGE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
const WDAYMASK = (function () {
    let wdaymask = [];
    for (let i = 0; i < 55; i++)
        wdaymask = wdaymask.concat(range(7));
    return wdaymask;
})();

//# sourceMappingURL=masks.js.map
// CONCATENATED MODULE: ./dist/es6/iterresult.js
// =============================================================================
// Results
// =============================================================================
/**
 * This class helps us to emulate python's generators, sorta.
 */
class IterResult {
    constructor(method, args) {
        this.method = method;
        this.args = args;
        this.minDate = null;
        this.maxDate = null;
        this._result = [];
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
    accept(date) {
        const tooEarly = this.minDate && date < this.minDate;
        const tooLate = this.maxDate && date > this.maxDate;
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
    }
    /**
     *
     * @param {Date} date that is part of the result.
     * @return {Boolean} whether we are interested in more values.
     */
    add(date) {
        this._result.push(date);
        return true;
    }
    /**
     * 'before' and 'after' return only one date, whereas 'all'
     * and 'between' an array.
     * @return {Date,Array?}
     */
    getValue() {
        const res = this._result;
        switch (this.method) {
            case 'all':
            case 'between':
                return res;
            case 'before':
            case 'after':
                return res.length ? res[res.length - 1] : null;
        }
    }
    clone() {
        return new IterResult(this.method, this.args);
    }
}
//# sourceMappingURL=iterresult.js.map
// CONCATENATED MODULE: ./dist/es6/callbackiterresult.js


/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
class callbackiterresult_CallbackIterResult extends IterResult {
    constructor(method, args, iterator) {
        const allowedMethods = ['all', 'between'];
        if (!contains(allowedMethods, method)) {
            throw new Error('Invalid method "' +
                method +
                '". Only all and between works with iterator.');
        }
        super(method, args);
        this.iterator = iterator;
    }
    add(date) {
        if (this.iterator(date, this._result.length)) {
            this._result.push(date);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=callbackiterresult.js.map
// CONCATENATED MODULE: ./dist/es6/rrule.js






const getnlp = function () {
    // Lazy, runtime import to avoid circular refs.
    if (!getnlp._nlp) {
        getnlp._nlp = __webpack_require__(1);
    }
    return getnlp._nlp;
};
var Frequencies;
(function (Frequencies) {
    Frequencies[Frequencies["YEARLY"] = 0] = "YEARLY";
    Frequencies[Frequencies["MONTHLY"] = 1] = "MONTHLY";
    Frequencies[Frequencies["WEEKLY"] = 2] = "WEEKLY";
    Frequencies[Frequencies["DAILY"] = 3] = "DAILY";
    Frequencies[Frequencies["HOURLY"] = 4] = "HOURLY";
    Frequencies[Frequencies["MINUTELY"] = 5] = "MINUTELY";
    Frequencies[Frequencies["SECONDLY"] = 6] = "SECONDLY";
})(Frequencies || (Frequencies = {}));
const Days = {
    MO: new Weekday(0),
    TU: new Weekday(1),
    WE: new Weekday(2),
    TH: new Weekday(3),
    FR: new Weekday(4),
    SA: new Weekday(5),
    SU: new Weekday(6)
};
/**
 *
 * @param {RRuleOptions?} options - see <http://labix.org/python-dateutil/#head-cf004ee9a75592797e076752b2a889c10f445418>
 *        The only required option is `freq`, one of RRule.YEARLY, RRule.MONTHLY, ...
 * @constructor
 */
class rrule_RRule {
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
        this.origOptions = {};
        this.options = {};
        const invalid = [];
        const keys = Object.keys(options);
        const defaultKeys = Object.keys(rrule_RRule.DEFAULT_OPTIONS);
        // Shallow copy for options and origOptions and check for invalid
        keys.forEach(function (key) {
            this.origOptions[key] = options[key];
            this.options[key] = options[key];
            if (!contains(defaultKeys, key))
                invalid.push(key);
        }, this);
        if (invalid.length) {
            throw new Error('Invalid options: ' + invalid.join(', '));
        }
        if (!rrule_RRule.FREQUENCIES[options.freq] && options.byeaster === null) {
            throw new Error('Invalid frequency: ' + String(options.freq));
        }
        // Merge in default options
        defaultKeys.forEach(function (key) {
            if (!contains(keys, key))
                this.options[key] = rrule_RRule.DEFAULT_OPTIONS[key];
        }, this);
        const opts = this.options;
        if (opts.byeaster !== null)
            opts.freq = rrule_RRule.YEARLY;
        if (!opts.dtstart)
            opts.dtstart = new Date(new Date().setMilliseconds(0));
        const millisecondModulo = opts.dtstart.getTime() % 1000;
        if (opts.wkst === null) {
            opts.wkst = rrule_RRule.MO.weekday;
        }
        else if (typeof opts.wkst === 'number') {
            // cool, just keep it like that
        }
        else {
            opts.wkst = opts.wkst.weekday;
        }
        let v;
        if (opts.bysetpos !== null) {
            if (typeof opts.bysetpos === 'number')
                opts.bysetpos = [opts.bysetpos];
            for (let i = 0; i < opts.bysetpos.length; i++) {
                v = opts.bysetpos[i];
                if (v === 0 || !(v >= -366 && v <= 366)) {
                    throw new Error('bysetpos must be between 1 and 366,' + ' or between -366 and -1');
                }
            }
        }
        if (!(plb(opts.byweekno) ||
            plb(opts.byyearday) ||
            plb(opts.bymonthday) ||
            opts.byweekday !== null ||
            opts.byeaster !== null)) {
            switch (opts.freq) {
                case rrule_RRule.YEARLY:
                    if (!opts.bymonth)
                        opts.bymonth = opts.dtstart.getMonth() + 1;
                    opts.bymonthday = opts.dtstart.getDate();
                    break;
                case rrule_RRule.MONTHLY:
                    opts.bymonthday = opts.dtstart.getDate();
                    break;
                case rrule_RRule.WEEKLY:
                    opts.byweekday = [es6_dateutil.getWeekday(opts.dtstart)];
                    break;
            }
        }
        // bymonth
        if (opts.bymonth !== null && !(opts.bymonth instanceof Array)) {
            opts.bymonth = [opts.bymonth];
        }
        // byyearday
        if (opts.byyearday !== null && !(opts.byyearday instanceof Array)) {
            opts.byyearday = [opts.byyearday];
        }
        // bymonthday
        if (opts.bymonthday === null) {
            opts.bymonthday = [];
            opts.bynmonthday = [];
        }
        else if (opts.bymonthday instanceof Array) {
            const bymonthday = [];
            const bynmonthday = [];
            for (let i = 0; i < opts.bymonthday.length; i++) {
                v = opts.bymonthday[i];
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
        else {
            if (opts.bymonthday < 0) {
                opts.bynmonthday = [opts.bymonthday];
                opts.bymonthday = [];
            }
            else {
                opts.bynmonthday = [];
                opts.bymonthday = [opts.bymonthday];
            }
        }
        // byweekno
        if (opts.byweekno !== null && !(opts.byweekno instanceof Array)) {
            opts.byweekno = [opts.byweekno];
        }
        // byweekday / bynweekday
        if (opts.byweekday === null) {
            opts.bynweekday = null;
        }
        else if (typeof opts.byweekday === 'number') {
            opts.byweekday = [opts.byweekday];
            opts.bynweekday = null;
        }
        else if (opts.byweekday instanceof Weekday) {
            if (!opts.byweekday.n || opts.freq > rrule_RRule.MONTHLY) {
                opts.byweekday = [opts.byweekday.weekday];
                opts.bynweekday = null;
            }
            else {
                opts.bynweekday = [[opts.byweekday.weekday, opts.byweekday.n]];
                opts.byweekday = null;
            }
        }
        else {
            const byweekday = [];
            const bynweekday = [];
            for (let i = 0; i < opts.byweekday.length; i++) {
                const wday = opts.byweekday[i];
                if (typeof wday === 'number') {
                    byweekday.push(wday);
                }
                else if (!wday.n || opts.freq > rrule_RRule.MONTHLY) {
                    byweekday.push(wday.weekday);
                }
                else {
                    bynweekday.push([wday.weekday, wday.n]);
                }
            }
            opts.byweekday = plb(byweekday) ? byweekday : null;
            opts.bynweekday = plb(bynweekday) ? bynweekday : null;
        }
        // byhour
        if (opts.byhour === null) {
            opts.byhour = opts.freq < rrule_RRule.HOURLY ? [opts.dtstart.getHours()] : null;
        }
        else if (typeof opts.byhour === 'number') {
            opts.byhour = [opts.byhour];
        }
        // byminute
        if (opts.byminute === null) {
            opts.byminute =
                opts.freq < rrule_RRule.MINUTELY ? [opts.dtstart.getMinutes()] : null;
        }
        else if (typeof opts.byminute === 'number') {
            opts.byminute = [opts.byminute];
        }
        // bysecond
        if (opts.bysecond === null) {
            opts.bysecond =
                opts.freq < rrule_RRule.SECONDLY ? [opts.dtstart.getSeconds()] : null;
        }
        else if (typeof opts.bysecond === 'number') {
            opts.bysecond = [opts.bysecond];
        }
        if (opts.freq >= rrule_RRule.HOURLY) {
            this.timeset = null;
        }
        else {
            this.timeset = [];
            for (let i = 0; i < opts.byhour.length; i++) {
                const hour = opts.byhour[i];
                for (let j = 0; j < opts.byminute.length; j++) {
                    const minute = opts.byminute[j];
                    for (let k = 0; k < opts.bysecond.length; k++) {
                        const second = opts.bysecond[k];
                        // python:
                        // datetime.time(hour, minute, second,
                        // tzinfo=self._tzinfo))
                        this.timeset.push(new es6_dateutil.Time(hour, minute, second, millisecondModulo));
                    }
                }
            }
            es6_dateutil.sort(this.timeset);
        }
    }
    static parseText(text, language) {
        return getnlp().parseText(text, language);
    }
    static fromText(text, language) {
        return getnlp().fromText(text, language);
    }
    static parseString(rfcString) {
        rfcString = rfcString.replace(/^\s+|\s+$/, '');
        if (!rfcString.length)
            return null;
        let key;
        let value;
        let attr;
        const attrs = rfcString.split(';');
        const options = {};
        for (let i = 0; i < attrs.length; i++) {
            attr = attrs[i].split('=');
            key = attr[0];
            value = attr[1];
            switch (key) {
                case 'FREQ':
                    options.freq = Frequencies[value];
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
                    if (value.indexOf(',') !== -1) {
                        value = value.split(',');
                        for (let j = 0; j < value.length; j++) {
                            if (/^[+-]?\d+$/.test(value[j].toString())) {
                                value[j] = Number(value[j]);
                            }
                        }
                    }
                    else if (/^[+-]?\d+$/.test(value)) {
                        value = Number(value);
                    }
                    key = key.toLowerCase();
                    // @ts-ignore
                    options[key] = value;
                    break;
                case 'BYDAY': // => byweekday
                    let n;
                    let wday;
                    let day;
                    const days = value.split(',');
                    options.byweekday = [];
                    for (let j = 0; j < days.length; j++) {
                        day = days[j];
                        if (day.length === 2) {
                            // MO, TU, ...
                            wday = Days[day]; // wday instanceof Weekday
                            options.byweekday.push(wday);
                        }
                        else {
                            // -1MO, +3FR, 1SO, ...
                            const parts = day.match(/^([+-]?\d)([A-Z]{2})$/);
                            n = Number(parts[1]);
                            const wdaypart = parts[2];
                            wday = Days[wdaypart].weekday;
                            options.byweekday.push(new Weekday(wday, n));
                        }
                    }
                    break;
                case 'DTSTART':
                    options.dtstart = es6_dateutil.untilStringToDate(value);
                    break;
                case 'UNTIL':
                    options.until = es6_dateutil.untilStringToDate(value);
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
    static fromString(str) {
        return new rrule_RRule(rrule_RRule.parseString(str));
    }
    static optionsToString(options) {
        const pairs = [];
        const keys = Object.keys(options);
        const defaultKeys = Object.keys(rrule_RRule.DEFAULT_OPTIONS);
        for (let i = 0; i < keys.length; i++) {
            if (!contains(defaultKeys, keys[i]))
                continue;
            let key = keys[i].toUpperCase();
            let value = options[keys[i]];
            let strValues = [];
            if (value === null || (value instanceof Array && !value.length))
                continue;
            switch (key) {
                case 'FREQ':
                    value = rrule_RRule.FREQUENCIES[options.freq];
                    break;
                case 'WKST':
                    if (!(value instanceof Weekday)) {
                        value = new Weekday(value);
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
                    if (!(value instanceof Array))
                        value = [value];
                    for (let j = 0; j < value.length; j++) {
                        let wday = value[j];
                        if (wday instanceof Weekday) {
                            // good
                        }
                        else if (wday instanceof Array) {
                            wday = new Weekday(wday[0], wday[1]);
                        }
                        else {
                            wday = new Weekday(wday);
                        }
                        strValues[j] = wday.toString();
                    }
                    value = strValues;
                    break;
                case 'DTSTART':
                case 'UNTIL':
                    value = es6_dateutil.timeToUntilString(value);
                    break;
                default:
                    if (value instanceof Array) {
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
            return this._iter(new callbackiterresult_CallbackIterResult('all', {}, iterator));
        }
        else {
            let result = this._cacheGet('all');
            if (result === false) {
                result = this._iter(new IterResult('all', {}));
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
            before: before,
            after: after,
            inc: inc
        };
        if (iterator) {
            return this._iter(new callbackiterresult_CallbackIterResult('between', args, iterator));
        }
        let result = this._cacheGet('between', args);
        if (result === false) {
            result = this._iter(new IterResult('between', args));
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
            result = this._iter(new IterResult('before', args));
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
            result = this._iter(new IterResult('after', args));
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
        return rrule_RRule.optionsToString(this.origOptions);
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
                    ? es6_dateutil.clone(value)
                    : es6_dateutil.cloneDates(value);
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
        else if (cachedObject instanceof Array) {
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
            const iterResult = new IterResult(what, args);
            for (let i = 0; i < this._cache.all.length; i++) {
                if (!iterResult.accept(this._cache.all[i]))
                    break;
            }
            cached = iterResult.getValue();
            this._cacheAdd(what, cached, args);
        }
        return cached instanceof Array
            ? es6_dateutil.cloneDates(cached)
            : cached instanceof Date
                ? es6_dateutil.clone(cached)
                : cached;
    }
    /**
     * @return a RRule instance with the same freq and options
     *          as this one (cache is not cloned)
     */
    clone() {
        return new rrule_RRule(this.origOptions);
    }
    _iter(iterResult) {
        /* Since JavaScript doesn't have the python's yield operator (<1.7),
            we use the IterResult object that tells us when to stop iterating.
    
        */
        const dtstart = this.options.dtstart;
        const dtstartMillisecondModulo = this.options.dtstart.valueOf() % 1000;
        let year = dtstart.getFullYear();
        let month = dtstart.getMonth() + 1;
        let day = dtstart.getDate();
        let hour = dtstart.getHours();
        let minute = dtstart.getMinutes();
        let second = dtstart.getSeconds();
        let weekday = es6_dateutil.getWeekday(dtstart);
        // Some local variables to speed things up a bit
        const freq = this.options.freq;
        const interval = this.options.interval;
        const wkst = this.options.wkst;
        const until = this.options.until;
        const bymonth = this.options.bymonth;
        const byweekno = this.options.byweekno;
        const byyearday = this.options.byyearday;
        const byweekday = this.options.byweekday;
        const byeaster = this.options.byeaster;
        const bymonthday = this.options.bymonthday;
        const bynmonthday = this.options.bynmonthday;
        const bysetpos = this.options.bysetpos;
        const byhour = this.options.byhour;
        const byminute = this.options.byminute;
        const bysecond = this.options.bysecond;
        // tslint:disable-next-line:no-use-before-declare
        const ii = new rrule_Iterinfo(this);
        ii.rebuild(year, month);
        const getdayset = {
            [rrule_RRule.YEARLY]: ii.ydayset,
            [rrule_RRule.MONTHLY]: ii.mdayset,
            [rrule_RRule.WEEKLY]: ii.wdayset,
            [rrule_RRule.DAILY]: ii.ddayset,
            [rrule_RRule.HOURLY]: ii.ddayset,
            [rrule_RRule.MINUTELY]: ii.ddayset,
            [rrule_RRule.SECONDLY]: ii.ddayset
        }[freq];
        let timeset;
        let gettimeset;
        if (freq < rrule_RRule.HOURLY) {
            timeset = this.timeset;
        }
        else {
            gettimeset = {
                [rrule_RRule.YEARLY]: ii.ydayset,
                [rrule_RRule.MONTHLY]: ii.mdayset,
                [rrule_RRule.WEEKLY]: ii.wdayset,
                [rrule_RRule.DAILY]: ii.ddayset,
                [rrule_RRule.HOURLY]: ii.htimeset,
                [rrule_RRule.MINUTELY]: ii.mtimeset,
                [rrule_RRule.SECONDLY]: ii.stimeset
            }[freq];
            if ((freq >= rrule_RRule.HOURLY && plb(byhour) && !contains(byhour, hour)) ||
                (freq >= rrule_RRule.MINUTELY &&
                    plb(byminute) &&
                    !contains(byminute, minute)) ||
                (freq >= rrule_RRule.SECONDLY && plb(bysecond) && !contains(bysecond, second))) {
                timeset = [];
            }
            else {
                timeset = gettimeset.call(ii, hour, minute, second, dtstartMillisecondModulo);
            }
        }
        let total = 0;
        let count = this.options.count;
        let i;
        let k;
        let dm;
        let div;
        let mod;
        let tmp;
        let pos;
        let dayset;
        let start;
        let end;
        let fixday;
        let filtered;
        while (true) {
            // Get dayset with the right frequency
            tmp = getdayset.call(ii, year, month, day);
            dayset = tmp[0];
            start = tmp[1];
            end = tmp[2];
            // Do the "hard" work ;-)
            filtered = false;
            for (let j = start; j < end; j++) {
                i = dayset[j];
                filtered =
                    (plb(bymonth) && !contains(bymonth, ii.mmask[i])) ||
                        (plb(byweekno) && !ii.wnomask[i]) ||
                        (plb(byweekday) &&
                            !contains(byweekday, ii.wdaymask[i])) ||
                        (plb(ii.nwdaymask) && !ii.nwdaymask[i]) ||
                        (byeaster !== null && !contains(ii.eastermask, i)) ||
                        ((plb(bymonthday) || plb(bynmonthday)) &&
                            !contains(bymonthday, ii.mdaymask[i]) &&
                            !contains(bynmonthday, ii.nmdaymask[i])) ||
                        (plb(byyearday) &&
                            ((i < ii.yearlen &&
                                !contains(byyearday, i + 1) &&
                                !contains(byyearday, -ii.yearlen + i)) ||
                                (i >= ii.yearlen &&
                                    !contains(byyearday, i + 1 - ii.yearlen) &&
                                    !contains(byyearday, -ii.nextyearlen + i - ii.yearlen))));
                if (filtered)
                    dayset[i] = null;
            }
            // Output results
            if (plb(bysetpos) && plb(timeset)) {
                let daypos;
                let timepos;
                const poslist = [];
                for (let j = 0; j < bysetpos.length; j++) {
                    pos = bysetpos[j];
                    if (pos < 0) {
                        daypos = Math.floor(pos / timeset.length);
                        timepos = pymod(pos, timeset.length);
                    }
                    else {
                        daypos = Math.floor((pos - 1) / timeset.length);
                        timepos = pymod(pos - 1, timeset.length);
                    }
                    try {
                        tmp = [];
                        for (k = start; k < end; k++) {
                            const val = dayset[k];
                            if (val === null)
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
                        const date = es6_dateutil.fromOrdinal(ii.yearordinal + i);
                        const res = es6_dateutil.combine(date, time);
                        // XXX: can this ever be in the array?
                        // - compare the actual date instead?
                        if (!contains(poslist, res))
                            poslist.push(res);
                        // tslint:disable-next-line:no-empty
                    }
                    catch (e) { }
                }
                es6_dateutil.sort(poslist);
                for (let j = 0; j < poslist.length; j++) {
                    const res = poslist[j];
                    if (until && res > until) {
                        this._len = total;
                        return iterResult.getValue();
                    }
                    else if (res >= dtstart) {
                        ++total;
                        if (!iterResult.accept(res))
                            return iterResult.getValue();
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
                    i = dayset[j];
                    if (i !== null) {
                        const date = es6_dateutil.fromOrdinal(ii.yearordinal + i);
                        for (k = 0; k < timeset.length; k++) {
                            const time = timeset[k];
                            const res = es6_dateutil.combine(date, time);
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
            }
            // Handle frequency and interval
            fixday = false;
            if (freq === rrule_RRule.YEARLY) {
                year += interval;
                if (year > es6_dateutil.MAXYEAR) {
                    this._len = total;
                    return iterResult.getValue();
                }
                ii.rebuild(year, month);
            }
            else if (freq === rrule_RRule.MONTHLY) {
                month += interval;
                if (month > 12) {
                    div = Math.floor(month / 12);
                    mod = pymod(month, 12);
                    month = mod;
                    year += div;
                    if (month === 0) {
                        month = 12;
                        --year;
                    }
                    if (year > es6_dateutil.MAXYEAR) {
                        this._len = total;
                        return iterResult.getValue();
                    }
                }
                ii.rebuild(year, month);
            }
            else if (freq === rrule_RRule.WEEKLY) {
                if (wkst > weekday) {
                    day += -(weekday + 1 + (6 - wkst)) + interval * 7;
                }
                else {
                    day += -(weekday - wkst) + interval * 7;
                }
                weekday = wkst;
                fixday = true;
            }
            else if (freq === rrule_RRule.DAILY) {
                day += interval;
                fixday = true;
            }
            else if (freq === rrule_RRule.HOURLY) {
                if (filtered) {
                    // Jump to one iteration before next day
                    hour += Math.floor((23 - hour) / interval) * interval;
                }
                while (true) {
                    hour += interval;
                    dm = divmod(hour, 24);
                    div = dm.div;
                    mod = dm.mod;
                    if (div) {
                        hour = mod;
                        day += div;
                        fixday = true;
                    }
                    if (!plb(byhour) || contains(byhour, hour))
                        break;
                }
                timeset = gettimeset.call(ii, hour, minute, second);
            }
            else if (freq === rrule_RRule.MINUTELY) {
                if (filtered) {
                    // Jump to one iteration before next day
                    minute +=
                        Math.floor((1439 - (hour * 60 + minute)) / interval) * interval;
                }
                while (true) {
                    minute += interval;
                    dm = divmod(minute, 60);
                    div = dm.div;
                    mod = dm.mod;
                    if (div) {
                        minute = mod;
                        hour += div;
                        dm = divmod(hour, 24);
                        div = dm.div;
                        mod = dm.mod;
                        if (div) {
                            hour = mod;
                            day += div;
                            fixday = true;
                            filtered = false;
                        }
                    }
                    if ((!plb(byhour) || contains(byhour, hour)) &&
                        (!plb(byminute) || contains(byminute, minute))) {
                        break;
                    }
                }
                timeset = gettimeset.call(ii, hour, minute, second);
            }
            else if (freq === rrule_RRule.SECONDLY) {
                if (filtered) {
                    // Jump to one iteration before next day
                    second +=
                        Math.floor((86399 - (hour * 3600 + minute * 60 + second)) / interval) * interval;
                }
                while (true) {
                    second += interval;
                    dm = divmod(second, 60);
                    div = dm.div;
                    mod = dm.mod;
                    if (div) {
                        second = mod;
                        minute += div;
                        dm = divmod(minute, 60);
                        div = dm.div;
                        mod = dm.mod;
                        if (div) {
                            minute = mod;
                            hour += div;
                            dm = divmod(hour, 24);
                            div = dm.div;
                            mod = dm.mod;
                            if (div) {
                                hour = mod;
                                day += div;
                                fixday = true;
                            }
                        }
                    }
                    if ((!plb(byhour) || contains(byhour, hour)) &&
                        (!plb(byminute) || contains(byminute, minute)) &&
                        (!plb(bysecond) || contains(bysecond, second))) {
                        break;
                    }
                }
                timeset = gettimeset.call(ii, hour, minute, second);
            }
            if (fixday && day > 28) {
                let daysinmonth = es6_dateutil.monthRange(year, month - 1)[1];
                if (day > daysinmonth) {
                    while (day > daysinmonth) {
                        day -= daysinmonth;
                        ++month;
                        if (month === 13) {
                            month = 1;
                            ++year;
                            if (year > es6_dateutil.MAXYEAR) {
                                this._len = total;
                                return iterResult.getValue();
                            }
                        }
                        daysinmonth = es6_dateutil.monthRange(year, month - 1)[1];
                    }
                    ii.rebuild(year, month);
                }
            }
        }
    }
}
// RRule class 'constants'
rrule_RRule.FREQUENCIES = [
    'YEARLY',
    'MONTHLY',
    'WEEKLY',
    'DAILY',
    'HOURLY',
    'MINUTELY',
    'SECONDLY'
];
rrule_RRule.YEARLY = 0;
rrule_RRule.MONTHLY = 1;
rrule_RRule.WEEKLY = 2;
rrule_RRule.DAILY = 3;
rrule_RRule.HOURLY = 4;
rrule_RRule.MINUTELY = 5;
rrule_RRule.SECONDLY = 6;
rrule_RRule.DEFAULT_OPTIONS = {
    freq: null,
    dtstart: null,
    interval: 1,
    wkst: Days.MO,
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
rrule_RRule.MO = Days.MO;
rrule_RRule.TU = Days.TU;
rrule_RRule.WE = Days.WE;
rrule_RRule.TH = Days.TH;
rrule_RRule.FR = Days.FR;
rrule_RRule.SA = Days.SA;
rrule_RRule.SU = Days.SU;
// =============================================================================
// Iterinfo
// =============================================================================
class rrule_Iterinfo {
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
            this.yearlen = es6_dateutil.isLeapYear(year) ? 366 : 365;
            this.nextyearlen = es6_dateutil.isLeapYear(year + 1) ? 366 : 365;
            const firstyday = new Date(year, 0, 1);
            this.yearordinal = es6_dateutil.toOrdinal(firstyday);
            this.yearweekday = es6_dateutil.getWeekday(firstyday);
            const wday = es6_dateutil.getWeekday(new Date(year, 0, 1));
            if (this.yearlen === 365) {
                this.mmask = [].concat(M365MASK);
                this.mdaymask = [].concat(MDAY365MASK);
                this.nmdaymask = [].concat(NMDAY365MASK);
                this.wdaymask = WDAYMASK.slice(wday);
                this.mrange = [].concat(M365RANGE);
            }
            else {
                this.mmask = [].concat(M366MASK);
                this.mdaymask = [].concat(MDAY366MASK);
                this.nmdaymask = [].concat(NMDAY366MASK);
                this.wdaymask = WDAYMASK.slice(wday);
                this.mrange = [].concat(M366RANGE);
            }
            if (!plb(rr.options.byweekno)) {
                this.wnomask = null;
            }
            else {
                this.wnomask = repeat(0, this.yearlen + 7);
                let no1wkst;
                let firstwkst;
                let wyearlen;
                no1wkst = firstwkst = pymod(7 - this.yearweekday + rr.options.wkst, 7);
                if (no1wkst >= 4) {
                    no1wkst = 0;
                    // Number of days in the year, plus the days we got
                    // from last year.
                    wyearlen =
                        this.yearlen + pymod(this.yearweekday - rr.options.wkst, 7);
                }
                else {
                    // Number of days in the year, minus the days we
                    // left in last year.
                    wyearlen = this.yearlen - no1wkst;
                }
                const div = Math.floor(wyearlen / 7);
                const mod = pymod(wyearlen, 7);
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
                if (contains(rr.options.byweekno, 1)) {
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
                    if (!contains(rr.options.byweekno, -1)) {
                        const lyearweekday = es6_dateutil.getWeekday(new Date(year - 1, 0, 1));
                        let lno1wkst = pymod(7 - lyearweekday.valueOf() + rr.options.wkst, 7);
                        const lyearlen = es6_dateutil.isLeapYear(year - 1) ? 366 : 365;
                        if (lno1wkst >= 4) {
                            lno1wkst = 0;
                            lnumweeks = Math.floor(52 +
                                pymod(lyearlen + pymod(lyearweekday - rr.options.wkst, 7), 7) /
                                    4);
                        }
                        else {
                            lnumweeks = Math.floor(52 + pymod(this.yearlen - no1wkst, 7) / 4);
                        }
                    }
                    else {
                        lnumweeks = -1;
                    }
                    if (contains(rr.options.byweekno, lnumweeks)) {
                        for (let i = 0; i < no1wkst; i++)
                            this.wnomask[i] = 1;
                    }
                }
            }
        }
        if (plb(rr.options.bynweekday) &&
            (month !== this.lastmonth || year !== this.lastyear)) {
            let ranges = [];
            if (rr.options.freq === rrule_RRule.YEARLY) {
                if (plb(rr.options.bymonth) && rr.options.bymonth instanceof Array) {
                    for (let j = 0; j < rr.options.bymonth.length; j++) {
                        month = rr.options.bymonth[j];
                        ranges.push(this.mrange.slice(month - 1, month + 1));
                    }
                }
                else {
                    ranges = [[0, this.yearlen]];
                }
            }
            else if (rr.options.freq === rrule_RRule.MONTHLY) {
                ranges = [this.mrange.slice(month - 1, month + 1)];
            }
            if (plb(ranges)) {
                // Weekly frequency won't get here, so we may not
                // care about cross-year weekly periods.
                this.nwdaymask = repeat(0, this.yearlen);
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
                            i -= pymod((this.wdaymask[i]) - wday, 7);
                        }
                        else {
                            i = first + (n - 1) * 7;
                            i += pymod(7 - (this.wdaymask[i]) + wday, 7);
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
    ydayset(_, __, ___) {
        return [range(this.yearlen), 0, this.yearlen];
    }
    mdayset(_, month, __) {
        const set = repeat(null, this.yearlen);
        const start = this.mrange[month - 1];
        const end = this.mrange[month];
        for (let i = start; i < end; i++)
            set[i] = i;
        return [set, start, end];
    }
    wdayset(year, month, day) {
        // We need to handle cross-year weeks here.
        const set = repeat(null, this.yearlen + 7);
        let i = es6_dateutil.toOrdinal(new Date(year, month - 1, day)) - this.yearordinal;
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
        const set = repeat(null, this.yearlen);
        const i = es6_dateutil.toOrdinal(new Date(year, month - 1, day)) - this.yearordinal;
        set[i] = i;
        return [set, i, i + 1];
    }
    htimeset(hour, minute, second, millisecond) {
        const set = [];
        const rr = this.rrule;
        for (let i = 0; i < rr.options.byminute.length; i++) {
            minute = rr.options.byminute[i];
            for (let j = 0; j < rr.options.bysecond.length; j++) {
                second = rr.options.bysecond[j];
                set.push(new es6_dateutil.Time(hour, minute, second, millisecond));
            }
        }
        es6_dateutil.sort(set);
        return set;
    }
    mtimeset(hour, minute, second, millisecond) {
        const set = [];
        const rr = this.rrule;
        for (let j = 0; j < rr.options.bysecond.length; j++) {
            second = rr.options.bysecond[j];
            set.push(new es6_dateutil.Time(hour, minute, second, millisecond));
        }
        es6_dateutil.sort(set);
        return set;
    }
    stimeset(hour, minute, second, millisecond) {
        return [new es6_dateutil.Time(hour, minute, second, millisecond)];
    }
}
//# sourceMappingURL=rrule.js.map
// CONCATENATED MODULE: ./dist/es6/rruleset.js



/**
 *
 * @param {Boolean?} noCache
 *  The same stratagy as RRule on cache, default to false
 * @constructor
 */
class rruleset_RRuleSet extends rrule_RRule {
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
        if (!(rrule instanceof rrule_RRule)) {
            throw new TypeError(String(rrule) + ' is not RRule instance');
        }
        if (!contains(this._rrule.map(String), String(rrule))) {
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
        if (!contains(this._rdate.map(Number), Number(date))) {
            this._rdate.push(date);
            es6_dateutil.sort(this._rdate);
        }
    }
    /**
     * @param {RRule}
     */
    exrule(rrule) {
        if (!(rrule instanceof rrule_RRule)) {
            throw new TypeError(String(rrule) + ' is not RRule instance');
        }
        if (!contains(this._exrule.map(String), String(rrule))) {
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
        if (!contains(this._exdate.map(Number), Number(date))) {
            this._exdate.push(date);
            es6_dateutil.sort(this._exdate);
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
                    return es6_dateutil.timeToUntilString(rdate.valueOf());
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
                    return es6_dateutil.timeToUntilString(exdate.valueOf());
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
        es6_dateutil.sort(res);
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
        const rrs = new rruleset_RRuleSet(!!this._cache);
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
//# sourceMappingURL=rruleset.js.map
// CONCATENATED MODULE: ./dist/es6/rrulestr.js





/**
 * RRuleStr
 *  To parse a set of rrule strings
 */
class rrulestr_RRuleStr {
    constructor() {
        // tslint:disable-next-line:variable-name
        this._handle_BYDAY = this._handle_BYWEEKDAY;
        // tslint:disable-next-line:variable-name
        this._handle_INTERVAL = this._handle_int;
        // tslint:disable-next-line:variable-name
        this._handle_COUNT = this._handle_int;
        // tslint:disable-next-line:variable-name
        this._handle_BYSETPOS = this._handle_int_list;
        // tslint:disable-next-line:variable-name
        this._handle_BYMONTH = this._handle_int_list;
        // tslint:disable-next-line:variable-name
        this._handle_BYMONTHDAY = this._handle_int_list;
        // tslint:disable-next-line:variable-name
        this._handle_BYYEARDAY = this._handle_int_list;
        // tslint:disable-next-line:variable-name
        this._handle_BYEASTER = this._handle_int_list;
        // tslint:disable-next-line:variable-name
        this._handle_BYWEEKNO = this._handle_int_list;
        // tslint:disable-next-line:variable-name
        this._handle_BYHOUR = this._handle_int_list;
        // tslint:disable-next-line:variable-name
        this._handle_BYMINUTE = this._handle_int_list;
        // tslint:disable-next-line:variable-name
        this._handle_BYSECOND = this._handle_int_list;
    }
    // tslint:disable-next-line:variable-name
    _handle_DTSTART(rrkwargs, name, value, _) {
        // @ts-ignore
        rrkwargs[name.toLowerCase()] = es6_dateutil.untilStringToDate(value);
    }
    _handle_int(rrkwargs, name, value) {
        // @ts-ignore
        rrkwargs[name.toLowerCase()] = parseInt(value, 10);
    }
    _handle_int_list(rrkwargs, name, value) {
        // @ts-ignore
        rrkwargs[name.toLowerCase()] = value.split(',').map(x => parseInt(x, 10));
    }
    _handle_FREQ(rrkwargs, _, value, __) {
        // eslint-disable-line
        rrkwargs['freq'] = rrulestr_RRuleStr._freq_map[value];
    }
    _handle_UNTIL(rrkwargs, _, value, __) {
        // eslint-disable-line
        try {
            rrkwargs['until'] = es6_dateutil.untilStringToDate(value);
        }
        catch (error) {
            throw new Error('invalid until date');
        }
    }
    _handle_WKST(rrkwargs, _, value, __) {
        // eslint-disable-line
        rrkwargs['wkst'] = rrulestr_RRuleStr._weekday_map[value];
    }
    _handle_BYWEEKDAY(rrkwargs, _, value, __) {
        // Two ways to specify this: +1MO or MO(+1)
        let splt;
        let i;
        let j;
        let n;
        let w;
        let wday;
        const l = [];
        const wdays = value.split(',');
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
            const weekday = new Weekday(rrulestr_RRuleStr._weekday_map[w], n);
            l.push(weekday);
        }
        rrkwargs['byweekday'] = l;
    }
    _parseRfcRRule(line, options = {}) {
        options.dtstart = options.dtstart || null;
        options.cache = options.cache || false;
        options.ignoretz = options.ignoretz || false;
        options.tzinfos = options.tzinfos || null;
        let name;
        let value;
        let parts;
        if (line.indexOf(':') !== -1) {
            parts = line.split(':');
            name = parts[0];
            value = parts[1];
            if (name !== 'RRULE')
                throw new Error('unknown parameter name');
        }
        else {
            value = line;
        }
        const rrkwargs = {};
        const pairs = value.split(';');
        for (let i = 0; i < pairs.length; i++) {
            parts = pairs[i].split('=');
            name = parts[0].toUpperCase();
            value = parts[1].toUpperCase();
            try {
                // @ts-ignore
                this['_handle_' + name](rrkwargs, name, value, {
                    ignoretz: options.ignoretz,
                    tzinfos: options.tzinfos
                });
            }
            catch (error) {
                throw new Error("unknown parameter '" + name + "':" + value);
            }
        }
        rrkwargs.dtstart = rrkwargs.dtstart || options.dtstart;
        return new rrule_RRule(rrkwargs, !options.cache);
    }
    _parseRfc(s, options) {
        if (options.compatible) {
            options.forceset = true;
            options.unfold = true;
        }
        s = s && s.toUpperCase().trim();
        if (!s)
            throw new Error('Invalid empty string');
        let i = 0;
        let line;
        let lines;
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
        const rrulevals = [];
        const rdatevals = [];
        const exrulevals = [];
        const exdatevals = [];
        let name;
        let value;
        let parts;
        let parms;
        let parm;
        let dtstart;
        let rset;
        let j;
        let k;
        let datestrs;
        let datestr;
        if (!options.forceset &&
            lines.length === 1 &&
            (s.indexOf(':') === -1 || s.indexOf('RRULE:') === 0)) {
            return this._parseRfcRRule(lines[0], {
                cache: options.cache,
                dtstart: options.dtstart,
                ignoretz: options.ignoretz,
                tzinfos: options.tzinfos
            });
        }
        else {
            for (let i = 0; i < lines.length; i++) {
                line = lines[i];
                if (!line)
                    continue;
                if (line.indexOf(':') === -1) {
                    name = 'RRULE';
                    value = line;
                }
                else {
                    parts = split(line, ':', 1);
                    name = parts[0];
                    value = parts[1];
                }
                parms = name.split(';');
                if (!parms)
                    throw new Error('empty property name');
                name = parms[0];
                parms = parms.slice(1);
                if (name === 'RRULE') {
                    for (j = 0; j < parms.length; j++) {
                        parm = parms[j];
                        throw new Error('unsupported RRULE parm: ' + parm);
                    }
                    rrulevals.push(value);
                }
                else if (name === 'RDATE') {
                    for (j = 0; j < parms.length; j++) {
                        parm = parms[j];
                        if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
                            throw new Error('unsupported RDATE parm: ' + parm);
                        }
                    }
                    rdatevals.push(value);
                }
                else if (name === 'EXRULE') {
                    for (j = 0; j < parms.length; j++) {
                        parm = parms[j];
                        throw new Error('unsupported EXRULE parm: ' + parm);
                    }
                    exrulevals.push(value);
                }
                else if (name === 'EXDATE') {
                    for (j = 0; j < parms.length; j++) {
                        parm = parms[j];
                        if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
                            throw new Error('unsupported EXDATE parm: ' + parm);
                        }
                    }
                    exdatevals.push(value);
                }
                else if (name === 'DTSTART') {
                    dtstart = es6_dateutil.untilStringToDate(value);
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
                rset = new rruleset_RRuleSet(!options.cache);
                for (j = 0; j < rrulevals.length; j++) {
                    rset.rrule(this._parseRfcRRule(rrulevals[j], {
                        dtstart: options.dtstart || dtstart,
                        ignoretz: options.ignoretz,
                        tzinfos: options.tzinfos
                    }));
                }
                for (j = 0; j < rdatevals.length; j++) {
                    datestrs = rdatevals[j].split(',');
                    for (k = 0; k < datestrs.length; k++) {
                        datestr = datestrs[k];
                        rset.rdate(es6_dateutil.untilStringToDate(datestr));
                    }
                }
                for (j = 0; j < exrulevals.length; j++) {
                    rset.exrule(this._parseRfcRRule(exrulevals[j], {
                        dtstart: options.dtstart || dtstart,
                        ignoretz: options.ignoretz,
                        tzinfos: options.tzinfos
                    }));
                }
                for (j = 0; j < exdatevals.length; j++) {
                    datestrs = exdatevals[j].split(',');
                    for (k = 0; k < datestrs.length; k++) {
                        datestr = datestrs[k];
                        rset.exdate(es6_dateutil.untilStringToDate(datestr));
                    }
                }
                if (options.campatiable && options.dtstart)
                    rset.rdate(dtstart);
                return rset;
            }
            else {
                return this._parseRfcRRule(rrulevals[0], {
                    dtstart: options.dtstart || dtstart,
                    cache: options.cache,
                    ignoretz: options.ignoretz,
                    tzinfos: options.tzinfos
                });
            }
        }
    }
    parse(s, options = {}) {
        const invalid = [];
        const keys = Object.keys(options);
        const defaultKeys = Object.keys(rrulestr_RRuleStr.DEFAULT_OPTIONS);
        keys.forEach(function (key) {
            if (!contains(defaultKeys, key))
                invalid.push(key);
        }, this);
        if (invalid.length) {
            throw new Error('Invalid options: ' + invalid.join(', '));
        }
        // Merge in default options
        defaultKeys.forEach(function (key) {
            // @ts-ignore
            if (!contains(keys, key))
                options[key] = rrulestr_RRuleStr.DEFAULT_OPTIONS[key];
        });
        return this._parseRfc(s, options);
    }
}
// tslint:disable-next-line:variable-name
rrulestr_RRuleStr._weekday_map = {
    MO: 0,
    TU: 1,
    WE: 2,
    TH: 3,
    FR: 4,
    SA: 5,
    SU: 6
};
// tslint:disable-next-line:variable-name
rrulestr_RRuleStr._freq_map = {
    YEARLY: rrule_RRule.YEARLY,
    MONTHLY: rrule_RRule.MONTHLY,
    WEEKLY: rrule_RRule.WEEKLY,
    DAILY: rrule_RRule.DAILY,
    HOURLY: rrule_RRule.HOURLY,
    MINUTELY: rrule_RRule.MINUTELY,
    SECONDLY: rrule_RRule.SECONDLY
};
rrulestr_RRuleStr.DEFAULT_OPTIONS = {
    dtstart: null,
    cache: false,
    unfold: false,
    forceset: false,
    compatible: false,
    ignoretz: false,
    tzinfos: null
};
//# sourceMappingURL=rrulestr.js.map
// CONCATENATED MODULE: ./dist/es6/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rrulestr", function() { return rrulestr; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "RRule", function() { return rrule_RRule; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "RRuleSet", function() { return rruleset_RRuleSet; });
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
const rruleStr = new rrulestr_RRuleStr();
const rrulestr = function () {
    return rruleStr.parse.apply(rruleStr, arguments);
};

/* harmony default export */ var es6 = __webpack_exports__["default"] = (rrule_RRule);
//# sourceMappingURL=index.js.map

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./dist/es6/nlp/i18n.js
// =============================================================================
// i18n
// =============================================================================
const ENGLISH = {
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
// EXTERNAL MODULE: ./dist/es6/index.js + 9 modules
var es6 = __webpack_require__(0);

// CONCATENATED MODULE: ./dist/es6/nlp/totext.js


// =============================================================================
// Helper functions
// =============================================================================
/**
 * Return true if a value is in an array
 */
const contains = function (arr, val) {
    return arr.indexOf(val) !== -1;
};
/**
 *
 * @param {RRule} rrule
 * Optional:
 * @param {Function} gettext function
 * @param {Object} language definition
 * @constructor
 */
class totext_ToText {
    constructor(rrule, gettext, language = i18n) {
        this.text = [];
        this.language = language || i18n;
        this.gettext =
            gettext ||
                function (id) {
                    return id.toString();
                };
        this.rrule = rrule;
        this.options = rrule.options;
        this.origOptions = rrule.origOptions;
        if (this.origOptions.bymonthday) {
            const bymonthday = [].concat(this.options.bymonthday);
            const bynmonthday = [].concat(this.options.bynmonthday);
            bymonthday.sort();
            bynmonthday.sort();
            bynmonthday.reverse();
            // 1, 2, 3, .., -5, -4, -3, ..
            this.bymonthday = bymonthday.concat(bynmonthday);
            if (!this.bymonthday.length)
                this.bymonthday = null;
        }
        if (this.origOptions.byweekday) {
            const byweekday = !(this.origOptions.byweekday instanceof Array)
                ? [this.origOptions.byweekday]
                : this.origOptions.byweekday;
            const days = String(byweekday);
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
                    days.indexOf('SU') === -1
            };
            const sortWeekDays = function (a, b) {
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
    static isFullyConvertible(rrule) {
        let canConvert = true;
        if (!(rrule.options.freq in totext_ToText.IMPLEMENTED))
            return false;
        if (rrule.origOptions.until && rrule.origOptions.count)
            return false;
        for (let key in rrule.origOptions) {
            if (contains(['dtstart', 'wkst', 'freq'], key))
                return true;
            if (!contains(totext_ToText.IMPLEMENTED[rrule.options.freq], key))
                return false;
        }
        return canConvert;
    }
    isFullyConvertible() {
        return totext_ToText.isFullyConvertible(this.rrule);
    }
    /**
     * Perform the conversion. Only some of the frequencies are supported.
     * If some of the rrule's options aren't supported, they'll
     * be omitted from the output an "(~ approximate)" will be appended.
     * @return {*}
     */
    toString() {
        const gettext = this.gettext;
        if (!(this.options.freq in totext_ToText.IMPLEMENTED)) {
            return gettext('RRule error: Unable to fully convert this rrule to text');
        }
        this.text = [gettext('every')];
        // @ts-ignore
        this[es6["default"].FREQUENCIES[this.options.freq]]();
        if (this.options.until) {
            this.add(gettext('until'));
            const until = this.options.until;
            this.add(this.language.monthNames[until.getMonth()])
                .add(until.getDate() + ',')
                .add(until.getFullYear().toString());
        }
        else if (this.options.count) {
            this.add(gettext('for'))
                .add(this.options.count.toString())
                .add(this.plural(this.options.count) ? gettext('times') : gettext('time'));
        }
        if (!this.isFullyConvertible())
            this.add(gettext('(~ approximate)'));
        return this.text.join('');
    }
    HOURLY() {
        const gettext = this.gettext;
        if (this.options.interval !== 1)
            this.add(this.options.interval.toString());
        this.add(this.plural(this.options.interval) ? gettext('hours') : gettext('hour'));
    }
    MINUTELY() {
        const gettext = this.gettext;
        if (this.options.interval !== 1)
            this.add(this.options.interval.toString());
        this.add(this.plural(this.options.interval)
            ? gettext('minutes')
            : gettext('minutes'));
    }
    DAILY() {
        const gettext = this.gettext;
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
    }
    WEEKLY() {
        const gettext = this.gettext;
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
    }
    MONTHLY() {
        const gettext = this.gettext;
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
    }
    YEARLY() {
        const gettext = this.gettext;
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
                .add(this.list(this.options.byweekno, null, gettext('and')));
        }
    }
    _bymonthday() {
        const gettext = this.gettext;
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
    }
    _byweekday() {
        const gettext = this.gettext;
        if (this.byweekday.allWeeks && !this.byweekday.isWeekdays) {
            this.add(gettext('on')).add(this.list(this.byweekday.allWeeks, this.weekdaytext));
        }
        if (this.byweekday.someWeeks) {
            if (this.byweekday.allWeeks)
                this.add(gettext('and'));
            this.add(gettext('on the')).add(this.list(this.byweekday.someWeeks, this.weekdaytext, gettext('and')));
        }
    }
    _byhour() {
        const gettext = this.gettext;
        this.add(gettext('at')).add(this.list(this.origOptions.byhour, null, gettext('and')));
    }
    _bymonth() {
        this.add(this.list(this.options.bymonth, this.monthtext, this.gettext('and')));
    }
    nth(n) {
        n = parseInt(n.toString(), 10);
        let nth;
        let npos;
        const gettext = this.gettext;
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
    }
    monthtext(m) {
        return this.language.monthNames[m - 1];
    }
    weekdaytext(wday) {
        const weekday = typeof wday === 'number' ? (wday + 1) % 7 : wday.getJsWeekday();
        return ((wday.n ? this.nth(wday.n) + ' ' : '') + this.language.dayNames[weekday]);
    }
    plural(n) {
        return n % 100 !== 1;
    }
    add(s) {
        this.text.push(' ');
        this.text.push(s);
        return this;
    }
    list(arr, callback, finalDelim, delim = ',') {
        if (!(arr instanceof Array)) {
            arr = [arr];
        }
        const delimJoin = function (array, delimiter, finalDelimiter) {
            let list = '';
            for (let i = 0; i < array.length; i++) {
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
        const self = this;
        const realCallback = function (arg) {
            return callback.call(self, arg);
        };
        if (finalDelim) {
            return delimJoin(arr.map(realCallback), delim, finalDelim);
        }
        else {
            return arr.map(realCallback).join(delim + ' ');
        }
    }
}
//# sourceMappingURL=totext.js.map
// CONCATENATED MODULE: ./dist/es6/nlp/parsetext.js


// =============================================================================
// Parser
// =============================================================================
class Parser {
    constructor(rules) {
        this.done = true;
        this.rules = rules;
    }
    start(text) {
        this.text = text;
        this.done = false;
        return this.nextSymbol();
    }
    isDone() {
        return this.done && this.symbol == null;
    }
    nextSymbol() {
        let best;
        let bestSymbol;
        const p = this;
        this.symbol = null;
        this.value = null;
        do {
            if (this.done)
                return false;
            let match;
            let rule;
            best = null;
            for (let name in this.rules) {
                rule = this.rules[name];
                match = rule.exec(p.text);
                if (match) {
                    if (best == null || match[0].length > best[0].length) {
                        best = match;
                        bestSymbol = name;
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
        } while (bestSymbol === 'SKIP');
        this.symbol = bestSymbol;
        this.value = best;
        return true;
    }
    accept(name) {
        if (this.symbol === name) {
            if (this.value) {
                const v = this.value;
                this.nextSymbol();
                return v;
            }
            this.nextSymbol();
            return true;
        }
        return false;
    }
    expect(name) {
        if (this.accept(name))
            return true;
        throw new Error('expected ' + name + ' but found ' + this.symbol);
    }
}
function parseText(text, language) {
    const options = {};
    const ttr = new Parser((language || i18n).tokens);
    if (!ttr.start(text))
        return null;
    S();
    return options;
    function S() {
        // every [n]
        ttr.expect('every');
        let n = ttr.accept('number');
        if (n)
            options.interval = parseInt(n[0], 10);
        if (ttr.isDone())
            throw new Error('Unexpected end');
        switch (ttr.symbol) {
            case 'day(s)':
                options.freq = es6["default"].DAILY;
                if (ttr.nextSymbol()) {
                    AT();
                    F();
                }
                break;
            // FIXME Note: every 2 weekdays != every two weeks on weekdays.
            // DAILY on weekdays is not a valid rule
            case 'weekday(s)':
                options.freq = es6["default"].WEEKLY;
                options.byweekday = [
                    es6["default"].MO,
                    es6["default"].TU,
                    es6["default"].WE,
                    es6["default"].TH,
                    es6["default"].FR
                ];
                ttr.nextSymbol();
                F();
                break;
            case 'week(s)':
                options.freq = es6["default"].WEEKLY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'hour(s)':
                options.freq = es6["default"].HOURLY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'minute(s)':
                options.freq = es6["default"].MINUTELY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'month(s)':
                options.freq = es6["default"].MONTHLY;
                if (ttr.nextSymbol()) {
                    ON();
                    F();
                }
                break;
            case 'year(s)':
                options.freq = es6["default"].YEARLY;
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
                options.freq = es6["default"].WEEKLY;
                const key = ttr.symbol.substr(0, 2).toUpperCase();
                // @ts-ignore
                options.byweekday = [es6["default"][key]];
                if (!ttr.nextSymbol())
                    return;
                // TODO check for duplicates
                while (ttr.accept('comma')) {
                    if (ttr.isDone())
                        throw new Error('Unexpected end');
                    let wkd = decodeWKD();
                    if (!wkd) {
                        throw new Error('Unexpected symbol ' + ttr.symbol + ', expected weekday');
                    }
                    // @ts-ignore
                    options.byweekday.push(es6["default"][wkd]);
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
                options.freq = es6["default"].YEARLY;
                options.bymonth = [decodeM()];
                if (!ttr.nextSymbol())
                    return;
                // TODO check for duplicates
                while (ttr.accept('comma')) {
                    if (ttr.isDone())
                        throw new Error('Unexpected end');
                    let m = decodeM();
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
        const on = ttr.accept('on');
        const the = ttr.accept('the');
        if (!(on || the))
            return;
        do {
            let nth = decodeNTH();
            let wkd = decodeWKD();
            let m = decodeM();
            // nth <weekday> | <weekday>
            if (nth) {
                // ttr.nextSymbol()
                if (wkd) {
                    ttr.nextSymbol();
                    if (!options.byweekday)
                        options.byweekday = [];
                    // @ts-ignore
                    options.byweekday.push(es6["default"][wkd].nth(nth));
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
                options.byweekday.push(es6["default"][wkd]);
            }
            else if (ttr.symbol === 'weekday(s)') {
                ttr.nextSymbol();
                if (!options.byweekday)
                    options.byweekday = [];
                options.byweekday.push(es6["default"].MO);
                options.byweekday.push(es6["default"].TU);
                options.byweekday.push(es6["default"].WE);
                options.byweekday.push(es6["default"].TH);
                options.byweekday.push(es6["default"].FR);
            }
            else if (ttr.symbol === 'week(s)') {
                ttr.nextSymbol();
                let n = ttr.accept('number');
                if (!n) {
                    throw new Error('Unexpected symbol ' + ttr.symbol + ', expected week number');
                }
                options.byweekno = [n[0]];
                while (ttr.accept('comma')) {
                    n = ttr.accept('number');
                    if (!n) {
                        throw new Error('Unexpected symbol ' + ttr.symbol + '; expected monthday');
                    }
                    options.byweekno.push(n[0]);
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
        const at = ttr.accept('at');
        if (!at)
            return;
        do {
            let n = ttr.accept('number');
            if (!n) {
                throw new Error('Unexpected symbol ' + ttr.symbol + ', expected hour');
            }
            options.byhour = [n[0]];
            while (ttr.accept('comma')) {
                n = ttr.accept('number');
                if (!n) {
                    throw new Error('Unexpected symbol ' + ttr.symbol + '; expected hour');
                }
                options.byhour.push(n[0]);
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
                const v = parseInt(ttr.value[1], 10);
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
        let nth = decodeNTH();
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
            const date = Date.parse(ttr.text);
            if (!date)
                throw new Error('Cannot parse until date:' + ttr.text);
            options.until = new Date(date);
        }
        else if (ttr.accept('for')) {
            options.count = ttr.value[0];
            ttr.expect('number');
            // ttr.expect('times')
        }
    }
}
//# sourceMappingURL=parsetext.js.map
// CONCATENATED MODULE: ./dist/es6/nlp/index.js
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
const fromText = function (text, language) {
    return new es6["default"](parseText(text, language));
};
const common = [
    'count',
    'until',
    'interval',
    'byweekday',
    'bymonthday',
    'bymonth'
];
totext_ToText.IMPLEMENTED = [];
totext_ToText.IMPLEMENTED[es6["default"].HOURLY] = common;
totext_ToText.IMPLEMENTED[es6["default"].MINUTELY] = common;
totext_ToText.IMPLEMENTED[es6["default"].DAILY] = ['byhour'].concat(common);
totext_ToText.IMPLEMENTED[es6["default"].WEEKLY] = common;
totext_ToText.IMPLEMENTED[es6["default"].MONTHLY] = common;
totext_ToText.IMPLEMENTED[es6["default"].YEARLY] = ['byweekno', 'byyearday'].concat(common);
// =============================================================================
// Export
// =============================================================================
const toText = function (rrule, gettext, language) {
    return new totext_ToText(rrule, gettext, language).toString();
};
const { isFullyConvertible } = totext_ToText;

//# sourceMappingURL=index.js.map

/***/ })
/******/ ]);
});
//# sourceMappingURL=rrule.js.map