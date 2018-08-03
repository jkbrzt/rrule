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
  dtstart: Date
  interval: number
  wkst: Weekday | number
  count: number
  until: Date
  bysetpos: number | number[]
  bymonth: number | number[]
  bymonthday: number | number[]
  bynmonthday: number[]
  byyearday: number[]
  byweekno: number | number[]
  byweekday: ByWeekday | ByWeekday[]
  bynweekday: number[][]
  byhour: number | number[]
  byminute: number | number[]
  bysecond: number | number[]
  byeaster: number
}

export interface ParsedOptions {
  freq: Frequency
  dtstart: Date
  interval: number
  wkst: number
  count: number
  until: Date
  bysetpos: number[]
  bymonth: number[]
  bymonthday: number[]
  bynmonthday: number[]
  byyearday: number[]
  byweekno: number[]
  byweekday: number[]
  bynweekday: number[][]
  byhour: number[]
  byminute: number[]
  bysecond: number[]
  byeaster: number
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
