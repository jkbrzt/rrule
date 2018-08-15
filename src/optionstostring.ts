import { Options } from './types'
import RRule, { DEFAULT_OPTIONS } from './rrule'
import { includes, isPresent, isArray, isNumber, toArray } from './helpers'
import Weekday from './weekday'
import dateutil from './dateutil'

export function optionsToString (options: Partial<Options>) {
  const pairs: string[][] = []
  const keys: (keyof Options)[] = Object.keys(options) as (keyof Options)[]
  const defaultKeys = Object.keys(DEFAULT_OPTIONS)

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === 'tzid') continue
    if (!includes(defaultKeys, keys[i])) continue

    let key = keys[i].toUpperCase()
    const value: any = options[keys[i]]
    console.log('value', key, value)
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
        const arrayValue = toArray(value) as (Weekday | number[] | number)[]
        outValue = toArray<Weekday | number[] | number>(value).map(wday => {
          if (wday instanceof Weekday) {
            return wday
          } else if (isArray(wday)) {
            return new Weekday(wday[0], wday[1])
          } else {
            return new Weekday(wday)
          }
        }).toString()

        break
      case 'DTSTART':
      case 'UNTIL':
        outValue = dateutil.timeToUntilString(value, !options.tzid)
        if (options.tzid) {
          outValue = `;TZID=${options.tzid}:${outValue}`
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

    pairs.push([key, outValue])
  }

  const strings = []
  for (let i = 0; i < pairs.length; i++) {
    const [key, value] = pairs[i]
    if (value.indexOf(';') === 0) {
      strings.push(`${key}${value}`)
    } else {
      strings.push(`${key}=${value.toString()}`)
    }
  }
  return strings.join(';')
}
