import dateutil from './dateutil'
import { DateTime } from 'luxon'

export class DateWithZone {
  public date: Date
  public tzid?: string | null

  constructor (date: Date, tzid?: string | null) {
    this.date = date
    this.tzid = tzid
  }

  private get isUTC () {
    return !this.tzid || this.tzid.toUpperCase() === 'UTC'
  }

  public toString () {
    const datestr = dateutil.timeToUntilString(this.date.getTime(), this.isUTC)
    if (!this.isUTC) {
      return `;TZID=${this.tzid}:${datestr}`
    }

    return `:${datestr}`
  }

  public getTime () {
    return this.date.getTime()
  }
}
