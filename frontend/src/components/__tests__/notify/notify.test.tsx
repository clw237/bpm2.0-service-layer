/** This file contains the test cases */
import { describe, expect, it, vi } from 'vitest';
import * as moduleExports from '../../notify';

vi.mock('kfone-component-library', () => ({
  kf1I18nString: vi.fn(() => 'tailwind alert'),
}));

describe('Module Exports', () => {
  it('exports Notify1 as C1', () => {
    expect(moduleExports.Notify1).toBeDefined();
    expect(moduleExports.Notify1).toBe(moduleExports.Notify1);
  });

  it('exports Notify2 as C2', () => {
    expect(moduleExports.Notify2).toBeDefined();
    expect(moduleExports.Notify2).toBe(moduleExports.Notify2);
  });
});
