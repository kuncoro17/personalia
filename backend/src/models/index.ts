import PrsKaryawan from './PrsKaryawanModel';
import PrsKeluargaKaryawan from './PrsKeluargaKaryawan';
import PrsMasterAgama from './PrsMasterAgama';
import PrsMasterAlamat from './PrsMasterAlamat';
import PrsStatusKaryawan from './PrsStatusKaryawan';
import PrsUnitKerja from './PrsUnitKerja';
import PrsUnitKerjaKaryawan from './PrsUnitKerjaKaryawan';
import PrsJamMengajarKaryawan from './prsJamMengajarKaryawan';
import PrsMasterMapel from './PrsMasterMapel';
import PrsKontrak from './PrsKontrak';
import PrsDivisi from './PrsDivisi';
import PrsBagian from './PrsBagian';
import PrsSeksi from './PrsSeksi';
import PrsRiwPendidikanKar from './PrsRiwPendidikanKar';
import PrsMasterRiwPendidikan from './PrsMasterRiwPendidikan';
import PrsKontakDarurat from './prsKontakDarurat';
import PrsDokumen from './prsDokumenModel';
import PrsTipeDokumen from './prsTipeDokumenModel';
import PrsJabatan from './prsJabatan';
import PrsMasterDeputi from './PrsMasterDeputi';
import PrsMasterDirektur from './PrsMasterDirektur';
import PrsMasterKel from './PrsMasterKel';
import PrsMasterKec from './PrsMasterKec';
import PrsMasterKot from './PrsMasterKot';
import PrsMasterProv from './PrsMasterProv';
import PrsMasterSetempat from './PrsMasterSetempat';
import History from './HistoryModels';
import MasterGroupBank from './MasterGroupBank';
import MasterBankGiro from './MasterBankGiro';

// 1 Karyawan memiliki banyak Keluarga

// Karyawan - Keluarga
PrsKaryawan.hasMany(PrsKeluargaKaryawan, {
  foreignKey: 'karyawan_id',
  sourceKey: 'id_karyawan',
  as: 'keluarga_karyawan', // penting!
});

PrsKeluargaKaryawan.belongsTo(PrsKaryawan, {
  foreignKey: 'karyawan_id',
  targetKey: 'id_karyawan',
  as: 'karyawan',
});

PrsMasterKot.hasMany(PrsKeluargaKaryawan, {
  foreignKey: 'tempat_lahir',
  sourceKey: 'id',
  as: 'tempat_lahir_keluarga',
});

PrsKeluargaKaryawan.belongsTo(PrsMasterKot, {
  foreignKey: 'tempat_lahir',
  targetKey: 'id',
  as: 'tempat_lahir_detail',
});

// PrsMasterAlamat punya banyak karyawan
PrsMasterAlamat.hasMany(PrsKaryawan, {
  foreignKey: 'alamat_tempat_tinggal',
  sourceKey: 'id',
  as: 'karyawans_alamat', // alias bebas, opsional
});

// Karyawan milik satu alamat
PrsKaryawan.belongsTo(PrsMasterAlamat, {
  foreignKey: 'alamat_tempat_tinggal',
  targetKey: 'id',
  as: 'alamat_tempat_tinggal_detail',
});

// === Relasi ke alamat KTP ===
PrsKaryawan.belongsTo(PrsMasterAlamat, {
  foreignKey: 'alamat_ktp',
  targetKey: 'id',
  as: 'alamat_ktp_detail',
});

// Karyawan - Master Agama
PrsKaryawan.belongsTo(PrsMasterAgama, {
  foreignKey: 'agama',
  targetKey: 'kode_agama',
  as: 'agama_detail',
});

PrsMasterAgama.hasMany(PrsKaryawan, {
  foreignKey: 'agama',
  sourceKey: 'kode_agama',
});

// Keluarga - Master Agama
PrsKeluargaKaryawan.belongsTo(PrsMasterAgama, {
  foreignKey: 'agama',
  targetKey: 'kode_agama',
  as: 'agama_detail',
});

// Master Group Bank - Master Bank Giro
MasterGroupBank.hasMany(MasterBankGiro, {
  foreignKey: 'id_group_bank',
  sourceKey: 'id',
  as: 'bank_giro_list',
});

MasterBankGiro.belongsTo(MasterGroupBank, {
  foreignKey: 'id_group_bank',
  targetKey: 'id',
  as: 'group_bank_detail',
});

PrsStatusKaryawan.hasMany(PrsKaryawan, {
  foreignKey: 'kode_status_karyawan', // FK di prs_karyawan
  sourceKey: 'kode', // PK di prs_master_alamat
  as: 'karyawans', // alias opsional
});

PrsKaryawan.belongsTo(PrsStatusKaryawan, {
  foreignKey: 'kode_status_karyawan', // field di tabel prs_karyawan
  targetKey: 'kode', // field di tabel prs_master_alamat
  as: 'status_karyawan', // alias
});

// Karyawan - Master Setempat
PrsMasterSetempat.hasMany(PrsKaryawan, {
  foreignKey: 'id_master_setempat',
  sourceKey: 'id',
  as: 'karyawans_setempat',
});

PrsKaryawan.belongsTo(PrsMasterSetempat, {
  foreignKey: 'id_master_setempat',
  targetKey: 'id',
  as: 'master_setempat',
});

PrsKaryawan.hasMany(PrsUnitKerjaKaryawan, {
  foreignKey: 'karyawan_id',
  as: 'unit_kerja_karyawan',
});

// ✅ Unit kerja karyawan milik satu unit kerja
PrsUnitKerjaKaryawan.belongsTo(PrsUnitKerja, {
  foreignKey: 'unit_kerja',
  targetKey: 'uk_id',
  as: 'unit_kerja_detail',
});

// 1. PrsKaryawan -> PrsUnitKerjaKaryawan

PrsUnitKerjaKaryawan.belongsTo(PrsKaryawan, {
  foreignKey: 'karyawan_id',
  targetKey: 'id_karyawan',
  as: 'karyawan',
});

// 2. PrsUnitKerjaKaryawan -> PrsJamMengajarKaryawan
PrsUnitKerjaKaryawan.hasMany(PrsJamMengajarKaryawan, {
  foreignKey: 'ukk_id',
  sourceKey: 'ukk_id',
  as: 'jam_mengajar',
});
PrsJamMengajarKaryawan.belongsTo(PrsUnitKerjaKaryawan, {
  foreignKey: 'ukk_id',
  targetKey: 'ukk_id',
  as: 'unit_kerja_karyawan',
});

// 3. PrsJamMengajarKaryawan -> PrsMasterMapel
PrsJamMengajarKaryawan.belongsTo(PrsMasterMapel, {
  foreignKey: 'mengajar_mapel',
  targetKey: 'mapel_id',
  as: 'mapel',
});

PrsUnitKerjaKaryawan.hasMany(PrsKontrak, {
  foreignKey: 'ukk_id',
  as: 'kontrak',
});
PrsKontrak.belongsTo(PrsUnitKerjaKaryawan, {
  foreignKey: 'ukk_id',
  as: 'unit_kerja_karyawan',
});

PrsKaryawan.hasMany(PrsRiwPendidikanKar, {
  foreignKey: 'karyawan_id',
  as: 'pendidikan',
});

// Riwayat pendidikan milik satu karyawan
PrsRiwPendidikanKar.belongsTo(PrsKaryawan, {
  foreignKey: 'karyawan_id',
});

// Relasi ke tabel master pendidikan
PrsRiwPendidikanKar.belongsTo(PrsMasterRiwPendidikan, {
  foreignKey: 'riw_pendidikan_id',
  as: 'jenjang',
});
PrsKaryawan.hasMany(PrsKontakDarurat, {
  foreignKey: 'karyawan_id',
  as: 'kontak_darurat',
});

PrsKontakDarurat.belongsTo(PrsKaryawan, {
  foreignKey: 'karyawan_id',
  as: 'karyawan',
});

// Bagian

PrsDokumen.belongsTo(PrsKaryawan, {
  foreignKey: 'karyawan_id',
  as: 'karyawan',
});

PrsKaryawan.hasMany(PrsDokumen, {
  foreignKey: 'karyawan_id',
  as: 'dokumen',
});

PrsDokumen.belongsTo(PrsTipeDokumen, {
  foreignKey: 'tipe_dokumen_id',
  as: 'tipe_dokumen',
});

PrsTipeDokumen.hasMany(PrsDokumen, {
  foreignKey: 'tipe_dokumen_id',
  as: 'dokumen',
});

PrsUnitKerjaKaryawan.belongsTo(PrsJabatan, {
  foreignKey: 'jab_id', // kolom di unit_kerja_karyawan
  targetKey: 'kode_jab', // kolom di prs_jabatan
  as: 'jabatan',
});
// PrsJabatan.hasMany(PrsUnitKerjaKaryawan, {
//   foreignKey: 'jab_id',
//   sourceKey: 'kode_jab',
//   as: 'unit_kerja_karyawan',
// });

// 🔹 Relasi Karyawan → Unit Kerja Karyawan

// 🔹 Relasi Unit Kerja Karyawan → Unit Kerja

PrsUnitKerja.hasMany(PrsUnitKerjaKaryawan, {
  foreignKey: 'unit_kerja',
  sourceKey: 'uk_id',
  as: 'unit_kerja_karyawan',
});

// 🔹 Relasi Unit Kerja → Direktur / Deputi / Divisi / Bagian / Seksi
PrsUnitKerja.belongsTo(PrsMasterDirektur, {
  foreignKey: 'kode_direktur',
  targetKey: 'kode',
  as: 'direktur',
});

PrsUnitKerja.belongsTo(PrsMasterDeputi, {
  foreignKey: 'kode_deputi',
  targetKey: 'kode',
  as: 'deputi',
});

PrsUnitKerja.belongsTo(PrsDivisi, {
  foreignKey: 'kode_divisi',
  targetKey: 'kode',
  as: 'divisi',
});
//kode_bagian
PrsBagian.hasMany(PrsUnitKerja, {
  foreignKey: 'kode_bagian',
  sourceKey: 'kode',
  as: 'unit_kerja',
});
PrsUnitKerja.belongsTo(PrsBagian, {
  foreignKey: 'kode_bagian',
  targetKey: 'kode',
  as: 'bagian',
});
//kode_seksi
PrsSeksi.hasMany(PrsUnitKerja, {
  foreignKey: 'kode_seksi',
  sourceKey: 'kode',
  as: 'unit_kerja',
});
PrsUnitKerja.belongsTo(PrsSeksi, {
  foreignKey: 'kode_seksi',
  targetKey: 'kode',
  as: 'seksi',
});

// models/PrsMasterProv.ts
PrsMasterProv.hasMany(PrsMasterKot, {
  foreignKey: 'prov_id',
  as: 'kota',
});

// models/PrsMasterKot.ts
PrsMasterKot.belongsTo(PrsMasterProv, {
  foreignKey: 'prov_id',
  as: 'provinsi',
});

PrsMasterKot.hasMany(PrsMasterKec, {
  foreignKey: 'kot_id',
  as: 'kecamatan',
});

// models/PrsMasterKec.ts
PrsMasterKec.belongsTo(PrsMasterKot, {
  foreignKey: 'kot_id',
  as: 'kota',
});

PrsMasterKec.hasMany(PrsMasterKel, {
  foreignKey: 'kec_id',
  as: 'kelurahan',
});

// models/PrsMasterKel.ts
PrsMasterKel.belongsTo(PrsMasterKec, {
  foreignKey: 'kec_id',
  as: 'kecamatan',
});

PrsMasterKel.hasMany(PrsMasterAlamat, {
  foreignKey: 'kel_id',
  as: 'alamat',
});

// models/PrsMasterAlamat.ts
PrsMasterAlamat.belongsTo(PrsMasterKel, {
  foreignKey: 'kel_id',
  as: 'kelurahan',
});
History.belongsTo(PrsKaryawan, {
  foreignKey: 'id_karyawan',
  as: 'history',
});

PrsKaryawan.hasMany(History, {
  foreignKey: 'id_karyawan',
  as: 'history', // sama!
});

export {
  PrsKaryawan,
  PrsKeluargaKaryawan,
  PrsMasterAgama,
  PrsMasterAlamat,
  PrsStatusKaryawan,
  PrsUnitKerja,
  PrsUnitKerjaKaryawan,
  PrsJamMengajarKaryawan,
  PrsMasterMapel,
  PrsKontrak,
  PrsKontakDarurat,
  PrsDokumen,
  PrsTipeDokumen,
  PrsJabatan,
  PrsBagian,
  PrsDivisi,
  PrsMasterDirektur,
  PrsMasterDeputi,
  PrsMasterKel,
  PrsMasterKec,
  PrsMasterKot,
  PrsMasterProv,
  PrsMasterSetempat,
  History,
};
