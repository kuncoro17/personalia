import { Page, Text, Image, StyleSheet, View, Font } from "@react-pdf/renderer";

Font.register({
  family: "Cambria",
  fonts: [
    { src: "/assets/fonts/Cambria/cambria-regular.ttf" },
    { src: "/assets/fonts/Cambria/cambria-bold.ttf", fontWeight: "bold" },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const pad2 = (n) => String(n).padStart(2, "0");
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

function formatTanggalIndo(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return `${dt.getDate()} ${BULAN[dt.getMonth()]} ${dt.getFullYear()}`;
}

function formatTanggalRangeIndo(start, end) {
  const s = formatTanggalIndo(start);
  const e = formatTanggalIndo(end);
  if (s === "—" && e === "—") return "—";
  return `${s} – ${e}`;
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

export default function Harian({ data }) {
  // ✅ support 2 bentuk:
  // 1) letterData = response.data (raw) -> { success, message, data: {...} }
  // 2) letterData = response.data.data (unwrapped) -> { id_karyawan, nama_lengkap, ... }
  const payload = data?.data ? data.data : data;

  // ✅ tanggal & nomor surat today (bisa kamu ganti format sesuai standar surat kamu)
  const today = new Date();
  const nomorSurat =
    payload?.nomor_surat ??
    `001/SDM/TKL/${pad2(today.getMonth() + 1)}/${today.getFullYear()}`;

  // ✅ field karyawan (sesuaikan kalau nama field di API berbeda)
  const idKaryawan = payload?.id_karyawan ?? payload?.id ?? "—";
  const nama =
    (payload?.nama_lengkap ?? payload?.nama ?? "").toString().trim() || "—";
  const nik = (payload?.nik ?? "").toString().trim() || "—";

  // alamat: pakai tempat tinggal dulu, fallback ktp
  const alamatTempatTinggal = formatAlamat(payload?.alamatTempatTinggalDetail);
  const alamatKtp = formatAlamat(payload?.alamatKtpDetail);
  const alamat = alamatTempatTinggal !== "—" ? alamatTempatTinggal : alamatKtp;

  // jabatan/lokasi/atasan/tanggal kontrak (fallback aman)
  const jabatan =
    data?.unit_kerja_karyawan?.[0]?.jabatan?.jabatan?.toString().trim() || "—";
  const lokasiKerja =
    (payload?.lokasi_kerja ?? payload?.unit_kerja ?? "—").toString().trim() ||
    "—";
  const atasanLangsung =
    (payload?.atasan_langsung ?? payload?.atasan ?? "—").toString().trim() ||
    "—";

  const tgl_join_penabur_jkt =
    payload?.tgl_join_penabur_jkt ??
    payload?.tgl_join_penabur_jkt ??
    payload?.start_date;
  const tgl_inactive =
    payload?.tgl_inactive ?? payload?.tgl_inactive ?? payload?.end_date;
  const masaPerjanjian = formatTanggalRangeIndo(
    tgl_join_penabur_jkt,
    tgl_inactive,
  );

  return (
    <Page style={styles.containerDocument} size={["8.27in", "11.69in"]}>
      <Image src="/assets/images/kop.png" style={styles.kopSurat} fixed />

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>PERJANJIAN KERJA HARIAN</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          Nomor : {nomorSurat}
        </Text>
      </View>

      {/* ✅ DEBUG ringkas biar kamu yakin datanya masuk */}
      <View style={{ marginTop: 6 }}>
        <Text style={{ fontSize: 8 }}>
          DEBUG: id_karyawan={String(idKaryawan)} | nama_lengkap={nama}
        </Text>
      </View>

      <Text style={[{ marginTop: 24 }, styles.textNormal]}>
        Dengan mengucap syukur kepada Tuhan Yang Maha Kasih, kami yang
        bertandatangan di bawah ini :
      </Text>

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <Text style={[{ width: "0.3in" }, styles.textNormal]}>1.</Text>
        <Text style={styles.textNormal}>
          BPK PENABUR Jakarta, yang dalam hal ini diwakili oleh{" "}
          <Text style={{ color: "blue" }}>Irwanto Hartono</Text> Selaku{" "}
          <Text style={{ color: "blue" }}>Plt. Direktur Pelaksana</Text>, untuk
          selanjutnya disebut “Pemberi Kerja” dan
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <Text style={[{ width: "0.3in" }, styles.textNormal]}>2.</Text>
        <Text style={styles.textNormal}>
          Saudara{" "}
          <Text style={{ color: "blue" }}>
            {nama}
            {nik !== "—" ? ` (${nik})` : ""}
          </Text>
          , beralamat di <Text style={{ color: "blue" }}>{alamat}</Text>, untuk
          selanjutnya disebut “Karyawan”
        </Text>
      </View>

      <Text style={[{ marginTop: 12 }, styles.textNormal]}>
        menyepakati PERJANJIAN KERJA MAGANG, dengan ketentuan sebagai berikut :
      </Text>

      <View style={{ width: "6.38in" }}>
        {/* 1 */}
        <RowTable no="1." label="Jabatan Karyawan" value={jabatan} />

        {/* 2 */}
        <RowTable no="2." label="Tugas" value={lokasiKerja} />

        {/* 3 */}
        <RowTable
          no="3."
          label="Masa Perjanjian"
          value={`Tanggal ${tgl_join_penabur_jkt}`}
        />

        {/* 4 (tetap statis) */}
        <RowTable
          no="4."
          label="Hari & Jam Kerja"
          value="Senin – Jumat (07.00 – 16.00 wib)"
        />

        {/* 5 (tetap statis) */}
        <RowTable
          no="5."
          label="Upah Magang"
          value="Rp. 217.000; per hari + uang hadir Rp. 56.000; per hari"
          flexValue
        />

        {/* 6 */}
        <RowTable
          no="6."
          label="Tunjangan Lembur"
          value="Rp. 26.000; per jam"
        />

        {/* 7 */}
        <RowTable no="7." label="Tunjangan Lain" value="Tidak ada" />

        {/* 8 */}
        <RowTable
          no="8."
          label="Pesangon setelah berakhirnya Perjanjian ini"
          value="Tidak ada"
          flexValue
        />

        {/* 9 */}
        <RowTable no="9." label="Atasan Operasional" value={atasanLangsung} />

        {/* 10 */}
        <RowTable
          no="10."
          label="Ketentuan lain"
          value="Mengikuti Peraturan BPK PENABUR Jakarta."
          flexValue
        />
      </View>

      <Text style={[{ marginTop: 12 }, styles.textNormal]}>
        Pemberi Kerja atau Karyawan dapat memutuskan Perjanjian ini dengan
        memberitahu pihak lainnya sehari sebelumnya dan Karyawan memperoleh Upah
        sesuai dengan hari kerja yang telah dilaluinya.
      </Text>

      <Text style={[{ marginTop: 12 }, styles.textNormal]}>
        Perjanjian ini ditandatangani pada tanggal tersebut di bawah ini oleh
        Pemberi Kerja dan Karyawan sebagai kesepakatan Para Pihak.
      </Text>

      <View style={{ flexDirection: "row", marginTop: 24 }}>
        <Text style={[styles.textNormal, { width: "3.94in" }]}>
          BPK PENABUR Jakarta,
        </Text>
        <Text style={[styles.textNormal]}>Karyawan,</Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 72 }}>
        <Text
          style={[
            styles.textNormal,
            { textDecoration: "underline", width: "3.94in" },
          ]}
        >
          Irwanto Hartono
        </Text>
        <Text style={[styles.textNormal, { textDecoration: "underline" }]}>
          {nama}
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: "3.94in" }]}>
          Tanggal {formatTanggalIndo(today)}
        </Text>
        <Text style={[styles.textNormal]}>
          Tanggal {formatTanggalIndo(today)}
        </Text>
      </View>
    </Page>
  );
}

/** helper row tabel: biar bentuknya sama dengan punyamu */
function RowTable({ no, label, value, flexValue = false }) {
  return (
    <View
      style={{
        borderTopWidth: no === "1." ? 0.5 : 0,
        borderBottomWidth: 0.5,
        borderColor: "blue",
        marginTop: no === "1." ? 12 : 0,
        flexDirection: "row",
      }}
    >
      <Text
        style={[
          styles.textNormal,
          {
            width: "0.37in",
            textAlign: "center",
            borderColor: "blue",
            borderLeftWidth: 0.5,
            borderRightWidth: 0.5,
          },
        ]}
      >
        {no}
      </Text>

      <Text
        style={[
          styles.textNormal,
          {
            width: "2.21in",
            borderColor: "blue",
            borderRightWidth: 0.5,
            paddingLeft: "0.09in",
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.textNormal,
          {
            flex: flexValue ? 3 : 1,
            borderColor: "blue",
            borderRightWidth: 0.5,
            paddingLeft: "0.13in",
            color:
              label === "Jabatan Karyawan" ||
              label === "Tugas" ||
              label === "Masa Perjanjian" ||
              label === "Atasan Operasional"
                ? "blue"
                : undefined,
          },
        ]}
      >
        {value || "—"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerDocument: {
    backgroundColor: "white",
    alignSelf: "center",
    paddingHorizontal: "0.87in",
    paddingTop: 126,
    paddingBottom: "0.79in",
  },
  containerHeader: { alignItems: "center", marginBottom: 10 },
  kopSurat: { left: 0, position: "absolute", top: 0, width: "100%" },
  textNormal: { fontFamily: "Cambria", fontSize: 12, textAlign: "justify" },
  textBold: { fontFamily: "Cambria", fontWeight: "bold", fontSize: 12 },
  titleHeader: {
    fontFamily: "Cambria",
    textDecoration: "underline",
    fontWeight: "bold",
    fontSize: 14,
  },
});
