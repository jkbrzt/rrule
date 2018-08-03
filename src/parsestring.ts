import { Options, Frequency, Days } from './types'
import Weekday from './weekday'
import dateutil from './dateutil'

export function parseString (rfcString: string) {
  rfcString = rfcString.replace(/^\s+|\s+$/, '')
  if (!rfcString.length) return null

  const attrs = rfcString.split(';')
  const options: Partial<Options> = {}

  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i].split('=')
    const key = attr[0]
    const value = attr[1]
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
        let num: number | string | (number | string)[]
        if (value.indexOf(',') !== -1) {
          const values = value.split(',')
          num = values.map(val => {
            if (/^[+-]?\d+$/.test(val.toString())) {
              return Number(val)
            } else {
              return val
            }
          })
        } else if (/^[+-]?\d+$/.test(value)) {
          num = Number(value)
        } else {
          num = value
        }
        const optionKey = key.toLowerCase()
        // @ts-ignore
        options[optionKey] = num
        break
      case 'BYDAY': // => byweekday
        let n: number
        let wday: Weekday | number
        let day: string
        const days = value.split(',')

        options.byweekday = []
        for (let j = 0; j < days.length; j++) {
          day = days[j]
          if (day.length === 2) {
            // MO, TU, ...
            wday = Days[day as keyof typeof Days] // wday instanceof Weekday
            options.byweekday.push(wday)
          } else {
            // -1MO, +3FR, 1SO, ...
            const parts = day.match(/^([+-]?\d)([A-Z]{2})$/)
            n = Number(parts[1])
            const wdaypart = parts[2] as keyof typeof Days
            wday = Days[wdaypart].weekday
            options.byweekday.push(new Weekday(wday, n))
          }
        }
        break
      case 'DTSTART':
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
  }
  return options
}
