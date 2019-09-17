import { Options, DateTimeProperty, DateTimeValue } from './types'
import RRule, { DEFAULT_OPTIONS } from './rrule'
import { includes, isPresent, isArray, isNumber, toArray } from './helpers'
import { Weekday } from './weekday'
import dateutil from './dateutil'
import { DateWithZone } from './datewithzone'

export function optionsToString (options: Partial<Options>) {
  let rrule: string[][] = []
  let dtstart: string = ''
  let dtend: string = ''
  const keys: (keyof Options)[] = Object.keys(options) as (keyof Options)[]
  const defaultKeys = Object.keys(DEFAULT_OPTIONS)

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === 'tzid') continue
    if (!includes(defaultKeys, keys[i])) continue

    let key = keys[i].toUpperCase()
    const value: any = options[keys[i]]
    let outValue: string = ''

    if (!isPresent(value) || (isArray(value) && !value.length)) continue

    switch (key) {
      case 'FREQ':
        outValue = RRule.FREQUENCIES[options.freq!]
        break
      case 'WKST':
        if (isNumber(value)) {
          outValue = new Weekday(value).toString()
        } else {
          outValue = value.toString()
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
        outValue = toArray<Weekday | number[] | number>(value).map(wday => {
          if (wday instanceof Weekday) {
            return wday
          }

          if (isArray(wday)) {
            return new Weekday(wday[0], wday[1])
          }

          return new Weekday(wday)
        }).toString()
        break

      case 'DTSTART':
        dtstart = formatDateTime(value, options, DateTimeProperty.START)
        break

      case 'DTEND':
        dtend = formatDateTime(value, options, DateTimeProperty.END)
        break

      case 'DTVALUE':
        break

      case 'UNTIL':
        /**
         * From [RFC 5545](https://tools.ietf.org/html/rfc5545):
         *
         * 3.3.10. Recurrence Rule
         *
         * The value of the UNTIL rule part MUST have the same value type as the
         * "DTSTART" property. Furthermore, if the "DTSTART" property is specified as
         * a date with local time, then the UNTIL rule part MUST also be specified as
         * a date with local time. If the "DTSTART" property is specified as a date
         * with UTC time or a date with local time and time zone reference, then the
         * UNTIL rule part MUST be specified as a date with UTC time.
         */
        if (options.dtvalue === DateTimeValue.DATE) {
          outValue = dateutil.toRfc5545Date(value)
        } else {
          outValue = dateutil.toRfc5545DateTime(value, !!options.tzid)
        }
        break

      default:
        if (isArray(value)) {
          const strValues: string[] = []
          for (let j = 0; j < value.length; j++) {
            strValues[j] = String(value[j])
          }
          outValue = strValues.toString()
        } else {
          outValue = String(value)
        }
    }

    if (outValue) {
      rrule.push([key, outValue])
    }
  }

  const rules = rrule.map(([key, value]) => `${key}=${value.toString()}`).join(';')
  let ruleString = ''
  if (rules !== '') {
    ruleString = `RRULE:${rules}`
  }

  return [ dtstart, dtend, ruleString ].filter(x => !!x).join('\n')
}

function formatDateTime (dt?: number, options: Partial<Options> = {}, prop = DateTimeProperty.START) {
  if (!dt) {
    return ''
  }
  let prefix = prop.toString()
  if (options.dtvalue) {
    prefix += ';VALUE=' + options.dtvalue.toString()
  }
  if (!options.tzid) {
    if (options.dtvalue === DateTimeValue.DATE) {
      return prefix + ':' + dateutil.toRfc5545Date(dt)
    } else {
      return prefix + ':' + dateutil.toRfc5545DateTime(dt, false)
    }
  }
  return prefix + new DateWithZone(new Date(dt), options.tzid).toString()
}
