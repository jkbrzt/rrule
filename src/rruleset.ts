import RRule from './rrule'
import dateutil from './dateutil'
import { includes } from './helpers'
import IterResult from './iterresult'
import { DateWithZone } from './datewithzone'

export default class RRuleSet extends RRule {
  public readonly _rrule: RRule[]
  public readonly _rdate: Date[]
  public readonly _exrule: RRule[]
  public readonly _exdate: Date[]
  private _tzid?: string

  /**
   *
   * @param {Boolean?} noCache
   *  The same stratagy as RRule on cache, default to false
   * @constructor
   */
  constructor (noCache: boolean = false) {
    super({}, noCache)

    this._rrule = []
    this._rdate = []
    this._exrule = []
    this._exdate = []
  }

  tzid (tzid?: string) {
    if (tzid !== undefined) {
      this._tzid = tzid
    }

    if (this._tzid !== undefined) {
      return this._tzid
    }

    for (let i = 0; i < this._rrule.length; i++) {
      const tzid = this._rrule[i].origOptions.tzid
      if (tzid) {
        return tzid
      }
    }
    return undefined
  }

  /**
   * Adds an RRule to the set
   *
   * @param {RRule}
   */
  rrule (rrule: RRule | string) {
    if (!(rrule instanceof RRule)) {
      throw new TypeError(String(rrule) + ' is not RRule instance')
    }
    if (!includes(this._rrule.map(String), String(rrule))) {
      this._rrule.push(rrule)
    }
  }

  /**
   * Adds an RDate to the set
   *
   * @param {Date}
   */
  rdate (date: Date) {
    if (!(date instanceof Date)) {
      throw new TypeError(String(date) + ' is not Date instance')
    }
    if (!includes(this._rdate.map(Number), Number(date))) {
      this._rdate.push(date)
      dateutil.sort(this._rdate)
    }
  }

  /**
   * Adds an EXRULE to the set
   *
   * @param {RRule}
   */
  exrule (rrule: RRule) {
    if (!(rrule instanceof RRule)) {
      throw new TypeError(String(rrule) + ' is not RRule instance')
    }
    if (!includes(this._exrule.map(String), String(rrule))) {
      this._exrule.push(rrule)
    }
  }

  /**
   * Adds an EXDATE to the set
   *
   * @param {Date}
   */
  exdate (date: Date) {
    if (!(date instanceof Date)) {
      throw new TypeError(String(date) + ' is not Date instance')
    }
    if (!includes(this._exdate.map(Number), Number(date))) {
      this._exdate.push(date)
      dateutil.sort(this._exdate)
    }
  }

  private rdatesToString (param: string, rdates: Date[]) {
    const tzid = this.tzid()
    const isUTC = !tzid || tzid.toUpperCase() === 'UTC'
    const header = isUTC ? `${param}:` : `${param};TZID=${tzid}:`

    const dateString = rdates
      .map(rdate => dateutil.timeToUntilString(rdate.valueOf(), isUTC))
      .join(',')

    return `${header}${dateString}`
  }

  valueOf () {
    let result: string[] = []
    this._rrule.forEach(function (rrule) {
      result = result.concat(rrule.toString().split('\n'))
    })

    if (this._rdate.length) {
      result.push(
        this.rdatesToString('RDATE', this._rdate)
      )
    }

    this._exrule.forEach(function (exrule) {
      result = result.concat(
        exrule.toString().split('\n')
          .map(line => line.replace(/^RRULE:/, 'EXRULE:'))
          .filter(line => !/^DTSTART/.test(line))
      )
    })

    if (this._exdate.length) {
      result.push(
        this.rdatesToString('EXDATE', this._exdate)
      )
    }

    return result
  }

  /**
   * to generate recurrence field such as:
   *   DTSTART:19970902T010000Z
   *   RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU
   *   RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH
   */
  toString () {
    return this.valueOf().join('\n')
  }

  _iter (iterResult: IterResult) {
    const _exdateHash: { [k: number]: boolean } = {}
    const _exrule = this._exrule
    const _accept = iterResult.accept
    const tzid = this.tzid()

    function evalExdate (after: Date, before: Date) {
      _exrule.forEach(function (rrule) {
        rrule.between(after, before, true).forEach(function (date) {
          _exdateHash[Number(date)] = true
        })
      })
    }

    this._exdate.forEach(function (date) {
      const zonedDate = new DateWithZone(date, tzid).rezonedDate()
      _exdateHash[Number(zonedDate)] = true
    })

    iterResult.accept = function (date) {
      const dt = Number(date)
      if (!_exdateHash[dt]) {
        evalExdate(new Date(dt - 1), new Date(dt + 1))
        if (!_exdateHash[dt]) {
          _exdateHash[dt] = true
          return _accept.call(this, date)
        }
      }
      return true
    }

    if (iterResult.method === 'between') {
      evalExdate(iterResult.args.after!, iterResult.args.before!)
      iterResult.accept = function (date) {
        const dt = Number(date)
        if (!_exdateHash[dt]) {
          _exdateHash[dt] = true
          return _accept.call(this, date)
        }
        return true
      }
    }

    for (let i = 0; i < this._rdate.length; i++) {
      const zonedDate = new DateWithZone(this._rdate[i], tzid).rezonedDate()
      if (!iterResult.accept(new Date(zonedDate.getTime()))) break
    }

    this._rrule.forEach(function (rrule) {
      rrule._iter(iterResult, rrule.options)
    })

    const res = iterResult._result
    dateutil.sort(res)
    switch (iterResult.method) {
      case 'all':
      case 'between':
        return res
      case 'before':
        return (res.length && res[res.length - 1]) || null
      case 'after':
        return (res.length && res[0]) || null
      default:
        return null
    }
  }

  /**
   * Create a new RRuleSet Object completely base on current instance
   */
  clone (): RRuleSet {
    const rrs = new RRuleSet(!!this._cache)
    let i
    for (i = 0; i < this._rrule.length; i++) {
      rrs.rrule(this._rrule[i].clone())
    }
    for (i = 0; i < this._rdate.length; i++) {
      rrs.rdate(new Date(this._rdate[i].getTime()))
    }
    for (i = 0; i < this._exrule.length; i++) {
      rrs.exrule(this._exrule[i].clone())
    }
    for (i = 0; i < this._exdate.length; i++) {
      rrs.exdate(new Date(this._exdate[i].getTime()))
    }
    return rrs
  }
}
