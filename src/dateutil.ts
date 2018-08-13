import { divmod, pymod, empty, includes, padStart } from './helpers'

type Datelike = Pick<Date, 'getTime'>

/**
 * General date-related utilities.
 * Also handles several incompatibilities between JavaScript and Python
 *
 */
export namespace dateutil {
  export const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  /**
   * Number of milliseconds of one day
   */
  export const ONE_DAY = 1000 * 60 * 60 * 24

  /**
   * @see: <http://docs.python.org/library/datetime.html#datetime.MAXYEAR>
   */
  export const MAXYEAR = 9999

  /**
   * Python uses 1-Jan-1 as the base for calculating ordinals but we don't
   * want to confuse the JS engine with milliseconds > Number.MAX_NUMBER,
   * therefore we use 1-Jan-1970 instead
   */
  export const ORDINAL_BASE = new Date(Date.UTC(1970, 0, 1))

  /**
   * Python: MO-SU: 0 - 6
   * JS: SU-SAT 0 - 6
   */
  export const PY_WEEKDAYS = [6, 0, 1, 2, 3, 4, 5]

  /**
   * py_date.timetuple()[7]
   */
  export const getYearDay = function (date: Date) {
    const dateNoTime = new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
    return (
      Math.ceil(
        (dateNoTime.valueOf() -
          new Date(date.getUTCFullYear(), 0, 1).valueOf()) /
          ONE_DAY
      ) + 1
    )
  }

  export const isLeapYear = function (year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  }

  /**
   * @return {Number} the date's timezone offset in ms
   */
  export const tzOffset = function (date: Date) {
    return date.getTimezoneOffset() * 60 * 1000
  }

  /**
   * @see: <http://www.mcfedries.com/JavaScript/DaysBetween.asp>
   */
  export const daysBetween = function (date1: Date, date2: Date) {
    // The number of milliseconds in one day
    // Convert both dates to milliseconds
    const date1ms = date1.getTime() - tzOffset(date1)
    const date2ms = date2.getTime() - tzOffset(date2)
    // Calculate the difference in milliseconds
    const differencems = date1ms - date2ms
    // Convert back to days and return
    return Math.round(differencems / ONE_DAY)
  }

  /**
   * @see: <http://docs.python.org/library/datetime.html#datetime.date.toordinal>
   */
  export const toOrdinal = function (date: Date) {
    return daysBetween(date, ORDINAL_BASE)
  }

  /**
   * @see - <http://docs.python.org/library/datetime.html#datetime.date.fromordinal>
   */
  export const fromOrdinal = function (ordinal: number) {
    return new Date(ORDINAL_BASE.getTime() + ordinal * ONE_DAY)
  }

  export const getMonthDays = function (date: Date) {
    const month = date.getUTCMonth()
    return month === 1 && isLeapYear(date.getUTCFullYear())
      ? 29
      : MONTH_DAYS[month]
  }

  /**
   * @return {Number} python-like weekday
   */
  export const getWeekday = function (date: Date) {
    return PY_WEEKDAYS[date.getUTCDay()]
  }

  /**
   * @see: <http://docs.python.org/library/calendar.html#calendar.monthrange>
   */
  export const monthRange = function (year: number, month: number) {
    const date = new Date(Date.UTC(year, month, 1))
    return [getWeekday(date), getMonthDays(date)]
  }

  /**
   * @see: <http://docs.python.org/library/datetime.html#datetime.datetime.combine>
   */
  export const combine = function (date: Date, time: Date | Time) {
    time = time || date
    return new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds(),
        time.getMilliseconds()
      )
    )
  }

  export const clone = function (date: Date | Time) {
    const dolly = new Date(date.getTime())
    return dolly
  }

  export const cloneDates = function (dates: Date[] | Time[]) {
    const clones = []
    for (let i = 0; i < dates.length; i++) {
      clones.push(clone(dates[i]))
    }
    return clones
  }

  /**
   * Sorts an array of Date or dateutil.Time objects
   */
  export const sort = function<T extends Datelike>(dates: T[]) {
    dates.sort(function (a, b) {
      return a.getTime() - b.getTime()
    })
  }

  export const timeToUntilString = function (time: number) {
    let comp
    const date = new Date(time)
    return [
      padStart(date.getUTCFullYear().toString(), 4, '0'),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      'T',
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      'Z'
    ].map(value => value.toString())
      .map((value, i) => {
        return /[TZ]/.test(value) ?
          value :
          padStart(value, 2, '0')
      }).join('')
  }

  export const untilStringToDate = function (until: string) {
    const re = /^(\d{3,4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/
    const bits = re.exec(until)
    if (!bits) throw new Error(`Invalid UNTIL value: ${until}`)
    return new Date(
      Date.UTC(
        parseInt(bits[1], 10),
        parseInt(bits[2], 10) - 1,
        parseInt(bits[3], 10),
        parseInt(bits[5], 10) || 0,
        parseInt(bits[6], 10) || 0,
        parseInt(bits[7], 10) || 0
      )
    )
  }

  export class Time {
    public hour: number
    public minute: number
    public second: number
    public millisecond: number

    constructor (
      hour: number,
      minute: number,
      second: number,
      millisecond: number
    ) {
      this.hour = hour
      this.minute = minute
      this.second = second
      this.millisecond = millisecond || 0
    }

    getHours () {
      return this.hour
    }

    getMinutes () {
      return this.minute
    }

    getSeconds () {
      return this.second
    }

    getMilliseconds () {
      return this.millisecond
    }

    getTime () {
      return (
        (this.hour * 60 * 60 + this.minute * 60 + this.second) * 1000 +
        this.millisecond
      )
    }

  }

  export class DateTime extends Time {
    public day: number
    public month: number
    public year: number

    constructor (
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
      millisecond: number
    ) {
      super(hour, minute, second, millisecond)
      this.year = year
      this.month = month
      this.day = day
    }

    getWeekday () {
      return getWeekday(new Date(this.getTime()))
    }

    getTime () {
      return new Date(
        Date.UTC(
          this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond
        )
      ).getTime()
    }

    getDay () {
      return this.day
    }

    getMonth () {
      return this.month
    }

    getYear () {
      return this.year
    }

    public addYears (years: number) {
      this.year += years
    }

    public addMonths (months: number) {
      this.month += months
      if (this.month > 12) {
        const yearDiv = Math.floor(this.month / 12)
        const monthMod = pymod(this.month, 12)
        this.month = monthMod
        this.year += yearDiv
        if (this.month === 0) {
          this.month = 12
          --this.year
        }
      }
    }

    public addWeekly (days: number, wkst: number) {
      if (wkst > this.getWeekday()) {
        this.day += -(this.getWeekday() + 1 + (6 - wkst)) + days * 7
      } else {
        this.day += -(this.getWeekday() - wkst) + days * 7
      }

      this.fixDay()
    }

    public addDaily (days: number) {
      this.day += days
      this.fixDay()
    }

    public addHours (hours: number, filtered: boolean, byhour: number[]) {
      let fixday = false
      if (filtered) {
          // Jump to one iteration before next day
        this.hour += Math.floor((23 - this.hour) / hours) * hours
      }

      while (true) {
        this.hour += hours
        const { div: dayDiv, mod: hourMod } = divmod(this.hour, 24)
        if (dayDiv) {
          this.hour = hourMod
          this.addDaily(dayDiv)
          fixday = true
        }

        if (empty(byhour) || includes(byhour, this.hour)) break
      }

      return fixday
    }

    public addMinutes (minutes: number, filtered: boolean, byhour: number[], byminute: number[]) {
      let fixday = false
      if (filtered) {
            // Jump to one iteration before next day
        this.minute +=
              Math.floor((1439 - (this.hour * 60 + this.minute)) / minutes) * minutes
      }

      while (true) {
        this.minute += minutes
        const { div: hourDiv, mod: minuteMod } = divmod(this.minute, 60)
        if (hourDiv) {
          this.minute = minuteMod
          fixday = this.addHours(hourDiv, false, byhour)
        }

        if (
              (empty(byhour) || includes(byhour, this.hour)) &&
              (empty(byminute) || includes(byminute, this.minute))
            ) {
          break
        }
      }

      return fixday
    }

    public addSeconds (seconds: number, filtered: boolean, byhour: number[], byminute: number[], bysecond: number[]) {
      let fixday = false
      if (filtered) {
        // Jump to one iteration before next day
        this.second +=
          Math.floor(
            (86399 - (this.hour * 3600 + this.minute * 60 + this.second)) / seconds
          ) * seconds
      }

      while (true) {
        this.second += seconds
        const { div: minuteDiv, mod: secondMod } = divmod(this.second, 60)
        if (minuteDiv) {
          this.second = secondMod
          fixday = this.addMinutes(minuteDiv, false, byhour, byminute)
        }

        if (
          (empty(byhour) || includes(byhour, this.hour)) &&
          (empty(byminute) || includes(byminute, this.minute)) &&
          (empty(bysecond) || includes(bysecond, this.second))
        ) {
          break
        }
      }

      return fixday
    }

    public fixDay () {
      if (this.day <= 28) {
        return
      }

      let daysinmonth = monthRange(this.year, this.month - 1)[1]
      if (this.day <= daysinmonth) {
        return
      }

      while (this.day > daysinmonth) {
        this.day -= daysinmonth
        ++this.month
        if (this.month === 13) {
          this.month = 1
          ++this.year
          if (this.year > MAXYEAR) {
            return
          }
        }

        daysinmonth = monthRange(this.year, this.month - 1)[1]
      }
    }
  }
}

export default dateutil
