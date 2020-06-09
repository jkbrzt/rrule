import { RRule } from '../src/index'
import { expect } from "chai"

const ruleByTzid = (tzid: string) => new RRule({
  freq: RRule.WEEKLY,
  dtstart: new Date(Date.UTC(2020, 1, 1, 0, 0, 0)), // always use UTC dates!!!
  tzid,
  byweekday: [RRule.TU],
  count: 2
})

const mapToIso = (arr: Array<Date>): Array<string> =>
  arr.map(d => d.toISOString())

describe('timezones', () => {
  it('Europe/Paris', () => {
    const tzid = 'Europe/Paris'
    const rule = ruleByTzid(tzid)
    expect(rule.toString()).to.equal('DTSTART;TZID=Europe/Paris:20200201T000000\nRRULE:FREQ=WEEKLY;BYDAY=TU;COUNT=2')
    expect(mapToIso(rule.all())).to.deep.equal([
      '2020-02-03T23:00:00.000Z',
      '2020-02-10T23:00:00.000Z'
    ])
  })

  it('America/New_York', () => {
    const rule = ruleByTzid('America/New_York')
    expect(rule.toString()).to.equal('DTSTART;TZID=America/New_York:20200201T000000\nRRULE:FREQ=WEEKLY;BYDAY=TU;COUNT=2')
    expect(mapToIso(rule.all())).to.deep.equal([
      '2020-02-04T05:00:00.000Z',
      '2020-02-11T05:00:00.000Z'
    ])
  })

  it('UTC', () => {
    const rule = ruleByTzid('UTC')
    expect(rule.toString()).to.equal('DTSTART:20200201T000000Z\nRRULE:FREQ=WEEKLY;BYDAY=TU;COUNT=2')
    expect(mapToIso(rule.all())).to.deep.equal([
      '2020-02-04T00:00:00.000Z',
      '2020-02-11T00:00:00.000Z'
    ])
  })
})
