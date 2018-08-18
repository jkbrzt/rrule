import { Options, Frequency } from './types'
import { Weekday } from './weekday'
import dateutil from './dateutil'
import { Days } from './rrule'

export function parseString (rfcString: string): Partial<Options> {
  const options = rfcString.split('\n').map(parseLine).filter(x => x !== null)
  return { ...options[0], ...options[1] }
}

function parseDtstart (line: string) {
  const options: Partial<Options> = {}

  const dtstartWithZone = /^DTSTART(?:;TZID=([^:]+?))?:([^;]+)$/.exec(line)

  if (!dtstartWithZone) {
    return options
  }

  const [ _, tzid, dtstart ] = dtstartWithZone

  options.tzid = tzid
  options.dtstart = dateutil.untilStringToDate(dtstart)
  return options
}

function parseLine (rfcString: string) {
  rfcString = rfcString.replace(/^\s+|\s+$/, '')
  if (!rfcString.length) return null

  const header = /^([A-Z]+)[:;]/.exec(rfcString)
  if (!header) {
    return parseRrule(rfcString)
  }

  const [ _, key ] = header
  switch (key) {
    case 'RRULE':
      return parseRrule(rfcString)
    case 'DTSTART':
      return parseDtstart(rfcString)
    default:
      throw new Error(`Unsupported RFC prop ${key} in ${rfcString}`)
  }
}

function parseRrule (line: string) {
  const options: Partial<Options> = {}

  const attrs = line.replace(/^RRULE:/, '').split(';')

  attrs.forEach(attr => {
    const [ key, value ] = attr.split('=')
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
        const num = parseNumber(value)
        const optionKey = key.toLowerCase()
        // @ts-ignore
        options[optionKey] = num
        break
      case 'BYDAY': // => byweekday
        options.byweekday = parseWeekday(value)
        break
      case 'DTSTART':
        // for backwards compatibility
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
  })

  return options
}

function parseNumber (value: string) {
  if (value.indexOf(',') !== -1) {
    const values = value.split(',')
    return values.map(val => {
      if (/^[+-]?\d+$/.test(val.toString())) {
        return Number(val)
      } else {
        return val
      }
    })
  } else if (/^[+-]?\d+$/.test(value)) {
    return Number(value)
  }

  return value
}

function parseWeekday (value: string) {
  const days = value.split(',')

  return days.map(day => {
    if (day.length === 2) {
      // MO, TU, ...
      return Days[day as keyof typeof Days] // wday instanceof Weekday
    } else {
      // -1MO, +3FR, 1SO, ...
      const parts = day.match(/^([+-]?\d)([A-Z]{2})$/)!
      const n = Number(parts[1])
      const wdaypart = parts[2] as keyof typeof Days
      const wday = Days[wdaypart].weekday
      return new Weekday(wday, n)
    }
  })
}
