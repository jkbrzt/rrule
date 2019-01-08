import { parse, datetime, testRecurring, expectedDate } from './lib/utils'
import { expect } from 'chai'
import { Frequency, Days, rrulestr } from '../src/index'
import { DateTime } from 'luxon'
import { set as setMockDate, reset as resetMockDate } from 'mockdate'
import { optionsToString } from '../src/optionstostring';
import * as rrulefns from '../src'

describe('RRule', function () {
  // Enable additional toString() / fromString() tests
  // for each testRecurring().
  this.ctx.ALSO_TEST_STRING_FUNCTIONS = true

  // Enable additional toText() / fromText() tests
  // for each testRecurring().
  // Many of the tests fail because the conversion is only approximate,
  // but it gives an idea about how well or bad it converts.
  this.ctx.ALSO_TEST_NLP_FUNCTIONS = false

  // Thorough after()/before()/between() tests.
  // NOTE: can take a longer time.
  this.ctx.ALSO_TEST_BEFORE_AFTER_BETWEEN = true

  this.ctx.ALSO_TEST_SUBSECOND_PRECISION = true

  it('rrulestr https://github.com/jkbrzt/rrule/pull/164', function () {
    const s1 = 'RRULE:FREQ=WEEKLY;WKST=WE'
    const s2 = rrulestr(s1).toString()
    expect(s1).equals(s2, s1 + ' => ' + s2)
  })
  
  it('rrulestr itteration not infinite when interval 0', function () {
    ['FREQ=YEARLY;INTERVAL=0;BYSETPOS=1;BYDAY=MO',
    'FREQ=MONTHLY;INTERVAL=0;BYSETPOS=1;BYDAY=MO',
    'FREQ=DAILY;INTERVAL=0;BYSETPOS=1;BYDAY=MO',
    'FREQ=HOURLY;INTERVAL=0;BYSETPOS=1;BYDAY=MO',
    'FREQ=MINUTELY;INTERVAL=0;BYSETPOS=1;BYDAY=MO',
    'FREQ=SECONDLY;INTERVAL=0;BYSETPOS=1;BYDAY=MO']
    .map((s) => expect(rrulestr(s).count()).to.equal(0))
  })

  // it('does not mutate the passed-in options object', function () {
  //   const options = {
  //     freq: Frequency.MONTHLY,
  //     dtstart: new Date(2013, 0, 1),
  //     count: 3,
  //     bymonthday: [28]
  //   }
  //   const rule = new RRule(options)

  //   expect(options).deep.equals({
  //     freq: Frequency.MONTHLY,
  //     dtstart: new Date(2013, 0, 1),
  //     count: 3,
  //     bymonthday: [28]
  //   })
  //   expect(rule.origOptions).deep.equals(options)
  // })

  testRecurring('missing Feb 28 https://github.com/jakubroztocil/rrule/issues/21',
    {
      freq: Frequency.MONTHLY,
      dtstart: new Date(Date.UTC(2013, 0, 1)),
      count: 3,
      bymonthday: [28]
    },
    [
      new Date(Date.UTC(2013, 0, 28)),
      new Date(Date.UTC(2013, 1, 28)),
      new Date(Date.UTC(2013, 2, 28))
    ]
  )

  // =============================================================================
    // The original `dateutil.rrule` test suite converted from Py to JS.
    // =============================================================================

  testRecurring('testBefore',
    {
      options: {
        freq: Frequency.DAILY,
        dtstart: parse('19970902T090000')
      },
      method: 'before',
      args: [parse('19970905T090000')]
    },
    datetime(1997, 9, 4, 9, 0)
  )

  testRecurring('testBeforeInc',
    {
      options: {
        freq: Frequency.DAILY,
        dtstart: parse('19970902T090000')
      },
      method: 'before',
      args: [parse('19970905T090000'), true]
    },
    datetime(1997, 9, 5, 9, 0)
  )

  testRecurring('testAfter',
    {
      options: {
        freq: Frequency.DAILY,
        dtstart: parse('19970902T090000')
      },
      method: 'after',
      args: [parse('19970904T090000')]
    },
    datetime(1997, 9, 5, 9, 0)
  )

  testRecurring('testAfterInc',
    {
      options: {
        freq: Frequency.DAILY,
        dtstart: parse('19970902T090000')
      },
      method: 'after',
      args: [parse('19970904T090000'), true]
    },
    datetime(1997, 9, 4, 9, 0)
  )

  testRecurring('testBetween',
    {
      options: {
        freq: Frequency.DAILY,
        dtstart: parse('19970902T090000')
      },
      method: 'between',
      args: [parse('19970902T090000'), parse('19970906T090000')]
    },
    [
      datetime(1997, 9, 3, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 5, 9, 0)
    ]
  )

  testRecurring('testBetweenInc',
    {
      options: {
        freq: Frequency.DAILY,
        dtstart: parse('19970902T090000')
      },
      method: 'between',
      args: [parse('19970902T090000'), parse('19970906T090000'), true]
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 3, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 5, 9, 0),
      datetime(1997, 9, 6, 9, 0)
    ]
  )

  testRecurring('testYearly',
    {
      freq: Frequency.YEARLY,
      count: 3,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1998, 9, 2, 9, 0),
      datetime(1999, 9, 2, 9, 0)
    ]
  )

  testRecurring('testYearlyInterval',
    {freq: Frequency.YEARLY,
      count: 3,
      interval: 2,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1999, 9, 2, 9, 0),
      datetime(2001, 9, 2, 9, 0)
    ]
  )

  testRecurring('testYearlyIntervalLarge',
    {freq: Frequency.YEARLY,
      count: 3,
      interval: 100,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(2097, 9, 2, 9, 0),
      datetime(2197, 9, 2, 9, 0)
    ]
  )

  testRecurring('testYearlyByMonth',
    {freq: Frequency.YEARLY,
      count: 3,
      bymonth: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 2, 9, 0),
      datetime(1998, 3, 2, 9, 0),
      datetime(1999, 1, 2, 9, 0)
    ]
  )

  testRecurring('testYearlyByMonthDay',
    {freq: Frequency.YEARLY,
      count: 3,
      bymonthday: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 3, 9, 0),
      datetime(1997, 10, 1, 9, 0),
      datetime(1997, 10, 3, 9, 0)
    ]
  )

  testRecurring('testYearlyByMonthAndMonthDay',
    {freq: Frequency.YEARLY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [5, 7],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 5, 9, 0),
      datetime(1998, 1, 7, 9, 0),
      datetime(1998, 3, 5, 9, 0)
    ]
  )

  testRecurring('testYearlyByWeekDay',
    {freq: Frequency.YEARLY,
      count: 3,
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 9, 9, 0)
    ]
  )

  testRecurring('testYearlyByNWeekDay',
    {freq: Frequency.YEARLY,
      count: 3,
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 25, 9, 0),
      datetime(1998, 1, 6, 9, 0),
      datetime(1998, 12, 31, 9, 0)
    ]
  )

  testRecurring('testYearlyByNWeekDayLarge',
    {freq: Frequency.YEARLY,
      count: 3,
      byweekday: [Days.TU.nth(3), Days.TH.nth(-3)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 11, 9, 0),
      datetime(1998, 1, 20, 9, 0),
      datetime(1998, 12, 17, 9, 0)
    ]
  )

  testRecurring('testYearlyByMonthAndWeekDay',
    {freq: Frequency.YEARLY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 1, 6, 9, 0),
      datetime(1998, 1, 8, 9, 0)
    ]
  )

  testRecurring('testYearlyByMonthAndNWeekDay',
    {freq: Frequency.YEARLY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 6, 9, 0),
      datetime(1998, 1, 29, 9, 0),
      datetime(1998, 3, 3, 9, 0)
    ]
  )

  testRecurring('testYearlyByMonthAndNWeekDayLarge',
    {freq: Frequency.YEARLY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU.nth(3), Days.TH.nth(-3)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 15, 9, 0),
      datetime(1998, 1, 20, 9, 0),
      datetime(1998, 3, 12, 9, 0)
    ]
  )

  testRecurring('testYearlyByMonthDayAndWeekDay',
    {freq: Frequency.YEARLY,
      count: 3,
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 2, 3, 9, 0),
      datetime(1998, 3, 3, 9, 0)
    ]
  )

  testRecurring('testYearlyByMonthAndMonthDayAndWeekDay',
    {freq: Frequency.YEARLY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 3, 3, 9, 0),
      datetime(2001, 3, 1, 9, 0)
    ]
  )

  testRecurring('testYearlyByYearDay',
    {freq: Frequency.YEARLY,
      count: 4,
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 9, 0),
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 4, 10, 9, 0),
      datetime(1998, 7, 19, 9, 0)
    ]
  )

  testRecurring('testYearlyByYearDayNeg',
    {freq: Frequency.YEARLY,
      count: 4,
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 9, 0),
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 4, 10, 9, 0),
      datetime(1998, 7, 19, 9, 0)
    ]
  )

  testRecurring('testYearlyByMonthAndYearDay',
    {freq: Frequency.YEARLY,
      count: 4,
      bymonth: [4, 7],
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 10, 9, 0),
      datetime(1998, 7, 19, 9, 0),
      datetime(1999, 4, 10, 9, 0),
      datetime(1999, 7, 19, 9, 0)
    ]
  )

  testRecurring('testYearlyByMonthAndYearDayNeg',
    {freq: Frequency.YEARLY,
      count: 4,
      bymonth: [4, 7],
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 10, 9, 0),
      datetime(1998, 7, 19, 9, 0),
      datetime(1999, 4, 10, 9, 0),
      datetime(1999, 7, 19, 9, 0)
    ]
  )

  testRecurring('testYearlyByWeekNo',
    {freq: Frequency.YEARLY,
      count: 3,
      byweekno: 20,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 5, 11, 9, 0),
      datetime(1998, 5, 12, 9, 0),
      datetime(1998, 5, 13, 9, 0)
    ]
  )

  testRecurring('testYearlyByWeekNoAndWeekDay',
    // That's a nice one. The first days of week number one
    // may be in the last year.
    {freq: Frequency.YEARLY,
      count: 3,
      byweekno: 1,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 29, 9, 0),
      datetime(1999, 1, 4, 9, 0),
      datetime(2000, 1, 3, 9, 0)
    ]
  )

  testRecurring('testYearlyByWeekNoAndWeekDayLarge',
    // Another nice test. The last days of week number 52/53
    // may be in the next year.
    {freq: Frequency.YEARLY,
      count: 3,
      byweekno: 52,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 9, 0),
      datetime(1998, 12, 27, 9, 0),
      datetime(2000, 1, 2, 9, 0)
    ]
  )

  testRecurring('testYearlyByWeekNoAndWeekDayLast',
    {freq: Frequency.YEARLY,
      count: 3,
      byweekno: -1,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 9, 0),
      datetime(1999, 1, 3, 9, 0),
      datetime(2000, 1, 2, 9, 0)
    ]
  )

  testRecurring('testYearlyByEaster',
    { count: 3,
      byeaster: 0,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 12, 9, 0),
      datetime(1999, 4, 4, 9, 0),
      datetime(2000, 4, 23, 9, 0)
    ]
  )

  testRecurring('testYearlyByEasterPos',
    {freq: Frequency.YEARLY,
      count: 3,
      byeaster: 1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 13, 9, 0),
      datetime(1999, 4, 5, 9, 0),
      datetime(2000, 4, 24, 9, 0)
    ]
  )

  testRecurring('testYearlyByEasterNeg',
    {freq: Frequency.YEARLY,
      count: 3,
      byeaster: -1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 11, 9, 0),
      datetime(1999, 4, 3, 9, 0),
      datetime(2000, 4, 22, 9, 0)
    ]
  )

  testRecurring('testYearlyByWeekNoAndWeekDay53',
    {freq: Frequency.YEARLY,
      count: 3,
      byweekno: 53,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 12, 28, 9, 0),
      datetime(2004, 12, 27, 9, 0),
      datetime(2009, 12, 28, 9, 0)
    ]
  )

  testRecurring('testYearlyByHour',
    {freq: Frequency.YEARLY,
      count: 3,
      byhour: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0),
      datetime(1998, 9, 2, 6, 0),
      datetime(1998, 9, 2, 18, 0)
    ]
  )

  testRecurring('testYearlyByMinute',
    {freq: Frequency.YEARLY,
      count: 3,
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6),
      datetime(1997, 9, 2, 9, 18),
      datetime(1998, 9, 2, 9, 6)
    ]
  )

  testRecurring('testYearlyBySecond',
    {freq: Frequency.YEARLY,
      count: 3,
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 6),
      datetime(1997, 9, 2, 9, 0, 18),
      datetime(1998, 9, 2, 9, 0, 6)
    ]
  )

  testRecurring('testYearlyByHourAndMinute',
    {freq: Frequency.YEARLY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6),
      datetime(1997, 9, 2, 18, 18),
      datetime(1998, 9, 2, 6, 6)
    ]
  )

  testRecurring('testYearlyByHourAndSecond',
    {freq: Frequency.YEARLY,
      count: 3,
      byhour: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0, 6),
      datetime(1997, 9, 2, 18, 0, 18),
      datetime(1998, 9, 2, 6, 0, 6)
    ]
  )

  testRecurring('testYearlyByMinuteAndSecond',
    {freq: Frequency.YEARLY,
      count: 3,
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6, 6),
      datetime(1997, 9, 2, 9, 6, 18),
      datetime(1997, 9, 2, 9, 18, 6)
    ]
  )

  testRecurring('testYearlyByHourAndMinuteAndSecond',
    {freq: Frequency.YEARLY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6, 6),
      datetime(1997, 9, 2, 18, 6, 18),
      datetime(1997, 9, 2, 18, 18, 6)
    ]
  )

  testRecurring('testYearlyBySetPos',
    {freq: Frequency.YEARLY,
      count: 3,
      bymonthday: 15,
      byhour: [6, 18],
      bysetpos: [3, -3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 11, 15, 18, 0),
      datetime(1998, 2, 15, 6, 0),
      datetime(1998, 11, 15, 18, 0)
    ]
  )

  testRecurring('testYearlyBetweenInc',
    {
      options: {
        freq: Frequency.YEARLY,
        dtstart: parse('20150101T000000')
      },
      method: 'between',
      args: [parse('20160101T000000'), parse('20160101T000000'), true]
    },
    [
      datetime(2016, 1, 1)
    ]
  )

  testRecurring('testYearlyBetweenIncLargeSpan',
    {
      options: {
        freq: Frequency.YEARLY,
        dtstart: parse('19200101T000000') // Error because date lower than dateutil.ORDINAL_BASE
      },
      method: 'between',
      args: [parse('20160101T000000'), parse('20160101T000000'), true]
    },
    [
      datetime(2016, 1, 1)
    ]
  )

  testRecurring('testMonthly',
    {freq: Frequency.MONTHLY,
      count: 3,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 10, 2, 9, 0),
      datetime(1997, 11, 2, 9, 0)
    ]
  )

  testRecurring('testMonthlyInterval',
    {freq: Frequency.MONTHLY,
      count: 3,
      interval: 2,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 11, 2, 9, 0),
      datetime(1998, 1, 2, 9, 0)
    ]
  )

  testRecurring('testMonthlyIntervalLarge',
    {freq: Frequency.MONTHLY,
      count: 3,
      interval: 18,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1999, 3, 2, 9, 0),
      datetime(2000, 9, 2, 9, 0)
    ]
  )

  testRecurring('testMonthlyByMonth',
    {freq: Frequency.MONTHLY,
      count: 3,
      bymonth: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 2, 9, 0),
      datetime(1998, 3, 2, 9, 0),
      datetime(1999, 1, 2, 9, 0)
    ]
  )

  testRecurring('testMonthlyByMonthDay',
    {freq: Frequency.MONTHLY,
      count: 3,
      bymonthday: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 3, 9, 0),
      datetime(1997, 10, 1, 9, 0),
      datetime(1997, 10, 3, 9, 0)
    ]
  )

  testRecurring('testMonthlyByMonthAndMonthDay',
    {freq: Frequency.MONTHLY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [5, 7],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 5, 9, 0),
      datetime(1998, 1, 7, 9, 0),
      datetime(1998, 3, 5, 9, 0)
    ]
  )

  testRecurring('testMonthlyByWeekDay',
    {freq: Frequency.MONTHLY,
      count: 3,
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 9, 9, 0)
    ]
  )

  testRecurring('testMonthlyByNWeekDay',
    {freq: Frequency.MONTHLY,
      count: 3,
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 25, 9, 0),
      datetime(1997, 10, 7, 9, 0)
    ]
  )

  testRecurring('testMonthlyByNWeekDayLarge',
    {freq: Frequency.MONTHLY,
      count: 3,
      byweekday: [Days.TU.nth(3), Days.TH.nth(-3)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 11, 9, 0),
      datetime(1997, 9, 16, 9, 0),
      datetime(1997, 10, 16, 9, 0)
    ]
  )

  testRecurring('testMonthlyByMonthAndWeekDay',
    {freq: Frequency.MONTHLY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 1, 6, 9, 0),
      datetime(1998, 1, 8, 9, 0)
    ]
  )

  testRecurring('testMonthlyByMonthAndNWeekDay',
    {freq: Frequency.MONTHLY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 6, 9, 0),
      datetime(1998, 1, 29, 9, 0),
      datetime(1998, 3, 3, 9, 0)
    ]
  )

  testRecurring('testMonthlyByMonthAndNWeekDayLarge',
    {freq: Frequency.MONTHLY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU.nth(3), Days.TH.nth(-3)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 15, 9, 0),
      datetime(1998, 1, 20, 9, 0),
      datetime(1998, 3, 12, 9, 0)
    ]
  )

  testRecurring('testMonthlyByMonthDayAndWeekDay',
    {freq: Frequency.MONTHLY,
      count: 3,
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 2, 3, 9, 0),
      datetime(1998, 3, 3, 9, 0)
    ]
  )

  testRecurring('testMonthlyByMonthAndMonthDayAndWeekDay',
    {freq: Frequency.MONTHLY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 3, 3, 9, 0),
      datetime(2001, 3, 1, 9, 0)
    ]
  )

  testRecurring('testMonthlyByYearDay',
    {freq: Frequency.MONTHLY,
      count: 4,
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 9, 0),
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 4, 10, 9, 0),
      datetime(1998, 7, 19, 9, 0)
    ]
  )

  testRecurring('testMonthlyByYearDayNeg',
    {freq: Frequency.MONTHLY,
      count: 4,
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 9, 0),
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 4, 10, 9, 0),
      datetime(1998, 7, 19, 9, 0)
    ]
  )

  testRecurring('testMonthlyByMonthAndYearDay',
    {freq: Frequency.MONTHLY,
      count: 4,
      bymonth: [4, 7],
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 10, 9, 0),
      datetime(1998, 7, 19, 9, 0),
      datetime(1999, 4, 10, 9, 0),
      datetime(1999, 7, 19, 9, 0)
    ]
  )

  testRecurring('testMonthlyByMonthAndYearDayNeg',
    {freq: Frequency.MONTHLY,
      count: 4,
      bymonth: [4, 7],
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 10, 9, 0),
      datetime(1998, 7, 19, 9, 0),
      datetime(1999, 4, 10, 9, 0),
      datetime(1999, 7, 19, 9, 0)
    ]
  )

  testRecurring('testMonthlyByWeekNo',
    {freq: Frequency.MONTHLY,
      count: 3,
      byweekno: 20,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 5, 11, 9, 0),
      datetime(1998, 5, 12, 9, 0),
      datetime(1998, 5, 13, 9, 0)
    ]
  )

  testRecurring('testMonthlyByWeekNoAndWeekDay',
    // That's a nice one. The first days of week number one
    // may be in the last year.
    {freq: Frequency.MONTHLY,
      count: 3,
      byweekno: 1,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 29, 9, 0),
      datetime(1999, 1, 4, 9, 0),
      datetime(2000, 1, 3, 9, 0)
    ]
  )

  testRecurring('testMonthlyByWeekNoAndWeekDayLarge',
    // Another nice test. The last days of week number 52/53
    // may be in the next year.
    {freq: Frequency.MONTHLY,
      count: 3,
      byweekno: 52,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 9, 0),
      datetime(1998, 12, 27, 9, 0),
      datetime(2000, 1, 2, 9, 0)
    ]
  )

  testRecurring('testMonthlyByWeekNoAndWeekDayLast',
    {freq: Frequency.MONTHLY,
      count: 3,
      byweekno: -1,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 9, 0),
      datetime(1999, 1, 3, 9, 0),
      datetime(2000, 1, 2, 9, 0)
    ]
  )

  testRecurring('testMonthlyByWeekNoAndWeekDay53',
    {freq: Frequency.MONTHLY,
      count: 3,
      byweekno: 53,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 12, 28, 9, 0),
      datetime(2004, 12, 27, 9, 0),
      datetime(2009, 12, 28, 9, 0)
    ]
  )

  testRecurring('testMonthlyByEaster',
    {freq: Frequency.MONTHLY,
      count: 3,
      byeaster: 0,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 12, 9, 0),
      datetime(1999, 4, 4, 9, 0),
      datetime(2000, 4, 23, 9, 0)
    ]
  )

  testRecurring('testMonthlyByEasterPos',
    {freq: Frequency.MONTHLY,
      count: 3,
      byeaster: 1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 13, 9, 0),
      datetime(1999, 4, 5, 9, 0),
      datetime(2000, 4, 24, 9, 0)
    ]
  )

  testRecurring('testMonthlyByEasterNeg',
    {freq: Frequency.MONTHLY,
      count: 3,
      byeaster: -1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 11, 9, 0),
      datetime(1999, 4, 3, 9, 0),
      datetime(2000, 4, 22, 9, 0)
    ]
  )

  testRecurring('testMonthlyByHour',
    {freq: Frequency.MONTHLY,
      count: 3,
      byhour: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0),
      datetime(1997, 10, 2, 6, 0),
      datetime(1997, 10, 2, 18, 0)
    ]
  )

  testRecurring('testMonthlyByMinute',
    {freq: Frequency.MONTHLY,
      count: 3,
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6),
      datetime(1997, 9, 2, 9, 18),
      datetime(1997, 10, 2, 9, 6)
    ]
  )

  testRecurring('testMonthlyBySecond',
    {freq: Frequency.MONTHLY,
      count: 3,
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 6),
      datetime(1997, 9, 2, 9, 0, 18),
      datetime(1997, 10, 2, 9, 0, 6)
    ]
  )

  testRecurring('testMonthlyByHourAndMinute',
    {freq: Frequency.MONTHLY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6),
      datetime(1997, 9, 2, 18, 18),
      datetime(1997, 10, 2, 6, 6)
    ]
  )

  testRecurring('testMonthlyByHourAndSecond',
    {freq: Frequency.MONTHLY,
      count: 3,
      byhour: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0, 6),
      datetime(1997, 9, 2, 18, 0, 18),
      datetime(1997, 10, 2, 6, 0, 6)
    ]
  )

  testRecurring('testMonthlyByMinuteAndSecond',
    {freq: Frequency.MONTHLY,
      count: 3,
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6, 6),
      datetime(1997, 9, 2, 9, 6, 18),
      datetime(1997, 9, 2, 9, 18, 6)
    ]
  )

  testRecurring('testMonthlyByHourAndMinuteAndSecond',
    {freq: Frequency.MONTHLY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6, 6),
      datetime(1997, 9, 2, 18, 6, 18),
      datetime(1997, 9, 2, 18, 18, 6)
    ]
  )

  testRecurring('testMonthlyBySetPos',
    {freq: Frequency.MONTHLY,
      count: 3,
      bymonthday: [13, 17],
      byhour: [6, 18],
      bysetpos: [3, -3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 13, 18, 0),
      datetime(1997, 9, 17, 6, 0),
      datetime(1997, 10, 13, 18, 0)
    ]
  )

  testRecurring('testMonthlyNegByMonthDayJanFebForNonLeapYear',
    {freq: Frequency.MONTHLY,
      count: 4,
      bymonthday: -1,
      dtstart: parse('20131201T0900000')
    },
    [
      datetime(2013, 12, 31, 9, 0),
      datetime(2014, 1, 31, 9, 0),
      datetime(2014, 2, 28, 9, 0),
      datetime(2014, 3, 31, 9, 0)
    ]
  )

  testRecurring('testMonthlyNegByMonthDayJanFebForLeapYear',
    {freq: Frequency.MONTHLY,
      count: 4,
      bymonthday: -1,
      dtstart: parse('20151201T0900000')
    },
    [
      datetime(2015, 12, 31, 9, 0),
      datetime(2016, 1, 31, 9, 0),
      datetime(2016, 2, 29, 9, 0),
      datetime(2016, 3, 31, 9, 0)
    ]
  )

  testRecurring('testWeekly',
    {freq: Frequency.WEEKLY,
      count: 3,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 9, 9, 0),
      datetime(1997, 9, 16, 9, 0)
    ]
  )

  testRecurring('testWeeklyInterval',
    {freq: Frequency.WEEKLY,
      count: 3,
      interval: 2,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 16, 9, 0),
      datetime(1997, 9, 30, 9, 0)
    ]
  )

  testRecurring('testWeeklyIntervalLarge',
    {freq: Frequency.WEEKLY,
      count: 3,
      interval: 20,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1998, 1, 20, 9, 0),
      datetime(1998, 6, 9, 9, 0)
    ]
  )

  testRecurring('testWeeklyByMonth',
    {freq: Frequency.WEEKLY,
      count: 3,
      bymonth: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 6, 9, 0),
      datetime(1998, 1, 13, 9, 0),
      datetime(1998, 1, 20, 9, 0)
    ]
  )

  testRecurring('testWeeklyByMonthDay',
    {freq: Frequency.WEEKLY,
      count: 3,
      bymonthday: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 3, 9, 0),
      datetime(1997, 10, 1, 9, 0),
      datetime(1997, 10, 3, 9, 0)
    ]
  )

  testRecurring('testWeeklyByMonthAndMonthDay',
    {freq: Frequency.WEEKLY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [5, 7],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 5, 9, 0),
      datetime(1998, 1, 7, 9, 0),
      datetime(1998, 3, 5, 9, 0)
    ]
  )

  testRecurring('testWeeklyByWeekDay',
    {freq: Frequency.WEEKLY,
      count: 3,
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 9, 9, 0)
    ]
  )

  testRecurring('testWeeklyByNWeekDay',
    {freq: Frequency.WEEKLY,
      count: 3,
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 9, 9, 0)
    ]
  )

  testRecurring('testWeeklyByMonthAndWeekDay',
    // This test is interesting, because it crosses the year
    // boundary in a weekly period to find day '1' as a
    // valid recurrence.
    {freq: Frequency.WEEKLY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 1, 6, 9, 0),
      datetime(1998, 1, 8, 9, 0)
    ]
  )

  testRecurring('testWeeklyByMonthAndNWeekDay',
    {freq: Frequency.WEEKLY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 1, 6, 9, 0),
      datetime(1998, 1, 8, 9, 0)
    ]
  )

  testRecurring('testWeeklyByMonthDayAndWeekDay',
    {freq: Frequency.WEEKLY,
      count: 3,
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 2, 3, 9, 0),
      datetime(1998, 3, 3, 9, 0)
    ]
  )

  testRecurring('testWeeklyByMonthAndMonthDayAndWeekDay',
    {freq: Frequency.WEEKLY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 3, 3, 9, 0),
      datetime(2001, 3, 1, 9, 0)
    ]
  )

  testRecurring('testWeeklyByYearDay',
    {freq: Frequency.WEEKLY,
      count: 4,
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 9, 0),
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 4, 10, 9, 0),
      datetime(1998, 7, 19, 9, 0)
    ]
  )

  testRecurring('testWeeklyByYearDayNeg',
    {freq: Frequency.WEEKLY,
      count: 4,
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 9, 0),
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 4, 10, 9, 0),
      datetime(1998, 7, 19, 9, 0)
    ]
  )

  testRecurring('testWeeklyByMonthAndYearDay',
    {freq: Frequency.WEEKLY,
      count: 4,
      bymonth: [1, 7],
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 7, 19, 9, 0),
      datetime(1999, 1, 1, 9, 0),
      datetime(1999, 7, 19, 9, 0)
    ]
  )

  testRecurring('testWeeklyByMonthAndYearDayNeg',
    {freq: Frequency.WEEKLY,
      count: 4,
      bymonth: [1, 7],
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 7, 19, 9, 0),
      datetime(1999, 1, 1, 9, 0),
      datetime(1999, 7, 19, 9, 0)
    ]
  )

  testRecurring('testWeeklyByWeekNo',
    {freq: Frequency.WEEKLY,
      count: 3,
      byweekno: 20,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 5, 11, 9, 0),
      datetime(1998, 5, 12, 9, 0),
      datetime(1998, 5, 13, 9, 0)
    ]
  )

  testRecurring('testWeeklyByWeekNoAndWeekDay',
    // That's a nice one. The first days of week number one
    // may be in the last year.
    {freq: Frequency.WEEKLY,
      count: 3,
      byweekno: 1,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 29, 9, 0),
      datetime(1999, 1, 4, 9, 0),
      datetime(2000, 1, 3, 9, 0)
    ]
  )

  testRecurring('testWeeklyByWeekNoAndWeekDayLarge',
    // Another nice test. The last days of week number 52/53
    // may be in the next year.
    {freq: Frequency.WEEKLY,
      count: 3,
      byweekno: 52,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 9, 0),
      datetime(1998, 12, 27, 9, 0),
      datetime(2000, 1, 2, 9, 0)
    ]
  )

  testRecurring('testWeeklyByWeekNoAndWeekDayLast',
    {freq: Frequency.WEEKLY,
      count: 3,
      byweekno: -1,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 9, 0),
      datetime(1999, 1, 3, 9, 0),
      datetime(2000, 1, 2, 9, 0)
    ]
  )

  testRecurring('testWeeklyByWeekNoAndWeekDay53',
    {freq: Frequency.WEEKLY,
      count: 3,
      byweekno: 53,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 12, 28, 9, 0),
      datetime(2004, 12, 27, 9, 0),
      datetime(2009, 12, 28, 9, 0)
    ]
  )

  testRecurring('testWeeklyByEaster',
    {freq: Frequency.WEEKLY,
      count: 3,
      byeaster: 0,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 12, 9, 0),
      datetime(1999, 4, 4, 9, 0),
      datetime(2000, 4, 23, 9, 0)
    ]
  )

  testRecurring('testWeeklyByEasterPos',
    {freq: Frequency.WEEKLY,
      count: 3,
      byeaster: 1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 13, 9, 0),
      datetime(1999, 4, 5, 9, 0),
      datetime(2000, 4, 24, 9, 0)
    ]
  )

  testRecurring('testWeeklyByEasterNeg',
    {freq: Frequency.WEEKLY,
      count: 3,
      byeaster: -1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 11, 9, 0),
      datetime(1999, 4, 3, 9, 0),
      datetime(2000, 4, 22, 9, 0)
    ]
  )

  testRecurring('testWeeklyByHour',
    {freq: Frequency.WEEKLY,
      count: 3,
      byhour: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0),
      datetime(1997, 9, 9, 6, 0),
      datetime(1997, 9, 9, 18, 0)
    ]
  )

  testRecurring('testWeeklyByMinute',
    {freq: Frequency.WEEKLY,
      count: 3,
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6),
      datetime(1997, 9, 2, 9, 18),
      datetime(1997, 9, 9, 9, 6)
    ]
  )

  testRecurring('testWeeklyBySecond',
    {freq: Frequency.WEEKLY,
      count: 3,
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 6),
      datetime(1997, 9, 2, 9, 0, 18),
      datetime(1997, 9, 9, 9, 0, 6)
    ]
  )

  testRecurring('testWeeklyByHourAndMinute',
    {freq: Frequency.WEEKLY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6),
      datetime(1997, 9, 2, 18, 18),
      datetime(1997, 9, 9, 6, 6)
    ]
  )

  testRecurring('testWeeklyByHourAndSecond',
    {freq: Frequency.WEEKLY,
      count: 3,
      byhour: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0, 6),
      datetime(1997, 9, 2, 18, 0, 18),
      datetime(1997, 9, 9, 6, 0, 6)
    ]
  )

  testRecurring('testWeeklyByMinuteAndSecond',
    {freq: Frequency.WEEKLY,
      count: 3,
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6, 6),
      datetime(1997, 9, 2, 9, 6, 18),
      datetime(1997, 9, 2, 9, 18, 6)
    ]
  )

  testRecurring('testWeeklyByHourAndMinuteAndSecond',
    {freq: Frequency.WEEKLY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6, 6),
      datetime(1997, 9, 2, 18, 6, 18),
      datetime(1997, 9, 2, 18, 18, 6)
    ]
  )

  testRecurring('testWeeklyBySetPos',
    {freq: Frequency.WEEKLY,
      count: 3,
      byweekday: [Days.TU, Days.TH],
      byhour: [6, 18],
      bysetpos: [3, -3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0),
      datetime(1997, 9, 4, 6, 0),
      datetime(1997, 9, 9, 18, 0)
    ]
  )

  testRecurring('testDaily',
    {freq: Frequency.DAILY,
      count: 3,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 3, 9, 0),
      datetime(1997, 9, 4, 9, 0)
    ]
  )

  testRecurring('testDailyInterval',
    {freq: Frequency.DAILY,
      count: 3,
      interval: 2,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 6, 9, 0)
    ]
  )

  testRecurring('testDailyIntervalLarge',
    {freq: Frequency.DAILY,
      count: 3,
      interval: 92,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 12, 3, 9, 0),
      datetime(1998, 3, 5, 9, 0)
    ]
  )

  testRecurring('testDailyByMonth',
    {freq: Frequency.DAILY,
      count: 3,
      bymonth: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 1, 2, 9, 0),
      datetime(1998, 1, 3, 9, 0)
    ]
  )

  testRecurring('testDailyByMonthDay',
    {freq: Frequency.DAILY,
      count: 3,
      bymonthday: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 3, 9, 0),
      datetime(1997, 10, 1, 9, 0),
      datetime(1997, 10, 3, 9, 0)
    ]
  )

  testRecurring('testDailyByMonthAndMonthDay',
    {freq: Frequency.DAILY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [5, 7],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 5, 9, 0),
      datetime(1998, 1, 7, 9, 0),
      datetime(1998, 3, 5, 9, 0)
    ]
  )

  testRecurring('testDailyByWeekDay',
    {freq: Frequency.DAILY,
      count: 3,
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 9, 9, 0)
    ]
  )

  testRecurring('testDailyByNWeekDay',
    {freq: Frequency.DAILY,
      count: 3,
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 9, 9, 0)
    ]
  )

  testRecurring('testDailyByMonthAndWeekDay',
    {freq: Frequency.DAILY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 1, 6, 9, 0),
      datetime(1998, 1, 8, 9, 0)
    ]
  )

  testRecurring('testDailyByMonthAndNWeekDay',
    {freq: Frequency.DAILY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 1, 6, 9, 0),
      datetime(1998, 1, 8, 9, 0)
    ]
  )

  testRecurring('testDailyByMonthDayAndWeekDay',
    {freq: Frequency.DAILY,
      count: 3,
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 2, 3, 9, 0),
      datetime(1998, 3, 3, 9, 0)
    ]
  )

  testRecurring('testDailyByMonthAndMonthDayAndWeekDay',
    {freq: Frequency.DAILY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 3, 3, 9, 0),
      datetime(2001, 3, 1, 9, 0)
    ]
  )

  testRecurring('testDailyByYearDay',
    {freq: Frequency.DAILY,
      count: 4,
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 9, 0),
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 4, 10, 9, 0),
      datetime(1998, 7, 19, 9, 0)
    ]
  )

  testRecurring('testDailyByYearDayNeg',
    {freq: Frequency.DAILY,
      count: 4,
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 9, 0),
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 4, 10, 9, 0),
      datetime(1998, 7, 19, 9, 0)
    ]
  )

  testRecurring('testDailyByMonthAndYearDay',
    {freq: Frequency.DAILY,
      count: 4,
      bymonth: [1, 7],
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 7, 19, 9, 0),
      datetime(1999, 1, 1, 9, 0),
      datetime(1999, 7, 19, 9, 0)
    ]
  )

  testRecurring('testDailyByMonthAndYearDayNeg',
    {freq: Frequency.DAILY,
      count: 4,
      bymonth: [1, 7],
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 9, 0),
      datetime(1998, 7, 19, 9, 0),
      datetime(1999, 1, 1, 9, 0),
      datetime(1999, 7, 19, 9, 0)
    ]
  )

  testRecurring('testDailyByWeekNo',
    {freq: Frequency.DAILY,
      count: 3,
      byweekno: 20,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 5, 11, 9, 0),
      datetime(1998, 5, 12, 9, 0),
      datetime(1998, 5, 13, 9, 0)
    ]
  )

  testRecurring('testDailyByWeekNoAndWeekDay',
    // That's a nice one. The first days of week number one
    // may be in the last year.
    {freq: Frequency.DAILY,
      count: 3,
      byweekno: 1,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 29, 9, 0),
      datetime(1999, 1, 4, 9, 0),
      datetime(2000, 1, 3, 9, 0)
    ]
  )

  testRecurring('testDailyByWeekNoAndWeekDayLarge',
    // Another nice test. The last days of week number 52/53
    // may be in the next year.
    {freq: Frequency.DAILY,
      count: 3,
      byweekno: 52,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 9, 0),
      datetime(1998, 12, 27, 9, 0),
      datetime(2000, 1, 2, 9, 0)
    ]
  )

  testRecurring('testDailyByWeekNoAndWeekDayLast',
    {freq: Frequency.DAILY,
      count: 3,
      byweekno: -1,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 9, 0),
      datetime(1999, 1, 3, 9, 0),
      datetime(2000, 1, 2, 9, 0)
    ]
  )

  testRecurring('testDailyByWeekNoAndWeekDay53',
    {freq: Frequency.DAILY,
      count: 3,
      byweekno: 53,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 12, 28, 9, 0),
      datetime(2004, 12, 27, 9, 0),
      datetime(2009, 12, 28, 9, 0)
    ]
  )

  testRecurring('testDailyByEaster',
    {freq: Frequency.DAILY,
      count: 3,
      byeaster: 0,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 12, 9, 0),
      datetime(1999, 4, 4, 9, 0),
      datetime(2000, 4, 23, 9, 0)
    ]
  )

  testRecurring('testDailyByEasterPos',
    {freq: Frequency.DAILY,
      count: 3,
      byeaster: 1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 13, 9, 0),
      datetime(1999, 4, 5, 9, 0),
      datetime(2000, 4, 24, 9, 0)
    ]
  )

  testRecurring('testDailyByEasterNeg',
    {freq: Frequency.DAILY,
      count: 3,
      byeaster: -1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 11, 9, 0),
      datetime(1999, 4, 3, 9, 0),
      datetime(2000, 4, 22, 9, 0)
    ]
  )

  testRecurring('testDailyByHour',
    {freq: Frequency.DAILY,
      count: 3,
      byhour: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0),
      datetime(1997, 9, 3, 6, 0),
      datetime(1997, 9, 3, 18, 0)
    ]
  )

  testRecurring('testDailyByMinute',
    {freq: Frequency.DAILY,
      count: 3,
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6),
      datetime(1997, 9, 2, 9, 18),
      datetime(1997, 9, 3, 9, 6)
    ]
  )

  testRecurring('testDailyBySecond',
    {freq: Frequency.DAILY,
      count: 3,
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 6),
      datetime(1997, 9, 2, 9, 0, 18),
      datetime(1997, 9, 3, 9, 0, 6)
    ]
  )

  testRecurring('testDailyByHourAndMinute',
    {freq: Frequency.DAILY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6),
      datetime(1997, 9, 2, 18, 18),
      datetime(1997, 9, 3, 6, 6)
    ]
  )

  testRecurring('testDailyByHourAndSecond',
    {freq: Frequency.DAILY,
      count: 3,
      byhour: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0, 6),
      datetime(1997, 9, 2, 18, 0, 18),
      datetime(1997, 9, 3, 6, 0, 6)
    ]
  )

  testRecurring('testDailyByMinuteAndSecond',
    {freq: Frequency.DAILY,
      count: 3,
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6, 6),
      datetime(1997, 9, 2, 9, 6, 18),
      datetime(1997, 9, 2, 9, 18, 6)
    ]
  )

  testRecurring('testDailyByHourAndMinuteAndSecond',
    {freq: Frequency.DAILY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6, 6),
      datetime(1997, 9, 2, 18, 6, 18),
      datetime(1997, 9, 2, 18, 18, 6)
    ]
  )

  testRecurring('testDailyBySetPos',
    {freq: Frequency.DAILY,
      count: 3,
      byhour: [6, 18],
      byminute: [15, 45],
      bysetpos: [3, -3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 15),
      datetime(1997, 9, 3, 6, 45),
      datetime(1997, 9, 3, 18, 15)
    ]
  )

  testRecurring('testHourly',
    {freq: Frequency.HOURLY,
      count: 3,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 2, 10, 0),
      datetime(1997, 9, 2, 11, 0)
    ]
  )

  testRecurring('testHourlyInterval',
    {freq: Frequency.HOURLY,
      count: 3,
      interval: 2,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 2, 11, 0),
      datetime(1997, 9, 2, 13, 0)
    ]
  )

  testRecurring('testHourlyIntervalLarge',
    {freq: Frequency.HOURLY,
      count: 3,
      interval: 769,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 10, 4, 10, 0),
      datetime(1997, 11, 5, 11, 0)
    ]
  )

  testRecurring('testHourlyByMonth',
    {freq: Frequency.HOURLY,
      count: 3,
      bymonth: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0),
      datetime(1998, 1, 1, 1, 0),
      datetime(1998, 1, 1, 2, 0)
    ]
  )

  testRecurring('testHourlyByMonthDay',
    {freq: Frequency.HOURLY,
      count: 3,
      bymonthday: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 3, 0, 0),
      datetime(1997, 9, 3, 1, 0),
      datetime(1997, 9, 3, 2, 0)
    ]
  )

  testRecurring('testHourlyByMonthAndMonthDay',
    {freq: Frequency.HOURLY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [5, 7],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 5, 0, 0),
      datetime(1998, 1, 5, 1, 0),
      datetime(1998, 1, 5, 2, 0)
    ]
  )

  testRecurring('testHourlyByWeekDay',
    {freq: Frequency.HOURLY,
      count: 3,
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 2, 10, 0),
      datetime(1997, 9, 2, 11, 0)
    ]
  )

  testRecurring('testHourlyByNWeekDay',
    {freq: Frequency.HOURLY,
      count: 3,
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 2, 10, 0),
      datetime(1997, 9, 2, 11, 0)
    ]
  )

  testRecurring('testHourlyByMonthAndWeekDay',
    {freq: Frequency.HOURLY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0),
      datetime(1998, 1, 1, 1, 0),
      datetime(1998, 1, 1, 2, 0)
    ]
  )

  testRecurring('testHourlyByMonthAndNWeekDay',
    {freq: Frequency.HOURLY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0),
      datetime(1998, 1, 1, 1, 0),
      datetime(1998, 1, 1, 2, 0)
    ]
  )

  testRecurring('testHourlyByMonthDayAndWeekDay',
    {freq: Frequency.HOURLY,
      count: 3,
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0),
      datetime(1998, 1, 1, 1, 0),
      datetime(1998, 1, 1, 2, 0)
    ]
  )

  testRecurring('testHourlyByMonthAndMonthDayAndWeekDay',
    {freq: Frequency.HOURLY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0),
      datetime(1998, 1, 1, 1, 0),
      datetime(1998, 1, 1, 2, 0)
    ]
  )

  testRecurring('testHourlyByYearDay',
    {freq: Frequency.HOURLY,
      count: 4,
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 0, 0),
      datetime(1997, 12, 31, 1, 0),
      datetime(1997, 12, 31, 2, 0),
      datetime(1997, 12, 31, 3, 0)
    ]
  )

  testRecurring('testHourlyByYearDayNeg',
    {freq: Frequency.HOURLY,
      count: 4,
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 0, 0),
      datetime(1997, 12, 31, 1, 0),
      datetime(1997, 12, 31, 2, 0),
      datetime(1997, 12, 31, 3, 0)
    ]
  )

  testRecurring('testHourlyByMonthAndYearDay',
    {freq: Frequency.HOURLY,
      count: 4,
      bymonth: [4, 7],
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 10, 0, 0),
      datetime(1998, 4, 10, 1, 0),
      datetime(1998, 4, 10, 2, 0),
      datetime(1998, 4, 10, 3, 0)
    ]
  )

  testRecurring('testHourlyByMonthAndYearDayNeg',
    {freq: Frequency.HOURLY,
      count: 4,
      bymonth: [4, 7],
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 10, 0, 0),
      datetime(1998, 4, 10, 1, 0),
      datetime(1998, 4, 10, 2, 0),
      datetime(1998, 4, 10, 3, 0)
    ]
  )

  testRecurring('testHourlyByWeekNo',
    {freq: Frequency.HOURLY,
      count: 3,
      byweekno: 20,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 5, 11, 0, 0),
      datetime(1998, 5, 11, 1, 0),
      datetime(1998, 5, 11, 2, 0)
    ]
  )

  testRecurring('testHourlyByWeekNoAndWeekDay',
    {freq: Frequency.HOURLY,
      count: 3,
      byweekno: 1,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 29, 0, 0),
      datetime(1997, 12, 29, 1, 0),
      datetime(1997, 12, 29, 2, 0)
    ]
  )

  testRecurring('testHourlyByWeekNoAndWeekDayLarge',
    {freq: Frequency.HOURLY,
      count: 3,
      byweekno: 52,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 0, 0),
      datetime(1997, 12, 28, 1, 0),
      datetime(1997, 12, 28, 2, 0)
    ]
  )

  testRecurring('testHourlyByWeekNoAndWeekDayLast',
    {freq: Frequency.HOURLY,
      count: 3,
      byweekno: -1,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 0, 0),
      datetime(1997, 12, 28, 1, 0),
      datetime(1997, 12, 28, 2, 0)
    ]
  )

  testRecurring('testHourlyByWeekNoAndWeekDay53',
    {freq: Frequency.HOURLY,
      count: 3,
      byweekno: 53,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 12, 28, 0, 0),
      datetime(1998, 12, 28, 1, 0),
      datetime(1998, 12, 28, 2, 0)
    ]
  )

  testRecurring.skip('testHourlyByEaster',
    {freq: Frequency.HOURLY,
      count: 3,
      byeaster: 0,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 12, 0, 0),
      datetime(1998, 4, 12, 1, 0),
      datetime(1998, 4, 12, 2, 0)
    ]
  )

  testRecurring.skip('testHourlyByEasterPos',
    {freq: Frequency.HOURLY,
      count: 3,
      byeaster: 1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 13, 0, 0),
      datetime(1998, 4, 13, 1, 0),
      datetime(1998, 4, 13, 2, 0)
    ]
  )

  testRecurring.skip('testHourlyByEasterNeg',
    {freq: Frequency.HOURLY,
      count: 3,
      byeaster: -1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 11, 0, 0),
      datetime(1998, 4, 11, 1, 0),
      datetime(1998, 4, 11, 2, 0)
    ]
  )

  testRecurring('testHourlyByHour',
    {freq: Frequency.HOURLY,
      count: 3,
      byhour: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0),
      datetime(1997, 9, 3, 6, 0),
      datetime(1997, 9, 3, 18, 0)
    ]
  )

  testRecurring('testHourlyByMinute',
    {freq: Frequency.HOURLY,
      count: 3,
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6),
      datetime(1997, 9, 2, 9, 18),
      datetime(1997, 9, 2, 10, 6)
    ]
  )

  testRecurring('testHourlyBySecond',
    {freq: Frequency.HOURLY,
      count: 3,
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 6),
      datetime(1997, 9, 2, 9, 0, 18),
      datetime(1997, 9, 2, 10, 0, 6)
    ]
  )

  testRecurring('testHourlyByHourAndMinute',
    {freq: Frequency.HOURLY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6),
      datetime(1997, 9, 2, 18, 18),
      datetime(1997, 9, 3, 6, 6)
    ]
  )

  testRecurring('testHourlyByHourAndSecond',
    {freq: Frequency.HOURLY,
      count: 3,
      byhour: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0, 6),
      datetime(1997, 9, 2, 18, 0, 18),
      datetime(1997, 9, 3, 6, 0, 6)
    ]
  )

  testRecurring('testHourlyByMinuteAndSecond',
    {freq: Frequency.HOURLY,
      count: 3,
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6, 6),
      datetime(1997, 9, 2, 9, 6, 18),
      datetime(1997, 9, 2, 9, 18, 6)
    ]
  )

  testRecurring('testHourlyByHourAndMinuteAndSecond',
    {freq: Frequency.HOURLY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6, 6),
      datetime(1997, 9, 2, 18, 6, 18),
      datetime(1997, 9, 2, 18, 18, 6)
    ]
  )

  testRecurring('testHourlyBySetPos',
    {freq: Frequency.HOURLY,
      count: 3,
      byminute: [15, 45],
      bysecond: [15, 45],
      bysetpos: [3, -3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 15, 45),
      datetime(1997, 9, 2, 9, 45, 15),
      datetime(1997, 9, 2, 10, 15, 45)
    ]
  )

  testRecurring('testMinutely',
    {freq: Frequency.MINUTELY,
      count: 3,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 2, 9, 1),
      datetime(1997, 9, 2, 9, 2)
    ]
  )

  testRecurring('testMinutelyInterval',
    {freq: Frequency.MINUTELY,
      count: 3,
      interval: 2,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 2, 9, 2),
      datetime(1997, 9, 2, 9, 4)
    ]
  )

  testRecurring('testMinutelyIntervalLarge',
    {freq: Frequency.MINUTELY,
      count: 3,
      interval: 1501,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 3, 10, 1),
      datetime(1997, 9, 4, 11, 2)
    ]
  )

  testRecurring('testMinutelyByMonth',
    {freq: Frequency.MINUTELY,
      count: 3,
      bymonth: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0),
      datetime(1998, 1, 1, 0, 1),
      datetime(1998, 1, 1, 0, 2)
    ]
  )

  testRecurring('testMinutelyByMonthDay',
    {freq: Frequency.MINUTELY,
      count: 3,
      bymonthday: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 3, 0, 0),
      datetime(1997, 9, 3, 0, 1),
      datetime(1997, 9, 3, 0, 2)
    ]
  )

  testRecurring('testMinutelyByMonthAndMonthDay',
    {freq: Frequency.MINUTELY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [5, 7],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 5, 0, 0),
      datetime(1998, 1, 5, 0, 1),
      datetime(1998, 1, 5, 0, 2)
    ]
  )

  testRecurring('testMinutelyByWeekDay',
    {freq: Frequency.MINUTELY,
      count: 3,
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 2, 9, 1),
      datetime(1997, 9, 2, 9, 2)
    ]
  )

  testRecurring('testMinutelyByNWeekDay',
    {freq: Frequency.MINUTELY,
      count: 3,
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 2, 9, 1),
      datetime(1997, 9, 2, 9, 2)
    ]
  )

  testRecurring('testMinutelyByMonthAndWeekDay',
    {freq: Frequency.MINUTELY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0),
      datetime(1998, 1, 1, 0, 1),
      datetime(1998, 1, 1, 0, 2)
    ]
  )

  testRecurring('testMinutelyByMonthAndNWeekDay',
    {freq: Frequency.MINUTELY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0),
      datetime(1998, 1, 1, 0, 1),
      datetime(1998, 1, 1, 0, 2)
    ]
  )

  testRecurring('testMinutelyByMonthDayAndWeekDay',
    {freq: Frequency.MINUTELY,
      count: 3,
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0),
      datetime(1998, 1, 1, 0, 1),
      datetime(1998, 1, 1, 0, 2)
    ]
  )

  testRecurring('testMinutelyByMonthAndMonthDayAndWeekDay',
    {freq: Frequency.MINUTELY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0),
      datetime(1998, 1, 1, 0, 1),
      datetime(1998, 1, 1, 0, 2)
    ]
  )

  testRecurring('testMinutelyByYearDay',
    {freq: Frequency.MINUTELY,
      count: 4,
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 0, 0),
      datetime(1997, 12, 31, 0, 1),
      datetime(1997, 12, 31, 0, 2),
      datetime(1997, 12, 31, 0, 3)
    ]
  )

  testRecurring('testMinutelyByYearDayNeg',
    {freq: Frequency.MINUTELY,
      count: 4,
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 0, 0),
      datetime(1997, 12, 31, 0, 1),
      datetime(1997, 12, 31, 0, 2),
      datetime(1997, 12, 31, 0, 3)
    ]
  )

  testRecurring('testMinutelyByMonthAndYearDay',
    {freq: Frequency.MINUTELY,
      count: 4,
      bymonth: [4, 7],
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 10, 0, 0),
      datetime(1998, 4, 10, 0, 1),
      datetime(1998, 4, 10, 0, 2),
      datetime(1998, 4, 10, 0, 3)
    ]
  )

  testRecurring('testMinutelyByMonthAndYearDayNeg',
    {freq: Frequency.MINUTELY,
      count: 4,
      bymonth: [4, 7],
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 10, 0, 0),
      datetime(1998, 4, 10, 0, 1),
      datetime(1998, 4, 10, 0, 2),
      datetime(1998, 4, 10, 0, 3)
    ]
  )

  testRecurring('testMinutelyByWeekNo',
    {freq: Frequency.MINUTELY,
      count: 3,
      byweekno: 20,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 5, 11, 0, 0),
      datetime(1998, 5, 11, 0, 1),
      datetime(1998, 5, 11, 0, 2)
    ]
  )

  testRecurring('testMinutelyByWeekNoAndWeekDay',
    {freq: Frequency.MINUTELY,
      count: 3,
      byweekno: 1,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 29, 0, 0),
      datetime(1997, 12, 29, 0, 1),
      datetime(1997, 12, 29, 0, 2)
    ]
  )

  testRecurring('testMinutelyByWeekNoAndWeekDayLarge',
    {freq: Frequency.MINUTELY,
      count: 3,
      byweekno: 52,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 0, 0),
      datetime(1997, 12, 28, 0, 1),
      datetime(1997, 12, 28, 0, 2)
    ]
  )

  testRecurring('testMinutelyByWeekNoAndWeekDayLast',
    {freq: Frequency.MINUTELY,
      count: 3,
      byweekno: -1,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 0, 0),
      datetime(1997, 12, 28, 0, 1),
      datetime(1997, 12, 28, 0, 2)
    ]
  )

  testRecurring('testMinutelyByWeekNoAndWeekDay53',
    {freq: Frequency.MINUTELY,
      count: 3,
      byweekno: 53,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 12, 28, 0, 0),
      datetime(1998, 12, 28, 0, 1),
      datetime(1998, 12, 28, 0, 2)
    ]
  )

  testRecurring.skip('testMinutelyByEaster',
    {freq: Frequency.MINUTELY,
      count: 3,
      byeaster: 0,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 12, 0, 0),
      datetime(1998, 4, 12, 0, 1),
      datetime(1998, 4, 12, 0, 2)
    ]
  )

  testRecurring.skip('testMinutelyByEasterPos',
    {freq: Frequency.MINUTELY,
      count: 3,
      byeaster: 1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 13, 0, 0),
      datetime(1998, 4, 13, 0, 1),
      datetime(1998, 4, 13, 0, 2)
    ]
  )

  testRecurring.skip('testMinutelyByEasterNeg',
    {freq: Frequency.MINUTELY,
      count: 3,
      byeaster: -1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 11, 0, 0),
      datetime(1998, 4, 11, 0, 1),
      datetime(1998, 4, 11, 0, 2)
    ]
  )

  testRecurring('testMinutelyByHour',
    {freq: Frequency.MINUTELY,
      count: 3,
      byhour: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0),
      datetime(1997, 9, 2, 18, 1),
      datetime(1997, 9, 2, 18, 2)
    ]
  )

  testRecurring('testMinutelyByMinute',
    {freq: Frequency.MINUTELY,
      count: 3,
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6),
      datetime(1997, 9, 2, 9, 18),
      datetime(1997, 9, 2, 10, 6)
    ]
  )

  testRecurring('testMinutelyBySecond',
    {freq: Frequency.MINUTELY,
      count: 3,
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 6),
      datetime(1997, 9, 2, 9, 0, 18),
      datetime(1997, 9, 2, 9, 1, 6)
    ]
  )

  testRecurring('testMinutelyByHourAndMinute',
    {freq: Frequency.MINUTELY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6),
      datetime(1997, 9, 2, 18, 18),
      datetime(1997, 9, 3, 6, 6)
    ]
  )

  testRecurring('testMinutelyByHourAndSecond',
    {freq: Frequency.MINUTELY,
      count: 3,
      byhour: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0, 6),
      datetime(1997, 9, 2, 18, 0, 18),
      datetime(1997, 9, 2, 18, 1, 6)
    ]
  )

  testRecurring('testMinutelyByMinuteAndSecond',
    {freq: Frequency.MINUTELY,
      count: 3,
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6, 6),
      datetime(1997, 9, 2, 9, 6, 18),
      datetime(1997, 9, 2, 9, 18, 6)
    ]
  )

  testRecurring('testMinutelyByHourAndMinuteAndSecond',
    {freq: Frequency.MINUTELY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6, 6),
      datetime(1997, 9, 2, 18, 6, 18),
      datetime(1997, 9, 2, 18, 18, 6)
    ]
  )

  testRecurring('testMinutelyBySetPos',
    {freq: Frequency.MINUTELY,
      count: 3,
      bysecond: [15, 30, 45],
      bysetpos: [3, -3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 15),
      datetime(1997, 9, 2, 9, 0, 45),
      datetime(1997, 9, 2, 9, 1, 15)
    ]
  )

  testRecurring('testSecondly',
    {freq: Frequency.SECONDLY,
      count: 3,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 0),
      datetime(1997, 9, 2, 9, 0, 1),
      datetime(1997, 9, 2, 9, 0, 2)
    ]
  )

  testRecurring('testSecondlyInterval',
    {freq: Frequency.SECONDLY,
      count: 3,
      interval: 2,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 0),
      datetime(1997, 9, 2, 9, 0, 2),
      datetime(1997, 9, 2, 9, 0, 4)
    ]
  )

  testRecurring('testSecondlyIntervalLarge',
    {freq: Frequency.SECONDLY,
      count: 3,
      interval: 90061,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 0),
      datetime(1997, 9, 3, 10, 1, 1),
      datetime(1997, 9, 4, 11, 2, 2)
    ]
  )

  testRecurring('testSecondlyByMonth',
    {freq: Frequency.SECONDLY,
      count: 3,
      bymonth: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0, 0),
      datetime(1998, 1, 1, 0, 0, 1),
      datetime(1998, 1, 1, 0, 0, 2)
    ]
  )

  testRecurring('testSecondlyByMonthDay',
    {freq: Frequency.SECONDLY,
      count: 3,
      bymonthday: [1, 3],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 3, 0, 0, 0),
      datetime(1997, 9, 3, 0, 0, 1),
      datetime(1997, 9, 3, 0, 0, 2)
    ]
  )

  testRecurring('testSecondlyByMonthAndMonthDay',
    {freq: Frequency.SECONDLY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [5, 7],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 5, 0, 0, 0),
      datetime(1998, 1, 5, 0, 0, 1),
      datetime(1998, 1, 5, 0, 0, 2)
    ]
  )

  testRecurring('testSecondlyByWeekDay',
    {freq: Frequency.SECONDLY,
      count: 3,
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 0),
      datetime(1997, 9, 2, 9, 0, 1),
      datetime(1997, 9, 2, 9, 0, 2)
    ]
  )

  testRecurring('testSecondlyByNWeekDay',
    {freq: Frequency.SECONDLY,
      count: 3,
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 0),
      datetime(1997, 9, 2, 9, 0, 1),
      datetime(1997, 9, 2, 9, 0, 2)
    ]
  )

  testRecurring('testSecondlyByMonthAndWeekDay',
    {freq: Frequency.SECONDLY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0, 0),
      datetime(1998, 1, 1, 0, 0, 1),
      datetime(1998, 1, 1, 0, 0, 2)
    ]
  )

  testRecurring('testSecondlyByMonthAndNWeekDay',
    {freq: Frequency.SECONDLY,
      count: 3,
      bymonth: [1, 3],
      byweekday: [Days.TU.nth(1), Days.TH.nth(-1)],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0, 0),
      datetime(1998, 1, 1, 0, 0, 1),
      datetime(1998, 1, 1, 0, 0, 2)
    ]
  )

  testRecurring('testSecondlyByMonthDayAndWeekDay',
    {freq: Frequency.SECONDLY,
      count: 3,
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0, 0),
      datetime(1998, 1, 1, 0, 0, 1),
      datetime(1998, 1, 1, 0, 0, 2)
    ]
  )

  testRecurring('testSecondlyByMonthAndMonthDayAndWeekDay',
    {freq: Frequency.SECONDLY,
      count: 3,
      bymonth: [1, 3],
      bymonthday: [1, 3],
      byweekday: [Days.TU, Days.TH],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 1, 1, 0, 0, 0),
      datetime(1998, 1, 1, 0, 0, 1),
      datetime(1998, 1, 1, 0, 0, 2)
    ]
  )

  testRecurring('testSecondlyByYearDay',
    {freq: Frequency.SECONDLY,
      count: 4,
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 0, 0, 0),
      datetime(1997, 12, 31, 0, 0, 1),
      datetime(1997, 12, 31, 0, 0, 2),
      datetime(1997, 12, 31, 0, 0, 3)
    ]
  )

  testRecurring('testSecondlyByYearDayNeg',
    {freq: Frequency.SECONDLY,
      count: 4,
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 31, 0, 0, 0),
      datetime(1997, 12, 31, 0, 0, 1),
      datetime(1997, 12, 31, 0, 0, 2),
      datetime(1997, 12, 31, 0, 0, 3)
    ]
  )

  testRecurring('testSecondlyByMonthAndYearDay',
    {freq: Frequency.SECONDLY,
      count: 4,
      bymonth: [4, 7],
      byyearday: [1, 100, 200, 365],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 10, 0, 0, 0),
      datetime(1998, 4, 10, 0, 0, 1),
      datetime(1998, 4, 10, 0, 0, 2),
      datetime(1998, 4, 10, 0, 0, 3)
    ]
  )

  testRecurring('testSecondlyByMonthAndYearDayNeg',
    {freq: Frequency.SECONDLY,
      count: 4,
      bymonth: [4, 7],
      byyearday: [-365, -266, -166, -1],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 10, 0, 0, 0),
      datetime(1998, 4, 10, 0, 0, 1),
      datetime(1998, 4, 10, 0, 0, 2),
      datetime(1998, 4, 10, 0, 0, 3)
    ]
  )

  testRecurring('testSecondlyByWeekNo',
    {freq: Frequency.SECONDLY,
      count: 3,
      byweekno: 20,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 5, 11, 0, 0, 0),
      datetime(1998, 5, 11, 0, 0, 1),
      datetime(1998, 5, 11, 0, 0, 2)
    ]
  )

  testRecurring('testSecondlyByWeekNoAndWeekDay',
    {freq: Frequency.SECONDLY,
      count: 3,
      byweekno: 1,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 29, 0, 0, 0),
      datetime(1997, 12, 29, 0, 0, 1),
      datetime(1997, 12, 29, 0, 0, 2)
    ]
  )

  testRecurring('testSecondlyByWeekNoAndWeekDayLarge',
    {freq: Frequency.SECONDLY,
      count: 3,
      byweekno: 52,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 0, 0, 0),
      datetime(1997, 12, 28, 0, 0, 1),
      datetime(1997, 12, 28, 0, 0, 2)
    ]
  )

  testRecurring('testSecondlyByWeekNoAndWeekDayLast',
    {freq: Frequency.SECONDLY,
      count: 3,
      byweekno: -1,
      byweekday: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 12, 28, 0, 0, 0),
      datetime(1997, 12, 28, 0, 0, 1),
      datetime(1997, 12, 28, 0, 0, 2)
    ]
  )

  testRecurring('testSecondlyByWeekNoAndWeekDay53',
    {freq: Frequency.SECONDLY,
      count: 3,
      byweekno: 53,
      byweekday: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 12, 28, 0, 0, 0),
      datetime(1998, 12, 28, 0, 0, 1),
      datetime(1998, 12, 28, 0, 0, 2)
    ]
  )

  testRecurring.skip('testSecondlyByEaster',
    {freq: Frequency.SECONDLY,
      count: 3,
      byeaster: 0,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 12, 0, 0, 0),
      datetime(1998, 4, 12, 0, 0, 1),
      datetime(1998, 4, 12, 0, 0, 2)
    ]
  )

  testRecurring.skip('testSecondlyByEasterPos',
    {freq: Frequency.SECONDLY,
      count: 3,
      byeaster: 1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 13, 0, 0, 0),
      datetime(1998, 4, 13, 0, 0, 1),
      datetime(1998, 4, 13, 0, 0, 2)
    ]
  )

  testRecurring.skip('testSecondlyByEasterNeg',
    {freq: Frequency.SECONDLY,
      count: 3,
      byeaster: -1,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1998, 4, 11, 0, 0, 0),
      datetime(1998, 4, 11, 0, 0, 1),
      datetime(1998, 4, 11, 0, 0, 2)
    ]
  )

  testRecurring('testSecondlyByHour',
    {freq: Frequency.SECONDLY,
      count: 3,
      byhour: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0, 0),
      datetime(1997, 9, 2, 18, 0, 1),
      datetime(1997, 9, 2, 18, 0, 2)
    ]
  )

  testRecurring('testSecondlyByMinute',
    {freq: Frequency.SECONDLY,
      count: 3,
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6, 0),
      datetime(1997, 9, 2, 9, 6, 1),
      datetime(1997, 9, 2, 9, 6, 2)
    ]
  )

  testRecurring('testSecondlyBySecond',
    {freq: Frequency.SECONDLY,
      count: 3,
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0, 6),
      datetime(1997, 9, 2, 9, 0, 18),
      datetime(1997, 9, 2, 9, 1, 6)
    ]
  )

  testRecurring('testSecondlyByHourAndMinute',
    {freq: Frequency.SECONDLY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6, 0),
      datetime(1997, 9, 2, 18, 6, 1),
      datetime(1997, 9, 2, 18, 6, 2)
    ]
  )

  testRecurring('testSecondlyByHourAndSecond',
    {freq: Frequency.SECONDLY,
      count: 3,
      byhour: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 0, 6),
      datetime(1997, 9, 2, 18, 0, 18),
      datetime(1997, 9, 2, 18, 1, 6)
    ]
  )

  testRecurring('testSecondlyByMinuteAndSecond',
    {freq: Frequency.SECONDLY,
      count: 3,
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 6, 6),
      datetime(1997, 9, 2, 9, 6, 18),
      datetime(1997, 9, 2, 9, 18, 6)
    ]
  )

  testRecurring('testSecondlyByHourAndMinuteAndSecond',
    {freq: Frequency.SECONDLY,
      count: 3,
      byhour: [6, 18],
      byminute: [6, 18],
      bysecond: [6, 18],
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 18, 6, 6),
      datetime(1997, 9, 2, 18, 6, 18),
      datetime(1997, 9, 2, 18, 18, 6)
    ]
  )

  testRecurring('testUntilNotMatching',
    {freq: Frequency.DAILY,
      count: 3,
      dtstart: parse('19970902T090000'),
      until: parse('19970905T080000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 3, 9, 0),
      datetime(1997, 9, 4, 9, 0)
    ]
  )

  testRecurring('testUntilMatching',
    {freq: Frequency.DAILY,
      count: 3,
      dtstart: parse('19970902T090000'),
      until: parse('19970904T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 3, 9, 0),
      datetime(1997, 9, 4, 9, 0)
    ]
  )

  testRecurring('testUntilSingle',
    {freq: Frequency.DAILY,
      count: 3,
      dtstart: parse('19970902T090000'),
      until: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0)
    ]
  )

  testRecurring('testUntilEmpty',
    {freq: Frequency.DAILY,
      count: 3,
      dtstart: parse('19970902T090000'),
      until: parse('19970901T090000')
    },
    []
  )

  testRecurring('testUntilWithDate',
    {freq: Frequency.DAILY,
      count: 3,
      dtstart: parse('19970902T090000'),
      until: datetime(1997, 9, 5)
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 3, 9, 0),
      datetime(1997, 9, 4, 9, 0)
    ]
  )

  testRecurring('testWkStIntervalMO',
    {freq: Frequency.WEEKLY,
      count: 3,
      interval: 2,
      byweekday: [Days.TU, Days.SU],
      wkst: Days.MO,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 7, 9, 0),
      datetime(1997, 9, 16, 9, 0)
    ]
  )

  testRecurring('testWkStIntervalSU',
    {freq: Frequency.WEEKLY,
      count: 3,
      interval: 2,
      byweekday: [Days.TU, Days.SU],
      wkst: Days.SU,
      dtstart: parse('19970902T090000')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 14, 9, 0),
      datetime(1997, 9, 16, 9, 0)
    ]
  )

  testRecurring('testDTStartIsDate',
    {freq: Frequency.DAILY,
      count: 3,
      dtstart: datetime(1997, 9, 2)
    },
    [
      datetime(1997, 9, 2, 0, 0),
      datetime(1997, 9, 3, 0, 0),
      datetime(1997, 9, 4, 0, 0)
    ]
  )

  testRecurring('testDTStartWithMicroseconds',
    {freq: Frequency.DAILY,
      count: 3,
      dtstart: parse('19970902T090000.5')
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 3, 9, 0),
      datetime(1997, 9, 4, 9, 0)
    ]
  )

  testRecurring('testMaxYear',
    {freq: Frequency.YEARLY,
      count: 3,
      bymonth: 2,
      bymonthday: 31,
      dtstart: parse('99970902T090000')
    },
    []
  )

  testRecurring('testSubsecondStartYearly',
    {
      freq: Frequency.YEARLY,
      count: 1,
      dtstart: new Date(1420063200001)
    },
    [
      new Date(1420063200001)
    ]
  )

  testRecurring('testSubsecondStartMonthlyByMonthDay',
    {
      freq: Frequency.MONTHLY,
      count: 1,
      bysetpos: [-1, 1],
      dtstart: new Date(1356991200001)
    },
    [
      new Date(1356991200001)
    ]
  )

  it('testAfterBefore', function () {
    'YEARLY,MONTHLY,DAILY,HOURLY,MINUTELY,SECONDLY'.split(',').forEach(function (freqStr: keyof typeof Frequency) {
      const date = new Date(1356991200001)
      const options = {
        freq: Frequency[freqStr],
        dtstart: date
      }

      expect(date.getTime()).equals(options.dtstart.getTime(),
        'the supplied dtstart differs from RRule.options.dtstart')
      let res: Date = rrulefns.before(options, rrulefns.after(options, options.dtstart))

      let resTimestamp: number
      if (res != null) resTimestamp = res.getTime()
      expect(resTimestamp).equals(options.dtstart.getTime(),
        'after dtstart , followed by before does not return dtstart')
    })
  })

  it('testConvertAndBack', function () {
    [6, Days.SU].forEach(function (wkst) {
      const options = {
        dtstart: new Date(Date.UTC(2017, 9, 17, 0, 30, 0, 0)),
        until: new Date(Date.UTC(2017, 11, 22, 1, 30, 0, 0)),
        freq: Frequency.MONTHLY,
        interval: 1,
        bysetpos: 17,
        byweekday: [Days.SU, Days.MO, Days.TU, Days.WE, Days.TH, Days.FR, Days.SA],
        wkst: wkst,
        byhour: 11,
        byminute: 0,
        bysecond: 0
      }

      const rrstr = optionsToString(options)
      expect(rrstr).equals('DTSTART:20171017T003000Z\nRRULE:UNTIL=20171222T013000Z;FREQ=MONTHLY;INTERVAL=1;BYSETPOS=17;BYDAY=SU,MO,TU,WE,TH,FR,SA;WKST=SU;BYHOUR=11;BYMINUTE=0;BYSECOND=0')
      // const newrr = RRule.fromString(rrstr)
      // expect(rrstr).equals(newrr.toString())
    })
  })

  it('testByHourValues', function () {
    [
      ['DTSTART:20171101T010000Z\nRRULE:UNTIL=20171214T013000Z;FREQ=DAILY;INTERVAL=2;WKST=MO;BYHOUR=11,12;BYMINUTE=30;BYSECOND=0', 'every 2 days at 11 and 12 until December 13, 2017'],
      ['DTSTART:20171101T010000Z\nRRULE:UNTIL=20171214T013000Z;FREQ=DAILY;INTERVAL=2;WKST=MO;BYHOUR=11;BYMINUTE=30;BYSECOND=0', 'every 2 days at 11 until December 13, 2017']
    ].forEach(function (pair) {
      const rule = pair[0]
      const options = rrulefns.parse(rule)
      // tslint:disable-next-line:no-unused-expression
      // expect(rr.toText()).to.be.ok
      // assert.equal(rr.toText(), pair[1]) -- can't test this because it reports in local time which varies by machine
    })
  })

  it('calculates daily recurrences correctly across DST boundaries', () => {
    const options = rrulefns.parse('DTSTART=20181101T110000Z;UNTIL=20181106T110000Z;FREQ=DAILY')
    expect(rrulefns.all(options)).to.deep.equal([
      new Date('2018-11-01T11:00:00.000Z'),
      new Date('2018-11-02T11:00:00.000Z'),
      new Date('2018-11-03T11:00:00.000Z'),
      new Date('2018-11-04T11:00:00.000Z'),
      new Date('2018-11-05T11:00:00.000Z'),
      new Date('2018-11-06T11:00:00.000Z')
    ])
  })

  it('calculates weekly recurrences correctly across DST boundaries', () => {
    const options = rrulefns.parse('DTSTART=20181031T180000Z\nRRULE:FREQ=WEEKLY;UNTIL=20181115T050000Z')
    expect(rrulefns.all(options)).to.deep.equal([
      new Date('2018-10-31T18:00:00.000Z'),
      new Date('2018-11-07T18:00:00.000Z'),
      new Date('2018-11-14T18:00:00.000Z')
    ])
  })

  it('calculates byweekday recurrences correctly across DST boundaries', () => {
    const options = {
      freq: Frequency.WEEKLY,
      dtstart: new Date(Date.UTC(2018, 9, 0, 0, 0, 0)),
      interval: 1,
      byweekday: [Days.SU, Days.WE],
      until: new Date(Date.UTC(2018, 9, 9, 0, 0, 0))
    }

    expect(rrulefns.all(options)).to.deep.equal([
      new Date('2018-09-30T00:00:00.000Z'),
      new Date('2018-10-03T00:00:00.000Z'),
      new Date('2018-10-07T00:00:00.000Z')
    ])
  })

  it('generates weekly events (#247)', () => {
    const startEvent = 1533895200000
    const endSearch = 1543618799999

    const options = {
      freq: Frequency.WEEKLY,
      interval: 1,
      dtstart: new Date(startEvent),
      until: new Date(endSearch)
    }

    expect(rrulefns.all(options)).to.deep.equal([
      new Date('2018-08-10T10:00:00.000Z'),
      new Date('2018-08-17T10:00:00.000Z'),
      new Date('2018-08-24T10:00:00.000Z'),
      new Date('2018-08-31T10:00:00.000Z'),
      new Date('2018-09-07T10:00:00.000Z'),
      new Date('2018-09-14T10:00:00.000Z'),
      new Date('2018-09-21T10:00:00.000Z'),
      new Date('2018-09-28T10:00:00.000Z'),
      new Date('2018-10-05T10:00:00.000Z'),
      new Date('2018-10-12T10:00:00.000Z'),
      new Date('2018-10-19T10:00:00.000Z'),
      new Date('2018-10-26T10:00:00.000Z'),
      new Date('2018-11-02T10:00:00.000Z'),
      new Date('2018-11-09T10:00:00.000Z'),
      new Date('2018-11-16T10:00:00.000Z'),
      new Date('2018-11-23T10:00:00.000Z'),
      new Date('2018-11-30T10:00:00.000Z')
    ])
  })

  it('generates monthly (#233)', () => {
    const start = new Date(Date.parse('Mon Aug 06 2018 10:30:00 GMT+0530'))
    const end = new Date(Date.parse('Mon Oct 08 2018 11:00:00 GMT+0530'))

    const options = {
      freq: Frequency.MONTHLY,
      interval: 1,
      dtstart: start,
      until: end
    }

    expect(rrulefns.all(options)).to.deep.equal([
      new Date('2018-08-06T05:00:00.000Z'),
      new Date('2018-09-06T05:00:00.000Z'),
      new Date('2018-10-06T05:00:00.000Z')
    ])
  })

  it('generates around dst (#249)', () => {
    const ruleString = 'DTSTART:20181101T120000Z\nRRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR;COUNT=4;WKST=SU'
    const options = rrulefns.parse(ruleString)

    expect(rrulefns.all(options)).to.deep.equal([
      new Date('2018-11-02T12:00:00.000Z'),
      new Date('2018-11-05T12:00:00.000Z'),
      new Date('2018-11-07T12:00:00.000Z'),
      new Date('2018-11-09T12:00:00.000Z')
    ])
  })

  it('handles 3-digit years properly (#202)', () => {
    const options = {
      count: 1,
      dtstart: new Date(Date.UTC(990, 0, 1, 0, 0, 0))
    }
    const ruleString = optionsToString(options)
    const options2 = rrulefns.parse(ruleString)
    expect(options).to.deep.equal(options2)

    expect(ruleString).to.equal('DTSTART:09900101T000000Z\nRRULE:COUNT=1')
    expect(rrulefns.count(options)).to.equal(1)
    expect(rrulefns.all(options)).to.deep.equal([
      new Date(Date.UTC(990, 0, 1, 0, 0, 0))
    ])
  })

  describe('time zones', () => {
    const targetZone = 'America/Los_Angeles'
    const startDate = DateTime.utc(2013, 8, 6, 11, 0, 0)
    const dtstart = startDate.toJSDate()

    it('generates correct recurrences when recurrence is in dst and current time is standard time', () => {
      const currentLocalDate = DateTime.local(2013, 2, 6, 11, 0, 0)
      setMockDate(currentLocalDate.toJSDate())

      const options = {
        dtstart,
        count: 1,
        tzid: targetZone
      }
      const recurrence = rrulefns.all(options)[0]
      const expected = expectedDate(startDate, currentLocalDate, targetZone)

      expect(recurrence)
        .to.deep.equal(
          expected 
        )

      resetMockDate()
    })

    it('generates correct recurrences when recurrence is in dst and current time is dst', () => {
      const currentLocalDate = DateTime.local(2013, 8, 6, 11, 0, 0)
      setMockDate(currentLocalDate.toJSDate())

      const options = {
        dtstart,
        count: 1,
        tzid: targetZone
      }
      const recurrence = rrulefns.all(options)[0]
      const expected = expectedDate(startDate, currentLocalDate, targetZone)

      expect(recurrence)
        .to.deep.equal(
          expected 
        )

      resetMockDate()
    })

    it('generates correct recurrences when recurrence is in dst and current time is standard time', () => {
      const currentLocalDate = DateTime.local(2013, 2, 6, 11, 0, 0)
      setMockDate(currentLocalDate.toJSDate())

      const options = {
        dtstart,
        count: 1,
        tzid: targetZone
      }
      const recurrence = rrulefns.after(options, new Date(0))
      const expected = expectedDate(startDate, currentLocalDate, targetZone)

      expect(recurrence)
        .to.deep.equal(
          expected 
        )

      resetMockDate()
    })
  })

  it('throws an error when dtstart is invalid', () => {
    const invalidDate = new Date(undefined)
    const validDate = new Date(Date.UTC(2017, 0, 1))
    expect(() => rrulefns.all({ dtstart: invalidDate })).to.throw('Invalid options: dtstart')
    expect(() => rrulefns.all({ dtstart: validDate, until: invalidDate })).to.throw('Invalid options: until')

    const options = {
      dtstart: new Date(Date.UTC(2017, 0, 1)),
      freq: Frequency.DAILY,
      interval: 1
    }

    expect(() => rrulefns.after(options, invalidDate)).to.throw('Invalid date passed in to RRule.after')
    expect(() => rrulefns.before(options, invalidDate)).to.throw('Invalid date passed in to RRule.before')
    expect(() => rrulefns.between(options, invalidDate, validDate)).to.throw('Invalid date passed in to RRule.between')
    expect(() => rrulefns.between(options, validDate, invalidDate)).to.throw('Invalid date passed in to RRule.between')
  })
})
