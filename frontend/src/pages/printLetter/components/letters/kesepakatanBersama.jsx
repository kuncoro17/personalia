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

export default function KesepakatanBersama({ data }) {
  const payload = data?.data ?? data ?? {};

  const today = new Date();
  const bulan = String(today.getMonth() + 1).padStart(2, "0");
  const tahun = today.getFullYear();

  const tanggalSurat = `${today.getDate()}-${bulan}-${tahun}`;

  const idKaryawan = payload?.id_karyawan ?? payload?.id ?? "—";

  const namaLengkap =
    String(payload?.nama_lengkap ?? payload?.nama ?? "").trim() || "—";

  const nik = String(payload?.nik ?? "").trim() || "—";

  const tanggal_incative =
    payload?.tanggal_incative != null
      ? String(payload.tanggal_incative).trim()
      : "—";

  const unitKerja =
    payload?.unit_kerja_karyawan?.[0]?.unit_kerja_detail?.divisi?.nama_div ??
    "—";

  const jabatan = payload?.unit_kerja_karyawan?.[0]?.jabatan?.jabatan ?? "—";

  function formatAlamat(a) {
    if (!a) return "—";
    if (typeof a === "string") return a.trim() || "—";

    const alamat = String(a?.alamat ?? "").trim();
    const rt = String(a?.rt ?? "").trim();
    const rw = String(a?.rw ?? "").trim();
    const kel = String(a?.kelurahan?.nama ?? "").trim();
    const kec = String(a?.kecamatan?.nama ?? "").trim();
    const kota = String(a?.kota?.nama ?? "").trim();
    const prov = String(a?.provinsi?.nama ?? "").trim();
    const kodePos = String(a?.kode_pos ?? "").trim();

    const rtRw = rt || rw ? `RT ${rt || "-"} / RW ${rw || "-"}` : "";
    const bagian = [alamat, rtRw, kel, kec, kota, prov, kodePos]
      .map((x) => String(x || "").trim())
      .filter(Boolean);

    return bagian.join(", ") || "—";
  }
  const alamatTempatTinggal = formatAlamat(
    payload?.alamat_tempat_tinggal_detail,
  );
  const alamatKtp = formatAlamat(payload?.alamat_ktp_detail);

  return (
    <Page style={styles.containerDocument} size={"A4"}>
      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>KESEPAKATAN BERSAMA</Text>
      </View>

      <View style={{ marginTop: 17, flexDirection: "row" }}>
        <Text style={styles.textNormal}>
          Pada hari ini Kamis, 20 Maret 2025, bertempat di Jakarta, yang
          bertandatangan dibawah ini telah menandatangani Kesepakatan Bersama
          (“Kesepakatan”) :
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 15 }]}>1.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          <Text style={styles.textBold}>BPK PENABUR Jakarta</Text>, beralamat di
          Jl. Tanjung Duren Raya No. 4, Jakarta Barat, untuk selanjutnya disebut
          “Pihak Pertama”.
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 15 }]}>2.</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          <Text style={styles.textBold}>{namaLengkap}</Text>, beralamat di ,
          Pria, NIK: {nik}, beralamat di {alamatKtp}, untuk selanjutnya disebut
          “Pihak Kedua”.
        </Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 13 }]}>
        Pihak Pertama dan Pihak Kedua apabila bersama-sama akan disebut “Para
        Pihak”.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 13 }]}>
        Para Pihak terlebih dahulu menerangkan hal – hal sebagai berikut:
      </Text>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 15 }]}>-</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Bahwa berdasarkan amanah Undang-Undang No.13 tahun 2003 tentang
          Ketenagakerjaan (“UU 13/2003) yang diubah oleh UU No.11 tahun 2020 dan
          Peraturan Pemerintah No.35 tahun 2021 berikut Peraturan
          Pelaksanaannya, penyelesaian damai merupakan wujud penjiwaan yang
          hakiki dalam pelaksanaan hubungan industrial;
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginTop: 13 }}>
        <Text style={[styles.textNormal, { width: 15 }]}>-</Text>
        <Text style={[styles.textNormal, { flex: 1 }]}>
          Pada tanggal ______________ Para Pihak telah melakukan perundingan dan
          musyawarah dimana Para Pihak menyepakati hal-hal sebagai berikut:
        </Text>
      </View>

      <View style={{ marginTop: 15, paddingLeft: 15 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 20 }]}>1.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Para Pihak sepakat bahwa hubungan kerja telah berakhir dengan baik
            dan Pihak Kedua tidak lagi dipekerjakan oleh Pihak Pertama.
            Karenanya hubungan kerja antara Pihak Pertama dan Pihak Kedua telah
            berakhir dengan baik terhitung per tanggal {tanggal_incative}.
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 13 }}>
          <Text style={[styles.textNormal, { width: 20 }]}>2.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Pihak Kedua wajib mengembalikan dengan baik seragam berikut atribut
            Pihak Pertama, serta seluruh dokumen, data, aset, barang-barang
            dan/atau segala apapun milik Pihak Pertama yang masih ada pada Pihak
            Kedua.
          </Text>
        </View>

        <Text style={[styles.textNormal, { marginTop: 13, marginLeft: 20 }]}>
          Bahwa Pihak Pertama memberikan dan Pihak Kedua menerima dengan baik
          uang pesangon dan lain-lain sebesar
          <Text style={styles.textBold}> Rp.20.597.400,- </Text>
          (dua puluh juta lima ratus sembilan puluh tujuh ribu empat ratus
          Rupiah). Pihak Kedua wajib membayar semua hutang/pinjaman kepada Pihak
          Pertama dan Koperasi.
        </Text>

        <View style={{ flexDirection: "row", marginTop: 13 }}>
          <Text style={[styles.textNormal, { width: 20 }]}>3.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Pihak Pertama memberikan dan Pihak Kedua menerima dengan baik Surat
            Keterangan Masa Kerja. Surat Keterangan Masa Kerja diserahkan Pihak
            Pertama kepada Pihak Kedua paling lambat 2 (dua) minggu setelah
            hubungan kerja berakhir.
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 13 }}>
          <Text style={[styles.textNormal, { width: 20 }]}>4.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Pihak Pertama memberikan fasilitas SPP standar anak karyawan tetap
            kepada Pihak Kedua sampai dengan akhir Tahun Pelajaran _______.
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 13 }}>
          <Text style={[styles.textNormal, { width: 20 }]}>5.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Pihak Kedua bersedia, dalam hal Pihak Pertama sewaktu-waktu
            membutuhkan keterangan/data/bantuan terkait hal-hal semasa Pihak
            Kedua bekerja pada Pihak Pertama, meskipun hubungan kerja telah
            berakhir.
          </Text>
        </View>

        <View style={{ flexDirection: "row" }} break>
          <Text style={[styles.textNormal, { width: 20 }]}>6.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Pihak Pertama bersedia, dalam hal adanya permintaan informasi dari
            calon pemberi kerja Pihak Kedua mengenai diri Pihak Kedua sewaktu
            bekerja pada Pihak Pertama, maka Pihak Pertama akan memberikan
            keterangan yang diminta oleh calon pemberi kerja Pihak Kedua.
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 13 }}>
          <Text style={[styles.textNormal, { width: 20 }]}>7.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Pihak Pertama sepakat dan memahami sepenuhnya bahwa seluruh data
            yang diperoleh/diketahui Pihak Pertama selama mempekerjakan Pihak
            Kedua, baik secara langsung/tidak langsung, merupakan Rahasia yang
            harus dijaga, sehingga Pihak Pertama sepakat dan mengikatkan diri
            untuk tidak membocorkan, memberikan dan/atau menggunakan data
            tersebut, baik secara langsung maupun tidak langsung kepada pihak
            manapun, meskipun hubungan kerja telah berakhir.
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 13 }}>
          <Text style={[styles.textNormal, { width: 20 }]}>8.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Pihak Kedua sepakat dan memahami sepenuhnya bahwa seluruh data yang
            diperoleh/diketahui Pihak Kedua selama bekerja pada Pihak Pertama,
            baik secara langsung/tidak langsung, merupakan Rahasia yang harus
            dijaga, sehingga Pihak Kedua sepakat dan mengikatkan diri untuk
            tidak membocorkan, memberikan dan/atau menggunakan data tersebut,
            baik secara langsung maupun tidak langsung kepada pihak manapun,
            meskipun hubungan kerja telah berakhir.
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 13 }}>
          <Text style={[styles.textNormal, { width: 20 }]}>9.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Pihak Pertama mengikatkan diri tidak melakukan tindakan apapun yang
            merugikan/mengusik maupun yang berpotensi merugikan Pihak Kedua
            termasuk tetapi tidak terbatas pada reputasi, nama baik dan prestasi
            selama masa kerja Pihak Kedua, setelah ditandatanganinya Kesepakatan
            ini.
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 13 }}>
          <Text style={[styles.textNormal, { width: 20 }]}>10.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Pihak Kedua mengikatkan diri tidak melakukan tindakan apapun yang
            merugikan/mengusik maupun yang berpotensi merugikan Pihak Pertama,
            setelah ditandatanganinya Kesepakatan ini.
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 13 }}>
          <Text style={[styles.textNormal, { width: 20 }]}>11.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Dengan ditandatanganinya Kesepakatan ini, maka segala hubungan hukum
            dan permasalahan antara Para Pihak telah selesai dan berakhir dengan
            baik. Pihak Kedua tidak akan melakukan tuntutan dalam bentuk apapun
            di kemudian hari. Demikian juga Pihak Pertama tidak akan melakukan
            tuntutan dalam bentuk apapun lagi terhadap Pihak Kedua dikemudian
            hari.
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 13 }}>
          <Text style={[styles.textNormal, { width: 20 }]}>12.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Kesepakatan ini tunduk kepada dan ditafsirkan sesuai dengan hukum
            yang berlaku di Negara Republik Indonesia.
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 13 }}>
          <Text style={[styles.textNormal, { width: 20 }]}>13.</Text>
          <Text style={[styles.textNormal, { flex: 1 }]}>
            Kesepakatan ini beserta seluruh lampirannya merupakan satu-satunya
            dokumen yang menyatakan kesepakatan pengakhiran hubungan kerja
            antara Pihak Pertama dan Pihak Kedua, dan oleh karenanya Kesepakatan
            ini mencabut semua dan mengesampingkan segala kesepakatan, janji
            dan/atau pernyataan, baik lisan maupun tertulis, yang telah ada
            lebih dahulu berkaitan dengan hal-hal yang diatur dalam Kesepakatan
            ini.
          </Text>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 13 }]}>
        Demikian Kesepakatan Bersama ini dibuat dan ditandatangani oleh Para
        Pihak dalam keadaan sadar, dan secara sukarela tanpa paksaan dan tekanan
        dari siapapun dan pihak manapun juga.
      </Text>

      <Text style={styles.textNormal} break>
        Jakarta, 20 Maret 2025
      </Text>

      <View style={{ marginTop: 15, height: 120, flexDirection: "row" }}>
        <View
          style={{ flex: 1, height: "100%", justifyContent: "space-between" }}
        >
          <Text style={styles.textNormal}>Pihak Pertama,</Text>

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
          <View>
            <Text style={styles.textNormal}>Pihak Kedua,</Text>
            <Text style={styles.textNormal}>
              Telah membaca dan memahami dengan baik sebelum menandatangani
            </Text>
          </View>

          <Text style={styles.textBold}>Victoria</Text>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>Saksi - saksi:</Text>

      <View style={{ height: 80, flexDirection: "row" }}>
        <View style={{ flex: 1, height: "100%", justifyContent: "flex-end" }}>
          <Text style={styles.textBold}>__________________</Text>
        </View>

        <View
          style={{
            flex: 1,
            height: "100%",
            justifyContent: "flex-end",
            paddingLeft: 50,
          }}
        >
          <Text style={styles.textBold}>__________________</Text>
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
