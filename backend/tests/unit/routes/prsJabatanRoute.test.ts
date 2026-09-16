import { describe, expect, it, jest } from '@jest/globals';
import { OpenAPIHono } from '@hono/zod-openapi';
import { prsJabatanRoutes } from '../../../src/routes/prsJabatanRoute';
import { PrsJabatanRepository } from '../../../src/repositories/prsJabatanRepository';
import PrsJabatan from '../../../src/models/prsJabatan';

jest.mock('../../../src/middlewares/clerkAuth', () => ({
  clerkAuthMiddleware: async (...args: [unknown, () => Promise<void>]) =>
    args[1](),
}));

const app = new OpenAPIHono();
prsJabatanRoutes(app);

describe('master jabatan', () => {
  it('accepts the form payload through route validation and the service', async () => {
    const payload = { kode_jab: 'KS', jabatan: 'Kepala Seksi' };
    const create = jest
      .spyOn(PrsJabatanRepository.prototype, 'create')
      .mockResolvedValue(PrsJabatan.build(payload));
    const response = await app.request('/personalia/jabatan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    expect(response.status).toBe(201);
    expect(create).toHaveBeenCalledWith(payload);
    expect((await response.json()).data).toMatchObject(payload);
  });

  it('rejects empty form fields without writing to the repository', async () => {
    const create = jest.spyOn(PrsJabatanRepository.prototype, 'create');
    const response = await app.request('/personalia/jabatan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kode_jab: ' ', jabatan: '' }),
    });
    expect(response.status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });

  it('loads the complete master list without an implicit 50-row limit', async () => {
    const records = Array.from({ length: 51 }, (_, index) =>
      PrsJabatan.build({ kode_jab: String(index), jabatan: `Jabatan ${index}` })
    );
    const findAll = jest
      .spyOn(PrsJabatan, 'findAll')
      .mockResolvedValue(records);
    const response = await app.request('/personalia/jabatan/getall');
    expect(response.status).toBe(200);
    expect((await response.json()).data).toHaveLength(51);
    expect(findAll).toHaveBeenCalledWith({ order: [['created_at', 'DESC']] });
  });
});
