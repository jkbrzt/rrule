import { parseOptions } from '../src/parseoptions'
import { RRule, rrulestr } from '../src'

describe('interval', () => {
  it.each([0.5, 1.5, -0.5, -1, NaN, Infinity, -Infinity])(
    'rejects invalid numeric interval %s before iteration',
    (interval) => {
      expect(() => new RRule({ freq: RRule.DAILY, interval })).toThrow(
        'interval must be a non-negative integer'
      )
    }
  )

  it.each([
    'DTSTART:20231003T040000Z\nRRULE:FREQ=DAILY;INTERVAL=0.5',
    'FREQ=HOURLY;INTERVAL=1.5;BYMINUTE=41',
    'FREQ=DAILY;INTERVAL=-1',
    'FREQ=DAILY;INTERVAL=abc',
    'FREQ=DAILY;INTERVAL=1,2',
  ])('rejects an invalid parsed interval in %s', (source) => {
    expect(() => rrulestr(source)).toThrow(
      'interval must be a non-negative integer'
    )
    expect(() => RRule.fromString(source)).toThrow(
      'interval must be a non-negative integer'
    )
  })

  it('keeps the default interval and valid integer recurrence', () => {
    expect(parseOptions({}).parsedOptions.interval).toBe(1)
    const rule = new RRule({
      freq: RRule.DAILY,
      interval: 2,
      dtstart: new Date(Date.UTC(2023, 9, 3, 4)),
      count: 3,
    })
    expect(rule.all().map((date) => date.toISOString())).toEqual([
      '2023-10-03T04:00:00.000Z',
      '2023-10-05T04:00:00.000Z',
      '2023-10-07T04:00:00.000Z',
    ])
  })

  it('preserves an empty recurrence for zero interval', () => {
    expect(new RRule({ freq: RRule.DAILY, interval: 0 }).all()).toEqual([])
  })
})

describe('TZID', () => {
  it('leaves null when null', () => {
    const options = parseOptions({ tzid: null })
    expect(options.parsedOptions.tzid).toBeNull()
  })

  it('uses a string when passed in', () => {
    const options = parseOptions({ tzid: 'America/Los_Angeles' })
    expect(options.parsedOptions.tzid).toBe('America/Los_Angeles')
  })
})

describe('byweekday', () => {
  it('works with a single numeric day', () => {
    const options = parseOptions({ byweekday: 1 })
    expect(options.parsedOptions.byweekday).toEqual([1])
  })

  it('works with a single Weekday day', () => {
    const options = parseOptions({ byweekday: RRule.TU })
    expect(options.parsedOptions.byweekday).toEqual([1])
  })

  it('works with a single string day', () => {
    const options = parseOptions({ byweekday: 'TU' })
    expect(options.parsedOptions.byweekday).toEqual([1])
  })

  it('works with a multiple numeric days', () => {
    const options = parseOptions({ byweekday: [1, 2] })
    expect(options.parsedOptions.byweekday).toEqual([1, 2])
  })

  it('works with a multiple Weekday days', () => {
    const options = parseOptions({ byweekday: [RRule.TU, RRule.WE] })
    expect(options.parsedOptions.byweekday).toEqual([1, 2])
  })

  it('works with a multiple string days', () => {
    const options = parseOptions({ byweekday: ['TU', 'WE'] })
    expect(options.parsedOptions.byweekday).toEqual([1, 2])
  })
})
