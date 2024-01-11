import { DateWithZone } from '../src/datewithzone'
import { datetime, formatDate } from './lib/utils'

describe('toString', () => {
  it('returns the date when no tzid is present', () => {
    const dt = new DateWithZone(datetime(2010, 10, 5, 11, 0, 0))
    expect(dt.toString()).toBe(':20101005T110000Z')

    const dt2 = new DateWithZone(datetime(2010, 10, 5, 11, 0, 0), 'UTC')
    expect(dt2.toString()).toBe(':20101005T110000Z')
  })

  it('returns the date with tzid when present', () => {
    const dt = new DateWithZone(datetime(2010, 10, 5, 11, 0, 0), 'Asia/Tokyo')
    expect(dt.toString()).toBe(';TZID=Asia/Tokyo:20101005T110000')
  })
})

it('returns the time of the date', () => {
  const d = datetime(2010, 10, 5, 11, 0, 0)
  const dt = new DateWithZone(d)
  expect(dt.getTime()).toBe(d.getTime())
})

it('rejects invalid dates', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect(() => new DateWithZone(new Date(undefined as any))).toThrow(
    'Invalid date passed to DateWithZone'
  )
})

describe('rezonedDate', () => {
  it('returns the original date when no zone is given', () => {
    const d = datetime(2010, 10, 5, 11, 0, 0)
    const dt = new DateWithZone(d)
    expect(dt.rezonedDate()).toStrictEqual(d)
  })

  it('returns the date in the correct zone when given', () => {
    const dt = new DateWithZone(
      new Date('2010-10-05T11:00:00'),
      'America/New_York'
    )
    expect(formatDate(dt.rezonedDate(), 'America/New_York')).toStrictEqual(
      '2010-10-05 11:00:00 GMT−4'
    )
  })
})
