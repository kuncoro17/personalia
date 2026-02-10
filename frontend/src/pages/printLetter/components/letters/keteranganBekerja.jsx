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

Font.registerHyphenationCallback((word) => {
  return [word];
});

export default function KesepakatanBersama({ data }) {
  const payload = data?.data ?? data ?? {};

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

  function formatTanggalIndo(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return `${date.getDate()} ${BULAN[date.getMonth()]} ${date.getFullYear()}`;
  }

  const today = new Date();
  const bulan = String(today.getMonth() + 1).padStart(2, "0");
  const tahun = today.getFullYear();
  const namaLengkap =
    String(payload?.nama_lengkap ?? payload?.nama ?? "").trim() || "—";
  const tanggal_incative = formatTanggalIndo(payload?.tanggal_incative);
  const kop_surat = formatTanggalIndo(today);

  return (
    <Page style={styles.containerDocument} size={"A4"}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <Text style={[{ alignSelf: "flex-end" }, styles.textNormal]}>
        {kop_surat}
      </Text>

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
              001/SDM/PT/{bulan}/{tahun}
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
              Usul Pengangkatan
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.textNormal}>Yth. Sdr. {namaLengkap}</Text>
        <Text style={styles.textNormal}>di Tempat</Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 40 }]}>Dengan hormat,</Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Permohonan Saudara melalui surat tanggal {tanggal_incative} mengenai
        pengunduran diri Saudara dari BPK PENABUR Jakarta, terhitung mulai
        _______________dapat kami setujui.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Melalui surat ini kami atas nama Pengurus BPK PENABUR Jakarta
        mengucapkan terima kasih atas pengabdian Saudara selama bekerja sejak 22
        Februari 2021 s.d 9 Maret 2025 dan ditempatkan terakhir di Bagian Riset
        & Pengembangan, Gedung UKRIDA Blok E Lantai 6, Jl. Tanjung Duren Raya
        No. 4, Jakarta Barat sebagai Staff Unit.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Semoga Tuhan memberkati setiap usaha Saudara di masa depan.
      </Text>

      <View style={{ marginTop: 40, alignSelf: "flex-end", width: "50%" }}>
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

  kopSurat: {
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  },

  textNormal: {
    fontFamily: "Times New Roman",
    fontSize: 12,
    textAlign: "justify",
  },

  textBold: {
    fontFamily: "Times New Roman",
    fontWeight: "bold",
    fontSize: 12,
  },
});
