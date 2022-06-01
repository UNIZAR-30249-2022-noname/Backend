export function Assert(condition: boolean, message: string) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
}