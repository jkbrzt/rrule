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
  export const ORDINAL_BASE = new Date(1970, 0, 1)

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
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )
    return (
      Math.ceil(
        (dateNoTime.valueOf() - new Date(date.getFullYear(), 0, 1).valueOf()) /
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
    const millisecsFromBase = ordinal * ONE_DAY
    return new Date(
      ORDINAL_BASE.getTime() -
        tzOffset(ORDINAL_BASE) +
        millisecsFromBase +
        tzOffset(new Date(millisecsFromBase))
    )
  }

  export const getMonthDays = function (date: Date) {
    const month = date.getMonth()
    return month === 1 && isLeapYear(date.getFullYear())
      ? 29
      : MONTH_DAYS[month]
  }

  /**
   * @return {Number} python-like weekday
   */
  export const getWeekday = function (date: Date) {
    return PY_WEEKDAYS[date.getDay()]
  }

  /**
   * @see: <http://docs.python.org/library/calendar.html#calendar.monthrange>
   */
  export const monthRange = function (year: number, month: number) {
    const date = new Date(year, month, 1)
    return [getWeekday(date), getMonthDays(date)]
  }

  /**
   * @see: <http://docs.python.org/library/datetime.html#datetime.datetime.combine>
   */
  export const combine = function (date: Date, time: Date | Time) {
    time = time || date
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
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
    const comps = [
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      'T',
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      'Z'
    ]

    for (let i = 0; i < comps.length; i++) {
      comp = comps[i]
      if (!/[TZ]/.test(comp.toString()) && comp < 10) {
        comps[i] = '0' + String(comp)
      }
    }
    return comps.join('')
  }

  export const untilStringToDate = function (until: string) {
    const re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/
    const bits = re.exec(until)
    if (!bits) throw new Error('Invalid UNTIL value: ' + until)
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
    private hour: number
    private minute: number
    private second: number
    private millisecond: number

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
}

export default dateutil
