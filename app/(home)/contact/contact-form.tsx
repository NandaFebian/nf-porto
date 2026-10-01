'use client';

import { useActionState } from 'react';
import { cn } from '@/lib/cn';
import type { ContactField, ContactState } from '@/lib/contact';
import { sendContactMessage } from './actions';
import { Turnstile } from './turnstile';

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// fd-error is too light for small text on the light background.
const errorText = 'text-red-700 dark:text-red-400';

const fieldClass =
  'w-full rounded-md border bg-fd-background px-3 py-2.5 text-base outline-offset-0 aria-invalid:border-red-700 dark:aria-invalid:border-red-400';

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, { status: 'idle' } as ContactState);
  const errors = state.status === 'error' ? state.fieldErrors : undefined;
  const values = state.status === 'error' ? state.values : undefined;

  const fieldProps = (field: ContactField) => ({
    id: field,
    name: field,
    defaultValue: values?.[field],
    'aria-invalid': errors?.[field] ? true : undefined,
    'aria-describedby': errors?.[field] ? `${field}-error` : undefined,
  });

  const errorFor = (field: ContactField) =>
    errors?.[field] && (
      <p id={`${field}-error`} className={cn('text-sm', errorText)}>
        {errors[field]}
      </p>
    );

  return (
    <form action={action} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            {...fieldProps('name')}
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className={fieldClass}
          />
          {errorFor('name')}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            {...fieldProps('email')}
            type="email"
            autoComplete="email"
            placeholder="email@example.com"
            className={fieldClass}
          />
          {errorFor('email')}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          {...fieldProps('message')}
          rows={6}
          placeholder="The project, the role, or the question"
          className={cn(fieldClass, 'resize-y')}
        />
        {errorFor('message')}
      </div>

      {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} resetKey={state} />}

      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center rounded-md bg-brick px-5 text-sm font-medium text-brick-foreground transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97] disabled:opacity-60"
        >
          {pending ? 'Sending…' : 'Send message'}
        </button>
        <div aria-live="polite" className="text-sm">
          {state.status === 'success' && (
            <p key="success" className="status-in">
              Message sent. I&apos;ll reply to the email address you gave.
            </p>
          )}
          {state.status === 'error' && (
            <p key={state.message} className={cn('status-in', errorText)}>
              {state.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
