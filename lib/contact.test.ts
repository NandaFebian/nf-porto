import { describe, expect, it } from 'vitest';
import { contactSchema, createRateLimiter, verifyTurnstile } from './contact';

describe('verifyTurnstile', () => {
  const respond = (init: { ok?: boolean; json?: unknown; throws?: boolean }) =>
    (async (_url: string | URL | Request, options?: RequestInit) => {
      if (init.throws) throw new Error('network down');
      respond.lastBody = options?.body as URLSearchParams;
      return { ok: init.ok ?? true, json: async () => init.json } as Response;
    }) as typeof fetch;
  respond.lastBody = undefined as URLSearchParams | undefined;

  it('passes the token, secret, and IP to Cloudflare and accepts success', async () => {
    expect(await verifyTurnstile('tok', 'sec', '1.2.3.4', respond({ json: { success: true } }))).toBe(true);
    expect(respond.lastBody?.get('response')).toBe('tok');
    expect(respond.lastBody?.get('secret')).toBe('sec');
    expect(respond.lastBody?.get('remoteip')).toBe('1.2.3.4');
  });

  it('rejects a missing token, a failed check, an HTTP error, and a network error', async () => {
    const ok = respond({ json: { success: true } });
    expect(await verifyTurnstile('', 'sec', undefined, ok)).toBe(false);
    expect(await verifyTurnstile('tok', 'sec', undefined, respond({ json: { success: false } }))).toBe(false);
    expect(await verifyTurnstile('tok', 'sec', undefined, respond({ ok: false }))).toBe(false);
    expect(await verifyTurnstile('tok', 'sec', undefined, respond({ throws: true }))).toBe(false);
  });
});

describe('contactSchema', () => {
  it('accepts a valid message and trims whitespace', () => {
    const result = contactSchema.parse({
      name: '  Ana ',
      email: 'ana@example.com',
      message: 'Hello, is this still open?',
    });
    expect(result.name).toBe('Ana');
  });

  it('reports each invalid field', () => {
    const result = contactSchema.safeParse({ name: ' ', email: 'nope', message: 'short' });
    expect(result.success).toBe(false);
    const fields = result.error?.issues.map((issue) => issue.path[0]);
    expect(fields).toEqual(['name', 'email', 'message']);
  });
});

describe('createRateLimiter', () => {
  it('blocks after the limit and frees up once the window passes', () => {
    const allow = createRateLimiter(2, 1000);
    expect(allow('ip', 0)).toBe(true);
    expect(allow('ip', 100)).toBe(true);
    expect(allow('ip', 200)).toBe(false);
    expect(allow('other', 200)).toBe(true);
    expect(allow('ip', 1100)).toBe(true);
  });
});
