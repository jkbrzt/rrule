import RRule from './rrule';
import IterResult from './iterresult';
import { QueryMethodTypes } from './types';
export default class RRuleSet extends RRule {
    readonly _rrule: RRule[];
    readonly _rdate: Date[];
    readonly _exrule: RRule[];
    readonly _exdate: Date[];
    private _tzid?;
    /**
     *
     * @param {Boolean?} noCache
     *  The same stratagy as RRule on cache, default to false
     * @constructor
     */
    constructor(noCache?: boolean);
    tzid(tzid?: string): string | undefined;
    _iter<M extends QueryMethodTypes>(iterResult: IterResult<M>): import("./types").IterResultType<M>;
    /**
     * Adds an RRule to the set
     *
     * @param {RRule}
     */
    rrule(rrule: RRule): void;
    /**
     * Adds an EXRULE to the set
     *
     * @param {RRule}
     */
    exrule(rrule: RRule): void;
    /**
     * Adds an RDate to the set
     *
     * @param {Date}
     */
    rdate(date: Date): void;
    /**
     * Adds an EXDATE to the set
     *
     * @param {Date}
     */
    exdate(date: Date): void;
    valueOf(): string[];
    /**
     * to generate recurrence field such as:
     *   DTSTART:19970902T010000Z
     *   RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU
     *   RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH
     */
    toString(): string;
    /**
     * Create a new RRuleSet Object completely base on current instance
     */
    clone(): RRuleSet;
}
//# sourceMappingURL=rruleset.d.ts.map