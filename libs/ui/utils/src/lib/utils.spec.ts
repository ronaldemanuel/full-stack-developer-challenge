import { cn } from './utils';

describe('utils', () => {
  it('should work', () => {
    expect(cn('rounded-lg', 'bg-blue-500')).toBe('rounded-lg bg-blue-500');
    expect(cn('rounded-lg', 'rounded', 'bg-blue-500')).toBe(
      'rounded bg-blue-500'
    );
  });
});
