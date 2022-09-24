export const orThrow = <T>(fn: () => T, error?: Error) => {
  const results = fn();

  if (results == null) {
    throw error ?? new Error('Expected value to be defined');
  }

  return results;
};
