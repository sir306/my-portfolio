// Contact form rules, shared by pages/contactme.vue (instant feedback in the browser)
// and netlify/edge-functions/contact-guard.js (enforced on the server, because bots
// skip the browser and POST straight to Netlify Forms).

export const CONTACT_FORM_NAME = 'contact'
export const HONEYPOT_FIELD = 'bot-field'

export const LIMITS = {
  name: 100,
  email: 254,
  messageMin: 10,
  messageMax: 5000,
}

// Deliberately loose (something@something.tld): rejecting a real address costs a
// real message, while an odd-but-wrong one just means the reply bounces.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/

// trim() keeps zero-width characters, which would otherwise pass as a message.
const INVISIBLE = /[​-‍⁠﻿]/g

function clean(value) {
  return typeof value === 'string' ? value.replace(INVISIBLE, '').trim() : ''
}

// Returns { field: reason } for each problem, or {} when the submission is valid.
export function validateContact(fields) {
  const errors = {}
  const name = clean(fields.name)
  const email = clean(fields.email)
  const message = clean(fields.message)

  if (clean(fields[HONEYPOT_FIELD])) {
    errors.form = "This looks like an automated submission (a hidden anti-spam field was filled in). If you're a person, please reload the page and try again."
  }

  if (!name) {
    errors.name = 'Please enter your name.'
  } else if (name.length > LIMITS.name) {
    errors.name = `Your name is too long. Please keep it to ${LIMITS.name} characters or fewer.`
  }

  if (!email) {
    errors.email = 'Please enter your email address so I can reply.'
  } else if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = "That email address doesn't look right. Please check it (for example: you@example.com)."
  }

  if (!message) {
    errors.message = "Please write a message. It can't be empty."
  } else if (message.length < LIMITS.messageMin) {
    errors.message = `Your message is too short. Please write at least ${LIMITS.messageMin} characters.`
  } else if (message.length > LIMITS.messageMax) {
    errors.message = `Your message is too long (${message.length} characters). Please keep it to ${LIMITS.messageMax} or fewer.`
  }

  return errors
}
