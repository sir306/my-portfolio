import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

import { validateContact } from '../utils/contactValidation.js'
import contactGuard, { config } from '../netlify/edge-functions/contact-guard.js'

const SITE = 'https://www.nickscoding.website'

const valid = {
  'form-name': 'contact',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'Hi Nick, I saw your crowd simulation work and would love to chat.',
  'bot-field': '',
}

function post(path, body, headers = {}) {
  return new Request(SITE + path, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', ...headers },
    body,
  })
}

// Stands in for Netlify: whatever the guard passes to next() is what Netlify Forms would receive.
function fakeNetlify() {
  const context = {
    forwarded: null,
    async next(request) {
      context.forwarded = request
      return new Response('recorded by Netlify Forms', { status: 200 })
    },
  }
  return context
}

describe('validateContact', () => {
  test('accepts a complete message', () => {
    assert.deepEqual(validateContact(valid), {})
  })

  test('gives a reason for every missing field on a blank submission', () => {
    const errors = validateContact({ 'form-name': 'contact' })
    assert.match(errors.name, /enter your name/i)
    assert.match(errors.email, /enter your email/i)
    assert.match(errors.message, /can't be empty/i)
  })

  test('treats whitespace and zero-width characters as empty', () => {
    const errors = validateContact({ ...valid, name: '   ', message: '\u200B \n\t\u200B' })
    assert.match(errors.name, /enter your name/i)
    assert.match(errors.message, /can't be empty/i)
  })

  test('rejects malformed email addresses', () => {
    for (const email of ['nick', 'nick@', 'nick@site', '@site.com', 'a b@site.com']) {
      assert.match(validateContact({ ...valid, email }).email ?? '', /doesn't look right/i, email)
    }
  })

  test('accepts ordinary real-world email addresses', () => {
    for (const email of ['first.last+tag@mail.example.co.nz', 'x@y.io', 'NICK@EXAMPLE.COM']) {
      assert.equal(validateContact({ ...valid, email }).email, undefined, email)
    }
  })

  test('rejects a one-character message', () => {
    assert.match(validateContact({ ...valid, message: 'k' }).message, /at least 2 characters/i)
  })

  test('accepts short but real messages', () => {
    for (const message of ['Hi', 'Call me', 'Hire you?']) {
      assert.equal(validateContact({ ...valid, message }).message, undefined, message)
    }
  })

  test('rejects an over-long message and says how long it is', () => {
    assert.match(validateContact({ ...valid, message: 'a'.repeat(5001) }).message, /5001 characters/)
  })

  test('flags a filled-in honeypot as automated and offers another way to get in touch', () => {
    const { form } = validateContact({ ...valid, 'bot-field': 'http://spam.example' })
    assert.match(form, /automated/i)
    assert.match(form, /LinkedIn/)
  })
})

describe('contact-guard edge function', () => {
  test('runs on every POST path and fails open if it crashes', () => {
    assert.equal(config.path, '/*')
    assert.equal(config.method, 'POST')
    assert.equal(config.onError, 'bypass')
  })

  test('stops a blank contact submission before it reaches Netlify Forms', async () => {
    const netlify = fakeNetlify()
    const response = await contactGuard(post('/contactmesuccess', 'form-name=contact'), netlify)
    assert.equal(response.status, 422)
    assert.equal(netlify.forwarded, null)
  })

  test('explains a rejection as uncached JSON to the page script', async () => {
    const request = post('/contactmesuccess', 'form-name=contact&name=&email=&message=', { accept: 'application/json' })
    const response = await contactGuard(request, fakeNetlify())
    assert.equal(response.headers.get('cache-control'), 'no-store')
    const body = await response.json()
    assert.equal(body.ok, false)
    assert.match(body.errors.message, /can't be empty/i)
  })

  test('explains a rejection as an HTML page to browsers without JavaScript', async () => {
    const request = post('/contactmesuccess', 'form-name=contact&name=Ada&email=bad&message=Hello+there+Nick', { accept: 'text/html' })
    const response = await contactGuard(request, fakeNetlify())
    assert.equal(response.status, 422)
    assert.match(response.headers.get('content-type'), /text\/html/)
    assert.match(await response.text(), /doesn(&#39;|')t look right/)
  })

  test('forwards a valid submission to Netlify Forms byte-for-byte', async () => {
    const body = new URLSearchParams(valid).toString()
    const netlify = fakeNetlify()
    const response = await contactGuard(post('/contactmesuccess', body), netlify)
    assert.equal(response.status, 200)
    assert.equal(netlify.forwarded.method, 'POST')
    assert.equal(netlify.forwarded.url, SITE + '/contactmesuccess')
    assert.equal(netlify.forwarded.headers.get('content-type'), 'application/x-www-form-urlencoded')
    assert.equal(await netlify.forwarded.text(), body)
  })

  test('stops blank multipart submissions', async () => {
    const form = new FormData()
    form.set('form-name', 'contact')
    const netlify = fakeNetlify()
    const response = await contactGuard(new Request(SITE + '/', { method: 'POST', body: form }), netlify)
    assert.equal(response.status, 422)
    assert.equal(netlify.forwarded, null)
  })

  test('forwards valid multipart submissions intact', async () => {
    const form = new FormData()
    for (const [key, value] of Object.entries(valid)) form.set(key, value)
    const original = new Request(SITE + '/', { method: 'POST', body: form })
    const expected = await original.clone().text()
    const netlify = fakeNetlify()
    await contactGuard(original, netlify)
    assert.equal(netlify.forwarded.headers.get('content-type'), original.headers.get('content-type'))
    assert.equal(await netlify.forwarded.text(), expected)
  })

  test("refuses a multipart body it can't read instead of passing it on", async () => {
    const request = new Request(SITE + '/', {
      method: 'POST',
      headers: { 'content-type': 'multipart/form-data; boundary=missing', accept: 'application/json' },
      body: 'form-name=contact',
    })
    const netlify = fakeNetlify()
    const response = await contactGuard(request, netlify)
    assert.equal(response.status, 400)
    assert.match((await response.json()).errors.form, /couldn't be read/i)
    assert.equal(netlify.forwarded, null)
  })

  test("stops blank submissions that don't declare a form content type", async () => {
    // A string body with no explicit header goes out as text/plain, as naive bot scripts send it.
    const netlify = fakeNetlify()
    const response = await contactGuard(new Request(SITE + '/', { method: 'POST', body: 'form-name=contact' }), netlify)
    assert.equal(response.status, 422)
    assert.equal(netlify.forwarded, null)
  })

  test('forwards non-ASCII messages byte-for-byte', async () => {
    const body = new URLSearchParams({ ...valid, name: 'Māui Tīpene', message: 'Kia ora Nick – loved Project Mobius! 🚀\nNgā mihi.' }).toString()
    const netlify = fakeNetlify()
    await contactGuard(post('/contactmesuccess/', body), netlify)
    assert.equal(await netlify.forwarded.text(), body)
  })

  test('accepts a repeated form-name when every copy is contact', async () => {
    const netlify = fakeNetlify()
    await contactGuard(post('/', 'form-name=contact&' + new URLSearchParams(valid).toString()), netlify)
    assert.notEqual(netlify.forwarded, null)
  })

  test('refuses POSTs for any other form, since contact is the only one', async () => {
    for (const body of ['form-name=newsletter&email=', 'name=&email=&message=', '']) {
      const netlify = fakeNetlify()
      const response = await contactGuard(post('/', body), netlify)
      assert.equal(response.status, 404, body)
      assert.equal(netlify.forwarded, null, body)
    }
  })

  test('refuses look-alike form names instead of guessing how Netlify reads them', async () => {
    for (const formName of ['form-name=Contact', 'form-name=contact%20', 'form-name=contact;name=', 'form-name=x&form-name=contact']) {
      const netlify = fakeNetlify()
      await contactGuard(post('/', formName), netlify)
      assert.equal(netlify.forwarded, null, formName)
    }
  })

  test('refuses repeated fields, which another parser could read differently', async () => {
    const body = 'form-name=contact&name=&name=Ada&email=ada%40example.com&message=Hello+there'
    const netlify = fakeNetlify()
    const response = await contactGuard(post('/', body), netlify)
    assert.equal(response.status, 400)
    assert.equal(netlify.forwarded, null)
  })

  test('reads the multipart content type case-insensitively', async () => {
    const form = new FormData()
    form.set('form-name', 'contact')
    const encoded = new Request(SITE + '/', { method: 'POST', body: form })
    const shouting = encoded.headers.get('content-type').replace('multipart/form-data', 'Multipart/Form-Data')
    const netlify = fakeNetlify()
    const response = await contactGuard(new Request(SITE + '/', { method: 'POST', headers: { 'content-type': shouting }, body: await encoded.arrayBuffer() }), netlify)
    assert.equal(response.status, 422)
    assert.equal(netlify.forwarded, null)
  })

  test('refuses oversized bodies before trying to parse them', async () => {
    const netlify = fakeNetlify()
    const response = await contactGuard(post('/', 'form-name=contact&message=' + 'a'.repeat(200_000)), netlify)
    assert.equal(response.status, 413)
    assert.equal(netlify.forwarded, null)
  })
})
