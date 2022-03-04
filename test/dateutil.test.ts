import { dateutil } from '../src/dateutil'
import { expect } from 'chai'

describe('fromRfc5545DateTime', () => {
  it('parses a date-time string', () => {
    const date = dateutil.fromRfc5545DateTime('19970902T090000')
    expect(date.getTime()).to.equal(new Date(Date.UTC(1997, 8, 2, 9, 0, 0, 0)).getTime())
  })
})

describe('fromRfc5545Date', () => {
  it('parses a date string', () => {
    const date = dateutil.fromRfc5545Date('19970902')
    expect(date.getTime()).to.equal(new Date(Date.UTC(1997, 8, 2, 0, 0, 0, 0)).getTime())
  })
})
