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

export default function KeteranganBPJSKetenagakerjaan() {
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
              001/SDM/Um/01/2025
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
              Pencairan Saldo BPJS Ketenagakerjaan
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.textNormal}>
          Yth.
          <Text style={styles.textBold}> BPJS Ketenagakerjaan</Text>
        </Text>
        <Text style={styles.textNormal}>di Tempat</Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 40 }]}>Dengan hormat,</Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Yang bertandatangan di bawah ini menerangkan bahwa:
      </Text>

      <View style={{ paddingHorizontal: 20, marginTop: 20, rowGap: 10 }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "40%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={styles.textNormal}>Nama</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>

          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.textNormal}>Resvina</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "40%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={styles.textNormal}>NIK</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>

          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.textNormal}>0121041</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "40%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={styles.textNormal}>Penempatan</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>

          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.textNormal}>Bagian Riset & Pengembangan</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "40%",
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text style={styles.textNormal}>Nomor KPJ</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>

          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.textNormal}>21017564184</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 15 }]}>
        adalah benar karyawan BPK PENABUR Jakarta yang bekerja dari tanggal 22
        Februari 2021 dan mulai tanggal 10 Maret 2025 karyawan tersebut di atas
        telah berhenti/pensiun.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Demikian surat ini kami sampaikan sebagai kelengkapan untuk pengurusan
        penarikan Jaminan Ketenagakerjaan (BPJS Ketenagakerjaan).
      </Text>

      <View style={{ marginTop: 40, alignSelf: "flex-end", width: "50%" }}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.textNormal}>Jakarta, 1 Januari 2025</Text>
          <Text style={styles.textNormal}>BPK PENABUR Jakarta</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 80, width: "100%" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.textNormal, { textDecoration: "underline" }]}>
              Dena Ekawati
            </Text>

            <Text style={styles.textNormal}>Kepala Bagian PPKSDM</Text>
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

  titleHeader: {
    fontFamily: "Times New Roman",
    textDecoration: "underline",
    fontWeight: "bold",
    fontSize: 15,
  },
});
