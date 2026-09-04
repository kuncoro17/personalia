import { Page, Text, Image, StyleSheet, View, Font } from "@react-pdf/renderer";

Font.register({
  family: "Times New Roman",
  fonts: [
    { src: "/assets/fonts/TimesNewRoman/TimesNewRoman.ttf" },
    {
      src: "/assets/fonts/TimesNewRoman/TimesNewRoman_Bold.ttf",
      fontWeight: "bold",
    },
    {
      src: "/assets/fonts/TimesNewRoman/TimesNewRoman_BoldItalic.ttf",
      fontStyle: "bold italic",
    },
    {
      src: "/assets/fonts/TimesNewRoman/TimesNewRoman_Italic.ttf",
      fontStyle: "italic",
    },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatTanggalIndo(dateLike) {
  const d = dateLike ? new Date(dateLike) : new Date();
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export default function JawabanPermohonanCuti({ data }) {
  // ✅ support 2 bentuk:
  // 1) raw response => { success, message, data: {...} }
  // 2) unwrapped => { ... }
  const payload = data?.data ? data.data : data;

  const tanggalSurat = formatTanggalIndo(); // ✅ today

  // ✅ ambil data karyawan minimal
  const idKaryawan = payload?.id_karyawan ?? payload?.id ?? "—";
  const namaLengkap =
    (payload?.nama_lengkap ?? payload?.nama ?? "").toString().trim() || "—";
  const nik = (payload?.nik ?? "").toString().trim() || "—";

  // ✅ opsional: kalau ada data unit/jabatan dari API
  const unitKerja =
    (payload?.unit_kerja ?? payload?.lokasi_kerja ?? payload?.unit ?? "")
      .toString()
      .trim() || "—";
  const jabatan =
    (payload?.jabatan ?? payload?.posisi ?? "").toString().trim() || "—";

  // ✅ nomor surat (pakai dari API kalau ada)
  const today = new Date();

  const bulan = String(today.getMonth() + 1).padStart(2, "0"); // 01–12
  const tahun = today.getFullYear();

  const nomorSurat = payload?.nomor_surat ?? `01/BPR/Pr/${bulan}/${tahun}`;

  // ✅ isi surat (ambil dari API kalau ada, kalau belum fallback tetap teks statis kamu)

  const lamaCutiBulan = 3;

  return (
    <Page style={styles.containerDocument} size="A4">
      <Image src="/assets/images/kop.png" style={styles.kopSurat} fixed />

      {/* ✅ tanggal surat = today */}
      <Text style={[{ alignSelf: "flex-end" }, styles.textNormal]}>
        {tanggalSurat}
      </Text>

      {/* ✅ DEBUG: id_karyawan + nama_lengkap (hapus kalau sudah beres) */}
      <View style={{ marginTop: 6 }}>
        <Text style={{ fontSize: 8 }}>
          DEBUG: id_karyawan={String(idKaryawan)} | nama_lengkap={namaLengkap}
        </Text>
      </View>

      <View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "15%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Nomor</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              {nomorSurat}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "15%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Perihal</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              Jawaban atas permohonan cuti di luar tanggungan
            </Text>
          </View>
        </View>
      </View>

      {/* ✅ penerima dibuat dinamis */}
      <View style={{ marginTop: 30 }}>
        <Text style={styles.textNormal}>
          Yth. Sdr. {namaLengkap} ({nik})
        </Text>
        <Text style={styles.textNormal}>
          {jabatan !== "—" ? jabatan : "—"}{" "}
          {unitKerja !== "—" ? `- ${unitKerja}` : ""}
        </Text>
        <Text style={styles.textNormal}>di Tempat</Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 30 }]}>Dengan hormat,</Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Kiranya Tuhan Yang Maha Kasih menganugerahkan kesehatan prima bagi
        Saudara dan keluarga.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Berkenaan dengan surat permohonan Saudara tanggal {tanggalPermohonan}
        perihal cuti di luar tanggungan untuk mendampingi suami menjalani
        serangkaian pemeriksaan kesehatan dan pengobatan, dengan ini kami
        informasikan bahwa Rapat Bidang SDM tanggal {tanggalRapat} memutuskan
        untuk memberikan cuti di luar tanggungan kepada Saudara selama{" "}
        {lamaCutiBulan} ({lamaCutiBulan === 3 ? "tiga" : String(lamaCutiBulan)})
        bulan terhitung mulai tanggal {tglMulaiCuti} sampai dengan{" "}
        {tglSelesaiCuti}.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Berdasarkan Peraturan Perusahaan PENABUR Tahun 2024 Pasal 35 tentang
        Cuti di Luar Tanggungan kami informasikan beberapa hal sebagai berikut:
      </Text>

      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: 15 }]}>1.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Selama cuti di luar tanggungan, Saudara tidak menerima gaji, termasuk
          semua fasilitas atau bantuan, sesuai ketentuan yang berlaku di YBPK
          PENABUR atau BPK PENABUR Jakarta.
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: 15 }]}>2.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Selama cuti di luar tanggungan, Iuran BPJS Kesehatan, BPJS
          Ketenagakerjaan, BPJS Pensiun, Dana Pensiun, Koperasi akan tetap kami
          bayarkan namun akan diperhitungkan dengan gaji yang Saudara terima
          pada saat Saudara masuk kerja.
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: 15 }]}>3.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Selama cuti di luar tanggungan, masa kerja Saudara tertunda untuk
          Kenaikan Golongan, Penerimaan Bonus Pengabdian dan/atau Satya Karya.
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: 15 }]}>4.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Setelah cuti di luar tanggungan selesai, Saudara tidak berhak menuntut
          pekerjaan yang sama dengan pekerjaan yang diduduki saat sebelum
          menjalani cuti di luar tanggungan.
        </Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Demikian pemberitahuan ini kami sampaikan. Terima kasih atas perhatian
        dan kerjasama Saudara. Tuhan Memberkati.
      </Text>

      <View
        style={{
          alignSelf: "flex-end",
          marginRight: 30,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={styles.textNormal}>Hormat kami,</Text>

        <Text
          style={[
            styles.textBold,
            { textDecoration: "underline", marginTop: 70, color: "blue" },
          ]}
        >
          Irani Waruwu
        </Text>
        <Text style={styles.textNormal}>Pj. Kepala Divisi SDM</Text>
      </View>

      <View style={{ marginTop: 15 }}>
        <Text style={[styles.textNormal, { fontSize: 13 }]}>Tembusan :</Text>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: 13 }]}>
            1.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: 13 }]}>
            Kepala Divisi Pendidikan
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: 13 }]}>
            2.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: 13 }]}>
            Kepala Jenjang SMP
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: 13 }]}>
            3.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: 13 }]}>
            Kepala SMPK 5 PENABUR
          </Text>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerDocument: {
    height: "11.69in",
    width: "8.26in",
    backgroundColor: "white",
    alignSelf: "center",
    paddingHorizontal: 83.52 - 18.27,
    paddingTop: 120,
    paddingBottom: 75.84,
  },
  kopSurat: { left: 0, position: "absolute", top: 0, width: "100%" },
  textNormal: {
    fontFamily: "Times New Roman",
    fontSize: 12,
    textAlign: "justify",
  },
  textBold: { fontFamily: "Times New Roman", fontWeight: "bold", fontSize: 12 },
});
