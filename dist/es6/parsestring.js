"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const weekday_1 = require("./weekday");
const dateutil_1 = require("./dateutil");
function parseString(rfcString) {
    rfcString = rfcString.replace(/^\s+|\s+$/, '');
    if (!rfcString.length)
        return null;
    const attrs = rfcString.split(';');
    const options = {};
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i].split('=');
        const key = attr[0];
        const value = attr[1];
        switch (key) {
            case 'FREQ':
                options.freq = types_1.Frequency[value];
                break;
            case 'WKST':
                options.wkst = types_1.Days[value];
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
                let num;
                if (value.indexOf(',') !== -1) {
                    const values = value.split(',');
                    num = values.map(val => {
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
                const optionKey = key.toLowerCase();
                // @ts-ignore
                options[optionKey] = num;
                break;
            case 'BYDAY': // => byweekday
                let n;
                let wday;
                let day;
                const days = value.split(',');
                options.byweekday = [];
                for (let j = 0; j < days.length; j++) {
                    day = days[j];
                    if (day.length === 2) {
                        // MO, TU, ...
                        wday = types_1.Days[day]; // wday instanceof Weekday
                        options.byweekday.push(wday);
                    }
                    else {
                        // -1MO, +3FR, 1SO, ...
                        const parts = day.match(/^([+-]?\d)([A-Z]{2})$/);
                        n = Number(parts[1]);
                        const wdaypart = parts[2];
                        wday = types_1.Days[wdaypart].weekday;
                        options.byweekday.push(new weekday_1.default(wday, n));
                    }
                }
                break;
            case 'DTSTART':
                options.dtstart = dateutil_1.default.untilStringToDate(value);
                break;
            case 'UNTIL':
                options.until = dateutil_1.default.untilStringToDate(value);
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
exports.parseString = parseString;
//# sourceMappingURL=parsestring.js.map