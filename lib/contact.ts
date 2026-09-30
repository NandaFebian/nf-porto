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
