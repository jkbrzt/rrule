export default class Weekday {
    readonly weekday: number;
    readonly n?: number;
    constructor(weekday: number, n?: number);
    nth(n: number): Weekday;
    equals(other: Weekday): boolean;
    toString(): string;
    getJsWeekday(): number;
}
