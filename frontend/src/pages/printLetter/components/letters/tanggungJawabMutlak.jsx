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

export default function TanggungJawabMutlak() {
  return (
    <Page style={styles.containerDocument} size={["8.5in", "13in"]}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <Text
        style={[{ alignSelf: "flex-end", marginTop: 12 }, styles.textNormal]}
      >
        1 Januari 2025
      </Text>

      <View>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "0.59in",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Nomor</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.textNormal}>: 01/SDM/BPJS/01/2025</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "0.59in",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Perihal</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.textNormal}>
              : Surat Pernyataan Tanggung Jawab Mutlak
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ paddingLeft: "0.59in", marginLeft: 5 }}>
            <Text style={[styles.textNormal]}>
              Pelaporan PHK dari Badan Usaha
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.textBold, { textAlign: "center", marginTop: 24 }]}>
        SURAT PERNYATAAN TANGGUNGJAWAB MUTLAK PIMPINAN PERUSAHAAN
      </Text>

      <View style={{ marginTop: 12, gap: "7pt" }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "1.77in",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Nama Lengkap</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal]}>: Dena Ekawati</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "1.77in",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Nama Perusahaan</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal]}>: BPK PENABUR Jakarta</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "1.77in",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Jabatan</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal]}>: Kepala Bagian PPKSDM</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "1.77in",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>No. HP/alamat email</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal]}>
              : 087888215453/ erna.betnawati@bpkpenaburjakarta.or.id
            </Text>
          </View>
        </View>
      </View>

      <View>
        <Text style={[styles.textBold, { marginTop: 12 }]}>
          DENGAN INI MENYATAKAN :
        </Text>
      </View>

      <View style={{ width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View style={{ flexDirection: "row", width: "100%" }}>
            <Text style={[styles.textNormal, { width: "0.31in" }]}>1.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Bahwa telah dilakukan Pemutusan Hubungan Kerja (PHK) terhadap
              sejumlah karyawan dan PHK atas sejumlah karyawan tersebut
              diusulkan untuk dinonaktifkan dari kepesertaan JKN (daftar nama
              terlampir).
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", width: "100%" }}>
            <Text style={[styles.textNormal, { width: "0.31in" }]}>2.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Bahwa seluruh data/informasi/dokumen yang dilampirkan dalam surat
              ini adalah benar dan kebenaran terhadap dokumen yang disampaikan
              oleh Pemberi Kerja merupakan tanggung jawab dari Pemberi Kerja.
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", width: "100%" }}>
            <Text style={[styles.textNormal, { width: "0.31in" }]}>3.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Bahwa telah dilakukan sosialisasi kepada pekerja yang diusulkan
              untuk dinonaktifkan terkait hak dan kewajiban yang berkaitan
              dengan Jaminan Kesehatan Nasional (JKN).
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", width: "100%" }}>
            <Text style={[styles.textNormal, { width: "0.31in" }]}>4.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Bahwa tidak terdapat penolakan pekerja atas pemutusan hubungan
              kerja yang telah dilakukan sesuai dengan peraturan
              perundang-undangan yang berlaku.
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", width: "100%" }}>
            <Text style={[styles.textNormal, { width: "0.31in" }]}>5.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Apabila Pemberi Kerja melakukan penonaktifan kepada pekerja yang
              masih dalam proses perselisihan PHK atau melakukan penonakifan
              pekerja yang masih berstatus sebagai pekerja dari pemberi kerja
              maka Pemberi Kerja wajib mendaftarkan kembali pekerjanya atau
              dapat didaftarkan kembali oleh BPJS Kesehatan sebagai tanggungan
              pemberi kerja, serta Pemberi kerja wajib memungut, membayar dan
              menyetorkan iuran sesuai dengan peraturan perundang-undangan yang
              berlaku.
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", width: "100%" }}>
            <Text style={[styles.textNormal, { width: "0.31in" }]}>6.</Text>
            <Text style={[styles.textNormal, { flex: 1 }]}>
              Dalam hal Pemberi Kerja memberikan dokumen yang tidak benar,
              Pemberi Kerja diberikan sanksi sesuai sesui dengan ketentuan
              Perundang-undangan.
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          alignSelf: "flex-end",
          marginRight: "1.12in",
          alignItems: "center",
          marginTop: 24,
        }}
      >
        <Text style={[styles.textNormal, { flex: 1 }]}>
          BPK PENABUR Jakarta,
        </Text>

        <Text
          style={[
            styles.textBold,
            { textDecoration: "underline", marginTop: 60 },
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
    backgroundColor: "white",
    alignSelf: "center",
    paddingLeft: "1.18in",
    paddingRight: "0.98in",
    paddingTop: 116,
    paddingBottom: "0.79in",
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
    lineHeight: 1.5,
  },

  textBold: {
    fontFamily: "Cambria",
    fontWeight: "bold",
    fontSize: 12,
    lineHeight: 1.5,
  },
});
