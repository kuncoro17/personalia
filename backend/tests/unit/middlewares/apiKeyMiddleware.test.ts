import { afterEach, describe, expect, it, jest } from '@jest/globals';
import type { Context, Next } from 'hono';

import { apiKeyMiddleware } from '../../../src/middlewares/checkApiKey';

const originalApiKey = process.env.PERSONALIA_API_KEY;

const contextWithApiKey = (apiKey?: string) =>
  ({
    req: {
      header: jest.fn((name: string) =>
        name.toLowerCase() === 'x-api-key' ? apiKey : undefined
      ),
    },
  }) as unknown as Context;

afterEach(() => {
  process.env.PERSONALIA_API_KEY = originalApiKey;
});

describe('apiKeyMiddleware', () => {
  it('menolak request tanpa header x-api-key', async () => {
    process.env.PERSONALIA_API_KEY = 'test-api-key';

    await expect(
      apiKeyMiddleware(contextWithApiKey(), jest.fn() as Next)
    ).rejects.toThrow('API Key is required in header x-api-key');
  });

  it('menolak API key yang tidak sesuai', async () => {
    process.env.PERSONALIA_API_KEY = 'test-api-key';

    await expect(
      apiKeyMiddleware(contextWithApiKey('salah'), jest.fn() as Next)
    ).rejects.toThrow('Invalid API Key');
  });

  it('melanjutkan request dengan API key yang sesuai', async () => {
    process.env.PERSONALIA_API_KEY = 'test-api-key';
    const next = jest.fn() as Next;

    await apiKeyMiddleware(contextWithApiKey('test-api-key'), next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
