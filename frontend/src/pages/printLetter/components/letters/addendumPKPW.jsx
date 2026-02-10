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

Font.registerHyphenationCallback((word) => [word]);

const pad2 = (n) => String(n).padStart(2, "0");

export default function AddendumPKWT({ data }) {
  // ✅ ambil dari API
  const idKaryawan = (data?.id_karyawan ?? "").toString().trim();
  const nama = (data?.nama_lengkap ?? "").toString().trim();
  const nik = (data?.nik ?? "").toString().trim();
  const alamatTempatTinggal = (data?.alamatTempatTinggal ?? "")
    .toString()
    .trim();
  const alamatKTP = (data?.alamatKTP ?? "").toString().trim();
  const no_ktp = (data?.no_ktp ?? "").toString().trim();
  const tgl_join_penabur_jkt = (data?.tgl_join_penabur_jkt ?? "")
    .toString()
    .trim();
  const tgl_inactive = (data?.tgl_inactive ?? "").toString().trim();
  // ✅ nomor surat bulan/tahun sekarang (kalau kamu mau)
  const now = new Date();
  const bulan = pad2(now.getMonth() + 1);
  const tahun = now.getFullYear();

  const nomorSurat = data?.nomor_surat ?? `007/SDM/Ktk2/${bulan}/${tahun}`;

  // ✅ tampilan nama + nik
  const namaDisplay = nama || "—";
  const nikDisplay = nik ? ` (${nik})` : " (—)";
  const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const BULAN = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // angka → terbilang (cukup sampai ribuan, aman untuk tanggal & tahun)
  function terbilang(n) {
    const satuan = [
      "",
      "satu",
      "dua",
      "tiga",
      "empat",
      "lima",
      "enam",
      "tujuh",
      "delapan",
      "sembilan",
      "sepuluh",
      "sebelas",
    ];

    if (n < 12) return satuan[n];
    if (n < 20) return `${satuan[n - 10]} belas`;
    if (n < 100)
      return `${satuan[Math.floor(n / 10)]} puluh ${satuan[n % 10]}`.trim();
    if (n < 200) return `seratus ${terbilang(n - 100)}`.trim();
    if (n < 1000)
      return `${satuan[Math.floor(n / 100)]} ratus ${terbilang(n % 100)}`.trim();
    if (n < 2000) return `seribu ${terbilang(n - 1000)}`.trim();
    return `${terbilang(Math.floor(n / 1000))} ribu ${terbilang(n % 1000)}`.trim();
  }
  const today = new Date();

  const hari = HARI[today.getDay()];
  const tanggal = today.getDate();
  const bulanNama = BULAN[today.getMonth()];

  const tanggalText = terbilang(tanggal);
  const tahunText = terbilang(tahun);

  const tanggalNumeric = `${tanggal}-${today.getMonth() + 1}-${tahun}`;

  return (
    <Page style={styles.containerDocument} size="A4">
      <Image src="/assets/images/kop.png" style={styles.kopSurat} fixed />

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>
          ADDENDUM TERHADAP PERJANJIAN KERJA PARUH WAKTU
        </Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          Nomor : {nomorSurat}
        </Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 15 }]}>
        Addendum Terhadap Perjanjian Kerja Paruh Waktu (selanjutnya disebut
        “Addendum”) ini dibuat pada hari {hariNama} tanggal {tanggalText} bulan{" "}
        {bulanNama} tahun {tahunText} ({tanggalNumeric}) oleh dan antara :
      </Text>

      <View style={{ marginTop: 10, rowGap: 4 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textBold, { width: 20 }]}>I.</Text>
          <Text style={styles.textNormal}>
            <Text style={styles.textBold}>BPK PENABUR Jakarta, </Text>
            berkedudukan di Jakarta, beralamat di Jalan Tanjung Duren Raya No.
            4, Jakarta Barat, dalam hal ini diwakili oleh
            <Text style={styles.textBold}> Iening Ananta,S.T. </Text>
            dan
            <Text style={styles.textBold}> Ir. Yosafat Adrian Wiguna, </Text>
            MBA dalam jabatannya selaku
            <Text style={styles.textBold}> Ketua Bidang SDM </Text>
            dan
            <Text style={styles.textBold}> Sekretaris II </Text>, demikian sah
            bertindak untuk dan atas nama BPK PENABUR Jakarta, selanjutnya
            disebut
            <Text style={styles.textBold}> Pihak Pertama.</Text>
          </Text>
        </View>

        {/* ✅ PIHAK KEDUA dari API */}
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textBold, { width: 20 }]}>II.</Text>
          <Text style={styles.textNormal}>
            <Text style={styles.textBold}>
              {namaDisplay}
              {nikDisplay},{" "}
            </Text>
            selanjutnya disebut
            <Text style={styles.textBold}> Pihak Kedua.</Text>
          </Text>
        </View>
      </View>

      {/* isi lain tetap seperti aslinya */}
      <View style={{ marginTop: 10 }}>
        <Text style={styles.textNormal}>
          Pihak Pertama dan Pihak Kedua untuk selanjutnya masing-masing disebut
          sebagai
          <Text style={styles.textBold}> Pihak </Text>
          dan secara bersama-sama disebut sebagai
          <Text style={styles.textBold}> Para Pihak.</Text>
        </Text>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.textNormal}>
          Para Pihak menerangkan terlebih dahulu hal-hal sebagai berikut :
        </Text>
      </View>

      <View style={{ marginTop: 10, rowGap: 4 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textBold, { width: 20 }]}>a.</Text>
          <Text style={styles.textNormal}>
            Bahwa Pada tanggal 30 Juni 2023, Para Pihak telah menandatangani
            Perjanjian Kerja Paruh Waktu Nomor : 001/SDM/UMU/06/2023
            (selanjutnya disebut
            <Text style={styles.textBold}> “PKPW”</Text>)
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textBold, { width: 20 }]}>b.</Text>
          <Text style={styles.textNormal}>
            Bahwa Para Pihak sepakat untuk melakukan perubahan dan/atau
            penambahan terhadap PKPW.
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.textNormal}>
          Berdasarkan hal-hal tersebut di atas, Para Pihak sepakat untuk saling
          mengikatkan diri dalam Addendum ini, yang merupakan bagian yang tidak
          terpisahkan dari PKPW, dengan syarat-syarat dan ketentuan-ketentuan
          sebagai berikut :
        </Text>
      </View>

      <View
        style={{
          marginTop: 10,
        }}
      >
        <Text style={[styles.textBold, { textAlign: "center" }]}>Pasal 1</Text>
        <Text style={[styles.textNormal, { marginTop: 10 }]}>
          Merubah Pasal 1 PKPW sehingga Pasal 1 PKPW menjadi berbunyi :
        </Text>
        <Text style={[styles.textNormal, { marginTop: 10 }]}>
          Pihak Pertama setuju mempekerjakan Pihak Kedua dan Pihak Kedua setuju
          untuk bekerja kepada Pihak Pertama terhitung sejak tanggal{" "}
          {tgl_join_penabur_jkt}
          sampai dengan tanggal {tgl_inactive} sebagai Guru di BPK PENABUR
          Jakarta secara paruh waktu, di salah satu sekolah dan/atau
          sekolah-sekolah Pihak Pertama yang ditentukan oleh Pihak Pertama.
        </Text>
      </View>

      <View
        style={{
          marginTop: 10,
        }}
      >
        <Text style={[styles.textBold, { textAlign: "center" }]}>Pasal 2</Text>

        <View style={{ marginTop: 10, rowGap: 4 }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textBold, { width: 20 }]}>1.</Text>
            <Text style={styles.textNormal}>
              Seluruh ketentuan yang tercantum dalam PKPW sepanjang tidak diubah
              dalam Addendum ini dinyatakan masih tetap berlaku.
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.textBold, { width: 20 }]}>2.</Text>
            <Text style={styles.textNormal}>
              Hal-hal lain yang belum atau belum cukup diatur dalam Addendum ini
              akan diselesaikan melalui perundingan antara Para Pihak dan akan
              dituangkan secara tertulis ke dalam Addendum selanjutnya serta
              merupakan bagian yang tidak terpisahkan dan mempunyai kekuatan
              hukum yang sama dengan PKPW.
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.textNormal}>
          Demikian Addendum ini dibuat dalam rangkap 2 (dua) asli yang sama
          bunyinya, masing-masing bermaterai cukup dan mempunyai kekuatan hukum
          yang sama.
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 25,
        }}
      >
        <Text style={styles.textNormal}>Pihak Pertama BPK Penabur Jakarta</Text>

        <Text style={styles.textNormal}>Pihak Kedua</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 80,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            Iening Ananta, S.T.
          </Text>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            Ketua Bidang SDM
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={[styles.textNormal, { color: "blue" }]}>
            Ir. Yosafat Adrian Wiguna, MBA
          </Text>
          <Text style={[styles.textNormal, { color: "blue" }]}>Sekretaris</Text>
        </View>

        <Text style={[styles.textNormal, { color: "blue" }]}>
          nama karyawan
        </Text>
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
