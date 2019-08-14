import { Options, Frequency } from './types'
import { Weekday } from './weekday'
import dateutil from './dateutil'
import { Days } from './rrule'

export function parseString (rfcString: string): Partial<Options> {
  const options = rfcString.split('\n').map(parseLine).filter(x => x !== null)
  return options.reduce((acc, cur) => Object.assign(acc, cur))
}

export function parseDateTime (line: string, end: boolean = false) {
  const options: Partial<Options> = {}

  const dtWithZone = end
    ? /DTEND(?:;TZID=([^:=]+?))?(?::|=)([^;\s]+)/i.exec(line)
    : /DTSTART(?:;TZID=([^:=]+?))?(?::|=)([^;\s]+)/i.exec(line)

  if (!dtWithZone) {
    return options
  }

  const [ _, tzid, dt ] = dtWithZone

  if (tzid) {
    options.tzid = tzid
  }
  if (end) {
    options.dtend = dateutil.untilStringToDate(dt)
  } else {
    options.dtstart = dateutil.untilStringToDate(dt)
  }
  return options
}

function parseLine (rfcString: string) {
  rfcString = rfcString.replace(/^\s+|\s+$/, '')
  if (!rfcString.length) return null

  const header = /^([A-Z]+?)[:;]/.exec(rfcString.toUpperCase())
  if (!header) {
    return parseRrule(rfcString)
  }

  const [ _, key ] = header
  switch (key.toUpperCase()) {
    case 'RRULE':
    case 'EXRULE':
      return parseRrule(rfcString)
    case 'DTSTART':
      return parseDateTime(rfcString)
    case 'DTEND':
      return parseDateTime(rfcString, true /* end */)
    default:
      throw new Error(`Unsupported RFC prop ${key} in ${rfcString}`)
  }
}

function parseRrule (line: string) {
  const strippedLine = line.replace(/^RRULE:/i, '')
  const options = parseDateTime(strippedLine)

  const attrs = line.replace(/^(?:RRULE|EXRULE):/i, '').split(';')

  attrs.forEach(attr => {
    const [ key, value ] = attr.split('=')
    switch (key.toUpperCase()) {
      case 'FREQ':
        options.freq = Frequency[value.toUpperCase() as keyof typeof Frequency]
        break
      case 'WKST':
        options.wkst = Days[value.toUpperCase() as keyof typeof Days]
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
      case 'BYWEEKDAY':
      case 'BYDAY':
        options.byweekday = parseWeekday(value)
        break
      case 'DTSTART':
      case 'TZID':
        // for backwards compatibility
        const dtstart = parseDateTime(line)
        options.tzid = dtstart.tzid
        options.dtstart = dtstart.dtstart
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
    return values.map(parseIndividualNumber)
  }

  return parseIndividualNumber(value)
}

function parseIndividualNumber (value: string) {
  if (/^[+-]?\d+$/.test(value)) {
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
    }

    // -1MO, +3FR, 1SO, 13TU ...
    const parts = day.match(/^([+-]?\d{1,2})([A-Z]{2})$/)!
    const n = Number(parts[1])
    const wdaypart = parts[2] as keyof typeof Days
    const wday = Days[wdaypart].weekday
    return new Weekday(wday, n)
  })
}
