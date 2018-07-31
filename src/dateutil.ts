type Datelike = Pick<Date, "getTime">;

export class Time {
  private hour: number;
  private minute: number;
  private second: number;
  private millisecond: number;

  constructor(
    hour: number,
    minute: number,
    second: number,
    millisecond: number
  ) {
    this.hour = hour;
    this.minute = minute;
    this.second = second;
    this.millisecond = millisecond || 0;
  }

  getHours() {
    return this.hour;
  }

  getMinutes() {
    return this.minute;
  }

  getSeconds() {
    return this.second;
  }

  getMilliseconds() {
    return this.millisecond;
  }

  getTime() {
    return (
      (this.hour * 60 * 60 + this.minute * 60 + this.second) * 1000 +
      this.millisecond
    );
  }
}

/**
 * General date-related utilities.
 * Also handles several incompatibilities between JavaScript and Python
 *
 */
const dateutil = {
  MONTH_DAYS: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

  /**
   * Number of milliseconds of one day
   */
  ONE_DAY: 1000 * 60 * 60 * 24,

  /**
   * @see: <http://docs.python.org/library/datetime.html#datetime.MAXYEAR>
   */
  MAXYEAR: 9999,

  /**
   * Python uses 1-Jan-1 as the base for calculating ordinals but we don't
   * want to confuse the JS engine with milliseconds > Number.MAX_NUMBER,
   * therefore we use 1-Jan-1970 instead
   */
  ORDINAL_BASE: new Date(1970, 0, 1),

  /**
   * Python: MO-SU: 0 - 6
   * JS: SU-SAT 0 - 6
   */
  PY_WEEKDAYS: [6, 0, 1, 2, 3, 4, 5],

  /**
   * py_date.timetuple()[7]
   */
  getYearDay: function(date: Date) {
    const dateNoTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return (
      Math.ceil(
        (dateNoTime.valueOf() - new Date(date.getFullYear(), 0, 1).valueOf()) /
          dateutil.ONE_DAY
      ) + 1
    );
  },

  isLeapYear: function(year: number) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  },

  /**
   * @return {Number} the date's timezone offset in ms
   */
  tzOffset: function(date: Date) {
    return date.getTimezoneOffset() * 60 * 1000;
  },

  /**
   * @see: <http://www.mcfedries.com/JavaScript/DaysBetween.asp>
   */
  daysBetween: function(date1: Date, date2: Date) {
    // The number of milliseconds in one day
    // Convert both dates to milliseconds
    const date1ms = date1.getTime() - dateutil.tzOffset(date1);
    const date2ms = date2.getTime() - dateutil.tzOffset(date2);
    // Calculate the difference in milliseconds
    const differencems = date1ms - date2ms;
    // Convert back to days and return
    return Math.round(differencems / dateutil.ONE_DAY);
  },

  /**
   * @see: <http://docs.python.org/library/datetime.html#datetime.date.toordinal>
   */
  toOrdinal: function(date: Date) {
    return dateutil.daysBetween(date, dateutil.ORDINAL_BASE);
  },

  /**
   * @see - <http://docs.python.org/library/datetime.html#datetime.date.fromordinal>
   */
  fromOrdinal: function(ordinal: number) {
    const millisecsFromBase = ordinal * dateutil.ONE_DAY;
    return new Date(
      dateutil.ORDINAL_BASE.getTime() -
        dateutil.tzOffset(dateutil.ORDINAL_BASE) +
        millisecsFromBase +
        dateutil.tzOffset(new Date(millisecsFromBase))
    );
  },

  /**
   * @see: <http://docs.python.org/library/calendar.html#calendar.monthrange>
   */
  monthRange: function(year: number, month: number) {
    const date = new Date(year, month, 1);
    return [dateutil.getWeekday(date), dateutil.getMonthDays(date)];
  },

  getMonthDays: function(date: Date) {
    const month = date.getMonth();
    return month === 1 && dateutil.isLeapYear(date.getFullYear())
      ? 29
      : dateutil.MONTH_DAYS[month];
  },

  /**
   * @return {Number} python-like weekday
   */
  getWeekday: function(date: Date) {
    return dateutil.PY_WEEKDAYS[date.getDay()];
  },

  /**
   * @see: <http://docs.python.org/library/datetime.html#datetime.datetime.combine>
   */
  combine: function(date: Date, time: Date) {
    time = time || date;
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    );
  },

  clone: function(date: Date | Time) {
    const dolly = new Date(date.getTime());
    return dolly;
  },

  cloneDates: function(dates: Date[] | Time[]) {
    const clones = [];
    for (let i = 0; i < dates.length; i++) {
      clones.push(dateutil.clone(dates[i]));
    }
    return clones;
  },

  /**
   * Sorts an array of Date or dateutil.Time objects
   */
  sort: function<T extends Datelike>(dates: T[]) {
    dates.sort(function(a, b) {
      return a.getTime() - b.getTime();
    });
  },

  timeToUntilString: function(time: number) {
    let comp;
    const date = new Date(time);
    const comps = [
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      "T",
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      "Z"
    ];

    for (let i = 0; i < comps.length; i++) {
      comp = comps[i];
      if (!/[TZ]/.test(comp.toString()) && comp < 10)
        comps[i] = "0" + String(comp);
    }
    return comps.join("");
  },

  untilStringToDate: function(until: string) {
    const re = /^(\d{4})(\d{2})(\d{2})(T(\d{2})(\d{2})(\d{2})Z?)?$/;
    const bits = re.exec(until);
    if (!bits) throw new Error("Invalid UNTIL value: " + until);
    return new Date(
      Date.UTC(
        parseInt(bits[1], 10),
        parseInt(bits[2], 10) - 1,
        parseInt(bits[3], 10),
        parseInt(bits[5], 10) || 0,
        parseInt(bits[6], 10) || 0,
        parseInt(bits[7], 10) || 0
      )
    );
  },

  Time
};

export default dateutil;
