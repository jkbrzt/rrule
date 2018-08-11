import IterResult, { IterArgs } from './iterresult'
import dateutil from './dateutil'
import { isArray } from './helpers'

export type CacheKeys = 'before' | 'after' | 'between'

export class Cache {
  all: Date[] | Partial<IterArgs> | false = false
  before: IterArgs[] = []
  after: IterArgs[] = []
  between: IterArgs[] = []

  /**
   * @param {String} what - all/before/after/between
   * @param {Array,Date} value - an array of dates, one date, or null
   * @param {Object?} args - _iter arguments
   */
  public _cacheAdd (
    what: CacheKeys | 'all',
    value: Date[] | Date | null,
    args?: Partial<IterArgs>
  ) {
    if (value) {
      value =
        value instanceof Date
          ? dateutil.clone(value)
          : dateutil.cloneDates(value)
    }

    if (what === 'all') {
      this.all = value as Date[]
    } else {
      args!._value = value
      this[what].push(args as IterArgs)
    }
  }

  /**
   * @return false - not in the cache
   *         null  - cached, but zero occurrences (before/after)
   *         Date  - cached (before/after)
   *         []    - cached, but zero occurrences (all/between)
   *         [Date1, DateN] - cached (all/between)
   */
  public _cacheGet (
    what: CacheKeys | 'all',
    args?: Partial<IterArgs>
  ): Date | Date[] | false | null {
    let cached: Date | Date[] | false | null = false
    const argsKeys = args ? (Object.keys(args) as (keyof IterArgs)[]) : []
    const findCacheDiff = function (item: IterArgs) {
      for (let i = 0; i < argsKeys.length; i++) {
        const key = argsKeys[i]
        if (String(args![key]) !== String(item[key])) {
          return true
        }
      }
      return false
    }

    const cachedObject = this[what]
    if (what === 'all') {
      cached = this.all as Date[]
    } else if (isArray(cachedObject)) {
      // Let's see whether we've already called the
      // 'what' method with the same 'args'
      for (let i = 0; i < cachedObject.length; i++) {
        const item = cachedObject[i] as IterArgs
        if (argsKeys.length && findCacheDiff(item)) continue
        cached = item._value
        break
      }
    }

    if (!cached && this.all) {
      // Not in the cache, but we already know all the occurrences,
      // so we can find the correct dates from the cached ones.
      const iterResult = new IterResult(what, args!)
      for (let i = 0; i < (this.all as Date[]).length; i++) {
        if (!iterResult.accept((this.all as Date[])[i])) break
      }
      cached = iterResult.getValue() as Date
      this._cacheAdd(what, cached, args)
    }

    return isArray(cached)
      ? dateutil.cloneDates(cached)
      : cached instanceof Date
        ? dateutil.clone(cached)
        : cached
  }

}
