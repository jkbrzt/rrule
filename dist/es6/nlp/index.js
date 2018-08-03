"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const totext_1 = require("./totext");
const parsetext_1 = require("./parsetext");
exports.parseText = parsetext_1.default;
const index_1 = require("../index");
const i18n_1 = require("./i18n");
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
const fromText = function (text, language = i18n_1.default) {
    return new index_1.default(parsetext_1.default(text, language) || undefined);
};
exports.fromText = fromText;
const common = [
    'count',
    'until',
    'interval',
    'byweekday',
    'bymonthday',
    'bymonth'
];
totext_1.default.IMPLEMENTED = [];
totext_1.default.IMPLEMENTED[index_1.default.HOURLY] = common;
totext_1.default.IMPLEMENTED[index_1.default.MINUTELY] = common;
totext_1.default.IMPLEMENTED[index_1.default.DAILY] = ['byhour'].concat(common);
totext_1.default.IMPLEMENTED[index_1.default.WEEKLY] = common;
totext_1.default.IMPLEMENTED[index_1.default.MONTHLY] = common;
totext_1.default.IMPLEMENTED[index_1.default.YEARLY] = ['byweekno', 'byyearday'].concat(common);
// =============================================================================
// Export
// =============================================================================
const toText = function (rrule, gettext, language) {
    return new totext_1.default(rrule, gettext, language).toString();
};
exports.toText = toText;
const { isFullyConvertible } = totext_1.default;
exports.isFullyConvertible = isFullyConvertible;
//# sourceMappingURL=index.js.map