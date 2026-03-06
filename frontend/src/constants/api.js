export const DETAILENDPOINT = {
  get: {
    profile: (employeeId) => `personalia/karyawan/employee/by-id/${employeeId}`,
    location: (employeeId) =>
      `personalia/karyawan/unitkerja_karyawan/${employeeId}`,
    contract: (employeeId) =>
      `personalia/karyawan/unitkerja_karyawan/${employeeId}`,
    address: (employeeId) =>
      `personalia/karyawan/alamat-lengkap/by-id/${employeeId}`,
    education: (employeeId) =>
      `personalia/karyawan/detail-pendidikan/${employeeId}`,
    emergencyContact: (employeeId) =>
      `personalia/karyawan/kontak-darurat/by-id/${employeeId}`,
    additional: (employeeId) =>
      `personalia/karyawan/getKaryawanAdditionalById/${employeeId}`,
    family: (employeeId) => `personalia/karyawan/keluarga/${employeeId}`,
    salary: (employeeId) => `personalia/karyawan/InfoPenggajian/${employeeId}`,
  },
  update: {
    profile: (employeeId) =>
      `personalia/karyawan/employee/profile/${employeeId}`,
    contract: (contractId) => `personalia/kontrak/${contractId}`,
    profileUnitKerja: (employeeId) =>
      `unit-kerja-karyawan/jabatan/${employeeId}`,
    location: (ukkId) => `unit-kerja-karyawan/${ukkId}`,
    locationMapel: (employeeId, ukkId) =>
      `personalia/jam_mengajar/update_mapel/${employeeId}/${ukkId}`,
    address: (employeeId) =>
      `personalia/karyawan/update_alamat_karyawan/${employeeId}`,
    education: (employeeId, eduId) =>
      `riw-pendidikan-kar/pendidikan/${employeeId}/${eduId}`,
    emergencyContact: (employeeId, contactID) =>
      `personalia/karyawan/kontak-darurat/${employeeId}/${contactID}`,
    additional: (employeeId) => `personalia/karyawan/additional/${employeeId}`,
    family: (employeeId, familyId) =>
      `personalia/karyawan/update-keluarga/${employeeId}/${familyId}`,
    salary: (employeeId) => `personalia/karyawan/InfoPenggajian/${employeeId}`,
  },
  create: {
    contract: () => `personalia/kontrak`,
    location: () => `unit-kerja-karyawan/created`,
    education: () => `riw-pendidikan-kar`,
    family: () => `personalia/keluarga`,
    address: (employeeId) => `master-alamat/create/${employeeId}/alamat`,
  },
};

export const MASTERENDPOINT = {
  kelurahan: (params) => `master-kelurahan/ByKecamatan/${params}`,
  kecamatan: (params) => `master-kecamatan/kecamatan_kota/${params}`,
  kota: (params) => `master-kota/prov/${params}`,
  allKota: `master-kota/GetAllKota`,
  provinsi: `master-provinsi`,

  lokasiKerja: "unit-kerja/getllUnitKerja",

  mapel: `master-mapel/GetAllMapel`,
  statusKaryawan: `status-karyawan`,
  agama: `master-agama`,
  jabatan: `personalia/jabatan/getall`,

  universitas: "riwayat-pendidikan",

  divisi: `personalia/divisi`,
  bagian: (params) => `personalia/bagian/divisi/${params}`,
  seksi: (params) => `seksi/bagian/${params}`,
};

export const EMPLOYEEENDPOINT = {
  getAll: (page, limit) =>
    `personalia/karyawan/employee?page=${page}&limit=${limit}`,
  search: (search, page) =>
    `personalia/karyawan/search?nama_lengkap=${search}${page ? `&${page}` : ""}`,
  joinToday: `personalia/karyawan/join-today`,
};

export const LETTERENDPOINT = {
  ttp: (employeeId) => `ttp/${employeeId}`,
  kwt: (employeeId) => `kwt/${employeeId}`,
  tkl: (employeeId) => `tkl/${employeeId}`,
  wtt: (employeeId) => `wtt/${employeeId}`,
  bipartit: (employeeId) => `bipartit/${employeeId}`,
  cutiPanjang: (employeeId) => `CutiPanjang/${employeeId}`,
  suratPHKById: (employeeId) => `SuratPHKById/${employeeId}`,
  suratPHK: `SuratPHK`,
  cutiDiluarTanggungan: (employeeId) => `CutiDiluarTanggungan/${employeeId}`,
};
