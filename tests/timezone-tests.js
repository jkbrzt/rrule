module("RRule Time Zones", {

    setup: function() {
        RRule.setDateClass(TimeZoneDate);
    }

});

var otherTimeZone = 'America/Los_Angeles';

// test('testAfter', function() {
//     var start = new TimeZoneDate([2000, 0, 1], otherTimeZone);
//     var end = new TimeZoneDate([2000, 0, 10], otherTimeZone);
//     var rule = new RRule({dtstart: start, until: end, freq: RRule.WEEKLY, byweekday: [RRule.MO]});
//     var result = rule.after(start);
//     var resultStr = moment.tz(result, otherTimeZone).format();
//     equal(resultStr, '2000-01-03T00:00:00-08:00');
// });

// test('testBetween', function() {
//     var start = new TimeZoneDate('2000-01-01T00:00:00-08:00', otherTimeZone); // 12 AM Saturday
//     var end = new TimeZoneDate('2000-01-10T01:00:00-08:00', otherTimeZone); // 1 AM Monday
//     var rule = new RRule({dtstart: start, until: end, freq: RRule.WEEKLY, byweekday: [RRule.MO]});
//     var result = rule.between(start, end);
//     equal(result.length, 2);
//     equal(moment.tz(result[0], otherTimeZone).format(), '2000-01-03T00:00:00-08:00');
//     equal(moment.tz(result[1], otherTimeZone).format(), '2000-01-10T00:00:00-08:00');
// });

test('testBetween Melbourne', function() {
    var melbTimeZone = 'Australia/Melbourne';
    // Start date: "Mon Dec 22 2014 09:00:00 GMT+1100"
    var ruleStr = 'FREQ=WEEKLY;INTERVAL=1;BYDAY=WE;TIMEZONE=' + melbTimeZone +
            ';DTSTART=20141221T220000Z'
    var rule = RRule.fromString(ruleStr);
    var dtstart = rule.options.dtstart;
    console.log('dtstart', dtstart.toString());
    var start = new TimeZoneDate(dtstart, melbTimeZone);
    var end = new TimeZoneDate('2014-12-30T09:00:00+11:00', melbTimeZone);
    // var start = new TimeZoneDate('2015-05-01T07:00:00+10:00', melbTimeZone);
    // var end = new TimeZoneDate('2015-05-08T07:00:00+10:00', melbTimeZone);
    var results = rule.between(start, end);

    results.forEach(function(result) {
        console.log(new TimeZoneDate(result, melbTimeZone).toString());
    });

    // Incorrect date: "Thu May 07 2015 08:00:00 GMT+1000"
    var firstResult = new TimeZoneDate(results[0], melbTimeZone);
    console.log('firstResult', firstResult);
    equal(firstResult.toString(), 'Wed Dec 24 2014 09:00:00 GMT+1100');
    // equal(result.length, 2);
    // equal(moment.tz(result[0], melbTimeZone).format(), '2000-01-03T00:00:00-08:00');
    // equal(moment.tz(result[1], melbTimeZone).format(), '2000-01-10T00:00:00-08:00');
});
