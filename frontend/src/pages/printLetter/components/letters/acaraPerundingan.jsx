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

export default function AcaraPerundingan() {
  return (
    <Page style={styles.containerDocument} size={"A4"}>
      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>
          BERITA ACARA PERUNDINGAN BIPARTIT
        </Text>
      </View>

      <View style={{ marginTop: 17, flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: 100 }]}>Hari/tanggal</Text>
        <Text style={[styles.textNormal, { width: 10 }]}>:</Text>
        <Text style={styles.textNormal}>Kamis / 20 Maret 2025</Text>
      </View>

      <View style={{ marginTop: 13, flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: 100 }]}>Pihak</Text>
        <Text style={[styles.textNormal, { width: 10 }]}>:</Text>
        <Text style={[styles.textNormal, { width: 15 }]}>1.</Text>
        <Text style={styles.textNormal}>Pengusaha :</Text>
      </View>

      <View style={{ marginLeft: 125 }}>
        <Text style={styles.textBold}>BPK PENABUR Jakarta</Text>
        <Text style={styles.textNormal}>
          beralamat di Jl. Tanjung Duren Raya No. 4, Jakarta Barat.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginLeft: 110, marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 15 }]}>2.</Text>
        <Text style={styles.textNormal}>Pekerja :</Text>
      </View>

      <View style={{ marginLeft: 125 }}>
        <Text style={styles.textBold}>Sdr. Victoria</Text>
        <Text style={styles.textNormal}>NIK: 0102060</Text>
        <Text style={styles.textNormal}>
          Beralamat di Kp. Cileutik Gg. Ar-Rahman RT.001 RW.003 Kel. Cisauk Kec.
          Cisauk, Tangerang, Banten.
        </Text>
      </View>

      <View style={{ marginTop: 13, flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: 100 }]}>Pokok Masalah</Text>
        <Text style={[styles.textNormal, { width: 10 }]}>:</Text>
        <Text style={styles.textNormal}>Pengakhiran Hubungan Kerja</Text>
      </View>

      <Text
        style={[
          styles.textNormal,
          { marginTop: 15, textDecoration: "underline" },
        ]}
      >
        Keterangan Pihak BPK PENABUR Jakarta :
      </Text>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 15 }]}>1.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Sdr. Victoria adalah mantan Karyawan di BPK PENABUR Jakarta.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 15 }]}>2.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Pada tanggal 20 Maret 2025 Sdr. Victoria membuat surat pengunduran
          diri efektif per tanggal 21 Maret 2025.
        </Text>
      </View>

      <Text
        style={[
          styles.textNormal,
          { marginTop: 15, textDecoration: "underline" },
        ]}
      >
        Keterangan Pihak Pekerja :
      </Text>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 15 }]}>1.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Benar Pekerja adalah mantan Karyawan BPK PENABUR Jakarta yang telah
          bekerja terhitung sejak tanggal 15 Juli 2002.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 15 }]}>2.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Benar hubungan kerja telah berakhir efektif per tanggal 21 Maret 2025.
        </Text>
      </View>

      <Text
        style={[
          styles.textNormal,
          { marginTop: 15, textDecoration: "underline" },
        ]}
      >
        Perundingan :
      </Text>

      <Text style={[styles.textNormal, { marginTop: 13 }]}>
        Setelah dilakukan perundingan dan musyawarah secara sukarela, tanpa
        paksaan dan tekanan dalam bentuk apapun, pihak BPK PENABUR Jakarta dan
        Sdr. Victoria / Pekerja sepakat mengakhiri hubungan kerja dengan baik.
      </Text>

      <Text
        style={[
          styles.textBold,
          { marginTop: 15, textDecoration: "underline" },
        ]}
      >
        Hasil Perundingan :
      </Text>

      <Text
        style={[
          styles.textNormal,
          { marginTop: 13, textDecoration: "underline" },
        ]}
      >
        Pengusaha dan Pekerja sepakat :
      </Text>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 20 }]}>1.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Mengakhiri hubungan kerja dengan baik terhitung sejak tanggal
          berakhirnya hubungan kerja efektif per tanggal 21 Maret 2024.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 20 }]}>2.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Pekerja wajib mengembalikan dengan baik seragam berikut atribut serta
          seluruh dokumen, data, aset, barang-barang dan/atau segala apapun
          milik BPK PENABUR yang ada pada Pekerja.
        </Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 13, marginLeft: 20 }]}>
        Bahwa Pengusaha memberikan dan Pekerja menerima dengan baik uang
        pesangon dan lain-lain sebesar
        <Text style={styles.textBold}>Rp.20.597.400,-</Text>
        (dua puluh juta lima ratus sembilan puluh tujuh ribu empat ratus
        Rupiah). Pekerja wajib membayar semua hutang/pinjaman kepada Pengusaha
        dan Koperasi.
      </Text>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 20 }]}>3.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Pengusaha memberikan fasilitas SPP standar anak karyawan tetap kepada
          Pekerja sampai dengan akhir Tahun Pelajaran 2024/2025.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 20 }]}>4.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Pengusaha memberikan dan Pekerja menerima dengan baik Surat Keterangan
          Masa Kerja yang diperlukan Pekerja untuk mencari pekerjaan ke
          depannya.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 20 }]}>5.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Pekerja bersedia, dalam hal Pengusaha sewaktu-waktu membutuhkan
          keterangan/data/ bantuan terkait hal-hal semasa Pekerja bekerja pada
          Pengusaha, meskipun hubungan kerja telah berakhir.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 20 }]}>6.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Pengusaha bersedia, dalam hal adanya permintaan informasi dari calon
          pemberi kerja Pekerja mengenai diri Pekerja sewaktu bekerja pada
          Pengusaha, maka Pengusaha akan memberikan keterangan yang diminta oleh
          calon pemberi kerja Pihak Kedua.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 20 }]}>7.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Pengusaha sepakat dan memahami sepenuhnya bahwa seluruh data yang
          diperoleh/diketahui Pengusaha selama mempekerjakan Pekerja, baik
          secara langsung/tidak langsung, merupakan Rahasia yang harus dijaga,
          sehingga Pihak Pertama sepakat dan mengikatkan diri untuk tidak
          membocorkan, memberikan dan/atau menggunakan data tersebut, baik
          secara langsung maupun tidak langsung kepada pihak manapun, meskipun
          hubungan kerja telah berakhir.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 20 }]}>8.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Pekerja sepakat dan memahami sepenuhnya bahwa seluruh data yang
          diperoleh/diketahui Pekerja selama bekerja pada Pengusaha, baik secara
          langsung/tidak langsung, merupakan Rahasia yang harus dijaga, sehingga
          Pihak Kedua sepakat dan mengikatkan diri untuk tidak membocorkan,
          memberikan dan/atau menggunakan data tersebut, baik secara langsung
          maupun tidak langsung kepada pihak manapun, meskipun hubungan kerja
          telah berakhir.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 20 }]}>9.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Dengan telah ditandatangani hasil Kesepakatan perundingan ini, maka
          segala hubungan hukum/kerja dan permasalahan antara Pengusaha dan
          Pekerja telah selesai dan berakhir dengan baik dan pihak Pekerja tidak
          akan melakukan tuntutan dalam bentuk apapun lagi dikemudian hari.
          Demikian juga pihak Pengusaha tidak akan melakukan tuntutan dalam
          bentuk apapun lagi terhadap Pekerja dikemudian hari.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 20 }]}>10.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Para Pihak sepakat pengakhiran hubungan kerja ini tidak memerlukan
          Penetapan dari lembaga penyelesaian perselisihan hubungan industrial.
        </Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Jakarta, 20 Maret 2025
      </Text>

      <View style={{ marginTop: 15, height: 120, flexDirection: "row" }}>
        <View
          style={{ flex: 1, height: "100%", justifyContent: "space-between" }}
        >
          <View>
            <Text style={styles.textNormal}>Pengusaha,</Text>
            <Text style={styles.textBold}>BPK PENABUR Jakarta</Text>
          </View>

          <View>
            <Text style={[styles.textBold, { textDecoration: "underline" }]}>
              Irwanto Hartono
            </Text>
            <Text style={styles.textNormal}>Plt. Direktur Pelaksana</Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "space-between",
            paddingLeft: 50,
          }}
        >
          <Text style={styles.textNormal}>Pekerja,</Text>

          <Text style={styles.textBold}>Victoria</Text>
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
    paddingVertical: 75.84,
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
