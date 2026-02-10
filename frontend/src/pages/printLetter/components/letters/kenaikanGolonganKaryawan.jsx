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

export default function KenaikanGolonganKaryawan({ data }) {
  // support raw response {success,message,data:{...}} atau unwrapped {...}
  const payload = data?.data ? data.data : data;

  const tanggalSurat = formatTanggalIndo(); // ✅ today

  // kalau endpoint ini memang bukan per-karyawan, tetap aman (fallback "—")
  const idKaryawan = payload?.id_karyawan ?? payload?.id ?? "—";
  const namaLengkap =
    (payload?.nama_lengkap ?? payload?.nama ?? "").toString().trim() || "—";

  const nomorSurat = payload?.nomor_surat ?? "001/SDM/PT/01/2025";
  const perihal = payload?.perihal ?? "Usul Pengangkatan";
  const lampiran = payload?.lampiran ?? "1 (satu) berkas";

  // isi surat bisa dinamis kalau API menyediakan
  const tahunKenaikan = payload?.tahun ?? "2024";
  const jumlahOrang = payload?.jumlah_orang ?? 97;
  const tanggalBerlaku = payload?.tanggal_berlaku ?? "1 Oktober 2024";
  const referensiPedoman =
    payload?.referensi_pedoman ??
    "Pedoman Kepangkatan dan Kenaikan Pangkat Karyawan (KKPK) Tenaga Kependidikan berlaku 1 Juli 2022";

  return (
    <Page style={styles.containerDocument} size="A4">
      <Image src="/assets/images/kop.png" style={styles.kopSurat} fixed />

      {/* ✅ tanggal surat today */}
      <Text style={[{ alignSelf: "flex-end" }, styles.textNormal]}>
        {tanggalSurat}
      </Text>

      {/* ✅ DEBUG minimal (hapus kalau sudah ok) */}
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
              {perihal}
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
            <Text style={styles.textNormal}>Lampiran</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              {lampiran}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.textNormal}>
          Yth. Sdr. Pengurus Yayasan BPK PENABUR
        </Text>
        <Text style={styles.textNormal}>Gedung UKRIDA Blok E Lantai 5</Text>
        <Text style={styles.textNormal}>Jl. Tanjung Duren Raya No. 4</Text>
        <Text style={styles.textNormal}>Jakarta Barat</Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 40 }]}>Dengan hormat,</Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Berdasarkan {referensiPedoman}, perkenankanlah kami sampaikan permohonan
        penerbitan Surat Keputusan Kenaikan Golongan bagi karyawan BPK PENABUR
        Jakarta untuk tahun {tahunKenaikan}.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Dengan ini kami lampirkan Daftar Nama Tenaga Pendidik dan/atau Tenaga
        Kependidikan sebanyak {jumlahOrang} (Sembilan puluh tujuh) orang untuk
        mendapat kenaikan golongan berlaku per {tanggalBerlaku}.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Demikian surat permohonan ini kami sampaikan, atas perhatian dan
        kerjasamanya kami mengucapkan terima kasih.
      </Text>

      <View style={{ marginTop: 40, alignItems: "center", width: "100%" }}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.textNormal}>Hormat kami,</Text>
          <Text style={styles.textNormal}>Pengurus BPK PENABUR Jakarta</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 80, width: "100%" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.textNormal, { textDecoration: "underline" }]}>
              Ir. Kenny Lim
            </Text>
            <Text style={styles.textNormal}>Ketua</Text>
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.textNormal, { textDecoration: "underline" }]}>
              Ir. Yosafat Adrian Wiguna, MBA
            </Text>
            <Text style={styles.textNormal}>Sekretaris II</Text>
          </View>
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
