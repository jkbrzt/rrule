Package.describe({
  name: 'jkbrzt:rrule',
  version: '2.2.0_1',
  summary: 'JavaScript library for working with recurrence rules for calendar dates.',
  git: 'git://github.com/jkbrzt/rrule.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.export('RRule');
  api.addFiles([
    "lib/rrule.js",
    "lib/nlp.js",
    "export.js"
  ], ['client','server']);
});
