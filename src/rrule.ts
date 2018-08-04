import Weekday from './weekday'
import dateutil from './dateutil'
import Iterinfo, { GetDayset, DaySet } from './iterinfo'
import { pymod, divmod, notEmpty, contains } from './helpers'

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

interface ParsedOptions {
  freq: Frequency
  dtstart: Date
  interval: number
  wkst: number
  count: number
  until: Date
  bysetpos: number[]
  bymonth: number[]
  bymonthday: number[]
  bynmonthday: number[]
  byyearday: number[]
  byweekno: number[]
  byweekday: number[]
  bynweekday: number[][]
  byhour: number[]
  byminute: number[]
  bysecond: number[]
  byeaster: number
}

type CacheKeys = 'before' | 'after' | 'between'
type CacheBase = { [K in CacheKeys]: IterArgs[] }
export type Cache = CacheBase & { all: Date[] | Partial<IterArgs>[] | false }

const Days = {
  MO: new Weekday(0),
  TU: new Weekday(1),
  WE: new Weekday(2),
  TH: new Weekday(3),
  FR: new Weekday(4),
  SA: new Weekday(5),
  SU: new Weekday(6)
}

export type WeekdayStr = keyof typeof Days
export type ByWeekday = WeekdayStr | number | Weekday

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
  public timeset: dateutil.Time[]
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
  private defaultKeys = Object.keys(RRule.DEFAULT_OPTIONS) as (keyof Options)[]

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
    this.origOptions = this.initializeOptions(options)
    this.options = this.parseOptions(options)
  }

  private initializeOptions (options: Partial<Options>) {
    const invalid: string[] = []
    const keys = Object.keys(options) as (keyof Options)[]
    const initializedOptions: Partial<Options> = {}

    // Shallow copy for options and origOptions and check for invalid
    keys.forEach(key => {
      initializedOptions[key] = options[key]
      if (!contains(this.defaultKeys, key)) invalid.push(key)
    })

    if (invalid.length) {
      throw new Error('Invalid options: ' + invalid.join(', '))
    }

    return initializedOptions
  }

  private parseOptions (options: Partial<Options>): ParsedOptions {
    const opts: Partial<Options> = this.initializeOptions(options)
    const keys = Object.keys(options) as (keyof Options)[]

    if (!RRule.FREQUENCIES[options.freq] && options.byeaster === null) {
      throw new Error('Invalid frequency: ' + String(options.freq))
    }

    // Merge in default options
    this.defaultKeys.forEach(key => {
      if (!contains(keys, key)) opts[key] = RRule.DEFAULT_OPTIONS[key]
    })

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

    if (opts.bysetpos !== null) {
      if (typeof opts.bysetpos === 'number') opts.bysetpos = [opts.bysetpos]

      for (let i = 0; i < opts.bysetpos.length; i++) {
        const v = opts.bysetpos[i]
        if (v === 0 || !(v >= -366 && v <= 366)) {
          throw new Error(
            'bysetpos must be between 1 and 366,' + ' or between -366 and -1'
          )
        }
      }
    }

    if (
      !(
        Boolean(opts.byweekno as number) ||
        notEmpty(opts.byweekno as number[]) ||
        notEmpty(opts.byyearday) ||
        Boolean(opts.bymonthday) ||
        notEmpty(opts.bymonthday as number[]) ||
        opts.byweekday !== null ||
        opts.byeaster !== null
      )
    ) {
      switch (opts.freq) {
        case RRule.YEARLY:
          if (!opts.bymonth) opts.bymonth = opts.dtstart.getUTCMonth() + 1
          opts.bymonthday = opts.dtstart.getUTCDate()
          break
        case RRule.MONTHLY:
          opts.bymonthday = opts.dtstart.getUTCDate()
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
        const v = opts.bymonthday[i]
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
      opts.byweekday = notEmpty(byweekday) ? byweekday : null
      opts.bynweekday = notEmpty(bynweekday) ? bynweekday : null
    }

    // byhour
    if (opts.byhour === null) {
      opts.byhour = opts.freq < RRule.HOURLY ? [opts.dtstart.getUTCHours()] : null
    } else if (typeof opts.byhour === 'number') {
      opts.byhour = [opts.byhour]
    }

    // byminute
    if (opts.byminute === null) {
      opts.byminute =
        opts.freq < RRule.MINUTELY ? [opts.dtstart.getUTCMinutes()] : null
    } else if (typeof opts.byminute === 'number') {
      opts.byminute = [opts.byminute]
    }

    // bysecond
    if (opts.bysecond === null) {
      opts.bysecond =
        opts.freq < RRule.SECONDLY ? [opts.dtstart.getUTCSeconds()] : null
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

    return opts as ParsedOptions
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

    const attrs = rfcString.split(';')
    const options: Partial<Options> = {}

    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i].split('=')
      const key = attr[0]
      const value = attr[1]
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
          let num: number | string | (number | string)[]
          if (value.indexOf(',') !== -1) {
            const values = value.split(',')
            num = values.map(val => {
              if (/^[+-]?\d+$/.test(val.toString())) {
                return Number(val)
              } else {
                return val
              }
            })
          } else if (/^[+-]?\d+$/.test(value)) {
            num = Number(value)
          } else {
            num = value
          }
          const optionKey = key.toLowerCase()
          // @ts-ignore
          options[optionKey] = num
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
        currentDay = dayset[dayCounter]

        filtered =
          (notEmpty(bymonth) && !contains(bymonth, ii.mmask[currentDay])) ||
          (notEmpty(byweekno) && !ii.wnomask[currentDay]) ||
          (notEmpty(byweekday) &&
            !contains(byweekday, ii.wdaymask[currentDay])) ||
          (notEmpty(ii.nwdaymask) && !ii.nwdaymask[currentDay]) ||
          (byeaster !== null && !contains(ii.eastermask, currentDay)) ||
          ((notEmpty(bymonthday) || notEmpty(bynmonthday)) &&
            !contains(bymonthday, ii.mdaymask[currentDay]) &&
            !contains(bynmonthday, ii.nmdaymask[currentDay])) ||
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

        for (let j = 0; j < (bysetpos).length; j++) {
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
          currentDay = dayset[j]
          if (currentDay !== null) {
            const date = dateutil.fromOrdinal(ii.yearordinal + currentDay)
            for (let k = 0; k < timeset.length; k++) {
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
