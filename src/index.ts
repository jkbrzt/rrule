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

import RRule from './rrule'
import RRuleSet from './rruleset'
import { rrulestr } from './rrulestr'
export { rrulestr } from './rrulestr'
export { Days } from './rrule'
import { QueryIterator, Options } from './types'
import { parseString } from './parsestring'
export { Frequency, ByWeekday, Options } from './types'
export { Weekday, WeekdayStr } from './weekday'
export { RRuleStrOptions } from './rrulestr'

// =============================================================================
// Export
// =============================================================================

export function all (options: Partial<Options>, iter?: QueryIterator) {
  const rule = new RRule(options)
  return rule.all(iter)
}

export function between (options: Partial<Options>, after: Date, before: Date, inc: boolean = false, iter?: QueryIterator) {
  const rule = new RRule(options)
  return rule.between(after, before, inc, iter)
}

export function before (options: Partial<Options>, date: Date, inc: boolean = false) {
  const rule = new RRule(options)
  return rule.before(date, inc)
}

export function after (options: Partial<Options>, date: Date, inc: boolean = false) {
  const rule = new RRule(options)
  return rule.after(date, inc)
}

export function count (options: Partial<Options>) {
  return new RRule(options).count()
}

export const parse = parseString
