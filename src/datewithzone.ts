import dateutil from './dateutil'

export class DateWithZone {
  public date: Date
  public tzid?: string | null

  constructor (date: Date, tzid?: string | null) {
    this.date = date
    this.tzid = tzid
  }

  public toString () {
    const datestr = dateutil.timeToUntilString(this.date.getTime(), !this.tzid)
    if (this.tzid) {
      return `;TZID=${this.tzid}:${datestr}`
    }

    return `:${datestr}`
  }

  public getTime () {
    return this.date.getTime()
  }
}
