import RRule, { Options, Frequency, WeekdayStr } from './rrule';
import RRuleSet from './rruleset';
export interface RRuleStrOptions {
    dtstart: any;
    cache: boolean;
    unfold: boolean;
    forceset: boolean;
    compatible: boolean;
    ignoretz: boolean;
    tzinfos: any;
}
declare type FreqKey = keyof typeof Frequency;
/**
 * RRuleStr
 *  To parse a set of rrule strings
 */
export default class RRuleStr {
    _handle_DTSTART(rrkwargs: Options, name: string, value: string, _: any): void;
    static _weekday_map: {
        MO: number;
        TU: number;
        WE: number;
        TH: number;
        FR: number;
        SA: number;
        SU: number;
    };
    static _freq_map: {
        YEARLY: number;
        MONTHLY: number;
        WEEKLY: number;
        DAILY: number;
        HOURLY: number;
        MINUTELY: number;
        SECONDLY: number;
    };
    static DEFAULT_OPTIONS: RRuleStrOptions;
    _handle_int(rrkwargs: Options, name: string, value: string): void;
    _handle_int_list(rrkwargs: Options, name: string, value: string): void;
    _handle_FREQ(rrkwargs: Options, _: any, value: FreqKey, __: any): void;
    _handle_UNTIL(rrkwargs: Options, _: any, value: string, __: any): void;
    _handle_WKST(rrkwargs: Options, _: any, value: WeekdayStr, __: any): void;
    _handle_BYWEEKDAY(rrkwargs: Options, _: any, value: string, __: any): void;
    _parseRfcRRule(line: any, options?: Partial<RRuleStrOptions>): RRule;
    _parseRfc(s: string, options: Partial<RRuleStrOptions>): RRule;
    parse(s: string, options?: Partial<RRuleStrOptions>): RRule | RRuleSet;
    _handle_BYDAY: (rrkwargs: Options, _: any, value: string, __: any) => void;
    _handle_INTERVAL: (rrkwargs: Options, name: string, value: string) => void;
    _handle_COUNT: (rrkwargs: Options, name: string, value: string) => void;
    _handle_BYSETPOS: (rrkwargs: Options, name: string, value: string) => void;
    _handle_BYMONTH: (rrkwargs: Options, name: string, value: string) => void;
    _handle_BYMONTHDAY: (rrkwargs: Options, name: string, value: string) => void;
    _handle_BYYEARDAY: (rrkwargs: Options, name: string, value: string) => void;
    _handle_BYEASTER: (rrkwargs: Options, name: string, value: string) => void;
    _handle_BYWEEKNO: (rrkwargs: Options, name: string, value: string) => void;
    _handle_BYHOUR: (rrkwargs: Options, name: string, value: string) => void;
    _handle_BYMINUTE: (rrkwargs: Options, name: string, value: string) => void;
    _handle_BYSECOND: (rrkwargs: Options, name: string, value: string) => void;
}
export {};
