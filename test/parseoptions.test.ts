import { parseOptions } from '../src/parseoptions'
import { expect } from 'chai'

describe.only('TZID', () => {
  it('leaves null when null', () => {
    const options = parseOptions({ tzid: null })
    // tslint:disable-next-line:no-unused-expression
    expect(options.parsedOptions.tzid).to.be.null
  })

  it('uses a string when passed in', () => {
    const options = parseOptions({ tzid: 'America/Los_Angeles' })
    expect(options.parsedOptions.tzid).to.equal('America/Los_Angeles')
  })
})
