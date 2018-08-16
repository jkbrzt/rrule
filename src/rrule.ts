import dateutil from './dateutil'
import Iterinfo, { GetDayset, DaySet } from './iterinfo'
import { pymod, notEmpty, includes, isPresent } from './helpers'

import IterResult, { IterArgs } from './iterresult'
import CallbackIterResult from './callbackiterresult'
import { Language } from './nlp/i18n'
import { Nlp } from './nlp/index'
import { GetText } from './nlp/totext'
import { ParsedOptions, Options, Frequency, QueryMethods } from './types'
import { parseOptions, initializeOptions } from './parseoptions'
import { parseString } from './parsestring'
import { optionsToString } from './optionstostring'
import { Cache, CacheKeys } from './cache'
import { Weekday } from './weekday'
import { DateTime } from 'luxon'

interface GetNlp {
  _nlp: Nlp
  (): Nlp
}

const getnlp: GetNlp = function () {
  // Lazy, runtime import to avoid circular refs.
  if (!getnlp._nlp) {
    getnlp._nlp = require('./nlp')
  }
  return getnlp._nlp
} as GetNlp

// =============================================================================
// RRule
// =============================================================================

export const Days = {
  MO: new Weekday(0),
  TU: new Weekday(1),
  WE: new Weekday(2),
  TH: new Weekday(3),
  FR: new Weekday(4),
  SA: new Weekday(5),
  SU: new Weekday(6)
}

export const DEFAULT_OPTIONS: Options = {
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
}

export const defaultKeys = Object.keys(DEFAULT_OPTIONS) as (keyof Options)[]

/**
 *
 * @param {Options?} options - see <http://labix.org/python-dateutil/#head-cf004ee9a75592797e076752b2a889c10f445418>
 *        The only required option is `freq`, one of RRule.YEARLY, RRule.MONTHLY, ...
 * @constructor
 */
export default class RRule implements QueryMethods {
  public _string: any
  public _cache: Cache | null
  public origOptions: Partial<Options>
  public options: ParsedOptions
  public timeset: dateutil.Time[] | null
  public _len: number

  // RRule class 'constants'

  static readonly FREQUENCIES: (keyof typeof Frequency)[] = [
    'YEARLY',
    'MONTHLY',
    'WEEKLY',
    'DAILY',
    'HOURLY',
    'MINUTELY',
    'SECONDLY'
  ]

  static readonly YEARLY = Frequency.YEARLY
  static readonly MONTHLY = Frequency.MONTHLY
  static readonly WEEKLY = Frequency.WEEKLY
  static readonly DAILY = Frequency.DAILY
  static readonly HOURLY = Frequency.HOURLY
  static readonly MINUTELY = Frequency.MINUTELY
  static readonly SECONDLY = Frequency.SECONDLY

  static readonly MO = Days.MO
  static readonly TU = Days.TU
  static readonly WE = Days.WE
  static readonly TH = Days.TH
  static readonly FR = Days.FR
  static readonly SA = Days.SA
  static readonly SU = Days.SU

  constructor (options: Partial<Options> = {}, noCache: boolean = false) {
    // RFC string
    this._string = null
    this._cache = noCache ? null : new Cache()

    // used by toString()
    this.origOptions = initializeOptions(options)
    const { parsedOptions, timeset } = parseOptions(options)
    this.options = parsedOptions
    this.timeset = timeset
  }

  static parseText (text: string, language: Language) {
    return getnlp().parseText(text, language)
  }

  static fromText (text: string, language?: Language) {
    return getnlp().fromText(text, language)
  }

  static parseString = parseString

  static fromString (str: string) {
    return new RRule(RRule.parseString(str) || undefined)
  }

  static optionsToString = optionsToString

  private _cacheGet (what: CacheKeys | 'all', args?: Partial<IterArgs>) {
    if (!this._cache) return false
    return this._cache._cacheGet(what, args)
  }

  public _cacheAdd (
    what: CacheKeys | 'all',
    value: Date[] | Date | null,
    args?: Partial<IterArgs>
  ) {
    if (!this._cache) return
    return this._cache._cacheAdd(what, value, args)
  }

  /**
   * @param {Function} iterator - optional function that will be called
   *                   on each date that is added. It can return false
   *                   to stop the iteration.
   * @return Array containing all recurrences.
   */
  all (iterator?: (d: Date, len: number) => boolean): Date[] {
    if (iterator) {
      return this._iter(new CallbackIterResult('all', {}, iterator)) as Date[]
    } else {
      let result = this._cacheGet('all') as Date[] | false
      if (result === false) {
        result = this._iter(new IterResult('all', {})) as Date[]
        this._cacheAdd('all', result)
      }
      return result
    }
  }

  /**
   * Returns all the occurrences of the rrule between after and before.
   * The inc keyword defines what happens if after and/or before are
   * themselves occurrences. With inc == True, they will be included in the
   * list, if they are found in the recurrence set.
   * @return Array
   */
  between (
    after: Date,
    before: Date,
    inc: boolean = false,
    iterator?: (d: Date, len: number) => boolean
  ): Date[] {
    const args = {
      before,
      after,
      inc
    }

    if (iterator) {
      return this._iter(
        new CallbackIterResult('between', args, iterator)
      ) as Date[]
    }

    let result = this._cacheGet('between', args)
    if (result === false) {
      result = this._iter(new IterResult('between', args))!
      this._cacheAdd('between', result, args)
    }
    return result as Date[]
  }

  /**
   * Returns the last recurrence before the given datetime instance.
   * The inc keyword defines what happens if dt is an occurrence.
   * With inc == True, if dt itself is an occurrence, it will be returned.
   * @return Date or null
   */
  before (dt: Date, inc = false): Date {
    const args = { dt: dt, inc: inc }
    let result = this._cacheGet('before', args)
    if (result === false) {
      result = this._iter(new IterResult('before', args))!
      this._cacheAdd('before', result, args)
    }
    return result as Date
  }

  /**
   * Returns the first recurrence after the given datetime instance.
   * The inc keyword defines what happens if dt is an occurrence.
   * With inc == True, if dt itself is an occurrence, it will be returned.
   * @return Date or null
   */
  after (dt: Date, inc = false): Date {
    const args = { dt: dt, inc: inc }
    let result = this._cacheGet('after', args)
    if (result === false) {
      result = this._iter(new IterResult('after', args))!
      this._cacheAdd('after', result, args)
    }
    return result as Date
  }

  /**
   * Returns the number of recurrences in this set. It will have go trough
   * the whole recurrence, if this hasn't been done before.
   */
  count (): number {
    return this.all().length
  }

  /**
   * Converts the rrule into its string representation
   * @see <http://www.ietf.org/rfc/rfc2445.txt>
   * @return String
   */
  toString () {
    return optionsToString(this.origOptions)
  }

  /**
   * Will convert all rules described in nlp:ToText
   * to text.
   */
  toText (gettext?: GetText, language?: Language) {
    return getnlp().toText(this, gettext, language)
  }

  isFullyConvertibleToText () {
    return getnlp().isFullyConvertible(this)
  }

  /**
   * @return a RRule instance with the same freq and options
   *          as this one (cache is not cloned)
   */
  clone (): RRule {
    return new RRule(this.origOptions)
  }

  _iter (iterResult: IterResult): Date | Date[] | null {
    /* Since JavaScript doesn't have the python's yield operator (<1.7),
        we use the IterResult object that tells us when to stop iterating.

    */

    const dtstart = this.options.dtstart

    let date = new dateutil.DateTime(
      dtstart.getUTCFullYear(),
      dtstart.getUTCMonth() + 1,
      dtstart.getUTCDate(),
      dtstart.getUTCHours(),
      dtstart.getUTCMinutes(),
      dtstart.getUTCSeconds(),
      dtstart.valueOf() % 1000
    )

    // Some local variables to speed things up a bit
    const {
      freq,
      interval,
      wkst,
      until,
      bymonth,
      byweekno,
      byyearday,
      byweekday,
      byeaster,
      bymonthday,
      bynmonthday,
      bysetpos,
      byhour,
      byminute,
      bysecond
    } = this.options

    const ii = new Iterinfo(this)
    ii.rebuild(date.year, date.month)

    const getdayset = {
      [RRule.YEARLY]: ii.ydayset,
      [RRule.MONTHLY]: ii.mdayset,
      [RRule.WEEKLY]: ii.wdayset,
      [RRule.DAILY]: ii.ddayset,
      [RRule.HOURLY]: ii.ddayset,
      [RRule.MINUTELY]: ii.ddayset,
      [RRule.SECONDLY]: ii.ddayset
    }[freq] as GetDayset

    let timeset: dateutil.Time[] | null
    let gettimeset: () => typeof timeset
    if (freq < RRule.HOURLY) {
      timeset = this.timeset
    } else {
      gettimeset = {
        [RRule.HOURLY]: ii.htimeset,
        [RRule.MINUTELY]: ii.mtimeset,
        [RRule.SECONDLY]: ii.stimeset
      }[
        freq as Frequency.HOURLY | Frequency.MINUTELY | Frequency.SECONDLY
      ] as typeof gettimeset

      if (
        (freq >= RRule.HOURLY &&
          notEmpty(byhour) &&
          !includes(byhour, date.hour)) ||
        (freq >= RRule.MINUTELY &&
          notEmpty(byminute) &&
          !includes(byminute, date.minute)) ||
        (freq >= RRule.SECONDLY &&
          notEmpty(bysecond) &&
          !includes(bysecond, date.second))
      ) {
        timeset = []
      } else {
        timeset = gettimeset.call(
          ii,
          date.hour,
          date.minute,
          date.second,
          date.millisecond
        )
      }
    }

    let currentDay: number
    let count = this.options.count
    let pos: number

    while (true) {
      // Get dayset with the right frequency
      const [dayset, start, end] = getdayset.call(
        ii,
        date.year,
        date.month,
        date.day
      ) as DaySet

      // Do the "hard" work ;-)
      let filtered = false
      for (let dayCounter = start; dayCounter < end; dayCounter++) {
        currentDay = dayset[dayCounter] as number

        filtered = isFiltered(
          bymonth,
          ii,
          currentDay,
          byweekno,
          byweekday,
          byeaster,
          bymonthday,
          bynmonthday,
          byyearday
        )

        if (filtered) dayset[currentDay] = null
      }

      // Output results
      if (notEmpty(bysetpos) && notEmpty(timeset)) {
        let daypos: number
        let timepos: number
        const poslist: Date[] = []

        for (let j = 0; j < bysetpos.length; j++) {
          pos = bysetpos[j]

          if (pos < 0) {
            daypos = Math.floor(pos / timeset.length)
            timepos = pymod(pos, timeset.length)
          } else {
            daypos = Math.floor((pos - 1) / timeset.length)
            timepos = pymod(pos - 1, timeset.length)
          }

          const tmp = []
          for (let k = start; k < end; k++) {
            const val = dayset[k]
            if (!isPresent(val)) continue
            tmp.push(val)
          }
          let i: number
          if (daypos < 0) {
            // we're trying to emulate python's aList[-n]
            i = tmp.slice(daypos)[0]
          } else {
            i = tmp[daypos]
          }

          const time = timeset[timepos]
          const date = dateutil.fromOrdinal(ii.yearordinal + i)
          const res = dateutil.combine(date, time)
          // XXX: can this ever be in the array?
          // - compare the actual date instead?
          if (!includes(poslist, res)) poslist.push(res)
        }

        dateutil.sort(poslist)
        for (let j = 0; j < poslist.length; j++) {
          const res = poslist[j]
          if (until && res > until) {
            return this.emitResult(iterResult)
          }

          if (res >= dtstart) {
            const rezonedDate = this.rezoneIfNeeded(res)
            if (!iterResult.accept(rezonedDate)) {
              return this.emitResult(iterResult)
            }

            if (count) {
              --count
              if (!count) {
                return this.emitResult(iterResult)
              }
            }
          }
        }
      } else {
        for (let j = start; j < end; j++) {
          currentDay = dayset[j] as number
          if (!isPresent(currentDay)) {
            continue
          }

          const date = dateutil.fromOrdinal(ii.yearordinal + currentDay)
          for (let k = 0; k < timeset!.length; k++) {
            const time = timeset![k]
            const res = dateutil.combine(date, time)
            if (until && res > until) {
              return this.emitResult(iterResult)
            }

            if (res >= dtstart) {
              const rezonedDate = this.rezoneIfNeeded(res)
              if (!iterResult.accept(rezonedDate)) {
                return this.emitResult(iterResult)
              }

              if (count) {
                --count
                if (!count) {
                  return this.emitResult(iterResult)
                }
              }
            }
          }
        }
      }

      // Handle frequency and interval
      if (freq === RRule.YEARLY) {
        date.addYears(interval)
      } else if (freq === RRule.MONTHLY) {
        date.addMonths(interval)
      } else if (freq === RRule.WEEKLY) {
        date.addWeekly(interval, wkst)
      } else if (freq === RRule.DAILY) {
        date.addDaily(interval)
      } else if (freq === RRule.HOURLY) {
        date.addHours(interval, filtered, byhour)

        // @ts-ignore
        timeset = gettimeset.call(ii, date.hour, date.minute, date.second)
      } else if (freq === RRule.MINUTELY) {
        if (date.addMinutes(interval, filtered, byhour, byminute)) {
          filtered = false
        }

        // @ts-ignore
        timeset = gettimeset.call(ii, date.hour, date.minute, date.second)
      } else if (freq === RRule.SECONDLY) {
        if (date.addSeconds(interval, filtered, byhour, byminute, bysecond)) {
          filtered = false
        }

        // @ts-ignore
        timeset = gettimeset.call(ii, date.hour, date.minute, date.second)
      }

      if (date.year > dateutil.MAXYEAR) {
        return this.emitResult(iterResult)
      }

      ii.rebuild(date.year, date.month)
    }
  }

  private emitResult (iterResult: IterResult) {
    this._len = iterResult.total
    return iterResult.getValue() as Date[]
  }

  private rezoneIfNeeded (date: Date) {
    const { tzid } = this.options

    if (!tzid) {
      return date
    }

    try {
      const datetime = DateTime
        .fromJSDate(date)

      const rezoned = datetime.setZone(tzid, { keepLocalTime: true })

      return rezoned.toJSDate()
    } catch (e) {
      if (e instanceof TypeError) {
        console.error('Using TZID without Luxon available is unsupported. Returned times are in UTC, not the requested time zone')
      }
      return date
    }
  }
}

function isFiltered (
  bymonth: number[],
  ii: Iterinfo,
  currentDay: number,
  byweekno: number[],
  byweekday: number[],
  byeaster: number | null,
  bymonthday: number[],
  bynmonthday: number[],
  byyearday: number[]
): boolean {
  return (
    (notEmpty(bymonth) && !includes(bymonth, ii.mmask![currentDay])) ||
    (notEmpty(byweekno) && !ii.wnomask![currentDay]) ||
    (notEmpty(byweekday) && !includes(byweekday, ii.wdaymask![currentDay])) ||
    (notEmpty(ii.nwdaymask!) && !ii.nwdaymask![currentDay]) ||
    (byeaster !== null && !includes(ii.eastermask!, currentDay)) ||
    ((notEmpty(bymonthday) || notEmpty(bynmonthday)) &&
      !includes(bymonthday, ii.mdaymask![currentDay]) &&
      !includes(bynmonthday, ii.nmdaymask![currentDay])) ||
    (notEmpty(byyearday) &&
      ((currentDay < ii.yearlen &&
        !includes(byyearday, currentDay + 1) &&
        !includes(byyearday, -ii.yearlen + currentDay)) ||
        (currentDay >= ii.yearlen &&
          !includes(byyearday, currentDay + 1 - ii.yearlen) &&
          !includes(byyearday, -ii.nextyearlen + currentDay - ii.yearlen))))
  )
}
