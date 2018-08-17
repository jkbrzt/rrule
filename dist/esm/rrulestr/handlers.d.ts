import { Frequency, ByWeekday } from '../types';
import { WeekdayStr, Weekday } from '../weekday';
declare type FreqKey = keyof typeof Frequency;
declare type Handler = (value: string | FreqKey | WeekdayStr) => string | Date | number | number[] | undefined | ByWeekday | ByWeekday[];
export declare function handle_DTSTART(value: string): Date;
export declare function handle_TZID(value: string): string | undefined;
export declare function handle_int(value: string): number;
export declare function handle_int_list(value: string): number[];
export declare function handle_FREQ(value: FreqKey): Frequency;
export declare function handle_UNTIL(value: string): Date;
export declare function handle_WKST(value: WeekdayStr): number;
export declare function handle_BYWEEKDAY(value: string): Weekday[];
export declare const handlers: {
    [key: string]: Handler;
};
export {};
