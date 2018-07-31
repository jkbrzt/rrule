const WDAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
// =============================================================================
// Weekday
// =============================================================================
export default class Weekday {
    constructor(weekday, n) {
        if (n === 0)
            throw new Error("Can't create weekday with n == 0");
        this.weekday = weekday;
        this.n = n;
    }
    // __call__ - Cannot call the object directly, do it through
    // e.g. RRule.TH.nth(-1) instead,
    nth(n) {
        return this.n === n ? this : new Weekday(this.weekday, n);
    }
    // __eq__
    equals(other) {
        return this.weekday === other.weekday && this.n === other.n;
    }
    // __repr__
    toString() {
        let s = WDAYS[this.weekday];
        if (this.n)
            s = (this.n > 0 ? '+' : '') + String(this.n) + s;
        return s;
    }
    getJsWeekday() {
        return this.weekday === 6 ? 0 : this.weekday + 1;
    }
}
//# sourceMappingURL=weekday.js.map