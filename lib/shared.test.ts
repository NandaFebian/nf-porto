import { describe, expect, it } from 'vitest';
import { isPlaceholder, resolveSiteUrl } from './shared';

describe('isPlaceholder', () => {
  it('flags TODO values and example.com addresses', () => {
    expect(isPlaceholder('TODO: degree and major')).toBe(true);
    expect(isPlaceholder('https://github.com/TODO')).toBe(true);
    expect(isPlaceholder('todo@example.com')).toBe(true);
    expect(isPlaceholder('')).toBe(true);
  });

  it('keeps real values, including ones that mention a todo app', () => {
    expect(isPlaceholder('nanda@febian.dev')).toBe(false);
    expect(isPlaceholder('I built a todo app in Go.')).toBe(false);
  });
});

describe('resolveSiteUrl', () => {
  it('uses the production domain by default', () => {
    expect(resolveSiteUrl({})).toBe('https://nandafebian.my.id');
  });

  it('lets NEXT_PUBLIC_SITE_URL override it, dropping any path or trailing slash', () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'http://localhost:3200/' })).toBe('http://localhost:3200');
  });

  it('ignores an override that is not a full URL, like a bare https://', () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://' })).toBe('https://nandafebian.my.id');
  });
});
