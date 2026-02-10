import '@jest/globals';

declare module '@jest/expect' {
  interface Matchers<R> {
    toBeValidDate(): R;
  }
}
