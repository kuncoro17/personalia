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

export default function VerifikasiData() {
  const tableContent = [
    {
      jenisKesalahan: "Nama",
      tertulis: "Thomas James",
      seharusnya: "Thomas James Beech",
    },
    {
      jenisKesalahan: "Pasport",
      tertulis: "505202277",
      seharusnya: "124371691",
    },
    {
      jenisKesalahan: "Tanggal Lahir",
      tertulis: "25 Mei 1976",
      seharusnya: "",
    },
  ];

  return (
    <Page style={styles.containerDocument} size={["8.5in", "13in"]}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

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
          <Text style={[styles.textNormal]}>: 01/BPR/Pr/01/2025</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "0.79in" }}>
          <Text style={styles.textNormal}>Lampiran</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.textNormal]}>
            : KK, KTP Peserta dan E-Kartu BP Jamsostek
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={styles.textNormal}>Yth. Kepala Kantor Cabang</Text>
        <Text style={styles.textNormal}>
          Badan Penyelenggara Jaminan Sosial (BPJS) Ketenagakerjaan
        </Text>
        <Text style={styles.textNormal}>Jl. Raya Daan Mogot No.100A, RW.3</Text>
        <Text style={styles.textNormal}>Jelambar, Grogol petamburan</Text>
        <Text style={styles.textNormal}>Jakarta Barat</Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 24 }]}>Dengan hormat,</Text>

      <Text style={[styles.textNormal, { marginTop: 12 }]}>
        Saya yang bertanda tangan di bawah ini :
      </Text>

      <View style={{ marginTop: 12 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "1.5in" }}>
            <Text style={styles.textNormal}>Nama</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal]}>: Dena Ekawati</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "1.5in" }}>
            <Text style={styles.textNormal}>Jabatan</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal]}>: Kepala Bagian PPKSDM</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "1.5in" }}>
            <Text style={styles.textNormal}>Nomor Handphone</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal]}>: 083807905469</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 12 }]}>
        Bersama surat ini kami beritahukan beberapa data yang harus diperbaiki
        sesuai data tenaga kerja yang sebenarnya :
      </Text>

      <View style={{ marginTop: 12 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "1.5in" }}>
            <Text style={styles.textNormal}>Nama</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal]}>: Thomas James Beech</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "1.5in" }}>
            <Text style={styles.textNormal}>No Peserta</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal]}>: 16008114601</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "1.5in" }}>
            <Text style={styles.textNormal}>No Paspor</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal]}>: 124371691</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "1.5in" }}>
            <Text style={styles.textNormal}>Nomor Handphone</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal]}>: 081212159937</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "1.5in" }}>
            <Text style={styles.textNormal}>Alamat Email</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal]}>
              : thomas.beech@bpkpenaburjakarta.or.id
            </Text>
          </View>
        </View>
      </View>

      <View style={{ borderWidth: 1, marginTop: 12 }}>
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
                textAlign: "center",
                borderRightWidth: 1,
                width: "0.4in",
              },
            ]}
          >
            NO
          </Text>

          <Text
            style={[
              styles.textBold,
              {
                paddingVertical: 1,
                textAlign: "center",
                borderRightWidth: 1,
                width: "1.41in",
                paddingHorizontal: "0.1in",
              },
            ]}
          >
            JENIS KESALAHAN
          </Text>

          <Text
            style={[
              styles.textBold,
              {
                paddingVertical: 1,
                textAlign: "center",
                borderRightWidth: 1,
                width: "2.07in",
                paddingHorizontal: "0.1in",
              },
            ]}
          >
            TERTULIS
          </Text>

          <Text
            style={[
              styles.textBold,
              {
                paddingVertical: 1,
                textAlign: "center",
                borderRightWidth: 1,
                flex: 1,
                paddingHorizontal: "0.1in",
              },
            ]}
          >
            SEHARUSNYA
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
                  textAlign: "center",
                  borderRightWidth: 1,
                  width: "0.4in",
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
                  borderRightWidth: 1,
                  width: "1.41in",
                  paddingHorizontal: "0.1in",
                },
              ]}
            >
              {item.jenisKesalahan}
            </Text>

            <Text
              style={[
                styles.textNormal,
                {
                  paddingVertical: 1,
                  borderRightWidth: 1,
                  width: "2.07in",
                  paddingHorizontal: "0.1in",
                },
              ]}
            >
              {item.tertulis}
            </Text>

            <Text
              style={[
                styles.textNormal,
                {
                  paddingVertical: 1,
                  textAlign: "center",
                  borderRightWidth: 1,
                  flex: 1,
                  paddingHorizontal: "0.1in",
                },
              ]}
            >
              {item.seharusnya}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.textNormal, { marginTop: 12 }]}>
        Demikian surat permohonan perbaikan data kami buat dengan
        sebenar-benarnya, atas perhatian dan kerjasamanya kami ucapkan terima
        kasih.
      </Text>

      <View
        style={{
          paddingLeft: "3.94in",
          marginTop: 24,
        }}
      >
        <Text style={styles.textNormal}>Hormat kami,</Text>
        <Text style={styles.textNormal}>BPK PENABUR Jakarta</Text>

        <Text
          style={[
            styles.textBold,
            { textDecoration: "underline", marginTop: 48, color: "blue" },
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
    lineHeight: 1.15,
    textAlign: "justify",
  },

  textBold: {
    fontFamily: "Cambria",
    fontWeight: "bold",
    lineHeight: 1.15,
    fontSize: 12,
  },
});
