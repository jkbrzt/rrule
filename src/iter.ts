import IterResult from './iterresult'
import { ParsedOptions, Frequency } from './types'
import dateutil from './dateutil'
import Iterinfo, { GetDayset, DaySet } from './iterinfo'
import RRule from './rrule'
import { buildTimeset } from './parseoptions'
import { notEmpty, includes, pymod, isPresent } from './helpers'
import { DateWithZone } from './datewithzone'

export function iter (iterResult: IterResult, options: ParsedOptions): Date | Date[] | null {
  /* Since JavaScript doesn't have the python's yield operator (<1.7),
      we use the IterResult object that tells us when to stop iterating.

  */

  // Some local variables to speed things up a bit
  const {
    dtstart,
    freq,
    interval,
    wkst,
    until,
    bymonth,
    byweekno,
    byyearday,
    byweekday,
    byeaster,
    bymonthday,
    bynmonthday,
    bysetpos,
    byhour,
    byminute,
    bysecond
  } = options

  let date = new dateutil.DateTime(
    dtstart.getUTCFullYear(),
    dtstart.getUTCMonth() + 1,
    dtstart.getUTCDate(),
    dtstart.getUTCHours(),
    dtstart.getUTCMinutes(),
    dtstart.getUTCSeconds(),
    dtstart.valueOf() % 1000
  )

  const ii = new Iterinfo(options)
  ii.rebuild(date.year, date.month)

  const getdayset = {
    [RRule.YEARLY]: ii.ydayset,
    [RRule.MONTHLY]: ii.mdayset,
    [RRule.WEEKLY]: ii.wdayset,
    [RRule.DAILY]: ii.ddayset,
    [RRule.HOURLY]: ii.ddayset,
    [RRule.MINUTELY]: ii.ddayset,
    [RRule.SECONDLY]: ii.ddayset
  }[freq] as GetDayset

  let timeset: dateutil.Time[] | null
  let gettimeset: () => typeof timeset
  if (freq < RRule.HOURLY) {
    timeset = buildTimeset(options)
  } else {
    gettimeset = {
      [RRule.HOURLY]: ii.htimeset,
      [RRule.MINUTELY]: ii.mtimeset,
      [RRule.SECONDLY]: ii.stimeset
    }[
      freq as Frequency.HOURLY | Frequency.MINUTELY | Frequency.SECONDLY
    ] as typeof gettimeset

    if (
      (freq >= RRule.HOURLY &&
        notEmpty(byhour) &&
        !includes(byhour, date.hour)) ||
      (freq >= RRule.MINUTELY &&
        notEmpty(byminute) &&
        !includes(byminute, date.minute)) ||
      (freq >= RRule.SECONDLY &&
        notEmpty(bysecond) &&
        !includes(bysecond, date.second))
    ) {
      timeset = []
    } else {
      timeset = gettimeset.call(
        ii,
        date.hour,
        date.minute,
        date.second,
        date.millisecond
      )
    }
  }

  let currentDay: number
  let count = options.count
  let pos: number

  while (true) {
    // Get dayset with the right frequency
    const [dayset, start, end] = getdayset.call(
      ii,
      date.year,
      date.month,
      date.day
    ) as DaySet

    // Do the "hard" work ;-)
    let filtered = false
    for (let dayCounter = start; dayCounter < end; dayCounter++) {
      currentDay = dayset[dayCounter] as number

      filtered = isFiltered(
        bymonth,
        ii,
        currentDay,
        byweekno,
        byweekday,
        byeaster,
        bymonthday,
        bynmonthday,
        byyearday
      )

      if (filtered) dayset[currentDay] = null
    }

    // Output results
    if (notEmpty(bysetpos) && notEmpty(timeset)) {
      let daypos: number
      let timepos: number
      const poslist: Date[] = []

      for (let j = 0; j < bysetpos.length; j++) {
        pos = bysetpos[j]

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
          // we're trying to emulate python's aList[-n]
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
        currentDay = dayset[j] as number
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
    if (freq === RRule.YEARLY) {
      date.addYears(interval)
    } else if (freq === RRule.MONTHLY) {
      date.addMonths(interval)
    } else if (freq === RRule.WEEKLY) {
      date.addWeekly(interval, wkst)
    } else if (freq === RRule.DAILY) {
      date.addDaily(interval)
    } else if (freq === RRule.HOURLY) {
      date.addHours(interval, filtered, byhour)

      // @ts-ignore
      timeset = gettimeset.call(ii, date.hour, date.minute, date.second)
    } else if (freq === RRule.MINUTELY) {
      if (date.addMinutes(interval, filtered, byhour, byminute)) {
        filtered = false
      }

      // @ts-ignore
      timeset = gettimeset.call(ii, date.hour, date.minute, date.second)
    } else if (freq === RRule.SECONDLY) {
      if (date.addSeconds(interval, filtered, byhour, byminute, bysecond)) {
        filtered = false
      }

      // @ts-ignore
      timeset = gettimeset.call(ii, date.hour, date.minute, date.second)
    }

    if (date.year > dateutil.MAXYEAR) {
      return emitResult(iterResult)
    }

    ii.rebuild(date.year, date.month)
  }
}

function isFiltered (
  bymonth: number[],
  ii: Iterinfo,
  currentDay: number,
  byweekno: number[],
  byweekday: number[],
  byeaster: number | null,
  bymonthday: number[],
  bynmonthday: number[],
  byyearday: number[]
): boolean {
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
