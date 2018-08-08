import RRule from './rrule';
import IterResult from './iterresult';
/**
 *
 * @param {Boolean?} noCache
 *  The same stratagy as RRule on cache, default to false
 * @constructor
 */
export default class RRuleSet extends RRule {
    readonly _rrule: RRule[];
    readonly _rdate: Date[];
    readonly _exrule: RRule[];
    readonly _exdate: Date[];
    constructor(noCache?: boolean);
    /**
     * Adds an RRule to the set
     *
     * @param {RRule}
     */
    rrule(rrule: RRule | string): void;
    /**
     * Adds an RDate to the set
     *
     * @param {Date}
     */
    rdate(date: Date): void;
    /**
     * Adds an EXRULE to the set
     *
     * @param {RRule}
     */
    exrule(rrule: RRule): void;
    /**
     * Adds an EXDATE to the set
     *
     * @param {Date}
     */
    exdate(date: Date): void;
    valueOf(): string[];
    /**
     * to generate recurrence field sush as:
     *   ["RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU;DTSTART=19970902T010000Z","RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH;DTSTART=19970902T010000Z"]
     */
    toString(): string;
    _iter(iterResult: IterResult): Date | Date[] | null;
    /**
     * Create a new RRuleSet Object completely base on current instance
     */
    clone(): RRuleSet;
}
