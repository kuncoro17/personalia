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

export default function KenaikanRuangPejabat() {
  return (
    <Page style={styles.containerDocument} size={"A4"}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>SURAT KEPUTUSAN</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          Nomor: 0001/KRG/JKT/SDM/01/2025
        </Text>
      </View>

      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={[styles.textNormal, { textAlign: "center" }]}>
          TENTANG
        </Text>
        <Text style={[styles.textBold, { textAlign: "center", width: "70%" }]}>
          KENAIKAN RUANG KARYAWAN TETAP BADAN PENDIDIKAN KRISTEN PENABUR JAKARTA
        </Text>
      </View>

      <View style={{ marginTop: 20, rowGap: 4 }}>
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
              Bahwa karyawan BPK PENABUR Jakarta yang namanya tersebut dalam
              keputusan ini, memenuhi syarat dan dipandang cakap untuk dinaikkan
              pangkatnya.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Mengingat</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>1.</Text>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
                Akta Notaris YBPK PENABUR No.25, tanggal 23 November 2022.
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>2.</Text>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
                Peraturan Perusahaan BPK PENABUR tanggal 2 Februari 2022 yang
                disahkan berdasarkan Surat Keputusan Direktur Jenderal Pembinaan
                Hubungan Industrial dan Jaminan Sosial Tenaga Kerja No.KEP.4/
                HI.00.00/00.0000.210906006/B/II/2022.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Memperhatikan</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>1.</Text>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
                Surat Pengangkatan No.016/SDM/SP.Pj.Kasie/12/2024 tanggal 6
                Desember 2024 sebagai Pj. Kepala Seksi di Bagian Pengendalian
                Mutu.
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>2.</Text>
              <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
                Hasil Penilaian Asesmen.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20, textAlign: "center" }]}>
        MEMUTUSKAN
      </Text>

      <View style={{ marginTop: 20, rowGap: 10 }}>
        <View style={{ flexDirection: "row" }}>
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
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>PERTAMA</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%", paddingLeft: "5" }}>
            <Text style={styles.textNormal}>
              PERTAMA : Menaikkan Ruang karyawan tetap BPK PENABUR Jakarta yang
              disebabkan adanya alih jabatan, sebagai berikut:
            </Text>

            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 20 }}>
                <Text style={styles.textNormal}>1.</Text>
              </View>

              <View
                style={{
                  width: 150,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textNormal}>Nama</Text>
                <Text style={styles.textNormal}>:</Text>
              </View>

              <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={styles.textNormal}>Nidya Kusuma Pudyastiwi</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 20 }}>
                <Text style={styles.textNormal}>2.</Text>
              </View>

              <View
                style={{
                  width: 150,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textNormal}>NIK</Text>
                <Text style={styles.textNormal}>:</Text>
              </View>

              <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={styles.textNormal}>0122151</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 20 }}>
                <Text style={styles.textNormal}>3.</Text>
              </View>

              <View
                style={{
                  width: 150,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textNormal}>Jabatan Lama</Text>
                <Text style={styles.textNormal}>:</Text>
              </View>

              <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={styles.textNormal}>
                  Staf Bagian Pengendalian Mutu
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 20 }}>
                <Text style={styles.textNormal}>4.</Text>
              </View>

              <View
                style={{
                  width: 150,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textNormal}>Jabatan Baru</Text>
                <Text style={styles.textNormal}>:</Text>
              </View>

              <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={styles.textNormal}>
                  Pj. Kepala Seksi Bagian Pengendalian Mutu
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 20 }}>
                <Text style={styles.textNormal}>5.</Text>
              </View>

              <View
                style={{
                  width: 150,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textNormal}>Golongan Lama</Text>
                <Text style={styles.textNormal}>:</Text>
              </View>

              <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={styles.textNormal}>3A5</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ width: 20 }}>
                <Text style={styles.textNormal}>5.</Text>
              </View>

              <View
                style={{
                  width: 150,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textNormal}>Golongan Baru</Text>
                <Text style={styles.textNormal}>:</Text>
              </View>

              <View style={{ flex: 1, paddingLeft: 5 }}>
                <Text style={styles.textNormal}>3C5</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>KEDUA</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              Kepada yang bersangkutan diberikan penghasilan sesuai ketentuan
              yang berlaku pada BPK PENABUR Jakarta.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>KETIGA</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              Keputusan ini diberikan kepada yang bersangkutan untuk diketahui
              dan dilaksanakan sebagaimana mestinya.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>KEEMPAT</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              Keputusan ini berlaku sejak tanggal 1 Januari 2025 dan akan
              dilakukan perbaikan apabila dikemudian hari terdapat kesalahan.
            </Text>
          </View>
        </View>
      </View>

      <View style={{ width: "40%", alignSelf: "flex-end", marginTop: 40 }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "45%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Ditetapkan di</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "55%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>Jakarta</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "45%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Pada tanggal</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "55%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              25 September 2025
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 40, alignItems: "center", width: "100%" }}>
        <Text
          style={[styles.textNormal, { textAlign: "center", width: "100%" }]}
        >
          Pengurus BPK PENABUR Jakarta
        </Text>

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
    fontSize: 12,
    fontWeight: "bold",
  },

  titleHeader: {
    fontFamily: "Times New Roman",
    textDecoration: "underline",
    fontWeight: "bold",
    fontSize: 15,
  },
});
