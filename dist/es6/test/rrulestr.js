"use strict";
/* global describe */
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./lib/utils");
const src_1 = require("../src");
describe('rrulestr', function () {
    // Enable additional toString() / fromString() tests
    // for each testRecurring().
    this.ctx.ALSO_TEST_STRING_FUNCTIONS = false;
    // Enable additional toText() / fromText() tests
    // for each testRecurring().
    // Many of the tests fail because the conversion is only approximate,
    // but it gives an idea about how well or bad it converts.
    this.ctx.ALSO_TEST_NLP_FUNCTIONS = false;
    // Thorough after()/before()/between() tests.
    // NOTE: can take a longer time.
    this.ctx.ALSO_TEST_BEFORE_AFTER_BETWEEN = true;
    utils_1.assertStrType('testStrType', src_1.rrulestr('DTSTART:19970902T090000Z\n' +
        'RRULE:FREQ=YEARLY;COUNT=3\n'), src_1.RRule);
    utils_1.assertStrType('testStrForceSetType', src_1.rrulestr('DTSTART:19970902T090000Z\n' +
        'RRULE:FREQ=YEARLY;COUNT=3\n', {
        forceset: true
    }), src_1.RRuleSet);
    utils_1.assertStrType('testStrSetType', src_1.rrulestr('DTSTART:19970902T090000Z\n' +
        'RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU\n' +
        'RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH\n'), src_1.RRuleSet);
    utils_1.testRecurring('testStr', src_1.rrulestr('DTSTART:19970902T090000Z\n' +
        'RRULE:FREQ=YEARLY;COUNT=3\n'), [
        utils_1.datetimeUTC(1997, 9, 2, 9, 0),
        utils_1.datetimeUTC(1998, 9, 2, 9, 0),
        utils_1.datetimeUTC(1999, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testStrCase', src_1.rrulestr('dtstart:19970902T090000Z\n' +
        'rrule:freq=yearly;count=3\n'), [
        utils_1.datetimeUTC(1997, 9, 2, 9, 0),
        utils_1.datetimeUTC(1998, 9, 2, 9, 0),
        utils_1.datetimeUTC(1999, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testStrSpaces', src_1.rrulestr(' DTSTART:19970902T090000Z ' +
        ' RRULE:FREQ=YEARLY;COUNT=3 '), [
        utils_1.datetimeUTC(1997, 9, 2, 9, 0),
        utils_1.datetimeUTC(1998, 9, 2, 9, 0),
        utils_1.datetimeUTC(1999, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testStrSpacesAndLines', src_1.rrulestr(' DTSTART:19970902T090000Z \n' +
        ' \n RRULE:FREQ=YEARLY;COUNT=3 \n'), [
        utils_1.datetimeUTC(1997, 9, 2, 9, 0),
        utils_1.datetimeUTC(1998, 9, 2, 9, 0),
        utils_1.datetimeUTC(1999, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testStrNoDTStart', src_1.rrulestr('RRULE:FREQ=YEARLY;COUNT=3\n', {
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1998, 9, 2, 9, 0),
        utils_1.datetime(1999, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testStrValueOnly', src_1.rrulestr('FREQ=YEARLY;COUNT=3\n', {
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1998, 9, 2, 9, 0),
        utils_1.datetime(1999, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testStrUnfold', src_1.rrulestr('FREQ=YEA\n RLY;COUNT=3\n', {
        unfold: true,
        dtstart: utils_1.parse('19970902T090000')
    }), [
        utils_1.datetime(1997, 9, 2, 9, 0),
        utils_1.datetime(1998, 9, 2, 9, 0),
        utils_1.datetime(1999, 9, 2, 9, 0)
    ]);
    utils_1.testRecurring('testStrSet', src_1.rrulestr('DTSTART:19970902T090000Z\n' +
        'RRULE:FREQ=YEARLY;COUNT=2;BYDAY=TU\n' +
        'RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TH\n'), [
        utils_1.datetimeUTC(1997, 9, 2, 9, 0),
        utils_1.datetimeUTC(1997, 9, 4, 9, 0),
        utils_1.datetimeUTC(1997, 9, 9, 9, 0)
    ]);
    utils_1.testRecurring('testStrSetDate', src_1.rrulestr('DTSTART:19970902T090000Z\n' +
        'RRULE:FREQ=YEARLY;COUNT=1;BYDAY=TU\n' +
        'RDATE:19970904T090000Z\n' +
        'RDATE:19970909T090000Z\n'), [
        utils_1.datetimeUTC(1997, 9, 2, 9, 0),
        utils_1.datetimeUTC(1997, 9, 4, 9, 0),
        utils_1.datetimeUTC(1997, 9, 9, 9, 0)
    ]);
    utils_1.testRecurring('testStrSetExRule', src_1.rrulestr('DTSTART:19970902T090000Z\n' +
        'RRULE:FREQ=YEARLY;COUNT=6;BYDAY=TU,TH\n' +
        'EXRULE:FREQ=YEARLY;COUNT=3;BYDAY=TH\n'), [
        utils_1.datetimeUTC(1997, 9, 2, 9, 0),
        utils_1.datetimeUTC(1997, 9, 9, 9, 0),
        utils_1.datetimeUTC(1997, 9, 16, 9, 0)
    ]);
    utils_1.testRecurring('testStrSetExDate', src_1.rrulestr('DTSTART:19970902T090000Z\n' +
        'RRULE:FREQ=YEARLY;COUNT=6;BYDAY=TU,TH\n' +
        'EXDATE:19970904T090000Z\n' +
        'EXDATE:19970911T090000Z\n' +
        'EXDATE:19970918T090000Z\n'), [
        utils_1.datetimeUTC(1997, 9, 2, 9, 0),
        utils_1.datetimeUTC(1997, 9, 9, 9, 0),
        utils_1.datetimeUTC(1997, 9, 16, 9, 0)
    ]);
    utils_1.testRecurring('testStrSetDateAndExDate', src_1.rrulestr('DTSTART:19970902T090000Z\n' +
        'RDATE:19970902T090000Z\n' +
        'RDATE:19970904T090000Z\n' +
        'RDATE:19970909T090000Z\n' +
        'RDATE:19970911T090000Z\n' +
        'RDATE:19970916T090000Z\n' +
        'RDATE:19970918T090000Z\n' +
        'EXDATE:19970904T090000Z\n' +
        'EXDATE:19970911T090000Z\n' +
        'EXDATE:19970918T090000Z\n'), [
        utils_1.datetimeUTC(1997, 9, 2, 9, 0),
        utils_1.datetimeUTC(1997, 9, 9, 9, 0),
        utils_1.datetimeUTC(1997, 9, 16, 9, 0)
    ]);
    utils_1.testRecurring('testStrSetDateAndExRule', src_1.rrulestr('DTSTART:19970902T090000Z\n' +
        'RDATE:19970902T090000Z\n' +
        'RDATE:19970904T090000Z\n' +
        'RDATE:19970909T090000Z\n' +
        'RDATE:19970911T090000Z\n' +
        'RDATE:19970916T090000Z\n' +
        'RDATE:19970918T090000Z\n' +
        'EXRULE:FREQ=YEARLY;COUNT=3;BYDAY=TH\n'), [
        utils_1.datetimeUTC(1997, 9, 2, 9, 0),
        utils_1.datetimeUTC(1997, 9, 9, 9, 0),
        utils_1.datetimeUTC(1997, 9, 16, 9, 0)
    ]);
    utils_1.testRecurring.skip('testStrKeywords', src_1.rrulestr('DTSTART:19970902T030000Z\n' +
        'RRULE:FREQ=YEARLY;COUNT=3;INTERVAL=3;' +
        'BYMONTH=3;byweekday=TH;BYMONTHDAY=3;' +
        'BYHOUR=3;BYMINUTE=3;BYSECOND=3\n'), [
        utils_1.datetimeUTC(2033, 3, 3, 3, 3, 3),
        utils_1.datetimeUTC(2039, 3, 3, 3, 3, 3),
        utils_1.datetimeUTC(2072, 3, 3, 3, 3, 3)
    ]);
    utils_1.testRecurring('testStrNWeekDay', src_1.rrulestr('DTSTART:19970902T090000Z\n' +
        'RRULE:FREQ=YEARLY;COUNT=3;BYDAY=1TU,-1TH\n'), [
        utils_1.datetimeUTC(1997, 12, 25, 9, 0),
        utils_1.datetimeUTC(1998, 1, 6, 9, 0),
        utils_1.datetimeUTC(1998, 12, 31, 9, 0)
    ]);
});
//# sourceMappingURL=rrulestr.js.map