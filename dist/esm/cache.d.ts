import { IterArgs } from './iterresult';
export declare type CacheKeys = 'before' | 'after' | 'between';
export declare class Cache {
    all: Date[] | Partial<IterArgs> | false;
    before: IterArgs[];
    after: IterArgs[];
    between: IterArgs[];
    /**
     * @param {String} what - all/before/after/between
     * @param {Array,Date} value - an array of dates, one date, or null
     * @param {Object?} args - _iter arguments
     */
    _cacheAdd(what: CacheKeys | 'all', value: Date[] | Date | null, args?: Partial<IterArgs>): void;
    /**
     * @return false - not in the cache
     *         null  - cached, but zero occurrences (before/after)
     *         Date  - cached (before/after)
     *         []    - cached, but zero occurrences (all/between)
     *         [Date1, DateN] - cached (all/between)
     */
    _cacheGet(what: CacheKeys | 'all', args?: Partial<IterArgs>): Date | Date[] | false | null;
}
