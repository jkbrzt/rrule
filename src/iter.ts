import IterResult from './iterresult'
import { ParsedOptions, Frequency } from './types'
import dateutil from './dateutil'
import Iterinfo from './iterinfo'
import RRule from './rrule'
import { buildTimeset } from './parseoptions'
import { notEmpty, includes, pymod, isPresent } from './helpers'
import { DateWithZone } from './datewithzone'

export function iter (iterResult: IterResult, options: ParsedOptions) {
  const {
    dtstart,
    freq,
    until,
    bysetpos
  } = options

  let counterDate = dateutil.DateTime.fromDate(dtstart)

  const ii = new Iterinfo(options)
  ii.rebuild(counterDate.year, counterDate.month)

  let timeset = makeTimeset(ii, counterDate, options)

  let count = options.count

  while (true) {
    let [dayset, start, end] = ii.getdayset(freq)(
      counterDate.year,
      counterDate.month,
      counterDate.day
    )

    let filtered = removeFilteredDays(dayset, start, end, ii, options)

    if (notEmpty(bysetpos)) {
      const poslist = buildPoslist(bysetpos, timeset!, start, end, ii, dayset)

      for (let j = 0; j < poslist.length; j++) {
        const res = poslist[j]
        if (until && res > until) {
          return emitResult(iterResult)
        }

        if (res >= dtstart) {
          const rezonedDate = rezoneIfNeeded(res, options)
          if (!iterResult.accept(rezonedDate)) {
            return emitResult(iterResult)
          }

          if (count) {
            --count
            if (!count) {
              return emitResult(iterResult)
            }
          }
        }
      }
    } else {
      for (let j = start; j < end; j++) {
        const currentDay = dayset[j]
        if (!isPresent(currentDay)) {
          continue
        }

        const date = dateutil.fromOrdinal(ii.yearordinal + currentDay)
        for (let k = 0; k < timeset!.length; k++) {
          const time = timeset![k]
          const res = dateutil.combine(date, time)
          if (until && res > until) {
            return emitResult(iterResult)
          }

          if (res >= dtstart) {
            const rezonedDate = rezoneIfNeeded(res, options)
            if (!iterResult.accept(rezonedDate)) {
              return emitResult(iterResult)
            }

            if (count) {
              --count
              if (!count) {
                return emitResult(iterResult)
              }
            }
          }
        }
      }
    }

    // Handle frequency and interval
    addToCounter(options, ii, filtered, counterDate)

    if (!freqIsDailyOrGreater(freq)) {
      timeset = ii.gettimeset(freq)(counterDate.hour, counterDate.minute, counterDate.second, 0)
    }

    if (counterDate.year > dateutil.MAXYEAR) {
      return emitResult(iterResult)
    }

    ii.rebuild(counterDate.year, counterDate.month)
  }
}

function isFiltered (
  ii: Iterinfo,
  currentDay: number,
  options: ParsedOptions
): boolean {
  const {
    bymonth,
    byweekno,
    byweekday,
    byeaster,
    bymonthday,
    bynmonthday,
    byyearday
  } = options

  return (
    (notEmpty(bymonth) && !includes(bymonth, ii.mmask![currentDay])) ||
    (notEmpty(byweekno) && !ii.wnomask![currentDay]) ||
    (notEmpty(byweekday) && !includes(byweekday, ii.wdaymask![currentDay])) ||
    (notEmpty(ii.nwdaymask!) && !ii.nwdaymask![currentDay]) ||
    (byeaster !== null && !includes(ii.eastermask!, currentDay)) ||
    ((notEmpty(bymonthday) || notEmpty(bynmonthday)) &&
      !includes(bymonthday, ii.mdaymask![currentDay]) &&
      !includes(bynmonthday, ii.nmdaymask![currentDay])) ||
    (notEmpty(byyearday) &&
      ((currentDay < ii.yearlen &&
        !includes(byyearday, currentDay + 1) &&
        !includes(byyearday, -ii.yearlen + currentDay)) ||
        (currentDay >= ii.yearlen &&
          !includes(byyearday, currentDay + 1 - ii.yearlen) &&
          !includes(byyearday, -ii.nextyearlen + currentDay - ii.yearlen))))
  )
}

function rezoneIfNeeded (date: Date, options: ParsedOptions) {
  return new DateWithZone(date, options.tzid).rezonedDate()
}

function emitResult (iterResult: IterResult) {
  return iterResult.getValue() as Date[]
}

function removeFilteredDays (dayset: (number | null)[], start: number, end: number, ii: Iterinfo, options: ParsedOptions) {
  let filtered = false
  for (let dayCounter = start; dayCounter < end; dayCounter++) {
    let currentDay = dayset[dayCounter] as number

    filtered = isFiltered(
      ii,
      currentDay,
      options
    )

    if (filtered) dayset[currentDay] = null
  }

  return filtered
}

function freqIsDailyOrGreater (freq: Frequency): freq is Frequency.YEARLY | Frequency.MONTHLY | Frequency.WEEKLY | Frequency.DAILY {
  return freq < Frequency.HOURLY
}

function makeTimeset (ii: Iterinfo, counterDate: dateutil.DateTime, options: ParsedOptions): dateutil.Time[] | null {
  const {
    freq,
    byhour,
    byminute,
    bysecond
  } = options

  if (freqIsDailyOrGreater(freq)) {
    return buildTimeset(options)
  } else if (
    (freq >= RRule.HOURLY &&
      notEmpty(byhour) &&
      !includes(byhour, counterDate.hour)) ||
    (freq >= RRule.MINUTELY &&
      notEmpty(byminute) &&
      !includes(byminute, counterDate.minute)) ||
    (freq >= RRule.SECONDLY &&
      notEmpty(bysecond) &&
      !includes(bysecond, counterDate.second))
  ) {
    return []
  } else {
    return ii.gettimeset(freq)(
      counterDate.hour,
      counterDate.minute,
      counterDate.second,
      counterDate.millisecond
    )
  }
}

function addToCounter (options: ParsedOptions, ii: Iterinfo, filtered: boolean, counterDate: dateutil.DateTime) {
  const {
    freq,
    interval,
    wkst,
    byhour,
    byminute,
    bysecond
  } = options

  switch (freq) {
    case Frequency.YEARLY: return counterDate.addYears(interval)
    case Frequency.MONTHLY: return counterDate.addMonths(interval)
    case Frequency.WEEKLY: return counterDate.addWeekly(interval, wkst)
    case Frequency.DAILY: return counterDate.addDaily(interval)
    case Frequency.HOURLY: return counterDate.addHours(interval, filtered, byhour)
    case Frequency.MINUTELY: return counterDate.addMinutes(interval, filtered, byhour, byminute)
    case Frequency.SECONDLY: return counterDate.addSeconds(interval, filtered, byhour, byminute, bysecond)
  }
}

function buildPoslist (bysetpos: number[], timeset: dateutil.Time[], start: number, end: number, ii: Iterinfo, dayset: (number | null)[]) {
  const poslist: Date[] = []

  for (let j = 0; j < bysetpos.length; j++) {
    let daypos: number
    let timepos: number
    const pos = bysetpos[j]

    if (pos < 0) {
      daypos = Math.floor(pos / timeset.length)
      timepos = pymod(pos, timeset.length)
    } else {
      daypos = Math.floor((pos - 1) / timeset.length)
      timepos = pymod(pos - 1, timeset.length)
    }

    const tmp = []
    for (let k = start; k < end; k++) {
      const val = dayset[k]
      if (!isPresent(val)) continue
      tmp.push(val)
    }
    let i: number
    if (daypos < 0) {
      i = tmp.slice(daypos)[0]
    } else {
      i = tmp[daypos]
    }

    const time = timeset[timepos]
    const date = dateutil.fromOrdinal(ii.yearordinal + i)
    const res = dateutil.combine(date, time)
    // XXX: can this ever be in the array?
    // - compare the actual date instead?
    if (!includes(poslist, res)) poslist.push(res)
  }

  dateutil.sort(poslist)

  return poslist
}
