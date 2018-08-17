import RRule from '../rrule';
import RRuleSet from '../rruleset';
import dateutil from '../dateutil';
import { includes, split, compact } from '../helpers';
import { handlers, handle_DTSTART, handle_TZID } from './handlers';
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
function _parseRfcRRule(line, options) {
    if (options === void 0) { options = {}; }
    options.dtstart = options.dtstart || null;
    options.cache = options.cache || false;
    var name;
    var value;
    var nameRegex = /^([A-Z]+):(.*)$/;
    var nameParts = nameRegex.exec(line);
    if (nameParts && nameParts.length >= 3) {
        name = nameParts[1];
        value = nameParts[2];
        if (name !== 'RRULE')
            throw new Error("unknown parameter name " + name);
    }
    else {
        value = line;
    }
    var rrkwargs = {};
    rrkwargs.dtstart = handle_DTSTART(line) || options.dtstart;
    rrkwargs.tzid = handle_TZID(line) || options.tzid;
    var pairs = value.split(';');
    for (var i = 0; i < pairs.length; i++) {
        var parts = pairs[i].split('=');
        name = parts[0].toUpperCase();
        if (/DTSTART|TZID/.test(name)) {
            continue;
        }
        var value_1 = parts[1].toUpperCase();
        var paramHandler = handlers[name];
        if (typeof paramHandler !== 'function') {
            throw new Error("unknown parameter '" + name + "':" + value_1);
        }
        if (name === 'BYDAY')
            name = 'BYWEEKDAY';
        rrkwargs[name.toLowerCase()] = paramHandler(value_1);
    }
    rrkwargs.dtstart = rrkwargs.dtstart || options.dtstart;
    rrkwargs.tzid = rrkwargs.tzid || options.tzid;
    return new RRule(compact(rrkwargs), !options.cache);
}
function _parseRfc(s, options) {
    if (options.compatible) {
        options.forceset = true;
        options.unfold = true;
    }
    var lines = splitIntoLines(s, options.unfold);
    if (!options.forceset &&
        lines.length === 1 &&
        (s.indexOf(':') === -1 || s.indexOf('RRULE:') === 0)) {
        return _parseRfcRRule(lines[0], {
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
        switch (name) {
            case 'RRULE':
                if (parms.length) {
                    throw new Error("unsupported RRULE parm: " + parms.join(','));
                }
                rrulevals.push(value);
                break;
            case 'RDATE':
                for (var j = 0; j < parms.length; j++) {
                    var parm = parms[j];
                    if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
                        throw new Error('unsupported RDATE parm: ' + parm);
                    }
                }
                rdatevals.push(value);
                break;
            case 'EXRULE':
                if (parms.length) {
                    throw new Error("unsupported EXRULE parm: " + parms.join(','));
                }
                exrulevals.push(value);
                break;
            case 'EXDATE':
                for (var j = 0; j < parms.length; j++) {
                    var parm = parms[j];
                    if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
                        throw new Error('unsupported EXDATE parm: ' + parm);
                    }
                }
                exdatevals.push(value);
                break;
            case 'DTSTART':
                dtstart = dateutil.untilStringToDate(value);
                if (parms.length) {
                    var _b = parms[0].split('='), key = _b[0], value_2 = _b[1];
                    if (key === 'TZID') {
                        tzid = value_2;
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
                dtstart: options.dtstart || dtstart
            }));
        });
        rdatevals.forEach(function (dates) {
            dates.split(',').forEach(function (datestr) {
                rset_1.rdate(dateutil.untilStringToDate(datestr));
            });
        });
        exrulevals.forEach(function (val) {
            rset_1.exrule(_parseRfcRRule(val, {
                dtstart: options.dtstart || dtstart
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
    // Merge in default options
    defaultKeys.forEach(function (key) {
        if (!includes(keys, key))
            options[key] = DEFAULT_OPTIONS[key];
    });
    return _parseRfc(s, options);
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
    if (unfold) {
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
    else {
        return s.split(/\s/);
    }
}
//# sourceMappingURL=index.js.map