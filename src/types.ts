import Weekday from './weekday'
import { IterArgs } from './iterresult'

export enum Frequency {
  YEARLY = 0,
  MONTHLY = 1,
  WEEKLY = 2,
  DAILY = 3,
  HOURLY = 4,
  MINUTELY = 5,
  SECONDLY = 6
}

export interface Options {
  freq: Frequency
  dtstart: Date | null
  interval: number
  wkst: Weekday | number | null
  count: number | null
  until: Date | null
  bysetpos: number | number[] | null
  bymonth: number | number[] | null
  bymonthday: number | number[] | null
  bynmonthday: number[] | null
  byyearday: number | number[] | null
  byweekno: number | number[] | null
  byweekday: ByWeekday | ByWeekday[] | null
  bynweekday: number[][] | null
  byhour: number | number[] | null
  byminute: number | number[] | null
  bysecond: number | number[] | null
  byeaster: number | null
}

export interface ParsedOptions extends Options {
  dtstart: Date
  wkst: number
  bysetpos: number[]
  bymonth: number[]
  bymonthday: number[]
  bynmonthday: number[]
  byyearday: number[]
  byweekno: number[]
  byweekday: number[]
  byhour: number[]
  byminute: number[]
  bysecond: number[]
}

export type CacheKeys = 'before' | 'after' | 'between'
type CacheBase = { [K in CacheKeys]: IterArgs[] }
export type Cache = CacheBase & { all: Date[] | Partial<IterArgs>[] | false }

export const Days = {
  MO: new Weekday(0),
  TU: new Weekday(1),
  WE: new Weekday(2),
  TH: new Weekday(3),
  FR: new Weekday(4),
  SA: new Weekday(5),
  SU: new Weekday(6)
}

export type WeekdayStr = keyof typeof Days
export type ByWeekday = WeekdayStr | number | Weekday
