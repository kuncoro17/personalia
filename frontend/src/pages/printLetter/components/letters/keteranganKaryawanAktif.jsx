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

export default function KeteranganKaryawanAktif() {
  return (
    <Page style={styles.containerDocument} size={"A4"}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>SURAT KETERANGAN</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          Nomor : 01/SDM/Sket/01/2025
        </Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Yang bertandatangan di bawah ini menerangkan bahwa :
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
            <Text style={styles.textNormal}>Desimawati Datubara</Text>
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
            <Text style={styles.textNormal}>0119170</Text>
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
            <Text style={styles.textNormal}>Jabatan</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>

          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.textNormal}>Kepala Seksi</Text>
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
            <Text style={styles.textNormal}>Alamat</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>

          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={styles.textNormal}>
              Bah Raja II RT.000 RW.000 Kel. Bah Bolon Tongah Kec. Panei,
              Simalungun, Sumatera Utara
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 15 }]}>
        adalah benar karyawan tetap BPK PENABUR Jakarta yang bekerja dari
        tanggal 26 Agustus 2019 dan sampai sekarang masih aktif bekerja.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Demikian Surat Keterangan ini kami buat untuk keperluan pengajuan KPR di
        Bank Tabungan Negara (BTN) Syariah.
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
