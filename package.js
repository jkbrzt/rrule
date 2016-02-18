Package.describe({
  name: 'jkbrzt:rrule',
  version: '2.2.0',
  summary: 'JavaScript library for working with recurrence rules for calendar dates.',
  git: 'git://github.com/jkbrzt/rrule.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.addFiles([
    "lib/rrule.js",
    "lib/nlp.js"
  ], ['client','server']);
  api.export('RRule');
});
