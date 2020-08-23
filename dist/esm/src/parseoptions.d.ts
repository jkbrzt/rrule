import { Options, ParsedOptions } from './types';
import { Weekday } from './weekday';
import { Time } from './datetime';
export declare function initializeOptions(options: Partial<Options>): {
    freq?: import("./types").Frequency | undefined;
    dtstart?: Date | null | undefined;
    interval?: number | undefined;
    wkst?: number | Weekday | null | undefined;
    count?: number | null | undefined;
    until?: Date | null | undefined;
    tzid?: string | null | undefined;
    bysetpos?: number | number[] | null | undefined;
    bymonth?: number | number[] | null | undefined;
    bymonthday?: number | number[] | null | undefined;
    bynmonthday?: number[] | null | undefined;
    byyearday?: number | number[] | null | undefined;
    byweekno?: number | number[] | null | undefined;
    byweekday?: number | Weekday | "MO" | "TU" | "WE" | "TH" | "FR" | "SA" | "SU" | import("./types").ByWeekday[] | null | undefined;
    bynweekday?: number[][] | null | undefined;
    byhour?: number | number[] | null | undefined;
    byminute?: number | number[] | null | undefined;
    bysecond?: number | number[] | null | undefined;
    byeaster?: number | null | undefined;
};
export declare function parseOptions(options: Partial<Options>): {
    parsedOptions: ParsedOptions;
};
export declare function buildTimeset(opts: ParsedOptions): Time[];
//# sourceMappingURL=parseoptions.d.ts.map