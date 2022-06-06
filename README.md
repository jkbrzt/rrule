# rrule demo
`gh-pages` branch is permenently diverged from other branches to just host the demo. This way the released `rrule` package will not include demo content, and won't depend on `jQuery`

## Steps to update demo
* In `package.json`, update version of `rrule` and version of the package to latest at https://www.npmjs.com/package/rrule
* Make any changes needed in `demo.ts` or `demo.ts` or `index.html`
* Run `yarn` then `yarn build`
* Commit changes (including changes in `dist` folder)
* Push/Merge changes to remote `gh-pages` and the demo page will be updated