import { Frequency } from './types';
import { Weekday } from './weekday';
import dateutil from './dateutil';
import { Days } from './rrule';
export function parseString(rfcString) {
    rfcString = rfcString.replace(/^\s+|\s+$/, '');
    if (!rfcString.length)
        return null;
    var options = {};
    var dtstartWithZone = /^DTSTART;TZID=(.+?):([^;]+)$/.exec(rfcString);
    if (dtstartWithZone) {
        var _ = dtstartWithZone[0], tzid = dtstartWithZone[1], dtstart = dtstartWithZone[2];
        options.tzid = tzid;
        options.dtstart = dateutil.untilStringToDate(dtstart);
        return options;
    }
    var attrs = rfcString.split(';');
    for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i].split('=');
        var key = attr[0];
        var value = attr[1];
        switch (key) {
            case 'FREQ':
                options.freq = Frequency[value];
                break;
            case 'WKST':
                options.wkst = Days[value];
                break;
            case 'COUNT':
            case 'INTERVAL':
            case 'BYSETPOS':
            case 'BYMONTH':
            case 'BYMONTHDAY':
            case 'BYYEARDAY':
            case 'BYWEEKNO':
            case 'BYHOUR':
            case 'BYMINUTE':
            case 'BYSECOND':
                var num = void 0;
                if (value.indexOf(',') !== -1) {
                    var values = value.split(',');
                    num = values.map(function (val) {
                        if (/^[+-]?\d+$/.test(val.toString())) {
                            return Number(val);
                        }
                        else {
                            return val;
                        }
                    });
                }
                else if (/^[+-]?\d+$/.test(value)) {
                    num = Number(value);
                }
                else {
                    num = value;
                }
                var optionKey = key.toLowerCase();
                // @ts-ignore
                options[optionKey] = num;
                break;
            case 'BYDAY': // => byweekday
                var n = void 0;
                var wday = void 0;
                var day = void 0;
                var days = value.split(',');
                options.byweekday = [];
                for (var j = 0; j < days.length; j++) {
                    day = days[j];
                    if (day.length === 2) {
                        // MO, TU, ...
                        wday = Days[day]; // wday instanceof Weekday
                        options.byweekday.push(wday);
                    }
                    else {
                        // -1MO, +3FR, 1SO, ...
                        var parts = day.match(/^([+-]?\d)([A-Z]{2})$/);
                        n = Number(parts[1]);
                        var wdaypart = parts[2];
                        wday = Days[wdaypart].weekday;
                        options.byweekday.push(new Weekday(wday, n));
                    }
                }
                break;
            case 'DTSTART':
                options.dtstart = dateutil.untilStringToDate(value);
                break;
            case 'UNTIL':
                options.until = dateutil.untilStringToDate(value);
                break;
            case 'BYEASTER':
                options.byeaster = Number(value);
                break;
            default:
                throw new Error("Unknown RRULE property '" + key + "'");
        }
    }
    return options;
}
//# sourceMappingURL=parsestring.js.map