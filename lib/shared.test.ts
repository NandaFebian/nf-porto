import { describe, expect, it } from 'vitest';
import { isPlaceholder } from './shared';

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
