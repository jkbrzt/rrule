var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { Frequency } from './types';
import { Weekday } from './weekday';
import dateutil from './dateutil';
import { Days } from './rrule';
export function parseString(rfcString) {
    var options = rfcString.split('\n').map(parseLine).filter(function (x) { return x !== null; });
    return __assign({}, options[0], options[1]);
}
function parseDtstart(line) {
    var options = {};
    var dtstartWithZone = /^DTSTART(?:;TZID=([^:]+?))?:([^;]+)$/.exec(line);
    if (!dtstartWithZone) {
        return options;
    }
    var _ = dtstartWithZone[0], tzid = dtstartWithZone[1], dtstart = dtstartWithZone[2];
    options.tzid = tzid;
    options.dtstart = dateutil.untilStringToDate(dtstart);
    return options;
}
function parseLine(rfcString) {
    rfcString = rfcString.replace(/^\s+|\s+$/, '');
    if (!rfcString.length)
        return null;
    var header = /^([A-Z]+)[:;]/.exec(rfcString);
    if (!header) {
        return parseRrule(rfcString);
    }
    var _ = header[0], key = header[1];
    switch (key) {
        case 'RRULE':
            return parseRrule(rfcString);
        case 'DTSTART':
            return parseDtstart(rfcString);
        default:
            throw new Error("Unsupported RFC prop " + key + " in " + rfcString);
    }
}
function parseRrule(line) {
    var options = {};
    var attrs = line.replace(/^RRULE:/, '').split(';');
    attrs.forEach(function (attr) {
        var _a = attr.split('='), key = _a[0], value = _a[1];
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
                var num = parseNumber(value);
                var optionKey = key.toLowerCase();
                // @ts-ignore
                options[optionKey] = num;
                break;
            case 'BYDAY': // => byweekday
                options.byweekday = parseWeekday(value);
                break;
            case 'DTSTART':
                // for backwards compatibility
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
    });
    return options;
}
function parseNumber(value) {
    if (value.indexOf(',') !== -1) {
        var values = value.split(',');
        return values.map(function (val) {
            if (/^[+-]?\d+$/.test(val.toString())) {
                return Number(val);
            }
            else {
                return val;
            }
        });
    }
    else if (/^[+-]?\d+$/.test(value)) {
        return Number(value);
    }
    return value;
}
function parseWeekday(value) {
    var days = value.split(',');
    return days.map(function (day) {
        if (day.length === 2) {
            // MO, TU, ...
            return Days[day]; // wday instanceof Weekday
        }
        else {
            // -1MO, +3FR, 1SO, ...
            var parts = day.match(/^([+-]?\d)([A-Z]{2})$/);
            var n = Number(parts[1]);
            var wdaypart = parts[2];
            var wday = Days[wdaypart].weekday;
            return new Weekday(wday, n);
        }
    });
}
//# sourceMappingURL=parsestring.js.map