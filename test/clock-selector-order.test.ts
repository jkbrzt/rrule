import { RRule } from '../src'

// Regression tests for unsorted BYHOUR/BYMINUTE/BYSECOND values.
// The per-day timeset was built in input order, so occurrences were emitted
// non-chronologically and `between()` (which stops at the first occurrence
// past the window end) silently dropped in-window occurrences. Fixes #647.

const opts = (over: object) => ({
  freq: RRule.DAILY,
  dtstart: new Date(Date.UTC(2024, 0, 1, 7, 0, 0)),
  ...over,
})

const iso = (d: Date) => d.toISOString()

describe('unsorted clock selectors', () => {
  it('emits BYHOUR occurrences chronologically', () => {
    const r = new RRule(opts({ byhour: [21, 3], count: 4 }))
    expect(r.all().map(iso)).toEqual([
      '2024-01-01T21:00:00.000Z',
      '2024-01-02T03:00:00.000Z',
      '2024-01-02T21:00:00.000Z',
      '2024-01-03T03:00:00.000Z',
    ])
  })

  it('emits BYMINUTE occurrences chronologically', () => {
    const r = new RRule(
      opts({ freq: RRule.DAILY, byhour: [9], byminute: [45, 10], count: 4 })
    )
    expect(r.all().map(iso)).toEqual([
      '2024-01-01T09:10:00.000Z',
      '2024-01-01T09:45:00.000Z',
      '2024-01-02T09:10:00.000Z',
      '2024-01-02T09:45:00.000Z',
    ])
  })

  it('emits BYSECOND occurrences chronologically', () => {
    const r = new RRule(
      opts({ freq: RRule.DAILY, byhour: [9], bysecond: [50, 5], count: 4 })
    )
    expect(r.all().map(iso)).toEqual([
      '2024-01-01T09:00:05.000Z',
      '2024-01-01T09:00:50.000Z',
      '2024-01-02T09:00:05.000Z',
      '2024-01-02T09:00:50.000Z',
    ])
  })

  it('between() includes in-window occurrences after a later same-day time', () => {
    const r = new RRule(opts({ byhour: [21, 3] }))
    const got = r.between(
      new Date(Date.UTC(2024, 0, 2, 0, 0)),
      new Date(Date.UTC(2024, 0, 2, 12, 0)),
      true
    )
    expect(got.map(iso)).toEqual(['2024-01-02T03:00:00.000Z'])
  })

  it('COUNT selects the chronologically first occurrences', () => {
    const r = new RRule(opts({ byhour: [21, 3], count: 3 }))
    const got = r.all().map(iso)
    expect(got[got.length - 1]).toBe('2024-01-02T21:00:00.000Z')
    expect(got).toHaveLength(3)
  })

  it('BYSETPOS selects from the chronological period set', () => {
    // Second occurrence of each day: 21:00, not the first-listed 03:00
    const r = new RRule(opts({ byhour: [21, 3], bysetpos: [2], count: 2 }))
    expect(r.all().map(iso)).toEqual([
      '2024-01-01T21:00:00.000Z',
      '2024-01-02T21:00:00.000Z',
    ])
  })

  it('WEEKLY with unsorted BYMINUTE (issue #647 repro)', () => {
    const r = new RRule({
      freq: RRule.WEEKLY,
      dtstart: new Date(Date.UTC(2025, 1, 2, 14, 30, 0)),
      until: new Date(Date.UTC(2025, 1, 4, 0, 0, 0)),
      byweekday: [RRule.MO],
      byhour: [14, 15],
      byminute: [30, 45, 0, 15],
      bysecond: [0],
    })
    const got = r.all().map(iso)
    const sortedCopy = [...got].sort()
    expect(got).toEqual(sortedCopy)
    expect(got[0]).toBe('2025-02-03T14:00:00.000Z')
  })

  it('leaves sorted selectors unchanged', () => {
    const r = new RRule(opts({ byhour: [3, 21], count: 4 }))
    expect(r.all().map(iso)).toEqual([
      '2024-01-01T21:00:00.000Z',
      '2024-01-02T03:00:00.000Z',
      '2024-01-02T21:00:00.000Z',
      '2024-01-03T03:00:00.000Z',
    ])
  })
})
