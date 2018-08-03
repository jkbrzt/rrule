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
    dtstart: Date | null;
    interval: number;
    wkst: Weekday | number | null;
    count: number | null;
    until: Date | null;
    bysetpos: number | number[] | null;
    bymonth: number | number[] | null;
    bymonthday: number | number[] | null;
    bynmonthday: number[] | null;
    byyearday: number | number[] | null;
    byweekno: number | number[] | null;
    byweekday: ByWeekday | ByWeekday[] | null;
    bynweekday: number[][] | null;
    byhour: number | number[] | null;
    byminute: number | number[] | null;
    bysecond: number | number[] | null;
    byeaster: number | null;
}
export interface ParsedOptions extends Options {
    dtstart: Date;
    wkst: number;
    bysetpos: number[];
    bymonth: number[];
    bymonthday: number[];
    bynmonthday: number[];
    byyearday: number[];
    byweekno: number[];
    byweekday: number[];
    byhour: number[];
    byminute: number[];
    bysecond: number[];
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
