import { QueryMethodTypes, IterResultType } from './types'

// =============================================================================
// Results
// =============================================================================

export interface IterArgs {
  inc: boolean
  before: Date
  after: Date
  dt: Date
  _value: Date | Date[] | null
}

/**
 * This class helps us to emulate python's generators, sorta.
 */
export default class IterResult<M extends QueryMethodTypes> {
  public readonly method: M
  public readonly args: Partial<IterArgs>
  public readonly minDate: Date | null = null
  public readonly maxDate: Date | null = null
  public total = 0

  constructor (method: M, args: Partial<IterArgs>) {
    this.method = method
    this.args = args

    if (method === 'between') {
      this.maxDate = args.inc
        ? args.before!
        : new Date(args.before!.getTime() - 1)
      this.minDate = args.inc ? args.after! : new Date(args.after!.getTime() + 1)
    } else if (method === 'before') {
      this.maxDate = args.inc ? args.dt! : new Date(args.dt!.getTime() - 1)
    } else if (method === 'after') {
      this.minDate = args.inc ? args.dt! : new Date(args.dt!.getTime() + 1)
    }
  }

  /**
   * Checks a date against the boundary conditions
   *
   * @param {Date} date
   * @return {Boolean} true this is a date of interest
   */
  accept (date: Date) {
    ++this.total
    const tooEarly = this.minDate && date < this.minDate
    const tooLate = this.maxDate && date > this.maxDate

    if (this.method === 'between') {
      if (tooEarly) return false
      if (tooLate) return false
    } else if (this.method === 'before') {
      if (tooLate) return false
    } else if (this.method === 'after') {
      if (tooEarly) return false
      return true
    }

    return true
  }

  /**
   * Checks if we should continue hte
   *
   * @param {Date} date - the date isn't necessarly added to the result
   *                      list (if it is too late/too early)
   * @return {Boolean} true if it makes sense to continue the iteration
   *                   false if we're done.
   */
  shouldContinue (date: Date) {
    ++this.total
    const tooEarly = this.minDate && date < this.minDate
    const tooLate = this.maxDate && date > this.maxDate

    if (this.method === 'between') {
      if (tooEarly) return true
      if (tooLate) return false
    } else if (this.method === 'before') {
      if (tooLate) return false
    } else if (this.method === 'after') {
      if (tooEarly) return true
      if (tooLate) return false
    }

    return true
  }

  clone () {
    return new IterResult(this.method, this.args)
  }
}
