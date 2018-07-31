import { range, repeat } from './helpers';
// =============================================================================
// Date masks
// =============================================================================
// Every mask is 7 days longer to handle cross-year weekly periods.
const M365MASK = [].concat(repeat(1, 31), repeat(2, 28), repeat(3, 31), repeat(4, 30), repeat(5, 31), repeat(6, 30), repeat(7, 31), repeat(8, 31), repeat(9, 30), repeat(10, 31), repeat(11, 30), repeat(12, 31), repeat(1, 7));
const M366MASK = [].concat(repeat(1, 31), repeat(2, 29), repeat(3, 31), repeat(4, 30), repeat(5, 31), repeat(6, 30), repeat(7, 31), repeat(8, 31), repeat(9, 30), repeat(10, 31), repeat(11, 30), repeat(12, 31), repeat(1, 7));
let M28 = range(1, 29);
let M29 = range(1, 30);
let M30 = range(1, 31);
let M31 = range(1, 32);
const MDAY366MASK = [].concat(M31, M29, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
const MDAY365MASK = [].concat(M31, M28, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
M28 = range(-28, 0);
M29 = range(-29, 0);
M30 = range(-30, 0);
M31 = range(-31, 0);
const NMDAY366MASK = [].concat(M31, M29, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
const NMDAY365MASK = [].concat(M31, M28, M31, M30, M31, M30, M31, M31, M30, M31, M30, M31, M31.slice(0, 7));
const M366RANGE = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
const M365RANGE = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
const WDAYMASK = (function () {
    let wdaymask = [];
    for (let i = 0; i < 55; i++)
        wdaymask = wdaymask.concat(range(7));
    return wdaymask;
})();
export { WDAYMASK, M365MASK, M365RANGE, M366MASK, M366RANGE, MDAY365MASK, MDAY366MASK, NMDAY365MASK, NMDAY366MASK };
//# sourceMappingURL=masks.js.map