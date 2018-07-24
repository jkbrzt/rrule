var RRule = require('./rrule')
var dateutil = require('./dateutil')
var {
  contains
} = require('./helpers')

/**
 *
 * @param {Boolean?} noCache
 *  The same stratagy as RRule on cache, default to false
 * @constructor
 */

var RRuleSet = function (noCache) {
  // Let RRuleSet cacheable
  this._cache = noCache ? null : {
    all: false,
    before: [],
    after: [],
    between: []
  }
  this._rrule = []
  this._rdate = []
  this._exrule = []
  this._exdate = []
}

RRuleSet.prototype = {
  constructor: RRuleSet,

  /**
  * @param {RRule}
  */
  rrule: function (rrule) {
    if (!(rrule instanceof RRule)) {
      throw new TypeError(String(rrule) + ' is not RRule instance')
    }
    if (!contains(this._rrule.map(String), String(rrule))) {
      this._rrule.push(rrule)
    }
  },

  /**
  * @param {Date}
  */
  rdate: function (date) {
    if (!(date instanceof Date)) {
      throw new TypeError(String(date) + ' is not Date instance')
    }
    if (!contains(this._rdate.map(Number), Number(date))) {
      this._rdate.push(date)
      dateutil.sort(this._rdate)
    }
  },

  /**
  * @param {RRule}
  */
  exrule: function (rrule) {
    if (!(rrule instanceof RRule)) {
      throw new TypeError(String(rrule) + ' is not RRule instance')
    }
    if (!contains(this._exrule.map(String), String(rrule))) {
      this._exrule.push(rrule)
    }
  },

  /**
  * @param {Date}
  */
  exdate: function (date) {
    if (!(date instanceof Date)) {
      throw new TypeError(String(date) + ' is not Date instance')
    }
    if (!contains(this._exdate.map(Number), Number(date))) {
      this._exdate.push(date)
      dateutil.sort(this._exdate)
    }
  },

  valueOf: function () {
    var result = []
    if (this._rrule.length) {
      this._rrule.forEach(function (rrule) {
        result.push('RRULE:' + rrule)
      })
    }
    if (this._rdate.length) {
      result.push('RDATE:' + this._rdate.map(function (rdate) {
        return dateutil.timeToUntilString(rdate)
      }).join(','))
    }
    if (this._exrule.length) {
      this._exrule.forEach(function (exrule) {
        result.push('EXRULE:' + exrule)
      })
    }
    if (this._exdate.length) {
      result.push('EXDATE:' + this._exdate.map(function (exdate) {
        return dateutil.timeToUntilString(exdate)
      }).join(','))
    }
    return result
  },

  /**
  * to generate recurrence field sush as:
  *   ["RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU;DTSTART=19970902T010000Z","RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH;DTSTART=19970902T010000Z"]
  */
  toString: function () {
    return JSON.stringify(this.valueOf())
  },

  _iter: function (iterResult) {
    var _exdateHash = {}
    var _exrule = this._exrule
    var _accept = iterResult.accept

    function evalExdate (after, before) {
      _exrule.forEach(function (rrule) {
        rrule.between(after, before, true).forEach(function (date) {
          _exdateHash[Number(date)] = true
        })
      })
    }

    this._exdate.forEach(function (date) {
      _exdateHash[Number(date)] = true
    })

    iterResult.accept = function (date) {
      var dt = Number(date)
      if (!_exdateHash[dt]) {
        evalExdate(new Date(dt - 1), new Date(dt + 1))
        if (!_exdateHash[dt]) {
          _exdateHash[dt] = true
          return _accept.call(this, date)
        }
      }
      return true
    }

    if (iterResult.method === 'between') {
      evalExdate(iterResult.args.after, iterResult.args.before)
      iterResult.accept = function (date) {
        var dt = Number(date)
        if (!_exdateHash[dt]) {
          _exdateHash[dt] = true
          return _accept.call(this, date)
        }
        return true
      }
    }

    for (var i = 0; i < this._rdate.length; i++) {
      if (!iterResult.accept(new Date(this._rdate[i]))) break
    }

    this._rrule.forEach(function (rrule) {
      rrule._iter(iterResult)
    })

    var res = iterResult._result
    dateutil.sort(res)
    switch (iterResult.method) {
      case 'all':
      case 'between':
        return res
      case 'before':
        return (res.length && res[res.length - 1]) || null
      case 'after':
        return (res.length && res[0]) || null
      default:
        return null
    }
  },

  /**
  * Create a new RRuleSet Object completely base on current instance
  */
  clone: function () {
    var rrs = new RRuleSet(!!this._cache)
    var i
    for (i = 0; i < this._rrule.length; i++) {
      rrs.rrule(this._rrule[i].clone())
    }
    for (i = 0; i < this._rdate.length; i++) {
      rrs.rdate(new Date(this._rdate[i]))
    }
    for (i = 0; i < this._exrule.length; i++) {
      rrs.exrule(this._exrule[i].clone())
    }
    for (i = 0; i < this._exdate.length; i++) {
      rrs.exdate(new Date(this._exdate[i]))
    }
    return rrs
  }
}

/**
 * Inherts method from RRule
 *  add Read interface and set RRuleSet cacheable
 */
var RRuleSetMethods = ['all', 'between', 'before', 'after', 'count', '_cacheAdd', '_cacheGet']
RRuleSetMethods.forEach(function (method) {
  RRuleSet.prototype[method] = RRule.prototype[method]
})

module.exports = RRuleSet
