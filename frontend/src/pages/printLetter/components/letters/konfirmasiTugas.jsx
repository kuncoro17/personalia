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

export default function KonfirmasiTugas() {
  const tableContent = [
    {
      peserta: "31 Orang Guru dan Karyawan SMAK 4 PENABUR Jakarta",
      kegiatan:
        "Outbond Pembinaan Guru dan Tenaga Kependidikan SMAK 4 PENABUR Jakarta",
      tanggal_kegiatan: "24 s.d 25 Maret 2025",
      tempat: "Bogor",
      keterangan: "Daftar peserta dan rundown acara terlampir",
    },
    {
      peserta: "63 Orang Guru dan Karyawan SMAK 5 PENABUR Jakarta",
      kegiatan: "Pembinaan Guru dan Karyawan SMAK 5 PENABUR Jakarta",
      tanggal_kegiatan: "24 s.d 25 Maret 2025",
      tempat: "Bandung",
      keterangan: "Daftar peserta dan rundown acara terlampir",
    },
  ];

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
              Konfirmasi Tugas Luar Kota
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
              Daftar Nama dan Rundown Acara
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

      <Text
        style={[
          styles.textBold,
          {
            marginTop: 20,
            textAlign: "center",
            width: "50%",
            alignSelf: "center",
            fontSize: 14,
          },
        ]}
      >
        Konfirmasi Tugas Luar Kota Karyawan BPK PENABUR Jakarta
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Saya yang bertandatangan di bawah ini:
      </Text>
      <View style={{ paddingLeft: 10, marginTop: 8 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text style={styles.textNormal}>1.</Text>
          <Text style={[styles.textNormal, { width: "30%" }]}>
            Nama Lengkap
          </Text>
          <Text style={styles.textNormal}>: Dena Ekawati</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text style={styles.textNormal}>2.</Text>
          <Text style={[styles.textNormal, { width: "30%" }]}>Jabatan</Text>
          <Text style={styles.textNormal}>: Kepala Bagian PPKSDM</Text>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        memberikan konfirmasi kegiatan sebagai berikut:
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
                flex: 1,
                paddingHorizontal: 5,
              },
            ]}
          >
            Peserta
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
            Kegiatan
          </Text>

          <Text
            style={[
              styles.textBold,
              {
                paddingVertical: 1,
                textAlign: "center",
                borderRightWidth: 1,
                width: 80,
                paddingHorizontal: 5,
              },
            ]}
          >
            Tanggal Kegiatan
          </Text>

          <Text
            style={[
              styles.textBold,
              {
                paddingVertical: 1,
                textAlign: "center",
                borderRightWidth: 1,
                width: 80,
                paddingHorizontal: 5,
              },
            ]}
          >
            Tempat
          </Text>

          <Text
            style={[
              styles.textBold,
              {
                paddingVertical: 1,
                textAlign: "center",
                borderRightWidth: 1,
                width: 80,
                paddingHorizontal: 5,
              },
            ]}
          >
            Keterangan
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
                  textAlign: "left",
                  borderRightWidth: 1,
                  flex: 1,
                  paddingHorizontal: 5,
                },
              ]}
            >
              {item.peserta}
            </Text>

            <Text
              style={[
                styles.textNormal,
                {
                  paddingVertical: 1,
                  borderRightWidth: 1,
                  flex: 1,
                  paddingHorizontal: 5,
                  textAlign: "left",
                },
              ]}
            >
              {item.kegiatan}
            </Text>

            <Text
              style={[
                styles.textNormal,
                {
                  paddingVertical: 1,
                  textAlign: "left",
                  borderRightWidth: 1,
                  width: 80,
                  paddingHorizontal: 5,
                },
              ]}
            >
              {item.tanggal_kegiatan}
            </Text>

            <Text
              style={[
                styles.textNormal,
                {
                  paddingVertical: 1,
                  textAlign: "center",
                  borderRightWidth: 1,
                  width: 80,
                  paddingHorizontal: 5,
                },
              ]}
            >
              {item.tempat}
            </Text>

            <Text
              style={[
                styles.textNormal,
                {
                  paddingVertical: 1,
                  textAlign: "left",
                  borderRightWidth: 1,
                  width: 80,
                  paddingHorizontal: 5,
                },
              ]}
            >
              {item.keterangan}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Demikian surat konfirmasi ini dibuat dengan sebenarnya untuk digunakan
        sebagaimana mestinya.
      </Text>

      <View
        style={{
          alignSelf: "flex-end",
          marginRight: 30,
        }}
        break
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
    paddingHorizontal: 73.52 - 18.27,
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
