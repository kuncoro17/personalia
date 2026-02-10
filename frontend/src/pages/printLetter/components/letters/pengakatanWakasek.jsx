import {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  View,
  Font,
} from "@react-pdf/renderer";

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

export default function PengangkatanWakasek() {
  return (
    <Page style={styles.containerDocument} size={"A4"}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>SURAT PENGANGKATAN</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          Nomor : 001/SDM/SP.Wakasek/08/2024
        </Text>
      </View>

      <Text style={[styles.textBold, { textAlign: "center" }]}>
        BADAN PENDIDIKAN KRISTEN PENABUR JAKARTA
      </Text>

      <View style={{ marginTop: 30 }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Menimbang</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              Bahwa masih dibutuhkan Tenaga Pendidik di BPK PENABUR Jakarta, dan
              perlunya
              <Text style={[styles.textNormal, { color: "blue" }]}>
                Wakil Kepala Sekolah Bidang Kesiswaan di SPK SMPK & SMAK 8
                PENABUR.
              </Text>
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Membaca</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text
              style={[styles.textNormal, { paddingLeft: 5, color: "blue" }]}
            >
              Berdasarkan Formasi Wakil Kepala Sekolah Jenjang SPK Tahun
              Pelajaran 2024/2025 tanggal 13 Juni 2024.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Menetapkan</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              <Text style={[styles.textBold, { color: "blue" }]}>
                Sdr. Herningtyas Kurniawati
              </Text>
              Sebagai
              <Text style={[styles.textBold, { color: "blue" }]}>
                Wakil Kepala Sekolah Bidang Kesiswaan di SPK SMPK & SMAK 8
                PENABUR.
              </Text>
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 15 }]}>
        Dalam dinas Badan Pendidikan Kristen PENABUR Jakarta dengan
        ketentuan-ketentuan sebagai berikut
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 20 }]}>a)</Text>
          <Text style={styles.textNormal}>
            Pengangkatan ini berlaku mulai tanggal{" "}
            <Text style={[styles.textBold, { color: "blue" }]}>
              1 Juli 2024
            </Text>{" "}
            s.d{" "}
            <Text style={[styles.textBold, { color: "blue" }]}>
              30 Juni 2025;
            </Text>
          </Text>
        </View>
        <Text style={styles.textNormal}>:</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 20 }]}>b)</Text>
          <Text style={styles.textNormal}>
            Segala sesuatu akan diubah dan diperhitungkan sebagaimana mestinya,
            apabila di kemudian hari ternyata terdapat kekeliruan dalam Surat
            Pengangkatan ini.
          </Text>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 15 }]}>
        Demikian Surat Pengangkatan ini dibuat, semoga Saudara dapat menerima
        dan melaksanakan tugas Saudara dengan baik.
      </Text>

      <View
        style={{
          alignSelf: "flex-end",
          marginRight: 30,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={styles.textNormal}>
          Jakarta, <Text style={{ color: "blue" }}>tanggal surat</Text>
        </Text>
        <Text style={styles.textNormal}>BPK PENABUR Jakarta,</Text>

        <Text
          style={[
            styles.textBold,
            { textDecoration: "underline", marginTop: 70, color: "blue" },
          ]}
        >
          Irani Waruwu
        </Text>
        <Text style={styles.textNormal}> Plt. Direktur Pelaksana</Text>
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

  containerHeader: {
    alignItems: "center",
    marginBottom: 10,
  },

  kopSurat: {
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  },

  textBold: {
    fontFamily: "Times New Roman",
    fontSize: 12,
    fontWeight: "bold",
  },

  textNormal: {
    fontFamily: "Times New Roman",
    fontSize: 12,
    textAlign: "justify",
  },

  titleHeader: {
    fontFamily: "Times New Roman",
    textDecoration: "underline",
    fontWeight: "bold",
    fontSize: 16,
  },
});
