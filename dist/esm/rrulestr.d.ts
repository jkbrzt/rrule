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
export declare function rrulestr(s: string, options?: Partial<RRuleStrOptions>): RRule | RRuleSet;
