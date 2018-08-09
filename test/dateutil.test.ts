import { dateutil } from '../src/dateutil'
import { expect } from 'chai'

describe.only('untilStringToDate', () => {
  it('parses a date string', () => {
    const date = dateutil.untilStringToDate('19970902T090000')
    expect(date.getTime()).to.equal(new Date(Date.UTC(1997, 8, 2, 9, 0, 0, 0)).getTime())
  })
})
