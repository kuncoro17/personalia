import AcaraPerundingan from "./components/letters/acaraPerundingan";
import AddendumPKPW from "./components/letters/addendumPKPW";
import AddendumPKWT from "./components/letters/addendumPKWT";
import CutiSakitBerkepanjangan from "./components/letters/cutiSakitBerkepanjangan";
import Disposisi from "./components/letters/disposisi";
import FormulirCkeYayasan from "./components/letters/formulirCkeYayasan";
import Harian from "./components/letters/harian";
import JawabanPermohonan from "./components/letters/jawabanPermohonan";
import JawabanPermohonanCuti from "./components/letters/jawabanPermohonanCuti";
import KenaikanGolonganKaryawan from "./components/letters/kenaikanGolonganKaryawan";
import KenaikanRuang from "./components/letters/kenaikanRuang";
import KenaikanRuangPejabat from "./components/letters/kenaikanRuangPejabat";
import KeputusanPenugasan from "./components/letters/keputusanPenugasan";
import KesalahanBerat from "./components/letters/kesalahanBerat";
import KesepakatanBersama from "./components/letters/kesepakatanBersama";
import KeteranganBekerja from "./components/letters/keteranganBekerja";
import KeteranganBekerjaPKWT from "./components/letters/keteranganBekerjaPKWT";
import KeteranganBekerjaTKL from "./components/letters/keteranganBekerjaTKL";
import KeteranganBPJSKetenagakerjaan from "./components/letters/keteranganBPJSKetenagakerjaan";
import KeteranganKaryawanAktif from "./components/letters/keteranganKaryawanAktif";
import KeteranganKaryawanBerhenti from "./components/letters/keteranganKaryawanBerhenti";
import KonfirmasiTugas from "./components/letters/konfirmasiTugas";
import Kormatpel from "./components/letters/kormatpel";
import Magang from "./components/letters/magang";
import PenempatanKaSek from "./components/letters/penempatanKasek";
import PenetapanAlihProfesi from "./components/letters/penetapanAlihProfesi";
import PenetapanMutasi from "./components/letters/penetapanMutasi";
import PengangkatanWakasek from "./components/letters/pengakatanWakasek";
import PengakhiranHubunganKerja from "./components/letters/pengakhiranHubunganKerja";
import PengangkatanKasek from "./components/letters/pengangkatanKasek";
import PengangkatanNonStruktural from "./components/letters/pengangkatanNonStruktural";
import PengangkatanPJKasek from "./components/letters/pengangkatanPJKasek";
import PengangkatanSementara from "./components/letters/pengangkatanSementara";
import PenggabunganSaldo from "./components/letters/penggabunganSaldo";
import PernyataanTanggungJawabMutlak from "./components/letters/penyataanTanggungJawabMutlak";
import PenyesuaianGolonganPejabat from "./components/letters/penyesuaianGolonganPejabat";
import PenyesuaianIjasah from "./components/letters/penyesuaianIjazah";
import PermohonanMutasi from "./components/letters/permohonanMutasi";
import PermohonanSK from "./components/letters/permohonanSK";
import PerubahananAlihJabatan from "./components/letters/perubahananAlihJabatan";
import PKPW from "./components/letters/pkpw";
import PKWT from "./components/letters/pkwt";
import PerpanjanganPJStrukturalSekretariat from "./components/letters/pengangkatanPJStruktural";
import PengangkatanPJStrukturalBaruStruktural from "./components/letters/pengangkatanPJStrukturalBaru";
import PengangkatanStrukturalSekretariat from "./components/letters/pengangkatanStruktural";
import TanggungJawabMutlak from "./components/letters/tanggungJawabMutlak";
import VerifikasiData from "./components/letters/verifikasiData";

// ========================================
// LISTSURAT - Daftar semua surat yang tersedia
// ========================================
// hasEndpoint: true = Sudah ada API endpoint (bisa digunakan)
// hasEndpoint: false = Belum ada API endpoint (akan ditambahkan nanti)
// endpointKey: key yang digunakan di LETTERENDPOINT (constants/api.js)

export const LISTSURAT = [
  // ========== SURAT DENGAN API ENDPOINT (8 surat) ==========
  {
    title: "Keterangan Bekerja (Karyawan Tetap)",
    letter: KeteranganBekerja,
    hasEndpoint: true,
    endpointKey: "ttp",
  },
  {
    title: "Keterangan Bekerja (PKWT)",
    letter: KeteranganBekerjaPKWT,
    hasEndpoint: true,
    endpointKey: "kwt",
  },
  {
    title: "Keterangan Bekerja (TKL)",
    letter: KeteranganBekerjaTKL,
    hasEndpoint: true,
    endpointKey: "tkl",
  },
  {
    title: "Keterangan Bekerja (WTT)",
    letter: KeteranganBekerja, // Menggunakan template yang sama dengan TTP
    hasEndpoint: true,
    endpointKey: "wtt",
  },
  {
    title: "Berita Acara Perundingan Bipartit",
    letter: AcaraPerundingan,
    hasEndpoint: true,
    endpointKey: "bipartit",
  },
  {
    title: "Cuti Sakit Berkepanjangan",
    letter: CutiSakitBerkepanjangan,
    hasEndpoint: true,
    endpointKey: "cutiPanjang",
  },
  {
    title: "Pengakhiran Hubungan Kerja",
    letter: PengakhiranHubunganKerja,
    hasEndpoint: true,
    endpointKey: "suratPHKById",
  },
  {
    title: "Jawaban atas Permohonan Cuti di Luar Tanggungan",
    letter: JawabanPermohonanCuti,
    hasEndpoint: true,
    endpointKey: "cutiDiluarTanggungan",
  },

  // ========== SURAT TANPA API ENDPOINT (akan ditambahkan nanti) ==========
  {
    title: "PKWT",
    letter: PKWT,
    hasEndpoint: true,
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
  {
    title: "PKPW",
    letter: PKPW,
    hasEndpoint: false,
  },
  {
    title: "Pengantar Disposisi",
    letter: Disposisi,
    hasEndpoint: false,
  },
  {
    title: "Perjanjian Kerja Magang",
    letter: Magang,
    hasEndpoint: false,
  },
  {
    title: "Perjanjian Kerja Harian",
    letter: Harian,
    hasEndpoint: false,
  },
  {
    title: "Pengangkatan Sementara",
    letter: PengangkatanSementara,
    hasEndpoint: false,
  },
  {
    title: "Kormatpel",
    letter: Kormatpel,
    hasEndpoint: false,
  },
  {
    title: "Pengangkatan Wakasek",
    letter: PengangkatanWakasek,
    hasEndpoint: false,
  },
  {
    title: "Penetapan Alih Profesi",
    letter: PenetapanAlihProfesi,
    hasEndpoint: false,
  },
  {
    title: "Penetapan Mutasi",
    letter: PenetapanMutasi,
    hasEndpoint: false,
  },
  {
    title: "Pengangkatan Struktural (Sekretariat)",
    letter: PengangkatanStrukturalSekretariat,
    hasEndpoint: false,
  },
  {
    title: "Pengangkatan PJ Struktural Baru (Sekretariat)",
    letter: PengangkatanPJStrukturalBaruStruktural,
    hasEndpoint: false,
  },
  {
    title: "Pengangkatan Non Struktural",
    letter: PengangkatanNonStruktural,
    hasEndpoint: false,
  },
  {
    title: "Pengangkatan PJ Struktural (Sekretariat)",
    letter: PerpanjanganPJStrukturalSekretariat,
    hasEndpoint: false,
  },
  {
    title: "Pengangkatan PJ Kasek",
    letter: PengangkatanPJKasek,
    hasEndpoint: false,
  },
  {
    title: "Penempatan Kasek",
    letter: PenempatanKaSek,
    hasEndpoint: false,
  },
  {
    title: "Pengangkatan Kasek",
    letter: PengangkatanKasek,
    hasEndpoint: false,
  },
  {
    title: "Addendum PKPW",
    letter: AddendumPKPW,
    hasEndpoint: false,
  },
  {
    title: "Addendum PKWT",
    letter: AddendumPKWT,
    hasEndpoint: false,
  },
  {
    title: "Keputusan Kenaikan Ruang/Kuarter",
    letter: KenaikanRuang,
    hasEndpoint: false,
  },
  {
    title: "Formulir C ke Yayasan",
    letter: FormulirCkeYayasan,
    hasEndpoint: false,
  },
  {
    title: "Kenaikan Golongan Karyawan ke Yayasan",
    letter: KenaikanGolonganKaryawan,
    hasEndpoint: false,
  },
  {
    title: "Keputusan Kenaikan Ruang Pejabat Struktural Baru",
    letter: KenaikanRuangPejabat,
    hasEndpoint: false,
  },
  {
    title: "Keterangan BPJS Ketenaakerjaan",
    letter: KeteranganBPJSKetenagakerjaan,
    hasEndpoint: false,
  },
  {
    title: "Penyesuaian Golongan Struktural Baru Pejabat ke Yayasan",
    letter: PenyesuaianGolonganPejabat,
    hasEndpoint: false,
  },
  {
    title: "Keterangan Karyawan Aktif",
    letter: KeteranganKaryawanAktif,
    hasEndpoint: false,
  },
  {
    title: "Keterangan Karyawan Berhenti",
    letter: KeteranganKaryawanBerhenti,
    hasEndpoint: false,
  },
  {
    title: "Penyesuaian Ijazah",
    letter: PenyesuaianIjasah,
    hasEndpoint: false,
  },
  {
    title: "Permohonan Mutasi atau Lolos Butuh ke Setempat",
    letter: PermohonanMutasi,
    hasEndpoint: false,
  },
  {
    title: "Pernyataan Tanggung Jawab Mutlak Pimpinan Perusahaan",
    letter: TanggungJawabMutlak,
    hasEndpoint: false,
  },
  {
    title: "Kesalahan Berat atau Pelanggaran Bersifat Mendesak",
    letter: KesalahanBerat,
    hasEndpoint: false,
  },
  {
    title: "Kesepakatan Bersama",
    letter: KesepakatanBersama,
    hasEndpoint: false,
  },
  {
    title: "Form Pernyataan Tanggung Jawab Mutlak",
    letter: PernyataanTanggungJawabMutlak,
    hasEndpoint: false,
  },
  {
    title: "Konfirmasi Tugas Luar Kota",
    letter: KonfirmasiTugas,
    hasEndpoint: false,
  },
  {
    title: "Jawaban atas Permohonan Mutasi atau Lolos Butuh ke Setempat",
    letter: JawabanPermohonan,
    hasEndpoint: false,
  },
  {
    title: "Permohonan Penggabungan Saldo",
    letter: PenggabunganSaldo,
    hasEndpoint: false,
  },
  {
    title: "Permohonan SK Mutasi atau Lolos Butuh ke Yayasan",
    letter: PermohonanSK,
    hasEndpoint: false,
  },
  {
    title: "Permohonan Verifikasi Data",
    letter: VerifikasiData,
    hasEndpoint: false,
  },
  {
    title: "Perubahan Alih Jabatan atau Profesi ke Yayasan",
    letter: PerubahananAlihJabatan,
    hasEndpoint: false,
  },
  {
    title: "Keputusan Penugasan",
    letter: KeputusanPenugasan,
    hasEndpoint: false,
  },
];
