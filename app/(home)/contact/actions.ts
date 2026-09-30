'use server';

import { headers } from 'next/headers';
import { contactSchema, createRateLimiter, type ContactField, type ContactState } from '@/lib/contact';

const allow = createRateLimiter(5, 10 * 60 * 1000);

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: String(formData.get('name') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
  };

  // Honeypot: the field is hidden from people, so a value means a bot. Pretend it worked.
  if (formData.get('website')) return { status: 'success' };

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      fieldErrors[field] ??= issue.message;
    }
    return { status: 'error', message: 'Check the highlighted fields.', fieldErrors, values };
  }

  const requestHeaders = await headers();
  const ip = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!allow(ip)) {
    return { status: 'error', message: 'Too many messages from this connection. Try again in 10 minutes.', values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error('Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not set.');
    return { status: 'error', message: 'The contact form is not connected yet, so nothing was sent.', values };
  }

  const { name, email, message } = parsed.data;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Resend only sends from verified domains; onboarding@resend.dev works for the account owner's inbox.
        from: process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `${message}\n\nFrom: ${name} <${email}>`,
      }),
    });
    if (!response.ok) {
      console.error('Contact form: Resend responded', response.status, await response.text());
      return { status: 'error', message: 'The message could not be sent. Try again in a moment.', values };
    }
  } catch (error) {
    console.error('Contact form: request to Resend failed', error);
    return { status: 'error', message: 'The message could not be sent. Try again in a moment.', values };
  }

  return { status: 'success' };
}
