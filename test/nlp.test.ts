import { expect } from 'chai'
import { DateTime } from 'luxon'
import RRule from '../src';
import { optionsToString } from '../src/optionstostring';
import {DateFormatter} from '../src/nlp/totext'

const texts = [
  ['Every day', 'RRULE:FREQ=DAILY'],
  ['Every day at 10, 12 and 17', 'RRULE:FREQ=DAILY;BYHOUR=10,12,17'],
  ['Every week', 'RRULE:FREQ=WEEKLY'],
  ['Every hour', 'RRULE:FREQ=HOURLY'],
  ['Every 4 hours', 'RRULE:INTERVAL=4;FREQ=HOURLY'],
  ['Every week on Tuesday', 'RRULE:FREQ=WEEKLY;BYDAY=TU'],
  ['Every week on Monday, Wednesday', 'RRULE:FREQ=WEEKLY;BYDAY=MO,WE'],
  ['Every weekday', 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR'],
  ['Every 2 weeks', 'RRULE:INTERVAL=2;FREQ=WEEKLY'],
  ['Every month', 'RRULE:FREQ=MONTHLY'],
  ['Every 6 months', 'RRULE:INTERVAL=6;FREQ=MONTHLY'],
  ['Every year', 'RRULE:FREQ=YEARLY'],
  ['Every year on the 1st Friday', 'RRULE:FREQ=YEARLY;BYDAY=+1FR'],
  ['Every year on the 13th Friday', 'RRULE:FREQ=YEARLY;BYDAY=+13FR'],
  ['Every month on the 4th', 'RRULE:FREQ=MONTHLY;BYMONTHDAY=4'],
  ['Every month on the 4th last', 'RRULE:FREQ=MONTHLY;BYMONTHDAY=-4'],
  ['Every month on the 3rd Tuesday', 'RRULE:FREQ=MONTHLY;BYDAY=+3TU'],
  ['Every month on the 3rd last Tuesday', 'RRULE:FREQ=MONTHLY;BYDAY=-3TU'],
  ['Every month on the last Monday', 'RRULE:FREQ=MONTHLY;BYDAY=-1MO'],
  ['Every month on the 2nd last Friday', 'RRULE:FREQ=MONTHLY;BYDAY=-2FR'],
  // ['Every week until January 1, 2007', 'RRULE:FREQ=WEEKLY;UNTIL=20070101T080000Z'],
  ['Every week for 20 times', 'RRULE:FREQ=WEEKLY;COUNT=20']
]

describe('NLP', () => {
  it('fromText()', function () {
    texts.forEach(function (item) {
      const text = item[0]
      const str = item[1]
      expect(RRule.fromText(text).toString()).equals(str, text + ' => ' + str)
    })
  })

  it('toText()', function () {
    texts.forEach(function (item) {
      const text = item[0]
      const str = item[1]
      expect(RRule.fromString(str).toText().toLowerCase()).equals(text.toLowerCase(),
        str + ' => ' + text)
    })
  })

  it('parseText()', function () {
    texts.forEach(function (item) {
      const text = item[0]
      const str = item[1]
      expect(optionsToString(RRule.parseText(text))).equals(str, text + ' => ' + str)
    })
  })

  it('permits integers in byweekday (#153)', () => {
    const rrule = new RRule({
      freq: RRule.WEEKLY,
      byweekday: 0
    })

    expect(rrule.toText()).to.equal('every week on Monday')
    expect(rrule.toString()).to.equal('RRULE:FREQ=WEEKLY;BYDAY=MO')
  })

  it('sorts monthdays correctly (#101)', () => {
    const options = { "freq": 2, "bymonthday": [3, 10, 17, 24] }
    const rule = new RRule(options)
    expect(rule.toText()).to.equal('every week on the 3rd, 10th, 17th and 24th')
  })

  it('shows correct text for every day', () => {
    const options = { "freq": RRule.WEEKLY, byweekday: [
      RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU
    ]}
    const rule = new RRule(options)
    expect(rule.toText()).to.equal('every day')
  })

  it('by default formats \'until\' correctly', () => {
    const rrule = new RRule({
      freq: RRule.WEEKLY,
      until: DateTime.utc(2012, 11, 10).toJSDate()
    })

    expect(rrule.toText()).to.equal('every week until November 10, 2012')
  })

  it('formats \'until\' as desired if asked', () => {
    const rrule = new RRule({
      freq: RRule.WEEKLY,
      until: DateTime.utc(2012, 11, 10).toJSDate()
    })

    const dateFormatter: DateFormatter = (year, month, day) => `${day}. ${month}, ${year}`

    expect(rrule.toText(undefined, undefined, dateFormatter)).to.equal('every week until 10. November, 2012')
  })
})