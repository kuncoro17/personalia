import { describe, expect, it, jest } from '@jest/globals';

import {
  PrsSeksiRepository,
  PrsSeksiService,
} from '../../../src/services/prsSeksiService';

const UUID = '9c627f45-14d5-4d79-add7-c045ba5281ea';

const createRepository = () =>
  ({
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findByKodeBagian: jest.fn(),
  }) as unknown as jest.Mocked<PrsSeksiRepository>;

const model = (data: Record<string, unknown>) =>
  ({ toJSON: jest.fn(() => data) }) as never;

describe('PrsSeksiService', () => {
  it('meratakan model Sequelize dan menormalkan kode null', async () => {
    const repository = createRepository();
    repository.findAll.mockResolvedValue([
      model({ sek_id: UUID, kode: null, nama_sek: 'Seksi Pendidikan' }),
    ]);
    const service = new PrsSeksiService(repository);

    await expect(service.getAll()).resolves.toEqual([
      { sek_id: UUID, kode: '', nama_sek: 'Seksi Pendidikan' },
    ]);
  });

  it('menolak ID yang bukan UUID sebelum mengakses repository', async () => {
    const repository = createRepository();
    const service = new PrsSeksiService(repository);

    await expect(service.getById('bukan-uuid')).rejects.toThrow(
      'Format ID tidak sesuai UUID'
    );
    expect(repository.findById).not.toHaveBeenCalled();
  });

  it('menolak nama seksi kosong saat create', async () => {
    const repository = createRepository();
    const service = new PrsSeksiService(repository);

    await expect(
      service.create({ kode: 'SDDK', nama_sek: '   ', alamat: '' })
    ).rejects.toThrow('Nama SEKSI wajib diisi');
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('menghapus seksi dengan UUID valid', async () => {
    const repository = createRepository();
    repository.delete.mockResolvedValue(true);
    const service = new PrsSeksiService(repository);

    await expect(service.delete(UUID)).resolves.toBe(true);
    expect(repository.delete).toHaveBeenCalledWith(UUID);
  });

  it('merapikan kode bagian sebelum pencarian', async () => {
    const repository = createRepository();
    repository.findByKodeBagian.mockResolvedValue([]);
    const service = new PrsSeksiService(repository);

    await service.getSeksiByKodeBagian('  BKE  ');

    expect(repository.findByKodeBagian).toHaveBeenCalledWith('BKE');
  });
});
