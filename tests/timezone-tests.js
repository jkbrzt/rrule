module("RRule Time Zones", {

    setup: function() {

    }

});

test('testAfter', function() {
    var start = new MomentDate([2000, 0, 1], 'America/Los_Angeles');
    var end = new MomentDate([2000, 0, 10], 'America/Los_Angeles');
    var rule = new RRule({dtstart: start, until: end, freq: RRule.WEEKLY, byweekday: [RRule.MO]});
    var result = rule.after(start);
    var resultStr = moment.tz(result, 'America/Los_Angeles').format();
    equal(resultStr, '2000-01-03T00:00:00-08:00');
});
