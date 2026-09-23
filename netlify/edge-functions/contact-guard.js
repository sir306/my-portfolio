// Server-side gate in front of Netlify Forms.
//
// Netlify records any POST carrying form-name=contact. It never enforces the form's
// `required` attributes (those only run in the browser), so bots posting straight to
// the site were creating blank submissions and blank notification emails.
//
// Edge functions run before Netlify Forms sees a request. A valid contact submission
// carries on to Netlify exactly as it arrived; anything else is answered here with
// the reasons and never reaches Forms. The contact form is the only form on this
// site, so every other POST is refused too. If another form is ever added, allow its
// form-name below.
import { CONTACT_FORM_NAME, HONEYPOT_FIELD, validateContact } from '../../utils/contactValidation.js'

// Far above the largest real submission (about 46 KB: 5000 characters of CJK text,
// percent-encoded), and small enough that parsing can't hit the edge function's CPU
// limit, which would skip this check entirely (see onError below).
const MAX_BODY_BYTES = 128 * 1024

const UNREADABLE = { form: "Your submission couldn't be read. Please send it from the form on the contact page." }

export default async (request, context) => {
  const raw = await request.arrayBuffer()
  if (raw.byteLength > MAX_BODY_BYTES) {
    return reject(request, { form: 'Your submission is too large to send. Please shorten your message.' }, 413)
  }

  let fields
  try {
    fields = await readFields(raw, request.headers.get('content-type') ?? '')
  } catch {
    return reject(request, UNREADABLE, 400)
  }

  // Exact matches only: guessing how Netlify reads "Contact" or "contact;name=" would
  // leave a way around this check.
  const formNames = fields.getAll('form-name')
  if (formNames.length === 0 || formNames.some((name) => name !== CONTACT_FORM_NAME)) {
    return reject(request, { form: "This site doesn't accept that form." }, 404)
  }

  // A browser sends each field once. Repeats are refused because Netlify could read a
  // different copy from the one checked here.
  if (['name', 'email', 'message', HONEYPOT_FIELD].some((field) => fields.getAll(field).length > 1)) {
    return reject(request, UNREADABLE, 400)
  }

  const errors = validateContact(Object.fromEntries(fields))
  if (Object.keys(errors).length > 0) return reject(request, errors)

  // Reading the body above used it up, so Netlify gets a fresh request with the same
  // bytes. Passing the original on would hand Forms an empty body.
  return context.next(new Request(request, { body: raw }))
}

export const config = {
  path: '/*',
  method: 'POST',
  // If this function ever fails to run, skip it rather than block real messages.
  onError: 'bypass',
}

async function readFields(raw, contentType) {
  if (contentType.toLowerCase().includes('multipart/form-data')) {
    return new Request('https://form.invalid/', { method: 'POST', headers: { 'content-type': contentType }, body: raw }).formData()
  }
  // Browsers send application/x-www-form-urlencoded. Bots often send no header or
  // text/plain, so read anything else as urlencoded too rather than let it slip past.
  return new URLSearchParams(new TextDecoder().decode(raw))
}

function reject(request, errors, status = 422) {
  const headers = { 'cache-control': 'no-store' }
  if (request.headers.get('accept')?.includes('application/json')) {
    return Response.json({ ok: false, errors }, { status, headers })
  }
  return new Response(errorPage(Object.values(errors)), {
    status,
    headers: { ...headers, 'content-type': 'text/html; charset=utf-8' },
  })
}

// Shown to visitors whose browser posted the form without running the page's script.
function errorPage(reasons) {
  const items = reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join('')
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Message not sent - Nick's Coding Website</title>
</head>
<body style="margin:0;background:#000;color:#fff;font-family:system-ui,sans-serif;line-height:1.6">
<main style="max-width:40rem;margin:0 auto;padding:4rem 1rem">
<h1>Your message wasn't sent</h1>
<p>Please fix the following and send it again:</p>
<ul>${items}</ul>
<p>Use your browser's back button to return to the form with your text still there, or <a href="/contactme/" style="color:#22d3ee">open a fresh form</a>.</p>
</main>
</body>
</html>`
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)
}
