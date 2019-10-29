// =============================================================================
// Helper functions
// =============================================================================

import { ALL_WEEKDAYS, WeekdayStr } from './weekday'

export const isPresent = function<T>(value?: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export const isNumber = function (value?: any): value is number {
  return typeof value === 'number'
}

export const isWeekdayStr = function (value?: any): value is WeekdayStr {
  return ALL_WEEKDAYS.indexOf(value) >= 0
}

export const isArray = Array.isArray

/**
 * Simplified version of python's range()
 */
export const range = function (start: number, end: number = start): number[] {
  if (arguments.length === 1) {
    end = start
    start = 0
  }
  const rang = []
  for (let i = start; i < end; i++) rang.push(i)
  return rang
}

export const clone = function<T>(array: T[]): T[] {
  return ([] as T[]).concat(array)
}

export const repeat = function<T>(value: T | T[], times: number): (T | T[])[] {
  let i = 0
  const array: (T | T[])[] = []

  if (isArray(value)) {
    for (; i < times; i++) array[i] = ([] as T[]).concat(value)
  } else {
    for (; i < times; i++) array[i] = value
  }
  return array
}

export const toArray = function<T>(item: T | T[]): T[] {
  if (isArray(item)) {
    return item
  }

  return [ item ]
}

export function padStart (item: string | number, targetLength: number, padString: string = ' ') {
  const str = String(item)
  targetLength = targetLength >> 0
  if (str.length > targetLength) {
    return String(str)
  }

  targetLength = targetLength - str.length
  if (targetLength > padString.length) {
    padString += repeat(padString, targetLength / padString.length)
  }

  return padString.slice(0,targetLength) + String(str)
}

/**
 * Python like split
 */
export const split = function (str: string, sep: string, num: number) {
  const splits = str.split(sep)
  return num
    ? splits.slice(0, num).concat([splits.slice(num).join(sep)])
    : splits
}

/**
 * closure/goog/math/math.js:modulo
 * Copyright 2006 The Closure Library Authors.
 * The % operator in JavaScript returns the remainder of a / b, but differs from
 * some other languages in that the result will have the same sign as the
 * dividend. For example, -1 % 8 == -1, whereas in some other languages
 * (such as Python) the result would be 7. This function emulates the more
 * correct modulo behavior, which is useful for certain applications such as
 * calculating an offset index in a circular list.
 *
 * @param {number} a The dividend.
 * @param {number} b The divisor.
 * @return {number} a % b where the result is between 0 and b (either 0 <= x < b
 *     or b < x <= 0, depending on the sign of b).
 */
export const pymod = function (a: number, b: number) {
  const r = a % b
  // If r and b differ in sign, add b to wrap the result to the correct sign.
  return r * b < 0 ? r + b : r
}

/**
 * @see: <http://docs.python.org/library/functions.html#divmod>
 */
export const divmod = function (a: number, b: number) {
  return { div: Math.floor(a / b), mod: pymod(a, b) }
}

export const empty = function<T>(obj: T[] | null | undefined) {
  return !isPresent(obj) || obj.length === 0
}

/**
 * Python-like boolean
 * @return {Boolean} value of an object/primitive, taking into account
 * the fact that in Python an empty list's/tuple's
 * boolean value is False, whereas in JS it's true
 */
export const notEmpty = function<T>(obj: T[] | null | undefined): obj is T[] {
  return !empty(obj)
}

/**
 * Return true if a value is in an array
 */
export const includes = function<T>(arr: T[] | null | undefined, val: T) {
  return notEmpty(arr) && arr.indexOf(val) !== -1
}
