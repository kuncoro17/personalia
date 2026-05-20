import { sequelize } from '../config/database';
import logger from '../utils/logger';

import AbsensiModelBagian from '../models/AbsensiModelBagian';
import AbsensiModels from '../models/AbsensiModels';
import AppLog from '../models/AppLog';
import HistoryModels from '../models/HistoryModels';
import PrsBagian from '../models/PrsBagian';
import PrsDivisi from '../models/PrsDivisi';
import PrsKaryawanModel from '../models/PrsKaryawanModel';
import PrsKeluargaKaryawan from '../models/PrsKeluargaKaryawan';
import PrsKontrak from '../models/PrsKontrak';
import PrsMasterAgama from '../models/PrsMasterAgama';
import PrsMasterAlamat from '../models/PrsMasterAlamat';
import PrsMasterDeputi from '../models/PrsMasterDeputi';
import PrsMasterDirektur from '../models/PrsMasterDirektur';
import PrsMasterKec from '../models/PrsMasterKec';
import PrsMasterKel from '../models/PrsMasterKel';
import PrsMasterKot from '../models/PrsMasterKot';
import PrsMasterMapel from '../models/PrsMasterMapel';
import PrsMasterProv from '../models/PrsMasterProv';
import PrsMasterRiwPendidikan from '../models/PrsMasterRiwPendidikan';
import PrsPengalamanKerja from '../models/PrsPengalamanKerja';
import PrsRiwPendidikanKar from '../models/PrsRiwPendidikanKar';
import PrsSeksi from '../models/PrsSeksi';
import PrsStatusKaryawan from '../models/PrsStatusKaryawan';
import PrsUnitKerja from '../models/PrsUnitKerja';
import PrsUnitKerjaKaryawan from '../models/PrsUnitKerjaKaryawan';
import { TransaksiLemburDetail } from '../models/TransaksiLemburDetail';
import KeuCgSlip from '../models/KeuCgSlip';
import MasterGroupBank from '../models/MasterGroupBank';
import MasterBankGiro from '../models/MasterBankGiro';
import prsDokumenModel from '../models/prsDokumenModel';
import prsJabatan from '../models/prsJabatan';
import prsJamMengajarKaryawan from '../models/prsJamMengajarKaryawan';
import prsKontakDarurat from '../models/prsKontakDarurat';
import prsTipeDokumenModel from '../models/prsTipeDokumenModel';
import userModel from '../models/userModel';

type SyncableModel = {
  name: string;
  sync: () => Promise<unknown>;
};

const SYNCABLE_MODELS: SyncableModel[] = [
  AbsensiModelBagian,
  AbsensiModels,
  AppLog,
  HistoryModels,
  PrsBagian,
  PrsDivisi,
  PrsKaryawanModel,
  PrsKeluargaKaryawan,
  PrsKontrak,
  PrsMasterAgama,
  PrsMasterAlamat,
  PrsMasterDeputi,
  PrsMasterDirektur,
  PrsMasterKec,
  PrsMasterKel,
  PrsMasterKot,
  PrsMasterMapel,
  PrsMasterProv,
  PrsMasterRiwPendidikan,
  PrsPengalamanKerja,
  PrsRiwPendidikanKar,
  PrsSeksi,
  PrsStatusKaryawan,
  PrsUnitKerja,
  PrsUnitKerjaKaryawan,
  TransaksiLemburDetail,
  KeuCgSlip,
  MasterGroupBank,
  MasterBankGiro,
  prsDokumenModel,
  prsJabatan,
  prsJamMengajarKaryawan,
  prsKontakDarurat,
  prsTipeDokumenModel,
  userModel,
];

const isTrue = (value?: string) => value?.toLowerCase() === 'true';
const isFalse = (value?: string) => value?.toLowerCase() === 'false';

export const shouldAutoSyncModels = (): boolean => {
  const flag = process.env.AUTO_SYNC_MODELS;
  if (isTrue(flag)) return true;
  if (isFalse(flag)) return false;
  return process.env.NODE_ENV !== 'production';
};

export const syncAllModels = async (): Promise<void> => {
  await sequelize.authenticate();

  let syncedCount = 0;
  for (const model of SYNCABLE_MODELS) {
    try {
      await model.sync();
      syncedCount += 1;
    } catch (err) {
      logger.warn({ err, model: model.name }, 'Model sync failed, skipping');
    }
  }

  logger.info(
    { syncedCount, totalModels: SYNCABLE_MODELS.length },
    'Model sync completed'
  );
};

export const maybeAutoSyncModels = async (): Promise<void> => {
  if (!shouldAutoSyncModels()) return;

  logger.info(
    'AUTO_SYNC_MODELS active. Synchronizing database tables for local usage.'
  );
  await syncAllModels();
};
