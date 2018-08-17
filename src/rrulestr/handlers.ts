import { Frequency, ByWeekday } from '../types'
import dateutil from '../dateutil'
import { WeekdayStr, Weekday } from '../weekday'
import { Days } from '../rrule'

type FreqKey = keyof typeof Frequency

// tslint:disable-next-line:variable-name
const weekdays = {
  MO: 0,
  TU: 1,
  WE: 2,
  TH: 3,
  FR: 4,
  SA: 5,
  SU: 6
}

type Handler = (value: string | FreqKey | WeekdayStr) => string | Date | number | number[] | undefined | ByWeekday | ByWeekday[]

export function handle_DTSTART (
  value: string
) {
  const parms = /^DTSTART(?:;TZID=([^:=]+))?(?::|=)(.*)/.exec(value)!
  const [ __, ___, dtstart ] = parms
  return dateutil.untilStringToDate(dtstart)
}

export function handle_TZID (
  value: string
) {
  const parms = /^DTSTART(?:;TZID=([^:=]+))?(?::|=)(.*)/.exec(value)!
  const [ __, tzid ] = parms
  if (tzid) {
    return tzid
  }
}

export function handle_int (value: string) {
  return parseInt(value, 10)
}

export function handle_int_list (value: string) {
  return value.split(',').map(x => parseInt(x, 10))
}

export function handle_FREQ (value: FreqKey) {
  return Frequency[value]
}

export function handle_UNTIL (value: string) {
  return dateutil.untilStringToDate(value)
}

export function handle_WKST (value: WeekdayStr) {
  return Days[value]
}

export function handle_BYWEEKDAY (value: string) {
  return value.split(',').map(wday => {
    let n: string | number | null
    let w: WeekdayStr

    // Two ways to specify this: +1MO or MO(+1)
    if (wday.indexOf('(') > -1) {
      // If it's of the form TH(+1), etc.
      const splt = wday.split('(')
      w = splt[0] as WeekdayStr
      n = parseInt(splt.slice(1, -1)[0], 10)
    } else {
      let j: number
      // # If it's of the form +1MO
      for (j = 0; j < wday.length; j++) {
        if ('+-0123456789'.indexOf(wday[j]) === -1) break
      }
      n = wday.slice(0, j) || null
      w = wday.slice(j) as WeekdayStr

      if (n) n = parseInt(n, 10)
    }

    return new Weekday(weekdays[w], n as number)
  })
}

export const handlers = {
  BYDAY: handle_BYWEEKDAY,
  INTERVAL: handle_int,
  COUNT: handle_int,
  FREQ: handle_FREQ,
  UNTIL: handle_UNTIL,
  WKST: handle_WKST,
  BYSETPOS: handle_int_list,
  BYMONTH: handle_int_list,
  BYWEEKDAY: handle_BYWEEKDAY,
  BYMONTHDAY: handle_int_list,
  BYYEARDAY: handle_int_list,
  BYEASTER: handle_int_list,
  BYWEEKNO: handle_int_list,
  BYHOUR: handle_int_list,
  BYMINUTE: handle_int_list,
  BYSECOND: handle_int_list
} as { [key: string]: Handler }
