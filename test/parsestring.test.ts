import RRule from '../src/rrule'
import { expect } from 'chai'
import { parseString } from '../src/parsestring'
import { Options } from '../src/types';

describe('parseString', () => {
  it('fromString()', function () {
    const expectations: ([ string, Partial<Options>][]) = [
      ['FREQ=WEEKLY;UNTIL=20100101T000000Z', { freq: RRule.WEEKLY, until: new Date(Date.UTC(2010, 0, 1, 0, 0, 0)) }],

      // Parse also `date` but return `date-time`
      ['FREQ=WEEKLY;UNTIL=20100101', { freq: RRule.WEEKLY, until: new Date(Date.UTC(2010, 0, 1, 0, 0, 0)) }],
      ['DTSTART;TZID=America/New_York:19970902T090000', { dtstart: new Date(Date.UTC(1997, 8, 2, 9, 0, 0)), tzid: 'America/New_York' }]
    ]

    expectations.forEach(function (item) {
      const s = item[0]
      const s2 = item[1]
      expect(parseString(s), s).to.deep.equal(s2)
    })
  })
})
