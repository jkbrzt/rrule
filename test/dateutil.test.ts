import { expect } from 'chai'
import { untilStringToDate } from '../src/dateutil'
import { datetime } from './lib/utils'

describe('untilStringToDate', () => {
  it('parses a date string', () => {
    const date = untilStringToDate('19970902T090000')
    expect(date.getTime()).to.equal(datetime(1997, 9, 2, 9, 0, 0).getTime())
  })
})
