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

export default function PermohonanMutasi() {
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
              001/SDM/YP/01/2025
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
              Permohonan Mutasi/Lolos Butuh
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.textNormal}>
          Yth. Pengurus BPK PENABUR Bandar Lampung
        </Text>
        <Text style={styles.textNormal}>Up. Bidang Kepegawaian</Text>
        <Text style={styles.textNormal}>Jalan Perintis Kemerdekaan No.7</Text>
        <Text style={styles.textNormal}>Kotabaru – Bandar Lampung 35121</Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Salam dalam Kasih Tuhan Yesus Kristus,
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20, textIndent: 20 }]}>
        Kami menjumpai Bapak/Ibu dengan doa dan harapan kiranya seluruh jajaran
        BPK PENABUR Sukabumi dalam keadaan sehat dan dalam perlindungan Tuhan.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20, textIndent: 20 }]}>
        Bersama surat ini kami sampaikan bahwa Sdr. Puspita Sari Saragih, S.S
        melalui suratnya yang diterima SDM tanggal 25 Mei 2024 telah mengajukan
        permohonan mutasi ke BPK PENABUR Bandar Lampung untuk Tahun Pelajaran
        2024/2025 dengan alasan yang bersangkutan ingin ikut suami yang pindah
        tugas di Tanjung Karang Bandar Lampung. Saat ini yang bersangkutan
        bertugas sebagai Guru Sejarah jenjang SLTA dengan status Karyawan Tetap
        bergolongan 3D3 dan sudah bekerja selama 10 (sepuluh) tahun di BPK
        PENABUR Jakarta.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20, textIndent: 20 }]}>
        Menurut informasi yang kami dapatkan dari yang bersangkutan bahwa ada
        lowongan Guru Sejarah untuk jenjang SLTA di BPK PENABUR Bandar Lampung.
        Kiranya yang bersangkutan dapat mengikuti proses perekrutan tersebut dan
        kami menunggu balasan serta konfirmasi dari Bapak/Ibu apabila yang
        bersangkutan lolos/tidak dalam proses perekrutan/mutasi di BPK PENABUR
        Bandar Lampung.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20, textIndent: 20 }]}>
        Sebagai informasi pendukung maka kami lampirkan dokumen-dokumen yang
        bersangkutan selama bekerja di BPK PENABUR Jakarta seperti:
      </Text>
      <View style={{ paddingLeft: 10 }}>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Text style={styles.textNormal}>1.</Text>
          <Text style={styles.textNormal}>
            Surat Keputusan tentang Pengangkatan sebagai Tenaga Pendidik tahun
            2017
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 5 }}>
          <Text style={styles.textNormal}>2.</Text>
          <Text style={styles.textNormal}>
            Surat Keputusan tentang kenaikan Ruang/Kuarter tahun 2023
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 5 }}>
          <Text style={styles.textNormal}>3.</Text>
          <Text style={styles.textNormal}>Nilai KKPK 3 tahun terakhir</Text>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20, textIndent: 20 }]}>
        Demikian permohonan ini kami sampaikan, atas perhatian dan kerjasama
        Bapak/Ibu kami mengucapkan terima kasih.
      </Text>

      <View style={{ alignItems: "center", width: "100%" }} break>
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
