import RRule from './rrule';
import RRuleSet from './rruleset';
import dateutil from './dateutil';
import { Weekday } from './weekday';
import { includes, split } from './helpers';
/**
 * RRuleStr
 *  To parse a set of rrule strings
 */
var RRuleStr = /** @class */ (function () {
    function RRuleStr() {
        // tslint:disable:variable-name
        this._handle_BYDAY = this._handle_BYWEEKDAY;
        this._handle_INTERVAL = this._handle_int;
        this._handle_COUNT = this._handle_int;
        this._handle_BYSETPOS = this._handle_int_list;
        this._handle_BYMONTH = this._handle_int_list;
        this._handle_BYMONTHDAY = this._handle_int_list;
        this._handle_BYYEARDAY = this._handle_int_list;
        this._handle_BYEASTER = this._handle_int_list;
        this._handle_BYWEEKNO = this._handle_int_list;
        this._handle_BYHOUR = this._handle_int_list;
        this._handle_BYMINUTE = this._handle_int_list;
        this._handle_BYSECOND = this._handle_int_list;
        // tslint:enable:variable-name
    }
    // tslint:disable-next-line:variable-name
    RRuleStr.prototype._handle_DTSTART = function (rrkwargs, _, value, __) {
        var parms = /^DTSTART(?:;TZID=([^:=]+))?(?::|=)(.*)/.exec(value);
        var ___ = parms[0], tzid = parms[1], dtstart = parms[2];
        rrkwargs['dtstart'] = dateutil.untilStringToDate(dtstart);
        if (tzid) {
            rrkwargs['tzid'] = tzid;
        }
    };
    RRuleStr.prototype._handle_int = function (rrkwargs, name, value) {
        // @ts-ignore
        rrkwargs[name.toLowerCase()] = parseInt(value, 10);
    };
    RRuleStr.prototype._handle_int_list = function (rrkwargs, name, value) {
        // @ts-ignore
        rrkwargs[name.toLowerCase()] = value.split(',').map(function (x) { return parseInt(x, 10); });
    };
    RRuleStr.prototype._handle_FREQ = function (rrkwargs, _, value, __) {
        rrkwargs['freq'] = RRuleStr._freq_map[value];
    };
    RRuleStr.prototype._handle_UNTIL = function (rrkwargs, _, value, __) {
        try {
            rrkwargs['until'] = dateutil.untilStringToDate(value);
        }
        catch (error) {
            throw new Error('invalid until date');
        }
    };
    RRuleStr.prototype._handle_WKST = function (rrkwargs, _, value, __) {
        rrkwargs['wkst'] = RRuleStr._weekday_map[value];
    };
    RRuleStr.prototype._handle_BYWEEKDAY = function (rrkwargs, _, value, __) {
        // Two ways to specify this: +1MO or MO(+1)
        var splt;
        var i;
        var j;
        var n;
        var w;
        var wday;
        var l = [];
        var wdays = value.split(',');
        for (i = 0; i < wdays.length; i++) {
            wday = wdays[i];
            if (wday.indexOf('(') > -1) {
                // If it's of the form TH(+1), etc.
                splt = wday.split('(');
                w = splt[0];
                n = parseInt(splt.slice(1, -1)[0], 10);
            }
            else {
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
            var weekday = new Weekday(RRuleStr._weekday_map[w], n);
            l.push(weekday);
        }
        rrkwargs['byweekday'] = l;
    };
    RRuleStr.prototype._parseRfcRRule = function (line, options) {
        if (options === void 0) { options = {}; }
        options.dtstart = options.dtstart || null;
        options.cache = options.cache || false;
        var name;
        var value;
        var parts;
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
        var dtstart = /DTSTART(?:;TZID=[^:]+:)?[^;]+/.exec(line);
        if (dtstart && dtstart.length > 0) {
            var dtstartClause = dtstart[0];
            this._handle_DTSTART(rrkwargs, 'DTSTART', dtstartClause);
        }
        var pairs = value.split(';');
        for (var i = 0; i < pairs.length; i++) {
            parts = pairs[i].split('=');
            name = parts[0].toUpperCase();
            if (/DTSTART|TZID/.test(name)) {
                continue;
            }
            value = parts[1].toUpperCase();
            // @ts-ignore
            var paramHandler = this["_handle_" + name];
            if (typeof paramHandler !== 'function') {
                throw new Error("unknown parameter '" + name + "':" + value);
            }
            paramHandler(rrkwargs, name, value);
        }
        rrkwargs.dtstart = rrkwargs.dtstart || options.dtstart;
        rrkwargs.tzid = rrkwargs.tzid || options.tzid;
        return new RRule(rrkwargs, !options.cache);
    };
    RRuleStr.prototype._parseRfc = function (s, options) {
        if (options.compatible) {
            options.forceset = true;
            options.unfold = true;
        }
        s = s && s.trim();
        if (!s)
            throw new Error('Invalid empty string');
        var i = 0;
        var line;
        var lines;
        // More info about 'unfold' option
        // Go head to http://www.ietf.org/rfc/rfc2445.txt
        if (options.unfold) {
            lines = s.split('\n');
            while (i < lines.length) {
                // TODO
                line = lines[i] = lines[i].replace(/\s+$/g, '');
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
        }
        else {
            lines = s.split(/\s/);
        }
        var rrulevals = [];
        var rdatevals = [];
        var exrulevals = [];
        var exdatevals = [];
        var name;
        var value;
        var parts;
        var dtstart;
        var tzid;
        var rset;
        var j;
        var k;
        var datestrs;
        var datestr;
        if (!options.forceset &&
            lines.length === 1 &&
            (s.indexOf(':') === -1 || s.indexOf('RRULE:') === 0)) {
            return this._parseRfcRRule(lines[0], {
                cache: options.cache,
                dtstart: options.dtstart
            });
        }
        else {
            for (var i_1 = 0; i_1 < lines.length; i_1++) {
                line = lines[i_1];
                if (!line)
                    continue;
                if (line.indexOf(':') === -1) {
                    name = 'RRULE';
                    value = line;
                }
                else {
                    parts = split(line, ':', 1);
                    name = parts[0];
                    value = parts[1];
                }
                var parms = name.split(';');
                if (!parms)
                    throw new Error('empty property name');
                name = parms[0].toUpperCase();
                parms = parms.slice(1);
                if (name === 'RRULE') {
                    for (j = 0; j < parms.length; j++) {
                        var parm = parms[j];
                        throw new Error('unsupported RRULE parm: ' + parm);
                    }
                    rrulevals.push(value);
                }
                else if (name === 'RDATE') {
                    for (j = 0; j < parms.length; j++) {
                        var parm = parms[j];
                        if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
                            throw new Error('unsupported RDATE parm: ' + parm);
                        }
                    }
                    rdatevals.push(value);
                }
                else if (name === 'EXRULE') {
                    for (j = 0; j < parms.length; j++) {
                        var parm = parms[j];
                        throw new Error('unsupported EXRULE parm: ' + parm);
                    }
                    exrulevals.push(value);
                }
                else if (name === 'EXDATE') {
                    for (j = 0; j < parms.length; j++) {
                        var parm = parms[j];
                        if (parm !== 'VALUE=DATE-TIME' && parm !== 'VALUE=DATE') {
                            throw new Error('unsupported EXDATE parm: ' + parm);
                        }
                    }
                    exdatevals.push(value);
                }
                else if (name === 'DTSTART') {
                    dtstart = dateutil.untilStringToDate(value);
                    if (parms.length) {
                        var _a = parms[0].split('='), key = _a[0], value_1 = _a[1];
                        if (key === 'TZID') {
                            tzid = value_1;
                        }
                    }
                }
                else {
                    throw new Error('unsupported property: ' + name);
                }
            }
            if (options.forceset ||
                rrulevals.length > 1 ||
                rdatevals.length ||
                exrulevals.length ||
                exdatevals.length) {
                rset = new RRuleSet(!options.cache);
                for (j = 0; j < rrulevals.length; j++) {
                    rset.rrule(this._parseRfcRRule(rrulevals[j], {
                        // @ts-ignore
                        dtstart: options.dtstart || dtstart
                    }));
                }
                for (j = 0; j < rdatevals.length; j++) {
                    datestrs = rdatevals[j].split(',');
                    for (k = 0; k < datestrs.length; k++) {
                        datestr = datestrs[k];
                        rset.rdate(dateutil.untilStringToDate(datestr));
                    }
                }
                for (j = 0; j < exrulevals.length; j++) {
                    rset.exrule(this._parseRfcRRule(exrulevals[j], {
                        // @ts-ignore
                        dtstart: options.dtstart || dtstart
                    }));
                }
                for (j = 0; j < exdatevals.length; j++) {
                    datestrs = exdatevals[j].split(',');
                    for (k = 0; k < datestrs.length; k++) {
                        datestr = datestrs[k];
                        rset.exdate(dateutil.untilStringToDate(datestr));
                    }
                }
                // @ts-ignore
                if (options.compatible && options.dtstart)
                    rset.rdate(dtstart);
                return rset;
            }
            else {
                return this._parseRfcRRule(rrulevals[0], {
                    // @ts-ignore
                    dtstart: options.dtstart || dtstart,
                    cache: options.cache,
                    // @ts-ignore
                    tzid: options.tzid || tzid
                });
            }
        }
    };
    RRuleStr.prototype.parse = function (s, options) {
        if (options === void 0) { options = {}; }
        var invalid = [];
        var keys = Object.keys(options);
        var defaultKeys = Object.keys(RRuleStr.DEFAULT_OPTIONS);
        keys.forEach(function (key) {
            if (!includes(defaultKeys, key))
                invalid.push(key);
        }, this);
        if (invalid.length) {
            throw new Error('Invalid options: ' + invalid.join(', '));
        }
        // Merge in default options
        defaultKeys.forEach(function (key) {
            if (!includes(keys, key))
                options[key] = RRuleStr.DEFAULT_OPTIONS[key];
        });
        return this._parseRfc(s, options);
    };
    // tslint:disable-next-line:variable-name
    RRuleStr._weekday_map = {
        MO: 0,
        TU: 1,
        WE: 2,
        TH: 3,
        FR: 4,
        SA: 5,
        SU: 6
    };
    // tslint:disable-next-line:variable-name
    RRuleStr._freq_map = {
        YEARLY: RRule.YEARLY,
        MONTHLY: RRule.MONTHLY,
        WEEKLY: RRule.WEEKLY,
        DAILY: RRule.DAILY,
        HOURLY: RRule.HOURLY,
        MINUTELY: RRule.MINUTELY,
        SECONDLY: RRule.SECONDLY
    };
    RRuleStr.DEFAULT_OPTIONS = {
        dtstart: null,
        cache: false,
        unfold: false,
        forceset: false,
        compatible: false,
        tzid: null
    };
    return RRuleStr;
}());
export default RRuleStr;
//# sourceMappingURL=rrulestr.js.map