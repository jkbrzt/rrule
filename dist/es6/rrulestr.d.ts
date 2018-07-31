import RRule, { RRuleOrigOptions, Frequencies, DayKeys } from './rrule';
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
declare type FreqKey = keyof typeof Frequencies;
/**
 * RRuleStr
 *  To parse a set of rrule strings
 */
export default class RRuleStr {
    _handle_DTSTART(rrkwargs: RRuleOrigOptions, name: string, value: string, _: any): void;
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
    _handle_int(rrkwargs: RRuleOrigOptions, name: string, value: string): void;
    _handle_int_list(rrkwargs: RRuleOrigOptions, name: string, value: string): void;
    _handle_FREQ(rrkwargs: RRuleOrigOptions, _: any, value: FreqKey, __: any): void;
    _handle_UNTIL(rrkwargs: RRuleOrigOptions, _: any, value: string, __: any): void;
    _handle_WKST(rrkwargs: RRuleOrigOptions, _: any, value: DayKeys, __: any): void;
    _handle_BYWEEKDAY(rrkwargs: RRuleOrigOptions, _: any, value: string, __: any): void;
    _parseRfcRRule(line: any, options?: Partial<RRuleStrOptions>): RRule;
    _parseRfc(s: string, options: Partial<RRuleStrOptions>): RRule;
    parse(s: string, options?: Partial<RRuleStrOptions>): RRule | RRuleSet;
    _handle_BYDAY: (rrkwargs: RRuleOrigOptions, _: any, value: string, __: any) => void;
    _handle_INTERVAL: (rrkwargs: RRuleOrigOptions, name: string, value: string) => void;
    _handle_COUNT: (rrkwargs: RRuleOrigOptions, name: string, value: string) => void;
    _handle_BYSETPOS: (rrkwargs: RRuleOrigOptions, name: string, value: string) => void;
    _handle_BYMONTH: (rrkwargs: RRuleOrigOptions, name: string, value: string) => void;
    _handle_BYMONTHDAY: (rrkwargs: RRuleOrigOptions, name: string, value: string) => void;
    _handle_BYYEARDAY: (rrkwargs: RRuleOrigOptions, name: string, value: string) => void;
    _handle_BYEASTER: (rrkwargs: RRuleOrigOptions, name: string, value: string) => void;
    _handle_BYWEEKNO: (rrkwargs: RRuleOrigOptions, name: string, value: string) => void;
    _handle_BYHOUR: (rrkwargs: RRuleOrigOptions, name: string, value: string) => void;
    _handle_BYMINUTE: (rrkwargs: RRuleOrigOptions, name: string, value: string) => void;
    _handle_BYSECOND: (rrkwargs: RRuleOrigOptions, name: string, value: string) => void;
}
export {};
