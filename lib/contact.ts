import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name.').max(100, 'Keep your name under 100 characters.'),
  email: z.email('Enter a valid email address so I can reply.'),
  message: z
    .string()
    .trim()
    .min(10, 'Write at least 10 characters.')
    .max(5000, 'Keep the message under 5000 characters.'),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | {
      status: 'error';
      message: string;
      fieldErrors?: Partial<Record<ContactField, string>>;
      values?: Partial<Record<ContactField, string>>;
    };

/**
 * Checks a Turnstile token with Cloudflare. Tokens are single-use and expire after 300 seconds.
 * Returns false on any network or API failure, so a Cloudflare outage blocks sends instead of letting bots through.
 */
export async function verifyTurnstile(
  token: string,
  secret: string,
  ip?: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

/** Sliding-window limiter. In-memory, so each server instance counts separately. */
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    return true;
  };
}
