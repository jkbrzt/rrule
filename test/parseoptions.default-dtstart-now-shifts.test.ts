/* eslint-disable */
// @ts-nocheck
// Regression test, drafted by TimeWraith: Raven Archivist's reproduction, rerun by code before it was accepted.
// Failed on jkbrzt/rrule@9f2061febeeb at 2026-11-01T09:00:00.000Z, 2026-11-01T09:00:00.000Z. Run with TZ=America/Los_Angeles.

function print() {}
function check(cond, msg) {
  const rule = String(msg || 'check')
  expect({ rule, holds: Boolean(cond) }).toEqual({ rule, holds: true })
}
async function load(p) {
  return require('../' + String(p).replace(/^\/+/, ''))
}

test('Default dtstart (now) shifts by one hour during the repeated DST hour', async () => {
  jest.useFakeTimers()
  jest.setSystemTime(new Date(1793523600000))
  const now = new Date(1793523600000) // the same `now` the probe had
  try {
    const m = await load('src/parseoptions')
    const d = m.parseOptions({ freq: 3 }).parsedOptions.dtstart
    check(
      d.getTime() === Date.now(),
      'default dtstart should equal now: ' + d.toISOString()
    )
  } finally {
    jest.useRealTimers()
  }
}, 60000)

test('Default dtstart (now) shifts by one hour during the repeated DST hour (through the public API)', async () => {
  jest.useFakeTimers()
  jest.setSystemTime(new Date(1793523600000))
  const now = new Date(1793523600000) // the same `now` the probe had
  try {
    const { RRule } = await load('src/rrule')
    const r = new RRule({ freq: RRule.DAILY, count: 1 })
    check(
      r.options.dtstart.getTime() === Date.now(),
      'RRule default dtstart ' + r.options.dtstart.toISOString()
    )
  } finally {
    jest.useRealTimers()
  }
}, 60000)
