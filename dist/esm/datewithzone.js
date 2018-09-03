import dateutil from './dateutil';
import { DateTime } from 'luxon';
var DateWithZone = /** @class */ (function () {
    function DateWithZone(date, tzid) {
        this.date = date;
        this.tzid = tzid;
    }
    DateWithZone.prototype.toString = function () {
        var datestr = dateutil.timeToUntilString(this.date.getTime(), !this.tzid);
        if (this.tzid) {
            return ";TZID=" + this.tzid + ":" + datestr;
        }
        return ":" + datestr;
    };
    DateWithZone.prototype.getTime = function () {
        return this.date.getTime();
    };
    DateWithZone.prototype.rezonedDate = function () {
        if (!this.tzid) {
            return this.date;
        }
        try {
            var datetime = DateTime
                .fromJSDate(this.date);
            var rezoned = datetime.setZone(this.tzid, { keepLocalTime: true });
            return rezoned.toJSDate();
        }
        catch (e) {
            if (e instanceof TypeError) {
                console.error('Using TZID without Luxon available is unsupported. Returned times are in UTC, not the requested time zone');
            }
            return this.date;
        }
    };
    return DateWithZone;
}());
export { DateWithZone };
//# sourceMappingURL=datewithzone.js.map