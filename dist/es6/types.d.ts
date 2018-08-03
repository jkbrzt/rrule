import Weekday from './weekday';
import { IterArgs } from './iterresult';
export declare enum Frequency {
    YEARLY = 0,
    MONTHLY = 1,
    WEEKLY = 2,
    DAILY = 3,
    HOURLY = 4,
    MINUTELY = 5,
    SECONDLY = 6
}
export interface Options {
    freq: Frequency;
    dtstart: Date;
    interval: number;
    wkst: Weekday | number;
    count: number;
    until: Date;
    bysetpos: number | number[];
    bymonth: number | number[];
    bymonthday: number | number[];
    bynmonthday: number[];
    byyearday: number[];
    byweekno: number | number[];
    byweekday: ByWeekday | ByWeekday[];
    bynweekday: number[][];
    byhour: number | number[];
    byminute: number | number[];
    bysecond: number | number[];
    byeaster: number;
}
export interface ParsedOptions {
    freq: Frequency;
    dtstart: Date;
    interval: number;
    wkst: number;
    count: number;
    until: Date;
    bysetpos: number[];
    bymonth: number[];
    bymonthday: number[];
    bynmonthday: number[];
    byyearday: number[];
    byweekno: number[];
    byweekday: number[];
    bynweekday: number[][];
    byhour: number[];
    byminute: number[];
    bysecond: number[];
    byeaster: number;
}
export declare type CacheKeys = 'before' | 'after' | 'between';
declare type CacheBase = {
    [K in CacheKeys]: IterArgs[];
};
export declare type Cache = CacheBase & {
    all: Date[] | Partial<IterArgs>[] | false;
};
export declare const Days: {
    MO: Weekday;
    TU: Weekday;
    WE: Weekday;
    TH: Weekday;
    FR: Weekday;
    SA: Weekday;
    SU: Weekday;
};
export declare type WeekdayStr = keyof typeof Days;
export declare type ByWeekday = WeekdayStr | number | Weekday;
export {};
