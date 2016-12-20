declare module __RRule {
  interface Frequency {}
  interface Day {}
  type integer = number;

  interface Options {
    freq: Frequency;
    dtstart?: Date;
    interval?: number;
    wkst?: Day | integer;
    count?: integer;
    until?: Date;
    bysetpos?: integer | integer[];
    bymonth?: integer | integer[];
    bymonthday?: integer | integer[];
    byyearday?: integer | integer[];
    byweekno?: integer | integer[];
    byweekday?: integer | integer[] | Day | Day[];
    byhour?: integer | integer[];
    byminute?: integer | integer[];
    bysecond?: integer | integer[];
  }

  interface Language {}

  interface Iterator {
    (date: Date, i: number): boolean;
  }

  module RRule {
    export let YEARLY: Frequency;
    export let MONTHLY: Frequency;
    export let WEEKLY: Frequency;
    export let DAILY: Frequency;
    export let HOURLY: Frequency;
    export let MINUTELY: Frequency;
    export let SECONDLY: Frequency;

    export let MO: Day;
    export let TU: Day;
    export let WE: Day;
    export let TH: Day;
    export let FR: Day;
    export let SA: Day;
    export let SU: Day;
  }

  class RRule {
    options: Options;
    origOptions: Options;
    constructor(options: Options, noCache?: boolean);
    all(iterator?: Iterator): Date[];
    between(after: Date, before: Date, inc?: boolean, iterator?: Iterator): Date[];
    before(dt: Date, inc?: boolean): Date;
    after(dt: Date, inc?: boolean): Date;
    toString(): string;
    static optionsToString(options: Options): string;
    static fromString(rfcString: string): RRule;
    static parseString(rfcString: string): Options;
    toText(gettext?: (token: string) => string, language?: Language): string;
    isFullyConvertibleToText(): boolean;
    static fromText(text: string, language?: Language): RRule;
    static parseText(text?: string, language?: Language): Options;
  }

  class RRuleSet {
    constructor(noCache?: boolean);
    rrule(rrule: RRule): any;
    rdate(dt: Date): any;
    exrule(rrule: RRule): any;
    exdate(dt: Date): any;
    all(iterator?: Iterator): Date[];
    between(after: Date, before: Date, inc?: boolean, iterator?: Iterator): Date[];
    before(dt: Date, inc?: boolean): Date;
    after(dt: Date, inc?: boolean): Date;
  }
}

declare module "rrule" {
  export = __RRule;
}
