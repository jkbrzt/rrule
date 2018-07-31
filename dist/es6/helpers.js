// =============================================================================
// Helper functions
// =============================================================================
/**
 * Simplified version of python's range()
 */
const range = function (start, end) {
    if (arguments.length === 1) {
        end = start;
        start = 0;
    }
    const rang = [];
    for (let i = start; i < end; i++)
        rang.push(i);
    return rang;
};
const repeat = function (value, times) {
    let i = 0;
    const array = [];
    if (value instanceof Array) {
        for (; i < times; i++)
            array[i] = [].concat(value);
    }
    else {
        for (; i < times; i++)
            array[i] = value;
    }
    return array;
};
/**
 * Python like split
 */
const split = function (str, sep, num) {
    const splits = str.split(sep);
    return num
        ? splits.slice(0, num).concat([splits.slice(num).join(sep)])
        : splits;
};
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
const pymod = function (a, b) {
    const r = a % b;
    // If r and b differ in sign, add b to wrap the result to the correct sign.
    return r * b < 0 ? r + b : r;
};
/**
 * @see: <http://docs.python.org/library/functions.html#divmod>
 */
const divmod = function (a, b) {
    return { div: Math.floor(a / b), mod: pymod(a, b) };
};
/**
 * Python-like boolean
 * @return {Boolean} value of an object/primitive, taking into account
 * the fact that in Python an empty list's/tuple's
 * boolean value is False, whereas in JS it's true
 */
const plb = function (obj) {
    return obj instanceof Array && obj.length === 0 ? false : Boolean(obj);
};
/**
 * Return true if a value is in an array
 */
const contains = function (arr, val) {
    return arr.indexOf(val) !== -1;
};
export { range, repeat, split, pymod, divmod, plb, contains };
//# sourceMappingURL=helpers.js.map