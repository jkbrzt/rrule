/* global it */

var assert = require('assert')
var RRule = require('../../')

var assertDatesEqual = function (actual, expected, msg) {
  msg = msg ? ' [' + msg + '] ' : ''

  if (!(actual instanceof Array)) actual = [actual]
  if (!(expected instanceof Array)) expected = [expected]

  if (expected.length > 1) {
    assert.strictEqual(actual.length, expected.length, msg + 'number of recurrences')
    msg = ' - '
  }

  for (var exp, act, i = 0; i < expected.length; i++) {
    act = actual[i]
    exp = expected[i]
    assert.strictEqual(exp instanceof Date ? exp.toString() : exp,
      act.toString(), msg + (i + 1) + '/' + expected.length)
  }
}

var extractTime = function (date) {
  return date != null ? date.getTime() : void 0
}

/**
 * datetime.datetime
 */
exports.datetime = function (y, m, d, h, i, s) {
  h = h || 0
  i = i || 0
  s = s || 0
  return new Date(y, m - 1, d, h, i, s)
}

exports.datetimeUTC = function (y, m, d, h, i, s) {
  h = h || 0
  i = i || 0
  s = s || 0
  return new Date(Date.UTC(y, m - 1, d, h, i, s))
}

/**
 * dateutil.parser.parse
 */
exports.parse = function (str) {
  var parts = str.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/)
  var y = parts[1]
  var m = parts[2]
  var d = parts[3]
  var h = parts[4]
  var i = parts[5]
  var s = parts[6]
  m = Number(m[0] === '0' ? m[1] : m) - 1
  d = d[0] === '0' ? d[1] : d
  h = h[0] === '0' ? h[1] : h
  i = i[0] === '0' ? i[1] : i
  s = s[0] === '0' ? s[1] : s
  return new Date(y, m, d, h, i, s)
}

exports.testRecurring = function (msg, testObj, expectedDates) {
  var rule, method, args

  if (typeof testObj === 'function') {
    testObj = testObj()
  }

  if (testObj instanceof RRule || testObj instanceof RRule.RRuleSet) {
    rule = testObj
    method = 'all'
    args = []
  } else {
    rule = testObj.rrule
    method = testObj.method
    args = testObj.args
  }

  // Use text and string representation of the rrule as the message.
  if (rule instanceof RRule) {
    msg = msg + ' [' +
      (rule.isFullyConvertibleToText() ? rule.toText() : 'no text repr') +
      ']' + ' [' + rule.toString() + ']'
  } else {
    msg = msg + ' ' + rule.toString()
  }

  it(msg, function () {
    var ctx = this.test.ctx
    var time = Date.now()
    var actualDates = rule[method].apply(rule, args)
    time = Date.now() - time

    assert.strictEqual(time < 100, true,
      rule + '\' method "' + method + '" should finish in 100 ms, but ' + time + ' ms')

    if (!(actualDates instanceof Array)) actualDates = [actualDates]
    if (!(expectedDates instanceof Array)) expectedDates = [expectedDates]

    assertDatesEqual(actualDates, expectedDates)

    // Additional tests using the expected dates
    // ==========================================================

    if (ctx.ALSO_TEST_SUBSECOND_PRECISION) {
      assert.deepEqual(actualDates.map(extractTime), expectedDates.map(extractTime))
    }

    if (ctx.ALSO_TEST_STRING_FUNCTIONS) {
      // Test toString()/fromString()
      var string = rule.toString()
      var rrule2 = RRule.fromString(string, rule.options.dtstart)
      var string2 = rrule2.toString()
      assert.strictEqual(string, string2, 'toString() == fromString(toString()).toString()')
      if (method === 'all') {
        assertDatesEqual(rrule2.all(), expectedDates, 'fromString().all()')
      }
    }

    if (ctx.ALSO_TEST_NLP_FUNCTIONS && rule.isFullyConvertibleToText && rule.isFullyConvertibleToText()) {
      // Test fromText()/toText().
      var text = rule.toText()
      var text2 = rrule2.toText()
      rrule2 = RRule.fromText(text, rule.options.dtstart)
      assert.strictEqual(text2, text, 'toText() == fromText(toText()).toText()')

      // Test fromText()/toString().
      text = rule.toText()
      var rrule3 = RRule.fromText(text, rule.options.dtstart)
      assert.strictEqual(rrule3.toString(), string, 'toString() == fromText(toText()).toString()')
    }

    if (method === 'all' && ctx.ALSO_TEST_BEFORE_AFTER_BETWEEN) {
      // Test before, after, and between - use the expected dates.
      // create a clean copy of the rrule object to bypass caching
      rule = rule.clone()

      if (expectedDates.length > 2) {
        // Test between()
        assertDatesEqual(
          rule.between(
            expectedDates[0],
            expectedDates[expectedDates.length - 1],
            true
          ),
          expectedDates,
          'between, inc=true'
        )

        assertDatesEqual(
          rule.between(
            expectedDates[0],
            expectedDates[expectedDates.length - 1],
            false
          ),
          expectedDates.slice(1, expectedDates.length - 1),
          'between, inc=false'
        )
      }

      if (expectedDates.length > 1) {
        for (var date, next, prev, i = 0; i < expectedDates.length; i++) {
          date = expectedDates[i]
          next = expectedDates[i + 1]
          prev = expectedDates[i - 1]

          // Test after() and before() with inc=true.
          assertDatesEqual(rule.after(date, true), date, 'after, inc=true')
          assertDatesEqual(rule.before(date, true), date, 'before, inc=true')

          // Test after() and before() with inc=false.
          next && assertDatesEqual(rule.after(date, false), next, 'after, inc=false')
          prev && assertDatesEqual(rule.before(date, false), prev, 'before, inc=false')
        }
      }
    }
  })
}

exports.testRecurring.skip = function () {
  it.skip.apply(it, arguments)
}

exports.assertStrType = function (msg, obj, type) {
  it(msg, function () {
    assert.ok(obj instanceof type)
  })
}
