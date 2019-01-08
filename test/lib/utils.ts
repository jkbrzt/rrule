import { expect } from 'chai'
import { DateTime } from 'luxon';
import { Options, QueryMethodTypes } from '../../src/types';
import * as rrulefns from '../../src'
import { optionsToString } from '../../src/optionstostring';

const assertDatesEqual = function (actual: Date[], expected: Date[], msg?: string) {
  msg = msg ? ' [' + msg + '] ' : ''

  if (expected.length > 1) {
    expect(actual).to.have.length(expected.length, msg + 'number of recurrences')
    msg = ' - '
  }

  for (let i = 0; i < expected.length; i++) {
    const act = actual[i]
    const exp = expected[i]
    expect(exp instanceof Date ? exp.toString() : exp).to.equal(
      act.toString(), msg + (i + 1) + '/' + expected.length)
  }
}

const extractTime = function (date: Date) {
  return date != null ? date.getTime() : void 0
}

/**
 * datetime.datetime
 */
export const datetime = function (y: number, m: number, d: number, h: number = 0, i: number = 0, s: number = 0) {
  return new Date(Date.UTC(y, m - 1, d, h, i, s))
}

export const datetimeUTC = function (y: number, m: number, d: number, h: number = 0, i: number = 0, s: number = 0) {
  return new Date(Date.UTC(y, m - 1, d, h, i, s))
}

/**
 * dateutil.parser.parse
 */
export const parse = function (str: string) {
  const parts = str.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/)
  let [ _, y, m, d, h, i, s ] = parts
  const year = Number(y)
  const month = Number(m[0] === '0' ? m[1] : m) - 1
  const day = Number(d[0] === '0' ? d[1] : d)
  const hour = Number(h[0] === '0' ? h[1] : h)
  const minute = Number(i[0] === '0' ? i[1] : i)
  const second = Number(s[0] === '0' ? s[1] : s)
  return new Date(Date.UTC(year, month, day, hour, minute, second))
}

interface TestRecurring {
  (m: string, testObj: any, expectedDates: Date | Date[]): void
  skip: (...args: any[]) => void
}

interface TestObj {
  options: Partial<Options>
  method: QueryMethodTypes
  args: (Date | boolean)[]
}

function isTestObj(obj: any): obj is TestObj {
  return typeof obj.options !== 'undefined'
}

export const testRecurring = function (msg: string, testObj: TestObj | Partial<Options> | (() => TestObj), expectedDates: Date | Date[]) {
  let options: Partial<Options>
  let method: QueryMethodTypes
  let args: (Date | boolean)[]

  if (typeof testObj === 'function') {
    testObj = testObj()
  }

  if (isTestObj(testObj)) {
    options = testObj.options
    method = testObj.method
    args = testObj.args

  } else {
    options = testObj
    method = 'all'
    args = []
  }

  // Use text and string representation of the rrule as the message.
  msg = `${msg}  [${optionsToString(options)}]`

  it(msg, function () {
    const ctx = this.test.ctx
    let time = Date.now()
    let actualDates = rrulefns[method].call(this, options, ...args)
    time = Date.now() - time

    const maxTestDuration = 300
    expect(time).to.be.lessThan(maxTestDuration,
      `${options}\' method "${method}" should finish in ${maxTestDuration} ms, but took ${time} ms`)

    if (!(actualDates instanceof Array)) actualDates = [actualDates]
    if (!(expectedDates instanceof Array)) expectedDates = [expectedDates]

    assertDatesEqual(actualDates, expectedDates)

    // Additional tests using the expected dates
    // ==========================================================

    if (ctx.ALSO_TEST_SUBSECOND_PRECISION) {
      expect(actualDates.map(extractTime)).to.deep.equal(expectedDates.map(extractTime))
    }

    if (ctx.ALSO_TEST_STRING_FUNCTIONS) {
      // Test toString()/fromString()
      const str = optionsToString(options)
      const options2 = rrulefns.parse(str)
      const string2 = optionsToString(options2)
      expect(str).to.equal(string2, 'toString() == fromString(toString()).toString()')
      if (method === 'all') {
        assertDatesEqual(rrulefns.all(options2), expectedDates, 'fromString().all()')
      }
    }

    // if (ctx.ALSO_TEST_NLP_FUNCTIONS && options.isFullyConvertibleToText && options.isFullyConvertibleToText()) {
    //   // Test fromText()/toText().
    //   const str = options.toString()
    //   const text = options.toText()
    //   const rrule2 = RRule.fromText(text, options.options.dtstart)
    //   const text2 = rrule2.toText()
    //   expect(text2).to.equal(text, 'toText() == fromText(toText()).toText()')

    //   // Test fromText()/toString().
    //   const rrule3 = RRule.fromText(text, options.options.dtstart)
    //   expect(rrule3.toString()).to.equal(str, 'toString() == fromText(toText()).toString()')
    // }

    if (method === 'all' && ctx.ALSO_TEST_BEFORE_AFTER_BETWEEN) {
      // Test before, after, and between - use the expected dates.
      // create a clean copy of the rrule object to bypass caching
      options = Object.assign({}, options)

      if (expectedDates.length > 2) {
        // Test between()
        assertDatesEqual(
          rrulefns.between(
            options,
            expectedDates[0],
            expectedDates[expectedDates.length - 1],
            true
          ),
          expectedDates,
          'between, inc=true'
        )

        assertDatesEqual(
          rrulefns.between(
            options,
            expectedDates[0],
            expectedDates[expectedDates.length - 1],
            false
          ),
          expectedDates.slice(1, expectedDates.length - 1),
          'between, inc=false'
        )
      }

      if (expectedDates.length > 1) {
        let date
        let next
        let prev
        for (let i = 0; i < expectedDates.length; i++) {
          date = expectedDates[i]
          next = expectedDates[i + 1]
          prev = expectedDates[i - 1]

          // Test after() and before() with inc=true.
          assertDatesEqual([rrulefns.after(options, date, true)], [date], 'after, inc=true')
          assertDatesEqual([rrulefns.before(options, date, true)], [date], 'before, inc=true')

          // Test after() and before() with inc=false.
          next && assertDatesEqual([rrulefns.after(options, date, false)], [next], 'after, inc=false')
          prev && assertDatesEqual([rrulefns.before(options, date, false)], [prev], 'before, inc=false')
        }
      }
    }
  })
} as TestRecurring

testRecurring.skip = function () {
  it.skip.apply(it, arguments)
}

export function expectedDate(startDate: DateTime, currentLocalDate: DateTime, targetZone: string): Date {
  const targetOffset = startDate.setZone(targetZone).offset
  const { zoneName: systemZone } = currentLocalDate
  const {
    offset: systemOffset,
  } = startDate.setZone(systemZone)

  const netOffset = targetOffset - systemOffset
  const hours = -((netOffset / 60) % 24)
  const minutes = -(netOffset % 60)
  return startDate.plus({ hours, minutes }).toJSDate()
}
