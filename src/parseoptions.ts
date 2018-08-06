import { Options, ParsedOptions } from './types'
import { contains, notEmpty, isBlank } from './helpers'
import RRule, { defaultKeys, DEFAULT_OPTIONS } from './rrule'
import dateutil from './dateutil'
import Weekday from './weekday'

export function initializeOptions (options: Partial<Options>) {
  const invalid: string[] = []
  const keys = Object.keys(options) as (keyof Options)[]
  const initializedOptions: Partial<Options> = {}

  // Shallow copy for options and origOptions and check for invalid
  keys.forEach(key => {
    initializedOptions[key] = options[key]
    if (!contains(defaultKeys, key)) invalid.push(key)
  })

  if (invalid.length) {
    throw new Error('Invalid options: ' + invalid.join(', '))
  }

  return initializedOptions
}

export function parseOptions (options: Partial<Options>) {
  const opts: Partial<Options> = initializeOptions(options)
  const keys = Object.keys(options) as (keyof Options)[]

  // Merge in default options
  defaultKeys.forEach(key => {
    if (!contains(keys, key)) opts[key] = DEFAULT_OPTIONS[key]
  })

  if (!RRule.FREQUENCIES[opts.freq!] && isBlank(opts.byeaster)) {
    throw new Error('Invalid frequency: ' + String(opts.freq))
  }

  if (!isBlank(opts.byeaster)) opts.freq = RRule.YEARLY
  if (!opts.dtstart) opts.dtstart = new Date(new Date().setMilliseconds(0))

  const millisecondModulo = opts.dtstart.getTime() % 1000
  if (isBlank(opts.wkst)) {
    opts.wkst = RRule.MO.weekday
  } else if (typeof opts.wkst === 'number') {
    // cool, just keep it like that
  } else {
    opts.wkst = opts.wkst!.weekday
  }

  if (!isBlank(opts.bysetpos)) {
    if (typeof opts.bysetpos === 'number') opts.bysetpos = [opts.bysetpos]

    for (let i = 0; i < opts.bysetpos!.length; i++) {
      const v = opts.bysetpos![i]
      if (v === 0 || !(v >= -366 && v <= 366)) {
        throw new Error(
          'bysetpos must be between 1 and 366,' + ' or between -366 and -1'
        )
      }
    }
  }

  if (
    !(
      Boolean(opts.byweekno as number) ||
      notEmpty(opts.byweekno as number[]) ||
      notEmpty(opts.byyearday! as number[]) ||
      Boolean(opts.bymonthday) ||
      notEmpty(opts.bymonthday as number[]) ||
      opts.byweekday !== null ||
      opts.byeaster !== null
    )
  ) {
    switch (opts.freq) {
      case RRule.YEARLY:
        if (!opts.bymonth) opts.bymonth = opts.dtstart.getUTCMonth() + 1
        opts.bymonthday = opts.dtstart.getUTCDate()
        break
      case RRule.MONTHLY:
        opts.bymonthday = opts.dtstart.getUTCDate()
        break
      case RRule.WEEKLY:
        opts.byweekday = [dateutil.getWeekday(opts.dtstart)]
        break
    }
  }

  // bymonth
  if (!isBlank(opts.bymonth) && !(opts.bymonth instanceof Array)) {
    opts.bymonth = [opts.bymonth!]
  }
  // byyearday
  if (!isBlank(opts.byyearday) && !(opts.byyearday instanceof Array) && typeof opts.byyearday === 'number') {
    opts.byyearday = [opts.byyearday]
  }

  // bymonthday
  if (isBlank(opts.bymonthday)) {
    opts.bymonthday = []
    opts.bynmonthday = []
  } else if (opts.bymonthday instanceof Array) {
    const bymonthday = []
    const bynmonthday = []

    for (let i = 0; i < opts.bymonthday.length; i++) {
      const v = opts.bymonthday[i]
      if (v > 0) {
        bymonthday.push(v)
      } else if (v < 0) {
        bynmonthday.push(v)
      }
    }
    opts.bymonthday = bymonthday
    opts.bynmonthday = bynmonthday
  } else {
    if (opts.bymonthday! < 0) {
      opts.bynmonthday = [opts.bymonthday!]
      opts.bymonthday = []
    } else {
      opts.bynmonthday = []
      opts.bymonthday = [opts.bymonthday!]
    }
  }

  // byweekno
  if (!isBlank(opts.byweekno) && !(opts.byweekno instanceof Array)) {
    opts.byweekno = [opts.byweekno!]
  }

  // byweekday / bynweekday
  if (isBlank(opts.byweekday)) {
    opts.bynweekday = null
  } else if (typeof opts.byweekday === 'number') {
    opts.byweekday = [opts.byweekday]
    opts.bynweekday = null
  } else if (opts.byweekday instanceof Weekday) {
    if (!opts.byweekday.n || opts.freq! > RRule.MONTHLY) {
      opts.byweekday = [opts.byweekday.weekday]
      opts.bynweekday = null
    } else {
      opts.bynweekday = [[opts.byweekday.weekday, opts.byweekday.n]]
      opts.byweekday = null
    }
  } else {
    const byweekday = []
    const bynweekday = []

    for (let i = 0; i < opts.byweekday!.length; i++) {
      const wday = opts.byweekday![i]

      if (typeof wday === 'number') {
        byweekday.push(wday)
        continue
      }

      const wd = wday as Weekday
      if (!wd.n || opts.freq! > RRule.MONTHLY) {
        byweekday.push(wd.weekday)
      } else {
        bynweekday.push([wd.weekday, wd.n])
      }
    }
    opts.byweekday = notEmpty(byweekday) ? byweekday : null
    opts.bynweekday = notEmpty(bynweekday) ? bynweekday : null
  }

  // byhour
  if (isBlank(opts.byhour)) {
    opts.byhour = opts.freq! < RRule.HOURLY ? [opts.dtstart.getUTCHours()] : null
  } else if (typeof opts.byhour === 'number') {
    opts.byhour = [opts.byhour]
  }

  // byminute
  if (isBlank(opts.byminute)) {
    opts.byminute =
      opts.freq! < RRule.MINUTELY ? [opts.dtstart.getUTCMinutes()] : null
  } else if (typeof opts.byminute === 'number') {
    opts.byminute = [opts.byminute]
  }

  // bysecond
  if (isBlank(opts.bysecond)) {
    opts.bysecond =
      opts.freq! < RRule.SECONDLY ? [opts.dtstart.getUTCSeconds()] : null
  } else if (typeof opts.bysecond === 'number') {
    opts.bysecond = [opts.bysecond]
  }

  let timeset: dateutil.Time[] | null
  if (opts.freq! >= RRule.HOURLY) {
    timeset = null
  } else {
    timeset = []
    for (let i = 0; i < opts.byhour!.length; i++) {
      const hour = opts.byhour![i]
      for (let j = 0; j < opts.byminute!.length; j++) {
        const minute = opts.byminute![j]
        for (let k = 0; k < opts.bysecond!.length; k++) {
          const second = opts.bysecond![k]
          // python:
          // datetime.time(hour, minute, second,
          // tzinfo=self._tzinfo))
          timeset.push(
            new dateutil.Time(hour, minute, second, millisecondModulo)
          )
        }
      }
    }
    dateutil.sort(timeset)
  }

  return { parsedOptions: opts as ParsedOptions, timeset }
}
