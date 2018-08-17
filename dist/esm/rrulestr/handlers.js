import { Frequency } from '../types';
import dateutil from '../dateutil';
import { Weekday } from '../weekday';
import { Days } from '../rrule';
// tslint:disable-next-line:variable-name
var weekdays = {
    MO: 0,
    TU: 1,
    WE: 2,
    TH: 3,
    FR: 4,
    SA: 5,
    SU: 6
};
export function handle_DTSTART(value) {
    var parms = /^DTSTART(?:;TZID=([^:=]+))?(?::|=)(.*)/.exec(value);
    var __ = parms[0], ___ = parms[1], dtstart = parms[2];
    return dateutil.untilStringToDate(dtstart);
}
export function handle_TZID(value) {
    var parms = /^DTSTART(?:;TZID=([^:=]+))?(?::|=)(.*)/.exec(value);
    var __ = parms[0], tzid = parms[1];
    if (tzid) {
        return tzid;
    }
}
export function handle_int(value) {
    return parseInt(value, 10);
}
export function handle_int_list(value) {
    return value.split(',').map(function (x) { return parseInt(x, 10); });
}
export function handle_FREQ(value) {
    return Frequency[value];
}
export function handle_UNTIL(value) {
    return dateutil.untilStringToDate(value);
}
export function handle_WKST(value) {
    return Days[value];
}
export function handle_BYWEEKDAY(value) {
    return value.split(',').map(function (wday) {
        var n;
        var w;
        // Two ways to specify this: +1MO or MO(+1)
        if (wday.indexOf('(') > -1) {
            // If it's of the form TH(+1), etc.
            var splt = wday.split('(');
            w = splt[0];
            n = parseInt(splt.slice(1, -1)[0], 10);
        }
        else {
            var j = void 0;
            // # If it's of the form +1MO
            for (j = 0; j < wday.length; j++) {
                if ('+-0123456789'.indexOf(wday[j]) === -1)
                    break;
            }
            n = wday.slice(0, j) || null;
            w = wday.slice(j);
            if (n)
                n = parseInt(n, 10);
        }
        return new Weekday(weekdays[w], n);
    });
}
export var handlers = {
    BYDAY: handle_BYWEEKDAY,
    INTERVAL: handle_int,
    COUNT: handle_int,
    FREQ: handle_FREQ,
    UNTIL: handle_UNTIL,
    WKST: handle_WKST,
    BYSETPOS: handle_int_list,
    BYMONTH: handle_int_list,
    BYWEEKDAY: handle_BYWEEKDAY,
    BYMONTHDAY: handle_int_list,
    BYYEARDAY: handle_int_list,
    BYEASTER: handle_int_list,
    BYWEEKNO: handle_int_list,
    BYHOUR: handle_int_list,
    BYMINUTE: handle_int_list,
    BYSECOND: handle_int_list
};
//# sourceMappingURL=handlers.js.map