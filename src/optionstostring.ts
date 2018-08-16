import { Options } from './types'
import RRule, { DEFAULT_OPTIONS } from './rrule'
import { includes, isPresent, isArray, isNumber } from './helpers'
import { Weekday } from './weekday'
import dateutil from './dateutil'

export function optionsToString (options: Partial<Options>) {
  const pairs = []
  const keys: (keyof Options)[] = Object.keys(options) as (keyof Options)[]
  const defaultKeys = Object.keys(DEFAULT_OPTIONS)

  for (let i = 0; i < keys.length; i++) {
    if (!includes(defaultKeys, keys[i])) continue

    let key = keys[i].toUpperCase()
    let value: any = options[keys[i]]
    let strValues = []

    if (!isPresent(value) || (isArray(value) && !value.length)) continue

    switch (key) {
      case 'FREQ':
        value = RRule.FREQUENCIES[options.freq!]
        break
      case 'WKST':
        if (isNumber(value)) {
          value = new Weekday(value)
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
        if (!isArray(value)) value = [value]

        for (let j = 0; j < value.length; j++) {
          let wday: Weekday | number[] | number = value[j]
          if (wday instanceof Weekday) {
              // good
          } else if (isArray(wday)) {
            wday = new Weekday(wday[0], wday[1])
          } else {
            wday = new Weekday(wday)
          }
          strValues[j] = wday.toString()
        }
        value = strValues
        break
      case 'DTSTART':
      case 'UNTIL':
        value = dateutil.timeToUntilString(value)
        break
      default:
        if (isArray(value)) {
          for (let j = 0; j < value.length; j++) {
            strValues[j] = String(value[j])
          }
          value = strValues
        } else {
          value = String(value)
        }
    }

    pairs.push([key, value])
  }

  const strings = []
  for (let i = 0; i < pairs.length; i++) {
    const attr = pairs[i]
    strings.push(attr[0] + '=' + attr[1].toString())
  }
  return strings.join(';')
}
