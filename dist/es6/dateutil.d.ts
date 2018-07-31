export declare class Time {
    private hour;
    private minute;
    private second;
    private millisecond;
    constructor(hour: number, minute: number, second: number, millisecond: number);
    getHours(): number;
    getMinutes(): number;
    getSeconds(): number;
    getMilliseconds(): number;
    getTime(): number;
}
/**
 * General date-related utilities.
 * Also handles several incompatibilities between JavaScript and Python
 *
 */
declare const dateutil: {
    MONTH_DAYS: number[];
    /**
     * Number of milliseconds of one day
     */
    ONE_DAY: number;
    /**
     * @see: <http://docs.python.org/library/datetime.html#datetime.MAXYEAR>
     */
    MAXYEAR: number;
    /**
     * Python uses 1-Jan-1 as the base for calculating ordinals but we don't
     * want to confuse the JS engine with milliseconds > Number.MAX_NUMBER,
     * therefore we use 1-Jan-1970 instead
     */
    ORDINAL_BASE: Date;
    /**
     * Python: MO-SU: 0 - 6
     * JS: SU-SAT 0 - 6
     */
    PY_WEEKDAYS: number[];
    /**
     * py_date.timetuple()[7]
     */
    getYearDay: (date: Date) => number;
    isLeapYear: (year: number) => boolean;
    /**
     * @return {Number} the date's timezone offset in ms
     */
    tzOffset: (date: Date) => number;
    /**
     * @see: <http://www.mcfedries.com/JavaScript/DaysBetween.asp>
     */
    daysBetween: (date1: Date, date2: Date) => number;
    /**
     * @see: <http://docs.python.org/library/datetime.html#datetime.date.toordinal>
     */
    toOrdinal: (date: Date) => number;
    /**
     * @see - <http://docs.python.org/library/datetime.html#datetime.date.fromordinal>
     */
    fromOrdinal: (ordinal: number) => Date;
    /**
     * @see: <http://docs.python.org/library/calendar.html#calendar.monthrange>
     */
    monthRange: (year: number, month: number) => number[];
    getMonthDays: (date: Date) => number;
    /**
     * @return {Number} python-like weekday
     */
    getWeekday: (date: Date) => number;
    /**
     * @see: <http://docs.python.org/library/datetime.html#datetime.datetime.combine>
     */
    combine: (date: Date, time: Date | Time) => Date;
    clone: (date: Date | Time) => Date;
    cloneDates: (dates: Date[] | Time[]) => Date[];
    /**
     * Sorts an array of Date or dateutil.Time objects
     */
    sort: <T extends Pick<Date, "getTime">>(dates: T[]) => void;
    timeToUntilString: (time: number) => string;
    untilStringToDate: (until: string) => Date;
    Time: typeof Time;
};
export default dateutil;
