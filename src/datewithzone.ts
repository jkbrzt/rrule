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

  public rezonedDate () {
    if (this.isUTC) {
      return this.date
    }

    try {
      const datetime = DateTime
        .fromJSDate(this.date)

      const rezoned = datetime.setZone(this.tzid!, { keepLocalTime: true })

      return rezoned.toJSDate()
    } catch (e) {
      if (e instanceof TypeError) {
        console.error('Using TZID without Luxon available is unsupported. Returned times are in UTC, not the requested time zone')
      }
      return this.date
    }
  }
}
