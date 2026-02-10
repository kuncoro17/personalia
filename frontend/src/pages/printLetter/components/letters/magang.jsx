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

export default function Magang() {
  return (
    <Page style={styles.containerDocument} size={["8.27in", "11.69in"]}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>PERJANJIAN KERJA MAGANG</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          No. : 001/SDM/TKL/08/2024
        </Text>
      </View>

      <Text style={[{ marginTop: 24 }, styles.textNormal]}>
        Dengan mengucap syukur kepada Tuhan Yang Maha Kasih, kami yang
        bertandatangan di bawah ini :
      </Text>

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <Text style={[{ width: "0.3in" }, styles.textNormal]}>1.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          BPK PENABUR Jakarta, yang dalam hal ini diwakili oleh{" "}
          <Text style={{ color: "blue" }}>Irwanto Hartono</Text> Selaku{" "}
          <Text style={{ color: "blue" }}>Plt. Direktur Pelaksana</Text>, untuk
          selanjutnya disebut “Pemberi Kerja” dan
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <Text style={[{ width: "0.3in" }, styles.textNormal]}>2.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Saudara <Text style={{ color: "blue" }}>nama karyawan</Text>,
          beralamat di{" "}
          <Text style={{ color: "blue" }}>alamat ktp karyawan</Text>, untuk
          selanjutnya disebut “Karyawan”
        </Text>
      </View>

      <Text style={[{ marginTop: 12 }, styles.textNormal]}>
        menyepakati PERJANJIAN KERJA MAGANG, dengan ketentuan sebagai berikut :
      </Text>

      <View style={{ width: "6.38in" }}>
        <View
          style={{
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            borderColor: "blue",
            marginTop: 12,
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              styles.textNormal,
              {
                width: "0.37in",
                textAlign: "center",
                borderColor: "blue",
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
              },
            ]}
          >
            1.
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                width: "2.21in",
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.09in",
              },
            ]}
          >
            Jabatan Karyawan
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                flex: 1,
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.13in",
                color: "blue",
              },
            ]}
          >
            jabatan
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: "blue",
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              styles.textNormal,
              {
                width: "0.37in",
                textAlign: "center",
                borderColor: "blue",
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
              },
            ]}
          >
            2.
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                width: "2.21in",
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.09in",
              },
            ]}
          >
            Tugas
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                flex: 1,
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.13in",
                color: "blue",
              },
            ]}
          >
            lokasi kerja
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: "blue",
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              styles.textNormal,
              {
                width: "0.37in",
                textAlign: "center",
                borderColor: "blue",
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
              },
            ]}
          >
            3.
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                width: "2.21in",
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.09in",
              },
            ]}
          >
            Masa Perjanjian
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                flex: 1,
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.13in",
                color: "blue",
              },
            ]}
          >
            Tanggal{" "}
            <Text style={{ color: "blue" }}>
              tgl awal kontrak – tgl akhir kontrak
            </Text>
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: "blue",
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              styles.textNormal,
              {
                width: "0.37in",
                textAlign: "center",
                borderColor: "blue",
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
              },
            ]}
          >
            4.
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                width: "2.21in",
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.09in",
              },
            ]}
          >
            Hari & Jam Kerja
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                flex: 1,
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.13in",
                color: "blue",
              },
            ]}
          >
            Senin – Jumat (07.00 – 16.00 wib)
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: "blue",
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              styles.textNormal,
              {
                width: "0.37in",
                textAlign: "center",
                borderColor: "blue",
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
              },
            ]}
          >
            5.
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                width: "2.21in",
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.09in",
              },
            ]}
          >
            Upah Magang
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                flex: 1,
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.13in",
              },
            ]}
          >
            Rp. 4.054.000; per bulan
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: "blue",
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              styles.textNormal,
              {
                width: "0.37in",
                textAlign: "center",
                borderColor: "blue",
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
              },
            ]}
          >
            6.
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                width: "2.21in",
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.09in",
              },
            ]}
          >
            Tunjangan Lembur
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                flex: 1,
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.13in",
              },
            ]}
          >
            Tidak ada
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: "blue",
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              styles.textNormal,
              {
                width: "0.37in",
                textAlign: "center",
                borderColor: "blue",
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
              },
            ]}
          >
            7.
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                width: "2.21in",
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.09in",
              },
            ]}
          >
            Tunjangan Lain
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                flex: 1,
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.13in",
              },
            ]}
          >
            Tidak ada
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: "blue",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              width: "0.37in",
              justifyContent: "center",
              alignItems: "center",
              borderColor: "blue",
              borderLeftWidth: 0.5,
              borderRightWidth: 0.5,
              height: "100%",
            }}
          >
            <Text style={styles.textNormal}>8.</Text>
          </View>

          <Text
            style={[
              styles.textNormal,
              {
                width: "2.21in",
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.09in",
                paddingRight: "0.08in",
                textAlign: "left",
              },
            ]}
          >
            Pesangon setelah berakhirnya Perjanjian ini
          </Text>

          <View
            style={{
              justifyContent: "center",
              flex: 3,
              borderColor: "blue",
              borderRightWidth: 0.5,
              paddingLeft: 10,
              height: "100%",
            }}
          >
            <Text style={styles.textNormal}>Tidak ada</Text>
          </View>
        </View>

        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: "blue",
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              styles.textNormal,
              {
                width: "0.37in",
                textAlign: "center",
                borderColor: "blue",
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
              },
            ]}
          >
            9.
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                width: "2.21in",
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.09in",
              },
            ]}
          >
            Atasan Operasional
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                flex: 3,
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: 10,
                color: "blue",
              },
            ]}
          >
            atasan langsung
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: 0.5,
            borderColor: "blue",
            flexDirection: "row",
          }}
        >
          <Text
            style={[
              styles.textNormal,
              {
                width: "0.37in",
                textAlign: "center",
                borderColor: "blue",
                borderLeftWidth: 0.5,
                borderRightWidth: 0.5,
              },
            ]}
          >
            10.
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                width: "2.21in",
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.09in",
              },
            ]}
          >
            Ketentuan lain
          </Text>

          <Text
            style={[
              styles.textNormal,
              {
                flex: 1,
                borderColor: "blue",
                borderRightWidth: 0.5,
                paddingLeft: "0.13in",
              },
            ]}
          >
            Mengikuti Peraturan BPK PENABUR Jakarta.
          </Text>
        </View>
      </View>

      <Text style={[{ marginTop: 12 }, styles.textNormal]}>
        Pemberi Kerja atau Karyawan dapat memutuskan Perjanjian ini dengan
        memberitahu pihak lainnya sehari sebelumnya dan Karyawan memperoleh Upah
        sesuai dengan hari kerja yang telah dilaluinya.
      </Text>

      <Text style={[{ marginTop: 12 }, styles.textNormal]}>
        Perjanjian ini ditandatangani pada tanggal tersebut di bawah ini oleh
        Pemberi Kerja dan Karyawan sebagai kesepakatan Para Pihak.
      </Text>

      <View
        style={{
          flexDirection: "row",
          marginTop: 24,
        }}
      >
        <Text style={[styles.textNormal, { width: "3.94in" }]}>
          BPK PENABUR Jakarta,
        </Text>
        <Text style={[styles.textNormal]}>Karyawan,</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginTop: 72,
        }}
      >
        <Text
          style={[
            styles.textNormal,
            { textDecoration: "underline", width: "3.94in" },
          ]}
        >
          Irwanto Hartono
        </Text>
        <Text style={[styles.textNormal, { textDecoration: "underline" }]}>
          nama karyawan
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text style={[styles.textNormal, { width: "3.94in" }]}>
          Tanggal ..................................
        </Text>
        <Text style={[styles.textNormal]}>
          Tanggal ..................................
        </Text>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  containerDocument: {
    backgroundColor: "white",
    alignSelf: "center",
    paddingHorizontal: "0.87in",
    paddingTop: 126,
    paddingBottom: "0.79in",
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
    fontFamily: "Cambria",
    fontSize: 12,
  },

  textBold: {
    fontFamily: "Cambria",
    fontSize: 12,
  },

  titleHeader: {
    fontFamily: "Cambria",
    textDecoration: "underline",
    fontWeight: "bold",
    fontSize: 14,
  },
});
