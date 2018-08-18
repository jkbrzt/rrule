import dateutil from './dateutil';
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
    return DateWithZone;
}());
export { DateWithZone };
//# sourceMappingURL=datewithzone.js.map