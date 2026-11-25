import { parseOptions } from '../src/parseoptions'
import { RRule, rrulestr, datetime } from '../src'

describe('COUNT', () => {
  it.each([-1, -10, 0.5, NaN, Infinity, -Infinity])(
    'rejects a non-finite, fractional or negative count: %s',
    (count) => {
      expect(() => new RRule({ freq: RRule.DAILY, count })).toThrow(
        'count must be a non-negative integer'
      )
    }
  )

  it('rejects a negative count parsed from a rule string', () => {
    expect(() => RRule.fromString('FREQ=DAILY;COUNT=-1')).toThrow(
      'count must be a non-negative integer'
    )
    expect(() => rrulestr('FREQ=SECONDLY;COUNT=-1')).toThrow(
      'count must be a non-negative integer'
    )
  })

  it('continues to return no occurrences for a zero count', () => {
    expect(new RRule({ freq: RRule.DAILY, count: 0 }).all()).toEqual([])
  })

  it('continues to stop after a positive integer count', () => {
    const dtstart = datetime(2026, 1, 1)
    expect(new RRule({ freq: RRule.DAILY, count: 2, dtstart }).all()).toEqual([
      dtstart,
      datetime(2026, 1, 2),
    ])
  })

  it('continues to support an omitted count bounded by until', () => {
    const dtstart = datetime(2026, 1, 1)
    const until = datetime(2026, 1, 2)
    expect(new RRule({ freq: RRule.DAILY, dtstart, until }).all()).toEqual([
      dtstart,
      until,
    ])
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
