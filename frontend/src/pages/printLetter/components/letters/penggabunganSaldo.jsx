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

export default function PenggabunganSaldo() {
  return (
    <Page style={styles.containerDocument} size={"A4"}>
      <Image src={"/assets/images/kop3.png"} style={styles.kopSurat} fixed />

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
              01/SDM/BPJS/01/2025
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
              Permohonan Penggabungan Saldo
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
              KTP, Paklaring & Kartu Peserta
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.textNormal}>Yth. Kepala Kantor Cabang</Text>
        <Text style={styles.textNormal}>
          Badan Penyelenggara Jaminan Sosial (BPJS) Ketenagakerjaan
        </Text>
        <Text style={styles.textNormal}>Jl. Raya Daan Mogot No.100A, RW.3</Text>
        <Text style={styles.textNormal}>Jelambar, Grogol petamburan</Text>
        <Text style={styles.textNormal}>Jakarta Barat</Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>Dengan hormat,</Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Bersama ini kami mengajukan permohonan penggabungan saldo Kartu
        Kepesertaan BPJS Ketenagakerjaan untuk tenaga kerja kami dengan data
        sebagai berikut :
      </Text>

      <View style={{ marginTop: 20, flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: 20 }]}>1.</Text>
        <Text style={[styles.textNormal, { width: 100 }]}>Nama</Text>
        <Text style={styles.textNormal}>: Christian Widodo</Text>
      </View>

      <View style={{ marginTop: 1.5, paddingLeft: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 100 }]}>No. KPJ Lama</Text>
          <Text style={styles.textNormal}>: 22020997882</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 100 }]}>No. KPJ Baru</Text>
          <Text style={styles.textNormal}>: 22020997882</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 100 }]}>NIK KTP</Text>
          <Text style={styles.textNormal}>: 3201 0226 1295 0008</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 100 }]}>ID Pegawai</Text>
          <Text style={styles.textNormal}>: 23241</Text>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Demikian kami sampaikan surat permohonan ini, atas perhatian dan
        kerjasama yang baik kami ucapkan terima kasih.
      </Text>

      <View
        style={{
          alignSelf: "flex-end",
          marginRight: 30,
          marginTop: 20,
        }}
      >
        <View>
          <Text style={styles.textNormal}>Hormat kami,</Text>
          <Text style={styles.textNormal}>BPK PENABUR Jakarta</Text>
        </View>

        <Text
          style={[
            styles.textBold,
            { textDecoration: "underline", marginTop: 70, color: "blue" },
          ]}
        >
          Dena Ekawati
        </Text>
        <Text style={styles.textNormal}>Kepala Bagian PPKSDM</Text>
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
