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

export default function PengangkatanPJStrukturalBaruStruktural() {
  return (
    <Page style={styles.containerDocument} size={"A4"}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>SURAT PENGANGKATAN</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          Nomor : 016/SDM/SP.Pj.Kasie/12/2024
        </Text>
      </View>

      <Text style={[styles.textBold, { textAlign: "center" }]}>
        PENGURUS BADAN PENDIDIKAN KRISTEN PENABUR JAKARTA
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
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>1.</Text>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
                Kebutuhan Kepala Seksi Manajemen Evaluasi di Bagian Pengendalian
                Mutu.
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>2.</Text>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
                Keputusan Rapat Pleno Pengurus BPK PENABUR Jakarta, tanggal 17
                Januari 2020, tentang Masa Jabatan Posisi Struktural (yang bukan
                Kepala Sekolah).
              </Text>
            </View>
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
            <Text style={[styles.textBold, { paddingLeft: 5, color: "blue" }]}>
              Keputusan Rapat Sub Bidang Bagian Pengendalian Mutu tanggal 30
              Oktober 2024 dan Hasil Asesmen tanggal 15 & 16 Agustus 2024.
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
            <Text style={[styles.textBold, { paddingLeft: 5, color: "blue" }]}>
              Sdr. Nidya Kusuma Pudyastiwi
            </Text>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              sebagai Pj. Kepala Seksi Manajemen Evaluasi di Bagian Pengendalian
              Mutu.
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 15 }]}>
        Dengan ketentuan - ketentuan sebagai berikut :
      </Text>

      <View style={{ rowGap: 4, marginTop: 10 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textNormal, { width: 20 }]}>a.</Text>
            <Text style={styles.textNormal}>
              Pengangkatan ini berlaku mulai tanggal 1 Januari 2025, dengan masa
              jabatan 1 (satu) tahun sebagai Pejabat Kepala Seksi Manajemen
              Evaluasi;
            </Text>
          </View>
          <Text style={styles.textNormal}>:</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textNormal, { width: 20 }]}>b.</Text>
            <Text style={styles.textNormal}>
              BPK PENABUR Jakarta melakukan evaluasi kinerja dan capaian yang
              bersangkutan selama 1 (satu) tahun untuk menetapkan perpanjangan
              masa jabatan 2 (dua) tahun selanjutnya sebagai Kepala Seksi
              Manajemen Evaluasi;
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textNormal, { width: 20 }]}>c.</Text>
            <Text style={styles.textNormal}>
              Karyawan bersedia menaati dan menjalani evaluasi kerja, Mutasi,
              Rotasi, Promosi dan Demosi yang ditetapkan oleh BPK PENABUR
              Jakarta;
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textNormal, { width: 20 }]}>d.</Text>
            <Text style={styles.textNormal}>
              BPK PENABUR Jakarta berhak atas pertimbangannya sendiri untuk
              melakukan Mutasi, Rotasi, Promosi dan Demosi selama periode Surat
              Pengangkatan ini;
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textNormal, { width: 20 }]}>e.</Text>
            <Text style={styles.textNormal}>
              Segala sesuatu akan diubah dan diperhitungkan sebagaimana
              mestinya, apabila kemudian hari ternyata terdapat kekeliruan dalam
              Surat Pengangkatan ini.
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 15 }]}>
        Demikian Surat Pengangkatan ini dibuat, semoga Saudara dapat menerima
        dan melaksanakan tugas Saudara dengan baik.
      </Text>

      <View
        style={{
          alignSelf: "center",
          marginRight: 30,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={styles.textNormal}>
          Jakarta, <Text style={{ color: "blue" }}>tanggal surat</Text>
        </Text>
        <Text style={styles.textNormal}>
          Badan Pendidikan Kristen PENABUR Jakarta
        </Text>

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
            <Text style={styles.textNormal}>Ketua</Text>
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
