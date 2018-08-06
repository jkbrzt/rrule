"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const rrule_1 = require("./rrule");
const dateutil_1 = require("./dateutil");
const weekday_1 = require("./weekday");
function initializeOptions(options) {
    const invalid = [];
    const keys = Object.keys(options);
    const initializedOptions = {};
    // Shallow copy for options and origOptions and check for invalid
    keys.forEach(key => {
        initializedOptions[key] = options[key];
        if (!helpers_1.contains(rrule_1.defaultKeys, key))
            invalid.push(key);
    });
    if (invalid.length) {
        throw new Error('Invalid options: ' + invalid.join(', '));
    }
    return initializedOptions;
}
exports.initializeOptions = initializeOptions;
function parseOptions(options) {
    const opts = initializeOptions(options);
    const keys = Object.keys(options);
    // Merge in default options
    rrule_1.defaultKeys.forEach(key => {
        if (!helpers_1.contains(keys, key))
            opts[key] = rrule_1.DEFAULT_OPTIONS[key];
    });
    if (!rrule_1.default.FREQUENCIES[opts.freq] && helpers_1.isBlank(opts.byeaster)) {
        throw new Error('Invalid frequency: ' + String(opts.freq));
    }
    if (!helpers_1.isBlank(opts.byeaster))
        opts.freq = rrule_1.default.YEARLY;
    if (!opts.dtstart)
        opts.dtstart = new Date(new Date().setMilliseconds(0));
    const millisecondModulo = opts.dtstart.getTime() % 1000;
    if (helpers_1.isBlank(opts.wkst)) {
        opts.wkst = rrule_1.default.MO.weekday;
    }
    else if (typeof opts.wkst === 'number') {
        // cool, just keep it like that
    }
    else {
        opts.wkst = opts.wkst.weekday;
    }
    if (!helpers_1.isBlank(opts.bysetpos)) {
        if (typeof opts.bysetpos === 'number')
            opts.bysetpos = [opts.bysetpos];
        for (let i = 0; i < opts.bysetpos.length; i++) {
            const v = opts.bysetpos[i];
            if (v === 0 || !(v >= -366 && v <= 366)) {
                throw new Error('bysetpos must be between 1 and 366,' + ' or between -366 and -1');
            }
        }
    }
    if (!(Boolean(opts.byweekno) ||
        helpers_1.notEmpty(opts.byweekno) ||
        helpers_1.notEmpty(opts.byyearday) ||
        Boolean(opts.bymonthday) ||
        helpers_1.notEmpty(opts.bymonthday) ||
        opts.byweekday !== null ||
        opts.byeaster !== null)) {
        switch (opts.freq) {
            case rrule_1.default.YEARLY:
                if (!opts.bymonth)
                    opts.bymonth = opts.dtstart.getUTCMonth() + 1;
                opts.bymonthday = opts.dtstart.getUTCDate();
                break;
            case rrule_1.default.MONTHLY:
                opts.bymonthday = opts.dtstart.getUTCDate();
                break;
            case rrule_1.default.WEEKLY:
                opts.byweekday = [dateutil_1.default.getWeekday(opts.dtstart)];
                break;
        }
    }
    // bymonth
    if (!helpers_1.isBlank(opts.bymonth) && !(opts.bymonth instanceof Array)) {
        opts.bymonth = [opts.bymonth];
    }
    // byyearday
    if (!helpers_1.isBlank(opts.byyearday) && !(opts.byyearday instanceof Array) && typeof opts.byyearday === 'number') {
        opts.byyearday = [opts.byyearday];
    }
    // bymonthday
    if (helpers_1.isBlank(opts.bymonthday)) {
        opts.bymonthday = [];
        opts.bynmonthday = [];
    }
    else if (opts.bymonthday instanceof Array) {
        const bymonthday = [];
        const bynmonthday = [];
        for (let i = 0; i < opts.bymonthday.length; i++) {
            const v = opts.bymonthday[i];
            if (v > 0) {
                bymonthday.push(v);
            }
            else if (v < 0) {
                bynmonthday.push(v);
            }
        }
        opts.bymonthday = bymonthday;
        opts.bynmonthday = bynmonthday;
    }
    else {
        if (opts.bymonthday < 0) {
            opts.bynmonthday = [opts.bymonthday];
            opts.bymonthday = [];
        }
        else {
            opts.bynmonthday = [];
            opts.bymonthday = [opts.bymonthday];
        }
    }
    // byweekno
    if (!helpers_1.isBlank(opts.byweekno) && !(opts.byweekno instanceof Array)) {
        opts.byweekno = [opts.byweekno];
    }
    // byweekday / bynweekday
    if (helpers_1.isBlank(opts.byweekday)) {
        opts.bynweekday = null;
    }
    else if (typeof opts.byweekday === 'number') {
        opts.byweekday = [opts.byweekday];
        opts.bynweekday = null;
    }
    else if (opts.byweekday instanceof weekday_1.default) {
        if (!opts.byweekday.n || opts.freq > rrule_1.default.MONTHLY) {
            opts.byweekday = [opts.byweekday.weekday];
            opts.bynweekday = null;
        }
        else {
            opts.bynweekday = [[opts.byweekday.weekday, opts.byweekday.n]];
            opts.byweekday = null;
        }
    }
    else {
        const byweekday = [];
        const bynweekday = [];
        for (let i = 0; i < opts.byweekday.length; i++) {
            const wday = opts.byweekday[i];
            if (typeof wday === 'number') {
                byweekday.push(wday);
                continue;
            }
            const wd = wday;
            if (!wd.n || opts.freq > rrule_1.default.MONTHLY) {
                byweekday.push(wd.weekday);
            }
            else {
                bynweekday.push([wd.weekday, wd.n]);
            }
        }
        opts.byweekday = helpers_1.notEmpty(byweekday) ? byweekday : null;
        opts.bynweekday = helpers_1.notEmpty(bynweekday) ? bynweekday : null;
    }
    // byhour
    if (helpers_1.isBlank(opts.byhour)) {
        opts.byhour = opts.freq < rrule_1.default.HOURLY ? [opts.dtstart.getUTCHours()] : null;
    }
    else if (typeof opts.byhour === 'number') {
        opts.byhour = [opts.byhour];
    }
    // byminute
    if (helpers_1.isBlank(opts.byminute)) {
        opts.byminute =
            opts.freq < rrule_1.default.MINUTELY ? [opts.dtstart.getUTCMinutes()] : null;
    }
    else if (typeof opts.byminute === 'number') {
        opts.byminute = [opts.byminute];
    }
    // bysecond
    if (helpers_1.isBlank(opts.bysecond)) {
        opts.bysecond =
            opts.freq < rrule_1.default.SECONDLY ? [opts.dtstart.getUTCSeconds()] : null;
    }
    else if (typeof opts.bysecond === 'number') {
        opts.bysecond = [opts.bysecond];
    }
    let timeset;
    if (opts.freq >= rrule_1.default.HOURLY) {
        timeset = null;
    }
    else {
        timeset = [];
        for (let i = 0; i < opts.byhour.length; i++) {
            const hour = opts.byhour[i];
            for (let j = 0; j < opts.byminute.length; j++) {
                const minute = opts.byminute[j];
                for (let k = 0; k < opts.bysecond.length; k++) {
                    const second = opts.bysecond[k];
                    // python:
                    // datetime.time(hour, minute, second,
                    // tzinfo=self._tzinfo))
                    timeset.push(new dateutil_1.default.Time(hour, minute, second, millisecondModulo));
                }
            }
        }
        dateutil_1.default.sort(timeset);
    }
    return { parsedOptions: opts, timeset };
}
exports.parseOptions = parseOptions;
//# sourceMappingURL=parseoptions.js.map