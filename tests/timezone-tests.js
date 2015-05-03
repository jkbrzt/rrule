module("RRule Time Zones", {

    setup: function() {
        RRule.setDateClass(TimeZoneDate);
    }

});

// Ensure all dates are created as TimeZoneDate.

/**
 * datetime.date/datetime.datetime
 */
date = datetime = function(y, m, d, h, i, s) {
    h = h || 0;
    i = i || 0;
    s = s || 0;
    return new TimeZoneDate(y, m - 1, d, h, i, s);
};

var melbTimeZone = 'Australia/Melbourne';
var otherTimeZone = 'America/Los_Angeles';

test('testAfter Los Angeles', function() {
    var start = new TimeZoneDate([2000, 0, 1], otherTimeZone);
    var end = new TimeZoneDate([2000, 0, 10], otherTimeZone);
    var rule = new RRule({dtstart: start, until: end, freq: RRule.WEEKLY, byweekday: [RRule.MO],
        timezone: otherTimeZone});
    var result = rule.after(start);
    var resultStr = moment.tz(result, otherTimeZone).format();
    equal(resultStr, '2000-01-03T00:00:00-08:00');
});

test('testAfter Melbourne', function() {
    var start = new TimeZoneDate([2015, 0, 1], melbTimeZone);
    var end = new TimeZoneDate([2015, 0, 7], melbTimeZone);
    var rule = new RRule({dtstart: start, until: end, freq: RRule.WEEKLY, byweekday: [RRule.MO],
        timezone: melbTimeZone});
    var result = rule.after(start);
    var resultStr = moment.tz(result, melbTimeZone).format();
    equal(resultStr, '2015-01-05T00:00:00+11:00');
});

test('testParse Los Angeles', function() {
    var start = new TimeZoneDate([2000, 0, 1], otherTimeZone);
    var end = new TimeZoneDate([2000, 0, 10], otherTimeZone);
    var rule = new RRule({dtstart: start, until: end, freq: RRule.WEEKLY, byweekday: [RRule.MO],
        timezone: otherTimeZone});
    rule.toString();
    var otherRule = RRule.fromString(rule.toString(rule));
    equal(rule.toString(), otherRule.toString());
    equal(rule.options.dtstart.toString(), otherRule.options.dtstart.toString());
});

test('testBetween', function() {
    var start = new TimeZoneDate('2000-01-01T00:00:00-08:00', otherTimeZone); // 12 AM Saturday
    var end = new TimeZoneDate('2000-01-10T01:00:00-08:00', otherTimeZone); // 1 AM Monday
    var rule = new RRule({dtstart: start, until: end, freq: RRule.WEEKLY, byweekday: [RRule.MO],
        timezone: otherTimeZone});
    var result = rule.between(start, end);
    equal(result.length, 2);
    equal(moment.tz(result[0], otherTimeZone).format(), '2000-01-03T00:00:00-08:00');
    equal(moment.tz(result[1], otherTimeZone).format(), '2000-01-10T00:00:00-08:00');
});

test('testBetween Melbourne', function() {
    // Start date: "Mon Dec 22 2014 09:00:00 GMT+1100"
    var ruleStr = 'FREQ=WEEKLY;INTERVAL=1;BYDAY=FR;TIMEZONE=' + melbTimeZone +
            ';DTSTART=20141221T220000Z'
    var rule = RRule.fromString(ruleStr);
    var dtstart = rule.options.dtstart;
    var start = new TimeZoneDate(dtstart, melbTimeZone);
    var end = new TimeZoneDate('2014-12-30T09:00:00+11:00', melbTimeZone);
    var results = rule.between(start, end);
    equal(results[0].toString(), 'Fri Dec 26 2014 09:00:00 GMT+1100 (AEDT)');
});
