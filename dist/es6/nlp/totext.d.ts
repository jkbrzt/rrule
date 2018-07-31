import { Language } from './i18n';
import RRule from '../index';
import Weekday from '../weekday';
export declare type GetText = (id: string | number | Weekday) => string;
/**
 *
 * @param {RRule} rrule
 * Optional:
 * @param {Function} gettext function
 * @param {Object} language definition
 * @constructor
 */
export default class ToText {
    static IMPLEMENTED: any[];
    private rrule;
    private text;
    private gettext;
    private language;
    private options;
    private origOptions;
    private bymonthday;
    private byweekday;
    constructor(rrule: RRule, gettext: GetText, language?: Language);
    /**
     * Test whether the rrule can be fully converted to text.
     * @param {RRule} rrule
     * @return {Boolean}
     */
    static isFullyConvertible(rrule: RRule): boolean;
    isFullyConvertible(): boolean;
    /**
     * Perform the conversion. Only some of the frequencies are supported.
     * If some of the rrule's options aren't supported, they'll
     * be omitted from the output an "(~ approximate)" will be appended.
     * @return {*}
     */
    toString(): string;
    HOURLY(): void;
    MINUTELY(): void;
    DAILY(): void;
    WEEKLY(): void;
    MONTHLY(): void;
    YEARLY(): void;
    _bymonthday(): void;
    _byweekday(): void;
    _byhour(): void;
    _bymonth(): void;
    nth(n: number | string): string;
    monthtext(m: number): string;
    weekdaytext(wday: Weekday | number): string;
    plural(n: number): boolean;
    add(s: string): this;
    list(arr: any, callback: GetText, finalDelim?: string, delim?: string): any;
}
