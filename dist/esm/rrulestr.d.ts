import RRule from './rrule';
import RRuleSet from './rruleset';
export interface RRuleStrOptions {
    dtstart: Date | null;
    cache: boolean;
    unfold: boolean;
    forceset: boolean;
    compatible: boolean;
    tzid: string | null;
}
/**
 * RRuleStr
 *  To parse a set of rrule strings
 */
export default class RRuleStr {
    private _handle_DTSTART;
    private static _weekday_map;
    private static _freq_map;
    private static DEFAULT_OPTIONS;
    private _handle_int;
    private _handle_int_list;
    private _handle_FREQ;
    private _handle_UNTIL;
    private _handle_WKST;
    private _handle_BYWEEKDAY;
    private _parseRfcRRule;
    private _parseRfc;
    parse(s: string, options?: Partial<RRuleStrOptions>): RRule | RRuleSet;
    private _handle_BYDAY;
    private _handle_INTERVAL;
    private _handle_COUNT;
    private _handle_BYSETPOS;
    private _handle_BYMONTH;
    private _handle_BYMONTHDAY;
    private _handle_BYYEARDAY;
    private _handle_BYEASTER;
    private _handle_BYWEEKNO;
    private _handle_BYHOUR;
    private _handle_BYMINUTE;
    private _handle_BYSECOND;
}
