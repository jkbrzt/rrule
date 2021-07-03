import { parse, datetime, testRecurring, expectedDate } from './lib/utils'
import { RRule, RRuleSet, rrulestr, Frequency } from '../src';

import { DateTime } from 'luxon'
import { expect } from 'chai'
import { set as setMockDate, reset as resetMockDate } from 'mockdate'

describe('RRuleSet', function () {
  // Enable additional toString() / fromString() tests
  // for each testRecurring().
  // this.ctx.ALSO_TEST_STRING_FUNCTIONS = false

  // Thorough after()/before()/between() tests.
  // NOTE: can take a longer time.
  this.ctx.ALSO_TEST_BEFORE_AFTER_BETWEEN = true

  testRecurring('testSet',
    function () {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 2,
        byweekday: RRule.TU,
        dtstart: parse('19970902T090000')
      }))
      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 1,
        byweekday: RRule.TH,
        dtstart: parse('19970902T090000')
      }))
      return set
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 9, 9, 0)
    ]
  )

  testRecurring('testSetDate',
    function () {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 1,
        byweekday: RRule.TU,
        dtstart: parse('19970902T090000')
      }))
      set.rdate(datetime(1997, 9, 4, 9))
      set.rdate(datetime(1997, 9, 9, 9))
      return set
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 9, 9, 0)
    ]
  )

  testRecurring('testSetExRule',
    function () {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 6,
        byweekday: [RRule.TU, RRule.TH],
        dtstart: parse('19970902T090000')
      }))

      set.exrule(new RRule({
        freq: RRule.YEARLY,
        count: 3,
        byweekday: RRule.TH,
        dtstart: parse('19970902T090000')
      }))
      return set
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 9, 9, 0),
      datetime(1997, 9, 16, 9, 0)
    ]
  )

  testRecurring('testSetExDate',
    function () {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 6,
        byweekday: [RRule.TU, RRule.TH],
        dtstart: parse('19970902T090000')
      }))
      set.exdate(datetime(1997, 9, 4, 9))
      set.exdate(datetime(1997, 9, 11, 9))
      set.exdate(datetime(1997, 9, 18, 9))
      return set
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 9, 9, 0),
      datetime(1997, 9, 16, 9, 0)
    ]
  )

  testRecurring('testSetExDateRevOrder',
    function () {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.MONTHLY,
        count: 5,
        bymonthday: 10,
        dtstart: parse('20040101T090000')
      }))
      set.exdate(datetime(2004, 4, 10, 9, 0))
      set.exdate(datetime(2004, 2, 10, 9, 0))
      return set
    },
    [
      datetime(2004, 1, 10, 9, 0),
      datetime(2004, 3, 10, 9, 0),
      datetime(2004, 5, 10, 9, 0)
    ]
  )

  testRecurring('testSetDateAndExDate',
    function () {
      const set = new RRuleSet()

      set.rdate(datetime(1997, 9, 2, 9))
      set.rdate(datetime(1997, 9, 4, 9))
      set.rdate(datetime(1997, 9, 9, 9))
      set.rdate(datetime(1997, 9, 11, 9))
      set.rdate(datetime(1997, 9, 16, 9))
      set.rdate(datetime(1997, 9, 18, 9))
      set.exdate(datetime(1997, 9, 4, 9))
      set.exdate(datetime(1997, 9, 11, 9))
      set.exdate(datetime(1997, 9, 18, 9))
      return set
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 9, 9, 0),
      datetime(1997, 9, 16, 9, 0)
    ]
  )

  testRecurring('testSetDateAndExRule',
    function () {
      const set = new RRuleSet()

      set.rdate(datetime(1997, 9, 2, 9))
      set.rdate(datetime(1997, 9, 4, 9))
      set.rdate(datetime(1997, 9, 9, 9))
      set.rdate(datetime(1997, 9, 11, 9))
      set.rdate(datetime(1997, 9, 16, 9))
      set.rdate(datetime(1997, 9, 18, 9))
      set.exrule(new RRule({
        freq: RRule.YEARLY,
        count: 3,
        byweekday: RRule.TH,
        dtstart: parse('19970902T090000')
      }))
      return set
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 9, 9, 0),
      datetime(1997, 9, 16, 9, 0)
    ]
  )

  testRecurring('testSetCachePre',
    function () {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 2,
        byweekday: RRule.TU,
        dtstart: parse('19970902T090000')
      }))
      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 1,
        byweekday: RRule.TH,
        dtstart: parse('19970902T090000')
      }))
      return set
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 9, 9, 0)
    ]
  )

  testRecurring('testSetCachePost',
    function () {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 2,
        byweekday: RRule.TU,
        dtstart: parse('19970902T090000')
      }))
      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 1,
        byweekday: RRule.TH,
        dtstart: parse('19970902T090000')
      }))
      set.all()
      return set
    },
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1997, 9, 4, 9, 0),
      datetime(1997, 9, 9, 9, 0)
    ]
  )

  testRecurring('testSetInfiniteAll',
    function () {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        dtstart: parse('19970902T090000')
      }))
      set.exrule(new RRule({
        freq: RRule.YEARLY,
        count: 10,
        dtstart: parse('19970902T090000')
      }))

      return {
        rrule: set,
        method: 'all',
        args: [
          function (_: any, count: number) {
            return count < 3
          }
        ]
      }
    },
    [
      datetime(2007, 9, 2, 9, 0),
      datetime(2008, 9, 2, 9, 0),
      datetime(2009, 9, 2, 9, 0)
    ]
  )

  testRecurring('testSetInfiniteBetween',
    function () {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        dtstart: parse('19970902T090000')
      }))
      set.exrule(new RRule({
        freq: RRule.YEARLY,
        count: 10,
        dtstart: parse('19970902T090000')
      }))
      return {
        rrule: set,
        method: 'between',
        args: [
          datetime(2000, 9, 2, 9, 0),
          datetime(2010, 9, 2, 9, 0)
        ]
      }
    },
    [
      datetime(2007, 9, 2, 9, 0),
      datetime(2008, 9, 2, 9, 0),
      datetime(2009, 9, 2, 9, 0)
    ]
  )

  testRecurring('testSetInfiniteBefore',
    function () {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        dtstart: parse('19970902T090000')
      }))
      set.exrule(new RRule({
        freq: RRule.YEARLY,
        count: 10,
        dtstart: parse('19970902T090000')
      }))
      return {
        rrule: set,
        method: 'before',
        args: [
          datetime(2015, 9, 2, 9, 0),
          false
        ]
      }
    },
    [
      datetime(2014, 9, 2, 9, 0)
    ]
  )

  testRecurring('testSetInfiniteAfter',
    function () {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        dtstart: parse('19970902T090000')
      }))
      set.exrule(new RRule({
        freq: RRule.YEARLY,
        count: 10,
        dtstart: parse('19970902T090000')
      }))
      return {
        rrule: set,
        method: 'after',
        args: [
          datetime(2000, 9, 2, 9, 0),
          false
        ]
      }
    },
    [
      datetime(2007, 9, 2, 9, 0)
    ]
  )

  testRecurring('testBefore70',
    function () {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 2,
        dtstart: parse('19600101T090000')
      }))
      return {
        rrule: set,
        method: 'all'
      }
    },
    [
      datetime(1960, 1, 1, 9, 0),
      datetime(1961, 1, 1, 9, 0)
    ]
  )

  describe('valueOf', () => {
    it('generates rrule strings correctly', () => {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 2,
        dtstart: parse('19600101T090000')
      }))

      expect(set.valueOf()).to.deep.equal([
        "DTSTART:19600101T090000Z",
        "RRULE:FREQ=YEARLY;COUNT=2"
      ])
    })

    it('generates multiline rules', () => {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 2,
        dtstart: parse('19600101T090000')
      }))

      set.rrule(new RRule({
        freq: RRule.WEEKLY,
        count: 3,
      }))

      expect(set.valueOf()).to.deep.equal([
        "DTSTART:19600101T090000Z",
        "RRULE:FREQ=YEARLY;COUNT=2",
        "RRULE:FREQ=WEEKLY;COUNT=3"
      ])
    })

    it('generates rules with tzid', () => {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 2,
        dtstart: parse('19600101T090000'),
        tzid: 'America/New_York'
      }))

      set.rrule(new RRule({
        freq: RRule.WEEKLY,
        count: 3,
      }))

      expect(set.valueOf()).to.deep.equal([
        "DTSTART;TZID=America/New_York:19600101T090000",
        "RRULE:FREQ=YEARLY;COUNT=2",
        "RRULE:FREQ=WEEKLY;COUNT=3"
      ])
    })

    it('generates a value with RDATE with tzid', () => {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 2,
        dtstart: parse('19600101T090000'),
        tzid: 'America/New_York'
      }))

      set.rdate(
        parse('19610201T090000'),
      )

      set.rdate(
        parse('19610301T090000'),
      )

      expect(set.valueOf()).to.deep.equal([
        "DTSTART;TZID=America/New_York:19600101T090000",
        "RRULE:FREQ=YEARLY;COUNT=2",
        "RDATE;TZID=America/New_York:19610201T090000,19610301T090000"
      ])
    })

    it('generates a string with RDATE with TZID when no RRULE is present', () => {
      const set = new RRuleSet()

      set.tzid('America/New_York')

      set.rdate(
        parse('19610201T090000'),
      )

      set.rdate(
        parse('19610301T090000'),
      )

      expect(set.toString()).to.deep.equal(
        "RDATE;TZID=America/New_York:19610201T090000,19610301T090000"
      )
    })

    it('generates a string with RDATE in UTC when no RRULE is present', () => {
      const set = new RRuleSet()

      set.tzid('UTC')

      set.rdate(
        parse('19610201T090000'),
      )

      set.rdate(
        parse('19610301T090000'),
      )

      expect(set.toString()).to.deep.equal(
        "RDATE:19610201T090000Z,19610301T090000Z"
      )
    })

    it('parses RDATE strings without an RRULE', () => {
      const set = rrulestr("RDATE;TZID=America/New_York:19610201T090000,19610301T090000") as RRuleSet
      expect(set).to.be.instanceof(RRuleSet)
      expect(set.tzid()).to.equal('America/New_York')
    })

    it('generates EXDATE with tzid', () => {
      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 2,
        dtstart: parse('19600101T090000'),
        tzid: 'America/New_York'
      }))

      set.exdate(
        parse('19610201T090000'),
      )

      set.exdate(
        parse('19610301T090000'),
      )

      expect(set.valueOf()).to.deep.equal([
        "DTSTART;TZID=America/New_York:19600101T090000",
        "RRULE:FREQ=YEARLY;COUNT=2",
        "EXDATE;TZID=America/New_York:19610201T090000,19610301T090000"
      ])
    })

    it('generates correcty zoned recurrences when a tzid is present', () => {
      const targetZone = 'America/New_York'
      const currentLocalDate = DateTime.local(2000, 2, 6, 11, 0, 0)
      setMockDate(currentLocalDate.toJSDate())

      const set = new RRuleSet()

      set.rrule(new RRule({
        freq: RRule.YEARLY,
        count: 4,
        dtstart: DateTime.fromISO('20000101T090000').toJSDate(),
        tzid: targetZone
      }))

      set.exdate(
        DateTime.fromISO('20010101T090000').toJSDate(),
      )

      set.rdate(
        DateTime.fromISO('20020301T090000').toJSDate(),
      )

      expect(set.all()).to.deep.equal([
        expectedDate(DateTime.fromISO('20000101T090000'), currentLocalDate, targetZone),
        expectedDate(DateTime.fromISO('20020101T090000'), currentLocalDate, targetZone),
        expectedDate(DateTime.fromISO('20020301T090000'), currentLocalDate, targetZone),
        expectedDate(DateTime.fromISO('20030101T090000'), currentLocalDate, targetZone),
      ])

      resetMockDate()
    })

    it('permits only an rdate with a timezone', () => {
      const set = new RRuleSet()
      set.tzid('America/Los_Angeles')
      set.rdate(new Date(Date.UTC(2010, 10, 10, 10, 0, 0)))

      expect(set.valueOf()).to.deep.equal(['RDATE;TZID=America/Los_Angeles:20101110T100000'])
      expect(set.toString()).to.equal('RDATE;TZID=America/Los_Angeles:20101110T100000')

      const set2 = rrulestr(set.toString())
      expect(set2.toString()).to.equal('RDATE;TZID=America/Los_Angeles:20101110T100000')
    })

    it('generates correcty zoned recurrences when a tzid is present but no rrule is present', () => {
      const targetZone = 'America/New_York'
      const currentLocalDate = DateTime.local(2000, 2, 6, 11, 0, 0)
      setMockDate(currentLocalDate.toJSDate())

      const set = new RRuleSet()

      set.tzid(targetZone)

      set.rdate(
        DateTime.fromISO('20020301T090000').toJSDate(),
      )

      expect(set.all()).to.deep.equal([
        expectedDate(DateTime.fromISO('20020301T090000'), currentLocalDate, targetZone)
      ])

      resetMockDate()
    })
  })

  describe('with end date', () => {
    let cursor: DateTime

    beforeEach(() => {
      cursor = DateTime.utc(2017, 12, 25, 16, 0, 0)
    })

    it('updates the ruleset to exclude recurrence date', () => {
      const legacy = ['RRULE:DTSTART=19990104T110000Z;FREQ=DAILY;INTERVAL=1']
      const repeat = ['DTSTART:19990104T110000Z', 'RRULE:FREQ=DAILY;INTERVAL=1']

      const recurrenceDate = DateTime.utc(2017, 8, 21, 16, 0, 0)

      expectRecurrence([repeat, legacy]).toAmendExdate(recurrenceDate, [
        'DTSTART:19990104T110000Z',
        'RRULE:FREQ=DAILY;INTERVAL=1',
        'EXDATE:20170821T160000Z',
      ])
    })

    it('updates the ruleset to exclude recurrence rule', () => {
      const legacy = ['RRULE:DTSTART=19990104T110000Z;FREQ=DAILY;INTERVAL=1']
      const repeat = ['DTSTART:19990104T110000Z', 'RRULE:FREQ=DAILY;INTERVAL=1']

      const exrule = new RRule({
        dtstart: new Date(Date.UTC(1999, 0, 4, 11, 0, 0)),
        freq: Frequency.WEEKLY,
        interval: 2,
        count: 1
      })

      expectRecurrence([repeat, legacy]).toAmendExrule(exrule, [
        'DTSTART:19990104T110000Z',
        'RRULE:FREQ=DAILY;INTERVAL=1',
        'EXRULE:FREQ=WEEKLY;INTERVAL=2;COUNT=1'
      ])
    })

    it('updates a never-ending recurrence with an end date', () => {
      const legacy = ['RRULE:DTSTART=20171201T080000Z;FREQ=WEEKLY']
      const original = ['DTSTART:20171201T080000Z', 'RRULE:FREQ=WEEKLY']

      expectRecurrence([original, legacy]).toBeUpdatedWithEndDate([
        'DTSTART:20171201T080000Z',
        'RRULE:FREQ=WEEKLY;UNTIL=20171224T235959Z',
      ].join('\n'))
    })

    it('replaces an existing end date with a new one', () => {
      const legacy = [
        'RRULE:DTSTART=20171201T080000Z;FREQ=WEEKLY;UNTIL=20180301T080000Z',
      ]
      const original = [
        'DTSTART:20171201T080000Z',
        'RRULE:FREQ=WEEKLY;UNTIL=20180301T080000Z',
      ]

      expectRecurrence([original, legacy]).toBeUpdatedWithEndDate([
        'DTSTART:20171201T080000Z',
        'RRULE:FREQ=WEEKLY;UNTIL=20171224T235959Z',
      ].join('\n'))
    })

    it('handles rule in a timezone', () => {
      const legacy = [
        'RRULE:DTSTART;TZID=America/New_York:20171201T080000;FREQ=WEEKLY',
      ]
      const original = [
        'DTSTART;TZID=America/New_York:20171201T080000',
        'RRULE:FREQ=WEEKLY',
      ]

      expectRecurrence([original, legacy]).toBeUpdatedWithEndDate([
        'DTSTART;TZID=America/New_York:20171201T080000',
        'RRULE:FREQ=WEEKLY;UNTIL=20171224T235959',
      ].join('\n'))
    })

    const updateWithEndDate = (
      recurrence: string[],
      updatedCursor: DateTime,
    ): string => {
      const newEndDate = updatedCursor.minus({ days: 1 }).endOf('day')

      const rrule = rrulestr(recurrence.join('\n'))

      const newRuleSet = new RRuleSet()
      const rule = new RRule({
        ...rrule.origOptions,
        until: newEndDate.toJSDate(),
      })

      newRuleSet.rrule(rule)

      return newRuleSet.toString()
    }

    const amendRuleSetWithExceptionDate = (
      recurrence: string[],
      cursor: DateTime,
    ): string => {
      const ruleSet = rrulestr(recurrence.join('\n'), { forceset: true }) as RRuleSet
      ruleSet.exdate(cursor.toJSDate())
      return ruleSet.toString()
    }

    const amendRuleSetWithExceptionRule = (
      recurrence: string[],
      exrule: RRule,
    ): string => {
      const ruleSet = rrulestr(recurrence.join('\n'), { forceset: true }) as RRuleSet
      ruleSet.exrule(exrule)
      return ruleSet.toString()
    }

    function expectRecurrence(recurrences: string[][]) {
      return {
        toAmendExrule(excluded: RRule, expected: string[]) {
          recurrences.forEach(recurrence => {
            const actual = amendRuleSetWithExceptionRule(recurrence, excluded)
            expect(actual).to.equal(expected.join('\n'))
          })
        },
        toAmendExdate(excluded: DateTime, expected: string[]) {
          recurrences.forEach(recurrence => {
            const actual = amendRuleSetWithExceptionDate(recurrence, excluded)
            expect(actual).to.equal(expected.join('\n'))
          })
        },
        toBeUpdatedWithEndDate(expected: string) {
          recurrences.forEach(recurrence => {
            const actual = updateWithEndDate(recurrence, cursor)
            expect(actual).to.equal(expected)
          })
        },
      }
    }
  })

  it('generates invalid date objects on an rruleset with invalid TZID and exdate', () => {
    const set = new RRuleSet()
    set.rrule(new RRule({
      count: 1,
      dtstart: parse('19970902T090000'),
      tzid: 'America/Unknown'
    }))
    set.exdate(parse('19970902T090000'))

    expect(set.all().map(String)).to.deep.equal([
      'Invalid Date'
    ])
  })

  it('throws an error if non-rrules are added via rrule or exrule', () => {
    const set = new RRuleSet()

    expect(() => set.rrule('foo' as any)).to.throw()
    expect(() => set.exrule('foo' as any)).to.throw()
  })

  it('throws an error if non-dates are added via rdate or exdate', () => {
    const set = new RRuleSet()

    expect(() => set.rdate('foo' as any)).to.throw()
    expect(() => set.exdate('foo' as any)).to.throw()
  })

  // Fixes https://github.com/jakubroztocil/rrule/issues/325
  it('should generated the first n dates with multiple rruels', () => {
    var r1 = "DTSTART:20190228T141000\nRRULE:FREQ=DAILY;BYDAY=TH;BYHOUR=12,13,14"
    var r2 = "DTSTART:20190227T105000\nRRULE:FREQ=DAILY;BYDAY=SA;BYHOUR=20,22,23"

    var set = new RRuleSet()
    set.rrule(rrulestr(r1))
    set.rrule(rrulestr(r2))

    const iter = set.createIterator();
    
    // Include results from both rrules
    expect([
      iter.next().value,
      iter.next().value,
      iter.next().value,
      iter.next().value,
      iter.next().value,
      iter.next().value,
      iter.next().value,
      iter.next().value
    ].map((v) => v.toISOString())).to.deep.equal([
      '2019-02-28T14:10:00.000Z',
      '2019-03-02T20:50:00.000Z',
      '2019-03-02T22:50:00.000Z',
      '2019-03-02T23:50:00.000Z',
      '2019-03-07T12:10:00.000Z',
      '2019-03-07T13:10:00.000Z',
      '2019-03-07T14:10:00.000Z',
      '2019-03-09T20:50:00.000Z'

    ])
  })

  describe('getters', () => {
    it('rrules()', () => {
      let set = new RRuleSet();
      let rrule = new RRule({
        freq: RRule.YEARLY,
        count: 2,
        dtstart: parse('19600101T090000'),
        tzid: 'America/New_York'
      });
      set.rrule(rrule);

      expect(set.rrules().map(e => e.toString())).eql([rrule.toString()]);
    });

    it('exrules()', () => {
      let set = new RRuleSet();
      let rrule = new RRule({
        freq: RRule.YEARLY,
        count: 2,
        dtstart: parse('19600101T090000'),
        tzid: 'America/New_York'
      });
      set.exrule(rrule);

      expect(set.exrules().map(e => e.toString())).eql([rrule.toString()]);
    });

    it('rdates()', () => {
      let set = new RRuleSet();
      let dt = parse('19610201T090000');
      set.rdate(dt);

      expect(set.rdates()).eql([dt]);
    });

    it('exdates()', () => {
      let set = new RRuleSet();
      let dt = parse('19610201T090000');
      set.exdate(dt);

      expect(set.exdates()).eql([dt]);
    });
  });
});