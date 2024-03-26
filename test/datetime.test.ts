import { DateTime } from '../src/datetime'
import { Frequency } from '../src'
import { ParsedOptions } from '../src/types'

describe('datetime', () => {
  describe('DateTime', () => {
    const defaultOption: ParsedOptions = {
      freq: Frequency.HOURLY,
      dtstart: null,
      interval: 1,
      wkst: 0,
      count: 1,
      until: null,
      tzid: null,
      bysetpos: null,
      bymonth: null,
      bymonthday: [],
      bynmonthday: [],
      byyearday: null,
      byweekno: null,
      byweekday: null,
      bynweekday: null,
      byhour: [0],
      byminute: [0],
      bysecond: [0],
      byeaster: null,
    }

    it('should not hang when add HOURLY with odd "byhour" and even "interval"', () => {
      const byhour = [1]
      const interval = 2
      const dtstart = new Date(2024, 2, 26)
      const until = new Date(2024, 2, 27)
      const dt = DateTime.fromDate(dtstart)
      dt.add(
        {
          ...defaultOption,
          byhour,
          interval,
          freq: Frequency.HOURLY,
          dtstart,
          until,
        },
        false
      )

      expect(dt.getTime()).toBeGreaterThan(until.getTime())
    })

    it('should not hang when add MINUTELY with odd "byminute" and even "interval"', () => {
      const byminute = [1]
      const interval = 2
      const dtstart = new Date(2024, 2, 26)
      const until = new Date(2024, 2, 27)
      const dt = DateTime.fromDate(dtstart)
      dt.add(
        {
          ...defaultOption,
          byminute,
          interval,
          freq: Frequency.MINUTELY,
          dtstart,
          until,
        },
        false
      )

      expect(dt.getTime()).toBeGreaterThan(until.getTime())
    })

    it('should not hang when add SECONDLY with odd "bysecond" and even "interval"', () => {
      const bysecond = [1]
      const interval = 2
      const dtstart = new Date(2024, 2, 26)
      const until = new Date(2024, 2, 27)
      const dt = DateTime.fromDate(dtstart)
      dt.add(
        {
          ...defaultOption,
          bysecond,
          interval,
          freq: Frequency.SECONDLY,
          dtstart,
          until,
        },
        false
      )

      expect(dt.getTime()).toBeGreaterThan(until.getTime())
    })
  })
})
