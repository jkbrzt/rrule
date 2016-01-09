rrule.js
========

**Library for working with recurrence rules for calendar dates.**

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![js-standard-style][js-standard-image]][js-standard-url]
[![Downloads][downloads-image]][downloads-url]

rrule.js supports recurrence rules as defined in the [iCalendar
RFC](http://www.ietf.org/rfc/rfc2445.txt). It is a partial port of the
`rrule` module from the excellent
[python-dateutil](http://labix.org/python-dateutil/) library. On top of
that, it supports parsing and serialization of recurrence rules from and
to natural language.

* * * * *


### Quick Start

-   [Demo app](http://jkbrzt.github.io/rrule/)

#### Client Side

```bash
$ bower install rrule
```

Alternatively, download
[rrule.js](https://raw.github.com/jkbrzt/rrule/master/lib/rrule.js) manually. If
you intend to use `RRule.prototype.toText()` or `RRule.fromText()`, you'll
also need [nlp.js](https://raw.github.com/jkbrzt/rrule/master/lib/nlp.js).

```html
<script src="rrule/lib/rrule.js"></script>

<!-- Optional -->
<script src="rrule/lib/nlp.js"></script>
```

#### Server Side

```bash
$ npm install rrule
```

```javascript
var RRule = require('rrule').RRule
var RRuleSet = require('rrule').RRuleSet
var rrulestr = require('rrule').rrulestr
```

#### Usage

**RRule:**
```js
// Create a rule:
var rule = new RRule({
  freq: RRule.WEEKLY,
  interval: 5,
  byweekday: [RRule.MO, RRule.FR],
  dtstart: new Date(2012, 1, 1, 10, 30),
  until: new Date(2012, 12, 31)
})

// Get all occurrence dates (Date instances):
rule.all()
['Fri Feb 03 2012 10:30:00 GMT+0100 (CET)',
 'Mon Mar 05 2012 10:30:00 GMT+0100 (CET)',
 'Fri Mar 09 2012 10:30:00 GMT+0100 (CET)',
 'Mon Apr 09 2012 10:30:00 GMT+0200 (CEST)',
 /* … */]

// Get a slice:
rule.between(new Date(2012, 7, 1), new Date(2012, 8, 1))
['Mon Aug 27 2012 10:30:00 GMT+0200 (CEST)',
 'Fri Aug 31 2012 10:30:00 GMT+0200 (CEST)']

// Get an iCalendar RRULE string representation:
// The output can be used with RRule.fromString().
rule.toString()
"FREQ=WEEKLY;DTSTART=20120201T093000Z;INTERVAL=5;UNTIL=20130130T230000Z;BYDAY=MO,FR"

// Get a human-friendly text representation:
// The output can be used with RRule.fromText().
rule.toText()
"every 5 weeks on Monday, Friday until January 31, 2013"
```

**RRuleSet:**
```js
var rruleSet = new RRuleSet()

// Add a rrule to rruleSet
rruleSet.rrule(new RRule({
  freq: RRule.MONTHLY,
  count: 5,
  dtstart: new Date(2012, 1, 1, 10, 30)
}))

// Add a date to rruleSet
rruleSet.rdate(new Date(2012, 6, 1, 10, 30))

// Add another date to rruleSet
rruleSet.rdate(new Date(2012, 6, 2, 10, 30))

// Add a exclusion rrule to rruleSet
rruleSet.exrule(new r.RRule({
  freq: RRule.MONTHLY,
  count: 2,
  dtstart: new Date(2012, 2, 1, 10, 30)
}))

// Add a exclusion date to rruleSet
rruleSet.exdate(new Date(2012, 5, 1, 10, 30))

// Get all occurrence dates (Date instances):
rruleSet.all()
['Wed Feb 01 2012 10:30:00 GMT+0800 (CST)',
 'Tue May 01 2012 10:30:00 GMT+0800 (CST)',
 'Sun Jul 01 2012 10:30:00 GMT+0800 (CST)',
 'Mon Jul 02 2012 10:30:00 GMT+0800 (CST)']

// Get a slice:
rruleSet.between(new Date(2012, 2, 1), new Date(2012, 6, 2))
['Tue May 01 2012 10:30:00 GMT+0800 (CST)',
 'Sun Jul 01 2012 10:30:00 GMT+0800 (CST)']

 // To string
rruleSet.valueOf()
['RRULE:FREQ=MONTHLY;COUNT=5;DTSTART=20120201T023000Z',
 'RDATE:20120701T023000Z,20120702T023000Z',
 'EXRULE:FREQ=MONTHLY;COUNT=2;DTSTART=20120301T023000Z',
 'EXDATE:20120601T023000Z']

// To string
rruleSet.toString()
'["RRULE:FREQ=MONTHLY;COUNT=5;DTSTART=20120201T023000Z","RDATE:20120701T023000Z,20120702T023000Z","EXRULE:FREQ=MONTHLY;COUNT=2;DTSTART=20120301T023000Z","EXDATE:20120601T023000Z"]'
```

**rrulestr:**
```js
// Parse a RRule string, return a RRule object
rrulestr('RRULE:FREQ=MONTHLY;COUNT=5;DTSTART=20120201T023000Z')

// Parse a RRule string, return a RRuleSet object
rrulestr('RRULE:FREQ=MONTHLY;COUNT=5;DTSTART=20120201T023000Z', {forceset: true})

// Parse a RRuleSet string, return a RRuleSet object
rrulestr('RRULE:FREQ=MONTHLY;COUNT=5;DTSTART=20120201T023000Z\nRDATE:20120701T023000Z,20120702T023000Z\nEXRULE:FREQ=MONTHLY;COUNT=2;DTSTART=20120301T023000Z\nEXDATE:20120601T023000Z')

```

For more examples see
[python-dateutil](http://labix.org/python-dateutil/) documentation.

### API

#### `RRule` Constructor

```javascript
new RRule(options[, noCache=false])
```

The `options` argument mostly corresponds to the properties defined for `RRULE` in the
iCalendar RFC. Only `freq` is required.

<table>
    <!-- why, markdown... -->
    <thead>
    <tr>
        <th>Option</th>
        <th>Description</th>
    </tr>
    <thead>
    <tbody>
    <tr>
        <td><code>freq</code></td>
        <td>
            <p>(required) One of the following constants:</p>
            <ul>
                <li><code>RRule.YEARLY</code></li>
                <li><code>RRule.MONTHLY</code></li>
                <li><code>RRule.WEEKLY</code></li>
                <li><code>RRule.DAILY</code></li>
                <li><code>RRule.HOURLY</code></li>
                <li><code>RRule.MINUTELY</code></li>
                <li><code>RRule.SECONDLY</code></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><code>dtstart</code></td>
        <td>The recurrence start. Besides being the base for the
            recurrence, missing parameters in the final recurrence
            instances will also be extracted from this date. If not
            given, <code>new Date</code> will be used instead.
        </td>
    </tr>
    <tr>
        <td><code>interval</code></td>
        <td>The interval between each freq iteration. For example,
            when using <code>RRule.YEARLY</code>, an interval of <code>2</code> means
            once every
            two years, but with <code>RRule.HOURLY</code>, it means once every two
            hours.
            The default interval is <code>1</code>.
        </td>
    </tr>
    <tr>
        <td><code>wkst</code></td>
        <td>The week start day. Must be one of the <code>RRule.MO</code>,
            <code>RRule.TU</code>, <code>RRule.WE</code> constants, or an integer,
            specifying
            the first day of the week. This will affect recurrences based
            on weekly periods. The default week start is <code>RRule.MO</code>.
        </td>
    </tr>
    <tr>
        <td><code>count</code></td>
        <td>How many occurrences will be generated.</td>
    </tr>
    <tr>
        <td><code>until</code></td>
        <td>If given, this must be a <code>Date</code> instance, that will specify
            the limit of the recurrence. If a recurrence instance happens
            to be the same as the <code>Date</code> instance given in the
            <code>until</code>
            argument, this will be the last occurrence.
        </td>
    </tr>
    <tr>
        <td><code>bysetpos</code></td>
        <td>If given, it must be either an integer, or a sequence of
            integers, positive or negative. Each given integer will specify
            an occurrence number, corresponding to the nth occurrence of
            the rule inside the frequency period. For example, a
            <code>bysetpos</code> of <code>-1</code> if combined with a <code>RRule.MONTHLY</code>
            frequency, and a byweekday of (<code>RRule.MO</code>, <code>RRule.TU</code>,
            <code>RRule.WE</code>, <code>RRule.TH</code>, <code>FR</code>), will result in
            the last
            work day of every month.
        </td>
    </tr>
    <tr>
        <td><code>bymonth</code></td>
        <td>If given, it must be either an integer, or a sequence of
            integers, meaning the months to apply the recurrence to.
        </td>
    </tr>
    <tr>
        <td><code>bymonthday</code></td>
        <td>If given, it must be either an integer, or a sequence of
            integers, meaning the month days to apply the recurrence to.
        </td>
    </tr>
    <tr>
        <td><code>byyearday</code></td>
        <td>If given, it must be either an integer, or a sequence of
            integers, meaning the year days to apply the recurrence to.
        </td>
    </tr>
    <tr>
        <td><code>byweekno</code></td>
        <td>If given, it must be either an integer, or a sequence of
            integers, meaning the week numbers to apply the recurrence to.
            Week numbers have the meaning described in ISO8601, that is,
            the first week of the year is that containing at least four
            days of the new year.
        </td>
    </tr>
    <tr>
        <td><code>byweekday</code></td>
        <td>If given, it must be either an integer (<code>0 == RRule.MO</code>), a
            sequence of integers, one of the weekday constants
            (<code>RRule.MO</code>,
            <code>RRule.TU</code>, etc), or a sequence of these constants. When
            given,
            these variables will define the weekdays where the recurrence
            will be applied. It's also possible to use an argument n for
            the weekday instances, which will mean the nth occurrence of
            this weekday in the period. For example, with
            <code>RRule.MONTHLY</code>,
            or with <code>RRule.YEARLY</code> and <code>BYMONTH</code>, using
            <code>RRule.FR.nth(+1)</code> or <code>RRule.FR.nth(-1)</code> in <code>byweekday</code>
            will specify the first or last friday of the month where the
            recurrence happens.
            Notice
            that the RFC documentation, this is specified as <code>BYDAY</code>,
            but was renamed to avoid the ambiguity of that argument.
        </td>
    </tr>
    <tr>
        <td><code>byhour</code></td>
        <td>If given, it must be either an integer, or a sequence of
            integers, meaning the hours to apply the recurrence to.
        </td>
    </tr>
    <tr>
        <td><code>byminute</code></td>
        <td>If given, it must be either an integer, or a sequence of
            integers, meaning the minutes to apply the recurrence to.
        </td>
    </tr>
    <tr>
        <td><code>bysecond</code></td>
        <td>If given, it must be either an integer, or a sequence of
            integers, meaning the seconds to apply the recurrence to.
        </td>
    </tr>
    <tr>
        <td><code>byeaster</code></td>
        <td>This is an extension to the RFC specification which the Python
            implementation provides.
            <strong>Not implemented in the JavaScript version.</strong>
        </td>
    </tr>
    </tbody>
</table>


`noCache`: Set to `true` to disable caching of results. If you will use the
same rrule instance multiple times, enabling caching will improve the
performance considerably. Enabled by default.

See also [python-dateutil](http://labix.org/python-dateutil/)
documentation.


* * * * *


#### Instance properties

<dl>
    <dt><code>rule.options</code></dt>
    <dd>Processed options applied to the rule. Includes default options
    (such us <code>wkstart</code>). Currently,
    <code>rule.options.byweekday</code> isn't equal
    to <code>rule.origOptions.byweekday</code> (which is an inconsistency).
    </dd>

    <dt><code>rule.origOptions</code></dt>
    <dd>The original <code>options</code> argument passed to
    the constructor.</dd>
</dl>


* * * * *


#### Occurrence Retrieval Methods

##### `RRule.prototype.all([iterator])`

Returns all dates matching the rule. It is a replacement for the
iterator protocol this class implements in the Python version.

As rules without `until` or `count` represent infinite date series, you
can optionally pass `iterator`, which is a function that is called for
each date matched by the rule. It gets two parameters `date` (the `Date`
instance being added), and `i` (zero-indexed position of `date` in the
result). Dates are being added to the result as long as the iterator
returns `true`. If a `false`-y value is returned, `date` isn't added to
the result and the iteration is interrupted (possibly prematurely).

```javascript
rule.all()
['Fri Feb 03 2012 10:30:00 GMT+0100 (CET)',
 'Mon Mar 05 2012 10:30:00 GMT+0100 (CET)',
 'Fri Mar 09 2012 10:30:00 GMT+0100 (CET)',
 'Mon Apr 09 2012 10:30:00 GMT+0200 (CEST)',
 /* … */]

rule.all(function (date, i){return i < 2})
['Fri Feb 03 2012 10:30:00 GMT+0100 (CET)',
 'Mon Mar 05 2012 10:30:00 GMT+0100 (CET)',]
```

##### `RRule.prototype.between(after, before, inc=false [, iterator])`

Returns all the occurrences of the rrule between `after` and `before`.
The inc keyword defines what happens if `after` and/or `before` are
themselves occurrences. With `inc == true`, they will be included in the
list, if they are found in the recurrence set.

Optional `iterator` has the same function as it has with
`RRule.prototype.all()`.

```javascript
rule.between(new Date(2012, 7, 1), new Date(2012, 8, 1))
['Mon Aug 27 2012 10:30:00 GMT+0200 (CEST)',
 'Fri Aug 31 2012 10:30:00 GMT+0200 (CEST)']
```

##### `RRule.prototype.before(dt, inc=false)`

Returns the last recurrence before the given `Date` instance. The `inc`
argument defines what happens if `dt` is an occurrence. With
`inc == true`, if `dt` itself is an occurrence, it will be returned.


##### `RRule.prototype.after(dt, inc=false)`

Returns the first recurrence
after the given `Date` instance. The `inc` argument defines what happens
if `dt` is an occurrence. With `inc == true`, if `dt` itself is an
occurrence, it will be returned.

See also [python-dateutil](http://labix.org/python-dateutil/)
documentation.


* * * * *


#### iCalendar RFC String Methods

##### `RRule.prototype.toString()`

Returns a string representation of the rule as per the iCalendar RFC.
Only properties explicitly specified in `options` are included:

```javascript
rule.toString()
"FREQ=WEEKLY;DTSTART=20120201T093000Z;INTERVAL=5;UNTIL=20130130T230000Z;BYDAY=MO,FR"

rule.toString() == RRule.optionsToString(rule.origOptions)
true
```

##### `RRule.optionsToString(options)`

Converts `options` to iCalendar RFC `RRULE` string:

```javascript
// Get full a string representation of all options,
// including the default and inferred ones.
RRule.optionsToString(rule.options)
"FREQ=WEEKLY;DTSTART=20120201T093000Z;INTERVAL=5;WKST=0;UNTIL=20130130T230000Z;BYDAY=MO,FR;BYHOUR=10;BYMINUTE=30;BYSECOND=0"

// Cherry-pick only some options from an rrule:
RRule.optionsToString({
  freq: rule.options.freq,
  dtstart: rule.options.dtstart
})
"FREQ=WEEKLY;DTSTART=20120201T093000Z"
```

##### `RRule.fromString(rfcString)`

Constructs an `RRule` instance from a complete `rfcString`:

```javascript
var rule = RRule.fromString("FREQ=WEEKLY;DTSTART=20120201T093000Z")

// This is equivalent
var rule = new RRule(RRule.parseString("FREQ=WEEKLY;DTSTART=20120201T093000Z"))
```

##### `RRule.parseString(rfcString)`

Only parse RFC string and return `options`.

```javascript
var options = RRule.parseString('FREQ=DAILY;INTERVAL=6')
options.dtstart = new Date(2000, 1, 1)
var rule = new RRule(options)
```

* * * * *

#### Natural Language Text Methods

These methods provide an incomplete support for text–`RRule` and
`RRule`–text conversion. You should test them with your input to see
whether the result is acceptable.

To use these methods in the browser, you need to include the
`rrule/nlp.js` file as well.

##### `RRule.prototype.toText([gettext, [language]])`

Returns a textual representation of `rule`. The `gettext` callback, if
provided, will be called for each text token and its return value used
instead. The optional `language` argument is a language definition to be
used (defaults to `rrule/nlp.js:ENGLISH`).

```javascript
var rule = new RRule({
  freq: RRule.WEEKLY,
  count: 23
})
rule.toText()
"every week for 23 times"
```

##### `RRule.prototype.isFullyConvertibleToText()`

Provides a hint on whether all the options the rule has are convertible
to text.

##### `RRule.fromText(text[, language])`

Constructs an `RRule` instance from `text`.

```javascript
rule = RRule.fromText('every day for 3 times')
```

##### `RRule.parseText(text[, language])`

Parse `text` into `options`:

```javascript
options = RRule.parseText('every day for 3 times')
// {freq: 3, count: "3"}
options.dtstart = new Date(2000, 1, 1)
var rule = new RRule(options)
```


* * * * *

#### `RRuleSet` Constructor

```javascript
new RRuleSet([noCache=false])
```

The RRuleSet instance allows more complex recurrence setups, mixing multiple
 rules, dates, exclusion rules, and exclusion dates.

Default `noCache` argument is `false`, caching of results will be enabled,
improving performance of multiple queries considerably.

##### `RRuleSet.prototype.rrule(rrule)`

Include the given rrule instance in the recurrence set generation.

##### `RRuleSet.prototype.rdate(dt)`
Include the given datetime instance in the recurrence set generation.

##### `RRuleSet.prototype.exrule(rrule)`
Include the given rrule instance in the recurrence set exclusion list. Dates
which are part of the given recurrence rules will not be generated, even if
some inclusive rrule or rdate matches them.

##### `RRuleSet.prototype.exdate(dt)`
Include the given datetime instance in the recurrence set exclusion list. Dates
included that way will not be generated, even if some inclusive rrule or
rdate matches them.

##### `RRuleSet.prototype.all([iterator])`

Same as `RRule.prototype.all`.

##### `RRuleSet.prototype.between(after, before, inc=false [, iterator])`

Same as `RRule.prototype.between`.

##### `RRuleSet.prototype.before(dt, inc=false)`

Same as `RRule.prototype.before`.

##### `RRuleSet.prototype.after(dt, inc=false)`

Same as `RRule.prototype.after`.

* * * * *

#### `rrulestr` Function

```js
rrulestr(rruleStr[, options])
```

The `rrulestr` function is a parser for RFC-like syntaxes. The string passed
as parameter may be a multiple line string, a single line string, or just the
RRULE property value.

Additionally, it accepts the following keyword arguments:

`cache`
If True, the rruleset or rrule created instance will cache its results.
Default is not to cache.

`dtstart`
If given, it must be a datetime instance that will be used when no DTSTART
property is found in the parsed string. If it is not given, and the property
is not found, datetime.now() will be used instead.

`unfold`
If set to True, lines will be unfolded following the RFC specification. It
defaults to False, meaning that spaces before every line will be stripped.

`forceset`
If set to True a rruleset instance will be returned, even if only a single rule
is found. The default is to return an rrule if possible, and an rruleset if necessary.

`compatible`
If set to True, the parser will operate in RFC-compatible mode. Right now it
means that unfold will be turned on, and if a DTSTART is found, it will be
considered the first recurrence instance, as documented in the RFC.

`ignoretz`
If set to True, the date parser will ignore timezone information available in
the DTSTART property, or the UNTIL attribute.

`tzinfos`
If set, it will be passed to the datetime string parser to resolve unknown
timezone settings. For more information about what could be used here, check
the parser documentation.

* * * * *

### Development

rrule.js use [JavaScript Standard Style](https://github.com/feross/standard) coding style.

### Changelog
* 2.2.0-dev
    * Added support `RRuleSet`, which allows more complex recurrence setups,
      mixing multiple rules, dates, exclusion rules, and exclusion dates.
    * Added Millisecond precision
        * Millisecond offset extracted from `dtstart` (`dtstart.getTime() % 1000`)
        * Each recurrence is returned with the same offset
    * Added some NLP support for hourly and byhour.
    * Fixed export in nlp.js.
* 2.1.0
   * Removed dependency on Underscore.js (thanks, @gsf).
   * Various small bugfixes and improvements.
* 2.0.1
   * Added bower.json.
* 2.0.0 (2013-07-16)
   * Fixed a February 28-related issue.
   * More flexible, backwards-incompatible API:
      * `freq` is now `options.freq`.
      * `options.cache` is now `noCache`.
      * `iterator` has to return `true`
      * `dtstart` and `options` arguments removed from `RRule.fromString`
        (use `RRule.parseString` and modify `options` manually instead).
      * `today` argument removed from `Rule.prototype.toText`
        (never actually used).
      * `rule.toString()` now includes `DTSTART` (if explicitly specified
        in `options`).
      * Day constants `.clone` is now `.nth`, eg. `RRule.FR.nth(-1)`
        (last Friday).
   * Added `RRule.parseString`
   * Added `RRule.parseText`
   * Added `RRule.optionsToString`
* 1.1.0 (2013-05-21)
   * Added a [demo app](http://jkbrzt.github.io/rrule/).
   * Handle dates in `UNTIL` in `RRule.fromString`.
   * Added support for RequireJS.
   * Added `options` argument to `RRule.fromString`.
* 1.0.1 (2013-02-26)
   * Fixed leap years (thanks @jessevogt)
* 1.0.0 (2013-01-24)
   * Fixed timezone offset issues related to DST (thanks @evro).
* 1.0.0-beta (2012-08-15)
   * Initial public release.


#### Authors

* [Jakub Roztocil](http://roztocil.co/)
    ([@jkbrzt](http://twitter.com/jkbrzt))
* Lars Schöning ([@lyschoening](http://twitter.com/lyschoening))

Python `dateutil` is written by [Gustavo
Niemeyer](http://niemeyer.net/).

See [LICENCE](https://github.com/jkbrzt/rrule/blob/master/LICENCE) for
more details.

[npm-url]: https://npmjs.org/package/rrule
[npm-image]: http://img.shields.io/npm/v/rrule.svg

[travis-url]: https://travis-ci.org/jkbrzt/rrule
[travis-image]: http://img.shields.io/travis/jkbrzt/rrule.svg

[downloads-url]: https://npmjs.org/package/rrule
[downloads-image]: http://img.shields.io/npm/dm/rrule.svg?style=flat-square

[js-standard-url]: https://github.com/feross/standard
[js-standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
