/*
Rate limited HTTP query iterator.

Copyright 2016 Robin Millette <http://robin.millette.info/>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the
[GNU Affero General Public License](LICENSE.md)
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict'

// npm
const defaults = require('lodash.defaults')

// own
const utils = require('rollodeqc-gh-utils')

const defaultMethods = {
  wait: utils.wait,
  nextLink: (result) => Promise.resolve(utils.links(result).next),
  getItems: (result) => result && result.items,
  updateItems: (result, inner) => {
    inner.items = result.items.concat(inner.items)
    return inner
  }
}

exports.bookworm = (query, fetcher, methods) => {
  methods = typeof methods === 'object'
    ? defaults(methods, defaultMethods)
    : defaultMethods

  return fetcher(query).then(function collect (result) {
    return new Promise((resolve, reject) => {
      methods.nextLink(result).then((next) => {
        if (next && methods.getItems(result)) {
          setTimeout(
            () => resolve(fetcher(next).then(collect).then((inner) =>
              methods.updateItems(result, inner))),
            methods.wait(result))
        } else {
          resolve(result)
        }
      })
    })
  })
}
