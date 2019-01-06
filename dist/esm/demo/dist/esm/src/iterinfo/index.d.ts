import { ParsedOptions, Frequency } from '../types';
import { YearInfo } from './yearinfo';
import { MonthInfo } from './monthinfo';
import { Time } from '../datetime';
export declare type DaySet = [(number | null)[], number, number];
export declare type GetDayset = () => DaySet;
export default class Iterinfo {
    private options;
    yearinfo: YearInfo;
    monthinfo: MonthInfo;
    eastermask: number[] | null;
    constructor(options: ParsedOptions);
    rebuild(year: number, month: number): void;
    readonly lastyear: number | null;
    readonly lastmonth: number | null;
    readonly yearlen: 366 | 365;
    readonly yearordinal: number;
    readonly mrange: number[];
    readonly wdaymask: number[];
    readonly mmask: number[];
    readonly wnomask: number[] | null;
    readonly nwdaymask: number[];
    readonly nextyearlen: 366 | 365;
    readonly mdaymask: number[];
    readonly nmdaymask: number[];
    ydayset(): (number | number[])[];
    mdayset(_: any, month: number, __: any): (number | (number | (number | null)[] | null)[])[];
    wdayset(year: number, month: number, day: number): (number | (number | (number | null)[] | null)[])[];
    ddayset(year: number, month: number, day: number): (number | (number | null)[])[];
    htimeset(hour: number, _: number, second: number, millisecond: number): Time[];
    mtimeset(hour: number, minute: number, _: number, millisecond: number): Time[];
    stimeset(hour: number, minute: number, second: number, millisecond: number): Time[];
    getdayset(freq: Frequency): (y: number, m: number, d: number) => DaySet;
    gettimeset(freq: Frequency.HOURLY | Frequency.MINUTELY | Frequency.SECONDLY): (h: number, m: number, s: number, ms: number) => Time[];
}
//# sourceMappingURL=index.d.ts.map