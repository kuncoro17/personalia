import { Model, Op, Transaction, WhereOptions } from 'sequelize';

import { sequelize } from '../config/database';
import PrsUnitKerja from '../models/PrsUnitKerja';
import PrsUnitKerjaKaryawan from '../models/PrsUnitKerjaKaryawan';
import { BadRequestException } from '../utils/http-exception';

type OrganizationColumn = 'kode_divisi' | 'kode_bagian' | 'kode_seksi';

type DeleteOrganizationMasterOptions = {
  record: Model;
  code: string;
  column: OrganizationColumn;
  label: 'Divisi' | 'Bagian' | 'Seksi';
};

/**
 * Master organisasi selalu direferensikan oleh baris prs_unit_kerja yang
 * dibuat oleh layar master. Hapus relasi yang belum dipakai bersama master
 * dalam satu transaksi, tetapi pertahankan data yang sudah menjadi riwayat
 * penempatan karyawan.
 */
export const deleteOrganizationMaster = async ({
  record,
  code,
  column,
  label,
}: DeleteOrganizationMasterOptions): Promise<void> => {
  await sequelize.transaction(async (transaction: Transaction) => {
    const unitRows = await PrsUnitKerja.findAll({
      attributes: ['uk_id'],
      where: { [column]: code } as WhereOptions,
      transaction,
    });
    const unitIds = unitRows.map(unit => unit.getDataValue('uk_id'));

    if (unitIds.length > 0) {
      const assignmentCount = await PrsUnitKerjaKaryawan.count({
        where: { unit_kerja: { [Op.in]: unitIds } },
        transaction,
      });

      if (assignmentCount > 0) {
        throw new BadRequestException(
          `${label} tidak dapat dihapus karena masih digunakan pada penempatan karyawan`
        );
      }

      await PrsUnitKerja.destroy({
        where: { uk_id: { [Op.in]: unitIds } },
        transaction,
      });
    }

    await record.destroy({ force: true, transaction });
  });
};
