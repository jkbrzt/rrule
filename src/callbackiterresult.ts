import IterResult, { IterArgs } from './iterresult'
import { contains } from './helpers'

/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
export default class CallbackIterResult extends IterResult {
  private iterator: (d: Date, len: number) => boolean

  constructor (
    method: string,
    args: Partial<IterArgs>,
    iterator: (d: Date, len: number) => boolean
  ) {
    const allowedMethods = ['all', 'between']
    if (!contains(allowedMethods, method)) {
      throw new Error(
        'Invalid method "' +
          method +
          '". Only all and between works with iterator.'
      )
    }

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
