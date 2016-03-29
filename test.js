/*eslint arrow-parens: [2, "as-needed"]*/

'use strict'
import test from 'ava'
import fn from './'

test('rate limit', async t => {
  const result = await fn()
  t.is(result.headers.statusCode, 200)
  t.is(result.rate.limit, 5000)
})
