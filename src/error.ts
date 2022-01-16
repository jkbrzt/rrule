
export class RRuleErrorHandler {

  static emitLuxonTzidError = true;

  static logLuxonTzidError(e: TypeError) {
    if (this.emitLuxonTzidError) {
      console.error('Using TZID without Luxon available is unsupported. Returned times are in UTC, not the requested time zone')
    }
  }

}
