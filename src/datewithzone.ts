import dateutil from './dateutil'

export class DateWithZone {
  public date: Date
  public tzid?: string | null

  constructor(date: Date, tzid?: string | null) {
    this.date = date
    this.tzid = tzid
  }

  private get isUTC() {
    return !this.tzid || this.tzid.toUpperCase() === 'UTC'
  }

  public toString() {
    const datestr = dateutil.timeToUntilString(this.date.getTime(), this.isUTC)
    if (!this.isUTC) {
      return `;TZID=${this.tzid}:${datestr}`
    }

    return `:${datestr}`
  }

  public getTime() {
    return this.date.getTime()
  }

  public rezonedDate() {
    if (this.isUTC) {
      return this.date
    }

    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const dateInLocalTZ = new Date(
      this.date.toLocaleString(undefined, { timeZone: localTimeZone })
    )
    const dateInTargetTZ = new Date(
      this.date.toLocaleString(undefined, { timeZone: this.tzid ?? 'UTC' })
    )
    const tzOffset = dateInTargetTZ.getTime() - dateInLocalTZ.getTime()

    return new Date(this.date.getTime() - tzOffset)
  }
}
