import {
  empty,
  includes,
  pymod,
  divmod,
  split,
  clone,
  range,
  repeat,
  isPresent,
  isArray,
} from '../src/helpers'
import { isNumber } from 'util'

describe('isPresent', () => {
  it('is false if object is null', () => {
    expect(isPresent(null)).toBe(false)
  })

  it('is false if object is undefined', () => {
    expect(isPresent(undefined)).toBe(false)
  })

  it('is true if object is non-null and not undefined', () => {
    expect(isPresent(0)).toBe(true)
    expect(isPresent('')).toBe(true)
    expect(isPresent('foo')).toBe(true)
    expect(isPresent(123)).toBe(true)
    expect(isPresent([])).toBe(true)
  })
})

describe('isArray', () => {
  it('is true if it is an array', () => {
    expect(isArray([])).toBe(true)
    expect(isArray([1])).toBe(true)
    expect(isArray(['foo'])).toBe(true)
  })

  it('is false if it is empty', () => {
    expect(isArray('foo')).toBe(false)
    expect(isArray(null)).toBe(false)
    expect(isArray(0)).toBe(false)
    expect(isArray(undefined)).toBe(false)
  })
})

describe('isNumber', () => {
  it('is true if it is a number', () => {
    expect(isNumber(0)).toBe(true)
  })

  it('is false if it is not a number', () => {
    expect(isNumber('1')).toBe(false)
    expect(isNumber(null)).toBe(false)
  })
})

describe('empty', () => {
  it('is empty if object is null', () => {
    expect(empty(null)).toBe(true)
  })

  it('is empty if object is undefined', () => {
    expect(empty(undefined)).toBe(true)
  })

  it('is empty if object is an empty array', () => {
    expect(empty([])).toBe(true)
  })

  it('is not empty if object is a non-empty array', () => {
    expect(empty(['foo'])).toBe(false)
    expect(empty([0])).toBe(false)
  })
})

describe('includes', () => {
  it('is true if the object is found', () => {
    expect(includes(['foo'], 'foo')).toBe(true)
    expect(includes([0], 0)).toBe(true)
  })

  it('is false if the object is not found', () => {
    expect(includes(['foo'], 'bar')).toBe(false)
    expect(includes([0], 1)).toBe(false)
  })
})

describe('pymod', () => {
  it('returns the wrapped result', () => {
    expect(pymod(1, 8)).toBe(1)
    expect(pymod(-1, -8)).toBe(-1)
    expect(pymod(-1, 8)).toBe(7)
  })
})

describe('divmod', () => {
  it('returns the divided result', () => {
    expect(divmod(1, 8)).toEqual({ div: 0, mod: 1 })
    expect(divmod(-1, -8)).toEqual({ div: 0, mod: -1 })
    expect(divmod(-1, 8)).toEqual({ div: -1, mod: 7 })
  })
})

describe('split', () => {
  it('splits on the separator', () => {
    expect(split('one-two-three', '-', 0)).toEqual(['one', 'two', 'three'])
  })

  it('only splits the specified number when nonzero', () => {
    expect(split('one-two-three', '-', 1)).toEqual(['one', 'two-three'])
  })
})

describe('clone', () => {
  it('copies an array', () => {
    const a = ['a', 'b', 'c']
    expect(clone(a)).not.toBe(a)
    expect(clone(a)).toEqual(a)
  })
})

describe('range', () => {
  it('generates a range', () => {
    expect(range(3, 7)).toEqual([3, 4, 5, 6])
  })

  it('generates to the first argument if no second argument is given', () => {
    expect(range(7)).toEqual([0, 1, 2, 3, 4, 5, 6])
  })
})

describe('repeat', () => {
  it('repeats a single item', () => {
    expect(repeat('foo', 3)).toEqual(['foo', 'foo', 'foo'])
  })

  it('repeats an array', () => {
    expect(repeat(['foo'], 3)).toEqual([['foo'], ['foo'], ['foo']])
  })
})
