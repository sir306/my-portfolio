// Server-side gate in front of Netlify Forms.
//
// Netlify records any POST carrying form-name=contact. It never enforces the form's
// `required` attributes (those only run in the browser), so bots posting straight to
// the site were creating blank submissions and blank notification emails.
//
// Edge functions run before Netlify Forms sees a request. Invalid contact submissions
// are answered here with the reasons and never reach Forms; everything else carries on
// to Netlify exactly as it arrived.
import { CONTACT_FORM_NAME, validateContact } from '../../utils/contactValidation.js'

export default async (request, context) => {
  const raw = await request.arrayBuffer()

  let fields
  try {
    fields = await readFields(raw, request.headers.get('content-type') ?? '')
  } catch {
    return reject(request, { form: "Your submission couldn't be read. Please send it from the form on the contact page." }, 400)
  }

  if (fields.get('form-name') === CONTACT_FORM_NAME) {
    const errors = validateContact(Object.fromEntries(fields))
    if (Object.keys(errors).length > 0) return reject(request, errors)
  }

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
  if (contentType.includes('multipart/form-data')) {
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
