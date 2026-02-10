import { Page, Text, Image, StyleSheet, View, Font } from "@react-pdf/renderer";

Font.register({
  family: "Cambria",
  fonts: [
    { src: "/assets/fonts/Cambria/cambria-regular.ttf" },
    { src: "/assets/fonts/Cambria/cambria-bold.ttf", fontWeight: "bold" },
  ],
});

Font.registerHyphenationCallback((word) => {
  return [word];
});

export default function PerubahananAlihJabatan() {
  return (
    <Page style={styles.containerDocument} size={["8.27in", "11.69in"]}>
      <Image src={"/assets/images/kop3.png"} style={styles.kopSurat} fixed />

      <Text
        style={[{ alignSelf: "flex-end", marginTop: 12 }, styles.textNormal]}
      >
        1 Januari 2025
      </Text>

      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "0.79in" }}>
          <Text style={styles.textNormal}>Nomor</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.textNormal]}>: 01/SDM/YP/01/2025</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "0.79in" }}>
          <Text style={styles.textNormal}>Perihal</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.textNormal]}>: Perubahan Alih Jabatan</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "0.79in" }}>
          <Text style={styles.textNormal}>Lampiran</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.textNormal]}>
            : Daftar Karyawan dan Penilaian KKPK
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={styles.textNormal}>Yth. Pengurus Yayasan BPK PENABUR</Text>
        <Text style={styles.textNormal}>Jalan Tanjung Duren Raya No. 4</Text>
        <Text style={styles.textNormal}>Gedung UKRIDA Blok E lantai 5</Text>
        <Text style={styles.textNormal}>Jakarta Barat</Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 24 }]}>Dengan hormat,</Text>

      <Text style={[styles.textNormal, { marginTop: 12 }]}>
        Bersama ini perkenankanlah kami sampaikan permohonan penerbitan Surat
        Keputusan Mutasi Jabatan bagi Tenaga Pendidik dan Tenaga Kependidikan
        sebanyak 12 orang yang telah menjalani masa evaluasi Alih Profesi dan
        direkomendasikan oleh Kepala Unit Kerja untuk perubahan jabatan
        berdasarkan Penilaian KKPK.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 12 }]}>
        Demikian surat permohonan ini kami sampaikan, atas perhatian dan
        kerjasamanya kami mengucapkan terima kasih.
      </Text>

      <View
        style={{
          marginTop: 36,
          width: "4.19in",
          marginLeft: "1.05in",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={styles.textNormal}>Hormat Kami,</Text>
          <Text style={styles.textNormal}>Pengurus BPK PENABUR Jakarta</Text>
        </View>

        <View style={{ marginTop: 60, flexDirection: "row" }}>
          <View style={{ width: "1.64in", alignItems: "center" }}>
            <Text style={[styles.textBold, { textDecoration: "underline" }]}>
              Ir. Kenny Lim
            </Text>
            <Text style={styles.textNormal}>Ketua</Text>
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.textBold, { textDecoration: "underline" }]}>
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
    backgroundColor: "white",
    alignSelf: "center",
    paddingLeft: "1.18in",
    paddingRight: "0.98in",
    paddingTop: 116,
    paddingBottom: "0.39in",
  },

  kopSurat: {
    left: 0,
    position: "absolute",
    top: 0,
    width: "100%",
  },

  textNormal: {
    fontFamily: "Cambria",
    fontSize: 12,
    textAlign: "justify",
  },

  textBold: {
    fontFamily: "Cambria",
    fontWeight: "bold",
    fontSize: 12,
  },
});
