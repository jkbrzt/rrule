import IterResult from './iterresult'
import {
  contains
} from './helpers'

/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
export default class CallbackIterResult extends IterResult {
  constructor (method, args, iterator) {
    const allowedMethods = ['all', 'between']
    if (!contains(allowedMethods, method)) {
      throw new Error('Invalid method "' + method +
        '". Only all and between works with iterator.')
    }

    super(method, args)

    this.iterator = iterator
  }

  add (date) {
    if (this.iterator(date, this._result.length)) {
      this._result.push(date)
      return true
    }
    return false
  }
}
