import { Options, ParsedOptions } from './types';
import { Time } from './datetime';
export declare function initializeOptions(options: Partial<Options>): Partial<Options>;
export declare function parseOptions(options: Partial<Options>): {
    parsedOptions: ParsedOptions;
};
export declare function buildTimeset(opts: ParsedOptions): Time[];
//# sourceMappingURL=parseoptions.d.ts.map