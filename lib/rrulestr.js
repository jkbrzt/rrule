var RRule = require('./rrule')
var RRuleSet = require('./rruleset')
var dateutil = require('./dateutil')
var Weekday = require('./weekday')
var {
  contains,
  split
} = require('./helpers')

/**
 * RRuleStr
 *  To parse a set of rrule strings
 */

var RRuleStr = function () {}

RRuleStr.DEFAULT_OPTIONS = {
  dtstart: null,
  cache: false,
  unfold: false,
  forceset: false,
  compatible: false,
  ignoretz: false,
  tzinfos: null
}

RRuleStr._freq_map = {
  'YEARLY': RRule.YEARLY,
  'MONTHLY': RRule.MONTHLY,
  'WEEKLY': RRule.WEEKLY,
  'DAILY': RRule.DAILY,
  'HOURLY': RRule.HOURLY,
  'MINUTELY': RRule.MINUTELY,
  'SECONDLY': RRule.SECONDLY
}

RRuleStr._weekday_map = {
  'MO': 0,
  'TU': 1,
  'WE': 2,
  'TH': 3,
  'FR': 4,
  'SA': 5,
  'SU': 6
}

RRuleStr.prototype = {
  constructor: RRuleStr,

  _handle_int: function (rrkwargs, name, value, options) {
    rrkwargs[name.toLowerCase()] = parseInt(value, 10)
  },

  _handle_int_list: function (rrkwargs, name, value, options) {
    rrkwargs[name.toLowerCase()] = value.split(',').map(function (x) {
      return parseInt(x, 10)
    })
  },

  _handle_FREQ: function (rrkwargs, name, value, options) {
    rrkwargs['freq'] = RRuleStr._freq_map[value]
  },

  _handle_UNTIL: function (rrkwargs, name, value, options) {
    try {
      rrkwargs['until'] = dateutil.untilStringToDate(value)
    } catch (error) {
      throw new Error('invalid until date')
    }
  },

  _handle_WKST: function (rrkwargs, name, value, options) {
    rrkwargs['wkst'] = RRuleStr._weekday_map[value]
  },

  _handle_BYWEEKDAY: function (rrkwargs, name, value, options) {
    // Two ways to specify this: +1MO or MO(+1)
    var splt, i, j, n, w, wday
    var l = []
    var wdays = value.split(',')

    for (i = 0; i < wdays.length; i++) {
      wday = wdays[i]
      if (wday.indexOf('(') > -1) {
        // If it's of the form TH(+1), etc.
        splt = wday.split('(')
        w = splt[0]
        n = parseInt(splt.slice(1, -1), 10)
      } else {
        // # If it's of the form +1MO
        for (j = 0; j < wday.length; j++) {
          if ('+-0123456789'.indexOf(wday[j]) === -1) break
        }
        n = wday.slice(0, j) || null
        w = wday.slice(j)

        if (n) n = parseInt(n, 10)
      }

      var weekday = new Weekday(RRuleStr._weekday_map[w], n)
      l.push(weekday)
    }
    rrkwargs['byweekday'] = l
  },

  _parseRfcRRule: function (line, options) {
    options = options || {}
    options.dtstart = options.dtstart || null
    options.cache = options.cache || false
    options.ignoretz = options.ignoretz || false
    options.tzinfos = options.tzinfos || null

    var name, value, parts
    if (line.indexOf(':') !== -1) {
      parts = line.split(':')
      name = parts[0]
      value = parts[1]

      if (name !== 'RRULE') throw new Error('unknown parameter name')
    } else {
      value = line
    }

    var i
    var rrkwargs = {}
    var pairs = value.split(';')

    for (i = 0; i < pairs.length; i++) {
      parts = pairs[i].split('=')
      name = parts[0].toUpperCase()
      value = parts[1].toUpperCase()

      try {
        this['_handle_' + name](rrkwargs, name, value, {
          ignoretz: options.ignoretz,
          tzinfos: options.tzinfos
        })
      } catch (error) {
        throw new Error("unknown parameter '" + name + "':" + value)
      }
    }
    rrkwargs.dtstart = rrkwargs.dtstart || options.dtstart
    return new RRule(rrkwargs, !options.cache)
  },

  _parseRfc: function (s, options) {
    if (options.compatible) {
      options.forceset = true
      options.unfold = true
    }

    s = s && s.toUpperCase().trim()
    if (!s) throw new Error('Invalid empty string')

    var i = 0
    var line, lines

    // More info about 'unfold' option
    // Go head to http://www.ietf.org/rfc/rfc2445.txt
    if (options.unfold) {
      lines = s.split('\n')
      while (i < lines.length) {
        // TODO
        line = lines[i] = lines[i].replace(/\s+$/g, '')
        if (!line) {
          lines.splice(i, 1)
        } else if (i > 0 && line[0] === ' ') {
          lines[i - 1] += line.slice(1)
          lines.splice(i, 1)
        } else {
          i += 1
        }
      }
    } else {
      lines = s.split(/\s/)
    }

    var rrulevals = []
    var rdatevals = []
    var exrulevals = []
    var exdatevals = []
    var name, value, parts, parms, parm, dtstart, rset, j, k, datestrs, datestr

    if (!options.forceset && lines.length === 1 && (s.indexOf(':') === -1 ||
      s.indexOf('RRULE:') === 0)) {
      return this._parseRfcRRule(lines[0], {
        cache: options.cache,
        dtstart: options.dtstart,
        ignoretz: options.ignoretz,
        tzinfos: options.tzinfos
      })
    } else {
      for (i = 0; i < lines.length; i++) {
        line = lines[i]
        if (!line) continue
        if (line.indexOf(':') === -1) {
          name = 'RRULE'
          value = line
        } else {
          parts = split(line, ':', 1)
          name = parts[0]
          value = parts[1]
        }
        parms = name.split(';')
        if (!parms) throw new Error('empty property name')
        name = parms[0]
        parms = parms.slice(1)

        if (name === 'RRULE') {
          for (j = 0; j < parms.length; j++) {
            parm = parms[j]
            throw new Error('unsupported RRULE parm: ' + parm)
          }
          rrulevals.push(value)
        } else if (name === 'RDATE') {
          for (j = 0; j < parms.length; j++) {
            parm = parms[j]
            if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
              throw new Error('unsupported RDATE parm: ' + parm)
            }
          }
          rdatevals.push(value)
        } else if (name === 'EXRULE') {
          for (j = 0; j < parms.length; j++) {
            parm = parms[j]
            throw new Error('unsupported EXRULE parm: ' + parm)
          }
          exrulevals.push(value)
        } else if (name === 'EXDATE') {
          for (j = 0; j < parms.length; j++) {
            parm = parms[j]
            if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
              throw new Error('unsupported RDATE parm: ' + parm)
            }
          }
          exdatevals.push(value)
        } else if (name === 'DTSTART') {
          dtstart = dateutil.untilStringToDate(value)
        } else {
          throw new Error('unsupported property: ' + name)
        }
      }

      if (options.forceset || rrulevals.length > 1 || rdatevals.length ||
        exrulevals.length || exdatevals.length) {
        rset = new RRuleSet(!options.cache)
        for (j = 0; j < rrulevals.length; j++) {
          rset.rrule(this._parseRfcRRule(rrulevals[j], {
            dtstart: options.dtstart || dtstart,
            ignoretz: options.ignoretz,
            tzinfos: options.tzinfos
          }))
        }
        for (j = 0; j < rdatevals.length; j++) {
          datestrs = rdatevals[j].split(',')
          for (k = 0; k < datestrs.length; k++) {
            datestr = datestrs[k]
            rset.rdate(dateutil.untilStringToDate(datestr))
          }
        }
        for (j = 0; j < exrulevals.length; j++) {
          rset.exrule(this._parseRfcRRule(exrulevals[j], {
            dtstart: options.dtstart || dtstart,
            ignoretz: options.ignoretz,
            tzinfos: options.tzinfos
          }))
        }
        for (j = 0; j < exdatevals.length; j++) {
          datestrs = exdatevals[j].split(',')
          for (k = 0; k < datestrs.length; k++) {
            datestr = datestrs[k]
            rset.exdate(dateutil.untilStringToDate(datestr))
          }
        }

        if (options.campatiable && options.dtstart) rset.rdate(dtstart)
        return rset
      } else {
        return this._parseRfcRRule(rrulevals[0], {
          dtstart: options.dtstart || dtstart,
          cache: options.cache,
          ignoretz: options.ignoretz,
          tzinfos: options.tzinfos
        })
      }
    }
  },

  parse: function (s, options) {
    options = options || {}

    var invalid = []
    var keys = Object.keys(options)
    var defaultKeys = Object.keys(RRuleStr.DEFAULT_OPTIONS)

    keys.forEach(function (key) {
      if (!contains(defaultKeys, key)) invalid.push(key)
    }, this)

    if (invalid.length) throw new Error('Invalid options: ' + invalid.join(', '))

    // Merge in default options
    defaultKeys.forEach(function (key) {
      if (!contains(keys, key)) options[key] = RRuleStr.DEFAULT_OPTIONS[key]
    })

    return this._parseRfc(s, options)
  }
}

RRuleStr.prototype._handle_DTSTART = function (rrkwargs, name, value, options) {
  rrkwargs[name.toLowerCase()] = dateutil.untilStringToDate(value)
}

RRuleStr.prototype._handle_BYDAY = RRuleStr.prototype._handle_BYWEEKDAY
RRuleStr.prototype._handle_INTERVAL = RRuleStr.prototype._handle_int
RRuleStr.prototype._handle_COUNT = RRuleStr.prototype._handle_int

;[
  '_handle_BYSETPOS', '_handle_BYMONTH', '_handle_BYMONTHDAY',
  '_handle_BYYEARDAY', '_handle_BYEASTER', '_handle_BYWEEKNO',
  '_handle_BYHOUR', '_handle_BYMINUTE', '_handle_BYSECOND'
].forEach(function (method) {
  RRuleStr.prototype[method] = RRuleStr.prototype._handle_int_list
})

module.exports = RRuleStr
