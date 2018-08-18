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
import RRule from './rrule';
import RRuleSet from './rruleset';
import dateutil from './dateutil';
import { includes, split } from './helpers';
import { parseString } from './parsestring';
/**
 * RRuleStr
 *  To parse a set of rrule strings
 */
var DEFAULT_OPTIONS = {
    dtstart: null,
    cache: false,
    unfold: false,
    forceset: false,
    compatible: false,
    tzid: null
};
function _parseRfcRRuleOptions(line, options) {
    if (options === void 0) { options = {}; }
    var parsedOptions = parseString(line);
    if (options.dtstart) {
        parsedOptions.dtstart = options.dtstart;
    }
    if (options.tzid) {
        parsedOptions.tzid = options.tzid;
    }
    return parsedOptions;
}
function _parseRfcRRule(line, options) {
    return new RRule(_parseRfcRRuleOptions(line, options));
}
function _parseRfc(s, options) {
    if (options.compatible) {
        options.forceset = true;
        options.unfold = true;
    }
    var lines = splitIntoLines(s, options.unfold);
    var rrules = s.toUpperCase().match(/RRULE:/ig);
    if (!options.forceset &&
        !s.toUpperCase().match(/RDATE|EXDATE|EXRULE/ig) &&
        (!rrules || rrules.length === 1)) {
        return _parseRfcRRule(lines.join('\n'), {
            cache: options.cache,
            dtstart: options.dtstart
        });
    }
    var rrulevals = [];
    var rdatevals = [];
    var exrulevals = [];
    var exdatevals = [];
    var dtstart;
    var tzid;
    lines.forEach(function (line) {
        if (!line)
            return;
        var _a = breakDownLine(line), name = _a.name, parms = _a.parms, value = _a.value;
        switch (name.toUpperCase()) {
            case 'RRULE':
                if (parms.length) {
                    throw new Error("unsupported RRULE parm: " + parms.join(','));
                }
                rrulevals.push(value);
                break;
            case 'RDATE':
                validateDateParm(parms);
                rdatevals.push(value);
                break;
            case 'EXRULE':
                if (parms.length) {
                    throw new Error("unsupported EXRULE parm: " + parms.join(','));
                }
                exrulevals.push(value);
                break;
            case 'EXDATE':
                validateDateParm(parms);
                exdatevals.push(value);
                break;
            case 'DTSTART':
                dtstart = dateutil.untilStringToDate(value);
                if (parms.length) {
                    var _b = parms[0].split('='), key = _b[0], value_1 = _b[1];
                    if (key === 'TZID') {
                        tzid = value_1;
                    }
                }
                break;
            default:
                throw new Error('unsupported property: ' + name);
        }
    });
    if (options.forceset ||
        rrulevals.length > 1 ||
        rdatevals.length ||
        exrulevals.length ||
        exdatevals.length) {
        var rset_1 = new RRuleSet(!options.cache);
        rrulevals.forEach(function (val) {
            rset_1.rrule(_parseRfcRRule(val, {
                dtstart: options.dtstart || dtstart,
                tzid: options.tzid || tzid
            }));
        });
        rdatevals.forEach(function (dates) {
            dates.split(',').forEach(function (datestr) {
                rset_1.rdate(dateutil.untilStringToDate(datestr));
            });
        });
        exrulevals.forEach(function (val) {
            rset_1.exrule(_parseRfcRRule(val, {
                dtstart: options.dtstart || dtstart,
                tzid: options.tzid || tzid
            }));
        });
        exdatevals.forEach(function (dates) {
            dates.split(',').forEach(function (datestr) {
                rset_1.exdate(dateutil.untilStringToDate(datestr));
            });
        });
        // @ts-ignore
        if (options.compatible && options.dtstart)
            rset_1.rdate(dtstart);
        return rset_1;
    }
    return _parseRfcRRule(rrulevals[0], {
        // @ts-ignore
        dtstart: options.dtstart || dtstart,
        cache: options.cache,
        // @ts-ignore
        tzid: options.tzid || tzid
    });
}
export function rrulestr(s, options) {
    if (options === void 0) { options = {}; }
    return _parseRfc(s, initializeOptions(options));
}
function initializeOptions(options) {
    var invalid = [];
    var keys = Object.keys(options);
    var defaultKeys = Object.keys(DEFAULT_OPTIONS);
    keys.forEach(function (key) {
        if (!includes(defaultKeys, key))
            invalid.push(key);
    });
    if (invalid.length) {
        throw new Error('Invalid options: ' + invalid.join(', '));
    }
    var initializedOptions = __assign({}, options);
    // Merge in default options
    defaultKeys.forEach(function (key) {
        if (!includes(keys, key))
            initializedOptions[key] = DEFAULT_OPTIONS[key];
    });
    return initializedOptions;
}
function extractName(line) {
    if (line.indexOf(':') === -1) {
        return {
            name: 'RRULE',
            value: line
        };
    }
    var _a = split(line, ':', 1), name = _a[0], value = _a[1];
    return {
        name: name,
        value: value
    };
}
function breakDownLine(line) {
    var _a = extractName(line), name = _a.name, value = _a.value;
    var parms = name.split(';');
    if (!parms)
        throw new Error('empty property name');
    return {
        name: parms[0].toUpperCase(),
        parms: parms.slice(1),
        value: value
    };
}
function splitIntoLines(s, unfold) {
    if (unfold === void 0) { unfold = false; }
    s = s && s.trim();
    if (!s)
        throw new Error('Invalid empty string');
    // More info about 'unfold' option
    // Go head to http://www.ietf.org/rfc/rfc2445.txt
    if (!unfold) {
        return s.split(/\s/);
    }
    var lines = s.split('\n');
    var i = 0;
    while (i < lines.length) {
        // TODO
        var line = (lines[i] = lines[i].replace(/\s+$/g, ''));
        if (!line) {
            lines.splice(i, 1);
        }
        else if (i > 0 && line[0] === ' ') {
            lines[i - 1] += line.slice(1);
            lines.splice(i, 1);
        }
        else {
            i += 1;
        }
    }
    return lines;
}
function validateDateParm(parms) {
    for (var j = 0; j < parms.length; j++) {
        var parm = parms[j];
        if (!/(VALUE=DATE-TIME)|(VALUE=DATE)|(TZID=)/.test(parm)) {
            throw new Error('unsupported RDATE/EXDATE parm: ' + parm);
        }
    }
}
//# sourceMappingURL=rrulestr.js.map