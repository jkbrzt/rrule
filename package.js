Package.describe({
  summary: "JavaScript library for working with recurrence rules for calendar dates."
});

Package.on_use(function (api) {
  api.export('RRule');
  var files = ['lib/rrule.js', 'lib/nlp.js'];
  api.add_files(files, ['client', 'server']);
});
