import acaraPerundingan from "../pages/printLetter/components/letters/acaraPerundingan";
import addendumPKPW from "../pages/printLetter/components/letters/addendumPKPW";
import addendumPKWT from "../pages/printLetter/components/letters/addendumPKWT";
import cutiSakitBerkepanjangan from "../pages/printLetter/components/letters/cutiSakitBerkepanjangan";
import disposisi from "../pages/printLetter/components/letters/disposisi";
import formulirCkeYayasan from "../pages/printLetter/components/letters/formulirCkeYayasan";
import harian from "../pages/printLetter/components/letters/harian";
import jawabanPermohonan from "../pages/printLetter/components/letters/jawabanPermohonan";
import jawabanPermohonanCuti from "../pages/printLetter/components/letters/jawabanPermohonanCuti";
import kenaikanGolonganKaryawan from "../pages/printLetter/components/letters/kenaikanGolonganKaryawan";
import kenaikanRuang from "../pages/printLetter/components/letters/kenaikanRuang";
import kenaikanRuangPejabat from "../pages/printLetter/components/letters/kenaikanRuangPejabat";
import keputusanPenugasan from "../pages/printLetter/components/letters/keputusanPenugasan";
import kesalahanBerat from "../pages/printLetter/components/letters/kesalahanBerat";
import kesepakatanBersama from "../pages/printLetter/components/letters/kesepakatanBersama";
import keteranganBekerja from "../pages/printLetter/components/letters/keteranganBekerja";
import keteranganBekerjaPKWT from "../pages/printLetter/components/letters/keteranganBekerjaPKWT";
import keteranganBekerjaTKL from "../pages/printLetter/components/letters/keteranganBekerjaTKL";
import keteranganBPJSKetenagakerjaan from "../pages/printLetter/components/letters/keteranganBPJSKetenagakerjaan";
import keterangankaryawanAktif from "../pages/printLetter/components/letters/keteranganKaryawanAktif";
import keteranganKaryawanBerhenti from "../pages/printLetter/components/letters/keteranganKaryawanBerhenti";
import konfirmasiTugas from "../pages/printLetter/components/letters/konfirmasiTugas";
import kormatpel from "../pages/printLetter/components/letters/kormatpel";
import magang from "../pages/printLetter/components/letters/magang";
import penempatanKasek from "../pages/printLetter/components/letters/penempatanKasek";
import penetapanAlihProfesi from "../pages/printLetter/components/letters/penetapanAlihProfesi";
import penetapanMutasi from "../pages/printLetter/components/letters/penetapanMutasi";
import pengakatanWakasek from "../pages/printLetter/components/letters/pengakatanWakasek";
import pengakhiranHubunganKerja from "../pages/printLetter/components/letters/pengakhiranHubunganKerja";
import pengangkatanKasek from "../pages/printLetter/components/letters/pengangkatanKasek";
import pengangkatanNonStruktural from "../pages/printLetter/components/letters/pengangkatanNonStruktural";
import pengangkatanPJKasek from "../pages/printLetter/components/letters/pengangkatanPJKasek";
import pengangkatanPJStruktural from "../pages/printLetter/components/letters/pengangkatanPJStruktural";
import pengangkatanPJStrukrualBaru from "../pages/printLetter/components/letters/pengangkatanPJStrukturalBaru";
import pengangkatanSementara from "../pages/printLetter/components/letters/pengangkatanSementara";
import pengangkatanStruktural from "../pages/printLetter/components/letters/pengangkatanStruktural";
import penggabunganSaldo from "../pages/printLetter/components/letters/penggabunganSaldo";
import penyataanTanggungJawabMutlak from "../pages/printLetter/components/letters/penyataanTanggungJawabMutlak";
import penyesuaianGolonganPejabat from "../pages/printLetter/components/letters/penyesuaianGolonganPejabat";
import penyesuaianIjazah from "../pages/printLetter/components/letters/penyesuaianIjazah";
import permohonanMutasi from "../pages/printLetter/components/letters/permohonanMutasi";
import permohonanSK from "../pages/printLetter/components/letters/permohonanSK";
import perubahanAlihJabatan from "../pages/printLetter/components/letters/perubahananAlihJabatan";
import pkwt from "../pages/printLetter/components/letters/pkwt";
import pkpw from "../pages/printLetter/components/letters/pkpw";
import tanggungJawabMutlak from "../pages/printLetter/components/letters/tanggungJawabMutlak";
import verifikasiData from "../pages/printLetter/components/letters/verifikasiData";

export const LETTERS_REGISTRY = {
  bipartit: {
    component: acaraPerundingan,
    label: "Berita Acara Perundingan Bipartit",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/bipartit/${id}`,
    hasEndpoint: true,
  },
  addendumPKPW: {
    component: addendumPKPW,
    label: "Addendum PKPW",
    allowedStatus: ["TTP", "PKPW"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  addendumPKWT: {
    component: addendumPKWT,
    label: "Addendum PKWT",
    allowedStatus: ["KWT", "PKWT", "KONTRAK"],
    apiEndpoint: (id) => `/kwt/${id}`,
    hasEndpoint: true,
  },
  cutiPanjang: {
    component: cutiSakitBerkepanjangan,
    label: "Surat Cuti Panjang",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/CutiPanjang/${id}`,
    hasEndpoint: true,
  },
  disposisi: {
    component: disposisi,
    label: "Surat Disposisi",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/disposisi/${id}`,
    hasEndpoint: true,
  },
  formulirCkeYayasan: {
    component: formulirCkeYayasan,
    label: "Formulir CKE Yayasan",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  harian: {
    component: harian,
    label: "Surat Tugas Harian",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  jawabanPermohonan: {
    component: jawabanPermohonan,
    label: "Surat Jawaban Permohonan",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  cutiDiluarTanggungan: {
    component: jawabanPermohonanCuti,
    label: "Surat Cuti Diluar Tanggungan",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/CutiDiluarTanggungan/${id}`,
    hasEndpoint: true,
  },
  kenaikanGolongan: {
    component: kenaikanGolonganKaryawan,
    label: "Surat Keputusan Kenaikan Golongan Karyawan",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/SuratKenaikanGolongan/${id}`,
    hasEndpoint: true,
  },
  kenaikanRuang: {
    component: kenaikanRuang,
    label: "Surat Kenaikan Ruang",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  kenaikanRuangPejabat: {
    component: kenaikanRuangPejabat,
    label: "Surat Kenaikan Ruang Pejabat",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  keputusanPenugasan: {
    component: keputusanPenugasan,
    label: "Surat Keputusan Penugasan",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  kesalahanBeratPelanggaran: {
    component: kesalahanBerat,
    label: "Surat Kesalahan Berat & Pelanggaran",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_kesalahan_berat_pelanggaran/${id}`,
    hasEndpoint: true,
  },
  kesepakatanBersama: {
    component: kesepakatanBersama,
    label: "Surat Kesepakatan Bersama",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  keteranganBekerja: {
    component: keteranganBekerja,
    label: "Surat Keterangan Bekerja",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  keteranganBekerjaPKWT: {
    component: keteranganBekerjaPKWT,
    label: "Surat Karyawan KWT (Kontrak Waktu Tertentu)",
    allowedStatus: ["KWT", "PKWT", "KONTRAK"],
    apiEndpoint: (id) => `/kwt/${id}`,
    hasEndpoint: true,
  },
  keteranganBekerjaTKL: {
    component: keteranganBekerjaTKL,
    label: "Surat Karyawan TKL (Tenaga Kerja Lepas)",
    allowedStatus: ["TKL", "LEPAS"],
    apiEndpoint: (id) => `/tkl/${id}`,
    hasEndpoint: true,
  },
  bpjsKetenagakerjaan: {
    component: keteranganBPJSKetenagakerjaan,
    label: "Surat BPJS Ketenagakerjaan",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/bpjs_ketenagakerjaan/${id}`,
    hasEndpoint: true,
  },
  keterangankaryawanAktif: {
    component: keterangankaryawanAktif,
    label: "Surat Keterangan Karyawan Aktif",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  pengunduranDiri: {
    component: keteranganKaryawanBerhenti,
    label: "Surat Pengunduran Diri",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_pengunduran_diri/${id}`,
    hasEndpoint: true,
  },
  // konfirmasiTugas: {
  //   component: konfirmasiTugas,
  //   label: "Surat Konfirmasi Tugas",
  //   allowedStatus: ["ALL"],
  //   apiEndpoint: (id) => `/surat_keterangan/${id}`,
  //   hasEndpoint: true,
  // },
  // kormatpel: {
  //   component: kormatpel,
  //   label: "Surat Keterangan Mengajar Mata Pelajaran",
  //   allowedStatus: ["ALL"],
  //   apiEndpoint: (id) => `/surat_keterangan/${id}`,
  //   hasEndpoint: true,
  // },
  magang: {
    component: magang,
    label: "Surat Magang",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/tkl/${id}`,
    hasEndpoint: true,
  },
  penempatanKasek: {
    component: penempatanKasek,
    label: "Surat Penempatan Kepala Sekolah",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  // penetapanAlihProfesi: {
  //   component: penetapanAlihProfesi,
  //   label: "Surat Penetapan Alih Profesi",
  //   allowedStatus: ["ALL"],
  //   apiEndpoint: (id) => `/surat_keterangan/${id}`,
  //   hasEndpoint: true,
  // },
  penempatanMutasi: {
    component: penetapanMutasi,
    label: "Surat Penetapan Mutasi",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  pengangkatanWakasek: {
    component: pengakatanWakasek,
    label: "Surat Penempatan Wakil Kepala Sekolah",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  suratPHKById: {
    component: pengakhiranHubunganKerja,
    label: "Surat PHK by ID",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/SuratPHKById/${id}`,
    hasEndpoint: true,
  },
  suratPHK: {
    component: pengakhiranHubunganKerja,
    label: "Surat PHK (Mengundurkan Diri)",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/SuratPHK`,
    hasEndpoint: true,
  },
  pengangkatanKasek: {
    component: pengangkatanKasek,
    label: "Surat Pengangkatan Kepala Sekolah",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  // pengangkatanNonStruktural: {
  //   component: pengangkatanNonStruktural,
  //   label: "Surat Pengangkatan Non Struktural",
  //   allowedStatus: ["ALL"],
  //   apiEndpoint: (id) => `/surat_keterangan/${id}`,
  //   hasEndpoint: true,
  // },
  pengangkatanPJKasek: {
    component: pengangkatanPJKasek,
    label: "Surat Pengangkatan PJ Kepala Sekolah",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  pengangkatanPJStruktural: {
    component: pengangkatanPJStruktural,
    label: "Surat Pengangkatan PJ Struktural",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  pengangkatanPJStrukrualBaru: {
    component: pengangkatanPJStrukrualBaru,
    label: "Surat Pengangkatan PJ Struktural Baru",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  pengangkatanSementara: {
    component: pengangkatanSementara,
    label: "Surat Pengangkatan Sementara",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  pengangkatanStruktural: {
    component: pengangkatanStruktural,
    label: "Surat Pengangkatan Struktural",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  penggabunganSaldo: {
    component: penggabunganSaldo,
    label: "Surat Penggabungan Saldo",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  penyataanTanggungJawabMutlak: {
    component: penyataanTanggungJawabMutlak,
    label: "Surat Pernyataan Tanggung Jawab Mutlak",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  penyesuaianGolonganPejabat: {
    component: penyesuaianGolonganPejabat,
    label: "Surat Penyesuaian Golongan Pejabat",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  penyesuaianIjazah: {
    component: penyesuaianIjazah,
    label: "Surat Penyesuaian Ijazah",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  mutasiPermohonan: {
    component: permohonanMutasi,
    label: "Surat Permohonan Mutasi",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  permohonanSK: {
    component: permohonanSK,
    label: "Permohonan Surat Keputusan",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  perubahanAlihJabatan: {
    component: perubahanAlihJabatan,
    label: "Surat Perubahan Alih Jabatan",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  pkpw: {
    component: pkpw,
    label: "Surat PKPW (Perjanjian Kerja Paruh Waktu)",
    allowedStatus: ["PKPW"],
    apiEndpoint: (id) => `/pkpw/${id}`,
    hasEndpoint: true,
  },
  pkwt: {
    component: pkwt,
    label: "Surat PKWT (Perjanjian Kerja Waktu Tertentu)",
    allowedStatus: ["PKWT"],
    apiEndpoint: (id) => `/pkwt/${id}`,
    hasEndpoint: true,
  },
  tanggungJawabMutlak: {
    component: tanggungJawabMutlak,
    label: "Surat Tanggung Jawab Mutlak",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },
  verifikasiData: {
    component: verifikasiData,
    label: "Surat Verifikasi Data Karyawan",
    allowedStatus: ["ALL"],
    apiEndpoint: (id) => `/surat_keterangan/${id}`,
    hasEndpoint: true,
  },

  pkwt: {
    component: pkwt,
    label: "PKWT (Perjanjian Kerja Waktu Tertentu)",
    allowedStatus: ["KWT", "PKWT"],
    apiEndpoint: null,
    hasEndpoint: false,
    form: [
      {
        label: "Nama Pekerja",
        properties: "nama_pekerja",
        type: "text",
        placeholder: "Masukkan Nama Pekerja",
      },
      {
        label: "NIK Pekerja",
        properties: "nik_pekerja",
        type: "number",
        placeholder: "Masukkan NIK Pekerja",
      },
      {
        label: "Jenis Kelamin Pekerja",
        properties: "jenis_kelamin_pekerja",
        type: "select",
        listSelect: ["Laki-laki", "Perempuan"],
        placeholder: "Pilih Jenis Kelamin Pekerja",
      },
      {
        label: "Tempat, Tanggal Lahir Pekerja",
        properties: "tempat_tanggal_lahir_pekerja",
        type: "text",
        placeholder: "Masukkan Tempat, Tanggal Lahir Pekerja",
      },
      {
        label: "Umur Pekerja",
        properties: "umur_pekerja",
        type: "number",
        placeholder: "Masukkan Umur Pekerja",
      },
      {
        label: "Alamat Pekerja",
        properties: "alamat_pekerja",
        type: "text",
        placeholder: "Masukkan Alamat Pekerja",
      },
    ],
  },

  pkpw: {
    component: pkpw,
    label: "PKPW (Perjanjian Kerja Waktu Tidak Tertentu)",
    allowedStatus: ["TTP", "PKPW"],
    apiEndpoint: null,
    hasEndpoint: false,
    form: [
      {
        label: "Nama Pekerja",
        properties: "nama_pekerja",
        type: "text",
        placeholder: "Masukkan Nama Pekerja",
      },
      {
        label: "NIK Pekerja",
        properties: "nik_pekerja",
        type: "number",
        placeholder: "Masukkan NIK Pekerja",
      },
      {
        label: "Jenis Kelamin Pekerja",
        properties: "jenis_kelamin_pekerja",
        type: "select",
        listSelect: ["Laki-laki", "Perempuan"],
        placeholder: "Pilih Jenis Kelamin Pekerja",
      },
      {
        label: "Tempat, Tanggal Lahir Pekerja",
        properties: "tempat_tanggal_lahir_pekerja",
        type: "text",
        placeholder: "Masukkan Tempat, Tanggal Lahir Pekerja",
      },
      {
        label: "Umur Pekerja",
        properties: "umur_pekerja",
        type: "number",
        placeholder: "Masukkan Umur Pekerja",
      },
      {
        label: "Alamat Pekerja",
        properties: "alamat_pekerja",
        type: "text",
        placeholder: "Masukkan Alamat Pekerja",
      },
    ],
  },
};

/**
 * Get only letters that have API endpoints
 * @returns {Object} Filtered registry dengan hasEndpoint: true
 */
export const getActiveLetters = () => {
  return Object.entries(LETTERS_REGISTRY)
    .filter(([_, letter]) => letter.hasEndpoint === true)
    .reduce((acc, [key, letter]) => {
      acc[key] = letter;

      return acc;
    }, {});
};

/**
 * Get available letters based on employee status
 * @param {string} employeeStatus - Status karyawan (TTP, KWT, dll)
 * @returns {Array} Array of {value, title, allowedStatus}
 */
export const getAvailableLetters = (employeeStatus) => {
  const activeLetters = getActiveLetters();

  if (!employeeStatus) {
    return Object.entries(activeLetters).map(([key, value]) => ({
      value: key,
      title: value.label,
      allowedStatus: value.allowedStatus,
    }));
  }

  const statusUpper = employeeStatus.toUpperCase().trim();

  const filtered = Object.entries(activeLetters)
    .filter(([key, letter]) => {
      if (letter.allowedStatus.includes("ALL")) return true;

      return letter.allowedStatus.some((allowed) =>
        statusUpper.includes(allowed),
      );
    })
    .map(([key, value]) => ({
      value: key,
      title: value.label,
      allowedStatus: value.allowedStatus,
    }));

  return filtered;
};

/**
 * Get all letters for general print menu (both with and without endpoints)
 * @returns {Array} Array of letter objects
 */
export const getAllLettersForMenu = () => {
  return Object.entries(LETTERS_REGISTRY).map(([key, letter]) => ({
    key,
    title: letter.label,
    component: letter.component,
    allowedStatus: letter.allowedStatus,
    hasEndpoint: letter.hasEndpoint,
    apiEndpoint: letter.apiEndpoint,
    form: letter.form || [],
  }));
};

/**
 * Get letter component by key
 * @param {string} letterKey - Key dari letter
 * @returns {React.Component|null}
 */
export const getLetterComponent = (letterKey) => {
  return LETTERS_REGISTRY[letterKey]?.component || null;
};

/**
 * Get letter label by key
 * @param {string} letterKey - Key dari letter
 * @returns {string}
 */
export const getLetterLabel = (letterKey) => {
  return LETTERS_REGISTRY[letterKey]?.label || "Surat";
};

/**
 * Get API endpoint for a letter
 * @param {string} letterKey - Key dari letter
 * @param {string} employeeId - ID karyawan
 * @returns {string|null}
 */
export const getLetterEndpoint = (letterKey, employeeId) => {
  const letter = LETTERS_REGISTRY[letterKey];

  if (!letter || !letter.hasEndpoint || !letter.apiEndpoint) return null;

  return typeof letter.apiEndpoint === "function"
    ? letter.apiEndpoint(employeeId)
    : letter.apiEndpoint;
};

/**
 * Check if letter key is valid
 * @param {string} letterKey - Key dari letter
 * @returns {boolean}
 */
export const isValidLetterKey = (letterKey) => {
  return letterKey in LETTERS_REGISTRY;
};

/**
 * Check if letter has API endpoint
 * @param {string} letterKey - Key dari letter
 * @returns {boolean}
 */
export const hasLetterEndpoint = (letterKey) => {
  return LETTERS_REGISTRY[letterKey]?.hasEndpoint === true;
};

/**
 * Get letter form fields
 * @param {string} letterKey - Key dari letter
 * @returns {Array}
 */
export const getLetterForm = (letterKey) => {
  return LETTERS_REGISTRY[letterKey]?.form || [];
};

export const ACTIVE_LETTERS = getActiveLetters();

// Export everything for debugging
export default {
  LETTERS_REGISTRY,
  getActiveLetters,
  getAvailableLetters,
  getAllLettersForMenu,
  getLetterComponent,
  getLetterLabel,
  getLetterEndpoint,
  isValidLetterKey,
  hasLetterEndpoint,
  getLetterForm,
};
