import IterResult, { IterArgs } from './iterresult'
import { contains } from './helpers'
import { Cache } from './rrule'

type Iterator = (d: Date, len: number) => boolean

/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
export default class CallbackIterResult extends IterResult {
  private iterator: Iterator

  constructor (
    method: 'all' | 'between',
    args: Partial<IterArgs>,
    iterator: Iterator
  ) {
    super(method, args)

    this.iterator = iterator
  }

  add (date: Date) {
    if (this.iterator(date, this._result.length)) {
      this._result.push(date)
      return true
    }
    return false
  }
}
