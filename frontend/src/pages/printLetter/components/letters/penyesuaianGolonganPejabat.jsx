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

export default function PenyesuaianGolonganPejabat() {
  return (
    <Page style={styles.containerDocument} size={"A4"}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <Text style={[{ alignSelf: "flex-end" }, styles.textNormal]}>
        1 Januari 2025
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
              001/SDM/PT/01/2025
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
              Penyesuaian Golongan Struktural Baru
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
              1 (satu) berkas
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
        Berdasarkan Pedoman Penetapan Golongan Kepangkatan dan Penyesuaian
        Golongan Kepangkatan Pejabat Struktural yang berlaku tanggal 1 Juli
        2022, perkenankanlah kami sampaikan permohonan penerbitan Surat
        Keputusan Penyesuaian Golongan bagi Pejabat Struktural baru sebanyak 2
        (dua) orang dilengkapi dengan Summary Hasil Asesmen dan Surat
        Pengangkatan.
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
