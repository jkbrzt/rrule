import RRule from '../src/rrule'
import { expect } from 'chai'
import { parseString } from '../src/parsestring'
import { Options, Frequency } from '../src/types';

describe('parseString', () => {
  it('parses valid single lines of rrules', function () {
    const expectations: ([ string, Partial<Options>][]) = [
      ['FREQ=WEEKLY;UNTIL=20100101T000000Z', { freq: RRule.WEEKLY, until: new Date(Date.UTC(2010, 0, 1, 0, 0, 0)) }],

      // Parse also `date` but return `date-time`
      ['FREQ=WEEKLY;UNTIL=20100101', { freq: RRule.WEEKLY, until: new Date(Date.UTC(2010, 0, 1, 0, 0, 0)) }],
      ['DTSTART;TZID=America/New_York:19970902T090000', { dtstart: new Date(Date.UTC(1997, 8, 2, 9, 0, 0)), tzid: 'America/New_York' }],
      ['RRULE:DTSTART;TZID=America/New_York:19970902T090000', { dtstart: new Date(Date.UTC(1997, 8, 2, 9, 0, 0)), tzid: 'America/New_York' }]
    ]

    expectations.forEach(function (item) {
      const s = item[0]
      const s2 = item[1]
      expect(parseString(s), s).to.deep.equal(s2)
    })
  })

  it('parses multiline rules', () => {
    const expectations: ([ string, Partial<Options>][]) = [
      [
        'DTSTART;TZID=America/New_York:19970902T090000\nRRULE:FREQ=WEEKLY;UNTIL=20100101T000000Z',
        {
          dtstart: new Date(Date.UTC(1997, 8, 2, 9, 0, 0)),
          tzid: 'America/New_York',
          freq: RRule.WEEKLY,
          until: new Date(Date.UTC(2010, 0, 1, 0, 0, 0))
        }
      ],
      [
        'DTSTART:19970902T090000Z\n' +
        'RRULE:FREQ=YEARLY;COUNT=3\n',
        {
          dtstart: new Date(Date.UTC(1997, 8, 2, 9, 0, 0)),
          freq: RRule.YEARLY,
          count: 3
        }
      ]
    ]

    expectations.forEach(function (item) {
      const s = item[0]
      const s2 = item[1]
      expect(parseString(s), s).to.deep.equal(s2)
    })
  })

  it('parses legacy dtstart in rrule', () => {
    const expectations: ([ string, Partial<Options>][]) = [
      ['RRULE:FREQ=WEEKLY;DTSTART;TZID=America/New_York:19970902T090000', {
        freq: Frequency.WEEKLY,
        dtstart: new Date(Date.UTC(1997, 8, 2, 9, 0, 0)),
        tzid: 'America/New_York'
      }]
    ]

    expectations.forEach(function (item) {
      const s = item[0]
      const s2 = item[1]
      expect(parseString(s), s).to.deep.equal(s2)
    })
  })
})
