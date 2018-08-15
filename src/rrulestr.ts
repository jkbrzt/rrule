import RRule from './rrule'
import { Options, Frequency, WeekdayStr } from './types'
import RRuleSet from './rruleset'
import dateutil from './dateutil'
import Weekday from './weekday'
import { includes, split } from './helpers'

export interface RRuleStrOptions {
  dtstart: Date | null
  cache: boolean
  unfold: boolean
  forceset: boolean
  compatible: boolean
  tzid: string | null
}

type FreqKey = keyof typeof Frequency

/**
 * RRuleStr
 *  To parse a set of rrule strings
 */

export default class RRuleStr {
  // tslint:disable-next-line:variable-name
  private _handle_DTSTART (rrkwargs: Options, _: any, value: string, __: any) {
    console.log('HANDLE DTSTART')
    const parms = /^(;[^:]+):?(.*)/.exec(value)!
    rrkwargs['dtstart'] = dateutil.untilStringToDate(value)
    if (parms.length > 0) {
      const [ key, timezone ] = parms[0].split('=')
      if (key.toUpperCase() === 'TZID') {
        rrkwargs['tzid'] = timezone
      }
    }
  }

  // tslint:disable-next-line:variable-name
  private static _weekday_map = {
    MO: 0,
    TU: 1,
    WE: 2,
    TH: 3,
    FR: 4,
    SA: 5,
    SU: 6
  }

  // tslint:disable-next-line:variable-name
  private static _freq_map = {
    YEARLY: RRule.YEARLY,
    MONTHLY: RRule.MONTHLY,
    WEEKLY: RRule.WEEKLY,
    DAILY: RRule.DAILY,
    HOURLY: RRule.HOURLY,
    MINUTELY: RRule.MINUTELY,
    SECONDLY: RRule.SECONDLY
  }

  private static DEFAULT_OPTIONS: RRuleStrOptions = {
    dtstart: null,
    cache: false,
    unfold: false,
    forceset: false,
    compatible: false,
    tzid: null
  }

  private _handle_int (rrkwargs: Options, name: string, value: string) {
    // @ts-ignore
    rrkwargs[name.toLowerCase()] = parseInt(value, 10)
  }

  private _handle_int_list (rrkwargs: Options, name: string, value: string) {
    // @ts-ignore
    rrkwargs[name.toLowerCase()] = value.split(',').map(x => parseInt(x, 10))
  }

  private _handle_FREQ (rrkwargs: Options, _: any, value: FreqKey, __: any) {
    rrkwargs['freq'] = RRuleStr._freq_map[value]
  }

  private _handle_UNTIL (rrkwargs: Options, _: any, value: string, __: any) {
    try {
      rrkwargs['until'] = dateutil.untilStringToDate(value)
    } catch (error) {
      throw new Error('invalid until date')
    }
  }

  private _handle_WKST (rrkwargs: Options, _: any, value: WeekdayStr, __: any) {
    rrkwargs['wkst'] = RRuleStr._weekday_map[value]
  }

  private _handle_BYWEEKDAY (rrkwargs: Options, _: any, value: string, __: any) {
    // Two ways to specify this: +1MO or MO(+1)
    let splt: string[]
    let i: number
    let j: number
    let n: string | number | null
    let w: WeekdayStr
    let wday: string
    const l = []
    const wdays = value.split(',')

    for (i = 0; i < wdays.length; i++) {
      wday = wdays[i]
      if (wday.indexOf('(') > -1) {
        // If it's of the form TH(+1), etc.
        splt = wday.split('(')
        w = splt[0] as WeekdayStr
        n = parseInt(splt.slice(1, -1)[0], 10)
      } else {
        // # If it's of the form +1MO
        for (j = 0; j < wday.length; j++) {
          if ('+-0123456789'.indexOf(wday[j]) === -1) break
        }
        n = wday.slice(0, j) || null
        w = wday.slice(j) as WeekdayStr

        if (n) n = parseInt(n, 10)
      }

      const weekday = new Weekday(RRuleStr._weekday_map[w], n as number)
      l.push(weekday)
    }
    rrkwargs['byweekday'] = l
  }

  private _parseRfcRRule (line: string, options: Partial<RRuleStrOptions> = {}) {
    options.dtstart = options.dtstart || null
    options.cache = options.cache || false

    let name: string
    let value: string
    let parts: string[]
    if (line.indexOf(':') !== -1) {
      parts = line.split(':')
      name = parts[0]
      value = parts[1]

      if (name !== 'RRULE') throw new Error('unknown parameter name')
    } else {
      value = line
    }

    const rrkwargs: Partial<RRuleStrOptions> = {}
    const pairs = value.split(';')

    for (let i = 0; i < pairs.length; i++) {
      parts = pairs[i].split('=')
      name = parts[0].toUpperCase()
      value = parts[1].toUpperCase()

      try {
        // @ts-ignore
        this[`_handle_${name}`](rrkwargs, name, value)
      } catch (error) {
        throw new Error("unknown parameter '" + name + "':" + value)
      }
    }
    rrkwargs.dtstart = rrkwargs.dtstart || options.dtstart
    rrkwargs.tzid = rrkwargs.tzid || options.tzid
    return new RRule(rrkwargs, !options.cache)
  }

  private _parseRfc (s: string, options: Partial<RRuleStrOptions>) {
    if (options.compatible) {
      options.forceset = true
      options.unfold = true
    }

    s = s && s.trim()
    if (!s) throw new Error('Invalid empty string')

    let i = 0
    let line: string
    let lines: string[]

    // More info about 'unfold' option
    // Go head to http://www.ietf.org/rfc/rfc2445.txt
    if (options.unfold) {
      lines = s.split('\n')
      while (i < lines.length) {
        // TODO
        line = lines[i] = lines[i].replace(/\s+$/g, '')
        if (!line) {
          lines.splice(i, 1)
        } else if (i > 0 && line[0] === ' ') {
          lines[i - 1] += line.slice(1)
          lines.splice(i, 1)
        } else {
          i += 1
        }
      }
    } else {
      lines = s.split(/\s/)
    }

    const rrulevals = []
    const rdatevals = []
    const exrulevals = []
    const exdatevals = []
    let name: string
    let value: string
    let parts: string[]
    let dtstart: Date
    let tzid: string
    let rset: RRuleSet
    let j: number
    let k: number
    let datestrs: string[]
    let datestr: string

    if (
      !options.forceset &&
      lines.length === 1 &&
      (s.indexOf(':') === -1 || s.indexOf('RRULE:') === 0)
    ) {
      return this._parseRfcRRule(lines[0], {
        cache: options.cache,
        dtstart: options.dtstart
      })
    } else {
      for (let i = 0; i < lines.length; i++) {
        line = lines[i]
        if (!line) continue
        if (line.indexOf(':') === -1) {
          name = 'RRULE'
          value = line
        } else {
          parts = split(line, ':', 1)
          name = parts[0]
          value = parts[1]
        }
        let parms = name.split(';')
        if (!parms) throw new Error('empty property name')
        name = parms[0].toUpperCase()
        parms = parms.slice(1)

        if (name === 'RRULE') {
          for (j = 0; j < parms.length; j++) {
            const parm = parms[j]
            throw new Error('unsupported RRULE parm: ' + parm)
          }
          rrulevals.push(value)
        } else if (name === 'RDATE') {
          for (j = 0; j < parms.length; j++) {
            const parm = parms[j]
            if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
              throw new Error('unsupported RDATE parm: ' + parm)
            }
          }
          rdatevals.push(value)
        } else if (name === 'EXRULE') {
          for (j = 0; j < parms.length; j++) {
            const parm = parms[j]
            throw new Error('unsupported EXRULE parm: ' + parm)
          }
          exrulevals.push(value)
        } else if (name === 'EXDATE') {
          for (j = 0; j < parms.length; j++) {
            const parm = parms[j]
            if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
              throw new Error('unsupported EXDATE parm: ' + parm)
            }
          }
          exdatevals.push(value)
        } else if (name === 'DTSTART') {
          dtstart = dateutil.untilStringToDate(value)
          if (parms.length) {
            const [ key, value ] = parms[0].split('=')
            if (key === 'TZID') {
              tzid = value
            }
          }
        } else {
          throw new Error('unsupported property: ' + name)
        }
      }

      if (
        options.forceset ||
        rrulevals.length > 1 ||
        rdatevals.length ||
        exrulevals.length ||
        exdatevals.length
      ) {
        rset = new RRuleSet(!options.cache)
        for (j = 0; j < rrulevals.length; j++) {
          rset.rrule(
            this._parseRfcRRule(rrulevals[j], {
              // @ts-ignore
              dtstart: options.dtstart || dtstart
            })
          )
        }
        for (j = 0; j < rdatevals.length; j++) {
          datestrs = rdatevals[j].split(',')
          for (k = 0; k < datestrs.length; k++) {
            datestr = datestrs[k]
            rset.rdate(dateutil.untilStringToDate(datestr))
          }
        }
        for (j = 0; j < exrulevals.length; j++) {
          rset.exrule(
            this._parseRfcRRule(exrulevals[j], {
              // @ts-ignore
              dtstart: options.dtstart || dtstart
            })
          )
        }
        for (j = 0; j < exdatevals.length; j++) {
          datestrs = exdatevals[j].split(',')
          for (k = 0; k < datestrs.length; k++) {
            datestr = datestrs[k]
            rset.exdate(dateutil.untilStringToDate(datestr))
          }
        }

        // @ts-ignore
        if (options.compatible && options.dtstart) rset.rdate(dtstart)
        return rset
      } else {
        return this._parseRfcRRule(rrulevals[0], {
          // @ts-ignore
          dtstart: options.dtstart || dtstart,
          cache: options.cache,
          // @ts-ignore
          tzid: options.tzid || tzid
        })
      }
    }
  }

  parse (s: string, options: Partial<RRuleStrOptions> = {}): RRule | RRuleSet {
    const invalid: string[] = []
    const keys = Object.keys(options) as (keyof typeof options)[]
    const defaultKeys = Object.keys(
      RRuleStr.DEFAULT_OPTIONS
    ) as (keyof typeof RRuleStr.DEFAULT_OPTIONS)[]

    keys.forEach(function (key) {
      if (!includes(defaultKeys, key)) invalid.push(key)
    }, this)

    if (invalid.length) {
      throw new Error('Invalid options: ' + invalid.join(', '))
    }

    // Merge in default options
    defaultKeys.forEach(function (key) {
      if (!includes(keys, key)) options[key] = RRuleStr.DEFAULT_OPTIONS[key]
    })

    return this._parseRfc(s, options)
  }

  // tslint:disable:variable-name
  private _handle_BYDAY = this._handle_BYWEEKDAY
  private _handle_INTERVAL = this._handle_int
  private _handle_COUNT = this._handle_int
  private _handle_BYSETPOS = this._handle_int_list
  private _handle_BYMONTH = this._handle_int_list
  private _handle_BYMONTHDAY = this._handle_int_list
  private _handle_BYYEARDAY = this._handle_int_list
  private _handle_BYEASTER = this._handle_int_list
  private _handle_BYWEEKNO = this._handle_int_list
  private _handle_BYHOUR = this._handle_int_list
  private _handle_BYMINUTE = this._handle_int_list
  private _handle_BYSECOND = this._handle_int_list
  // tslint:enable:variable-name
}
