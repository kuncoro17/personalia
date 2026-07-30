import { describe, expect, it, jest } from '@jest/globals';

import {
  AbsensiBagianRepository,
  AbsensiServiceBagian,
} from '../../../src/services/AbsenServicesBagian';

const createRepository = () =>
  ({
    getAbsensiPivotBagian: jest.fn(),
  }) as jest.Mocked<AbsensiBagianRepository>;

describe('AbsensiServiceBagian', () => {
  it('meneruskan periode lintas bulan ke repository', async () => {
    const repository = createRepository();
    repository.getAbsensiPivotBagian.mockResolvedValue([]);
    const service = new AbsensiServiceBagian(repository);

    await service.getPivot('2025-01-16', '2025-02-15', 'BAGIAN', 'BKE');

    expect(repository.getAbsensiPivotBagian).toHaveBeenCalledWith(
      '2025-01-16',
      '2025-02-15',
      'BAGIAN',
      'BKE'
    );
  });

  it('menolak tanggal kalender yang tidak valid', async () => {
    const repository = createRepository();
    const service = new AbsensiServiceBagian(repository);

    await expect(
      service.getPivot('2025-02-30', '2025-03-15', 'BAGIAN', null)
    ).rejects.toThrow('Format tanggal harus YYYY-MM-DD');
    expect(repository.getAbsensiPivotBagian).not.toHaveBeenCalled();
  });

  it('menolak periode dengan tanggal mulai setelah tanggal selesai', async () => {
    const repository = createRepository();
    const service = new AbsensiServiceBagian(repository);

    await expect(
      service.getPivot('2025-02-16', '2025-02-15', 'BAGIAN', null)
    ).rejects.toThrow('Tanggal mulai tidak boleh melewati tanggal selesai');
    expect(repository.getAbsensiPivotBagian).not.toHaveBeenCalled();
  });

  it('menolak rentang pivot lebih dari 62 hari', async () => {
    const repository = createRepository();
    const service = new AbsensiServiceBagian(repository);

    await expect(
      service.getPivot('2025-01-01', '2025-03-04', 'BAGIAN', null)
    ).rejects.toThrow('Rentang tanggal maksimal 62 hari');
    expect(repository.getAbsensiPivotBagian).not.toHaveBeenCalled();
  });
});
