# rollodeqc-gh-bookworm
> Rate limited HTTP query iterator.

## Install
```
$ npm install --save rollodeqc-gh-bookworm
```

## Usage
```js
const rollodeqcGhBookworm = require('rollodeqc-gh-bookworm');

rollodeqcGhBookworm('unicorns', ghGot);
//=> (yet unspecified)
```

## API
### rollodeqcGhBookworm(query, fetcher[, methods])
Run fetcher(query) in a loop until done. Returns a promise.

#### query
Type: `string`|`object`

`string` values can represent a search query or a complete GitHub API URL
(beginning with http:// or https://).
Otherwise see the tests and source code if query is an `object`.

#### fetcher
Function to use to fetch information from GitHub. Must return a promise.

#### methods
##### wait
Lorem ipsum...

##### nextLink
Lorem ipsum...

##### getItems
Lorem ipsum...

##### updateItems
Lorem ipsum...

## Dependencies
* lodash.defaults
* rollodeqc-gh-utils

## License
AGPL-v3 © [Robin Millette](http://robin.millette.info)
