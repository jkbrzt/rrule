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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contains = exports.plb = exports.divmod = exports.pymod = exports.split = exports.repeat = exports.range = void 0;

// =============================================================================
// Helper functions
// =============================================================================

/**
 * Simplified version of python's range()
 */
var range = function range(start, end) {
  if (arguments.length === 1) {
    end = start;
    start = 0;
  }

  var rang = [];

  for (var i = start; i < end; i++) {
    rang.push(i);
  }

  return rang;
};

exports.range = range;

var repeat = function repeat(value, times) {
  var i = 0;
  var array = [];

  if (value instanceof Array) {
    for (; i < times; i++) {
      array[i] = [].concat(value);
    }
  } else {
    for (; i < times; i++) {
      array[i] = value;
    }
  }

  return array;
};
/**
 * Python like split
 */


exports.repeat = repeat;

var split = function split(str, sep, num) {
  var splits = str.split(sep);
  return num ? splits.slice(0, num).concat([splits.slice(num).join(sep)]) : splits;
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


exports.split = split;

var pymod = function pymod(a, b) {
  var r = a % b; // If r and b differ in sign, add b to wrap the result to the correct sign.

  return r * b < 0 ? r + b : r;
};
/**
 * @see: <http://docs.python.org/library/functions.html#divmod>
 */


exports.pymod = pymod;

var divmod = function divmod(a, b) {
  return {
    div: Math.floor(a / b),
    mod: pymod(a, b)
  };
};
/**
 * Python-like boolean
 * @return {Boolean} value of an object/primitive, taking into account
 * the fact that in Python an empty list's/tuple's
 * boolean value is False, whereas in JS it's true
 */


exports.divmod = divmod;

var plb = function plb(obj) {
  return obj instanceof Array && obj.length === 0 ? false : Boolean(obj);
};
/**
 * Return true if a value is in an array
 */


exports.plb = plb;

var contains = function contains(arr, val) {
  return arr.indexOf(val) !== -1;
};

exports.contains = contains;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RRule", {
  enumerable: true,
  get: function get() {
    return _rrule.default;
  }
});
Object.defineProperty(exports, "RRuleSet", {
  enumerable: true,
  get: function get() {
    return _rruleset.default;
  }
});
exports.default = exports.rrulestr = void 0;

var _rrule = _interopRequireDefault(__webpack_require__(2));

var _rruleset = _interopRequireDefault(__webpack_require__(7));

var _rrulestr = _interopRequireDefault(__webpack_require__(13));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var rruleStr = new _rrulestr.default();

var rrulestr = function rrulestr() {
  return rruleStr.parse.apply(rruleStr, arguments);
};

exports.rrulestr = rrulestr;
_rrule.default.RRule = _rrule.default;
_rrule.default.RRuleSet = _rruleset.default;
_rrule.default.rrulestr = rrulestr;
var _default = _rrule.default;
exports.default = _default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _weekday = _interopRequireDefault(__webpack_require__(4));

var _dateutil = _interopRequireDefault(__webpack_require__(3));

var _helpers = __webpack_require__(0);

var _masks = __webpack_require__(8);

var _iterresult = _interopRequireDefault(__webpack_require__(5));

var _callbackiterresult = _interopRequireDefault(__webpack_require__(9));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// =============================================================================
// RRule
// =============================================================================

/**
 *
 * @param {Object?} options - see <http://labix.org/python-dateutil/#head-cf004ee9a75592797e076752b2a889c10f445418>
 *        The only required option is `freq`, one of RRule.YEARLY, RRule.MONTHLY, ...
 * @constructor
 */
var RRule =
/*#__PURE__*/
function () {
  function RRule(options, noCache) {
    _classCallCheck(this, RRule);

    options = options || {}; // RFC string

    this._string = null;
    this._cache = noCache ? null : {
      all: false,
      before: [],
      after: [],
      between: [] // used by toString()

    };
    this.origOptions = {};
    this.options = {};
    var invalid = [];
    var keys = Object.keys(options);
    var defaultKeys = Object.keys(RRule.DEFAULT_OPTIONS); // Shallow copy for options and origOptions and check for invalid

    keys.forEach(function (key) {
      this.origOptions[key] = options[key];
      this.options[key] = options[key];
      if (!(0, _helpers.contains)(defaultKeys, key)) invalid.push(key);
    }, this);
    if (invalid.length) throw new Error('Invalid options: ' + invalid.join(', '));

    if (!RRule.FREQUENCIES[options.freq] && options.byeaster === null) {
      throw new Error('Invalid frequency: ' + String(options.freq));
    } // Merge in default options


    defaultKeys.forEach(function (key) {
      if (!(0, _helpers.contains)(keys, key)) this.options[key] = RRule.DEFAULT_OPTIONS[key];
    }, this);
    var opts = this.options;
    if (opts.byeaster !== null) opts.freq = RRule.YEARLY;
    if (!opts.dtstart) opts.dtstart = new Date(new Date().setMilliseconds(0));
    var millisecondModulo = opts.dtstart.getTime() % 1000;

    if (opts.wkst === null) {
      opts.wkst = RRule.MO.weekday;
    } else if (typeof opts.wkst === 'number') {// cool, just keep it like that
    } else {
      opts.wkst = opts.wkst.weekday;
    }

    var v;

    if (opts.bysetpos !== null) {
      if (typeof opts.bysetpos === 'number') opts.bysetpos = [opts.bysetpos];

      for (var i = 0; i < opts.bysetpos.length; i++) {
        v = opts.bysetpos[i];

        if (v === 0 || !(v >= -366 && v <= 366)) {
          throw new Error('bysetpos must be between 1 and 366,' + ' or between -366 and -1');
        }
      }
    }

    if (!((0, _helpers.plb)(opts.byweekno) || (0, _helpers.plb)(opts.byyearday) || (0, _helpers.plb)(opts.bymonthday) || opts.byweekday !== null || opts.byeaster !== null)) {
      switch (opts.freq) {
        case RRule.YEARLY:
          if (!opts.bymonth) opts.bymonth = opts.dtstart.getMonth() + 1;
          opts.bymonthday = opts.dtstart.getDate();
          break;

        case RRule.MONTHLY:
          opts.bymonthday = opts.dtstart.getDate();
          break;

        case RRule.WEEKLY:
          opts.byweekday = _dateutil.default.getWeekday(opts.dtstart);
          break;
      }
    } // bymonth


    if (opts.bymonth !== null && !(opts.bymonth instanceof Array)) {
      opts.bymonth = [opts.bymonth];
    } // byyearday


    if (opts.byyearday !== null && !(opts.byyearday instanceof Array)) {
      opts.byyearday = [opts.byyearday];
    } // bymonthday


    if (opts.bymonthday === null) {
      opts.bymonthday = [];
      opts.bynmonthday = [];
    } else if (opts.bymonthday instanceof Array) {
      var bymonthday = [];
      var bynmonthday = [];

      for (var _i = 0; _i < opts.bymonthday.length; _i++) {
        v = opts.bymonthday[_i];

        if (v > 0) {
          bymonthday.push(v);
        } else if (v < 0) {
          bynmonthday.push(v);
        }
      }

      opts.bymonthday = bymonthday;
      opts.bynmonthday = bynmonthday;
    } else {
      if (opts.bymonthday < 0) {
        opts.bynmonthday = [opts.bymonthday];
        opts.bymonthday = [];
      } else {
        opts.bynmonthday = [];
        opts.bymonthday = [opts.bymonthday];
      }
    } // byweekno


    if (opts.byweekno !== null && !(opts.byweekno instanceof Array)) {
      opts.byweekno = [opts.byweekno];
    } // byweekday / bynweekday


    if (opts.byweekday === null) {
      opts.bynweekday = null;
    } else if (typeof opts.byweekday === 'number') {
      opts.byweekday = [opts.byweekday];
      opts.bynweekday = null;
    } else if (opts.byweekday instanceof _weekday.default) {
      if (!opts.byweekday.n || opts.freq > RRule.MONTHLY) {
        opts.byweekday = [opts.byweekday.weekday];
        opts.bynweekday = null;
      } else {
        opts.bynweekday = [[opts.byweekday.weekday, opts.byweekday.n]];
        opts.byweekday = null;
      }
    } else {
      var byweekday = [];
      var bynweekday = [];

      for (var _i2 = 0; _i2 < opts.byweekday.length; _i2++) {
        var wday = opts.byweekday[_i2];

        if (typeof wday === 'number') {
          byweekday.push(wday);
        } else if (!wday.n || opts.freq > RRule.MONTHLY) {
          byweekday.push(wday.weekday);
        } else {
          bynweekday.push([wday.weekday, wday.n]);
        }
      }

      opts.byweekday = (0, _helpers.plb)(byweekday) ? byweekday : null;
      opts.bynweekday = (0, _helpers.plb)(bynweekday) ? bynweekday : null;
    } // byhour


    if (opts.byhour === null) {
      opts.byhour = opts.freq < RRule.HOURLY ? [opts.dtstart.getHours()] : null;
    } else if (typeof opts.byhour === 'number') {
      opts.byhour = [opts.byhour];
    } // byminute


    if (opts.byminute === null) {
      opts.byminute = opts.freq < RRule.MINUTELY ? [opts.dtstart.getMinutes()] : null;
    } else if (typeof opts.byminute === 'number') {
      opts.byminute = [opts.byminute];
    } // bysecond


    if (opts.bysecond === null) {
      opts.bysecond = opts.freq < RRule.SECONDLY ? [opts.dtstart.getSeconds()] : null;
    } else if (typeof opts.bysecond === 'number') {
      opts.bysecond = [opts.bysecond];
    }

    if (opts.freq >= RRule.HOURLY) {
      this.timeset = null;
    } else {
      this.timeset = [];

      for (var _i3 = 0; _i3 < opts.byhour.length; _i3++) {
        var hour = opts.byhour[_i3];

        for (var j = 0; j < opts.byminute.length; j++) {
          var minute = opts.byminute[j];

          for (var k = 0; k < opts.bysecond.length; k++) {
            var second = opts.bysecond[k]; // python:
            // datetime.time(hour, minute, second,
            // tzinfo=self._tzinfo))

            this.timeset.push(new _dateutil.default.Time(hour, minute, second, millisecondModulo));
          }
        }
      }

      _dateutil.default.sort(this.timeset);
    }
  }

  _createClass(RRule, [{
    key: "all",

    /**
     * @param {Function} iterator - optional function that will be called
     *                   on each date that is added. It can return false
     *                   to stop the iteration.
     * @return Array containing all recurrences.
     */
    value: function all(iterator) {
      if (iterator) {
        return this._iter(new _callbackiterresult.default('all', {}, iterator));
      } else {
        var result = this._cacheGet('all');

        if (result === false) {
          result = this._iter(new _iterresult.default('all', {}));

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

  }, {
    key: "between",
    value: function between(after, before, inc, iterator) {
      var args = {
        before: before,
        after: after,
        inc: inc
      };

      if (iterator) {
        return this._iter(new _callbackiterresult.default('between', args, iterator));
      }

      var result = this._cacheGet('between', args);

      if (result === false) {
        result = this._iter(new _iterresult.default('between', args));

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

  }, {
    key: "before",
    value: function before(dt, inc) {
      var args = {
        dt: dt,
        inc: inc
      };

      var result = this._cacheGet('before', args);

      if (result === false) {
        result = this._iter(new _iterresult.default('before', args));

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

  }, {
    key: "after",
    value: function after(dt, inc) {
      var args = {
        dt: dt,
        inc: inc
      };

      var result = this._cacheGet('after', args);

      if (result === false) {
        result = this._iter(new _iterresult.default('after', args));

        this._cacheAdd('after', result, args);
      }

      return result;
    }
    /**
     * Returns the number of recurrences in this set. It will have go trough
     * the whole recurrence, if this hasn't been done before.
     */

  }, {
    key: "count",
    value: function count() {
      return this.all().length;
    }
    /**
     * Converts the rrule into its string representation
     * @see <http://www.ietf.org/rfc/rfc2445.txt>
     * @return String
     */

  }, {
    key: "toString",
    value: function toString() {
      return RRule.optionsToString(this.origOptions);
    }
    /**
    * Will convert all rules described in nlp:ToText
    * to text.
    */

  }, {
    key: "toText",
    value: function toText(gettext, language) {
      return getnlp().toText(this, gettext, language);
    }
  }, {
    key: "isFullyConvertibleToText",
    value: function isFullyConvertibleToText() {
      return getnlp().isFullyConvertible(this);
    }
    /**
     * @param {String} what - all/before/after/between
     * @param {Array,Date} value - an array of dates, one date, or null
     * @param {Object?} args - _iter arguments
     */

  }, {
    key: "_cacheAdd",
    value: function _cacheAdd(what, value, args) {
      if (!this._cache) return;

      if (value) {
        value = value instanceof Date ? _dateutil.default.clone(value) : _dateutil.default.cloneDates(value);
      }

      if (what === 'all') {
        this._cache.all = value;
      } else {
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

  }, {
    key: "_cacheGet",
    value: function _cacheGet(what, args) {
      if (!this._cache) return false;
      var cached = false;
      var argsKeys = args ? Object.keys(args) : [];

      var findCacheDiff = function findCacheDiff(item) {
        for (var key, i = 0; i < argsKeys.length; i++) {
          key = argsKeys[i];
          if (String(args[key]) !== String(item[key])) return true;
        }

        return false;
      };

      if (what === 'all') {
        cached = this._cache.all;
      } else {
        // Let's see whether we've already called the
        // 'what' method with the same 'args'
        for (var item, i = 0; i < this._cache[what].length; i++) {
          item = this._cache[what][i];
          if (argsKeys.length && findCacheDiff(item)) continue;
          cached = item._value;
          break;
        }
      }

      if (!cached && this._cache.all) {
        // Not in the cache, but we already know all the occurrences,
        // so we can find the correct dates from the cached ones.
        var iterResult = new _iterresult.default(what, args);

        for (var _i4 = 0; _i4 < this._cache.all.length; _i4++) {
          if (!iterResult.accept(this._cache.all[_i4])) break;
        }

        cached = iterResult.getValue();

        this._cacheAdd(what, cached, args);
      }

      return cached instanceof Array ? _dateutil.default.cloneDates(cached) : cached instanceof Date ? _dateutil.default.clone(cached) : cached;
    }
    /**
     * @return a RRule instance with the same freq and options
     *          as this one (cache is not cloned)
     */

  }, {
    key: "clone",
    value: function clone() {
      return new RRule(this.origOptions);
    }
  }, {
    key: "_iter",
    value: function _iter(iterResult) {
      var _RRule$YEARLY$RRule$M;

      /* Since JavaScript doesn't have the python's yield operator (<1.7),
          we use the IterResult object that tells us when to stop iterating.
       */
      var dtstart = this.options.dtstart;
      var dtstartMillisecondModulo = this.options.dtstart % 1000;
      var year = dtstart.getFullYear();
      var month = dtstart.getMonth() + 1;
      var day = dtstart.getDate();
      var hour = dtstart.getHours();
      var minute = dtstart.getMinutes();
      var second = dtstart.getSeconds();

      var weekday = _dateutil.default.getWeekday(dtstart); // Some local variables to speed things up a bit


      var freq = this.options.freq;
      var interval = this.options.interval;
      var wkst = this.options.wkst;
      var until = this.options.until;
      var bymonth = this.options.bymonth;
      var byweekno = this.options.byweekno;
      var byyearday = this.options.byyearday;
      var byweekday = this.options.byweekday;
      var byeaster = this.options.byeaster;
      var bymonthday = this.options.bymonthday;
      var bynmonthday = this.options.bynmonthday;
      var bysetpos = this.options.bysetpos;
      var byhour = this.options.byhour;
      var byminute = this.options.byminute;
      var bysecond = this.options.bysecond;
      var ii = new Iterinfo(this);
      ii.rebuild(year, month);
      var getdayset = (_RRule$YEARLY$RRule$M = {}, _defineProperty(_RRule$YEARLY$RRule$M, RRule.YEARLY, ii.ydayset), _defineProperty(_RRule$YEARLY$RRule$M, RRule.MONTHLY, ii.mdayset), _defineProperty(_RRule$YEARLY$RRule$M, RRule.WEEKLY, ii.wdayset), _defineProperty(_RRule$YEARLY$RRule$M, RRule.DAILY, ii.ddayset), _defineProperty(_RRule$YEARLY$RRule$M, RRule.HOURLY, ii.ddayset), _defineProperty(_RRule$YEARLY$RRule$M, RRule.MINUTELY, ii.ddayset), _defineProperty(_RRule$YEARLY$RRule$M, RRule.SECONDLY, ii.ddayset), _RRule$YEARLY$RRule$M)[freq];
      var timeset, gettimeset;

      if (freq < RRule.HOURLY) {
        timeset = this.timeset;
      } else {
        var _RRule$HOURLY$RRule$M;

        gettimeset = (_RRule$HOURLY$RRule$M = {}, _defineProperty(_RRule$HOURLY$RRule$M, RRule.HOURLY, ii.htimeset), _defineProperty(_RRule$HOURLY$RRule$M, RRule.MINUTELY, ii.mtimeset), _defineProperty(_RRule$HOURLY$RRule$M, RRule.SECONDLY, ii.stimeset), _RRule$HOURLY$RRule$M)[freq];

        if (freq >= RRule.HOURLY && (0, _helpers.plb)(byhour) && !(0, _helpers.contains)(byhour, hour) || freq >= RRule.MINUTELY && (0, _helpers.plb)(byminute) && !(0, _helpers.contains)(byminute, minute) || freq >= RRule.SECONDLY && (0, _helpers.plb)(bysecond) && !(0, _helpers.contains)(bysecond, second)) {
          timeset = [];
        } else {
          timeset = gettimeset.call(ii, hour, minute, second, dtstartMillisecondModulo);
        }
      }

      var total = 0;
      var count = this.options.count;
      var i, k, dm, div, mod, tmp, pos, dayset, start, end, fixday, filtered;

      while (true) {
        // Get dayset with the right frequency
        tmp = getdayset.call(ii, year, month, day);
        dayset = tmp[0];
        start = tmp[1];
        end = tmp[2]; // Do the "hard" work ;-)

        filtered = false;

        for (var j = start; j < end; j++) {
          i = dayset[j];
          filtered = (0, _helpers.plb)(bymonth) && !(0, _helpers.contains)(bymonth, ii.mmask[i]) || (0, _helpers.plb)(byweekno) && !ii.wnomask[i] || (0, _helpers.plb)(byweekday) && !(0, _helpers.contains)(byweekday, ii.wdaymask[i]) || (0, _helpers.plb)(ii.nwdaymask) && !ii.nwdaymask[i] || byeaster !== null && !(0, _helpers.contains)(ii.eastermask, i) || ((0, _helpers.plb)(bymonthday) || (0, _helpers.plb)(bynmonthday)) && !(0, _helpers.contains)(bymonthday, ii.mdaymask[i]) && !(0, _helpers.contains)(bynmonthday, ii.nmdaymask[i]) || (0, _helpers.plb)(byyearday) && (i < ii.yearlen && !(0, _helpers.contains)(byyearday, i + 1) && !(0, _helpers.contains)(byyearday, -ii.yearlen + i) || i >= ii.yearlen && !(0, _helpers.contains)(byyearday, i + 1 - ii.yearlen) && !(0, _helpers.contains)(byyearday, -ii.nextyearlen + i - ii.yearlen));
          if (filtered) dayset[i] = null;
        } // Output results


        if ((0, _helpers.plb)(bysetpos) && (0, _helpers.plb)(timeset)) {
          var daypos = void 0,
              timepos = void 0;
          var poslist = [];

          for (var _i5, _j = 0; _j < bysetpos.length; _j++) {
            pos = bysetpos[_j];

            if (pos < 0) {
              daypos = Math.floor(pos / timeset.length);
              timepos = (0, _helpers.pymod)(pos, timeset.length);
            } else {
              daypos = Math.floor((pos - 1) / timeset.length);
              timepos = (0, _helpers.pymod)(pos - 1, timeset.length);
            }

            try {
              tmp = [];

              for (k = start; k < end; k++) {
                var val = dayset[k];
                if (val === null) continue;
                tmp.push(val);
              }

              if (daypos < 0) {
                // we're trying to emulate python's aList[-n]
                _i5 = tmp.slice(daypos)[0];
              } else {
                _i5 = tmp[daypos];
              }

              var time = timeset[timepos];

              var date = _dateutil.default.fromOrdinal(ii.yearordinal + _i5);

              var res = _dateutil.default.combine(date, time); // XXX: can this ever be in the array?
              // - compare the actual date instead?


              if (!(0, _helpers.contains)(poslist, res)) poslist.push(res);
            } catch (e) {}
          }

          _dateutil.default.sort(poslist);

          for (var _j2 = 0; _j2 < poslist.length; _j2++) {
            var _res = poslist[_j2];

            if (until && _res > until) {
              this._len = total;
              return iterResult.getValue();
            } else if (_res >= dtstart) {
              ++total;
              if (!iterResult.accept(_res)) return iterResult.getValue();

              if (count) {
                --count;

                if (!count) {
                  this._len = total;
                  return iterResult.getValue();
                }
              }
            }
          }
        } else {
          for (var _j3 = start; _j3 < end; _j3++) {
            i = dayset[_j3];

            if (i !== null) {
              var _date = _dateutil.default.fromOrdinal(ii.yearordinal + i);

              for (k = 0; k < timeset.length; k++) {
                var _time = timeset[k];

                var _res2 = _dateutil.default.combine(_date, _time);

                if (until && _res2 > until) {
                  this._len = total;
                  return iterResult.getValue();
                } else if (_res2 >= dtstart) {
                  ++total;
                  if (!iterResult.accept(_res2)) return iterResult.getValue();

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
        } // Handle frequency and interval


        fixday = false;

        if (freq === RRule.YEARLY) {
          year += interval;

          if (year > _dateutil.default.MAXYEAR) {
            this._len = total;
            return iterResult.getValue();
          }

          ii.rebuild(year, month);
        } else if (freq === RRule.MONTHLY) {
          month += interval;

          if (month > 12) {
            div = Math.floor(month / 12);
            mod = (0, _helpers.pymod)(month, 12);
            month = mod;
            year += div;

            if (month === 0) {
              month = 12;
              --year;
            }

            if (year > _dateutil.default.MAXYEAR) {
              this._len = total;
              return iterResult.getValue();
            }
          }

          ii.rebuild(year, month);
        } else if (freq === RRule.WEEKLY) {
          if (wkst > weekday) {
            day += -(weekday + 1 + (6 - wkst)) + interval * 7;
          } else {
            day += -(weekday - wkst) + interval * 7;
          }

          weekday = wkst;
          fixday = true;
        } else if (freq === RRule.DAILY) {
          day += interval;
          fixday = true;
        } else if (freq === RRule.HOURLY) {
          if (filtered) {
            // Jump to one iteration before next day
            hour += Math.floor((23 - hour) / interval) * interval;
          }

          while (true) {
            hour += interval;
            dm = (0, _helpers.divmod)(hour, 24);
            div = dm.div;
            mod = dm.mod;

            if (div) {
              hour = mod;
              day += div;
              fixday = true;
            }

            if (!(0, _helpers.plb)(byhour) || (0, _helpers.contains)(byhour, hour)) break;
          }

          timeset = gettimeset.call(ii, hour, minute, second);
        } else if (freq === RRule.MINUTELY) {
          if (filtered) {
            // Jump to one iteration before next day
            minute += Math.floor((1439 - (hour * 60 + minute)) / interval) * interval;
          }

          while (true) {
            minute += interval;
            dm = (0, _helpers.divmod)(minute, 60);
            div = dm.div;
            mod = dm.mod;

            if (div) {
              minute = mod;
              hour += div;
              dm = (0, _helpers.divmod)(hour, 24);
              div = dm.div;
              mod = dm.mod;

              if (div) {
                hour = mod;
                day += div;
                fixday = true;
                filtered = false;
              }
            }

            if ((!(0, _helpers.plb)(byhour) || (0, _helpers.contains)(byhour, hour)) && (!(0, _helpers.plb)(byminute) || (0, _helpers.contains)(byminute, minute))) {
              break;
            }
          }

          timeset = gettimeset.call(ii, hour, minute, second);
        } else if (freq === RRule.SECONDLY) {
          if (filtered) {
            // Jump to one iteration before next day
            second += Math.floor((86399 - (hour * 3600 + minute * 60 + second)) / interval) * interval;
          }

          while (true) {
            second += interval;
            dm = (0, _helpers.divmod)(second, 60);
            div = dm.div;
            mod = dm.mod;

            if (div) {
              second = mod;
              minute += div;
              dm = (0, _helpers.divmod)(minute, 60);
              div = dm.div;
              mod = dm.mod;

              if (div) {
                minute = mod;
                hour += div;
                dm = (0, _helpers.divmod)(hour, 24);
                div = dm.div;
                mod = dm.mod;

                if (div) {
                  hour = mod;
                  day += div;
                  fixday = true;
                }
              }
            }

            if ((!(0, _helpers.plb)(byhour) || (0, _helpers.contains)(byhour, hour)) && (!(0, _helpers.plb)(byminute) || (0, _helpers.contains)(byminute, minute)) && (!(0, _helpers.plb)(bysecond) || (0, _helpers.contains)(bysecond, second))) {
              break;
            }
          }

          timeset = gettimeset.call(ii, hour, minute, second);
        }

        if (fixday && day > 28) {
          var daysinmonth = _dateutil.default.monthRange(year, month - 1)[1];

          if (day > daysinmonth) {
            while (day > daysinmonth) {
              day -= daysinmonth;
              ++month;

              if (month === 13) {
                month = 1;
                ++year;

                if (year > _dateutil.default.MAXYEAR) {
                  this._len = total;
                  return iterResult.getValue();
                }
              }

              daysinmonth = _dateutil.default.monthRange(year, month - 1)[1];
            }

            ii.rebuild(year, month);
          }
        }
      }
    }
  }], [{
    key: "parseText",
    value: function parseText(text, language) {
      return getnlp().parseText(text, language);
    }
  }, {
    key: "fromText",
    value: function fromText(text, language) {
      return getnlp().fromText(text, language);
    }
  }, {
    key: "parseString",
    value: function parseString(rfcString) {
      rfcString = rfcString.replace(/^\s+|\s+$/, '');
      if (!rfcString.length) return null;
      var key, value, attr;
      var attrs = rfcString.split(';');
      var options = {};

      for (var i = 0; i < attrs.length; i++) {
        attr = attrs[i].split('=');
        key = attr[0];
        value = attr[1];

        switch (key) {
          case 'FREQ':
            options.freq = RRule[value];
            break;

          case 'WKST':
            options.wkst = RRule[value];
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

              for (var j = 0; j < value.length; j++) {
                if (/^[+-]?\d+$/.test(value[j])) value[j] = Number(value[j]);
              }
            } else if (/^[+-]?\d+$/.test(value)) {
              value = Number(value);
            }

            key = key.toLowerCase();
            options[key] = value;
            break;

          case 'BYDAY':
            // => byweekday
            var n = void 0,
                wday = void 0,
                day = void 0;
            var days = value.split(',');
            options.byweekday = [];

            for (var _j4 = 0; _j4 < days.length; _j4++) {
              day = days[_j4];

              if (day.length === 2) {
                // MO, TU, ...
                wday = RRule[day]; // wday instanceof Weekday

                options.byweekday.push(wday);
              } else {
                // -1MO, +3FR, 1SO, ...
                day = day.match(/^([+-]?\d)([A-Z]{2})$/);
                n = Number(day[1]);
                wday = day[2];
                wday = RRule[wday].weekday;
                options.byweekday.push(new _weekday.default(wday, n));
              }
            }

            break;

          case 'DTSTART':
            options.dtstart = _dateutil.default.untilStringToDate(value);
            break;

          case 'UNTIL':
            options.until = _dateutil.default.untilStringToDate(value);
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
  }, {
    key: "fromString",
    value: function fromString(string) {
      return new RRule(RRule.parseString(string));
    }
  }, {
    key: "optionsToString",
    value: function optionsToString(options) {
      var key, value, strValues;
      var pairs = [];
      var keys = Object.keys(options);
      var defaultKeys = Object.keys(RRule.DEFAULT_OPTIONS);

      for (var i = 0; i < keys.length; i++) {
        if (!(0, _helpers.contains)(defaultKeys, keys[i])) continue;
        key = keys[i].toUpperCase();
        value = options[keys[i]];
        strValues = [];
        if (value === null || value instanceof Array && !value.length) continue;

        switch (key) {
          case 'FREQ':
            value = RRule.FREQUENCIES[options.freq];
            break;

          case 'WKST':
            if (!(value instanceof _weekday.default)) {
              value = new _weekday.default(value);
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
            if (!(value instanceof Array)) value = [value];

            for (var wday, j = 0; j < value.length; j++) {
              wday = value[j];

              if (wday instanceof _weekday.default) {// good
              } else if (wday instanceof Array) {
                wday = new _weekday.default(wday[0], wday[1]);
              } else {
                wday = new _weekday.default(wday);
              }

              strValues[j] = wday.toString();
            }

            value = strValues;
            break;

          case 'DTSTART':
          case 'UNTIL':
            value = _dateutil.default.timeToUntilString(value);
            break;

          default:
            if (value instanceof Array) {
              for (var _j5 = 0; _j5 < value.length; _j5++) {
                strValues[_j5] = String(value[_j5]);
              }

              value = strValues;
            } else {
              value = String(value);
            }

        }

        pairs.push([key, value]);
      }

      var strings = [];

      for (var _i6 = 0; _i6 < pairs.length; _i6++) {
        var attr = pairs[_i6];
        strings.push(attr[0] + '=' + attr[1].toString());
      }

      return strings.join(';');
    }
  }]);

  return RRule;
}(); // RRule class 'constants'


exports.default = RRule;
RRule.FREQUENCIES = ['YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY', 'HOURLY', 'MINUTELY', 'SECONDLY'];
RRule.YEARLY = 0;
RRule.MONTHLY = 1;
RRule.WEEKLY = 2;
RRule.DAILY = 3;
RRule.HOURLY = 4;
RRule.MINUTELY = 5;
RRule.SECONDLY = 6;
RRule.MO = new _weekday.default(0);
RRule.TU = new _weekday.default(1);
RRule.WE = new _weekday.default(2);
RRule.TH = new _weekday.default(3);
RRule.FR = new _weekday.default(4);
RRule.SA = new _weekday.default(5);
RRule.SU = new _weekday.default(6);
RRule.DEFAULT_OPTIONS = {
  freq: null,
  dtstart: null,
  interval: 1,
  wkst: RRule.MO,
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
  byeaster: null // =============================================================================
  // Iterinfo
  // =============================================================================

};

var Iterinfo =
/*#__PURE__*/
function () {
  function Iterinfo(rrule) {
    _classCallCheck(this, Iterinfo);

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

  _createClass(Iterinfo, [{
    key: "easter",
    value: function easter(y, offset) {
      offset = offset || 0;
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
      var day = (h + l - 7 * m + 114) % 31 + 1;
      var date = Date.UTC(y, month - 1, day + offset);
      var yearStart = Date.UTC(y, 0, 1);
      return [Math.ceil((date - yearStart) / (1000 * 60 * 60 * 24))];
    }
  }, {
    key: "rebuild",
    value: function rebuild(year, month) {
      var rr = this.rrule;

      if (year !== this.lastyear) {
        this.yearlen = _dateutil.default.isLeapYear(year) ? 366 : 365;
        this.nextyearlen = _dateutil.default.isLeapYear(year + 1) ? 366 : 365;
        var firstyday = new Date(year, 0, 1);
        this.yearordinal = _dateutil.default.toOrdinal(firstyday);
        this.yearweekday = _dateutil.default.getWeekday(firstyday);

        var wday = _dateutil.default.getWeekday(new Date(year, 0, 1));

        if (this.yearlen === 365) {
          this.mmask = [].concat(_masks.M365MASK);
          this.mdaymask = [].concat(_masks.MDAY365MASK);
          this.nmdaymask = [].concat(_masks.NMDAY365MASK);
          this.wdaymask = _masks.WDAYMASK.slice(wday);
          this.mrange = [].concat(_masks.M365RANGE);
        } else {
          this.mmask = [].concat(_masks.M366MASK);
          this.mdaymask = [].concat(_masks.MDAY366MASK);
          this.nmdaymask = [].concat(_masks.NMDAY366MASK);
          this.wdaymask = _masks.WDAYMASK.slice(wday);
          this.mrange = [].concat(_masks.M366RANGE);
        }

        if (!(0, _helpers.plb)(rr.options.byweekno)) {
          this.wnomask = null;
        } else {
          this.wnomask = (0, _helpers.repeat)(0, this.yearlen + 7);
          var no1wkst, firstwkst, wyearlen;
          no1wkst = firstwkst = (0, _helpers.pymod)(7 - this.yearweekday + rr.options.wkst, 7);

          if (no1wkst >= 4) {
            no1wkst = 0; // Number of days in the year, plus the days we got
            // from last year.

            wyearlen = this.yearlen + (0, _helpers.pymod)(this.yearweekday - rr.options.wkst, 7);
          } else {
            // Number of days in the year, minus the days we
            // left in last year.
            wyearlen = this.yearlen - no1wkst;
          }

          var div = Math.floor(wyearlen / 7);
          var mod = (0, _helpers.pymod)(wyearlen, 7);
          var numweeks = Math.floor(div + mod / 4);

          for (var n, i, j = 0; j < rr.options.byweekno.length; j++) {
            n = rr.options.byweekno[j];

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
            } else {
              i = no1wkst;
            }

            for (var k = 0; k < 7; k++) {
              this.wnomask[i] = 1;
              i++;
              if (this.wdaymask[i] === rr.options.wkst) break;
            }
          }

          if ((0, _helpers.contains)(rr.options.byweekno, 1)) {
            // Check week number 1 of next year as well
            // orig-TODO : Check -numweeks for next year.
            var _i7 = no1wkst + numweeks * 7;

            if (no1wkst !== firstwkst) _i7 -= 7 - firstwkst;

            if (_i7 < this.yearlen) {
              // If week starts in next year, we
              // don't care about it.
              for (var _j6 = 0; _j6 < 7; _j6++) {
                this.wnomask[_i7] = 1;
                _i7 += 1;
                if (this.wdaymask[_i7] === rr.options.wkst) break;
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
            var lnumweeks;

            if (!(0, _helpers.contains)(rr.options.byweekno, -1)) {
              var lyearweekday = _dateutil.default.getWeekday(new Date(year - 1, 0, 1));

              var lno1wkst = (0, _helpers.pymod)(7 - lyearweekday + rr.options.wkst, 7);
              var lyearlen = _dateutil.default.isLeapYear(year - 1) ? 366 : 365;

              if (lno1wkst >= 4) {
                lno1wkst = 0;
                lnumweeks = Math.floor(52 + (0, _helpers.pymod)(lyearlen + (0, _helpers.pymod)(lyearweekday - rr.options.wkst, 7), 7) / 4);
              } else {
                lnumweeks = Math.floor(52 + (0, _helpers.pymod)(this.yearlen - no1wkst, 7) / 4);
              }
            } else {
              lnumweeks = -1;
            }

            if ((0, _helpers.contains)(rr.options.byweekno, lnumweeks)) {
              for (var _i8 = 0; _i8 < no1wkst; _i8++) {
                this.wnomask[_i8] = 1;
              }
            }
          }
        }
      }

      if ((0, _helpers.plb)(rr.options.bynweekday) && (month !== this.lastmonth || year !== this.lastyear)) {
        var ranges = [];

        if (rr.options.freq === RRule.YEARLY) {
          if ((0, _helpers.plb)(rr.options.bymonth)) {
            for (var _j7 = 0; _j7 < rr.options.bymonth.length; _j7++) {
              month = rr.options.bymonth[_j7];
              ranges.push(this.mrange.slice(month - 1, month + 1));
            }
          } else {
            ranges = [[0, this.yearlen]];
          }
        } else if (rr.options.freq === RRule.MONTHLY) {
          ranges = [this.mrange.slice(month - 1, month + 1)];
        }

        if ((0, _helpers.plb)(ranges)) {
          // Weekly frequency won't get here, so we may not
          // care about cross-year weekly periods.
          this.nwdaymask = (0, _helpers.repeat)(0, this.yearlen);

          for (var _j8 = 0; _j8 < ranges.length; _j8++) {
            var rang = ranges[_j8];
            var first = rang[0];
            var last = rang[1];
            last -= 1;

            for (var _k = 0; _k < rr.options.bynweekday.length; _k++) {
              var _i9 = void 0;

              var _wday = rr.options.bynweekday[_k][0];
              var _n = rr.options.bynweekday[_k][1];

              if (_n < 0) {
                _i9 = last + (_n + 1) * 7;
                _i9 -= (0, _helpers.pymod)(this.wdaymask[_i9] - _wday, 7);
              } else {
                _i9 = first + (_n - 1) * 7;
                _i9 += (0, _helpers.pymod)(7 - this.wdaymask[_i9] + _wday, 7);
              }

              if (first <= _i9 && _i9 <= last) this.nwdaymask[_i9] = 1;
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
  }, {
    key: "ydayset",
    value: function ydayset(year, month, day) {
      return [(0, _helpers.range)(this.yearlen), 0, this.yearlen];
    }
  }, {
    key: "mdayset",
    value: function mdayset(year, month, day) {
      var set = (0, _helpers.repeat)(null, this.yearlen);
      var start = this.mrange[month - 1];
      var end = this.mrange[month];

      for (var i = start; i < end; i++) {
        set[i] = i;
      }

      return [set, start, end];
    }
  }, {
    key: "wdayset",
    value: function wdayset(year, month, day) {
      // We need to handle cross-year weeks here.
      var set = (0, _helpers.repeat)(null, this.yearlen + 7);
      var i = _dateutil.default.toOrdinal(new Date(year, month - 1, day)) - this.yearordinal;
      var start = i;

      for (var j = 0; j < 7; j++) {
        set[i] = i;
        ++i;
        if (this.wdaymask[i] === this.rrule.options.wkst) break;
      }

      return [set, start, i];
    }
  }, {
    key: "ddayset",
    value: function ddayset(year, month, day) {
      var set = (0, _helpers.repeat)(null, this.yearlen);
      var i = _dateutil.default.toOrdinal(new Date(year, month - 1, day)) - this.yearordinal;
      set[i] = i;
      return [set, i, i + 1];
    }
  }, {
    key: "htimeset",
    value: function htimeset(hour, minute, second, millisecond) {
      var set = [];
      var rr = this.rrule;

      for (var i = 0; i < rr.options.byminute.length; i++) {
        minute = rr.options.byminute[i];

        for (var j = 0; j < rr.options.bysecond.length; j++) {
          second = rr.options.bysecond[j];
          set.push(new _dateutil.default.Time(hour, minute, second, millisecond));
        }
      }

      _dateutil.default.sort(set);

      return set;
    }
  }, {
    key: "mtimeset",
    value: function mtimeset(hour, minute, second, millisecond) {
      var set = [];
      var rr = this.rrule;

      for (var j = 0; j < rr.options.bysecond.length; j++) {
        second = rr.options.bysecond[j];
        set.push(new _dateutil.default.Time(hour, minute, second, millisecond));
      }

      _dateutil.default.sort(set);

      return set;
    }
  }, {
    key: "stimeset",
    value: function stimeset(hour, minute, second, millisecond) {
      return [new _dateutil.default.Time(hour, minute, second, millisecond)];
    }
  }]);

  return Iterinfo;
}();

function getnlp() {
  // Lazy, runtime import to avoid circular refs.
  if (!getnlp._nlp) {
    getnlp._nlp = __webpack_require__(10);
  }

  return getnlp._nlp;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * General date-related utilities.
 * Also handles several incompatibilities between JavaScript and Python
 *
 */
var dateutil = {
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
  getYearDay: function getYearDay(date) {
    var dateNoTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return Math.ceil((dateNoTime - new Date(date.getFullYear(), 0, 1)) / dateutil.ONE_DAY) + 1;
  },
  isLeapYear: function isLeapYear(year) {
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
  },

  /**
   * @return {Number} the date's timezone offset in ms
   */
  tzOffset: function tzOffset(date) {
    return date.getTimezoneOffset() * 60 * 1000;
  },

  /**
   * @see: <http://www.mcfedries.com/JavaScript/DaysBetween.asp>
   */
  daysBetween: function daysBetween(date1, date2) {
    // The number of milliseconds in one day
    // Convert both dates to milliseconds
    var date1ms = date1.getTime() - dateutil.tzOffset(date1);
    var date2ms = date2.getTime() - dateutil.tzOffset(date2); // Calculate the difference in milliseconds

    var differencems = date1ms - date2ms; // Convert back to days and return

    return Math.round(differencems / dateutil.ONE_DAY);
  },

  /**
   * @see: <http://docs.python.org/library/datetime.html#datetime.date.toordinal>
   */
  toOrdinal: function toOrdinal(date) {
    return dateutil.daysBetween(date, dateutil.ORDINAL_BASE);
  },

  /**
   * @see - <http://docs.python.org/library/datetime.html#datetime.date.fromordinal>
   */
  fromOrdinal: function fromOrdinal(ordinal) {
    var millisecsFromBase = ordinal * dateutil.ONE_DAY;
    return new Date(dateutil.ORDINAL_BASE.getTime() - dateutil.tzOffset(dateutil.ORDINAL_BASE) + millisecsFromBase + dateutil.tzOffset(new Date(millisecsFromBase)));
  },

  /**
   * @see: <http://docs.python.org/library/calendar.html#calendar.monthrange>
   */
  monthRange: function monthRange(year, month) {
    var date = new Date(year, month, 1);
    return [dateutil.getWeekday(date), dateutil.getMonthDays(date)];
  },
  getMonthDays: function getMonthDays(date) {
    var month = date.getMonth();
    return month === 1 && dateutil.isLeapYear(date.getFullYear()) ? 29 : dateutil.MONTH_DAYS[month];
  },

  /**
   * @return {Number} python-like weekday
   */
  getWeekday: function getWeekday(date) {
    return dateutil.PY_WEEKDAYS[date.getDay()];
  },

  /**
   * @see: <http://docs.python.org/library/datetime.html#datetime.datetime.combine>
   */
  combine: function combine(date, time) {
    time = time || date;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
  },
  clone: function clone(date) {
    var dolly = new Date(date.getTime());
    return dolly;
  },
  cloneDates: function cloneDates(dates) {
    var clones = [];

    for (var i = 0; i < dates.length; i++) {
      clones.push(dateutil.clone(dates[i]));
    }

    return clones;
  },

  /**
   * Sorts an array of Date or dateutil.Time objects
   */
  sort: function sort(dates) {
    dates.sort(function (a, b) {
      return a.getTime() - b.getTime();
    });
  },
  timeToUntilString: function timeToUntilString(time) {
    var comp;
    var date = new Date(time);
    var comps = [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), 'T', date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), 'Z'];

    for (var i = 0; i < comps.length; i++) {
      comp = comps[i];
      if (!/[TZ]/.test(comp) && comp < 10) comps[i] = '0' + String(comp);
    }

    return comps.join('');
  },
  untilStringToDate: function untilStringToDate(until) {
    var re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/;
    var bits = re.exec(until);
    if (!bits) throw new Error('Invalid UNTIL value: ' + until);
    return new Date(Date.UTC(bits[1], bits[2] - 1, bits[3], bits[5] || 0, bits[6] || 0, bits[7] || 0));
  }
};

var Time =
/*#__PURE__*/
function () {
  function Time(hour, minute, second, millisecond) {
    _classCallCheck(this, Time);

    this.hour = hour;
    this.minute = minute;
    this.second = second;
    this.millisecond = millisecond || 0;
  }

  _createClass(Time, [{
    key: "getHours",
    value: function getHours() {
      return this.hour;
    }
  }, {
    key: "getMinutes",
    value: function getMinutes() {
      return this.minute;
    }
  }, {
    key: "getSeconds",
    value: function getSeconds() {
      return this.second;
    }
  }, {
    key: "getMilliseconds",
    value: function getMilliseconds() {
      return this.millisecond;
    }
  }, {
    key: "getTime",
    value: function getTime() {
      return (this.hour * 60 * 60 + this.minute * 60 + this.second) * 1000 + this.millisecond;
    }
  }]);

  return Time;
}();

dateutil.Time = Time;
var _default = dateutil;
exports.default = _default;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WDAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']; // =============================================================================
// Weekday
// =============================================================================

var Weekday =
/*#__PURE__*/
function () {
  function Weekday(weekday, n) {
    _classCallCheck(this, Weekday);

    if (n === 0) throw new Error("Can't create weekday with n == 0");
    this.weekday = weekday;
    this.n = n;
  } // __call__ - Cannot call the object directly, do it through
  // e.g. RRule.TH.nth(-1) instead,


  _createClass(Weekday, [{
    key: "nth",
    value: function nth(n) {
      return this.n === n ? this : new Weekday(this.weekday, n);
    } // __eq__

  }, {
    key: "equals",
    value: function equals(other) {
      return this.weekday === other.weekday && this.n === other.n;
    } // __repr__

  }, {
    key: "toString",
    value: function toString() {
      var s = WDAYS[this.weekday];
      if (this.n) s = (this.n > 0 ? '+' : '') + String(this.n) + s;
      return s;
    }
  }, {
    key: "getJsWeekday",
    value: function getJsWeekday() {
      return this.weekday === 6 ? 0 : this.weekday + 1;
    }
  }]);

  return Weekday;
}();

exports.default = Weekday;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// =============================================================================
// Results
// =============================================================================

/**
 * This class helps us to emulate python's generators, sorta.
 */
var IterResult =
/*#__PURE__*/
function () {
  function IterResult(method, args) {
    _classCallCheck(this, IterResult);

    this.method = method;
    this.args = args;
    this.minDate = null;
    this.maxDate = null;
    this._result = [];

    if (method === 'between') {
      this.maxDate = args.inc ? args.before : new Date(args.before.getTime() - 1);
      this.minDate = args.inc ? args.after : new Date(args.after.getTime() + 1);
    } else if (method === 'before') {
      this.maxDate = args.inc ? args.dt : new Date(args.dt.getTime() - 1);
    } else if (method === 'after') {
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


  _createClass(IterResult, [{
    key: "accept",
    value: function accept(date) {
      var tooEarly = this.minDate && date < this.minDate;
      var tooLate = this.maxDate && date > this.maxDate;

      if (this.method === 'between') {
        if (tooEarly) return true;
        if (tooLate) return false;
      } else if (this.method === 'before') {
        if (tooLate) return false;
      } else if (this.method === 'after') {
        if (tooEarly) return true;
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

  }, {
    key: "add",
    value: function add(date) {
      this._result.push(date);

      return true;
    }
    /**
     * 'before' and 'after' return only one date, whereas 'all'
     * and 'between' an array.
     * @return {Date,Array?}
     */

  }, {
    key: "getValue",
    value: function getValue() {
      var res = this._result;

      switch (this.method) {
        case 'all':
        case 'between':
          return res;

        case 'before':
        case 'after':
          return res.length ? res[res.length - 1] : null;
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      return new IterResult(this.method, this.args);
    }
  }]);

  return IterResult;
}();

exports.default = IterResult;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// =============================================================================
// i18n
// =============================================================================
var ENGLISH = {
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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
var _default = ENGLISH;
exports.default = _default;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rrule2 = _interopRequireDefault(__webpack_require__(2));

var _dateutil = _interopRequireDefault(__webpack_require__(3));

var _helpers = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 *
 * @param {Boolean?} noCache
 *  The same stratagy as RRule on cache, default to false
 * @constructor
 */
var RRuleSet =
/*#__PURE__*/
function () {
  function RRuleSet(noCache) {
    _classCallCheck(this, RRuleSet);

    // Let RRuleSet cacheable
    this._cache = noCache ? null : {
      all: false,
      before: [],
      after: [],
      between: []
    };
    this._rrule = [];
    this._rdate = [];
    this._exrule = [];
    this._exdate = [];
  }
  /**
  * @param {RRule}
  */


  _createClass(RRuleSet, [{
    key: "rrule",
    value: function rrule(_rrule) {
      if (!(_rrule instanceof _rrule2.default)) {
        throw new TypeError(String(_rrule) + ' is not RRule instance');
      }

      if (!(0, _helpers.contains)(this._rrule.map(String), String(_rrule))) {
        this._rrule.push(_rrule);
      }
    }
    /**
    * @param {Date}
    */

  }, {
    key: "rdate",
    value: function rdate(date) {
      if (!(date instanceof Date)) {
        throw new TypeError(String(date) + ' is not Date instance');
      }

      if (!(0, _helpers.contains)(this._rdate.map(Number), Number(date))) {
        this._rdate.push(date);

        _dateutil.default.sort(this._rdate);
      }
    }
    /**
    * @param {RRule}
    */

  }, {
    key: "exrule",
    value: function exrule(rrule) {
      if (!(rrule instanceof _rrule2.default)) {
        throw new TypeError(String(rrule) + ' is not RRule instance');
      }

      if (!(0, _helpers.contains)(this._exrule.map(String), String(rrule))) {
        this._exrule.push(rrule);
      }
    }
    /**
    * @param {Date}
    */

  }, {
    key: "exdate",
    value: function exdate(date) {
      if (!(date instanceof Date)) {
        throw new TypeError(String(date) + ' is not Date instance');
      }

      if (!(0, _helpers.contains)(this._exdate.map(Number), Number(date))) {
        this._exdate.push(date);

        _dateutil.default.sort(this._exdate);
      }
    }
  }, {
    key: "valueOf",
    value: function valueOf() {
      var result = [];

      if (this._rrule.length) {
        this._rrule.forEach(function (rrule) {
          result.push('RRULE:' + rrule);
        });
      }

      if (this._rdate.length) {
        result.push('RDATE:' + this._rdate.map(function (rdate) {
          return _dateutil.default.timeToUntilString(rdate);
        }).join(','));
      }

      if (this._exrule.length) {
        this._exrule.forEach(function (exrule) {
          result.push('EXRULE:' + exrule);
        });
      }

      if (this._exdate.length) {
        result.push('EXDATE:' + this._exdate.map(function (exdate) {
          return _dateutil.default.timeToUntilString(exdate);
        }).join(','));
      }

      return result;
    }
    /**
    * to generate recurrence field sush as:
    *   ["RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU;DTSTART=19970902T010000Z","RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH;DTSTART=19970902T010000Z"]
    */

  }, {
    key: "toString",
    value: function toString() {
      return JSON.stringify(this.valueOf());
    }
  }, {
    key: "_iter",
    value: function _iter(iterResult) {
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
        if (!iterResult.accept(new Date(this._rdate[i]))) break;
      }

      this._rrule.forEach(function (rrule) {
        rrule._iter(iterResult);
      });

      var res = iterResult._result;

      _dateutil.default.sort(res);

      switch (iterResult.method) {
        case 'all':
        case 'between':
          return res;

        case 'before':
          return res.length && res[res.length - 1] || null;

        case 'after':
          return res.length && res[0] || null;

        default:
          return null;
      }
    }
    /**
    * Create a new RRuleSet Object completely base on current instance
    */

  }, {
    key: "clone",
    value: function clone() {
      var rrs = new RRuleSet(!!this._cache);
      var i;

      for (i = 0; i < this._rrule.length; i++) {
        rrs.rrule(this._rrule[i].clone());
      }

      for (i = 0; i < this._rdate.length; i++) {
        rrs.rdate(new Date(this._rdate[i]));
      }

      for (i = 0; i < this._exrule.length; i++) {
        rrs.exrule(this._exrule[i].clone());
      }

      for (i = 0; i < this._exdate.length; i++) {
        rrs.exdate(new Date(this._exdate[i]));
      }

      return rrs;
    }
  }]);

  return RRuleSet;
}();
/**
 * Inherts method from RRule
 *  add Read interface and set RRuleSet cacheable
 */


var RRuleSetMethods = ['all', 'between', 'before', 'after', 'count', '_cacheAdd', '_cacheGet'];
RRuleSetMethods.forEach(function (method) {
  RRuleSet.prototype[method] = _rrule2.default.prototype[method];
});
var _default = RRuleSet;
exports.default = _default;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NMDAY366MASK = exports.NMDAY365MASK = exports.MDAY366MASK = exports.MDAY365MASK = exports.M366RANGE = exports.M366MASK = exports.M365RANGE = exports.M365MASK = exports.WDAYMASK = void 0;

var _require = __webpack_require__(0),
    range = _require.range,
    repeat = _require.repeat; // =============================================================================
// Date masks
// =============================================================================
// Every mask is 7 days longer to handle cross-year weekly periods.


var M365MASK = [].concat(repeat(1, 31), repeat(2, 28), repeat(3, 31), repeat(4, 30), repeat(5, 31), repeat(6, 30), repeat(7, 31), repeat(8, 31), repeat(9, 30), repeat(10, 31), repeat(11, 30), repeat(12, 31), repeat(1, 7));
exports.M365MASK = M365MASK;
var M366MASK = [].concat(repeat(1, 31), repeat(2, 29), repeat(3, 31), repeat(4, 30), repeat(5, 31), repeat(6, 30), repeat(7, 31), repeat(8, 31), repeat(9, 30), repeat(10, 31), repeat(11, 30), repeat(12, 31), repeat(1, 7));
exports.M366MASK = M366MASK;
var M28 = range(1, 29);
var M29 = range(1, 30);
var M30 = range(1, 31);
var M31 = range(1, 32);
var MDAY366MASK = [].concat(M31, M29, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
exports.MDAY366MASK = MDAY366MASK;
var MDAY365MASK = [].concat(M31, M28, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
exports.MDAY365MASK = MDAY365MASK;
M28 = range(-28, 0);
M29 = range(-29, 0);
M30 = range(-30, 0);
M31 = range(-31, 0);
var NMDAY366MASK = [].concat(M31, M29, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
exports.NMDAY366MASK = NMDAY366MASK;
var NMDAY365MASK = [].concat(M31, M28, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
exports.NMDAY365MASK = NMDAY365MASK;
var M366RANGE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
exports.M366RANGE = M366RANGE;
var M365RANGE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
exports.M365RANGE = M365RANGE;

var WDAYMASK = function () {
  var wdaymask = [];

  for (var i = 0; i < 55; i++) {
    wdaymask = wdaymask.concat(range(7));
  }

  return wdaymask;
}();

exports.WDAYMASK = WDAYMASK;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _iterresult = _interopRequireDefault(__webpack_require__(5));

var _helpers = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
var CallbackIterResult =
/*#__PURE__*/
function (_IterResult) {
  _inherits(CallbackIterResult, _IterResult);

  function CallbackIterResult(method, args, iterator) {
    var _this;

    _classCallCheck(this, CallbackIterResult);

    var allowedMethods = ['all', 'between'];

    if (!(0, _helpers.contains)(allowedMethods, method)) {
      throw new Error('Invalid method "' + method + '". Only all and between works with iterator.');
    }

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CallbackIterResult).call(this, method, args));
    _this.iterator = iterator;
    return _this;
  }

  _createClass(CallbackIterResult, [{
    key: "add",
    value: function add(date) {
      if (this.iterator(date, this._result.length)) {
        this._result.push(date);

        return true;
      }

      return false;
    }
  }]);

  return CallbackIterResult;
}(_iterresult.default);

exports.default = CallbackIterResult;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "parseText", {
  enumerable: true,
  get: function get() {
    return _parsetext.default;
  }
});
exports.toText = exports.isFullyConvertible = exports.fromText = void 0;

var _totext = _interopRequireDefault(__webpack_require__(11));

var _parsetext = _interopRequireDefault(__webpack_require__(12));

var _index = _interopRequireDefault(__webpack_require__(1));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var fromText = function fromText(text, language) {
  return new _index.default((0, _parsetext.default)(text, language));
};

exports.fromText = fromText;
var common = ['count', 'until', 'interval', 'byweekday', 'bymonthday', 'bymonth'];
_totext.default.IMPLEMENTED = [];
_totext.default.IMPLEMENTED[_index.default.HOURLY] = common;
_totext.default.IMPLEMENTED[_index.default.MINUTELY] = common;
_totext.default.IMPLEMENTED[_index.default.DAILY] = ['byhour'].concat(common);
_totext.default.IMPLEMENTED[_index.default.WEEKLY] = common;
_totext.default.IMPLEMENTED[_index.default.MONTHLY] = common;
_totext.default.IMPLEMENTED[_index.default.YEARLY] = ['byweekno', 'byyearday'].concat(common); // =============================================================================
// Export
// =============================================================================

var toText = function toText(rrule, gettext, language) {
  return new _totext.default(rrule, gettext, language).toString();
};

exports.toText = toText;
var isFullyConvertible = _totext.default.isFullyConvertible;
exports.isFullyConvertible = isFullyConvertible;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = _interopRequireDefault(__webpack_require__(6));

var _index = _interopRequireDefault(__webpack_require__(1));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// =============================================================================
// Helper functions
// =============================================================================

/**
 * Return true if a value is in an array
 */
var contains = function contains(arr, val) {
  return arr.indexOf(val) !== -1;
}; // =============================================================================
// ToText
// =============================================================================

/**
 *
 * @param {RRule} rrule
 * Optional:
 * @param {Function} gettext function
 * @param {Object} language definition
 * @constructor
 */


var ToText =
/*#__PURE__*/
function () {
  function ToText(rrule, gettext, language) {
    _classCallCheck(this, ToText);

    this.text = '';
    this.language = language || _i18n.default;

    this.gettext = gettext || function (id) {
      return id;
    };

    this.rrule = rrule;
    this.freq = rrule.options.freq;
    this.options = rrule.options;
    this.origOptions = rrule.origOptions;

    if (this.origOptions.bymonthday) {
      var bymonthday = [].concat(this.options.bymonthday);
      var bynmonthday = [].concat(this.options.bynmonthday);
      bymonthday.sort();
      bynmonthday.sort();
      bynmonthday.reverse(); // 1, 2, 3, .., -5, -4, -3, ..

      this.bymonthday = bymonthday.concat(bynmonthday);
      if (!this.bymonthday.length) this.bymonthday = null;
    }

    if (this.origOptions.byweekday) {
      var byweekday = !(this.origOptions.byweekday instanceof Array) ? [this.origOptions.byweekday] : this.origOptions.byweekday;
      var days = String(byweekday);
      this.byweekday = {
        allWeeks: byweekday.filter(function (weekday) {
          return !weekday.n;
        }),
        someWeeks: byweekday.filter(function (weekday) {
          return Boolean(weekday.n);
        }),
        isWeekdays: days.indexOf('MO') !== -1 && days.indexOf('TU') !== -1 && days.indexOf('WE') !== -1 && days.indexOf('TH') !== -1 && days.indexOf('FR') !== -1 && days.indexOf('SA') === -1 && days.indexOf('SU') === -1
      };

      var sortWeekDays = function sortWeekDays(a, b) {
        return a.weekday - b.weekday;
      };

      this.byweekday.allWeeks.sort(sortWeekDays);
      this.byweekday.someWeeks.sort(sortWeekDays);
      if (!this.byweekday.allWeeks.length) this.byweekday.allWeeks = null;
      if (!this.byweekday.someWeeks.length) this.byweekday.someWeeks = null;
    } else {
      this.byweekday = null;
    }
  }
  /**
   * Test whether the rrule can be fully converted to text.
   * @param {RRule} rrule
   * @return {Boolean}
   */


  _createClass(ToText, [{
    key: "isFullyConvertible",
    value: function isFullyConvertible() {
      return ToText.isFullyConvertible(this.rrule);
    }
    /**
     * Perform the conversion. Only some of the frequencies are supported.
     * If some of the rrule's options aren't supported, they'll
     * be omitted from the output an "(~ approximate)" will be appended.
     * @return {*}
     */

  }, {
    key: "toString",
    value: function toString() {
      var gettext = this.gettext;

      if (!(this.options.freq in ToText.IMPLEMENTED)) {
        return gettext('RRule error: Unable to fully convert this rrule to text');
      }

      this.text = [gettext('every')];

      this[_index.default.FREQUENCIES[this.options.freq]]();

      if (this.options.until) {
        this.add(gettext('until'));
        var until = this.options.until;
        this.add(this.language.monthNames[until.getMonth()]).add(until.getDate() + ',').add(until.getFullYear());
      } else if (this.options.count) {
        this.add(gettext('for')).add(this.options.count).add(this.plural(this.options.count) ? gettext('times') : gettext('time'));
      }

      if (!this.isFullyConvertible()) this.add(gettext('(~ approximate)'));
      return this.text.join('');
    }
  }, {
    key: "HOURLY",
    value: function HOURLY() {
      var gettext = this.gettext;
      if (this.options.interval !== 1) this.add(this.options.interval);
      this.add(this.plural(this.options.interval) ? gettext('hours') : gettext('hour'));
    }
  }, {
    key: "MINUTELY",
    value: function MINUTELY() {
      var gettext = this.gettext;
      if (this.options.interval !== 1) this.add(this.options.interval);
      this.add(this.plural(this.options.interval) ? gettext('minutes') : gettext('minutes'));
    }
  }, {
    key: "DAILY",
    value: function DAILY() {
      var gettext = this.gettext;
      if (this.options.interval !== 1) this.add(this.options.interval);

      if (this.byweekday && this.byweekday.isWeekdays) {
        this.add(this.plural(this.options.interval) ? gettext('weekdays') : gettext('weekday'));
      } else {
        this.add(this.plural(this.options.interval) ? gettext('days') : gettext('day'));
      }

      if (this.origOptions.bymonth) {
        this.add(gettext('in'));

        this._bymonth();
      }

      if (this.bymonthday) {
        this._bymonthday();
      } else if (this.byweekday) {
        this._byweekday();
      } else if (this.origOptions.byhour) {
        this._byhour();
      }
    }
  }, {
    key: "WEEKLY",
    value: function WEEKLY() {
      var gettext = this.gettext;

      if (this.options.interval !== 1) {
        this.add(this.options.interval).add(this.plural(this.options.interval) ? gettext('weeks') : gettext('week'));
      }

      if (this.byweekday && this.byweekday.isWeekdays) {
        if (this.options.interval === 1) {
          this.add(this.plural(this.options.interval) ? gettext('weekdays') : gettext('weekday'));
        } else {
          this.add(gettext('on')).add(gettext('weekdays'));
        }
      } else {
        if (this.options.interval === 1) this.add(gettext('week'));

        if (this.origOptions.bymonth) {
          this.add(gettext('in'));

          this._bymonth();
        }

        if (this.bymonthday) {
          this._bymonthday();
        } else if (this.byweekday) {
          this._byweekday();
        }
      }
    }
  }, {
    key: "MONTHLY",
    value: function MONTHLY() {
      var gettext = this.gettext;

      if (this.origOptions.bymonth) {
        if (this.options.interval !== 1) {
          this.add(this.options.interval).add(gettext('months'));
          if (this.plural(this.options.interval)) this.add(gettext('in'));
        } else {// this.add(gettext('MONTH'))
        }

        this._bymonth();
      } else {
        if (this.options.interval !== 1) this.add(this.options.interval);
        this.add(this.plural(this.options.interval) ? gettext('months') : gettext('month'));
      }

      if (this.bymonthday) {
        this._bymonthday();
      } else if (this.byweekday && this.byweekday.isWeekdays) {
        this.add(gettext('on')).add(gettext('weekdays'));
      } else if (this.byweekday) {
        this._byweekday();
      }
    }
  }, {
    key: "YEARLY",
    value: function YEARLY() {
      var gettext = this.gettext;

      if (this.origOptions.bymonth) {
        if (this.options.interval !== 1) {
          this.add(this.options.interval);
          this.add(gettext('years'));
        } else {// this.add(gettext('YEAR'))
        }

        this._bymonth();
      } else {
        if (this.options.interval !== 1) this.add(this.options.interval);
        this.add(this.plural(this.options.interval) ? gettext('years') : gettext('year'));
      }

      if (this.bymonthday) {
        this._bymonthday();
      } else if (this.byweekday) {
        this._byweekday();
      }

      if (this.options.byyearday) {
        this.add(gettext('on the')).add(this.list(this.options.byyearday, this.nth, gettext('and'))).add(gettext('day'));
      }

      if (this.options.byweekno) {
        this.add(gettext('in')).add(this.plural(this.options.byweekno.length) ? gettext('weeks') : gettext('week')).add(this.list(this.options.byweekno, null, gettext('and')));
      }
    }
  }, {
    key: "_bymonthday",
    value: function _bymonthday() {
      var gettext = this.gettext;

      if (this.byweekday && this.byweekday.allWeeks) {
        this.add(gettext('on')).add(this.list(this.byweekday.allWeeks, this.weekdaytext, gettext('or'))).add(gettext('the')).add(this.list(this.bymonthday, this.nth, gettext('or')));
      } else {
        this.add(gettext('on the')).add(this.list(this.bymonthday, this.nth, gettext('and')));
      } // this.add(gettext('DAY'))

    }
  }, {
    key: "_byweekday",
    value: function _byweekday() {
      var gettext = this.gettext;

      if (this.byweekday.allWeeks && !this.byweekday.isWeekdays) {
        this.add(gettext('on')).add(this.list(this.byweekday.allWeeks, this.weekdaytext));
      }

      if (this.byweekday.someWeeks) {
        if (this.byweekday.allWeeks) this.add(gettext('and'));
        this.add(gettext('on the')).add(this.list(this.byweekday.someWeeks, this.weekdaytext, gettext('and')));
      }
    }
  }, {
    key: "_byhour",
    value: function _byhour() {
      var gettext = this.gettext;
      this.add(gettext('at')).add(this.list(this.origOptions.byhour, null, gettext('and')));
    }
  }, {
    key: "_bymonth",
    value: function _bymonth() {
      this.add(this.list(this.options.bymonth, this.monthtext, this.gettext('and')));
    }
  }, {
    key: "nth",
    value: function nth(n) {
      var nth, npos;
      var gettext = this.gettext;
      if (n === -1) return gettext('last');
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
  }, {
    key: "monthtext",
    value: function monthtext(m) {
      return this.language.monthNames[m - 1];
    }
  }, {
    key: "weekdaytext",
    value: function weekdaytext(wday) {
      var weekday = typeof wday === 'number' ? (wday + 1) % 7 : wday.getJsWeekday();
      return (wday.n ? this.nth(wday.n) + ' ' : '') + this.language.dayNames[weekday];
    }
  }, {
    key: "plural",
    value: function plural(n) {
      return n % 100 !== 1;
    }
  }, {
    key: "add",
    value: function add(s) {
      this.text.push(' ');
      this.text.push(s);
      return this;
    }
  }, {
    key: "list",
    value: function list(arr, callback, finalDelim, delim) {
      if (!(arr instanceof Array)) {
        arr = [arr];
      }

      var delimJoin = function delimJoin(array, delimiter, finalDelimiter) {
        var list = '';

        for (var i = 0; i < array.length; i++) {
          if (i !== 0) {
            if (i === array.length - 1) {
              list += ' ' + finalDelimiter + ' ';
            } else {
              list += delimiter + ' ';
            }
          }

          list += array[i];
        }

        return list;
      };

      delim = delim || ',';

      callback = callback || function (o) {
        return o;
      };

      var self = this;

      var realCallback = function realCallback(arg) {
        return callback.call(self, arg);
      };

      if (finalDelim) {
        return delimJoin(arr.map(realCallback), delim, finalDelim);
      } else {
        return arr.map(realCallback).join(delim + ' ');
      }
    }
  }], [{
    key: "isFullyConvertible",
    value: function isFullyConvertible(rrule) {
      var canConvert = true;
      if (!(rrule.options.freq in ToText.IMPLEMENTED)) return false;
      if (rrule.origOptions.until && rrule.origOptions.count) return false;

      for (var key in rrule.origOptions) {
        if (contains(['dtstart', 'wkst', 'freq'], key)) return true;
        if (!contains(ToText.IMPLEMENTED[rrule.options.freq], key)) return false;
      }

      return canConvert;
    }
  }]);

  return ToText;
}();

exports.default = ToText;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = _interopRequireDefault(__webpack_require__(6));

var _index = _interopRequireDefault(__webpack_require__(1));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var parseText = function parseText(text, language) {
  var options = {};
  var ttr = new Parser((language || _i18n.default).tokens);
  if (!ttr.start(text)) return null;
  S();
  return options;

  function S() {
    // every [n]
    var n;
    ttr.expect('every');
    if (n = ttr.accept('number')) options.interval = parseInt(n[0], 10);
    if (ttr.isDone()) throw new Error('Unexpected end');

    switch (ttr.symbol) {
      case 'day(s)':
        options.freq = _index.default.DAILY;

        if (ttr.nextSymbol()) {
          AT();
          F();
        }

        break;
      // FIXME Note: every 2 weekdays != every two weeks on weekdays.
      // DAILY on weekdays is not a valid rule

      case 'weekday(s)':
        options.freq = _index.default.WEEKLY;
        options.byweekday = [_index.default.MO, _index.default.TU, _index.default.WE, _index.default.TH, _index.default.FR];
        ttr.nextSymbol();
        F();
        break;

      case 'week(s)':
        options.freq = _index.default.WEEKLY;

        if (ttr.nextSymbol()) {
          ON();
          F();
        }

        break;

      case 'hour(s)':
        options.freq = _index.default.HOURLY;

        if (ttr.nextSymbol()) {
          ON();
          F();
        }

        break;

      case 'minute(s)':
        options.freq = _index.default.MINUTELY;

        if (ttr.nextSymbol()) {
          ON();
          F();
        }

        break;

      case 'month(s)':
        options.freq = _index.default.MONTHLY;

        if (ttr.nextSymbol()) {
          ON();
          F();
        }

        break;

      case 'year(s)':
        options.freq = _index.default.YEARLY;

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
        options.freq = _index.default.WEEKLY;
        options.byweekday = [_index.default[ttr.symbol.substr(0, 2).toUpperCase()]];
        if (!ttr.nextSymbol()) return; // TODO check for duplicates

        while (ttr.accept('comma')) {
          if (ttr.isDone()) throw new Error('Unexpected end');
          var wkd = void 0;

          if (!(wkd = decodeWKD())) {
            throw new Error('Unexpected symbol ' + ttr.symbol + ', expected weekday');
          }

          options.byweekday.push(_index.default[wkd]);
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
        options.freq = _index.default.YEARLY;
        options.bymonth = [decodeM()];
        if (!ttr.nextSymbol()) return; // TODO check for duplicates

        while (ttr.accept('comma')) {
          if (ttr.isDone()) throw new Error('Unexpected end');
          var m = void 0;

          if (!(m = decodeM())) {
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
    if (!(on || the)) return;

    do {
      var nth = void 0,
          wkd = void 0,
          m = void 0; // nth <weekday> | <weekday>

      if (nth = decodeNTH()) {
        // ttr.nextSymbol()
        if (wkd = decodeWKD()) {
          ttr.nextSymbol();
          if (!options.byweekday) options.byweekday = [];
          options.byweekday.push(_index.default[wkd].nth(nth));
        } else {
          if (!options.bymonthday) options.bymonthday = [];
          options.bymonthday.push(nth);
          ttr.accept('day(s)');
        } // <weekday>

      } else if (wkd = decodeWKD()) {
        ttr.nextSymbol();
        if (!options.byweekday) options.byweekday = [];
        options.byweekday.push(_index.default[wkd]);
      } else if (ttr.symbol === 'weekday(s)') {
        ttr.nextSymbol();
        if (!options.byweekday) options.byweekday = [];
        options.byweekday.push(_index.default.MO);
        options.byweekday.push(_index.default.TU);
        options.byweekday.push(_index.default.WE);
        options.byweekday.push(_index.default.TH);
        options.byweekday.push(_index.default.FR);
      } else if (ttr.symbol === 'week(s)') {
        ttr.nextSymbol();
        var n = void 0;

        if (!(n = ttr.accept('number'))) {
          throw new Error('Unexpected symbol ' + ttr.symbol + ', expected week number');
        }

        options.byweekno = [n[0]];

        while (ttr.accept('comma')) {
          if (!(n = ttr.accept('number'))) {
            throw new Error('Unexpected symbol ' + ttr.symbol + '; expected monthday');
          }

          options.byweekno.push(n[0]);
        }
      } else if (m = decodeM()) {
        ttr.nextSymbol();
        if (!options.bymonth) options.bymonth = [];
        options.bymonth.push(m);
      } else {
        return;
      }
    } while (ttr.accept('comma') || ttr.accept('the') || ttr.accept('on'));
  }

  function AT() {
    var at = ttr.accept('at');
    if (!at) return;

    do {
      var n = void 0;

      if (!(n = ttr.accept('number'))) {
        throw new Error('Unexpected symbol ' + ttr.symbol + ', expected hour');
      }

      options.byhour = [n[0]];

      while (ttr.accept('comma')) {
        if (!(n = ttr.accept('number'))) {
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
        var v = parseInt(ttr.value[1], 10);
        if (v < -366 || v > 366) throw new Error('Nth out of range: ' + v);
        ttr.nextSymbol();
        return ttr.accept('last') ? -v : v;

      default:
        return false;
    }
  }

  function MDAYs() {
    ttr.accept('on');
    ttr.accept('the');
    var nth;
    if (!(nth = decodeNTH())) return;
    options.bymonthday = [nth];
    ttr.nextSymbol();

    while (ttr.accept('comma')) {
      if (!(nth = decodeNTH())) {
        throw new Error('Unexpected symbol ' + ttr.symbol + '; expected monthday');
      }

      options.bymonthday.push(nth);
      ttr.nextSymbol();
    }
  }

  function F() {
    if (ttr.symbol === 'until') {
      var date = Date.parse(ttr.text);
      if (!date) throw new Error('Cannot parse until date:' + ttr.text);
      options.until = new Date(date);
    } else if (ttr.accept('for')) {
      options.count = ttr.value[0];
      ttr.expect('number'); // ttr.expect('times')
    }
  }
}; // =============================================================================
// Parser
// =============================================================================


var Parser =
/*#__PURE__*/
function () {
  function Parser(rules) {
    _classCallCheck(this, Parser);

    this.rules = rules;
  }

  _createClass(Parser, [{
    key: "start",
    value: function start(text) {
      this.text = text;
      this.done = false;
      return this.nextSymbol();
    }
  }, {
    key: "isDone",
    value: function isDone() {
      return this.done && this.symbol == null;
    }
  }, {
    key: "nextSymbol",
    value: function nextSymbol() {
      var best, bestSymbol;
      var p = this;
      this.symbol = null;
      this.value = null;

      do {
        if (this.done) return false;
        var match = void 0,
            rule = void 0;
        best = null;

        for (var name in this.rules) {
          rule = this.rules[name];

          if (match = rule.exec(p.text)) {
            if (best == null || match[0].length > best[0].length) {
              best = match;
              bestSymbol = name;
            }
          }
        }

        if (best != null) {
          this.text = this.text.substr(best[0].length);
          if (this.text === '') this.done = true;
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
  }, {
    key: "accept",
    value: function accept(name) {
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
    }
  }, {
    key: "expect",
    value: function expect(name) {
      if (this.accept(name)) return true;
      throw new Error('expected ' + name + ' but found ' + this.symbol);
    }
  }]);

  return Parser;
}();

var _default = parseText;
exports.default = _default;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rrule = _interopRequireDefault(__webpack_require__(2));

var _rruleset = _interopRequireDefault(__webpack_require__(7));

var _dateutil = _interopRequireDefault(__webpack_require__(3));

var _weekday = _interopRequireDefault(__webpack_require__(4));

var _helpers = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * RRuleStr
 *  To parse a set of rrule strings
 */
var RRuleStr =
/*#__PURE__*/
function () {
  function RRuleStr() {
    _classCallCheck(this, RRuleStr);
  }

  _createClass(RRuleStr, [{
    key: "_handle_int",
    value: function _handle_int(rrkwargs, name, value, options) {
      // eslint-disable-line
      rrkwargs[name.toLowerCase()] = parseInt(value, 10);
    }
  }, {
    key: "_handle_int_list",
    value: function _handle_int_list(rrkwargs, name, value, options) {
      // eslint-disable-line
      rrkwargs[name.toLowerCase()] = value.split(',').map(function (x) {
        return parseInt(x, 10);
      });
    }
  }, {
    key: "_handle_FREQ",
    value: function _handle_FREQ(rrkwargs, name, value, options) {
      // eslint-disable-line
      rrkwargs['freq'] = RRuleStr._freq_map[value];
    }
  }, {
    key: "_handle_UNTIL",
    value: function _handle_UNTIL(rrkwargs, name, value, options) {
      // eslint-disable-line
      try {
        rrkwargs['until'] = _dateutil.default.untilStringToDate(value);
      } catch (error) {
        throw new Error('invalid until date');
      }
    }
  }, {
    key: "_handle_WKST",
    value: function _handle_WKST(rrkwargs, name, value, options) {
      // eslint-disable-line
      rrkwargs['wkst'] = RRuleStr._weekday_map[value];
    }
  }, {
    key: "_handle_BYWEEKDAY",
    value: function _handle_BYWEEKDAY(rrkwargs, name, value, options) {
      // eslint-disable-line
      // Two ways to specify this: +1MO or MO(+1)
      var splt, i, j, n, w, wday;
      var l = [];
      var wdays = value.split(',');

      for (i = 0; i < wdays.length; i++) {
        wday = wdays[i];

        if (wday.indexOf('(') > -1) {
          // If it's of the form TH(+1), etc.
          splt = wday.split('(');
          w = splt[0];
          n = parseInt(splt.slice(1, -1), 10);
        } else {
          // # If it's of the form +1MO
          for (j = 0; j < wday.length; j++) {
            if ('+-0123456789'.indexOf(wday[j]) === -1) break;
          }

          n = wday.slice(0, j) || null;
          w = wday.slice(j);
          if (n) n = parseInt(n, 10);
        }

        var weekday = new _weekday.default(RRuleStr._weekday_map[w], n);
        l.push(weekday);
      }

      rrkwargs['byweekday'] = l;
    }
  }, {
    key: "_parseRfcRRule",
    value: function _parseRfcRRule(line, options) {
      options = options || {};
      options.dtstart = options.dtstart || null;
      options.cache = options.cache || false;
      options.ignoretz = options.ignoretz || false;
      options.tzinfos = options.tzinfos || null;
      var name, value, parts;

      if (line.indexOf(':') !== -1) {
        parts = line.split(':');
        name = parts[0];
        value = parts[1];
        if (name !== 'RRULE') throw new Error('unknown parameter name');
      } else {
        value = line;
      }

      var i;
      var rrkwargs = {};
      var pairs = value.split(';');

      for (i = 0; i < pairs.length; i++) {
        parts = pairs[i].split('=');
        name = parts[0].toUpperCase();
        value = parts[1].toUpperCase();

        try {
          this['_handle_' + name](rrkwargs, name, value, {
            ignoretz: options.ignoretz,
            tzinfos: options.tzinfos
          });
        } catch (error) {
          throw new Error("unknown parameter '" + name + "':" + value);
        }
      }

      rrkwargs.dtstart = rrkwargs.dtstart || options.dtstart;
      return new _rrule.default(rrkwargs, !options.cache);
    }
  }, {
    key: "_parseRfc",
    value: function _parseRfc(s, options) {
      if (options.compatible) {
        options.forceset = true;
        options.unfold = true;
      }

      s = s && s.toUpperCase().trim();
      if (!s) throw new Error('Invalid empty string');
      var i = 0;
      var line, lines; // More info about 'unfold' option
      // Go head to http://www.ietf.org/rfc/rfc2445.txt

      if (options.unfold) {
        lines = s.split('\n');

        while (i < lines.length) {
          // TODO
          line = lines[i] = lines[i].replace(/\s+$/g, '');

          if (!line) {
            lines.splice(i, 1);
          } else if (i > 0 && line[0] === ' ') {
            lines[i - 1] += line.slice(1);
            lines.splice(i, 1);
          } else {
            i += 1;
          }
        }
      } else {
        lines = s.split(/\s/);
      }

      var rrulevals = [];
      var rdatevals = [];
      var exrulevals = [];
      var exdatevals = [];
      var name, value, parts, parms, parm, dtstart, rset, j, k, datestrs, datestr;

      if (!options.forceset && lines.length === 1 && (s.indexOf(':') === -1 || s.indexOf('RRULE:') === 0)) {
        return this._parseRfcRRule(lines[0], {
          cache: options.cache,
          dtstart: options.dtstart,
          ignoretz: options.ignoretz,
          tzinfos: options.tzinfos
        });
      } else {
        for (var _i = 0; _i < lines.length; _i++) {
          line = lines[_i];
          if (!line) continue;

          if (line.indexOf(':') === -1) {
            name = 'RRULE';
            value = line;
          } else {
            parts = (0, _helpers.split)(line, ':', 1);
            name = parts[0];
            value = parts[1];
          }

          parms = name.split(';');
          if (!parms) throw new Error('empty property name');
          name = parms[0];
          parms = parms.slice(1);

          if (name === 'RRULE') {
            for (j = 0; j < parms.length; j++) {
              parm = parms[j];
              throw new Error('unsupported RRULE parm: ' + parm);
            }

            rrulevals.push(value);
          } else if (name === 'RDATE') {
            for (j = 0; j < parms.length; j++) {
              parm = parms[j];

              if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
                throw new Error('unsupported RDATE parm: ' + parm);
              }
            }

            rdatevals.push(value);
          } else if (name === 'EXRULE') {
            for (j = 0; j < parms.length; j++) {
              parm = parms[j];
              throw new Error('unsupported EXRULE parm: ' + parm);
            }

            exrulevals.push(value);
          } else if (name === 'EXDATE') {
            for (j = 0; j < parms.length; j++) {
              parm = parms[j];

              if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
                throw new Error('unsupported EXDATE parm: ' + parm);
              }
            }

            exdatevals.push(value);
          } else if (name === 'DTSTART') {
            dtstart = _dateutil.default.untilStringToDate(value);
          } else {
            throw new Error('unsupported property: ' + name);
          }
        }

        if (options.forceset || rrulevals.length > 1 || rdatevals.length || exrulevals.length || exdatevals.length) {
          rset = new _rruleset.default(!options.cache);

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
              rset.rdate(_dateutil.default.untilStringToDate(datestr));
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
              rset.exdate(_dateutil.default.untilStringToDate(datestr));
            }
          }

          if (options.campatiable && options.dtstart) rset.rdate(dtstart);
          return rset;
        } else {
          return this._parseRfcRRule(rrulevals[0], {
            dtstart: options.dtstart || dtstart,
            cache: options.cache,
            ignoretz: options.ignoretz,
            tzinfos: options.tzinfos
          });
        }
      }
    }
  }, {
    key: "parse",
    value: function parse(s, options) {
      options = options || {};
      var invalid = [];
      var keys = Object.keys(options);
      var defaultKeys = Object.keys(RRuleStr.DEFAULT_OPTIONS);
      keys.forEach(function (key) {
        if (!(0, _helpers.contains)(defaultKeys, key)) invalid.push(key);
      }, this);
      if (invalid.length) throw new Error('Invalid options: ' + invalid.join(', ')); // Merge in default options

      defaultKeys.forEach(function (key) {
        if (!(0, _helpers.contains)(keys, key)) options[key] = RRuleStr.DEFAULT_OPTIONS[key];
      });
      return this._parseRfc(s, options);
    }
  }]);

  return RRuleStr;
}();

RRuleStr.DEFAULT_OPTIONS = {
  dtstart: null,
  cache: false,
  unfold: false,
  forceset: false,
  compatible: false,
  ignoretz: false,
  tzinfos: null
};
RRuleStr._freq_map = {
  'YEARLY': _rrule.default.YEARLY,
  'MONTHLY': _rrule.default.MONTHLY,
  'WEEKLY': _rrule.default.WEEKLY,
  'DAILY': _rrule.default.DAILY,
  'HOURLY': _rrule.default.HOURLY,
  'MINUTELY': _rrule.default.MINUTELY,
  'SECONDLY': _rrule.default.SECONDLY
};
RRuleStr._weekday_map = {
  'MO': 0,
  'TU': 1,
  'WE': 2,
  'TH': 3,
  'FR': 4,
  'SA': 5,
  'SU': 6
};

RRuleStr.prototype._handle_DTSTART = function (rrkwargs, name, value, options) {
  rrkwargs[name.toLowerCase()] = _dateutil.default.untilStringToDate(value);
};

RRuleStr.prototype._handle_BYDAY = RRuleStr.prototype._handle_BYWEEKDAY;
RRuleStr.prototype._handle_INTERVAL = RRuleStr.prototype._handle_int;
RRuleStr.prototype._handle_COUNT = RRuleStr.prototype._handle_int;
['_handle_BYSETPOS', '_handle_BYMONTH', '_handle_BYMONTHDAY', '_handle_BYYEARDAY', '_handle_BYEASTER', '_handle_BYWEEKNO', '_handle_BYHOUR', '_handle_BYMINUTE', '_handle_BYSECOND'].forEach(function (method) {
  RRuleStr.prototype[method] = RRuleStr.prototype._handle_int_list;
});
var _default = RRuleStr;
exports.default = _default;

/***/ })
/******/ ]);
});
//# sourceMappingURL=index.js.map