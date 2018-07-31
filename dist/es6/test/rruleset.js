"use strict";
/* global describe */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./lib/utils");
const src_1 = require("../src");
describe('RRuleSet', function () {
    // Enable additional toString() / fromString() tests
    // for each testRecurring().
    // this.ctx.ALSO_TEST_STRING_FUNCTIONS = false
    // Thorough after()/before()/between() tests.
    // NOTE: can take a longer time.
    this.ctx.ALSO_TEST_BEFORE_AFTER_BETWEEN = true;
    utils_1.testRecurring('testSet', function () {
        const set = new src_1.RRuleSet();
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 2,
            byweekday: src_1.RRule.TU,
            dtstart: utils_1.parse('19970902T090000')
        }));
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 1,
            byweekday: src_1.RRule.TH,
            dtstart: utils_1.parse('19970902T090000')
        }));
        return set;
    }, [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0)
    ]);
    utils_1.testRecurring('testSetDate', function () {
        const set = new src_1.RRuleSet();
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 1,
            byweekday: src_1.RRule.TU,
            dtstart: utils_1.parse('19970902T090000')
        }));
        set.rdate(utils_1.datetime(1997, 9, 4, 9));
        set.rdate(utils_1.datetime(1997, 9, 9, 9));
        return set;
    }, [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0)
    ]);
    utils_1.testRecurring('testSetExRule', function () {
        const set = new src_1.RRuleSet();
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 6,
            byweekday: [src_1.RRule.TU, src_1.RRule.TH],
            dtstart: utils_1.parse('19970902T090000')
        }));
        set.exrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 3,
            byweekday: src_1.RRule.TH,
            dtstart: utils_1.parse('19970902T090000')
        }));
        return set;
    }, [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0),
        utils_1.datetime(1997, 9, 16, 9, 0)
    ]);
    utils_1.testRecurring('testSetExDate', function () {
        const set = new src_1.RRuleSet();
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 6,
            byweekday: [src_1.RRule.TU, src_1.RRule.TH],
            dtstart: utils_1.parse('19970902T090000')
        }));
        set.exdate(utils_1.datetime(1997, 9, 4, 9));
        set.exdate(utils_1.datetime(1997, 9, 11, 9));
        set.exdate(utils_1.datetime(1997, 9, 18, 9));
        return set;
    }, [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0),
        utils_1.datetime(1997, 9, 16, 9, 0)
    ]);
    utils_1.testRecurring('testSetExDateRevOrder', function () {
        const set = new src_1.RRuleSet();
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.MONTHLY,
            count: 5,
            bymonthday: 10,
            dtstart: utils_1.parse('20040101T090000')
        }));
        set.exdate(utils_1.datetime(2004, 4, 10, 9, 0));
        set.exdate(utils_1.datetime(2004, 2, 10, 9, 0));
        return set;
    }, [
        utils_1.datetime(2004, 1, 10, 9, 0),
        utils_1.datetime(2004, 3, 10, 9, 0),
        utils_1.datetime(2004, 5, 10, 9, 0)
    ]);
    utils_1.testRecurring('testSetDateAndExDate', function () {
        const set = new src_1.RRuleSet();
        set.rdate(utils_1.datetime(1997, 9, 2, 9));
        set.rdate(utils_1.datetime(1997, 9, 4, 9));
        set.rdate(utils_1.datetime(1997, 9, 9, 9));
        set.rdate(utils_1.datetime(1997, 9, 11, 9));
        set.rdate(utils_1.datetime(1997, 9, 16, 9));
        set.rdate(utils_1.datetime(1997, 9, 18, 9));
        set.exdate(utils_1.datetime(1997, 9, 4, 9));
        set.exdate(utils_1.datetime(1997, 9, 11, 9));
        set.exdate(utils_1.datetime(1997, 9, 18, 9));
        return set;
    }, [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0),
        utils_1.datetime(1997, 9, 16, 9, 0)
    ]);
    utils_1.testRecurring('testSetDateAndExRule', function () {
        const set = new src_1.RRuleSet();
        set.rdate(utils_1.datetime(1997, 9, 2, 9));
        set.rdate(utils_1.datetime(1997, 9, 4, 9));
        set.rdate(utils_1.datetime(1997, 9, 9, 9));
        set.rdate(utils_1.datetime(1997, 9, 11, 9));
        set.rdate(utils_1.datetime(1997, 9, 16, 9));
        set.rdate(utils_1.datetime(1997, 9, 18, 9));
        set.exrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 3,
            byweekday: src_1.RRule.TH,
            dtstart: utils_1.parse('19970902T090000')
        }));
        return set;
    }, [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0),
        utils_1.datetime(1997, 9, 16, 9, 0)
    ]);
    utils_1.testRecurring('testSetCachePre', function () {
        const set = new src_1.RRuleSet();
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 2,
            byweekday: src_1.RRule.TU,
            dtstart: utils_1.parse('19970902T090000')
        }));
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 1,
            byweekday: src_1.RRule.TH,
            dtstart: utils_1.parse('19970902T090000')
        }));
        return set;
    }, [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0)
    ]);
    utils_1.testRecurring('testSetCachePost', function () {
        const set = new src_1.RRuleSet();
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 2,
            byweekday: src_1.RRule.TU,
            dtstart: utils_1.parse('19970902T090000')
        }));
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 1,
            byweekday: src_1.RRule.TH,
            dtstart: utils_1.parse('19970902T090000')
        }));
        set.all();
        return set;
    }, [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0)
    ]);
    utils_1.testRecurring('testSetInfiniteAll', function () {
        const set = new src_1.RRuleSet();
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            dtstart: utils_1.parse('19970902T090000')
        }));
        set.exrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 10,
            dtstart: utils_1.parse('19970902T090000')
        }));
        return {
            rrule: set,
            method: 'all',
            args: [
                function (_, count) {
                    return count < 3;
                }
            ]
        };
    }, [
        utils_1.datetime(2007, 9, 2, 9, 0),
        utils_1.datetime(2008, 9, 2, 9, 0),
        utils_1.datetime(2009, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testSetInfiniteBetween', function () {
        const set = new src_1.RRuleSet();
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            dtstart: utils_1.parse('19970902T090000')
        }));
        set.exrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 10,
            dtstart: utils_1.parse('19970902T090000')
        }));
        return {
            rrule: set,
            method: 'between',
            args: [
                utils_1.datetime(2000, 9, 2, 9, 0),
                utils_1.datetime(2010, 9, 2, 9, 0)
            ]
        };
    }, [
        utils_1.datetime(2007, 9, 2, 9, 0),
        utils_1.datetime(2008, 9, 2, 9, 0),
        utils_1.datetime(2009, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testSetInfiniteBefore', function () {
        const set = new src_1.RRuleSet();
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            dtstart: utils_1.parse('19970902T090000')
        }));
        set.exrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 10,
            dtstart: utils_1.parse('19970902T090000')
        }));
        return {
            rrule: set,
            method: 'before',
            args: [
                utils_1.datetime(2015, 9, 2, 9, 0),
                false
            ]
        };
    }, [
        utils_1.datetime(2014, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testSetInfiniteAfter', function () {
        const set = new src_1.RRuleSet();
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            dtstart: utils_1.parse('19970902T090000')
        }));
        set.exrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 10,
            dtstart: utils_1.parse('19970902T090000')
        }));
        return {
            rrule: set,
            method: 'after',
            args: [
                utils_1.datetime(2000, 9, 2, 9, 0),
                false
            ]
        };
    }, [
        utils_1.datetime(2007, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testBefore70', function () {
        const set = new src_1.RRuleSet();
        set.rrule(new src_1.RRule({
            freq: src_1.RRule.YEARLY,
            count: 2,
            dtstart: utils_1.parse('19600101T090000')
        }));
        return {
            rrule: set,
            method: 'all'
        };
    }, [
        utils_1.datetime(1960, 1, 1, 9, 0),
        utils_1.datetime(1961, 1, 1, 9, 0)
    ]);
});
//# sourceMappingURL=rruleset.js.map