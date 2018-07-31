import RRule from './rrule';
import IterResult from './iterresult';
/**
 *
 * @param {Boolean?} noCache
 *  The same stratagy as RRule on cache, default to false
 * @constructor
 */
export default class RRuleSet extends RRule {
    private _rrule;
    private _rdate;
    private _exrule;
    private _exdate;
    constructor(noCache?: boolean);
    /**
     * @param {RRule}
     */
    rrule(rrule: RRule | string): void;
    /**
     * @param {Date}
     */
    rdate(date: Date): void;
    /**
     * @param {RRule}
     */
    exrule(rrule: RRule): void;
    /**
     * @param {Date}
     */
    exdate(date: Date): void;
    valueOf(): string[];
    /**
     * to generate recurrence field sush as:
     *   ["RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU;DTSTART=19970902T010000Z","RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH;DTSTART=19970902T010000Z"]
     */
    toString(): string;
    _iter(iterResult: IterResult): Date | Date[];
    /**
     * Create a new RRuleSet Object completely base on current instance
     */
    clone(): RRuleSet;
}
