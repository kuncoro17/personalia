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

function formatAlamat(detail) {
  if (!detail) return "—";
  const parts = [];

  if (detail.alamat) parts.push(detail.alamat);

  const rt = detail.rt ? String(detail.rt).padStart(3, "0") : "";
  const rw = detail.rw ? String(detail.rw).padStart(3, "0") : "";
  if (rt || rw) parts.push(`RT ${rt || "-"} / RW ${rw || "-"}`);

  if (detail.kelurahan?.nama) parts.push(`Kel. ${detail.kelurahan.nama}`);
  if (detail.kecamatan?.nama) parts.push(`Kec. ${detail.kecamatan.nama}`);
  if (detail.kota?.nama) parts.push(detail.kota.nama);
  if (detail.provinsi?.nama) parts.push(detail.provinsi.nama);

  if (detail.kode_pos) parts.push(detail.kode_pos);

  return parts.filter(Boolean).join(", ") || "—";
}

export default function JawabanPermohonan({ data }) {
  // ✅ support 2 bentuk:
  // 1) raw response => { success, message, data: {...} }
  // 2) unwrapped => { ... }
  const payload = data?.data ? data.data : data;

  // ✅ minimal debug (yang kamu minta)
  const idKaryawan = payload?.id_karyawan ?? payload?.id ?? "—";
  const namaLengkap =
    (payload?.nama_lengkap ?? payload?.nama ?? "").toString().trim() || "—";
  const nik = (payload?.nik ?? "").toString().trim() || "—";

  // ✅ tanggal surat = today
  const tanggalSurat = formatTanggalIndo();
  const today = new Date();

  const bulan = String(today.getMonth() + 1).padStart(2, "0"); // 01–12
  const tahun = today.getFullYear();
  // ✅ nomor surat: kalau API punya, pakai. kalau belum, fallback (ubah sesuai format kantor kamu)
  const nomorSurat = payload?.nomor_surat ?? `01/SDM/Mts-Lb/${bulan}/${tahun}`;

  // ✅ field lain (sesuaikan nama field API kamu kalau beda)
  const tempat_lahir = payload?.tempat_lahir?.toString().trim() || "";
  const birth_date = payload?.birth_date?.toString().trim() || "";
  const tgl_join_penabur = payload?.tgl_join_penabur.toString().trim() || "";

  const ttl =
    tempat_lahir && birth_date
      ? `${tempat_lahir}, ${birth_date}`
      : tempat_lahir || birth_date || "—";

  const kode_golongan = payload?.kode_golongan?.toString().trim() || "";
  const getNamaUnit = (uk) => {
    const detail = uk?.unit_kerja_detail;

    return (
      detail?.seksi?.nama_sek ||
      detail?.bagian?.nama_bag ||
      detail?.divisi?.nama_div ||
      detail?.deputi?.nama_deputi ||
      detail?.direktur?.nama_direktur ||
      null
    );
  };

  const divisiList = Array.isArray(data?.unitKerja)
    ? data.unitKerja.map((uk) => getNamaUnit(uk)).filter(Boolean)
    : data?.unitKerja
      ? [getNamaUnit(data.unitKerja)].filter(Boolean)
      : [];
  const jabatan =
    payload?.unit_kerja_karyawan?.[0]?.jabatan?.jabatan?.toString().trim() ||
    "";

  const jabatan_golongan =
    jabatan && kode_golongan
      ? `${jabatan}, ${kode_golongan}`
      : jabatan || kode_golongan || "—";

  // alamat: pakai tempat tinggal dulu, fallback ktp
  const alamatTempatTinggal = formatAlamat(payload?.alamatTempatTinggalDetail);
  const alamatKtp = formatAlamat(payload?.alamatKtpDetail);
  const alamatFinal =
    alamatTempatTinggal !== "—" ? alamatTempatTinggal : alamatKtp;

  // contoh tanggal efektif mutasi (kalau ada)
  const tanggalEfektif =
    payload?.tanggal_efektif_mutasi ?? payload?.effective_date ?? "1 Juli 2024";

  return (
    <Page style={styles.containerDocument} size="A4">
      <Image src="/assets/images/kop3.png" style={styles.kopSurat} fixed />

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
              Jawaban atas Permohonan Mutasi/Lolos Butuh
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.textNormal}>Yth. Pengurus BPK PENABUR Cirebon</Text>
        <Text style={styles.textNormal}>u.p. Bidang Kepegawaian</Text>
        <Text style={styles.textNormal}>Jl. Dr. Cipto Mangunkusumo No.24</Text>
        <Text style={styles.textNormal}>Cirebon 45131</Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Salam dalam Kasih Tuhan Yesus Kristus
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Kami menjumpai Bapak/Ibu dengan doa dan harapan kiranya seluruh jajaran
        BPK PENABUR Cirebon dalam keadaan sehat dan dalam perlindungan Tuhan.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Menjawab surat Pengurus BPK PENABUR Cirebon nomor{" "}
        {payload?.nomor_surat_asal ?? "066/CRB/JKT/C00/03/2024"} tanggal
        {tgl_join_penabur} perihal permohonan mutasi, dengan ini Pengurus BPK
        PENABUR Jakarta menyetujui untuk menerima mutasi atas:
      </Text>

      <View style={{ paddingLeft: 30, marginTop: 15 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>Nama</Text>
          <Text style={styles.textNormal}>: {namaLengkap}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>
            Tempat, Tanggal Lahir
          </Text>
          <Text style={styles.textNormal}>: {ttl ?? "—"}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>NIK</Text>
          <Text style={styles.textNormal}>: {nik}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>
            Jabatan, Golongan
          </Text>
          <Text style={styles.textNormal}>: {jabatan_golongan}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>Alamat</Text>
          <Text style={styles.textNormal}>: {alamatKtp}</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>
            Penempatan Baru
          </Text>
          <Text style={styles.textNormal}>: {divisiList}</Text>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Yang bersangkutan telah lolos menjalani serangkaian tes rekrutmen dan
        telah menyetujui ketentuan-ketentuan kepegawaian di BPK PENABUR Jakarta.
        Mutasi dari BPK PENABUR Cirebon ke BPK PENABUR Jakarta terhitung mulai
        tanggal {tanggalEfektif}.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Demikian jawaban ini kami sampaikan. Terima kasih atas perhatian dan
        kerjasamanya. Tuhan Yesus Memberkati pelayanan kita bersama.
      </Text>

      <View style={{ marginRight: 30, alignItems: "center", marginTop: 20 }}>
        <Text style={styles.textNormal}>Salam kami,</Text>
        <Text style={styles.textNormal}>Pengurus BPK PENABUR Jakarta</Text>

        <View style={{ flexDirection: "row", columnGap: 30 }}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.textBold,
                { textDecoration: "underline", marginTop: 70, color: "blue" },
              ]}
            >
              Ir. Kenny Lim
            </Text>
            <Text style={styles.textNormal}> Ketua</Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.textBold,
                { textDecoration: "underline", marginTop: 70, color: "blue" },
              ]}
            >
              Ir. Yosafat Adrian Wiguna, MBA
            </Text>
            <Text style={styles.textNormal}>Sekretaris II</Text>
          </View>
        </View>
      </View>

      <View break>
        <Text style={[styles.textNormal, { fontSize: 11 }]}>Tembusan :</Text>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: 11 }]}>
            1.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: 11 }]}>
            Pengurus Yayasan BPK PENABUR
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: 11 }]}>
            2.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: 11 }]}>
            Ketua Bidang SDM BPK PENABUR Jakarta
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: 11 }]}>
            3.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: 11 }]}>
            Deputi Direktur Pelaksana BPK PENABUR Jakarta
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
