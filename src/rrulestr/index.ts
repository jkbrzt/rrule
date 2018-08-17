import RRule from '../rrule'
import RRuleSet from '../rruleset'
import dateutil from '../dateutil'
import { includes, split } from '../helpers'
import { handlers, handle_DTSTART, handle_TZID } from './handlers'
import { Options } from '../types'

export interface RRuleStrOptions {
  dtstart: Date | null
  cache: boolean
  unfold: boolean
  forceset: boolean
  compatible: boolean
  tzid: string | null
}

/**
 * RRuleStr
 *  To parse a set of rrule strings
 */
const DEFAULT_OPTIONS: RRuleStrOptions = {
  dtstart: null,
  cache: false,
  unfold: false,
  forceset: false,
  compatible: false,
  tzid: null
}

function _parseRfcRRule (line: string, options: Partial<RRuleStrOptions> = {}) {
  options.dtstart = options.dtstart || null
  options.cache = options.cache || false

  let name: string
  let value: string
  let parts: string[]
  const nameRegex = /^([A-Z]+):(.*)$/
  const nameParts = nameRegex.exec(line)
  if (nameParts && nameParts.length >= 3) {
    name = nameParts[1]
    value = nameParts[2]

    if (name !== 'RRULE') throw new Error(`unknown parameter name ${name}`)
  } else {
    value = line
  }

  const rrkwargs: Partial<Options> = {
    dtstart: handle_DTSTART(line),
    tzid: handle_TZID(line)
  }

  const pairs = value.split(';')

  for (let i = 0; i < pairs.length; i++) {
    parts = pairs[i].split('=')
    name = parts[0].toUpperCase()
    if (/DTSTART|TZID/.test(name)) {
      continue
    }

    value = parts[1].toUpperCase()

    const paramHandler = handlers[name as keyof typeof handlers]
    if (typeof paramHandler !== 'function') {
      throw new Error(`unknown parameter '${name}':${value}`)
    }

    if (name === 'BYDAY') name = 'BYWEEKDAY'
    rrkwargs[name.toLowerCase() as keyof typeof rrkwargs] = paramHandler(value)
  }

  rrkwargs.dtstart = rrkwargs.dtstart || options.dtstart
  rrkwargs.tzid = rrkwargs.tzid || options.tzid

  return new RRule(rrkwargs, !options.cache)
}

function _parseRfc (s: string, options: Partial<RRuleStrOptions>) {
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

  if (
    !options.forceset &&
    lines.length === 1 &&
    (s.indexOf(':') === -1 || s.indexOf('RRULE:') === 0)
  ) {
    return _parseRfcRRule(lines[0], {
      cache: options.cache,
      dtstart: options.dtstart
    })
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
        const [key, value] = parms[0].split('=')
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
          _parseRfcRRule(rrulevals[j], {
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
          _parseRfcRRule(exrulevals[j], {
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
  }

  return _parseRfcRRule(rrulevals[0], {
      // @ts-ignore
    dtstart: options.dtstart || dtstart,
    cache: options.cache,
      // @ts-ignore
    tzid: options.tzid || tzid
  })
}

export function rrulestr (s: string, options: Partial<RRuleStrOptions> = {}): RRule | RRuleSet {
  const invalid: string[] = []
  const keys = Object.keys(options) as (keyof typeof options)[]
  const defaultKeys = Object.keys(
      DEFAULT_OPTIONS
    ) as (keyof typeof DEFAULT_OPTIONS)[]

  keys.forEach(function (key) {
    if (!includes(defaultKeys, key)) invalid.push(key)
  })

  if (invalid.length) {
    throw new Error('Invalid options: ' + invalid.join(', '))
  }

    // Merge in default options
  defaultKeys.forEach(function (key) {
    if (!includes(keys, key)) options[key] = DEFAULT_OPTIONS[key]
  })

  return _parseRfc(s, options)
}
