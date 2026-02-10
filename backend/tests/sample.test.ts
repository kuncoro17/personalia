import { describe, it, expect } from '@jest/globals';

import { add, createDate } from '../src/sample';

describe('Sample Tests', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should test string operations', () => {
    const message = 'Hello World';
    expect(message).toContain('World');
    expect(message.toLowerCase()).toBe('hello world');
  });

  it('should test array operations', () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers).toHaveLength(5);
    expect(numbers).toContain(3);
    expect(numbers[0]).toBe(1);
  });

  it('should test object operations', () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    };

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name', 'John Doe');
    expect(user.email).toMatch(/.*@.*\..*/);
  });

  it('should test async operations', async () => {
    const asyncFunction = async () => {
      return new Promise(resolve => {
        setTimeout(() => resolve('async result'), 100);
      });
    };

    const result = await asyncFunction();
    expect(result).toBe('async result');
  });
  it('should add numbers correctly', () => {
    expect(add(1, 2)).toBe(3);
  });
  it('should return a valid date', () => {
    const date = createDate();
    expect(date).toBeInstanceOf(Date); // ✅ pastikan date adalah Date
    expect(date.getTime()).not.toBeNaN();
  });

  it('should test environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.LOG_LEVEL).toBe('silent');
  });
});

describe('Error Handling Tests', () => {
  it('should handle thrown errors', () => {
    const throwError = () => {
      throw new Error('Test error');
    };

    expect(throwError).toThrow('Test error');
    expect(throwError).toThrow(Error);
  });

  it('should handle async errors', async () => {
    const asyncError = async () => {
      throw new Error('Async error');
    };

    await expect(asyncError()).rejects.toThrow('Async error');
  });
});

describe('Mock Tests', () => {
  it('should test function mocking', () => {
    const mockFn = jest.fn();
    mockFn('arg1', 'arg2');

    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should test mock return values', () => {
    const mockFn = jest.fn();
    mockFn.mockReturnValue('mocked value');

    const result = mockFn();
    expect(result).toBe('mocked value');
  });
});
