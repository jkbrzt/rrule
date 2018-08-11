"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rrule_1 = require("./rrule");
const helpers_1 = require("./helpers");
const weekday_1 = require("./weekday");
const dateutil_1 = require("./dateutil");
function optionsToString(options) {
    const pairs = [];
    const keys = Object.keys(options);
    const defaultKeys = Object.keys(rrule_1.DEFAULT_OPTIONS);
    for (let i = 0; i < keys.length; i++) {
        if (!helpers_1.includes(defaultKeys, keys[i]))
            continue;
        let key = keys[i].toUpperCase();
        let value = options[keys[i]];
        let strValues = [];
        if (!helpers_1.isPresent(value) || (helpers_1.isArray(value) && !value.length))
            continue;
        switch (key) {
            case 'FREQ':
                value = rrule_1.default.FREQUENCIES[options.freq];
                break;
            case 'WKST':
                if (helpers_1.isNumber(value)) {
                    value = new weekday_1.default(value);
                }
                break;
            case 'BYWEEKDAY':
                /*
                NOTE: BYWEEKDAY is a special case.
                RRule() deconstructs the rule.options.byweekday array
                into an array of Weekday arguments.
                On the other hand, rule.origOptions is an array of Weekdays.
                We need to handle both cases here.
                It might be worth change RRule to keep the Weekdays.
      
                Also, BYWEEKDAY (used by RRule) vs. BYDAY (RFC)
      
                */
                key = 'BYDAY';
                if (!helpers_1.isArray(value))
                    value = [value];
                for (let j = 0; j < value.length; j++) {
                    let wday = value[j];
                    if (wday instanceof weekday_1.default) {
                        // good
                    }
                    else if (helpers_1.isArray(wday)) {
                        wday = new weekday_1.default(wday[0], wday[1]);
                    }
                    else {
                        wday = new weekday_1.default(wday);
                    }
                    strValues[j] = wday.toString();
                }
                value = strValues;
                break;
            case 'DTSTART':
            case 'UNTIL':
                value = dateutil_1.default.timeToUntilString(value);
                break;
            default:
                if (helpers_1.isArray(value)) {
                    for (let j = 0; j < value.length; j++) {
                        strValues[j] = String(value[j]);
                    }
                    value = strValues;
                }
                else {
                    value = String(value);
                }
        }
        pairs.push([key, value]);
    }
    const strings = [];
    for (let i = 0; i < pairs.length; i++) {
        const attr = pairs[i];
        strings.push(attr[0] + '=' + attr[1].toString());
    }
    return strings.join(';');
}
exports.optionsToString = optionsToString;
//# sourceMappingURL=optionstostring.js.map