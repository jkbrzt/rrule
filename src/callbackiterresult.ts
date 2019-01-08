import IterResult, { IterArgs } from './iterresult'
import { QueryIterator } from './types'

/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
export default class CallbackIterResult extends IterResult<'all' | 'between'> {
  constructor (
    method: 'all' | 'between',
    args: Partial<IterArgs>,
    private iterator: QueryIterator
  ) {
    super(method, args)
  }

  add (date: Date) {
    if (this.iterator(date, this._result.length)) {
      this._result.push(date)
      return true
    }
    return false
  }
}
