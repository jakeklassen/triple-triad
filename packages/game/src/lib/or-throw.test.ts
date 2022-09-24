import { describe, expect, it } from 'vitest';
import { orThrow } from './or-throw';

describe('orThrow', () => {
  it('should throw when value is null', () => {
    expect(() => orThrow(() => null)).toThrowError(
      'Expected value to be defined',
    );
  });

  it('should throw when value is undefined', () => {
    expect(() => orThrow(() => undefined)).toThrowError(
      'Expected value to be defined',
    );
  });

  it('should throw custom error when provided', () => {
    class UndefinedValueError extends Error {}

    expect(() =>
      orThrow(() => undefined, new UndefinedValueError()),
    ).toThrowError(UndefinedValueError);
  });

  it('should return value when value is defined', () => {
    expect(orThrow(() => 'foo')).toBe('foo');
  });
});
