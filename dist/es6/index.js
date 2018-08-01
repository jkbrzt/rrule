"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const rrule_1 = require("./rrule");
exports.RRule = rrule_1.default;
const rruleset_1 = require("./rruleset");
exports.RRuleSet = rruleset_1.default;
const rrulestr_1 = require("./rrulestr");
var rrule_2 = require("./rrule");
exports.Frequency = rrule_2.Frequency;
var weekday_1 = require("./weekday");
exports.Weekday = weekday_1.default;
// =============================================================================
// Export
// =============================================================================
// Only one RRuleStr instance for all rrule string parsing work.
const rruleStr = new rrulestr_1.default();
const rrulestr = function () {
    return rruleStr.parse.apply(rruleStr, arguments);
};
exports.rrulestr = rrulestr;
exports.default = rrule_1.default;
//# sourceMappingURL=index.js.map