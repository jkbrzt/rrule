import RRule from './rrule'
import RRuleSet from './rruleset'
import dateutil from './dateutil'
import { includes, split } from './helpers'
import { parseString } from './parsestring'

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

function _parseRfcRRuleOptions (line: string, options: Partial<RRuleStrOptions> = {}) {
  const parsedOptions = parseString(line)
  if (options.dtstart) {
    parsedOptions.dtstart = options.dtstart
  }

  if (options.tzid) {
    parsedOptions.tzid = options.tzid
  }

  return parsedOptions
}

function _parseRfcRRule (line: string, options: Partial<RRuleStrOptions>) {
  return new RRule(_parseRfcRRuleOptions(line, options))
}

function _parseRfc (s: string, options: Partial<RRuleStrOptions>) {
  if (options.compatible) {
    options.forceset = true
    options.unfold = true
  }

  const lines = splitIntoLines(s, options.unfold)

  const rrules = s.toUpperCase().match(/RRULE:/ig)
  if (
    !options.forceset &&
    !s.toUpperCase().match(/RDATE|EXDATE|EXRULE/ig) &&
    (!rrules || rrules.length === 1)
  ) {
    return _parseRfcRRule(lines.join('\n'), {
      cache: options.cache,
      dtstart: options.dtstart
    })
  }

  const rrulevals: string[] = []
  const rdatevals: string[] = []
  const exrulevals: string[] = []
  const exdatevals: string[] = []

  let dtstart: Date
  let tzid: string

  lines.forEach(line => {
    if (!line) return
    const { name, parms, value } = breakDownLine(line)

    switch (name.toUpperCase()) {
      case 'RRULE':
        if (parms.length) {
          throw new Error(`unsupported RRULE parm: ${parms.join(',')}`)
        }

        rrulevals.push(value)
        break

      case 'RDATE':
        validateDateParm(parms)
        rdatevals.push(value)
        break

      case 'EXRULE':
        if (parms.length) {
          throw new Error(`unsupported EXRULE parm: ${parms.join(',')}`)
        }

        exrulevals.push(value)
        break

      case 'EXDATE':
        validateDateParm(parms)
        exdatevals.push(value)
        break

      case 'DTSTART':
        dtstart = dateutil.untilStringToDate(value)
        if (parms.length) {
          const [key, value] = parms[0].split('=')
          if (key === 'TZID') {
            tzid = value
          }
        }
        break

      default:
        throw new Error('unsupported property: ' + name)
    }
  })

  if (
    options.forceset ||
    rrulevals.length > 1 ||
    rdatevals.length ||
    exrulevals.length ||
    exdatevals.length
  ) {
    const rset = new RRuleSet(!options.cache)
    rrulevals.forEach(val => {
      rset.rrule(
        _parseRfcRRule(val, {
          dtstart: options.dtstart || dtstart,
          tzid: options.tzid || tzid
        })
      )
    })

    rdatevals.forEach(dates => {
      dates.split(',').forEach(datestr => {
        rset.rdate(dateutil.untilStringToDate(datestr))
      })
    })

    exrulevals.forEach(val => {
      rset.exrule(
        _parseRfcRRule(val, {
          dtstart: options.dtstart || dtstart,
          tzid: options.tzid || tzid
        })
      )
    })

    exdatevals.forEach(dates => {
      dates.split(',').forEach(datestr => {
        rset.exdate(dateutil.untilStringToDate(datestr))
      })
    })

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

export function rrulestr (
  s: string,
  options: Partial<RRuleStrOptions> = {}
): RRule | RRuleSet {
  return _parseRfc(s, initializeOptions(options))
}

function initializeOptions (options: Partial<RRuleStrOptions>) {
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

  const initializedOptions = { ...options }

  // Merge in default options
  defaultKeys.forEach(function (key) {
    if (!includes(keys, key)) initializedOptions[key] = DEFAULT_OPTIONS[key]
  })

  return initializedOptions
}

function extractName (line: string) {
  if (line.indexOf(':') === -1) {
    return {
      name: 'RRULE',
      value: line
    }
  }

  const [name, value] = split(line, ':', 1)
  return {
    name,
    value
  }
}

function breakDownLine (line: string) {
  const { name, value } = extractName(line)
  let parms = name.split(';')
  if (!parms) throw new Error('empty property name')

  return {
    name: parms[0].toUpperCase(),
    parms: parms.slice(1),
    value
  }
}

function splitIntoLines (s: string, unfold = false) {
  s = s && s.trim()
  if (!s) throw new Error('Invalid empty string')

  // More info about 'unfold' option
  // Go head to http://www.ietf.org/rfc/rfc2445.txt
  if (!unfold) {
    return s.split(/\s/)
  }

  const lines = s.split('\n')
  let i = 0
  while (i < lines.length) {
    // TODO
    const line = (lines[i] = lines[i].replace(/\s+$/g, ''))
    if (!line) {
      lines.splice(i, 1)
    } else if (i > 0 && line[0] === ' ') {
      lines[i - 1] += line.slice(1)
      lines.splice(i, 1)
    } else {
      i += 1
    }
  }

  return lines
}

function validateDateParm (parms: string[]) {
  for (let j = 0; j < parms.length; j++) {
    const parm = parms[j]
    if (!/(VALUE=DATE-TIME)|(VALUE=DATE)|(TZID=)/.test(parm)) {
      throw new Error('unsupported RDATE/EXDATE parm: ' + parm)
    }
  }
}
