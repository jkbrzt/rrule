import Weekday from './weekday'
import dateutil from './dateutil'
import { range, repeat, pymod, divmod, plb, contains } from './helpers'

import {
  WDAYMASK,
  M365MASK,
  M365RANGE,
  M366MASK,
  M366RANGE,
  MDAY365MASK,
  MDAY366MASK,
  NMDAY365MASK,
  NMDAY366MASK
} from './masks'

import IterResult, { IterArgs } from './iterresult'
import CallbackIterResult from './callbackiterresult'
import { Language } from './nlp/i18n'
import { Nlp } from './nlp/index'
import { GetText } from './nlp/totext'

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

export enum Frequency {
  YEARLY = 0,
  MONTHLY = 1,
  WEEKLY = 2,
  DAILY = 3,
  HOURLY = 4,
  MINUTELY = 5,
  SECONDLY = 6
}

// =============================================================================
// RRule
// =============================================================================

export interface Options {
  freq: Frequency
  dtstart: Date
  interval: number
  wkst: Weekday | number
  count: number
  until: Date
  bysetpos: number | number[]
  bymonth: number | number[]
  bymonthday: number | number[]
  bynmonthday: number[]
  byyearday: number[]
  byweekno: number | number[]
  byweekday: ByWeekday | ByWeekday[]
  bynweekday: number[][]
  byhour: number | number[]
  byminute: number | number[]
  bysecond: number | number[]
  byeaster: number
}

type CacheKeys = 'before' | 'after' | 'between'

type CacheBase = { [K in CacheKeys]: IterArgs[] }
export type Cache = CacheBase & { all: Date[] | Partial<IterArgs>[] | false }

export type WeekdayStr = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'

export type ByWeekday = WeekdayStr | number | Weekday

type DayType = { [K in WeekdayStr]: Weekday }

const Days: DayType = {
  MO: new Weekday(0),
  TU: new Weekday(1),
  WE: new Weekday(2),
  TH: new Weekday(3),
  FR: new Weekday(4),
  SA: new Weekday(5),
  SU: new Weekday(6)
}

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
  public options: Partial<Options>
  public timeset: dateutil.Time[]
  public _len: number

  // RRule class 'constants'

  static readonly FREQUENCIES = [
    'YEARLY',
    'MONTHLY',
    'WEEKLY',
    'DAILY',
    'HOURLY',
    'MINUTELY',
    'SECONDLY'
  ]

  static readonly YEARLY = 0
  static readonly MONTHLY = 1
  static readonly WEEKLY = 2
  static readonly DAILY = 3
  static readonly HOURLY = 4
  static readonly MINUTELY = 5
  static readonly SECONDLY = 6

  private static readonly DEFAULT_OPTIONS: Options = {
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
  }

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
    this.origOptions = {}

    this.options = {}

    const invalid: string[] = []
    const keys = Object.keys(options)
    const defaultKeys = Object.keys(RRule.DEFAULT_OPTIONS)

    // Shallow copy for options and origOptions and check for invalid
    keys.forEach(function (key: keyof Options) {
      this.origOptions[key] = options[key]
      this.options[key] = options[key]
      if (!contains(defaultKeys, key)) invalid.push(key)
    }, this)

    if (invalid.length) {
      throw new Error('Invalid options: ' + invalid.join(', '))
    }

    if (!RRule.FREQUENCIES[options.freq] && options.byeaster === null) {
      throw new Error('Invalid frequency: ' + String(options.freq))
    }

    // Merge in default options
    defaultKeys.forEach(function (key: keyof Options) {
      if (!contains(keys, key)) this.options[key] = RRule.DEFAULT_OPTIONS[key]
    }, this)

    const opts: Partial<Options> = this.options

    if (opts.byeaster !== null) opts.freq = RRule.YEARLY
    if (!opts.dtstart) opts.dtstart = new Date(new Date().setMilliseconds(0))

    const millisecondModulo = opts.dtstart.getTime() % 1000
    if (opts.wkst === null) {
      opts.wkst = RRule.MO.weekday
    } else if (typeof opts.wkst === 'number') {
      // cool, just keep it like that
    } else {
      opts.wkst = opts.wkst.weekday
    }

    let v
    if (opts.bysetpos !== null) {
      if (typeof opts.bysetpos === 'number') opts.bysetpos = [opts.bysetpos]

      for (let i = 0; i < opts.bysetpos.length; i++) {
        v = opts.bysetpos[i]
        if (v === 0 || !(v >= -366 && v <= 366)) {
          throw new Error(
            'bysetpos must be between 1 and 366,' + ' or between -366 and -1'
          )
        }
      }
    }

    if (
      !(
        plb(opts.byweekno) ||
        plb(opts.byyearday) ||
        plb(opts.bymonthday) ||
        opts.byweekday !== null ||
        opts.byeaster !== null
      )
    ) {
      switch (opts.freq) {
        case RRule.YEARLY:
          if (!opts.bymonth) opts.bymonth = opts.dtstart.getMonth() + 1
          opts.bymonthday = opts.dtstart.getDate()
          break
        case RRule.MONTHLY:
          opts.bymonthday = opts.dtstart.getDate()
          break
        case RRule.WEEKLY:
          opts.byweekday = [dateutil.getWeekday(opts.dtstart)]
          break
      }
    }

    // bymonth
    if (opts.bymonth !== null && !(opts.bymonth instanceof Array)) {
      opts.bymonth = [opts.bymonth]
    }
    // byyearday
    if (opts.byyearday !== null && !(opts.byyearday instanceof Array)) {
      opts.byyearday = [opts.byyearday]
    }

    // bymonthday
    if (opts.bymonthday === null) {
      opts.bymonthday = []
      opts.bynmonthday = []
    } else if (opts.bymonthday instanceof Array) {
      const bymonthday = []
      const bynmonthday = []

      for (let i = 0; i < opts.bymonthday.length; i++) {
        v = opts.bymonthday[i]
        if (v > 0) {
          bymonthday.push(v)
        } else if (v < 0) {
          bynmonthday.push(v)
        }
      }
      opts.bymonthday = bymonthday
      opts.bynmonthday = bynmonthday
    } else {
      if (opts.bymonthday < 0) {
        opts.bynmonthday = [opts.bymonthday]
        opts.bymonthday = []
      } else {
        opts.bynmonthday = []
        opts.bymonthday = [opts.bymonthday]
      }
    }

    // byweekno
    if (opts.byweekno !== null && !(opts.byweekno instanceof Array)) {
      opts.byweekno = [opts.byweekno]
    }

    // byweekday / bynweekday
    if (opts.byweekday === null) {
      opts.bynweekday = null
    } else if (typeof opts.byweekday === 'number') {
      opts.byweekday = [opts.byweekday]
      opts.bynweekday = null
    } else if (opts.byweekday instanceof Weekday) {
      if (!opts.byweekday.n || opts.freq > RRule.MONTHLY) {
        opts.byweekday = [opts.byweekday.weekday]
        opts.bynweekday = null
      } else {
        opts.bynweekday = [[opts.byweekday.weekday, opts.byweekday.n]]
        opts.byweekday = null
      }
    } else {
      const byweekday = []
      const bynweekday = []

      for (let i = 0; i < opts.byweekday.length; i++) {
        const wday = opts.byweekday[i]

        if (typeof wday === 'number') {
          byweekday.push(wday)
          continue
        }

        const wd = wday as Weekday
        if (!wd.n || opts.freq > RRule.MONTHLY) {
          byweekday.push(wd.weekday)
        } else {
          bynweekday.push([wd.weekday, wd.n])
        }
      }
      opts.byweekday = plb(byweekday) ? byweekday : null
      opts.bynweekday = plb(bynweekday) ? bynweekday : null
    }

    // byhour
    if (opts.byhour === null) {
      opts.byhour = opts.freq < RRule.HOURLY ? [opts.dtstart.getHours()] : null
    } else if (typeof opts.byhour === 'number') {
      opts.byhour = [opts.byhour]
    }

    // byminute
    if (opts.byminute === null) {
      opts.byminute =
        opts.freq < RRule.MINUTELY ? [opts.dtstart.getMinutes()] : null
    } else if (typeof opts.byminute === 'number') {
      opts.byminute = [opts.byminute]
    }

    // bysecond
    if (opts.bysecond === null) {
      opts.bysecond =
        opts.freq < RRule.SECONDLY ? [opts.dtstart.getSeconds()] : null
    } else if (typeof opts.bysecond === 'number') {
      opts.bysecond = [opts.bysecond]
    }

    if (opts.freq >= RRule.HOURLY) {
      this.timeset = null
    } else {
      this.timeset = []
      for (let i = 0; i < opts.byhour.length; i++) {
        const hour = opts.byhour[i]
        for (let j = 0; j < opts.byminute.length; j++) {
          const minute = opts.byminute[j]
          for (let k = 0; k < opts.bysecond.length; k++) {
            const second = opts.bysecond[k]
            // python:
            // datetime.time(hour, minute, second,
            // tzinfo=self._tzinfo))
            this.timeset.push(
              new dateutil.Time(hour, minute, second, millisecondModulo)
            )
          }
        }
      }
      dateutil.sort(this.timeset)
    }
  }

  static parseText (text: string, language: Language) {
    return getnlp().parseText(text, language)
  }

  static fromText (text: string, language?: Language) {
    return getnlp().fromText(text, language)
  }

  static parseString (rfcString: string) {
    rfcString = rfcString.replace(/^\s+|\s+$/, '')
    if (!rfcString.length) return null

    let key: string
    let value: string | string[] | number | number[] | (string | number)[]
    let attr: string[]
    const attrs = rfcString.split(';')
    const options: Partial<Options> = {}

    for (let i = 0; i < attrs.length; i++) {
      attr = attrs[i].split('=')
      key = attr[0]
      value = attr[1] as WeekdayStr
      switch (key) {
        case 'FREQ':
          options.freq = Frequency[value as keyof typeof Frequency]
          break
        case 'WKST':
          options.wkst = Days[value as keyof typeof Days]
          break
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
            value = value.split(',')
            for (let j = 0; j < value.length; j++) {
              if (/^[+-]?\d+$/.test(value[j].toString())) {
                value[j] = Number(value[j])
              }
            }
          } else if (/^[+-]?\d+$/.test(value)) {
            value = Number(value)
          }
          key = key.toLowerCase()
          // @ts-ignore
          options[key] = value
          break
        case 'BYDAY': // => byweekday
          let n: number
          let wday: Weekday | number
          let day: string
          const days = value.split(',')

          options.byweekday = []
          for (let j = 0; j < days.length; j++) {
            day = days[j]
            if (day.length === 2) {
              // MO, TU, ...
              wday = Days[day as keyof typeof Days] // wday instanceof Weekday
              options.byweekday.push(wday)
            } else {
              // -1MO, +3FR, 1SO, ...
              const parts = day.match(/^([+-]?\d)([A-Z]{2})$/)
              n = Number(parts[1])
              const wdaypart = parts[2] as keyof typeof Days
              wday = Days[wdaypart].weekday
              options.byweekday.push(new Weekday(wday, n))
            }
          }
          break
        case 'DTSTART':
          options.dtstart = dateutil.untilStringToDate(value)
          break
        case 'UNTIL':
          options.until = dateutil.untilStringToDate(value)
          break
        case 'BYEASTER':
          options.byeaster = Number(value)
          break
        default:
          throw new Error("Unknown RRULE property '" + key + "'")
      }
    }
    return options
  }

  static fromString (str: string) {
    return new RRule(RRule.parseString(str))
  }

  static optionsToString (options: Partial<Options>) {
    const pairs = []
    const keys: (keyof Options)[] = Object.keys(options) as (keyof Options)[]
    const defaultKeys = Object.keys(RRule.DEFAULT_OPTIONS)

    for (let i = 0; i < keys.length; i++) {
      if (!contains(defaultKeys, keys[i])) continue

      let key = keys[i].toUpperCase()
      let value: any = options[keys[i]]
      let strValues = []

      if (value === null || (value instanceof Array && !value.length)) continue

      switch (key) {
        case 'FREQ':
          value = RRule.FREQUENCIES[options.freq]
          break
        case 'WKST':
          if (!(value instanceof Weekday)) {
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
          if (!(value instanceof Array)) value = [value]

          for (let j = 0; j < value.length; j++) {
            let wday: Weekday | number[] | number = value[j]
            if (wday instanceof Weekday) {
              // good
            } else if (wday instanceof Array) {
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
          if (value instanceof Array) {
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
      result = this._iter(new IterResult('between', args))
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
      result = this._iter(new IterResult('before', args))
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
      result = this._iter(new IterResult('after', args))
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
      args._value = value
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
  ): Date | Date[] | false {
    if (!this._cache) return false

    let cached: Date | Date[] | false = false
    const argsKeys = args ? Object.keys(args) as (keyof IterArgs)[] : []
    const findCacheDiff = function (item: IterArgs) {
      for (let i = 0; i < argsKeys.length; i++) {
        const key = argsKeys[i]
        if (String(args[key]) !== String(item[key])) {
          return true
        }
      }
      return false
    }

    const cachedObject = this._cache[what]
    if (what === 'all') {
      cached = this._cache.all as Date[]
    } else if (cachedObject instanceof Array) {
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
      const iterResult = new IterResult(what, args)
      for (let i = 0; i < this._cache.all.length; i++) {
        if (!iterResult.accept(this._cache.all[i])) break
      }
      cached = iterResult.getValue() as Date
      this._cacheAdd(what, cached, args)
    }

    return cached instanceof Array
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

  private _iter (iterResult: IterResult): Date | Date[] | null {
    /* Since JavaScript doesn't have the python's yield operator (<1.7),
        we use the IterResult object that tells us when to stop iterating.

    */

    const dtstart = this.options.dtstart
    const dtstartMillisecondModulo = this.options.dtstart.valueOf() % 1000

    let year = dtstart.getFullYear()
    let month = dtstart.getMonth() + 1
    let day = dtstart.getDate()
    let hour = dtstart.getHours()
    let minute = dtstart.getMinutes()
    let second = dtstart.getSeconds()
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

    // tslint:disable-next-line:no-use-before-declare
    const ii = new Iterinfo(this)
    ii.rebuild(year, month)

    const getdayset = {
      [RRule.YEARLY]: ii.ydayset,
      [RRule.MONTHLY]: ii.mdayset,
      [RRule.WEEKLY]: ii.wdayset,
      [RRule.DAILY]: ii.ddayset,
      [RRule.HOURLY]: ii.ddayset,
      [RRule.MINUTELY]: ii.ddayset,
      [RRule.SECONDLY]: ii.ddayset
    }[freq]

    let timeset: dateutil.Time[]
    let gettimeset
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
      }[freq]

      if (
        (freq >= RRule.HOURLY && plb(byhour) && !contains(byhour as number[], hour)) ||
        (freq >= RRule.MINUTELY &&
          plb(byminute) &&
          !contains(byminute as number[], minute)) ||
        (freq >= RRule.SECONDLY && plb(bysecond) && !contains(bysecond as number[], second))
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

    let total = 0
    let count = this.options.count
    let i: number
    let k: number
    let dm: { div: number, mod: number }
    let div: number
    let mod: number
    let tmp: any[]
    let pos: number
    let dayset: number[]
    let start: number
    let end: number
    let fixday: boolean
    let filtered: boolean

    while (true) {
      // Get dayset with the right frequency
      tmp = getdayset.call(ii, year, month, day)
      dayset = tmp[0]
      start = tmp[1]
      end = tmp[2]

      // Do the "hard" work ;-)
      filtered = false
      for (let j = start; j < end; j++) {
        i = dayset[j]

        filtered =
          (plb(bymonth) && !contains(bymonth as number[], ii.mmask[i])) ||
          (plb(byweekno) && !ii.wnomask[i]) ||
          (plb(byweekday) &&
            !contains(byweekday as number[], ii.wdaymask[i])) ||
          (plb(ii.nwdaymask) && !ii.nwdaymask[i]) ||
          (byeaster !== null && !contains(ii.eastermask, i)) ||
          ((plb(bymonthday) || plb(bynmonthday)) &&
            !contains(bymonthday as number[], ii.mdaymask[i]) &&
            !contains(bynmonthday, ii.nmdaymask[i])) ||
          (plb(byyearday) &&
            ((i < ii.yearlen &&
              !contains(byyearday, i + 1) &&
              !contains(byyearday, -ii.yearlen + i)) ||
              (i >= ii.yearlen &&
                !contains(byyearday, i + 1 - ii.yearlen) &&
                !contains(byyearday, -ii.nextyearlen + i - ii.yearlen))))

        if (filtered) dayset[i] = null
      }

      // Output results
      if (plb(bysetpos) && plb(timeset)) {
        let daypos: number
        let timepos: number
        const poslist: Date[] = []

        for (let j = 0; j < (bysetpos as number[]).length; j++) {
          pos = (bysetpos as number[])[j]

          if (pos < 0) {
            daypos = Math.floor(pos / timeset.length)
            timepos = pymod(pos, timeset.length)
          } else {
            daypos = Math.floor((pos - 1) / timeset.length)
            timepos = pymod(pos - 1, timeset.length)
          }

          try {
            tmp = []
            for (k = start; k < end; k++) {
              const val = dayset[k]
              if (val === null) continue
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
          i = dayset[j]
          if (i !== null) {
            const date = dateutil.fromOrdinal(ii.yearordinal + i)
            for (k = 0; k < timeset.length; k++) {
              const time = timeset[k]
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
      fixday = false
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
          day += -(weekday + 1 + (6 - (wkst as number))) + interval * 7
        } else {
          day += -(weekday - (wkst as number)) + interval * 7
        }
        weekday = wkst as number
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
          if (!plb(byhour) || contains(byhour as number[], hour)) break
        }
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
            (!plb(byhour) || contains(byhour as number[], hour)) &&
            (!plb(byminute) || contains(byminute as number[], minute))
          ) {
            break
          }
        }
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
            (!plb(byhour) || contains(byhour as number[], hour)) &&
            (!plb(byminute) || contains(byminute as number[], minute)) &&
            (!plb(bysecond) || contains(bysecond as number[], second))
          ) {
            break
          }
        }
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

// =============================================================================
// Iterinfo
// =============================================================================

class Iterinfo {
  public rrule: RRule
  public lastyear: number
  public lastmonth: number
  public yearlen: number
  public nextyearlen: number
  public yearordinal: number
  public yearweekday: number
  public mmask: number[]
  public mrange: number[]
  public mdaymask: number[]
  public nmdaymask: number[]
  public wdaymask: number[]
  public wnomask: number[]
  public nwdaymask: number[]
  public eastermask: number[]

  constructor (rrule: RRule) {
    this.rrule = rrule
    this.lastyear = null
    this.lastmonth = null
    this.yearlen = null
    this.nextyearlen = null
    this.yearordinal = null
    this.yearweekday = null
    this.mmask = null
    this.mrange = null
    this.mdaymask = null
    this.nmdaymask = null
    this.wdaymask = null
    this.wnomask = null
    this.nwdaymask = null
    this.eastermask = null
  }

  easter (y: number, offset: number = 0) {
    const a = y % 19
    const b = Math.floor(y / 100)
    const c = y % 100
    const d = Math.floor(b / 4)
    const e = b % 4
    const f = Math.floor((b + 8) / 25)
    const g = Math.floor((b - f + 1) / 3)
    const h = Math.floor(19 * a + b - d - g + 15) % 30
    const i = Math.floor(c / 4)
    const k = c % 4
    const l = Math.floor(32 + 2 * e + 2 * i - h - k) % 7
    const m = Math.floor((a + 11 * h + 22 * l) / 451)
    const month = Math.floor((h + l - 7 * m + 114) / 31)
    const day = ((h + l - 7 * m + 114) % 31) + 1
    const date = Date.UTC(y, month - 1, day + offset)
    const yearStart = Date.UTC(y, 0, 1)

    return [Math.ceil((date - yearStart) / (1000 * 60 * 60 * 24))]
  }

  rebuild (year: number, month: number) {
    const rr = this.rrule

    if (year !== this.lastyear) {
      this.yearlen = dateutil.isLeapYear(year) ? 366 : 365
      this.nextyearlen = dateutil.isLeapYear(year + 1) ? 366 : 365
      const firstyday = new Date(year, 0, 1)

      this.yearordinal = dateutil.toOrdinal(firstyday)
      this.yearweekday = dateutil.getWeekday(firstyday)

      const wday = dateutil.getWeekday(new Date(year, 0, 1))

      if (this.yearlen === 365) {
        this.mmask = [].concat(M365MASK)
        this.mdaymask = [].concat(MDAY365MASK)
        this.nmdaymask = [].concat(NMDAY365MASK)
        this.wdaymask = WDAYMASK.slice(wday)
        this.mrange = [].concat(M365RANGE)
      } else {
        this.mmask = [].concat(M366MASK)
        this.mdaymask = [].concat(MDAY366MASK)
        this.nmdaymask = [].concat(NMDAY366MASK)
        this.wdaymask = WDAYMASK.slice(wday)
        this.mrange = [].concat(M366RANGE)
      }

      if (!plb(rr.options.byweekno)) {
        this.wnomask = null
      } else {
        this.wnomask = repeat(0, this.yearlen + 7) as number[]
        let no1wkst
        let firstwkst
        let wyearlen
        no1wkst = firstwkst = pymod(7 - this.yearweekday + (rr.options.wkst as number), 7)
        if (no1wkst >= 4) {
          no1wkst = 0
          // Number of days in the year, plus the days we got
          // from last year.
          wyearlen =
            this.yearlen + pymod(this.yearweekday - (rr.options.wkst as number), 7)
        } else {
          // Number of days in the year, minus the days we
          // left in last year.
          wyearlen = this.yearlen - no1wkst
        }
        const div = Math.floor(wyearlen / 7)
        const mod = pymod(wyearlen, 7)
        const numweeks = Math.floor(div + mod / 4)

        for (let j = 0; j < (rr.options.byweekno as number[]).length; j++) {
          let i: number
          let n = (rr.options.byweekno as number[])[j]
          if (n < 0) {
            n += numweeks + 1
          }
          if (!(n > 0 && n <= numweeks)) {
            continue
          }
          if (n > 1) {
            i = no1wkst + (n - 1) * 7
            if (no1wkst !== firstwkst) {
              i -= 7 - firstwkst
            }
          } else {
            i = no1wkst
          }
          for (let k = 0; k < 7; k++) {
            this.wnomask[i] = 1
            i++
            if (this.wdaymask[i] === rr.options.wkst) break
          }
        }

        if (contains(rr.options.byweekno as number[], 1)) {
          // Check week number 1 of next year as well
          // orig-TODO : Check -numweeks for next year.
          let i = no1wkst + numweeks * 7
          if (no1wkst !== firstwkst) i -= 7 - firstwkst
          if (i < this.yearlen) {
            // If week starts in next year, we
            // don't care about it.
            for (let j = 0; j < 7; j++) {
              this.wnomask[i] = 1
              i += 1
              if (this.wdaymask[i] === rr.options.wkst) break
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
          let lnumweeks
          if (!contains(rr.options.byweekno as number[], -1)) {
            const lyearweekday = dateutil.getWeekday(new Date(year - 1, 0, 1))
            let lno1wkst = pymod(
              7 - lyearweekday.valueOf() + (rr.options.wkst as number),
              7
            )
            const lyearlen = dateutil.isLeapYear(year - 1) ? 366 : 365
            if (lno1wkst >= 4) {
              lno1wkst = 0
              lnumweeks = Math.floor(
                52 +
                  pymod(
                    lyearlen + pymod(lyearweekday - (rr.options.wkst as number), 7),
                    7
                  ) /
                    4
              )
            } else {
              lnumweeks = Math.floor(52 + pymod(this.yearlen - no1wkst, 7) / 4)
            }
          } else {
            lnumweeks = -1
          }
          if (contains(rr.options.byweekno as number[], lnumweeks)) {
            for (let i = 0; i < no1wkst; i++) this.wnomask[i] = 1
          }
        }
      }
    }

    if (
      plb(rr.options.bynweekday) &&
      (month !== this.lastmonth || year !== this.lastyear)
    ) {
      let ranges: number[][] = []
      if (rr.options.freq === RRule.YEARLY) {
        if (plb(rr.options.bymonth) && rr.options.bymonth instanceof Array) {
          for (let j = 0; j < rr.options.bymonth.length; j++) {
            month = rr.options.bymonth[j]
            ranges.push(this.mrange.slice(month - 1, month + 1))
          }
        } else {
          ranges = [[0, this.yearlen]]
        }
      } else if (rr.options.freq === RRule.MONTHLY) {
        ranges = [this.mrange.slice(month - 1, month + 1)]
      }
      if (plb(ranges)) {
        // Weekly frequency won't get here, so we may not
        // care about cross-year weekly periods.
        this.nwdaymask = repeat(0, this.yearlen) as number[]

        for (let j = 0; j < ranges.length; j++) {
          const rang = ranges[j]
          const first = rang[0]
          let last = rang[1]
          last -= 1
          for (let k = 0; k < rr.options.bynweekday.length; k++) {
            let i
            const wday = rr.options.bynweekday[k][0]
            const n = rr.options.bynweekday[k][1]
            if (n < 0) {
              i = last + (n + 1) * 7
              i -= pymod((this.wdaymask[i]) - wday, 7)
            } else {
              i = first + (n - 1) * 7
              i += pymod(7 - (this.wdaymask[i]) + wday, 7)
            }
            if (first <= i && i <= last) this.nwdaymask[i] = 1
          }
        }
      }

      this.lastyear = year
      this.lastmonth = month
    }

    if (rr.options.byeaster !== null) {
      this.eastermask = this.easter(year, rr.options.byeaster)
    }
  }

  ydayset () {
    return [range(this.yearlen), 0, this.yearlen]
  }

  mdayset (_: any, month: number, __: any) {
    const set = repeat(null, this.yearlen)
    const start = this.mrange[month - 1]
    const end = this.mrange[month]
    for (let i = start; i < end; i++) set[i] = i
    return [set, start, end]
  }

  wdayset (year: number, month: number, day: number) {
    // We need to handle cross-year weeks here.
    const set = repeat(null, this.yearlen + 7)
    let i =
      dateutil.toOrdinal(new Date(year, month - 1, day)) - this.yearordinal
    const start = i
    for (let j = 0; j < 7; j++) {
      set[i] = i
      ++i
      if (this.wdaymask[i] === this.rrule.options.wkst) break
    }
    return [set, start, i]
  }

  ddayset (year: number, month: number, day: number) {
    const set = repeat(null, this.yearlen)
    const i =
      dateutil.toOrdinal(new Date(year, month - 1, day)) - this.yearordinal
    set[i] = i
    return [set, i, i + 1]
  }

  htimeset (hour: number, minute: number, second: number, millisecond: number) {
    const set = []
    const rr = this.rrule
    for (let i = 0; i < (rr.options.byminute as number[]).length; i++) {
      minute = (rr.options.byminute as number[])[i]
      for (let j = 0; j < (rr.options.bysecond as number[]).length; j++) {
        second = (rr.options.bysecond as number[])[j]
        set.push(new dateutil.Time(hour, minute, second, millisecond))
      }
    }
    dateutil.sort(set)
    return set
  }

  mtimeset (hour: number, minute: number, second: number, millisecond: number) {
    const set = []
    const rr = this.rrule
    for (let j = 0; j < (rr.options.bysecond as number[]).length; j++) {
      second = (rr.options.bysecond as number[])[j]
      set.push(new dateutil.Time(hour, minute, second, millisecond))
    }
    dateutil.sort(set)
    return set
  }

  stimeset (hour: number, minute: number, second: number, millisecond: number) {
    return [new dateutil.Time(hour, minute, second, millisecond)]
  }
}
