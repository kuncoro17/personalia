import { config } from 'dotenv';
import 'jest';

// Load env
config({ path: '.env.test' });

process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';

// Mock console
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
beforeEach(() => jest.clearAllMocks());
afterEach(() => jest.restoreAllMocks());

// Extend Jest matchers globally using interface merging (modern)
// declare module '@jest/globals' {
//   interface Matchers<R> {
//     toBeValidDate(): R;
//   }
// }

// Global test setup hooks
beforeAll(async () => {
  // Setup test database connection if needed
});

afterAll(async () => {
  // Cleanup test database if needed
});

// Implement the custom matcher
expect.extend({
  toBeValidDate(received: unknown) {
    const pass = received instanceof Date && !isNaN(received.getTime());
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be a valid date`
          : `expected ${received} to be a valid date`,
    };
  },
});
