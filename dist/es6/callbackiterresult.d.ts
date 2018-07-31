import IterResult, { IterArgs } from './iterresult';
/**
 * IterResult subclass that calls a callback function on each add,
 * and stops iterating when the callback returns false.
 */
export default class CallbackIterResult extends IterResult {
    private iterator;
    constructor(method: string, args: Partial<IterArgs>, iterator: (d: Date, len: number) => boolean);
    add(date: Date): boolean;
}
