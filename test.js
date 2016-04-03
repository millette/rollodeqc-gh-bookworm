/*eslint arrow-parens: [2, "as-needed"]*/
'use strict'
import ghGot from 'gh-got'
import test from 'ava'
import fn from './'

const pageTurner = g => {
  if (g === 'joe') { return Promise.resolve({ headers: { yes: 'sir, joe' } }) }
  return Promise.resolve({ items: [], headers: { link: { next: 'joe' }, yes: 'mam, ' + g } })
}

test('bookworm, a page turner', async t => {
  const methods = {
    nextLink: r => Promise.resolve(r && r.headers && r.headers.link && r.headers.link.next),
    getItems: r => r && r.items,
    updateItems: (result, inner) => {
      inner.items = result.items.concat(inner.items)
      return inner
    }
  }

/*
  const pageTurner = g => {
    if (g === 'joe') { return Promise.resolve({ headers: { yes: 'sir, joe' } }) }
    return Promise.resolve({ items: [], headers: { link: { next: 'joe' }, yes: 'mam, ' + g } })
  }
*/

  const result = await fn.bookworm('boo', pageTurner, methods)
  t.is(result.headers.yes, 'sir, joe')
})

test('bookworm, default methods', async t => {
/*
  const pageTurner = g => {
    if (g === 'joe') {
      return Promise.resolve({ headers: { yes: 'sir, joe' } })
    }
    return Promise.resolve({ items: [], headers: { link: { next: 'joe' }, yes: 'mam, ' + g } })
  }
*/

  const result = await fn.bookworm('boo', pageTurner, { nextLink: r =>
    Promise.resolve(r.headers && r.headers.link && r.headers.link.next)
  })
  t.is(result.headers.yes, 'sir, joe')
})

test('bookworm, ghGot', async t => {
  const methods = {
    wait: r => (r.headers && r.headers['x-ratelimit-reset'])
      ? (1000 * parseInt(r.headers['x-ratelimit-reset'], 10) - Date.now()) /
        parseInt(r.headers['x-ratelimit-remaining'], 10)
      : 2000,
    getItems: r => r && r.body && r.body.items,
    updateItems: (result, inner) => {
      inner.body.items = result.body.items.concat(inner.body.items)
      return inner
    }
  }
  const result = await fn.bookworm('search/users?q=bob&per_page=100', ghGot, methods)
  t.is(result.body.items.length, 1000)
})
