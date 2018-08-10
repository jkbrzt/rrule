import { empty, includes, pymod, divmod, split, clone, range, repeat, isPresent, isArray } from '../src/helpers'
import { expect } from 'chai'
import { isNumber } from 'util';

describe('isPresent', () => {
  it('is false if object is null', () => {
    expect(isPresent(null)).to.be.false
  })

  it('is false if object is undefined', () => {
    expect(isPresent(undefined)).to.be.false
  })

  it('is true if object is non-null and not undefined', () => {
    expect(isPresent(0)).to.be.true
    expect(isPresent('')).to.be.true
    expect(isPresent('foo')).to.be.true
    expect(isPresent(123)).to.be.true
    expect(isPresent([])).to.be.true
  })
})

describe('isArray', () => {
  it('is true if it is an array', () => {
    expect(isArray([])).to.be.true
    expect(isArray([1])).to.be.true
    expect(isArray(['foo'])).to.be.true
  })

  it('is false if it is empty', () => {
    expect(isArray('foo')).to.be.false
    expect(isArray(null)).to.be.false
    expect(isArray(0)).to.be.false
    expect(isArray(undefined)).to.be.false
  })
})

describe('isNumber', () => {
  it('is true if it is a number', () => {
    expect(isNumber(0)).to.be.true
  })

  it('is false if it is not a number', () => {
    expect(isNumber('1')).to.be.false
    expect(isNumber(null)).to.be.false
  })
})

describe('empty', () => {
  it('is empty if object is null', () => {
    expect(empty(null)).to.be.true
  })

  it('is empty if object is undefined', () => {
    expect(empty(undefined)).to.be.true
  })

  it('is empty if object is an empty array', () => {
    expect(empty([])).to.be.true
  })

  it('is not empty if object is a non-empty array', () => {
    expect(empty(['foo'])).to.be.false
    expect(empty([0])).to.be.false
  })
})

describe('includes', () => {
  it('is true if the object is found', () => {
    expect(includes(['foo'], 'foo')).to.be.true
    expect(includes([0], 0)).to.be.true
  })

  it('is false if the object is not found', () => {
    expect(includes(['foo'], 'bar')).to.be.false
    expect(includes([0], 1)).to.be.false
  })
})

describe('pymod', () => {
  it('returns the wrapped result', () => {
    expect(pymod(1, 8)).to.equal(1)
    expect(pymod(-1, -8)).to.equal(-1)
    expect(pymod(-1, 8)).to.equal(7)
  })
})

describe('divmod', () => {
  it('returns the divided result', () => {
    expect(divmod(1, 8)).to.deep.equal({ div: 0, mod: 1 })
    expect(divmod(-1, -8)).to.deep.equal({ div: 0, mod: -1 })
    expect(divmod(-1, 8)).to.deep.equal({ div: -1, mod: 7 })
  })
})

describe('split', () => {
  it('splits on the separator', () => {
    expect(split('one-two-three', '-', 0)).to.deep.equal(['one', 'two', 'three'])
  })

  it('only splits the specified number when nonzero', () => {
    expect(split('one-two-three', '-', 1)).to.deep.equal(['one', 'two-three'])
  })
})

describe('clone', () => {
  it('copies an array', () => {
    const a = ['a', 'b', 'c']
    expect(clone(a)).not.to.equal(a)
    expect(clone(a)).to.deep.equal(a)
  })
})

describe('range', () => {
  it('generates a range', () => {
    expect(range(3, 7)).to.deep.equal([3, 4, 5, 6])
  })

  it('generates to the first argument if no second argument is given', () => {
    expect(range(7)).to.deep.equal([0, 1, 2, 3, 4, 5, 6])
  })
})

describe('repeat', () => {
  it('repeats a single item', () => {
    expect(repeat('foo', 3)).to.deep.equal(['foo', 'foo', 'foo'])
  })

  it('repeats an array', () => {
    expect(repeat(['foo'], 3)).to.deep.equal([['foo'], ['foo'], ['foo']])
  })
})