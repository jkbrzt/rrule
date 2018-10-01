import { Options, ParsedOptions } from './types';
import dateutil from './dateutil';
export declare function initializeOptions(options: Partial<Options>): Partial<Options>;
export declare function parseOptions(options: Partial<Options>): {
    parsedOptions: ParsedOptions;
};
export declare function buildTimeset(opts: ParsedOptions): dateutil.Time[] | null;
