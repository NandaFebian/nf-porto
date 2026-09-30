import { describe, expect, it } from 'vitest';
import { contactSchema, createRateLimiter } from './contact';

describe('contactSchema', () => {
  it('accepts a valid message and trims whitespace', () => {
    const result = contactSchema.parse({ name: '  Ana ', email: 'ana@example.com', message: 'Hello, is this still open?' });
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
