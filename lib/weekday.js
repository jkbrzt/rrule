var WDAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']

// =============================================================================
// Weekday
// =============================================================================

var Weekday = function (weekday, n) {
  if (n === 0) throw new Error("Can't create weekday with n == 0")
  this.weekday = weekday
  this.n = n
}

Weekday.prototype = {
  constructor: Weekday,
  // __call__ - Cannot call the object directly, do it through
  // e.g. RRule.TH.nth(-1) instead,
  nth: function (n) {
    return this.n === n ? this : new Weekday(this.weekday, n)
  },

  // __eq__
  equals: function (other) {
    return this.weekday === other.weekday && this.n === other.n
  },

  // __repr__
  toString: function () {
    var s = WDAYS[this.weekday]
    if (this.n) s = (this.n > 0 ? '+' : '') + String(this.n) + s
    return s
  },

  getJsWeekday: function () {
    return this.weekday === 6 ? 0 : this.weekday + 1
  }

}

module.exports = Weekday
