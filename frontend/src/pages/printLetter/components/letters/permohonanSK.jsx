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

export default function PermohonanSK() {
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
              01/SDM/YP/01/2025
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
              Permohonan Surat Keputusan Mutasi/Lolos Butuh
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.textNormal}>Yth. Pengurus Yayasan BPK PENABUR</Text>
        <Text style={styles.textNormal}>Jalan Tanjung Duren Raya No. 4</Text>
        <Text style={styles.textNormal}>Gedung UKRIDA Blok E lantai 5</Text>
        <Text style={styles.textNormal}>Jakarta Barat</Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>Dengan hormat,</Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Sehubungan dengan surat Pengurus BPK PENABUR Cirebon nomor
        066/CRB/JKT/C00/03/2024 tanggal 27 Maret 2024 perihal permohonan
        mutasi/lolos butuh, dengan ini kami mohon dibuatkan Surat Keputusan
        tentang mutasi karyawan tetap sebagai berikut :
      </Text>

      <View style={{ paddingLeft: 30, marginTop: 15 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>Nama</Text>
          <Text style={styles.textNormal}>: Dwi Afri Damayanti</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>NIK</Text>
          <Text style={styles.textNormal}>: 0816015</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>Golongan</Text>
          <Text style={styles.textNormal}>: 2C3</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>Jabatan</Text>
          <Text style={styles.textNormal}>: Tenaga Kependidikan</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>Tempat Lama</Text>
          <Text style={styles.textNormal}>
            : Kantor Sekretariat BPK PENABUR Cirebon
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>Tempat Baru</Text>
          <Text style={styles.textNormal}>: SMAK 4 BPK PENABUR Jakarta</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "30%" }]}>
            Efektif tanggal mutasi
          </Text>
          <Text style={styles.textNormal}>: 1 Juli 2024.</Text>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Demikian surat permohonan ini kami sampaikan, atas perhatian dan
        kerjasamanya kami mengucapkan terima kasih.
      </Text>

      <View
        style={{
          marginRight: 30,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={styles.textNormal}>Hormat kami,</Text>
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
        <Text style={[styles.textNormal, { fontSize: "11px" }]}>
          Tembusan :
        </Text>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: "11px" }]}>
            1.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: "11px" }]}>
            Pengurus BPK PENABUR Cirebon
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: "11px" }]}>
            2.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: "11px" }]}>
            Dana Pensiun BPK PENABUR
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: "11px" }]}>
            3.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: "11px" }]}>
            Ketua Bidang SDM BPK PENABUR Jakarta
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: "11px" }]}>
            4.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: "11px" }]}>
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
