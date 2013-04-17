#######################################################################
rrule.js: Library for working with recurrence rules for calendar dates.
#######################################################################

rrule.js supports recurrence rules as defined in the `iCalendar RFC`_.
It is a partial port of the ``rrule`` module from the excellent
`python-dateutil`_  library. On top of that, it supports parsing and
serialization of recurrence rules from and to natural language.

The only dependency is `Underscore.js`_.


.. contents::
    :local:
    :backlinks: none


Quick Start
===========

Client Side
-----------

Download `rrule.js`_.  If you want to use ``RRule.prototype.toText()``
or ``RRule.fromText()``, you'll also need `nlp.js`_.


.. code-block:: html

    <script src="underscore.js"></script>
    <script src="rrule/rrule.js"></script>

    <!-- Optional -->
    <script src="rrule/nlp.js"></script>


Server Side
-----------

.. code-block:: bash

    npm -g install rrule


.. code-block:: javascript

    var RRule = require('rrule').RRule;


Usage
-----------

.. code-block:: javascript

    // Create a rule:
    var rule = new RRule(RRule.WEEKLY, {
        interval: 5,
        byweekday: [RRule.MO, RRule.FR],
        dtstart: new Date(2012, 1, 1, 10, 30),
        until: new Date(2012, 12, 31)
    });

    // Get all occurrence dates (Date instances):
    rule.all();
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
    rule.toString();
    "FREQ=WEEKLY;BYDAY=MO,FR;INTERVAL=5;UNTIL=20130130T230000Z"

    // Get a human-friendly text representation:
    // The output can be used with RRule.fromText().
    rule.toText()
    "every 5 weeks on Monday, Friday until January 31, 2013"


For more examples see `test/tests.js`_ and `python-dateutil`_ documentation.

API
====


``RRule`` Constructor
---------------------

.. code-block:: javascript

    rule = new RRule(freq, options)

The ``freq`` is one of the following constants:


* ``RRule.YEARLY``
* ``RRule.MONTHLY``
* ``RRule.WEEKLY``
* ``RRule.DAILY``
* ``RRule.HOURLY``
* ``RRule.MINUTELY``
* ``RRule.SECONDLY``


The optional ``options`` argument is an object that can specify one or more
of the following options:


==============  ===============================================================
Option          Description
==============  ===============================================================
``cache``       If given, it must be a boolean value specifying to enable or
                disable caching of results. If you will use the same rrule
                instance multiple times, enabling caching will improve the
                performance considerably.

``dtstart``     The recurrence start. Besides being the base for the
                recurrence, missing parameters in the final recurrence
                instances will also be extracted from this date. If not
                given, ``new Date`` will be used instead.

``interval``    The interval between each freq iteration. For example,
                when using ``RRule.YEARLY``, an interval of ``2`` means once every
                two years, but with ``RRule.HOURLY``, it means once every two hours.
                The default interval is ``1``.

``wkst``        The week start day. Must be one of the ``RRule.MO``,
                ``RRule.TU``, ``RRule.WE`` constants, or an integer, specifying
                the first day of the week. This will affect recurrences based
                on weekly periods. The default week start is ``RRule.MO``.

``count``       How many occurrences will be generated.

``until``       If given, this must be a ``Date`` instance, that will specify
                the limit of the recurrence. If a recurrence instance happens
                to be the same as the ``Date`` instance given in the ``until``
                argument, this will be the last occurrence.

``bysetpos``    If given, it must be either an integer, or a sequence of
                integers, positive or negative. Each given integer will specify
                an occurrence number, corresponding to the nth occurrence of
                the rule inside the frequency period. For example, a
                ``bysetpos`` of ``-1`` if combined with a ``RRule.MONTHLY``
                frequency, and a byweekday of (``RRule.MO``, ``RRule.TU``,
                ``RRule.WE``, ``RRule.TH``, ``FR``), will result in the last
                work day of every month.

``bymonth``     If given, it must be either an integer, or a sequence of
                integers, meaning the months to apply the recurrence to.

``bymonthday``  If given, it must be either an integer, or a sequence of
                integers, meaning the month days to apply the recurrence to.

``byyearday``   If given, it must be either an integer, or a sequence of
                integers, meaning the year days to apply the recurrence to.

``byweekno``    If given, it must be either an integer, or a sequence of
                integers, meaning the week numbers to apply the recurrence to.
                Week numbers have the meaning described in ISO8601, that is,
                the first week of the year is that containing at least four
                days of the new year.

``byweekday``   If given, it must be either an integer (``0 == RRule.MO``), a
                sequence of integers, one of the weekday constants (``RRule.MO``,
                ``RRule.TU``, etc), or a sequence of these constants. When given,
                these variables will define the weekdays where the recurrence
                will be applied. It's also possible to use an argument n for
                the weekday instances, which will mean the nth occurrence of
                this weekday in the period. For example, with ``RRule.MONTHLY``,
                or with ``RRule.YEARLY`` and ``BYMONTH``, using
                ``RRule.FR.clone(+1)`` in ``byweekday`` will specify the
                first friday of the month where the recurrence happens. Notice
                that the RFC documentation, this is specified as ``BYDAY``,
                but was renamed to avoid the ambiguity of that argument.

``byhour``      If given, it must be either an integer, or a sequence of
                integers, meaning the hours to apply the recurrence to.

``byminute``    If given, it must be either an integer, or a sequence of
                integers, meaning the minutes to apply the recurrence to.

``bysecond``    If given, it must be either an integer, or a sequence of
                integers, meaning the seconds to apply the recurrence to.

``byeaster``    This is an extension to the RFC specification which the Python
                implementation provides.
                **Not implemented in the JavaScript version.**
==============  ===============================================================

See also `python-dateutil`_ documentation.


Occurrence Retrieval Methods
---------------------------------

``RRule.prototype.all([iterator])``
    Returns all dates matching the rule. It is a replacement for the iterator
    protocol this class implements in the Python version.

    As rules without ``until`` or ``count`` represent infinite date series,
    you can optionally pass ``iterator``,
    which is a function that is called for each date matched by the rule.
    It gets two parameters ``date`` (the ``Date`` instance being added),
    and ``i`` (zero-indexed position of ``date`` in the result).
    If the function returns ``false``, the iteration is interrupted (possibly
    prematurely).

``RRule.prototype.between(after, before, inc=false [, iterator])``
    Returns all the occurrences of the rrule between ``after`` and ``before``.
    The inc keyword defines what happens if ``after`` and/or ``before`` are
    themselves occurrences. With ``inc == true``, they will be included in the
    list, if they are found in the recurrence set.

    Optional ``iterator`` has the same function as it has with
    ``RRule.prototype.all()``.

``RRule.prototype.after(dt, inc=false)``
    Returns the last recurrence before the given ``Date`` instance.
    The ``inc`` argument defines what happens if ``dt`` is an occurrence.
    With ``inc == true``, if ``dt`` itself is an occurrence,
    it will be returned.

``RRule.prototype.before(dt, inc=false)``
    Returns the last recurrence after the given ``Date`` instance.
    The ``inc`` argument defines what happens if ``dt`` is an occurrence.
    With ``inc == true``, if ``dt`` itself is an occurrence,
    it will be returned.

See also `python-dateutil`_ documentation.


iCalendar RFC String Methods
----------------------------

``RRule.prototype.toString()``
    Returns a string representation of the rule as per the iCalendar RFC.

``RRule.fromString(rfcString, dtstart, options)``
    Constructs an ``RRule`` instance from ``rfcString``, with start date ``dtstart`` (nullable) and RRule options ``options`` (nullable).


Natural Language Text Methods
-----------------------------

These methods provide an incomplete support for text–``RRule`` and
``RRule``–text conversion. You should test them with your input to see
whether the result is acceptable.


To use these methods in the browser, you need to include the
``rrule/nlp.js`` file as well.


``RRule.prototype.toText(rrule, [today, [gettext, [language]]])``
    Returns a textual representation of ``rule``.
    You need to pass ``today`` only when the rule has the ``until``
    option.
    The ``gettext`` callback, if provided, will be called for each text token
    and its return value used instead.
    The optional ``language`` argument is a language definition to be used
    (defaults to ``rrule/nlp.js:ENGLISH``).

``RRule.prototype.isFullyConvertibleToText()``
    Provides a hint on whether all the options the rule has are convertible
    to text.

``RRule.fromText(text[, dtstart[, language]])``
    Constructs an ``RRule`` instance from ``text``.


Changelog
=========

* 1.1.0-dev
    * Handle dates in ``UNTIL`` in ``RRule.fromString``.
    * Added support for RequireJS.
    * Added ``options`` argument to ``RRule.fromString``.
* 1.0.1 (2013-02-26)
    * Fixed leap years (thanks @jessevogt)
* 1.0.0 (2013-01-24)
    * Fixed timezone offset issues related to DST (thanks @evro).
* 1.0.0-beta (2012-08-15)
    * Initial public release.


Authors
=======

* `Jakub Roztocil`_ (`@jakubroztocil`_)
* Lars Schöning (`@lyschoening`_)

Python ``dateutil`` is written by `Gustavo Niemeyer`_.

See `LICENCE`_ for more details.

.. _rrule.js: https://raw.github.com/jkbr/rrule/master/rrule.js
.. _nlp.js: https://raw.github.com/jkbr/rrule/master/nlp.js
.. _iCalendar RFC: http://www.ietf.org/rfc/rfc2445.txt
.. _python-dateutil: http://labix.org/python-dateutil/
.. _Underscore.js: http://underscorejs.org/
.. _Jakub Roztocil: http://roztocil.name/
.. _@jakubroztocil: http://twitter.com/jakubroztocil
.. _@lyschoening: http://twitter.com/lyschoening
.. _Gustavo Niemeyer: http://niemeyer.net/
.. _LICENCE: https://github.com/jkbr/rrule/blob/master/LICENCE
.. _test/tests.js: https://github.com/jkbr/rrule/blob/master/test/tests.js
