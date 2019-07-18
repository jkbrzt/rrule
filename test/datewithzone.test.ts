import { DateWithZone } from "../src/datewithzone";
import { expect } from "chai";

describe('toString', () => {
  it('returns the date when no tzid is present', () => {
    const dt = new DateWithZone(new Date(Date.UTC(2010, 9, 5, 11, 0, 0)))
    expect(dt.toString()).to.equal(':20101005T110000Z')

    const dt2 = new DateWithZone(new Date(Date.UTC(2010, 9, 5, 11, 0, 0)), 'UTC')
    expect(dt2.toString()).to.equal(':20101005T110000Z')
   })

  it('returns the date with tzid when present', () => {
    const dt = new DateWithZone(new Date(Date.UTC(2010, 9, 5, 11, 0, 0)), 'Asia/Tokyo')
    expect(dt.toString()).to.equal(';TZID=Asia/Tokyo:20101005T110000')
  })
})

it('returns the time of the date', () => {
  const d = new Date(Date.UTC(2010, 9, 5, 11, 0, 0))
  const dt = new DateWithZone(d)
  expect(dt.getTime()).to.equal(d.getTime())
})
