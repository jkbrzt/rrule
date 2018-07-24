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
/* global module, define */

;(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else {
    root.RRule = factory(root)
    root.RRuleSet = root.RRule.RRuleSet
    root.rrulestr = root.RRule.rrulestr
  }
}(typeof window === 'object' ? window : this, function (root) {
  var RRule = require('./lib/rrule')
  var RRuleSet = require('./lib/rruleset')
  var RRuleStr = require('./lib/rrulestr')

  // =============================================================================
  // Export
  // =============================================================================

  // Only one RRuleStr instance for all rrule string parsing work.
  var rruleStr = new RRuleStr()
  var rrulestr = function () {
    return rruleStr.parse.apply(rruleStr, arguments)
  }

  RRule.RRule = RRule
  RRule.RRuleSet = RRuleSet
  RRule.rrulestr = rrulestr
  return RRule
})); // eslint-disable-line
