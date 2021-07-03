import IterResult from './iterresult'
import RRule from './rrule'
import { DateWithZone } from './datewithzone'
import { iter } from './iter/index'
import { QueryMethodTypes, IteratorSetReturn } from './types'

type ItersetValue = {
  iterator: IterableIterator<Date>,
  key: Date,
  dataValue: Date | RRule
}

type KVPair<K, V> = { key: K, value: V };

function* arrayToIterator<T>(array: T[]): Generator<T, undefined> {
  for (const value of array) {
    yield value
  }

  return undefined
}

function sortedInsert<K, V>(array: KVPair<K, V>[], key: K, value: V) {
  let indexToInsertAt = 0;
  for (let i = 0; i < array.length; i++) {
    if (key < array[i].key) {
      break;
    }

    indexToInsertAt = i + 1;
  }

  array.splice(indexToInsertAt, 0, { key, value });
}


/**
 * Crates an iterator to generate an RRULESET / VEVENT
 *
 * Given multiple RDATEs, and RRULEs this iterator will generate events
 * in sorted order without materializing the entire set of data.
 *
 * @export
 * @template M
 * @param {IterResult<M>} iterResult
 * @param {RRule[]} _rrule
 * @param {RRule[]} _exrule
 * @param {Date[]} _rdate
 * @param {Date[]} _exdate
 * @param {(string | undefined)} tzid
 * @returns {(IterableIterator<[Date, RRule | Date]>)}
 */
export function* iterSet<M extends QueryMethodTypes>(
  iterResult: IterResult<M>,
  _rrule: RRule[],
  _exrule: RRule[],
  _rdate: Date[],
  _exdate: Date[],
  tzid: string | undefined
): IterableIterator<IteratorSetReturn> {
  const _exdateHash: { [k: number]: boolean } = {}
  const _accept = iterResult.accept

  function evalExdate(after: Date, before: Date) {
    for (const rrule of _exrule) {
      for (const date of rrule.between(after, before, true)) {
        _exdateHash[Number(date)] = true
      }
    }
  }

  _exdate.forEach(function (date) {
    const zonedDate = new DateWithZone(date, tzid).rezonedDate()
    _exdateHash[Number(zonedDate)] = true
  })

  iterResult.accept = function (date) {
    const dt = Number(date)
    if (isNaN(dt)) return _accept.call(this, date)
    if (!_exdateHash[dt]) {
      evalExdate(new Date(dt - 1), new Date(dt + 1))

      if (!_exdateHash[dt]) {
        _exdateHash[dt] = true
        return _accept.call(this, date)
      }
    }

    return false
  }

  if (iterResult.method === 'between') {
    evalExdate(iterResult.args.after!, iterResult.args.before!)
    iterResult.accept = function (date) {
      const dt = Number(date)
      if (!_exdateHash[dt]) {
        _exdateHash[dt] = true
        return _accept.call(this, date)
      }

      return false
    }
  }


  let iters: KVPair<number, ItersetValue>[] = [];

  const filteredRDate = _rdate.filter((date) => {
    const zonedDate = new DateWithZone(date, tzid).rezonedDate()
    return iterResult.accept(new Date(zonedDate.getTime()))
  })

  if (filteredRDate.length) {
    // Assumes that the array is already sorted
    const dateIterator = arrayToIterator<Date>(filteredRDate)
    let firstValueAccepted = dateIterator.next().value

    if (firstValueAccepted) {
      iters.push({
        key: firstValueAccepted.valueOf(),
        value: {
          iterator: dateIterator,
          key: firstValueAccepted,
          dataValue: firstValueAccepted
        }
      })
    }

  }

  for (const rrule of _rrule) {
    const rruleIterator = iter(iterResult, rrule.options)
    const firstValue = rruleIterator.next().value

    if (!firstValue) continue
    iters.push({
      key: firstValue.valueOf(),
      value: {
        iterator: rruleIterator,
        key: firstValue,
        dataValue: rrule
      }
    })
  }

  const isBefore = iterResult.method === 'before'
  const isAllOrBetween = iterResult.method === 'all' || iterResult.method === 'between'
  let lastResult: IteratorSetReturn | undefined

  let sortedIters = iters.sort((a, b) => a.key > b.key ? 1 : -1);

  while (sortedIters.length) {
    const firstElement = sortedIters.shift();

    if (!firstElement) return null;

    const {
      iterator,
      key,
      dataValue
    } = firstElement.value;

    // Yield the date with a reference to the RRule that generated it
    const result: IteratorSetReturn = [key, dataValue]

    if (isAllOrBetween) {
      yield result
    } else if (isBefore) {
      lastResult = result
    } else {
      yield result
      return
    }

    // Advance to the next date if it exists, otherwise drop it from the iters array
    const nextValue = iterator.next().value
    if (nextValue === undefined) continue


    sortedInsert(sortedIters, nextValue.valueOf(), {
      iterator: iterator,
      key: nextValue,
      dataValue: dataValue
    });
  }

  if (isBefore === true && lastResult !== undefined) {
    yield lastResult
  }
}
