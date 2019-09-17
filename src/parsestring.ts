import { Options, Frequency, DateTimeProperty, DateTimeValue } from './types'
import { Weekday } from './weekday'
import dateutil from './dateutil'
import { Days } from './rrule'

export function parseString (rfcString: string): Partial<Options> {
  const options = rfcString.split('\n').map(parseLine).filter(x => x !== null)
  /**
   * From [RFC 5545](https://tools.ietf.org/html/rfc5545):
   *
   * 3.8.2.2. Date-Time End ("DTEND")
   *
   * The value type of this property MUST be the same as the "DTSTART" property, and its
   * value MUST be later in time than the value of the "DTSTART" property. Furthermore,
   * this property MUST be specified as a date with local time if and only if the
   * "DTSTART" property is also specified as a date with local time.
   */
  return options.reduce((acc: Partial<Options>, cur: Partial<Options>) => {
    let existing
    if (cur.dtstart) {
      if (acc.dtstart) {
        throw new Error('Invalid rule: DTSTART must occur only once')
      }
      if (acc.dtend && acc.dtend.valueOf() <= cur.dtstart.valueOf()) {
        throw new Error('Invalid rule: DTEND must be later than DTSTART')
      }
      existing = acc.dtend
    }
    if (cur.dtend) {
      if (acc.dtend) {
        throw new Error('Invalid rule: DTEND must occur only once')
      }
      if (acc.dtstart && acc.dtstart.valueOf() >= cur.dtend.valueOf()) {
        throw new Error('Invalid rule: DTEND must be later than DTSTART')
      }
      existing = acc.dtstart
    }
    if (existing && acc.dtvalue !== cur.dtvalue) {
      // Different value types.
      throw new Error('Invalid rule: DTSTART and DTEND must have the same value type')
    } else if (existing && acc.tzid !== cur.tzid) {
      // Different timezones.
      throw new Error('Invalid rule: DTSTART and DTEND must have the same timezone')
    }
    return Object.assign(acc, cur)
  }, {}) || {}
}

export function parseDateTime (line: string, prop = DateTimeProperty.START): Partial<Options> {
  const options: Partial<Options> = {}

  const dtWithZone = new RegExp(
    `${prop}(?:;TZID=([^:=]+?))?(?:;VALUE=(DATE|DATE-TIME))?(?::|=)([^;\\s]+)`, 'i'
  ).exec(line)

  if (!dtWithZone) {
    return options
  }

  const [ _, tzid, dtvalue, dt ] = dtWithZone

  if (tzid) {
    if (dt.endsWith('Z')) {
      throw new Error(`Invalid UTC date-time value with timezone: ${line}`)
    }
    options.tzid = tzid
  } else if (dt.endsWith('Z')) {
    options.tzid = 'UTC'
  }

  if (dtvalue === DateTimeValue.DATE) {
    if (prop === DateTimeProperty.START) {
      options.dtstart = dateutil.fromRfc5545Date(dt)
    } else {
      options.dtend = dateutil.fromRfc5545Date(dt)
    }
    options.dtvalue = DateTimeValue.DATE
    if (options.tzid) {
      throw new Error(`Invalid date value with timezone: ${line}`)
    }
  } else { // Default value type is DATE-TIME
    if (prop === DateTimeProperty.START) {
      options.dtstart = dateutil.fromRfc5545DateTime(dt)
    } else {
      options.dtend = dateutil.fromRfc5545DateTime(dt)
    }
    if (dtvalue) {
      options.dtvalue = DateTimeValue.DATE_TIME
    }
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
      return parseDateTime(rfcString, DateTimeProperty.START)
    case 'DTEND':
      return parseDateTime(rfcString, DateTimeProperty.END)
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
        const parsed = parseDateTime(line)
        options.tzid = parsed.tzid
        options.dtstart = parsed.dtstart
        if (parsed.dtvalue) {
          options.dtvalue = parsed.dtvalue
        }
        break
      case 'UNTIL':
        options.until = dateutil.fromRfc5545DateTime(value)
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
