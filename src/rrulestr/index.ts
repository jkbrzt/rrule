import RRule from '../rrule'
import RRuleSet from '../rruleset'
import dateutil from '../dateutil'
import { includes, split, compact } from '../helpers'
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
  const nameRegex = /^([A-Z]+):(.*)$/
  const nameParts = nameRegex.exec(line)
  if (nameParts && nameParts.length >= 3) {
    name = nameParts[1]
    value = nameParts[2]

    if (name !== 'RRULE') throw new Error(`unknown parameter name ${name}`)
  } else {
    value = line
  }

  const rrkwargs: Partial<Options> = {}

  rrkwargs.dtstart = handle_DTSTART(line) || options.dtstart
  rrkwargs.tzid = handle_TZID(line) || options.tzid

  const pairs = value.split(';')

  for (let i = 0; i < pairs.length; i++) {
    const parts = pairs[i].split('=')
    name = parts[0].toUpperCase()
    if (/DTSTART|TZID/.test(name)) {
      continue
    }

    const value = parts[1].toUpperCase()

    const paramHandler = handlers[name as keyof typeof handlers]
    if (typeof paramHandler !== 'function') {
      throw new Error(`unknown parameter '${name}':${value}`)
    }

    if (name === 'BYDAY') name = 'BYWEEKDAY'
    rrkwargs[name.toLowerCase() as keyof typeof rrkwargs] = paramHandler(value)
  }

  rrkwargs.dtstart = rrkwargs.dtstart || options.dtstart
  rrkwargs.tzid = rrkwargs.tzid || options.tzid

  return new RRule(compact(rrkwargs), !options.cache)
}

function _parseRfc (s: string, options: Partial<RRuleStrOptions>) {
  if (options.compatible) {
    options.forceset = true
    options.unfold = true
  }

  const lines = splitIntoLines(s, options.unfold)

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

  const rrulevals: string[] = []
  const rdatevals: string[] = []
  const exrulevals: string[] = []
  const exdatevals: string[] = []

  let dtstart: Date
  let tzid: string

  lines.forEach(line => {
    if (!line) return
    const { name, parms, value } = breakDownLine(line)

    switch (name) {
      case 'RRULE':
        if (parms.length) {
          throw new Error(`unsupported RRULE parm: ${parms.join(',')}`)
        }

        rrulevals.push(value)
        break

      case 'RDATE':
        for (let j = 0; j < parms.length; j++) {
          const parm = parms[j]
          if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
            throw new Error('unsupported RDATE parm: ' + parm)
          }
        }

        rdatevals.push(value)
        break

      case 'EXRULE':
        if (parms.length) {
          throw new Error(`unsupported EXRULE parm: ${parms.join(',')}`)
        }

        exrulevals.push(value)
        break

      case 'EXDATE':
        for (let j = 0; j < parms.length; j++) {
          const parm = parms[j]
          if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
            throw new Error('unsupported EXDATE parm: ' + parm)
          }
        }

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
          dtstart: options.dtstart || dtstart
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
          dtstart: options.dtstart || dtstart
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
  if (unfold) {
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
  } else {
    return s.split(/\s/)
  }
}
