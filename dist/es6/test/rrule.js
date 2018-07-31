"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./lib/utils");
const chai_1 = require("chai");
// @ts-ignore
const index_1 = require("../src/index");
describe('RRule', function () {
    // Enable additional toString() / fromString() tests
    // for each testRecurring().
    this.ctx.ALSO_TEST_STRING_FUNCTIONS = true;
    // Enable additional toText() / fromText() tests
    // for each testRecurring().
    // Many of the tests fail because the conversion is only approximate,
    // but it gives an idea about how well or bad it converts.
    this.ctx.ALSO_TEST_NLP_FUNCTIONS = false;
    // Thorough after()/before()/between() tests.
    // NOTE: can take a longer time.
    this.ctx.ALSO_TEST_BEFORE_AFTER_BETWEEN = true;
    this.ctx.ALSO_TEST_SUBSECOND_PRECISION = true;
    const texts = [
        ['Every day', 'FREQ=DAILY'],
        ['Every day at 10, 12 and 17', 'FREQ=DAILY;BYHOUR=10,12,17'],
        ['Every week', 'FREQ=WEEKLY'],
        ['Every hour', 'FREQ=HOURLY'],
        ['Every 4 hours', 'INTERVAL=4;FREQ=HOURLY'],
        ['Every week on Tuesday', 'FREQ=WEEKLY;BYDAY=TU'],
        ['Every week on Monday, Wednesday', 'FREQ=WEEKLY;BYDAY=MO,WE'],
        ['Every weekday', 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR'],
        ['Every 2 weeks', 'INTERVAL=2;FREQ=WEEKLY'],
        ['Every month', 'FREQ=MONTHLY'],
        ['Every 6 months', 'INTERVAL=6;FREQ=MONTHLY'],
        ['Every year', 'FREQ=YEARLY'],
        ['Every month on the 4th', 'FREQ=MONTHLY;BYMONTHDAY=4'],
        ['Every month on the 4th last', 'FREQ=MONTHLY;BYMONTHDAY=-4'],
        ['Every month on the 3rd Tuesday', 'FREQ=MONTHLY;BYDAY=+3TU'],
        ['Every month on the 3rd last Tuesday', 'FREQ=MONTHLY;BYDAY=-3TU'],
        ['Every month on the last Monday', 'FREQ=MONTHLY;BYDAY=-1MO'],
        ['Every month on the 2nd last Friday', 'FREQ=MONTHLY;BYDAY=-2FR'],
        // This one will fail.
        // The text date should be treated as a floating one, but toString
        // always returns UTC dates.
        // ['Every week until January 1, 2007', 'FREQ=WEEKLY;UNTIL=20070101T000000Z'],
        ['Every week for 20 times', 'FREQ=WEEKLY;COUNT=20']
    ];
    it('fromText()', function () {
        texts.forEach(function (item) {
            const text = item[0];
            const str = item[1];
            chai_1.expect(index_1.RRule.fromText(text).toString()).equals(str, text + ' => ' + str);
        });
    });
    it('toText()', function () {
        texts.forEach(function (item) {
            const text = item[0];
            const str = item[1];
            chai_1.expect(index_1.RRule.fromString(str).toText().toLowerCase()).equals(text.toLowerCase(), str + ' => ' + text);
        });
    });
    it('rrulestr https://github.com/jkbrzt/rrule/pull/164', function () {
        const s1 = 'FREQ=WEEKLY;WKST=WE';
        const s2 = index_1.rrulestr(s1).toString();
        chai_1.expect(s1).equals(s2, s1 + ' => ' + s2);
    });
    it('fromString()', function () {
        const strings = [
            ['FREQ=WEEKLY;UNTIL=20100101T000000Z', 'FREQ=WEEKLY;UNTIL=20100101T000000Z'],
            // Parse also `date` but return `date-time`
            ['FREQ=WEEKLY;UNTIL=20100101', 'FREQ=WEEKLY;UNTIL=20100101T000000Z']
        ];
        strings.forEach(function (item) {
            const s = item[0];
            const s2 = item[1];
            chai_1.expect(index_1.RRule.fromString(s).toString()).equals(s2, s + ' => ' + s2);
        });
    });
    it('does not mutate the passed-in options object', function () {
        const options = {
            freq: index_1.RRule.MONTHLY,
            dtstart: new Date(2013, 0, 1),
            count: 3,
            bymonthday: [28]
        };
        const rule = new index_1.RRule(options);
        chai_1.expect(options).deep.equals({
            freq: index_1.RRule.MONTHLY,
            dtstart: new Date(2013, 0, 1),
            count: 3,
            bymonthday: [28]
        });
        chai_1.expect(rule.origOptions).deep.equals(options);
    });
    utils_1.testRecurring('missing Feb 28 https://github.com/jakubroztocil/rrule/issues/21', new index_1.RRule({
        freq: index_1.RRule.MONTHLY,
        dtstart: new Date(2013, 0, 1),
        count: 3,
        bymonthday: [28]
    }), [
        new Date(2013, 0, 28),
        new Date(2013, 1, 28),
        new Date(2013, 2, 28)
    ]);
    // =============================================================================
    // The original `dateutil.rrule` test suite converted from Py to JS.
    // =============================================================================
    utils_1.testRecurring('testBefore', {
        rrule: new index_1.RRule({
            freq: index_1.RRule.DAILY,
            dtstart: utils_1.parse('19970902T090000')
        }),
        method: 'before',
        args: [utils_1.parse('19970905T090000')]
    }, utils_1.datetime(1997, 9, 4, 9, 0));
    utils_1.testRecurring('testBeforeInc', {
        rrule: new index_1.RRule({
            freq: index_1.RRule.DAILY,
            dtstart: utils_1.parse('19970902T090000')
        }),
        method: 'before',
        args: [utils_1.parse('19970905T090000'), true]
    }, utils_1.datetime(1997, 9, 5, 9, 0));
    utils_1.testRecurring('testAfter', {
        rrule: new index_1.RRule({
            freq: index_1.RRule.DAILY,
            dtstart: utils_1.parse('19970902T090000')
        }),
        method: 'after',
        args: [utils_1.parse('19970904T090000')]
    }, utils_1.datetime(1997, 9, 5, 9, 0));
    utils_1.testRecurring('testAfterInc', {
        rrule: new index_1.RRule({
            freq: index_1.RRule.DAILY,
            dtstart: utils_1.parse('19970902T090000')
        }),
        method: 'after',
        args: [utils_1.parse('19970904T090000'), true]
    }, utils_1.datetime(1997, 9, 4, 9, 0));
    utils_1.testRecurring('testBetween', {
        rrule: new index_1.RRule({
            freq: index_1.RRule.DAILY,
            dtstart: utils_1.parse('19970902T090000')
        }),
        method: 'between',
        args: [utils_1.parse('19970902T090000'), utils_1.parse('19970906T090000')]
    }, [
        utils_1.datetime(1997, 9, 3, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 5, 9, 0)
    ]);
    utils_1.testRecurring('testBetweenInc', {
        rrule: new index_1.RRule({
            freq: index_1.RRule.DAILY,
            dtstart: utils_1.parse('19970902T090000')
        }),
        method: 'between',
        args: [utils_1.parse('19970902T090000'), utils_1.parse('19970906T090000'), true]
    }, [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 3, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 5, 9, 0),
        utils_1.datetime(1997, 9, 6, 9, 0)
    ]);
    utils_1.testRecurring('testYearly', new index_1.RRule({
        freq: index_1.RRule.YEARLY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1998, 9, 2, 9, 0),
        utils_1.datetime(1999, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyInterval', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        interval: 2,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1999, 9, 2, 9, 0),
        utils_1.datetime(2001, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyIntervalLarge', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        interval: 100,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(2097, 9, 2, 9, 0),
        utils_1.datetime(2197, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByMonth', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        bymonth: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 2, 9, 0),
        utils_1.datetime(1998, 3, 2, 9, 0),
        utils_1.datetime(1999, 1, 2, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByMonthDay', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        bymonthday: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 3, 9, 0),
        utils_1.datetime(1997, 10, 1, 9, 0),
        utils_1.datetime(1997, 10, 3, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByMonthAndMonthDay', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [5, 7],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 5, 9, 0),
        utils_1.datetime(1998, 1, 7, 9, 0),
        utils_1.datetime(1998, 3, 5, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByWeekDay', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByNWeekDay', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 25, 9, 0),
        utils_1.datetime(1998, 1, 6, 9, 0),
        utils_1.datetime(1998, 12, 31, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByNWeekDayLarge', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byweekday: [index_1.RRule.TU.nth(3), index_1.RRule.TH.nth(-3)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 11, 9, 0),
        utils_1.datetime(1998, 1, 20, 9, 0),
        utils_1.datetime(1998, 12, 17, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByMonthAndWeekDay', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 1, 6, 9, 0),
        utils_1.datetime(1998, 1, 8, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByMonthAndNWeekDay', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 6, 9, 0),
        utils_1.datetime(1998, 1, 29, 9, 0),
        utils_1.datetime(1998, 3, 3, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByMonthAndNWeekDayLarge', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU.nth(3), index_1.RRule.TH.nth(-3)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 15, 9, 0),
        utils_1.datetime(1998, 1, 20, 9, 0),
        utils_1.datetime(1998, 3, 12, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 2, 3, 9, 0),
        utils_1.datetime(1998, 3, 3, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByMonthAndMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 3, 3, 9, 0),
        utils_1.datetime(2001, 3, 1, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByYearDay', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 4,
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 9, 0),
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 4, 10, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByYearDayNeg', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 4,
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 9, 0),
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 4, 10, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByMonthAndYearDay', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 4,
        bymonth: [4, 7],
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 10, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0),
        utils_1.datetime(1999, 4, 10, 9, 0),
        utils_1.datetime(1999, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByMonthAndYearDayNeg', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 4,
        bymonth: [4, 7],
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 10, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0),
        utils_1.datetime(1999, 4, 10, 9, 0),
        utils_1.datetime(1999, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByWeekNo', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byweekno: 20,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 5, 11, 9, 0),
        utils_1.datetime(1998, 5, 12, 9, 0),
        utils_1.datetime(1998, 5, 13, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByWeekNoAndWeekDay', 
    // That's a nice one. The first days of week number one
    // may be in the last year.
    new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byweekno: 1,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 29, 9, 0),
        utils_1.datetime(1999, 1, 4, 9, 0),
        utils_1.datetime(2000, 1, 3, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByWeekNoAndWeekDayLarge', 
    // Another nice test. The last days of week number 52/53
    // may be in the next year.
    new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byweekno: 52,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 9, 0),
        utils_1.datetime(1998, 12, 27, 9, 0),
        utils_1.datetime(2000, 1, 2, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByWeekNoAndWeekDayLast', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byweekno: -1,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 9, 0),
        utils_1.datetime(1999, 1, 3, 9, 0),
        utils_1.datetime(2000, 1, 2, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByEaster', new index_1.RRule({ count: 3,
        byeaster: 0,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 12, 9, 0),
        utils_1.datetime(1999, 4, 4, 9, 0),
        utils_1.datetime(2000, 4, 23, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByEasterPos', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byeaster: 1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 13, 9, 0),
        utils_1.datetime(1999, 4, 5, 9, 0),
        utils_1.datetime(2000, 4, 24, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByEasterNeg', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byeaster: -1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 11, 9, 0),
        utils_1.datetime(1999, 4, 3, 9, 0),
        utils_1.datetime(2000, 4, 22, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByWeekNoAndWeekDay53', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byweekno: 53,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 12, 28, 9, 0),
        utils_1.datetime(2004, 12, 27, 9, 0),
        utils_1.datetime(2009, 12, 28, 9, 0)
    ]);
    utils_1.testRecurring('testYearlyByHour', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byhour: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0),
        utils_1.datetime(1998, 9, 2, 6, 0),
        utils_1.datetime(1998, 9, 2, 18, 0)
    ]);
    utils_1.testRecurring('testYearlyByMinute', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6),
        utils_1.datetime(1997, 9, 2, 9, 18),
        utils_1.datetime(1998, 9, 2, 9, 6)
    ]);
    utils_1.testRecurring('testYearlyBySecond', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 6),
        utils_1.datetime(1997, 9, 2, 9, 0, 18),
        utils_1.datetime(1998, 9, 2, 9, 0, 6)
    ]);
    utils_1.testRecurring('testYearlyByHourAndMinute', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6),
        utils_1.datetime(1997, 9, 2, 18, 18),
        utils_1.datetime(1998, 9, 2, 6, 6)
    ]);
    utils_1.testRecurring('testYearlyByHourAndSecond', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byhour: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0, 6),
        utils_1.datetime(1997, 9, 2, 18, 0, 18),
        utils_1.datetime(1998, 9, 2, 6, 0, 6)
    ]);
    utils_1.testRecurring('testYearlyByMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6, 6),
        utils_1.datetime(1997, 9, 2, 9, 6, 18),
        utils_1.datetime(1997, 9, 2, 9, 18, 6)
    ]);
    utils_1.testRecurring('testYearlyByHourAndMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6, 6),
        utils_1.datetime(1997, 9, 2, 18, 6, 18),
        utils_1.datetime(1997, 9, 2, 18, 18, 6)
    ]);
    utils_1.testRecurring('testYearlyBySetPos', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        bymonthday: 15,
        byhour: [6, 18],
        bysetpos: [3, -3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 11, 15, 18, 0),
        utils_1.datetime(1998, 2, 15, 6, 0),
        utils_1.datetime(1998, 11, 15, 18, 0)
    ]);
    utils_1.testRecurring('testYearlyBetweenInc', {
        rrule: new index_1.RRule({
            freq: index_1.RRule.YEARLY,
            dtstart: utils_1.parse('20150101T000000')
        }),
        method: 'between',
        args: [utils_1.parse('20160101T000000'), utils_1.parse('20160101T000000'), true]
    }, [
        utils_1.datetime(2016, 1, 1)
    ]);
    utils_1.testRecurring.skip('testYearlyBetweenIncLargeSpan', {
        rrule: new index_1.RRule({
            freq: index_1.RRule.YEARLY,
            dtstart: utils_1.parse('19200101T000000') // Error because date lower than dateutil.ORDINAL_BASE
        }),
        method: 'between',
        args: [utils_1.parse('20160101T000000'), utils_1.parse('20160101T000000'), true]
    }, [
        utils_1.datetime(2016, 1, 1)
    ]);
    utils_1.testRecurring('testMonthly', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 10, 2, 9, 0),
        utils_1.datetime(1997, 11, 2, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyInterval', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        interval: 2,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 11, 2, 9, 0),
        utils_1.datetime(1998, 1, 2, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyIntervalLarge', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        interval: 18,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1999, 3, 2, 9, 0),
        utils_1.datetime(2000, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByMonth', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        bymonth: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 2, 9, 0),
        utils_1.datetime(1998, 3, 2, 9, 0),
        utils_1.datetime(1999, 1, 2, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByMonthDay', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        bymonthday: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 3, 9, 0),
        utils_1.datetime(1997, 10, 1, 9, 0),
        utils_1.datetime(1997, 10, 3, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByMonthAndMonthDay', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [5, 7],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 5, 9, 0),
        utils_1.datetime(1998, 1, 7, 9, 0),
        utils_1.datetime(1998, 3, 5, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByWeekDay', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByNWeekDay', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 25, 9, 0),
        utils_1.datetime(1997, 10, 7, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByNWeekDayLarge', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byweekday: [index_1.RRule.TU.nth(3), index_1.RRule.TH.nth(-3)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 11, 9, 0),
        utils_1.datetime(1997, 9, 16, 9, 0),
        utils_1.datetime(1997, 10, 16, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByMonthAndWeekDay', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 1, 6, 9, 0),
        utils_1.datetime(1998, 1, 8, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByMonthAndNWeekDay', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 6, 9, 0),
        utils_1.datetime(1998, 1, 29, 9, 0),
        utils_1.datetime(1998, 3, 3, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByMonthAndNWeekDayLarge', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU.nth(3), index_1.RRule.TH.nth(-3)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 15, 9, 0),
        utils_1.datetime(1998, 1, 20, 9, 0),
        utils_1.datetime(1998, 3, 12, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 2, 3, 9, 0),
        utils_1.datetime(1998, 3, 3, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByMonthAndMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 3, 3, 9, 0),
        utils_1.datetime(2001, 3, 1, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByYearDay', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 4,
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 9, 0),
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 4, 10, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByYearDayNeg', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 4,
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 9, 0),
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 4, 10, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByMonthAndYearDay', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 4,
        bymonth: [4, 7],
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 10, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0),
        utils_1.datetime(1999, 4, 10, 9, 0),
        utils_1.datetime(1999, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByMonthAndYearDayNeg', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 4,
        bymonth: [4, 7],
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 10, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0),
        utils_1.datetime(1999, 4, 10, 9, 0),
        utils_1.datetime(1999, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByWeekNo', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byweekno: 20,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 5, 11, 9, 0),
        utils_1.datetime(1998, 5, 12, 9, 0),
        utils_1.datetime(1998, 5, 13, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByWeekNoAndWeekDay', 
    // That's a nice one. The first days of week number one
    // may be in the last year.
    new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byweekno: 1,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 29, 9, 0),
        utils_1.datetime(1999, 1, 4, 9, 0),
        utils_1.datetime(2000, 1, 3, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByWeekNoAndWeekDayLarge', 
    // Another nice test. The last days of week number 52/53
    // may be in the next year.
    new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byweekno: 52,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 9, 0),
        utils_1.datetime(1998, 12, 27, 9, 0),
        utils_1.datetime(2000, 1, 2, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByWeekNoAndWeekDayLast', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byweekno: -1,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 9, 0),
        utils_1.datetime(1999, 1, 3, 9, 0),
        utils_1.datetime(2000, 1, 2, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByWeekNoAndWeekDay53', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byweekno: 53,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 12, 28, 9, 0),
        utils_1.datetime(2004, 12, 27, 9, 0),
        utils_1.datetime(2009, 12, 28, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByEaster', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byeaster: 0,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 12, 9, 0),
        utils_1.datetime(1999, 4, 4, 9, 0),
        utils_1.datetime(2000, 4, 23, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByEasterPos', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byeaster: 1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 13, 9, 0),
        utils_1.datetime(1999, 4, 5, 9, 0),
        utils_1.datetime(2000, 4, 24, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByEasterNeg', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byeaster: -1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 11, 9, 0),
        utils_1.datetime(1999, 4, 3, 9, 0),
        utils_1.datetime(2000, 4, 22, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyByHour', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byhour: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0),
        utils_1.datetime(1997, 10, 2, 6, 0),
        utils_1.datetime(1997, 10, 2, 18, 0)
    ]);
    utils_1.testRecurring('testMonthlyByMinute', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6),
        utils_1.datetime(1997, 9, 2, 9, 18),
        utils_1.datetime(1997, 10, 2, 9, 6)
    ]);
    utils_1.testRecurring('testMonthlyBySecond', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 6),
        utils_1.datetime(1997, 9, 2, 9, 0, 18),
        utils_1.datetime(1997, 10, 2, 9, 0, 6)
    ]);
    utils_1.testRecurring('testMonthlyByHourAndMinute', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6),
        utils_1.datetime(1997, 9, 2, 18, 18),
        utils_1.datetime(1997, 10, 2, 6, 6)
    ]);
    utils_1.testRecurring('testMonthlyByHourAndSecond', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byhour: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0, 6),
        utils_1.datetime(1997, 9, 2, 18, 0, 18),
        utils_1.datetime(1997, 10, 2, 6, 0, 6)
    ]);
    utils_1.testRecurring('testMonthlyByMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6, 6),
        utils_1.datetime(1997, 9, 2, 9, 6, 18),
        utils_1.datetime(1997, 9, 2, 9, 18, 6)
    ]);
    utils_1.testRecurring('testMonthlyByHourAndMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6, 6),
        utils_1.datetime(1997, 9, 2, 18, 6, 18),
        utils_1.datetime(1997, 9, 2, 18, 18, 6)
    ]);
    utils_1.testRecurring('testMonthlyBySetPos', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 3,
        bymonthday: [13, 17],
        byhour: [6, 18],
        bysetpos: [3, -3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 13, 18, 0),
        utils_1.datetime(1997, 9, 17, 6, 0),
        utils_1.datetime(1997, 10, 13, 18, 0)
    ]);
    utils_1.testRecurring('testMonthlyNegByMonthDayJanFebForNonLeapYear', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 4,
        bymonthday: -1,
        dtstart: utils_1.parse('20131201T0900000')
    }), [
        utils_1.datetime(2013, 12, 31, 9, 0),
        utils_1.datetime(2014, 1, 31, 9, 0),
        utils_1.datetime(2014, 2, 28, 9, 0),
        utils_1.datetime(2014, 3, 31, 9, 0)
    ]);
    utils_1.testRecurring('testMonthlyNegByMonthDayJanFebForLeapYear', new index_1.RRule({ freq: index_1.RRule.MONTHLY,
        count: 4,
        bymonthday: -1,
        dtstart: utils_1.parse('20151201T0900000')
    }), [
        utils_1.datetime(2015, 12, 31, 9, 0),
        utils_1.datetime(2016, 1, 31, 9, 0),
        utils_1.datetime(2016, 2, 29, 9, 0),
        utils_1.datetime(2016, 3, 31, 9, 0)
    ]);
    utils_1.testRecurring('testWeekly', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0),
        utils_1.datetime(1997, 9, 16, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyInterval', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        interval: 2,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 16, 9, 0),
        utils_1.datetime(1997, 9, 30, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyIntervalLarge', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        interval: 20,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1998, 1, 20, 9, 0),
        utils_1.datetime(1998, 6, 9, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByMonth', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        bymonth: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 6, 9, 0),
        utils_1.datetime(1998, 1, 13, 9, 0),
        utils_1.datetime(1998, 1, 20, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByMonthDay', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        bymonthday: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 3, 9, 0),
        utils_1.datetime(1997, 10, 1, 9, 0),
        utils_1.datetime(1997, 10, 3, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByMonthAndMonthDay', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [5, 7],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 5, 9, 0),
        utils_1.datetime(1998, 1, 7, 9, 0),
        utils_1.datetime(1998, 3, 5, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByWeekDay', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByNWeekDay', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByMonthAndWeekDay', 
    // This test is interesting, because it crosses the year
    // boundary in a weekly period to find day '1' as a
    // valid recurrence.
    new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 1, 6, 9, 0),
        utils_1.datetime(1998, 1, 8, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByMonthAndNWeekDay', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 1, 6, 9, 0),
        utils_1.datetime(1998, 1, 8, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 2, 3, 9, 0),
        utils_1.datetime(1998, 3, 3, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByMonthAndMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 3, 3, 9, 0),
        utils_1.datetime(2001, 3, 1, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByYearDay', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 4,
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 9, 0),
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 4, 10, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByYearDayNeg', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 4,
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 9, 0),
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 4, 10, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByMonthAndYearDay', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 4,
        bymonth: [1, 7],
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0),
        utils_1.datetime(1999, 1, 1, 9, 0),
        utils_1.datetime(1999, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByMonthAndYearDayNeg', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 4,
        bymonth: [1, 7],
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0),
        utils_1.datetime(1999, 1, 1, 9, 0),
        utils_1.datetime(1999, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByWeekNo', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byweekno: 20,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 5, 11, 9, 0),
        utils_1.datetime(1998, 5, 12, 9, 0),
        utils_1.datetime(1998, 5, 13, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByWeekNoAndWeekDay', 
    // That's a nice one. The first days of week number one
    // may be in the last year.
    new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byweekno: 1,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 29, 9, 0),
        utils_1.datetime(1999, 1, 4, 9, 0),
        utils_1.datetime(2000, 1, 3, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByWeekNoAndWeekDayLarge', 
    // Another nice test. The last days of week number 52/53
    // may be in the next year.
    new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byweekno: 52,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 9, 0),
        utils_1.datetime(1998, 12, 27, 9, 0),
        utils_1.datetime(2000, 1, 2, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByWeekNoAndWeekDayLast', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byweekno: -1,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 9, 0),
        utils_1.datetime(1999, 1, 3, 9, 0),
        utils_1.datetime(2000, 1, 2, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByWeekNoAndWeekDay53', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byweekno: 53,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 12, 28, 9, 0),
        utils_1.datetime(2004, 12, 27, 9, 0),
        utils_1.datetime(2009, 12, 28, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByEaster', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byeaster: 0,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 12, 9, 0),
        utils_1.datetime(1999, 4, 4, 9, 0),
        utils_1.datetime(2000, 4, 23, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByEasterPos', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byeaster: 1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 13, 9, 0),
        utils_1.datetime(1999, 4, 5, 9, 0),
        utils_1.datetime(2000, 4, 24, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByEasterNeg', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byeaster: -1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 11, 9, 0),
        utils_1.datetime(1999, 4, 3, 9, 0),
        utils_1.datetime(2000, 4, 22, 9, 0)
    ]);
    utils_1.testRecurring('testWeeklyByHour', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byhour: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0),
        utils_1.datetime(1997, 9, 9, 6, 0),
        utils_1.datetime(1997, 9, 9, 18, 0)
    ]);
    utils_1.testRecurring('testWeeklyByMinute', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6),
        utils_1.datetime(1997, 9, 2, 9, 18),
        utils_1.datetime(1997, 9, 9, 9, 6)
    ]);
    utils_1.testRecurring('testWeeklyBySecond', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 6),
        utils_1.datetime(1997, 9, 2, 9, 0, 18),
        utils_1.datetime(1997, 9, 9, 9, 0, 6)
    ]);
    utils_1.testRecurring('testWeeklyByHourAndMinute', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6),
        utils_1.datetime(1997, 9, 2, 18, 18),
        utils_1.datetime(1997, 9, 9, 6, 6)
    ]);
    utils_1.testRecurring('testWeeklyByHourAndSecond', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byhour: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0, 6),
        utils_1.datetime(1997, 9, 2, 18, 0, 18),
        utils_1.datetime(1997, 9, 9, 6, 0, 6)
    ]);
    utils_1.testRecurring('testWeeklyByMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6, 6),
        utils_1.datetime(1997, 9, 2, 9, 6, 18),
        utils_1.datetime(1997, 9, 2, 9, 18, 6)
    ]);
    utils_1.testRecurring('testWeeklyByHourAndMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6, 6),
        utils_1.datetime(1997, 9, 2, 18, 6, 18),
        utils_1.datetime(1997, 9, 2, 18, 18, 6)
    ]);
    utils_1.testRecurring('testWeeklyBySetPos', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        byhour: [6, 18],
        bysetpos: [3, -3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0),
        utils_1.datetime(1997, 9, 4, 6, 0),
        utils_1.datetime(1997, 9, 9, 18, 0)
    ]);
    utils_1.testRecurring('testDaily', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 3, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0)
    ]);
    utils_1.testRecurring('testDailyInterval', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        interval: 2,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 6, 9, 0)
    ]);
    utils_1.testRecurring('testDailyIntervalLarge', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        interval: 92,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 12, 3, 9, 0),
        utils_1.datetime(1998, 3, 5, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByMonth', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        bymonth: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 1, 2, 9, 0),
        utils_1.datetime(1998, 1, 3, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByMonthDay', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        bymonthday: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 3, 9, 0),
        utils_1.datetime(1997, 10, 1, 9, 0),
        utils_1.datetime(1997, 10, 3, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByMonthAndMonthDay', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [5, 7],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 5, 9, 0),
        utils_1.datetime(1998, 1, 7, 9, 0),
        utils_1.datetime(1998, 3, 5, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByWeekDay', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByNWeekDay', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0),
        utils_1.datetime(1997, 9, 9, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByMonthAndWeekDay', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 1, 6, 9, 0),
        utils_1.datetime(1998, 1, 8, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByMonthAndNWeekDay', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 1, 6, 9, 0),
        utils_1.datetime(1998, 1, 8, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 2, 3, 9, 0),
        utils_1.datetime(1998, 3, 3, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByMonthAndMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 3, 3, 9, 0),
        utils_1.datetime(2001, 3, 1, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByYearDay', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 4,
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 9, 0),
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 4, 10, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByYearDayNeg', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 4,
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 9, 0),
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 4, 10, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByMonthAndYearDay', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 4,
        bymonth: [1, 7],
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0),
        utils_1.datetime(1999, 1, 1, 9, 0),
        utils_1.datetime(1999, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByMonthAndYearDayNeg', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 4,
        bymonth: [1, 7],
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 9, 0),
        utils_1.datetime(1998, 7, 19, 9, 0),
        utils_1.datetime(1999, 1, 1, 9, 0),
        utils_1.datetime(1999, 7, 19, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByWeekNo', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byweekno: 20,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 5, 11, 9, 0),
        utils_1.datetime(1998, 5, 12, 9, 0),
        utils_1.datetime(1998, 5, 13, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByWeekNoAndWeekDay', 
    // That's a nice one. The first days of week number one
    // may be in the last year.
    new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byweekno: 1,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 29, 9, 0),
        utils_1.datetime(1999, 1, 4, 9, 0),
        utils_1.datetime(2000, 1, 3, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByWeekNoAndWeekDayLarge', 
    // Another nice test. The last days of week number 52/53
    // may be in the next year.
    new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byweekno: 52,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 9, 0),
        utils_1.datetime(1998, 12, 27, 9, 0),
        utils_1.datetime(2000, 1, 2, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByWeekNoAndWeekDayLast', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byweekno: -1,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 9, 0),
        utils_1.datetime(1999, 1, 3, 9, 0),
        utils_1.datetime(2000, 1, 2, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByWeekNoAndWeekDay53', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byweekno: 53,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 12, 28, 9, 0),
        utils_1.datetime(2004, 12, 27, 9, 0),
        utils_1.datetime(2009, 12, 28, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByEaster', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byeaster: 0,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 12, 9, 0),
        utils_1.datetime(1999, 4, 4, 9, 0),
        utils_1.datetime(2000, 4, 23, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByEasterPos', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byeaster: 1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 13, 9, 0),
        utils_1.datetime(1999, 4, 5, 9, 0),
        utils_1.datetime(2000, 4, 24, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByEasterNeg', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byeaster: -1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 11, 9, 0),
        utils_1.datetime(1999, 4, 3, 9, 0),
        utils_1.datetime(2000, 4, 22, 9, 0)
    ]);
    utils_1.testRecurring('testDailyByHour', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byhour: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0),
        utils_1.datetime(1997, 9, 3, 6, 0),
        utils_1.datetime(1997, 9, 3, 18, 0)
    ]);
    utils_1.testRecurring('testDailyByMinute', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6),
        utils_1.datetime(1997, 9, 2, 9, 18),
        utils_1.datetime(1997, 9, 3, 9, 6)
    ]);
    utils_1.testRecurring('testDailyBySecond', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 6),
        utils_1.datetime(1997, 9, 2, 9, 0, 18),
        utils_1.datetime(1997, 9, 3, 9, 0, 6)
    ]);
    utils_1.testRecurring('testDailyByHourAndMinute', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6),
        utils_1.datetime(1997, 9, 2, 18, 18),
        utils_1.datetime(1997, 9, 3, 6, 6)
    ]);
    utils_1.testRecurring('testDailyByHourAndSecond', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byhour: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0, 6),
        utils_1.datetime(1997, 9, 2, 18, 0, 18),
        utils_1.datetime(1997, 9, 3, 6, 0, 6)
    ]);
    utils_1.testRecurring('testDailyByMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6, 6),
        utils_1.datetime(1997, 9, 2, 9, 6, 18),
        utils_1.datetime(1997, 9, 2, 9, 18, 6)
    ]);
    utils_1.testRecurring('testDailyByHourAndMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6, 6),
        utils_1.datetime(1997, 9, 2, 18, 6, 18),
        utils_1.datetime(1997, 9, 2, 18, 18, 6)
    ]);
    utils_1.testRecurring('testDailyBySetPos', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        byhour: [6, 18],
        byminute: [15, 45],
        bysetpos: [3, -3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 15),
        utils_1.datetime(1997, 9, 3, 6, 45),
        utils_1.datetime(1997, 9, 3, 18, 15)
    ]);
    utils_1.testRecurring('testHourly', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 2, 10, 0),
        utils_1.datetime(1997, 9, 2, 11, 0)
    ]);
    utils_1.testRecurring('testHourlyInterval', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        interval: 2,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 2, 11, 0),
        utils_1.datetime(1997, 9, 2, 13, 0)
    ]);
    utils_1.testRecurring('testHourlyIntervalLarge', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        interval: 769,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 10, 4, 10, 0),
        utils_1.datetime(1997, 11, 5, 11, 0)
    ]);
    utils_1.testRecurring('testHourlyByMonth', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        bymonth: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0),
        utils_1.datetime(1998, 1, 1, 1, 0),
        utils_1.datetime(1998, 1, 1, 2, 0)
    ]);
    utils_1.testRecurring('testHourlyByMonthDay', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        bymonthday: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 3, 0, 0),
        utils_1.datetime(1997, 9, 3, 1, 0),
        utils_1.datetime(1997, 9, 3, 2, 0)
    ]);
    utils_1.testRecurring('testHourlyByMonthAndMonthDay', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [5, 7],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 5, 0, 0),
        utils_1.datetime(1998, 1, 5, 1, 0),
        utils_1.datetime(1998, 1, 5, 2, 0)
    ]);
    utils_1.testRecurring('testHourlyByWeekDay', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 2, 10, 0),
        utils_1.datetime(1997, 9, 2, 11, 0)
    ]);
    utils_1.testRecurring('testHourlyByNWeekDay', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 2, 10, 0),
        utils_1.datetime(1997, 9, 2, 11, 0)
    ]);
    utils_1.testRecurring('testHourlyByMonthAndWeekDay', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0),
        utils_1.datetime(1998, 1, 1, 1, 0),
        utils_1.datetime(1998, 1, 1, 2, 0)
    ]);
    utils_1.testRecurring('testHourlyByMonthAndNWeekDay', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0),
        utils_1.datetime(1998, 1, 1, 1, 0),
        utils_1.datetime(1998, 1, 1, 2, 0)
    ]);
    utils_1.testRecurring('testHourlyByMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0),
        utils_1.datetime(1998, 1, 1, 1, 0),
        utils_1.datetime(1998, 1, 1, 2, 0)
    ]);
    utils_1.testRecurring('testHourlyByMonthAndMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0),
        utils_1.datetime(1998, 1, 1, 1, 0),
        utils_1.datetime(1998, 1, 1, 2, 0)
    ]);
    utils_1.testRecurring('testHourlyByYearDay', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 4,
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 0, 0),
        utils_1.datetime(1997, 12, 31, 1, 0),
        utils_1.datetime(1997, 12, 31, 2, 0),
        utils_1.datetime(1997, 12, 31, 3, 0)
    ]);
    utils_1.testRecurring('testHourlyByYearDayNeg', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 4,
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 0, 0),
        utils_1.datetime(1997, 12, 31, 1, 0),
        utils_1.datetime(1997, 12, 31, 2, 0),
        utils_1.datetime(1997, 12, 31, 3, 0)
    ]);
    utils_1.testRecurring('testHourlyByMonthAndYearDay', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 4,
        bymonth: [4, 7],
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 10, 0, 0),
        utils_1.datetime(1998, 4, 10, 1, 0),
        utils_1.datetime(1998, 4, 10, 2, 0),
        utils_1.datetime(1998, 4, 10, 3, 0)
    ]);
    utils_1.testRecurring('testHourlyByMonthAndYearDayNeg', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 4,
        bymonth: [4, 7],
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 10, 0, 0),
        utils_1.datetime(1998, 4, 10, 1, 0),
        utils_1.datetime(1998, 4, 10, 2, 0),
        utils_1.datetime(1998, 4, 10, 3, 0)
    ]);
    utils_1.testRecurring('testHourlyByWeekNo', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byweekno: 20,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 5, 11, 0, 0),
        utils_1.datetime(1998, 5, 11, 1, 0),
        utils_1.datetime(1998, 5, 11, 2, 0)
    ]);
    utils_1.testRecurring('testHourlyByWeekNoAndWeekDay', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byweekno: 1,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 29, 0, 0),
        utils_1.datetime(1997, 12, 29, 1, 0),
        utils_1.datetime(1997, 12, 29, 2, 0)
    ]);
    utils_1.testRecurring('testHourlyByWeekNoAndWeekDayLarge', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byweekno: 52,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 0, 0),
        utils_1.datetime(1997, 12, 28, 1, 0),
        utils_1.datetime(1997, 12, 28, 2, 0)
    ]);
    utils_1.testRecurring('testHourlyByWeekNoAndWeekDayLast', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byweekno: -1,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 0, 0),
        utils_1.datetime(1997, 12, 28, 1, 0),
        utils_1.datetime(1997, 12, 28, 2, 0)
    ]);
    utils_1.testRecurring('testHourlyByWeekNoAndWeekDay53', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byweekno: 53,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 12, 28, 0, 0),
        utils_1.datetime(1998, 12, 28, 1, 0),
        utils_1.datetime(1998, 12, 28, 2, 0)
    ]);
    utils_1.testRecurring.skip('testHourlyByEaster', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byeaster: 0,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 12, 0, 0),
        utils_1.datetime(1998, 4, 12, 1, 0),
        utils_1.datetime(1998, 4, 12, 2, 0)
    ]);
    utils_1.testRecurring.skip('testHourlyByEasterPos', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byeaster: 1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 13, 0, 0),
        utils_1.datetime(1998, 4, 13, 1, 0),
        utils_1.datetime(1998, 4, 13, 2, 0)
    ]);
    utils_1.testRecurring.skip('testHourlyByEasterNeg', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byeaster: -1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 11, 0, 0),
        utils_1.datetime(1998, 4, 11, 1, 0),
        utils_1.datetime(1998, 4, 11, 2, 0)
    ]);
    utils_1.testRecurring('testHourlyByHour', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byhour: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0),
        utils_1.datetime(1997, 9, 3, 6, 0),
        utils_1.datetime(1997, 9, 3, 18, 0)
    ]);
    utils_1.testRecurring('testHourlyByMinute', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6),
        utils_1.datetime(1997, 9, 2, 9, 18),
        utils_1.datetime(1997, 9, 2, 10, 6)
    ]);
    utils_1.testRecurring('testHourlyBySecond', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 6),
        utils_1.datetime(1997, 9, 2, 9, 0, 18),
        utils_1.datetime(1997, 9, 2, 10, 0, 6)
    ]);
    utils_1.testRecurring('testHourlyByHourAndMinute', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6),
        utils_1.datetime(1997, 9, 2, 18, 18),
        utils_1.datetime(1997, 9, 3, 6, 6)
    ]);
    utils_1.testRecurring('testHourlyByHourAndSecond', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byhour: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0, 6),
        utils_1.datetime(1997, 9, 2, 18, 0, 18),
        utils_1.datetime(1997, 9, 3, 6, 0, 6)
    ]);
    utils_1.testRecurring('testHourlyByMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6, 6),
        utils_1.datetime(1997, 9, 2, 9, 6, 18),
        utils_1.datetime(1997, 9, 2, 9, 18, 6)
    ]);
    utils_1.testRecurring('testHourlyByHourAndMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6, 6),
        utils_1.datetime(1997, 9, 2, 18, 6, 18),
        utils_1.datetime(1997, 9, 2, 18, 18, 6)
    ]);
    utils_1.testRecurring('testHourlyBySetPos', new index_1.RRule({ freq: index_1.RRule.HOURLY,
        count: 3,
        byminute: [15, 45],
        bysecond: [15, 45],
        bysetpos: [3, -3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 15, 45),
        utils_1.datetime(1997, 9, 2, 9, 45, 15),
        utils_1.datetime(1997, 9, 2, 10, 15, 45)
    ]);
    utils_1.testRecurring('testMinutely', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 2, 9, 1),
        utils_1.datetime(1997, 9, 2, 9, 2)
    ]);
    utils_1.testRecurring('testMinutelyInterval', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        interval: 2,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 2, 9, 2),
        utils_1.datetime(1997, 9, 2, 9, 4)
    ]);
    utils_1.testRecurring('testMinutelyIntervalLarge', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        interval: 1501,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 3, 10, 1),
        utils_1.datetime(1997, 9, 4, 11, 2)
    ]);
    utils_1.testRecurring('testMinutelyByMonth', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        bymonth: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0),
        utils_1.datetime(1998, 1, 1, 0, 1),
        utils_1.datetime(1998, 1, 1, 0, 2)
    ]);
    utils_1.testRecurring('testMinutelyByMonthDay', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        bymonthday: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 3, 0, 0),
        utils_1.datetime(1997, 9, 3, 0, 1),
        utils_1.datetime(1997, 9, 3, 0, 2)
    ]);
    utils_1.testRecurring('testMinutelyByMonthAndMonthDay', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [5, 7],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 5, 0, 0),
        utils_1.datetime(1998, 1, 5, 0, 1),
        utils_1.datetime(1998, 1, 5, 0, 2)
    ]);
    utils_1.testRecurring('testMinutelyByWeekDay', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 2, 9, 1),
        utils_1.datetime(1997, 9, 2, 9, 2)
    ]);
    utils_1.testRecurring('testMinutelyByNWeekDay', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 2, 9, 1),
        utils_1.datetime(1997, 9, 2, 9, 2)
    ]);
    utils_1.testRecurring('testMinutelyByMonthAndWeekDay', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0),
        utils_1.datetime(1998, 1, 1, 0, 1),
        utils_1.datetime(1998, 1, 1, 0, 2)
    ]);
    utils_1.testRecurring('testMinutelyByMonthAndNWeekDay', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0),
        utils_1.datetime(1998, 1, 1, 0, 1),
        utils_1.datetime(1998, 1, 1, 0, 2)
    ]);
    utils_1.testRecurring('testMinutelyByMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0),
        utils_1.datetime(1998, 1, 1, 0, 1),
        utils_1.datetime(1998, 1, 1, 0, 2)
    ]);
    utils_1.testRecurring('testMinutelyByMonthAndMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0),
        utils_1.datetime(1998, 1, 1, 0, 1),
        utils_1.datetime(1998, 1, 1, 0, 2)
    ]);
    utils_1.testRecurring('testMinutelyByYearDay', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 4,
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 0, 0),
        utils_1.datetime(1997, 12, 31, 0, 1),
        utils_1.datetime(1997, 12, 31, 0, 2),
        utils_1.datetime(1997, 12, 31, 0, 3)
    ]);
    utils_1.testRecurring('testMinutelyByYearDayNeg', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 4,
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 0, 0),
        utils_1.datetime(1997, 12, 31, 0, 1),
        utils_1.datetime(1997, 12, 31, 0, 2),
        utils_1.datetime(1997, 12, 31, 0, 3)
    ]);
    utils_1.testRecurring('testMinutelyByMonthAndYearDay', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 4,
        bymonth: [4, 7],
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 10, 0, 0),
        utils_1.datetime(1998, 4, 10, 0, 1),
        utils_1.datetime(1998, 4, 10, 0, 2),
        utils_1.datetime(1998, 4, 10, 0, 3)
    ]);
    utils_1.testRecurring('testMinutelyByMonthAndYearDayNeg', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 4,
        bymonth: [4, 7],
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 10, 0, 0),
        utils_1.datetime(1998, 4, 10, 0, 1),
        utils_1.datetime(1998, 4, 10, 0, 2),
        utils_1.datetime(1998, 4, 10, 0, 3)
    ]);
    utils_1.testRecurring('testMinutelyByWeekNo', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byweekno: 20,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 5, 11, 0, 0),
        utils_1.datetime(1998, 5, 11, 0, 1),
        utils_1.datetime(1998, 5, 11, 0, 2)
    ]);
    utils_1.testRecurring('testMinutelyByWeekNoAndWeekDay', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byweekno: 1,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 29, 0, 0),
        utils_1.datetime(1997, 12, 29, 0, 1),
        utils_1.datetime(1997, 12, 29, 0, 2)
    ]);
    utils_1.testRecurring('testMinutelyByWeekNoAndWeekDayLarge', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byweekno: 52,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 0, 0),
        utils_1.datetime(1997, 12, 28, 0, 1),
        utils_1.datetime(1997, 12, 28, 0, 2)
    ]);
    utils_1.testRecurring('testMinutelyByWeekNoAndWeekDayLast', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byweekno: -1,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 0, 0),
        utils_1.datetime(1997, 12, 28, 0, 1),
        utils_1.datetime(1997, 12, 28, 0, 2)
    ]);
    utils_1.testRecurring('testMinutelyByWeekNoAndWeekDay53', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byweekno: 53,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 12, 28, 0, 0),
        utils_1.datetime(1998, 12, 28, 0, 1),
        utils_1.datetime(1998, 12, 28, 0, 2)
    ]);
    utils_1.testRecurring.skip('testMinutelyByEaster', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byeaster: 0,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 12, 0, 0),
        utils_1.datetime(1998, 4, 12, 0, 1),
        utils_1.datetime(1998, 4, 12, 0, 2)
    ]);
    utils_1.testRecurring.skip('testMinutelyByEasterPos', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byeaster: 1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 13, 0, 0),
        utils_1.datetime(1998, 4, 13, 0, 1),
        utils_1.datetime(1998, 4, 13, 0, 2)
    ]);
    utils_1.testRecurring.skip('testMinutelyByEasterNeg', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byeaster: -1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 11, 0, 0),
        utils_1.datetime(1998, 4, 11, 0, 1),
        utils_1.datetime(1998, 4, 11, 0, 2)
    ]);
    utils_1.testRecurring('testMinutelyByHour', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byhour: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0),
        utils_1.datetime(1997, 9, 2, 18, 1),
        utils_1.datetime(1997, 9, 2, 18, 2)
    ]);
    utils_1.testRecurring('testMinutelyByMinute', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6),
        utils_1.datetime(1997, 9, 2, 9, 18),
        utils_1.datetime(1997, 9, 2, 10, 6)
    ]);
    utils_1.testRecurring('testMinutelyBySecond', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 6),
        utils_1.datetime(1997, 9, 2, 9, 0, 18),
        utils_1.datetime(1997, 9, 2, 9, 1, 6)
    ]);
    utils_1.testRecurring('testMinutelyByHourAndMinute', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6),
        utils_1.datetime(1997, 9, 2, 18, 18),
        utils_1.datetime(1997, 9, 3, 6, 6)
    ]);
    utils_1.testRecurring('testMinutelyByHourAndSecond', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byhour: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0, 6),
        utils_1.datetime(1997, 9, 2, 18, 0, 18),
        utils_1.datetime(1997, 9, 2, 18, 1, 6)
    ]);
    utils_1.testRecurring('testMinutelyByMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6, 6),
        utils_1.datetime(1997, 9, 2, 9, 6, 18),
        utils_1.datetime(1997, 9, 2, 9, 18, 6)
    ]);
    utils_1.testRecurring('testMinutelyByHourAndMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6, 6),
        utils_1.datetime(1997, 9, 2, 18, 6, 18),
        utils_1.datetime(1997, 9, 2, 18, 18, 6)
    ]);
    utils_1.testRecurring('testMinutelyBySetPos', new index_1.RRule({ freq: index_1.RRule.MINUTELY,
        count: 3,
        bysecond: [15, 30, 45],
        bysetpos: [3, -3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 15),
        utils_1.datetime(1997, 9, 2, 9, 0, 45),
        utils_1.datetime(1997, 9, 2, 9, 1, 15)
    ]);
    utils_1.testRecurring('testSecondly', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 0),
        utils_1.datetime(1997, 9, 2, 9, 0, 1),
        utils_1.datetime(1997, 9, 2, 9, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyInterval', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        interval: 2,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 0),
        utils_1.datetime(1997, 9, 2, 9, 0, 2),
        utils_1.datetime(1997, 9, 2, 9, 0, 4)
    ]);
    utils_1.testRecurring('testSecondlyIntervalLarge', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        interval: 90061,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 0),
        utils_1.datetime(1997, 9, 3, 10, 1, 1),
        utils_1.datetime(1997, 9, 4, 11, 2, 2)
    ]);
    utils_1.testRecurring('testSecondlyByMonth', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        bymonth: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0, 0),
        utils_1.datetime(1998, 1, 1, 0, 0, 1),
        utils_1.datetime(1998, 1, 1, 0, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByMonthDay', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        bymonthday: [1, 3],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 3, 0, 0, 0),
        utils_1.datetime(1997, 9, 3, 0, 0, 1),
        utils_1.datetime(1997, 9, 3, 0, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByMonthAndMonthDay', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [5, 7],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 5, 0, 0, 0),
        utils_1.datetime(1998, 1, 5, 0, 0, 1),
        utils_1.datetime(1998, 1, 5, 0, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByWeekDay', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 0),
        utils_1.datetime(1997, 9, 2, 9, 0, 1),
        utils_1.datetime(1997, 9, 2, 9, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByNWeekDay', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 0),
        utils_1.datetime(1997, 9, 2, 9, 0, 1),
        utils_1.datetime(1997, 9, 2, 9, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByMonthAndWeekDay', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0, 0),
        utils_1.datetime(1998, 1, 1, 0, 0, 1),
        utils_1.datetime(1998, 1, 1, 0, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByMonthAndNWeekDay', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        bymonth: [1, 3],
        byweekday: [index_1.RRule.TU.nth(1), index_1.RRule.TH.nth(-1)],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0, 0),
        utils_1.datetime(1998, 1, 1, 0, 0, 1),
        utils_1.datetime(1998, 1, 1, 0, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0, 0),
        utils_1.datetime(1998, 1, 1, 0, 0, 1),
        utils_1.datetime(1998, 1, 1, 0, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByMonthAndMonthDayAndWeekDay', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        bymonth: [1, 3],
        bymonthday: [1, 3],
        byweekday: [index_1.RRule.TU, index_1.RRule.TH],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 1, 1, 0, 0, 0),
        utils_1.datetime(1998, 1, 1, 0, 0, 1),
        utils_1.datetime(1998, 1, 1, 0, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByYearDay', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 4,
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 0, 0, 0),
        utils_1.datetime(1997, 12, 31, 0, 0, 1),
        utils_1.datetime(1997, 12, 31, 0, 0, 2),
        utils_1.datetime(1997, 12, 31, 0, 0, 3)
    ]);
    utils_1.testRecurring('testSecondlyByYearDayNeg', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 4,
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 31, 0, 0, 0),
        utils_1.datetime(1997, 12, 31, 0, 0, 1),
        utils_1.datetime(1997, 12, 31, 0, 0, 2),
        utils_1.datetime(1997, 12, 31, 0, 0, 3)
    ]);
    utils_1.testRecurring('testSecondlyByMonthAndYearDay', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 4,
        bymonth: [4, 7],
        byyearday: [1, 100, 200, 365],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 10, 0, 0, 0),
        utils_1.datetime(1998, 4, 10, 0, 0, 1),
        utils_1.datetime(1998, 4, 10, 0, 0, 2),
        utils_1.datetime(1998, 4, 10, 0, 0, 3)
    ]);
    utils_1.testRecurring('testSecondlyByMonthAndYearDayNeg', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 4,
        bymonth: [4, 7],
        byyearday: [-365, -266, -166, -1],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 10, 0, 0, 0),
        utils_1.datetime(1998, 4, 10, 0, 0, 1),
        utils_1.datetime(1998, 4, 10, 0, 0, 2),
        utils_1.datetime(1998, 4, 10, 0, 0, 3)
    ]);
    utils_1.testRecurring('testSecondlyByWeekNo', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byweekno: 20,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 5, 11, 0, 0, 0),
        utils_1.datetime(1998, 5, 11, 0, 0, 1),
        utils_1.datetime(1998, 5, 11, 0, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByWeekNoAndWeekDay', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byweekno: 1,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 29, 0, 0, 0),
        utils_1.datetime(1997, 12, 29, 0, 0, 1),
        utils_1.datetime(1997, 12, 29, 0, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByWeekNoAndWeekDayLarge', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byweekno: 52,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 0, 0, 0),
        utils_1.datetime(1997, 12, 28, 0, 0, 1),
        utils_1.datetime(1997, 12, 28, 0, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByWeekNoAndWeekDayLast', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byweekno: -1,
        byweekday: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 12, 28, 0, 0, 0),
        utils_1.datetime(1997, 12, 28, 0, 0, 1),
        utils_1.datetime(1997, 12, 28, 0, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByWeekNoAndWeekDay53', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byweekno: 53,
        byweekday: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 12, 28, 0, 0, 0),
        utils_1.datetime(1998, 12, 28, 0, 0, 1),
        utils_1.datetime(1998, 12, 28, 0, 0, 2)
    ]);
    utils_1.testRecurring.skip('testSecondlyByEaster', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byeaster: 0,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 12, 0, 0, 0),
        utils_1.datetime(1998, 4, 12, 0, 0, 1),
        utils_1.datetime(1998, 4, 12, 0, 0, 2)
    ]);
    utils_1.testRecurring.skip('testSecondlyByEasterPos', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byeaster: 1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 13, 0, 0, 0),
        utils_1.datetime(1998, 4, 13, 0, 0, 1),
        utils_1.datetime(1998, 4, 13, 0, 0, 2)
    ]);
    utils_1.testRecurring.skip('testSecondlyByEasterNeg', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byeaster: -1,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1998, 4, 11, 0, 0, 0),
        utils_1.datetime(1998, 4, 11, 0, 0, 1),
        utils_1.datetime(1998, 4, 11, 0, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByHour', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byhour: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0, 0),
        utils_1.datetime(1997, 9, 2, 18, 0, 1),
        utils_1.datetime(1997, 9, 2, 18, 0, 2)
    ]);
    utils_1.testRecurring('testSecondlyByMinute', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6, 0),
        utils_1.datetime(1997, 9, 2, 9, 6, 1),
        utils_1.datetime(1997, 9, 2, 9, 6, 2)
    ]);
    utils_1.testRecurring('testSecondlyBySecond', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0, 6),
        utils_1.datetime(1997, 9, 2, 9, 0, 18),
        utils_1.datetime(1997, 9, 2, 9, 1, 6)
    ]);
    utils_1.testRecurring('testSecondlyByHourAndMinute', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6, 0),
        utils_1.datetime(1997, 9, 2, 18, 6, 1),
        utils_1.datetime(1997, 9, 2, 18, 6, 2)
    ]);
    utils_1.testRecurring('testSecondlyByHourAndSecond', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byhour: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 0, 6),
        utils_1.datetime(1997, 9, 2, 18, 0, 18),
        utils_1.datetime(1997, 9, 2, 18, 1, 6)
    ]);
    utils_1.testRecurring('testSecondlyByMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 6, 6),
        utils_1.datetime(1997, 9, 2, 9, 6, 18),
        utils_1.datetime(1997, 9, 2, 9, 18, 6)
    ]);
    utils_1.testRecurring('testSecondlyByHourAndMinuteAndSecond', new index_1.RRule({ freq: index_1.RRule.SECONDLY,
        count: 3,
        byhour: [6, 18],
        byminute: [6, 18],
        bysecond: [6, 18],
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 18, 6, 6),
        utils_1.datetime(1997, 9, 2, 18, 6, 18),
        utils_1.datetime(1997, 9, 2, 18, 18, 6)
    ]);
    utils_1.testRecurring('testUntilNotMatching', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000'),
        until: utils_1.parse('19970905T080000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 3, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0)
    ]);
    utils_1.testRecurring('testUntilMatching', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000'),
        until: utils_1.parse('19970904T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 3, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0)
    ]);
    utils_1.testRecurring('testUntilSingle', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000'),
        until: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testUntilEmpty', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000'),
        until: utils_1.parse('19970901T090000')
    }), []);
    utils_1.testRecurring('testUntilWithDate', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000'),
        until: utils_1.datetime(1997, 9, 5)
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 3, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0)
    ]);
    utils_1.testRecurring('testWkStIntervalMO', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        interval: 2,
        byweekday: [index_1.RRule.TU, index_1.RRule.SU],
        wkst: index_1.RRule.MO,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 7, 9, 0),
        utils_1.datetime(1997, 9, 16, 9, 0)
    ]);
    utils_1.testRecurring('testWkStIntervalSU', new index_1.RRule({ freq: index_1.RRule.WEEKLY,
        count: 3,
        interval: 2,
        byweekday: [index_1.RRule.TU, index_1.RRule.SU],
        wkst: index_1.RRule.SU,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 14, 9, 0),
        utils_1.datetime(1997, 9, 16, 9, 0)
    ]);
    utils_1.testRecurring('testDTStartIsDate', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        dtstart: utils_1.datetime(1997, 9, 2)
    }), [
        utils_1.datetime(1997, 9, 2, 0, 0),
        utils_1.datetime(1997, 9, 3, 0, 0),
        utils_1.datetime(1997, 9, 4, 0, 0)
    ]);
    utils_1.testRecurring('testDTStartWithMicroseconds', new index_1.RRule({ freq: index_1.RRule.DAILY,
        count: 3,
        dtstart: utils_1.parse('19970902T090000.5')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1997, 9, 3, 9, 0),
        utils_1.datetime(1997, 9, 4, 9, 0)
    ]);
    utils_1.testRecurring('testMaxYear', new index_1.RRule({ freq: index_1.RRule.YEARLY,
        count: 3,
        bymonth: 2,
        bymonthday: 31,
        dtstart: utils_1.parse('99970902T090000')
    }), []);
    utils_1.testRecurring('testSubsecondStartYearly', new index_1.RRule({
        freq: index_1.RRule.YEARLY,
        count: 1,
        dtstart: new Date(1420063200001)
    }), [
        new Date(1420063200001)
    ]);
    utils_1.testRecurring('testSubsecondStartMonthlyByMonthDay', new index_1.RRule({
        freq: index_1.RRule.MONTHLY,
        count: 1,
        bysetpos: [-1, 1],
        dtstart: new Date(1356991200001)
    }), [
        new Date(1356991200001)
    ]);
    it('testAfterBefore', function () {
        'YEARLY,MONTHLY,DAILY,HOURLY,MINUTELY,SECONDLY'.split(',').forEach(function (freqStr) {
            const date = new Date(1356991200001);
            const rr = new index_1.RRule({
                // @ts-ignore
                freq: index_1.RRule[freqStr],
                dtstart: date
            });
            chai_1.expect(date.getTime()).equals(rr.options.dtstart.getTime(), 'the supplied dtstart differs from RRule.options.dtstart');
            let res = rr.before(rr.after(rr.options.dtstart));
            let resTimestamp;
            if (res != null)
                resTimestamp = res.getTime();
            chai_1.expect(resTimestamp).equals(rr.options.dtstart.getTime(), 'after dtstart , followed by before does not return dtstart');
        });
    });
    it('testConvertAndBack', function () {
        [6, index_1.RRule.SU].forEach(function (wkst) {
            const rr = new index_1.RRule({
                dtstart: new Date(Date.UTC(2017, 9, 17, 0, 30, 0, 0)),
                until: new Date(Date.UTC(2017, 11, 22, 1, 30, 0, 0)),
                freq: index_1.RRule.MONTHLY,
                interval: 1,
                bysetpos: 17,
                byweekday: [index_1.RRule.SU, index_1.RRule.MO, index_1.RRule.TU, index_1.RRule.WE, index_1.RRule.TH, index_1.RRule.FR, index_1.RRule.SA],
                wkst: wkst,
                byhour: 11,
                byminute: 0,
                bysecond: 0
            });
            const rrstr = rr.toString();
            chai_1.expect(rrstr).equals('DTSTART=20171017T003000Z;UNTIL=20171222T013000Z;FREQ=MONTHLY;INTERVAL=1;BYSETPOS=17;BYDAY=SU,MO,TU,WE,TH,FR,SA;WKST=SU;BYHOUR=11;BYMINUTE=0;BYSECOND=0');
            const newrr = index_1.RRule.fromString(rrstr);
            chai_1.expect(rrstr).equals(newrr.toString());
        });
    });
    it('testByHourValues', function () {
        [
            ['DTSTART=20171101T010000Z;UNTIL=20171214T013000Z;FREQ=DAILY;INTERVAL=2;WKST=MO;BYHOUR=11,12;BYMINUTE=30;BYSECOND=0', 'every 2 days at 11 and 12 until December 13, 2017'],
            ['DTSTART=20171101T010000Z;UNTIL=20171214T013000Z;FREQ=DAILY;INTERVAL=2;WKST=MO;BYHOUR=11;BYMINUTE=30;BYSECOND=0', 'every 2 days at 11 until December 13, 2017']
        ].forEach(function (pair) {
            const rule = pair[0];
            const rr = index_1.RRule.fromString(rule);
            // tslint:disable-next-line:no-unused-expression
            chai_1.expect(rr.toText()).to.be.ok;
            // assert.equal(rr.toText(), pair[1]) -- can't test this because it reports in local time which varies by machine
        });
    });
});
//# sourceMappingURL=rrule.js.map