import { datetime, untilStringToDate, dateTZtoISO8601 } from '../src/dateutil'

describe('untilStringToDate', () => {
  it('parses a date string', () => {
    const date = untilStringToDate('19970902T090000')
    expect(date.getTime()).toBe(datetime(1997, 9, 2, 9, 0, 0).getTime())
  })
})

describe('dateTZtoISO8601', () => {
  it('correctly formats a date with em suffix from toLocaleString', () => {
    // Mock Date.prototype.toLocaleString to simulate iOS behavior
    const originalToLocaleString = Date.prototype.toLocaleString
    Date.prototype.toLocaleString = jest.fn(() => '2045-10-31 1:00:00 em')

    const date = new Date()
    const timeZone = 'America/Los_Angeles'

    // Your patched function that handles the iOS date string correctly
    expect(dateTZtoISO8601(date, timeZone)).toBe('2045-10-31T1:00:00Z')

    // Restore the original toLocaleString method after the test
    Date.prototype.toLocaleString = originalToLocaleString
  })

  it('correctly formats a date with fm suffix from toLocaleString', () => {
    // Mock Date.prototype.toLocaleString to simulate iOS behavior
    const originalToLocaleString = Date.prototype.toLocaleString
    Date.prototype.toLocaleString = jest.fn(() => '2045-10-31 1:00:00 fm')

    const date = new Date()
    const timeZone = 'America/Los_Angeles'

    // Your patched function that handles the iOS date string correctly
    expect(dateTZtoISO8601(date, timeZone)).toBe('2045-10-31T1:00:00Z')

    // Restore the original toLocaleString method after the test
    Date.prototype.toLocaleString = originalToLocaleString
  })

  it('formats a date in ISO8601 format for non-iOS environments', () => {
    const date = new Date(1704830400000)
    const timeZone = 'America/Los_Angeles'
    // This tests the function in environments that do not have the ' em' issue
    expect(dateTZtoISO8601(date, timeZone)).toBe('2024-01-09T12:00:00Z')
  })
})
