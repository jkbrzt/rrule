import Weekday from './weekday'
import dateutil from './dateutil'
import Iterinfo, { GetDayset, DaySet } from './iterinfo'
import { pymod, divmod, notEmpty, contains, isPresent, isNumber, isArray } from './helpers'

import IterResult, { IterArgs } from './iterresult'
import CallbackIterResult from './callbackiterresult'
import { Language } from './nlp/i18n'
import { Nlp } from './nlp/index'
import { GetText } from './nlp/totext'
import { Cache, Days, ParsedOptions, Options, Frequency, CacheKeys } from './types'
import { parseOptions, initializeOptions } from './parseoptions'
import { parseString } from './parsestring'

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

export const DEFAULT_OPTIONS: Options = {
  freq: Frequency.YEARLY,
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
}

export const defaultKeys = Object.keys(DEFAULT_OPTIONS) as (keyof Options)[]

/**
 *
 * @param {Options?} options - see <http://labix.org/python-dateutil/#head-cf004ee9a75592797e076752b2a889c10f445418>
 *        The only required option is `freq`, one of RRule.YEARLY, RRule.MONTHLY, ...
 * @constructor
 */
export default class RRule {
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
    this._cache = noCache
      ? null
      : {
        all: false,
        before: [],
        after: [],
        between: []
      }

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

  static parseString (rfcString: string) {
    return parseString(rfcString)
  }

  static fromString (str: string) {
    return new RRule(RRule.parseString(str) || undefined)
  }

  static optionsToString (options: Partial<Options>) {
    const pairs = []
    const keys: (keyof Options)[] = Object.keys(options) as (keyof Options)[]
    const defaultKeys = Object.keys(DEFAULT_OPTIONS)

    for (let i = 0; i < keys.length; i++) {
      if (!contains(defaultKeys, keys[i])) continue

      let key = keys[i].toUpperCase()
      let value: any = options[keys[i]]
      let strValues = []

      if (!isPresent(value) || (isArray(value) && !value.length)) continue

      switch (key) {
        case 'FREQ':
          value = RRule.FREQUENCIES[options.freq!]
          break
        case 'WKST':
          if (isNumber(value)) {
            value = new Weekday(value)
          }
          break
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
          key = 'BYDAY'
          if (!isArray(value)) value = [value]

          for (let j = 0; j < value.length; j++) {
            let wday: Weekday | number[] | number = value[j]
            if (wday instanceof Weekday) {
              // good
            } else if (isArray(wday)) {
              wday = new Weekday(wday[0], wday[1])
            } else {
              wday = new Weekday(wday)
            }
            strValues[j] = wday.toString()
          }
          value = strValues
          break
        case 'DTSTART':
        case 'UNTIL':
          value = dateutil.timeToUntilString(value)
          break
        default:
          if (isArray(value)) {
            for (let j = 0; j < value.length; j++) {
              strValues[j] = String(value[j])
            }
            value = strValues
          } else {
            value = String(value)
          }
      }

      pairs.push([key, value])
    }

    const strings = []
    for (let i = 0; i < pairs.length; i++) {
      const attr = pairs[i]
      strings.push(attr[0] + '=' + attr[1].toString())
    }
    return strings.join(';')
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
      return this._iter(new CallbackIterResult('between', args, iterator)) as Date[]
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
    return RRule.optionsToString(this.origOptions)
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
   * @param {String} what - all/before/after/between
   * @param {Array,Date} value - an array of dates, one date, or null
   * @param {Object?} args - _iter arguments
   */
  private _cacheAdd (
    what: CacheKeys | 'all',
    value: Date[] | Date | null,
    args?: Partial<IterArgs>
  ) {
    if (!this._cache) return

    if (value) {
      value =
        value instanceof Date
          ? dateutil.clone(value)
          : dateutil.cloneDates(value)
    }

    if (what === 'all') {
      this._cache.all = value as Date[]
    } else {
      args!._value = value
      this._cache[what].push(args as IterArgs)
    }
  }

  /**
   * @return false - not in the cache
   *         null  - cached, but zero occurrences (before/after)
   *         Date  - cached (before/after)
   *         []    - cached, but zero occurrences (all/between)
   *         [Date1, DateN] - cached (all/between)
   */
  private _cacheGet (
    what: CacheKeys | 'all',
    args?: Partial<IterArgs>
  ): Date | Date[] | false | null {
    if (!this._cache) return false

    let cached: Date | Date[] | false | null = false
    const argsKeys = args ? Object.keys(args) as (keyof IterArgs)[] : []
    const findCacheDiff = function (item: IterArgs) {
      for (let i = 0; i < argsKeys.length; i++) {
        const key = argsKeys[i]
        if (String(args![key]) !== String(item[key])) {
          return true
        }
      }
      return false
    }

    const cachedObject = this._cache[what]
    if (what === 'all') {
      cached = this._cache.all as Date[]
    } else if (isArray(cachedObject)) {
      // Let's see whether we've already called the
      // 'what' method with the same 'args'
      for (let i = 0; i < cachedObject.length; i++) {
        const item = cachedObject[i] as IterArgs
        if (argsKeys.length && findCacheDiff(item)) continue
        cached = item._value
        break
      }
    }

    if (!cached && this._cache.all) {
      // Not in the cache, but we already know all the occurrences,
      // so we can find the correct dates from the cached ones.
      const iterResult = new IterResult(what, args!)
      for (let i = 0; i < this._cache.all.length; i++) {
        if (!iterResult.accept(this._cache.all[i])) break
      }
      cached = iterResult.getValue() as Date
      this._cacheAdd(what, cached, args)
    }

    return isArray(cached)
      ? dateutil.cloneDates(cached)
      : cached instanceof Date
        ? dateutil.clone(cached)
        : cached
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
    const dtstartMillisecondModulo = this.options.dtstart.valueOf() % 1000

    let year = dtstart.getUTCFullYear()
    let month = dtstart.getUTCMonth() + 1
    let day = dtstart.getUTCDate()
    let hour = dtstart.getUTCHours()
    let minute = dtstart.getUTCMinutes()
    let second = dtstart.getUTCSeconds()
    let weekday = dateutil.getWeekday(dtstart)

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
    ii.rebuild(year, month)

    const getdayset: GetDayset = {
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
        [RRule.YEARLY]: ii.ydayset,
        [RRule.MONTHLY]: ii.mdayset,
        [RRule.WEEKLY]: ii.wdayset,
        [RRule.DAILY]: ii.ddayset,
        [RRule.HOURLY]: ii.htimeset,
        [RRule.MINUTELY]: ii.mtimeset,
        [RRule.SECONDLY]: ii.stimeset
      }[freq] as typeof gettimeset

      if (
        (freq >= RRule.HOURLY && notEmpty(byhour) && !contains(byhour, hour)) ||
        (freq >= RRule.MINUTELY &&
          notEmpty(byminute) &&
          !contains(byminute, minute)) ||
        (freq >= RRule.SECONDLY && notEmpty(bysecond) && !contains(bysecond, second))
      ) {
        timeset = []
      } else {
        timeset = gettimeset.call(
          ii,
          hour,
          minute,
          second,
          dtstartMillisecondModulo
        )
      }
    }

    let currentDay: number
    let total = 0
    let count = this.options.count
    let dm: { div: number, mod: number }
    let div: number
    let mod: number
    let pos: number

    while (true) {
      // Get dayset with the right frequency
      const [ dayset, start, end ] = getdayset.call(ii, year, month, day) as DaySet

      // Do the "hard" work ;-)
      let filtered = false
      for (let dayCounter = start; dayCounter < end; dayCounter++) {
        currentDay = dayset[dayCounter] as number

        filtered =
          (notEmpty(bymonth) && !contains(bymonth, ii.mmask![currentDay])) ||
          (notEmpty(byweekno) && !ii.wnomask![currentDay]) ||
          (notEmpty(byweekday) &&
            !contains(byweekday, ii.wdaymask![currentDay])) ||
          (notEmpty(ii.nwdaymask!) && !ii.nwdaymask![currentDay]) ||
          (byeaster !== null && !contains(ii.eastermask!, currentDay)) ||
          ((notEmpty(bymonthday) || notEmpty(bynmonthday)) &&
            !contains(bymonthday, ii.mdaymask![currentDay]) &&
            !contains(bynmonthday, ii.nmdaymask![currentDay])) ||
          (notEmpty(byyearday) &&
            ((currentDay < ii.yearlen &&
              !contains(byyearday, currentDay + 1) &&
              !contains(byyearday, -ii.yearlen + currentDay)) ||
              (currentDay >= ii.yearlen &&
                !contains(byyearday, currentDay + 1 - ii.yearlen) &&
                !contains(byyearday, -ii.nextyearlen + currentDay - ii.yearlen))))

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

          try {
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
            if (!contains(poslist, res)) poslist.push(res)
          // tslint:disable-next-line:no-empty
          } catch (e) {}
        }

        dateutil.sort(poslist)
        for (let j = 0; j < poslist.length; j++) {
          const res = poslist[j]
          if (until && res > until) {
            this._len = total
            return iterResult.getValue() as Date[]
          } else if (res >= dtstart) {
            ++total
            if (!iterResult.accept(res)) {
              return iterResult.getValue() as Date[]
            }
            if (count) {
              --count
              if (!count) {
                this._len = total
                return iterResult.getValue() as Date[]
              }
            }
          }
        }
      } else {
        for (let j = start; j < end; j++) {
          currentDay = dayset[j] as number
          if (currentDay !== null) {
            const date = dateutil.fromOrdinal(ii.yearordinal + currentDay)
            for (let k = 0; k < timeset!.length; k++) {
              const time = timeset![k]
              const res = dateutil.combine(date, time)
              if (until && res > until) {
                this._len = total
                return iterResult.getValue() as Date[]
              } else if (res >= dtstart) {
                ++total
                if (!iterResult.accept(res)) {
                  return iterResult.getValue() as Date[]
                }
                if (count) {
                  --count
                  if (!count) {
                    this._len = total
                    return iterResult.getValue() as Date[]
                  }
                }
              }
            }
          }
        }
      }

      // Handle frequency and interval
      let fixday = false
      if (freq === RRule.YEARLY) {
        year += interval
        if (year > dateutil.MAXYEAR) {
          this._len = total
          return iterResult.getValue() as Date[]
        }
        ii.rebuild(year, month)
      } else if (freq === RRule.MONTHLY) {
        month += interval
        if (month > 12) {
          div = Math.floor(month / 12)
          mod = pymod(month, 12)
          month = mod
          year += div
          if (month === 0) {
            month = 12
            --year
          }
          if (year > dateutil.MAXYEAR) {
            this._len = total
            return iterResult.getValue() as Date[]
          }
        }
        ii.rebuild(year, month)
      } else if (freq === RRule.WEEKLY) {
        if (wkst > weekday) {
          day += -(weekday + 1 + (6 - wkst)) + interval * 7
        } else {
          day += -(weekday - wkst) + interval * 7
        }
        weekday = wkst
        fixday = true
      } else if (freq === RRule.DAILY) {
        day += interval
        fixday = true
      } else if (freq === RRule.HOURLY) {
        if (filtered) {
          // Jump to one iteration before next day
          hour += Math.floor((23 - hour) / interval) * interval
        }
        while (true) {
          hour += interval
          dm = divmod(hour, 24)
          div = dm.div
          mod = dm.mod
          if (div) {
            hour = mod
            day += div
            fixday = true
          }
          if (!notEmpty(byhour) || contains(byhour, hour)) break
        }
        // @ts-ignore
        timeset = gettimeset.call(ii, hour, minute, second)
      } else if (freq === RRule.MINUTELY) {
        if (filtered) {
          // Jump to one iteration before next day
          minute +=
            Math.floor((1439 - (hour * 60 + minute)) / interval) * interval
        }

        while (true) {
          minute += interval
          dm = divmod(minute, 60)
          div = dm.div
          mod = dm.mod
          if (div) {
            minute = mod
            hour += div
            dm = divmod(hour, 24)
            div = dm.div
            mod = dm.mod
            if (div) {
              hour = mod
              day += div
              fixday = true
              filtered = false
            }
          }
          if (
            (!notEmpty(byhour) || contains(byhour, hour)) &&
            (!notEmpty(byminute) || contains(byminute, minute))
          ) {
            break
          }
        }
        // @ts-ignore
        timeset = gettimeset.call(ii, hour, minute, second)
      } else if (freq === RRule.SECONDLY) {
        if (filtered) {
          // Jump to one iteration before next day
          second +=
            Math.floor(
              (86399 - (hour * 3600 + minute * 60 + second)) / interval
            ) * interval
        }
        while (true) {
          second += interval
          dm = divmod(second, 60)
          div = dm.div
          mod = dm.mod
          if (div) {
            second = mod
            minute += div
            dm = divmod(minute, 60)
            div = dm.div
            mod = dm.mod
            if (div) {
              minute = mod
              hour += div
              dm = divmod(hour, 24)
              div = dm.div
              mod = dm.mod
              if (div) {
                hour = mod
                day += div
                fixday = true
              }
            }
          }
          if (
            (!notEmpty(byhour) || contains(byhour, hour)) &&
            (!notEmpty(byminute) || contains(byminute, minute)) &&
            (!notEmpty(bysecond) || contains(bysecond, second))
          ) {
            break
          }
        }
        // @ts-ignore
        timeset = gettimeset.call(ii, hour, minute, second)
      }

      if (fixday && day > 28) {
        let daysinmonth = dateutil.monthRange(year, month - 1)[1]
        if (day > daysinmonth) {
          while (day > daysinmonth) {
            day -= daysinmonth
            ++month
            if (month === 13) {
              month = 1
              ++year
              if (year > dateutil.MAXYEAR) {
                this._len = total
                return iterResult.getValue() as Date[]
              }
            }
            daysinmonth = dateutil.monthRange(year, month - 1)[1]
          }
          ii.rebuild(year, month)
        }
      }
    }
  }
}
