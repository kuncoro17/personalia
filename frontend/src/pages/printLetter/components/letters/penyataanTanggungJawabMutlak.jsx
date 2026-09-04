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

export default function PernyataanTanggungJawabMutlak() {
  const tableContent = [
    {
      noKepesertaan: "0001374059474",
      namaPegawai: "Maria Nathania Pradita Wibowo, s.psi.",
      noHandphone: "085714026560",
      alasanPHK: "Mengundurkan Diri",
    },
    {
      noKepesertaan: "0001109636842",
      namaPegawai: "Maria Stefani Zega, S.Psi",
      noHandphone: "08987992010",
      alasanPHK: "Mengundurkan Diri",
    },
    {
      noKepesertaan: "0001640523925",
      namaPegawai: "Marciano Tuasimo",
      noHandphone: "081381509538",
      alasanPHK: "Pensiun",
    },
    {
      noKepesertaan: "0001827975971",
      namaPegawai: "Ira Theresia Putri Panjaitan",
      noHandphone: "085262126449",
      alasanPHK: "Mengundurkan Diri",
    },
    {
      noKepesertaan: "0002916682863",
      namaPegawai: "Welhelmina Vince, M.T.",
      noHandphone: "085157088511",
      alasanPHK: "Mengundurkan Diri",
    },
    {
      noKepesertaan: "0003072978652",
      namaPegawai: "Resvina",
      noHandphone: "085247914176",
      alasanPHK: "Mengundurkan Diri",
    },
    {
      noKepesertaan: "0000655123915",
      namaPegawai: "Ardian Ragil Saputra",
      noHandphone: "0882007443166",
      alasanPHK: "Mengundurkan Diri",
    },
    {
      noKepesertaan: "0002611324168",
      namaPegawai: "Sahrawati Situmorang",
      noHandphone: "081377161691",
      alasanPHK: "Putus Kontrak",
    },
    {
      noKepesertaan: "0000012049086",
      namaPegawai: "Sri Hadriani Nababan",
      noHandphone: "085207296423",
      alasanPHK: "Mengundurkan Diri",
    },
  ];

  return (
    <Page style={styles.containerDocument} size={"A4"}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <View style={{ marginTop: 10 }}>
        <Text style={styles.textBold}>Lampiran Surat</Text>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "15%" }]}>Nomor</Text>
          <Text style={styles.textNormal}>: 01/SDM/BPJS/01/2025</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: "15%" }]}>Tanggal</Text>
          <Text style={styles.textNormal}>: 1 Januari 2025</Text>
        </View>
      </View>

      <Text style={[styles.textBold, { marginTop: 20 }]}>
        b. PHK Tanpa Jaminan 6 bulan (dokumen tidak/belum lengkap)
      </Text>

      <View style={{ borderWidth: 1, marginTop: 13 }}>
        <View
          style={{
            borderBottom: 1,
            backgroundColor: "#00000010",
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              styles.textBold,
              {
                paddingVertical: 1,
                textAlign: "center",
                borderRightWidth: 1,
                width: 25,
                paddingHorizontal: 5,
              },
            ]}
          >
            No
          </Text>

          <Text
            style={[
              styles.textBold,
              {
                paddingVertical: 1,
                textAlign: "center",
                borderRightWidth: 1,
                width: 100,
                paddingHorizontal: 5,
              },
            ]}
          >
            No Kepesertaan JKN KIS
          </Text>

          <Text
            style={[
              styles.textBold,
              {
                paddingVertical: 1,
                textAlign: "center",
                borderRightWidth: 1,
                flex: 1,
                paddingHorizontal: 5,
              },
            ]}
          >
            Nama Pegawai
          </Text>

          <Text
            style={[
              styles.textBold,
              {
                paddingVertical: 1,
                textAlign: "center",
                borderRightWidth: 1,
                width: 100,
                paddingHorizontal: 5,
              },
            ]}
          >
            Nomor Handphone
          </Text>

          <Text
            style={[
              styles.textBold,
              {
                paddingVertical: 1,
                textAlign: "center",
                width: 120,
                paddingHorizontal: 5,
              },
            ]}
          >
            Alasan Pemutusan Hubungan Kerja (PHK)
          </Text>
        </View>

        {tableContent.map((item, index) => (
          <View
            style={{
              borderBottom: tableContent.length !== index + 1 && 1,
              flexDirection: "row",
            }}
          >
            <Text
              style={[
                styles.textNormal,
                {
                  paddingVertical: 1,
                  textAlign: "center",
                  borderRightWidth: 1,
                  width: 25,
                  paddingHorizontal: 5,
                },
              ]}
            >
              {index + 1}
            </Text>

            <Text
              style={[
                styles.textNormal,
                {
                  paddingVertical: 1,
                  textAlign: "center",
                  borderRightWidth: 1,
                  width: 100,
                  paddingHorizontal: 5,
                },
              ]}
            >
              {item.noKepesertaan}
            </Text>

            <Text
              style={[
                styles.textNormal,
                {
                  paddingVertical: 1,
                  borderRightWidth: 1,
                  flex: 1,
                  paddingHorizontal: 5,
                },
              ]}
            >
              {item.namaPegawai}
            </Text>

            <Text
              style={[
                styles.textNormal,
                {
                  paddingVertical: 1,
                  textAlign: "center",
                  borderRightWidth: 1,
                  width: 100,
                  paddingHorizontal: 5,
                },
              ]}
            >
              {item.noHandphone}
            </Text>

            <Text
              style={[
                styles.textNormal,
                { paddingVertical: 1, width: 120, paddingHorizontal: 5 },
              ]}
            >
              {item.alasanPHK}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 50, height: 100, flexDirection: "row" }}>
        <View
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.textNormal}>Perwakilan Pekerja yang di PHK,</Text>

          <Text style={[styles.textBold, { textDecoration: "underline" }]}>
            Welhelmina Vince, M.T.
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.textNormal}>Kepala Bagian PPK SDM,</Text>

          <Text style={styles.textNormal}>Dena Ekawati</Text>
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

  containerHeader: {
    alignItems: "center",
    marginBottom: 10,
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
    fontSize: 14,
    textAlign: "center",
  },
});
