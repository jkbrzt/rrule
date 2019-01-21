import RRule from './rrule'
import dateutil from './dateutil'
import { includes } from './helpers'
import IterResult from './iterresult'
import { iterSet } from './iterset'
import { QueryMethodTypes, IterResultType } from './types'

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

  _iter <M extends QueryMethodTypes> (iterResult: IterResult<M>): IterResultType<M> {
    return iterSet(
      iterResult,
      this._rrule,
      this._exrule,
      this._rdate,
      this._exdate,
      this.tzid()
    )
  }

  /**
   * Adds an RRule to the set
   *
   * @param {RRule}
   */
  rrule (rrule: RRule) {
    _addRule(rrule, this._rrule)
  }

  /**
   * Adds an EXRULE to the set
   *
   * @param {RRule}
   */
  exrule (rrule: RRule) {
    _addRule(rrule, this._exrule)
  }

  /**
   * Adds an RDate to the set
   *
   * @param {Date}
   */
  rdate (date: Date) {
    _addDate(date, this._rdate)
  }

  /**
   * Adds an EXDATE to the set
   *
   * @param {Date}
   */
  exdate (date: Date) {
    _addDate(date, this._exdate)
  }

  valueOf () {
    let result: string[] = []
    this._rrule.forEach(function (rrule) {
      result = result.concat(rrule.toString().split('\n'))
    })

    this._exrule.forEach(function (exrule) {
      result = result.concat(
        exrule.toString().split('\n')
          .map(line => line.replace(/^RRULE:/, 'EXRULE:'))
          .filter(line => !/^DTSTART/.test(line))
      )
    })

    if (this._rdate.length) {
      result.push(
        rdatesToString('RDATE', this._rdate, this.tzid())
      )
    }

    if (this._exdate.length) {
      result.push(
        rdatesToString('EXDATE', this._exdate, this.tzid())
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

  /**
   * Create a new RRuleSet Object completely base on current instance
   */
  clone (): RRuleSet {
    const rrs = new RRuleSet(!!this._cache)

    this._rrule.forEach(rule => rrs.rrule(rule.clone()))
    this._exrule.forEach(rule => rrs.exrule(rule.clone()))
    this._rdate.forEach(date => rrs.rdate(new Date(date.getTime())))
    this._exdate.forEach(date => rrs.exdate(new Date(date.getTime())))

    return rrs
  }
}

function _addRule (rrule: RRule, collection: RRule[]) {
  if (!(rrule instanceof RRule)) {
    throw new TypeError(String(rrule) + ' is not RRule instance')
  }

  if (!includes(collection.map(String), String(rrule))) {
    collection.push(rrule)
  }
}

function _addDate (date: Date, collection: Date[]) {
  if (!(date instanceof Date)) {
    throw new TypeError(String(date) + ' is not Date instance')
  }
  if (!includes(collection.map(Number), Number(date))) {
    collection.push(date)
    dateutil.sort(collection)
  }
}

function rdatesToString (param: string, rdates: Date[], tzid: string | undefined) {
  const isUTC = !tzid || tzid.toUpperCase() === 'UTC'
  const header = isUTC ? `${param}:` : `${param};TZID=${tzid}:`

  const dateString = rdates
      .map(rdate => dateutil.timeToUntilString(rdate.valueOf(), isUTC))
      .join(',')

  return `${header}${dateString}`
}
