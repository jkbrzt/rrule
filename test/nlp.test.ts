import { expect } from 'chai'
import { RRule } from '../src'
import { optionsToString } from '../src/optionstostring'
import { DateFormatter } from '../src/nlp/totext'
import { datetime } from './lib/utils'

const texts = [
  ['Every day', 'daily', 'RRULE:FREQ=DAILY'],
  ['Every day at 10, 12 and 17', 'daily', 'RRULE:FREQ=DAILY;BYHOUR=10,12,17'],
  ['Every week', 'weekly', 'RRULE:FREQ=WEEKLY'],
  ['Every 2 weeks', '', 'RRULE:INTERVAL=2;FREQ=WEEKLY'],
  ['Every hour', 'hourly', 'RRULE:FREQ=HOURLY'],
  ['Every 4 hours', '', 'RRULE:INTERVAL=4;FREQ=HOURLY'],
  ['Every week on Tuesday', 'weekly', 'RRULE:FREQ=WEEKLY;BYDAY=TU'],
  ['Every week on Monday, Wednesday', '', 'RRULE:FREQ=WEEKLY;BYDAY=MO,WE'],
  ['Every weekday', '', 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR'],
  ['Every 2 weeks', '', 'RRULE:INTERVAL=2;FREQ=WEEKLY'],
  ['Every month', 'monthly', 'RRULE:FREQ=MONTHLY'],
  ['Every 6 months', '', 'RRULE:INTERVAL=6;FREQ=MONTHLY'],
  ['Every year', 'yearly', 'RRULE:FREQ=YEARLY'],
  ['Every year on the 1st Friday', 'yearly', 'RRULE:FREQ=YEARLY;BYDAY=+1FR'],
  ['Every year on the 13th Friday', 'yearly', 'RRULE:FREQ=YEARLY;BYDAY=+13FR'],
  ['Every month on the 4th', 'monthly', 'RRULE:FREQ=MONTHLY;BYMONTHDAY=4'],
  [
    'Every month on the 4th last',
    'monthly',
    'RRULE:FREQ=MONTHLY;BYMONTHDAY=-4',
  ],
  [
    'Every month on the 3rd Tuesday',
    'monthly',
    'RRULE:FREQ=MONTHLY;BYDAY=+3TU',
  ],
  [
    'Every month on the 3rd last Tuesday',
    'monthly',
    'RRULE:FREQ=MONTHLY;BYDAY=-3TU',
  ],
  [
    'Every month on the last Monday',
    'monthly',
    'RRULE:FREQ=MONTHLY;BYDAY=-1MO',
  ],
  [
    'Every month on the 2nd last Friday',
    'monthly',
    'RRULE:FREQ=MONTHLY;BYDAY=-2FR',
  ],
  ['Every week for 20 times', 'weekly', 'RRULE:FREQ=WEEKLY;COUNT=20'],
]

describe('NLP', () => {
  it('fromText()', function () {
    texts.forEach(function (item) {
      const parse = item[0]
      const rule = item[2]
      expect(RRule.fromText(parse).toString()).equals(
        rule,
        parse + ' => ' + rule
      )
    })
  })

  it('toText(options)', function () {
    texts.forEach(function (item) {
      const parse = item[0]
      const condensed = item[1]
      const rule = item[2]
      expect(RRule.fromString(rule).toText().toLowerCase()).equals(
        `repeats ${parse.toLowerCase()}`,
        rule + ' => ' + parse
      )

      const condensedToCompare = condensed
        ? `repeats ${condensed.toLowerCase()}`
        : 'repeats'
      expect(
        RRule.fromString(rule)
          .toText(undefined, undefined, undefined, { condenseOutput: true })
          .toLowerCase()
      ).equals(condensedToCompare, rule + ' => ' + condensed)
    })
  })

  it('parseText()', function () {
    texts.forEach(function (item) {
      const parse = item[0]
      const rule = item[2]
      expect(optionsToString(RRule.parseText(parse))).equals(
        rule,
        parse + ' => ' + rule
      )
    })
  })

  it('permits integers in byweekday (#153)', () => {
    const rrule = new RRule({
      freq: RRule.WEEKLY,
      byweekday: 0,
    })

    expect(rrule.toText()).to.equal('Repeats every week on Monday')
    expect(
      rrule.toText(undefined, undefined, undefined, { condenseOutput: true })
    ).to.equal('Repeats weekly')
    expect(rrule.toString()).to.equal('RRULE:FREQ=WEEKLY;BYDAY=MO')
  })

  it('sorts monthdays correctly (#101)', () => {
    const options = { freq: 2, bymonthday: [3, 10, 17, 24] }
    const rule = new RRule(options)
    expect(rule.toText()).to.equal(
      'Repeats every week on the 3rd, 10th, 17th and 24th'
    )
    expect(
      rule.toText(undefined, undefined, undefined, { condenseOutput: true })
    ).to.equal('Repeats')
  })

  it('shows correct text for every day', () => {
    const options = {
      freq: RRule.WEEKLY,
      byweekday: [
        RRule.MO,
        RRule.TU,
        RRule.WE,
        RRule.TH,
        RRule.FR,
        RRule.SA,
        RRule.SU,
      ],
    }
    const rule = new RRule(options)
    expect(rule.toText()).to.equal('Repeats every day')
    expect(
      rule.toText(undefined, undefined, undefined, { condenseOutput: true })
    ).to.equal('Repeats daily')
  })

  it('shows correct text for every minute', () => {
    const options = { freq: RRule.MINUTELY }
    const rule = new RRule(options)
    expect(rule.toText()).to.equal('Repeats every minute')
  })

  it('shows correct text for every (plural) minutes', () => {
    const options = { freq: RRule.MINUTELY, interval: 2 }
    const rule = new RRule(options)
    expect(rule.toText()).to.equal('Repeats every 2 minutes')
    expect(
      rule.toText(undefined, undefined, undefined, { condenseOutput: true })
    ).to.equal('Repeats every 2 minutes')
  })

  it("by default formats 'until' correctly", () => {
    const rrule = new RRule({
      freq: RRule.WEEKLY,
      until: datetime(2012, 11, 10),
    })

    expect(rrule.toText()).to.equal(
      'Repeats every week until November 10, 2012'
    )
    expect(
      rrule.toText(undefined, undefined, undefined, { condenseOutput: true })
    ).to.equal('Repeats weekly')
  })

  it("formats 'until' as desired if asked", () => {
    const rrule = new RRule({
      freq: RRule.WEEKLY,
      until: datetime(2012, 11, 10),
    })

    const dateFormatter: DateFormatter = (year, month, day) =>
      `${day}. ${month}, ${year}`

    expect(rrule.toText(undefined, undefined, dateFormatter)).to.equal(
      'Repeats every week until 10. November, 2012'
    )
  })
})
