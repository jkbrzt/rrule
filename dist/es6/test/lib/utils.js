"use strict";
/* global it */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const src_1 = require("../../src");
const assertDatesEqual = function (actual, expected, msg) {
    msg = msg ? ' [' + msg + '] ' : '';
    if (!(actual instanceof Array))
        actual = [actual];
    if (!(expected instanceof Array))
        expected = [expected];
    if (expected.length > 1) {
        chai_1.expect(actual).to.have.length(expected.length, msg + 'number of recurrences');
        msg = ' - ';
    }
    for (let i = 0; i < expected.length; i++) {
        const act = actual[i];
        const exp = expected[i];
        chai_1.expect(exp instanceof Date ? exp.toString() : exp).to.equal(act.toString(), msg + (i + 1) + '/' + expected.length);
    }
};
const extractTime = function (date) {
    return date != null ? date.getTime() : void 0;
};
/**
 * datetime.datetime
 */
exports.datetime = function (y, m, d, h = 0, i = 0, s = 0) {
    return new Date(y, m - 1, d, h, i, s);
};
exports.datetimeUTC = function (y, m, d, h = 0, i = 0, s = 0) {
    return new Date(Date.UTC(y, m - 1, d, h, i, s));
};
/**
 * dateutil.parser.parse
 */
exports.parse = function (str) {
    const parts = str.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);
    let [_, y, m, d, h, i, s] = parts; // eslint-disable-line
    const year = Number(y);
    const month = Number(m[0] === '0' ? m[1] : m) - 1;
    const day = Number(d[0] === '0' ? d[1] : d);
    const hour = Number(h[0] === '0' ? h[1] : h);
    const minute = Number(i[0] === '0' ? i[1] : i);
    const second = Number(s[0] === '0' ? s[1] : s);
    return new Date(year, month, day, hour, minute, second);
};
exports.testRecurring = function (msg, testObj, expectedDates) {
    let rule;
    let method;
    let args;
    if (typeof testObj === 'function') {
        testObj = testObj();
    }
    if (testObj instanceof src_1.RRule || testObj instanceof src_1.RRuleSet) {
        rule = testObj;
        method = 'all';
        args = [];
    }
    else {
        rule = testObj.rrule;
        method = testObj.method;
        args = testObj.args;
    }
    // Use text and string representation of the rrule as the message.
    if (rule instanceof src_1.RRule) {
        msg = msg + ' [' +
            (rule.isFullyConvertibleToText() ? rule.toText() : 'no text repr') +
            ']' + ' [' + rule.toString() + ']';
    }
    else {
        msg = msg + ' ' + rule.toString();
    }
    it(msg, function () {
        const ctx = this.test.ctx;
        let time = Date.now();
        let actualDates = rule[method].apply(rule, args);
        time = Date.now() - time;
        chai_1.expect(time).to.be.lessThan(100, rule + '\' method "' + method + '" should finish in 100 ms, but ' + time + ' ms');
        if (!(actualDates instanceof Array))
            actualDates = [actualDates];
        if (!(expectedDates instanceof Array))
            expectedDates = [expectedDates];
        assertDatesEqual(actualDates, expectedDates);
        // Additional tests using the expected dates
        // ==========================================================
        if (ctx.ALSO_TEST_SUBSECOND_PRECISION) {
            chai_1.expect(actualDates.map(extractTime)).to.deep.equal(expectedDates.map(extractTime));
        }
        if (ctx.ALSO_TEST_STRING_FUNCTIONS) {
            // Test toString()/fromString()
            const str = rule.toString();
            const rrule2 = src_1.RRule.fromString(str /*, rule.options.dtstart */);
            const string2 = rrule2.toString();
            chai_1.expect(str).to.equal(string2, 'toString() == fromString(toString()).toString()');
            if (method === 'all') {
                assertDatesEqual(rrule2.all(), expectedDates, 'fromString().all()');
            }
        }
        if (ctx.ALSO_TEST_NLP_FUNCTIONS && rule.isFullyConvertibleToText && rule.isFullyConvertibleToText()) {
            // Test fromText()/toText().
            const str = rule.toString();
            const text = rule.toText();
            const rrule2 = src_1.RRule.fromText(text, rule.options.dtstart);
            const text2 = rrule2.toText();
            chai_1.expect(text2).to.equal(text, 'toText() == fromText(toText()).toText()');
            // Test fromText()/toString().
            const rrule3 = src_1.RRule.fromText(text, rule.options.dtstart);
            chai_1.expect(rrule3.toString()).to.equal(str, 'toString() == fromText(toText()).toString()');
        }
        if (method === 'all' && ctx.ALSO_TEST_BEFORE_AFTER_BETWEEN) {
            // Test before, after, and between - use the expected dates.
            // create a clean copy of the rrule object to bypass caching
            rule = rule.clone();
            if (expectedDates.length > 2) {
                // Test between()
                assertDatesEqual(rule.between(expectedDates[0], expectedDates[expectedDates.length - 1], true), expectedDates, 'between, inc=true');
                assertDatesEqual(rule.between(expectedDates[0], expectedDates[expectedDates.length - 1], false), expectedDates.slice(1, expectedDates.length - 1), 'between, inc=false');
            }
            if (expectedDates.length > 1) {
                let date;
                let next;
                let prev;
                for (let i = 0; i < expectedDates.length; i++) {
                    date = expectedDates[i];
                    next = expectedDates[i + 1];
                    prev = expectedDates[i - 1];
                    // Test after() and before() with inc=true.
                    assertDatesEqual(rule.after(date, true), date, 'after, inc=true');
                    assertDatesEqual(rule.before(date, true), date, 'before, inc=true');
                    // Test after() and before() with inc=false.
                    next && assertDatesEqual(rule.after(date, false), next, 'after, inc=false');
                    prev && assertDatesEqual(rule.before(date, false), prev, 'before, inc=false');
                }
            }
        }
    });
};
exports.testRecurring.skip = function () {
    it.skip.apply(it, arguments);
};
exports.assertStrType = function (msg, obj, type) {
    it(msg, function () {
        chai_1.expect(obj).to.be.instanceof(type);
    });
};
//# sourceMappingURL=utils.js.map