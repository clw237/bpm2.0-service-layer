import { describe, expect, it } from 'vitest';
import { classNames, isString } from '../helper';

describe('classNames', () => {
  it('should join multiple class names into a single string', () => {
    const result = classNames('class1', 'class2', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should filter out falsy values', () => {
    const result = classNames('class1', null, 'class2', undefined, '', 'class3');
    expect(result).toBe('class1 class2 class3');
  });

  it('should return an empty string if no valid class names are provided', () => {
    const result = classNames(null, undefined, '', false, 0);
    expect(result).toBe('');
  });

  it('should handle an empty input', () => {
    const result = classNames();
    expect(result).toBe('');
  });
});

describe('isString', () => {
  it('should return true for strings', () => {
    expect(isString('test')).toBe(true);
  });

  it('should return false for non-strings', () => {
    expect(isString(123)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
  });
});
