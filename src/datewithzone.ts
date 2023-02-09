import { timeToUntilString } from './dateutil'

export class DateWithZone {
  public date: Date
  public tzid?: string | null

  constructor(date: Date, tzid?: string | null) {
    if (isNaN(date.getTime())) {
      throw new RangeError('Invalid date passed to DateWithZone')
    }
    this.date = date
    this.tzid = tzid
  }

  private get isUTC() {
    return !this.tzid || this.tzid.toUpperCase() === 'UTC'
  }

  public toString() {
    const datestr = timeToUntilString(this.date.getTime(), this.isUTC)
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

    const dateTZtoISO8601 = (date: Date, timeZone: string) => {
      // date format for sv-SE is almost ISO8601
      const dateStr = date.toLocaleString('sv-SE', { timeZone })
      // '2023-02-07 10:41:36'
      return dateStr.replace(' ', 'T') + 'Z'
    }

    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    // Date constructor can only reliably parse dates in ISO8601 format
    const dateInLocalTZ = new Date(dateTZtoISO8601(this.date, localTimeZone))
    const dateInTargetTZ = new Date(
      dateTZtoISO8601(this.date, this.tzid ?? 'UTC')
    )
    const tzOffset = dateInTargetTZ.getTime() - dateInLocalTZ.getTime()

    return new Date(this.date.getTime() - tzOffset)
  }
}
