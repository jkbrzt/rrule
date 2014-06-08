Package.describe({
  summary: "JavaScript library for working with recurrence rules for calendar dates."
});

Package.on_use(function (api) {
  api.export('RRule');
  api.add_files(['lib/rrule.js', 'lib/nlp.js']);
});
