var {
  contains
} = require('./helpers')
var IterResult = require('./iterresult')

/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
var CallbackIterResult = function (method, args, iterator) {
  var allowedMethods = ['all', 'between']
  if (!contains(allowedMethods, method)) {
    throw new Error('Invalid method "' + method +
      '". Only all and between works with iterator.')
  }
  this.add = function (date) {
    if (iterator(date, this._result.length)) {
      this._result.push(date)
      return true
    }
    return false
  }

  this.init(method, args)
}
CallbackIterResult.prototype = IterResult.prototype

module.exports = CallbackIterResult
