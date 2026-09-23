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
    const errors = validateContact({ ...valid, name: '   ', message: '​ \n\t​' })
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

  test('rejects a message too short to reply to', () => {
    assert.match(validateContact({ ...valid, message: 'hi' }).message, /at least 10 characters/i)
  })

  test('rejects an over-long message and says how long it is', () => {
    assert.match(validateContact({ ...valid, message: 'a'.repeat(5001) }).message, /5001 characters/)
  })

  test('flags a filled-in honeypot as automated', () => {
    assert.match(validateContact({ ...valid, 'bot-field': 'http://spam.example' }).form, /automated/i)
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

  test('leaves POSTs for other forms untouched', async () => {
    const netlify = fakeNetlify()
    const response = await contactGuard(post('/', 'form-name=newsletter&email='), netlify)
    assert.equal(response.status, 200)
    assert.equal(await netlify.forwarded.text(), 'form-name=newsletter&email=')
  })
})
