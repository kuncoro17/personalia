import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import app from '../../src/server';
import { PresensiService } from '../../src/services/servicephp';

const originalKey = process.env.PERSONALIA_API_KEY;
const testKey = 'test-shared-attendance-key';

beforeEach(() => {
  process.env.PERSONALIA_API_KEY = testKey;
});
afterEach(() => {
  if (originalKey === undefined) delete process.env.PERSONALIA_API_KEY;
  else process.env.PERSONALIA_API_KEY = originalKey;
});

describe('presensi API key matches pivotBagian', () => {
  it('accepts the shared API key without requiring a bearer token', async () => {
    const getLatest = jest
      .spyOn(PresensiService, 'getLatest')
      .mockResolvedValue({ success: true, data: [] });
    const response = await app.request('/presensi/latest?userid=0122024', {
      headers: { 'x-api-key': testKey },
    });
    expect(response.status).toBe(200);
    expect(getLatest).toHaveBeenCalledWith('0122024');
  });

  it.each([undefined, 'wrong-key'])(
    'rejects missing or invalid key %s on both routes',
    async key => {
      const getLatest = jest.spyOn(PresensiService, 'getLatest');
      const headers: Record<string, string> = key ? { 'x-api-key': key } : {};
      const expectedStatus = key ? 401 : 400;
      for (const path of [
        '/presensi/latest?userid=0122024',
        '/personalia/pivotBagian',
      ]) {
        const response = await app.request(path, { headers });
        expect(response.status).toBe(expectedStatus);
      }
      expect(getLatest).not.toHaveBeenCalled();
    }
  );

  it('retains bearer authentication on master endpoints', async () => {
    const response = await app.request('/personalia/jabatan/getall', {
      headers: { 'x-api-key': testKey },
    });
    expect(response.status).toBe(401);
  });

  it('documents API-key authentication in OpenAPI', async () => {
    const response = await app.request('/openapi.json');
    const document = await response.json();
    expect(document.paths['/presensi/latest'].get.security).toEqual([
      { apiKeyAuth: [] },
    ]);
  });
});
