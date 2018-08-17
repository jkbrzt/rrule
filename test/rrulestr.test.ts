import { assertStrType, parse, datetime, datetimeUTC, testRecurring } from './lib/utils'
import { RRule, RRuleSet, rrulestr, Frequency } from '../src'
import { expect } from 'chai'
import { Days } from '../src/rrule';

describe('rrulestr', function () {
  // Enable additional toString() / fromString() tests
  // for each testRecurring().
  this.ctx.ALSO_TEST_STRING_FUNCTIONS = false

  // Enable additional toText() / fromText() tests
  // for each testRecurring().
  // Many of the tests fail because the conversion is only approximate,
  // but it gives an idea about how well or bad it converts.
  this.ctx.ALSO_TEST_NLP_FUNCTIONS = false

  // Thorough after()/before()/between() tests.
  // NOTE: can take a longer time.
  this.ctx.ALSO_TEST_BEFORE_AFTER_BETWEEN = true

  assertStrType('testStrType',
    rrulestr(
      'DTSTART:19970902T090000Z\n' +
      'RRULE:FREQ=YEARLY;COUNT=3\n'
    ),
    RRule
  )

  assertStrType('testStrForceSetType',
    rrulestr(
      'DTSTART:19970902T090000Z\n' +
      'RRULE:FREQ=YEARLY;COUNT=3\n',
      {
        forceset: true
      }
    ),
    RRuleSet
  )

  assertStrType('testStrSetType',
    rrulestr(
      'DTSTART:19970902T090000Z\n' +
      'RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU\n' +
      'RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH\n'
    ),
    RRuleSet
  )

  testRecurring('testStr',
    rrulestr(
      'DTSTART:19970902T090000Z\n' +
      'RRULE:FREQ=YEARLY;COUNT=3\n'
    ),
    [
      datetimeUTC(1997, 9, 2, 9, 0),
      datetimeUTC(1998, 9, 2, 9, 0),
      datetimeUTC(1999, 9, 2, 9, 0)
    ]
  )

  testRecurring('testStrCase',
    rrulestr(
      'dtstart:19970902T090000Z\n' +
      'rrule:freq=yearly;count=3\n'
    ),
    [
      datetimeUTC(1997, 9, 2, 9, 0),
      datetimeUTC(1998, 9, 2, 9, 0),
      datetimeUTC(1999, 9, 2, 9, 0)
    ]
  )

  testRecurring('testStrSpaces',
    rrulestr(
      ' DTSTART:19970902T090000Z ' +
      ' RRULE:FREQ=YEARLY;COUNT=3 '
    ),
    [
      datetimeUTC(1997, 9, 2, 9, 0),
      datetimeUTC(1998, 9, 2, 9, 0),
      datetimeUTC(1999, 9, 2, 9, 0)
    ]
  )

  testRecurring('testStrSpacesAndLines',
    rrulestr(
      ' DTSTART:19970902T090000Z \n' +
      ' \n RRULE:FREQ=YEARLY;COUNT=3 \n'
    ),
    [
      datetimeUTC(1997, 9, 2, 9, 0),
      datetimeUTC(1998, 9, 2, 9, 0),
      datetimeUTC(1999, 9, 2, 9, 0)
    ]
  )

  testRecurring('testStrNoDTStart',
    rrulestr(
      'RRULE:FREQ=YEARLY;COUNT=3\n',
      {
        dtstart: parse('19970902T090000')
      }
    ),
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1998, 9, 2, 9, 0),
      datetime(1999, 9, 2, 9, 0)
    ]
  )

  testRecurring('testStrValueOnly',
    rrulestr(
      'FREQ=YEARLY;COUNT=3\n',
      {
        dtstart: parse('19970902T090000')
      }
    ),
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1998, 9, 2, 9, 0),
      datetime(1999, 9, 2, 9, 0)
    ]
  )

  testRecurring('testStrUnfold',
    rrulestr(
      'FREQ=YEA\n RLY;COUNT=3\n',
      {
        unfold: true,
        dtstart: parse('19970902T090000')
      }
    ),
    [
      datetime(1997, 9, 2, 9, 0),
      datetime(1998, 9, 2, 9, 0),
      datetime(1999, 9, 2, 9, 0)
    ]
  )

  testRecurring('testStrSet',
    rrulestr(
      'DTSTART:19970902T090000Z\n' +
      'RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU\n' +
      'RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH\n'
    ),
    [
      datetimeUTC(1997, 9, 2, 9, 0),
      datetimeUTC(1997, 9, 4, 9, 0),
      datetimeUTC(1997, 9, 9, 9, 0)
    ]
  )

  testRecurring('testStrSetDate',
    rrulestr(
      'DTSTART:19970902T090000Z\n' +
      'RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TU\n' +
      'RDATE:19970904T090000Z\n' +
      'RDATE:19970909T090000Z\n'
    ),
    [
      datetimeUTC(1997, 9, 2, 9, 0),
      datetimeUTC(1997, 9, 4, 9, 0),
      datetimeUTC(1997, 9, 9, 9, 0)
    ]
  )

  testRecurring('testStrSetExRule',
    rrulestr(
      'DTSTART:19970902T090000Z\n' +
      'RRULE:FREQ=YEARLY;COUNT=6;BYDAY=TU,TH\n' +
      'EXRULE:FREQ=YEARLY;COUNT=3;BYDAY=TH\n'
    ),
    [
      datetimeUTC(1997, 9, 2, 9, 0),
      datetimeUTC(1997, 9, 9, 9, 0),
      datetimeUTC(1997, 9, 16, 9, 0)
    ]
  )

  testRecurring('testStrSetExDate',
    rrulestr(
      'DTSTART:19970902T090000Z\n' +
      'RRULE:FREQ=YEARLY;COUNT=6;BYDAY=TU,TH\n' +
      'EXDATE:19970904T090000Z\n' +
      'EXDATE:19970911T090000Z\n' +
      'EXDATE:19970918T090000Z\n'
    ),
    [
      datetimeUTC(1997, 9, 2, 9, 0),
      datetimeUTC(1997, 9, 9, 9, 0),
      datetimeUTC(1997, 9, 16, 9, 0)
    ]
  )

  testRecurring('testStrSetDateAndExDate',
    rrulestr(
      'DTSTART:19970902T090000Z\n' +
      'RDATE:19970902T090000Z\n' +
      'RDATE:19970904T090000Z\n' +
      'RDATE:19970909T090000Z\n' +
      'RDATE:19970911T090000Z\n' +
      'RDATE:19970916T090000Z\n' +
      'RDATE:19970918T090000Z\n' +
      'EXDATE:19970904T090000Z\n' +
      'EXDATE:19970911T090000Z\n' +
      'EXDATE:19970918T090000Z\n'
    ),
    [
      datetimeUTC(1997, 9, 2, 9, 0),
      datetimeUTC(1997, 9, 9, 9, 0),
      datetimeUTC(1997, 9, 16, 9, 0)
    ]
  )

  testRecurring('testStrSetDateAndExRule',
    rrulestr(
      'DTSTART:19970902T090000Z\n' +
      'RDATE:19970902T090000Z\n' +
      'RDATE:19970904T090000Z\n' +
      'RDATE:19970909T090000Z\n' +
      'RDATE:19970911T090000Z\n' +
      'RDATE:19970916T090000Z\n' +
      'RDATE:19970918T090000Z\n' +
      'EXRULE:FREQ=YEARLY;COUNT=3;BYDAY=TH\n'
    ),
    [
      datetimeUTC(1997, 9, 2, 9, 0),
      datetimeUTC(1997, 9, 9, 9, 0),
      datetimeUTC(1997, 9, 16, 9, 0)
    ]
  )

  testRecurring('testStrKeywords',
    rrulestr(
      'DTSTART:19970902T030000Z\n' +
      'RRULE:FREQ=YEARLY;COUNT=3;INTERVAL=3;' +
      'BYMONTH=3;byweekday=TH;BYMONTHDAY=3;' +
      'BYHOUR=3;BYMINUTE=3;BYSECOND=3\n'
    ),
    [
      datetimeUTC(2033, 3, 3, 3, 3, 3),
      datetimeUTC(2039, 3, 3, 3, 3, 3),
      datetimeUTC(2072, 3, 3, 3, 3, 3)
    ]
  )

  testRecurring('testStrNWeekDay',
    rrulestr(
      'DTSTART:19970902T090000Z\n' +
      'RRULE:FREQ=YEARLY;COUNT=3;BYDAY=1TU,-1TH\n'
    ),
    [
      datetimeUTC(1997, 12, 25, 9, 0),
      datetimeUTC(1998, 1, 6, 9, 0),
      datetimeUTC(1998, 12, 31, 9, 0)
    ]
  )

  it('parses TZID', () => {
    const rrule = rrulestr(
      'DTSTART;TZID=America/New_York:19970902T090000\n' +
      'RRULE:FREQ=DAILY'
    )

    expect(rrule.options.tzid).to.equal('America/New_York')
  })

  it('parses a DTSTART inside an RRULE', () => {
    const rrule = rrulestr(
      'RRULE:UNTIL=19990404T110000Z;DTSTART=19990104T110000Z;FREQ=WEEKLY;BYDAY=TU,WE'
    )

    expect(rrule.options).to.deep.include({
      until: new Date(Date.UTC(1999, 3, 4, 11, 0, 0)),
      dtstart: new Date(Date.UTC(1999, 0, 4, 11, 0, 0)),
      freq: Frequency.WEEKLY,
      byweekday: [Days.TU.weekday, Days.WE.weekday]
    })
  })

  it('parses a DTSTART with a TZID inside an RRULE', () => {
    const rrule = rrulestr(
      'RRULE:UNTIL=19990404T110000Z;DTSTART;TZID=America/New_York:19990104T110000Z;FREQ=WEEKLY;BYDAY=TU,WE'
    )

    expect(rrule.options).to.deep.include({
      until: new Date(Date.UTC(1999, 3, 4, 11, 0, 0)),
      dtstart: new Date(Date.UTC(1999, 0, 4, 11, 0, 0)),
      freq: Frequency.WEEKLY,
      tzid: 'America/New_York',
      byweekday: [Days.TU.weekday, Days.WE.weekday]
    })
  })

  it('parses a DTSTART if it is the first param', () => {
    const rrule = rrulestr(
      "RRULE:DTSTART;TZID=America/Los_Angeles:20180819T111500;FREQ=DAILY;INTERVAL=1"
    )

    expect(rrule.options).to.deep.include({
      dtstart: new Date(Date.UTC(2018, 7, 19, 11, 15, 0)),
      freq: Frequency.DAILY,
      interval: 1,
      tzid: 'America/Los_Angeles'
    })
  })
})
