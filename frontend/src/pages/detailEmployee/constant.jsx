import { form } from "@heroui/theme";
import Additional from "./details/additional";
import Address from "./details/address";
import Contract from "./details/contract";
import Education from "./details/education";
import EmergencyContact from "./details/emergencyContact";
import Family from "./details/family";
import Location from "./details/location";
import Profile from "./details/profile";
import Salary from "./details/salary";
import Documents from "./details/documents";

export const HEADER = [
  {
    title: "Profil",
    content: <Profile />,
  },
  {
    title: "Lokasi Kerja",
    content: <Location />,
  },
  {
    title: "Kontrak Kerja",
    content: <Contract />,
  },
  {
    title: "Alamat",
    content: <Address />,
  },
  {
    title: "Pendidikan",
    content: <Education />,
  },
  {
    title: "Kontak Darurat",
    content: <EmergencyContact />,
  },
  {
    title: "Tambahan",
    content: <Additional />,
  },
  {
    title: "Dokumen",
    content: <Documents />,
  },
  {
    title: "Keluarga",
    content: <Family />,
  },
  {
    title: "Penggajian",
    content: <Salary />,
  },
];

export const PROPERTIES = {
  profile: [
    {
      title: "Nama Lengkap",
      properties: "nama_lengkap",
    },
    {
      title: "Nama Panggilan",
      properties: "nama_panggilan",
    },
    {
      title: "Status Karyawan",
      properties: "kode_status_karyawan",
      form: "select",
      master: "masterStatus",
    },
    {
      title: "Email PENABUR",
      properties: "email_penabur",
      form: "email",
    },
    {
      title: "Email Pribadi",
      properties: "email_pribadi",
      form: "email",
    },
    { title: "ID Karyawan", properties: "nik", form: "number" },
    {
      title: "Nomor KTP",
      properties: "no_ktp",
      form: "number",
    },
    { title: "No Passport", properties: "no_pasport" },
    {
      title: "Telepon Pribadi",
      properties: "telp_pribadi",
      form: "number",
    },
    {
      title: "Telepon Kantor",
      properties: "telp_kantor",
      form: "number",
    },
    {
      title: "Direktur",
      properties: "direktur",
      form: "select",
      master: "masterDirektur",
    },
    {
      title: "Deputi",
      properties: "deputi",
      form: "select",
      master: "masterDeputi",
    },
    {
      title: "Divisi",
      properties: "divisi",
      form: "select",
      master: "masterDivisi",
    },
    {
      title: "Bagian/Biro/Sekolah",
      properties: "bagian",
      form: "select",
      master: "masterBagian",
    },
    {
      title: "Seksi",
      properties: "seksi",
      form: "select",
      master: "masterSeksi",
    },
    {
      title: "Jabatan",
      properties: "jabatan",
      form: "select",
      master: "masterJabatan",
    },
    {
      title: "Mata Pelajaran",
      properties: "mapel",
      editable: false,
    },
    {
      title: "Tipe Sekolah",
      properties: "tipe_sekolah",
      editable: false,
    },
    {
      title: "Tanggal Join PENABUR",
      properties: "tgl_join_penabur",
      form: "date",
    },
    {
      title: "Tanggal Join PENABUR Jakarta",
      properties: "tgl_join_penabur_jkt",
      form: "date",
    },
    {
      title: "Tanggal Status Tetap",
      properties: "tgl_status_permanen",
      form: "date",
    },
    {
      title: "Tanggal Penuh Waktu",
      properties: "tgl_penuh_waktu",
      form: "date",
    },
    {
      title: "Agama",
      properties: "agama",
      form: "select",
      master: "masterAgama",
    },
    {
      title: "Status Nikah",
      properties: "status_nikah",
      form: "select",
      listSelect: [
        {
          id: 1,
          name: "Menikah",
        },
        {
          id: 2,
          name: "Belum Menikah",
        },
      ],
    },
    {
      title: "Alasan Berhenti Kerja",
      properties: "alasan_berhenti_kerja",
    },
    {
      title: "Inactive",
      properties: "flag_inactive",
      form: "checkbox",
    },
    {
      title: "Tanggal Inactive",
      properties: "tanggal_inactive",
      form: "date",
    },
  ],

  lokasi: [
    {
      title: "Lokasi Kerja",
      properties: "lokasi_kerja",
      form: "select",
      master: "masterLokasiKerja",
      created: "unit_kerja",
    },
    {
      title: "Jabatan",
      properties: "jabatan",
      form: "select",
      master: "masterJabatan",
      created: "jab_id",
    },
    {
      title: "Jam Mengajar",
      properties: "jam_mengajar",
      form: "number",
      editable: false,
    },
    { title: "Rombel", properties: "rombel" },
    {
      title: "Mata Pelajaran",
      properties: "mengajar_mapel",
      form: "select",
      master: "masterMapel",
    },
  ],

  kontrak: [
    { title: "Kontrak", properties: "kontrak" },
    { title: "Tanggal Mulai", properties: "tanggal_mulai", form: "date" },
    {
      title: "Tanggal Berakhir",
      properties: "tanggal_berakhir",
      form: "date",
    },
  ],

  alamat: [
    { title: "Alamat", properties: "alamat" },
    {
      title: "Provinsi",
      properties: "provinsi",
      form: "select",
      master: "masterProvinsi",
    },
    {
      title: "Kota",
      properties: "kota",
      form: "select",
      master: "masterKota",
    },
    {
      title: "Kecamatan",
      properties: "kecamatan",
      form: "select",
      master: "masterKecamatan",
    },
    {
      title: "Kelurahan",
      properties: "kelurahan",
      form: "select",
      master: "masterKelurahan",
    },
    { title: "RT", properties: "rt", form: "number" },
    { title: "RW", properties: "rw", form: "number" },
    { title: "Kode Pos", properties: "kode_pos", form: "number" },
    { title: "Status Tempat Tinggal", properties: "status_tempat_tinggal" },
  ],

  pendidikan: [
    {
      title: "Tingkat",
      properties: "tingkat",
      form: "select",
      listSelect: [
        {
          id: 1,
          name: "D1",
        },
        {
          id: 2,
          name: "D2",
        },
        {
          id: 3,
          name: "D3",
        },
        {
          id: 4,
          name: "D4",
        },
        {
          id: 5,
          name: "S1",
        },
        {
          id: 6,
          name: "S2",
        },
        {
          id: 7,
          name: "S3",
        },
      ],
    },
    { title: "Id", properties: "id" },
    {
      title: "Nama Institusi Pendidikan",
      properties: "univ",
      form: "select",
      master: "masterUniv",
    },
    { title: "Program Studi", properties: "jurusan" },
    { title: "Tahun Lulus", properties: "tahun_kelulusan", form: "number" },
    { title: "IPK", properties: "ipk", form: "float" },
  ],

  darurat: [
    { title: "Id", properties: "id" },
    { title: "Nama Kontak Darurat", properties: "nama_kondar" },
    { title: "Alamat Kontak Darurat", properties: "alamat_kondar" },
    {
      title: "No HP Kontak Darurat",
      properties: "no_hp",
      form: "number",
    },
    {
      title: "Telepon Kontak Darurat",
      properties: "telp_darurat",
      form: "number",
    },
    { title: "Hubungan Kontak Darurat", properties: "hubungan_kondar" },
  ],

  tambahan: [
    {
      title: "Tempat Lahir",
      properties: "tempat_lahir",
    },
    { title: "Tanggal Lahir", properties: "birth_date", form: "date" },
    {
      title: "Gol Darah",
      properties: "gol_darah",
      form: "select",
      listSelect: [
        {
          id: 1,
          name: "A",
        },
        {
          id: 2,
          name: "B",
        },
        {
          id: 3,
          name: "AB",
        },
        {
          id: 4,
          name: "O",
        },
      ],
    },
    {
      title: "Kewarganegaraan",
      properties: "kewarganegaraan",
      form: "select",
      listSelect: [
        {
          id: 1,
          name: "WNI",
        },
        {
          id: 2,
          name: "WNA",
        },
      ],
    },
    { title: "Instagram", properties: "instagram" },
    { title: "Twitter", properties: "twitter" },
    { title: "No. KITAS", properties: "no_kitas", form: "number" },
    { title: "No. VISA", properties: "no_visa", form: "number" },
    { title: "No. Passport", properties: "no_pasport", form: "number" },
    { title: "No. Tabita", properties: "no_tabita", form: "number" },
    { title: "NPWP", properties: "npwp" },
    { title: "Rekening", properties: "rekening" },
    { title: "Kode Golongan", properties: "kode_golongan" },
    {
      title: "No. BPJS Ketenagakerjaan",
      properties: "no_bpjs_ketenagakerjaan",
    },
    { title: "No. BPJS Dana Pensiun", properties: "no_bpjs_danpes" },
    { title: "Nama BPJS Dana Pensiun", properties: "nama_bpjs_danpes" },
  ],

  keluarga: [
    { title: "Id", properties: "id" },
    { title: "Nama Lengkap", properties: "nama_lengkap" },
    { title: "Nomor Identitas", properties: "nomor_identitas" },
    {
      title: "Tempat Lahir",
      properties: "tempat_lahir",
      form: "select",
      master: "masterKota",
    },
    { title: "Tanggal Lahir", properties: "tanggal_lahir", form: "date" },
    {
      title: "Agama",
      properties: "agama",
      form: "select",
      master: "masterAgama",
    },
    {
      title: "Kewarganegaraan",
      properties: "kewarganegaraan",
      form: "select",
      listSelect: [
        {
          id: 1,
          name: "WNI",
        },
        {
          id: 2,
          name: "WNA",
        },
      ],
    },
    { title: "Pekerjaan", properties: "pekerjaan" },
    { title: "Pendidikan", properties: "pendidikan" },
    {
      title: "Jenis Kelamin",
      properties: "gender",
      form: "select",
      listSelect: [
        {
          id: 1,
          name: "Laki-laki",
        },
        {
          id: 2,
          name: "Perempuan",
        },
      ],
    },
    { title: "Hubungan", properties: "hubungan" },
    { title: "No. Telepon", properties: "no_telp" },
    {
      title: "Status",
      properties: "flag_status",
      form: "checkbox",
    },
    {
      title: "Tanggungan Medical",
      properties: "tanggungan_medical",
      form: "checkbox",
    },
    {
      title: "Kebijakan Khusus Medical",
      properties: "kebijakan_khusus_medical",
      form: "checkbox",
    },
    {
      title: "Status Berpisah",
      properties: "flag_berpisah",
      form: "select",
      listSelect: [
        {
          id: 1,
          name: "Tidak",
        },
        {
          id: 2,
          name: "Meninggal",
        },
        {
          id: 3,
          name: "Berpisah",
        },
      ],
    },
    { title: "Keterangan", properties: "keterangan" },
  ],

  penggajian: {
    NPWP: [{ title: "Nomor NPWP", properties: "npwp" }],
    Bank: [{ title: "Nomor Rekening", properties: "rekening" }],
    BPJS: [
      { title: "Nomor BPJS Kesehatan", properties: "nomor_bpjs_kesehatan" },
      {
        title: "Nomor BPJS Ketenagakerjaan",
        properties: "nomor_bpjs_ketenagakerjaan",
      },
      {
        title: "Nomor BPJS Jaminan Pensiun",
        properties: "nomor_bpjs_jaminan_pensiun",
      },
    ],
    Pensiun: [
      {
        title: "Nomor Tabita",
        properties: "no_tabita",
      },
    ],
  },
};
