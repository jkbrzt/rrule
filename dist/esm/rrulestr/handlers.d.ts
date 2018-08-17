import { Options, Frequency } from '../types';
import { WeekdayStr } from '../weekday';
declare type FreqKey = keyof typeof Frequency;
declare type Handler = (rrkwargs: Partial<Options>, name: string, value: string | FreqKey | WeekdayStr) => void;
export declare function handle_DTSTART(rrkwargs: Partial<Options>, _: string, value: string): void;
export declare function handle_TZID(rrkwargs: Partial<Options>, _: string, value: string): void;
export declare function handle_int(rrkwargs: Partial<Options>, name: string, value: string): void;
export declare function handle_int_list(rrkwargs: Partial<Options>, name: string, value: string): void;
export declare function handle_FREQ(rrkwargs: Partial<Options>, _: string, value: FreqKey): void;
export declare function handle_UNTIL(rrkwargs: Partial<Options>, _: string, value: string): void;
export declare function handle_WKST(rrkwargs: Partial<Options>, _: string, value: WeekdayStr): void;
export declare function handle_BYWEEKDAY(rrkwargs: Partial<Options>, _: string, value: string): void;
export declare const handlers: {
    [key: string]: Handler;
};
export {};
