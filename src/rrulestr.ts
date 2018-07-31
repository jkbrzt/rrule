import RRule, { RRuleOrigOptions, Frequencies, DayKeys } from './rrule'
import RRuleSet from './rruleset'
import dateutil from './dateutil'
import Weekday from './weekday'
import { contains, split } from './helpers'

export interface RRuleStrOptions {
  dtstart: any
  cache: boolean
  unfold: boolean
  forceset: boolean
  compatible: boolean
  ignoretz: boolean
  tzinfos: any
}

type FreqKey = keyof typeof Frequencies

/**
 * RRuleStr
 *  To parse a set of rrule strings
 */

export default class RRuleStr {
  // tslint:disable-next-line:variable-name
  _handle_DTSTART (rrkwargs: RRuleOrigOptions, name: string, value: string, _: any) {
    // @ts-ignore
    rrkwargs[name.toLowerCase()] = dateutil.untilStringToDate(value)
  }

  // tslint:disable-next-line:variable-name
  static _weekday_map = {
    MO: 0,
    TU: 1,
    WE: 2,
    TH: 3,
    FR: 4,
    SA: 5,
    SU: 6
  }

  // tslint:disable-next-line:variable-name
  static _freq_map = {
    YEARLY: RRule.YEARLY,
    MONTHLY: RRule.MONTHLY,
    WEEKLY: RRule.WEEKLY,
    DAILY: RRule.DAILY,
    HOURLY: RRule.HOURLY,
    MINUTELY: RRule.MINUTELY,
    SECONDLY: RRule.SECONDLY
  }

  static DEFAULT_OPTIONS: RRuleStrOptions = {
    dtstart: null,
    cache: false,
    unfold: false,
    forceset: false,
    compatible: false,
    ignoretz: false,
    tzinfos: null
  }

  _handle_int (
    rrkwargs: RRuleOrigOptions,
    name: string,
    value: string
  ) {
    // @ts-ignore
    rrkwargs[name.toLowerCase()] = parseInt(value, 10)
  }

  _handle_int_list (
    rrkwargs: RRuleOrigOptions,
    name: string,
    value: string
  ) {
    // @ts-ignore
    rrkwargs[name.toLowerCase()] = value.split(',').map(x => parseInt(x, 10))
  }

  _handle_FREQ (rrkwargs: RRuleOrigOptions, _: any, value: FreqKey, __: any) {
    // eslint-disable-line
    rrkwargs['freq'] = RRuleStr._freq_map[value]
  }

  _handle_UNTIL (rrkwargs: RRuleOrigOptions, _: any, value: string, __: any) {
    // eslint-disable-line
    try {
      rrkwargs['until'] = dateutil.untilStringToDate(value)
    } catch (error) {
      throw new Error('invalid until date')
    }
  }

  _handle_WKST (rrkwargs: RRuleOrigOptions, _: any, value: DayKeys, __: any) {
    // eslint-disable-line
    rrkwargs['wkst'] = RRuleStr._weekday_map[value]
  }

  _handle_BYWEEKDAY (
    rrkwargs: RRuleOrigOptions,
    _: any,
    value: string,
    __: any
  ) {
    // Two ways to specify this: +1MO or MO(+1)
    let splt: string[]
    let i: number
    let j: number
    let n: string | number
    let w: DayKeys
    let wday: string
    const l = []
    const wdays = value.split(',')

    for (i = 0; i < wdays.length; i++) {
      wday = wdays[i]
      if (wday.indexOf('(') > -1) {
        // If it's of the form TH(+1), etc.
        splt = wday.split('(')
        w = splt[0] as DayKeys
        n = parseInt(splt.slice(1, -1)[0], 10)
      } else {
        // # If it's of the form +1MO
        for (j = 0; j < wday.length; j++) {
          if ('+-0123456789'.indexOf(wday[j]) === -1) break
        }
        n = wday.slice(0, j) || null
        w = wday.slice(j) as DayKeys

        if (n) n = parseInt(n, 10)
      }

      const weekday = new Weekday(RRuleStr._weekday_map[w], n as number)
      l.push(weekday)
    }
    rrkwargs['byweekday'] = l
  }

  _parseRfcRRule (
    line: any,
    options: Partial<RRuleStrOptions> = {}
  ) {
    options.dtstart = options.dtstart || null
    options.cache = options.cache || false
    options.ignoretz = options.ignoretz || false
    options.tzinfos = options.tzinfos || null

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
        this['_handle_' + name](rrkwargs, name, value, {
          ignoretz: options.ignoretz,
          tzinfos: options.tzinfos
        })
      } catch (error) {
        throw new Error("unknown parameter '" + name + "':" + value)
      }
    }
    rrkwargs.dtstart = rrkwargs.dtstart || options.dtstart
    return new RRule(rrkwargs, !options.cache)
  }

  _parseRfc (s: string, options: Partial<RRuleStrOptions>) {
    if (options.compatible) {
      options.forceset = true
      options.unfold = true
    }

    s = s && s.toUpperCase().trim()
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
    let parms: any
    let parm: any
    let dtstart: Date
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
        dtstart: options.dtstart,
        ignoretz: options.ignoretz,
        tzinfos: options.tzinfos
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
        parms = name.split(';')
        if (!parms) throw new Error('empty property name')
        name = parms[0]
        parms = parms.slice(1)

        if (name === 'RRULE') {
          for (j = 0; j < parms.length; j++) {
            parm = parms[j]
            throw new Error('unsupported RRULE parm: ' + parm)
          }
          rrulevals.push(value)
        } else if (name === 'RDATE') {
          for (j = 0; j < parms.length; j++) {
            parm = parms[j]
            if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
              throw new Error('unsupported RDATE parm: ' + parm)
            }
          }
          rdatevals.push(value)
        } else if (name === 'EXRULE') {
          for (j = 0; j < parms.length; j++) {
            parm = parms[j]
            throw new Error('unsupported EXRULE parm: ' + parm)
          }
          exrulevals.push(value)
        } else if (name === 'EXDATE') {
          for (j = 0; j < parms.length; j++) {
            parm = parms[j]
            if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
              throw new Error('unsupported EXDATE parm: ' + parm)
            }
          }
          exdatevals.push(value)
        } else if (name === 'DTSTART') {
          dtstart = dateutil.untilStringToDate(value)
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
              dtstart: options.dtstart || dtstart,
              ignoretz: options.ignoretz,
              tzinfos: options.tzinfos
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
              dtstart: options.dtstart || dtstart,
              ignoretz: options.ignoretz,
              tzinfos: options.tzinfos
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

        if (options.compatible && options.dtstart) rset.rdate(dtstart)
        return rset
      } else {
        return this._parseRfcRRule(rrulevals[0], {
          dtstart: options.dtstart || dtstart,
          cache: options.cache,
          ignoretz: options.ignoretz,
          tzinfos: options.tzinfos
        })
      }
    }
  }

  parse (s: string, options: Partial<RRuleStrOptions> = {}): RRule | RRuleSet {
    const invalid: any[] = []
    const keys = Object.keys(options)
    const defaultKeys = Object.keys(RRuleStr.DEFAULT_OPTIONS)

    keys.forEach(function (key) {
      if (!contains(defaultKeys, key)) invalid.push(key)
    }, this)

    if (invalid.length) {
      throw new Error('Invalid options: ' + invalid.join(', '))
    }

    // Merge in default options
    defaultKeys.forEach(function (key: keyof RRuleOrigOptions) {
      // @ts-ignore
      if (!contains(keys, key)) options[key] = RRuleStr.DEFAULT_OPTIONS[key]
    })

    return this._parseRfc(s, options)
  }

  // tslint:disable-next-line:variable-name
  _handle_BYDAY = this._handle_BYWEEKDAY

  // tslint:disable-next-line:variable-name
  _handle_INTERVAL = this._handle_int

  // tslint:disable-next-line:variable-name
  _handle_COUNT = this._handle_int

  // tslint:disable-next-line:variable-name
  _handle_BYSETPOS = this._handle_int_list

  // tslint:disable-next-line:variable-name
  _handle_BYMONTH = this._handle_int_list
  // tslint:disable-next-line:variable-name
  _handle_BYMONTHDAY = this._handle_int_list
  // tslint:disable-next-line:variable-name
  _handle_BYYEARDAY = this._handle_int_list
  // tslint:disable-next-line:variable-name
  _handle_BYEASTER = this._handle_int_list
  // tslint:disable-next-line:variable-name
  _handle_BYWEEKNO = this._handle_int_list
  // tslint:disable-next-line:variable-name
  _handle_BYHOUR = this._handle_int_list
  // tslint:disable-next-line:variable-name
  _handle_BYMINUTE = this._handle_int_list
  // tslint:disable-next-line:variable-name
  _handle_BYSECOND = this._handle_int_list
}
