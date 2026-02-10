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

export default function CutiSakitBerkepanjangan({ data }) {
  // ✅ ambil dari API (sesuaikan field kalau beda)
  const idKaryawan = (data?.id_karyawan ?? "").toString().trim();
  const nama = (data?.nama_lengkap ?? "").toString().trim();
  const nik = (data?.nik ?? "").toString().trim();

  const namaDisplay = nama || "—";
  const nikDisplay = nik ? ` (${nik})` : " (—)";

  // ✅ tanggal surat today (contoh: 04 Februari 2026)
  const today = new Date();
  const tanggalSurat = `${today.getDate()} ${BULAN[today.getMonth()]} ${today.getFullYear()}`;

  // ✅ nomor surat bulan/tahun sekarang (contoh: 01/BPR/Pr/02/2026)
  const nomorSurat = `01/BPR/Pr/${pad2(today.getMonth() + 1)}/${today.getFullYear()}`;
  const tanggalNumeric = `${tanggal}-${today.getMonth() + 1}-${tahun}`;
  const tableContent = [
    { masaCuti: "4 (empat) bulan pertama", cutiSakit: "Ke-1", gaji: "100%" },
    { masaCuti: "4 (empat) bulan kedua", cutiSakit: "Ke-2", gaji: "75%" },
    { masaCuti: "4 (empat) bulan ketiga", cutiSakit: "Ke-3", gaji: "50%" },
    {
      masaCuti: "Bulan selanjutnya sampai dengan PHK",
      cutiSakit: "Ke-4",
      gaji: "25%",
    },
  ];

  return (
    <Page style={styles.containerDocument} size="A4">
      <Image src="/assets/images/kop.png" style={styles.kopSurat} fixed />

      {/* ✅ tanggal surat dinamis */}
      <Text style={[{ alignSelf: "flex-end" }, styles.textNormal]}>
        {tanggalSurat}
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
              {nomorSurat}
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
              Cuti Sakit Berkepanjangan Pertama (ke-1)
            </Text>
          </View>
        </View>
      </View>

      {/* ✅ Yth pakai nama+nik dari API */}
      <View style={{ marginTop: 30 }}>
        <Text style={styles.textNormal}>
          Yth. Sdr. {namaDisplay}
          {nikDisplay}
        </Text>
        <Text style={styles.textNormal}>di Tempat</Text>

        {/* ✅ DEBUG minimal biar kelihatan datanya masuk */}
        <Text style={{ fontSize: 8, marginTop: 8 }}>
          DEBUG: id_karyawan = {idKaryawan || "—"}
        </Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 30 }]}>Dengan hormat,</Text>

      {/* ✅ isi surat kamu lanjutkan seperti semula */}
      <Text style={[styles.textNormal, { marginTop: 20, textIndent: 8 }]}>
        Kami telah menerima laporan dari Kepala SMPK 5 tanggal 19 Februari 2025
        dan rekomendasi Dokter BPK PENABUR Jakarta tanggal 27 Februari 2025
        tentang Saudara sedang menjalani pemulihan pasca operasi patah tulang.
        Merujuk Surat Keterangan Dirawat dari RS Medistra tanggal 17 Februari
        2025 dan memperhatikan kondisi kesehatan Saudara tersebut, kami
        memutuskan untuk memberlakukan Pasal 32 ayat 1.4 tentang istirahat sakit
        karena sakit berkepanjangan dengan memberikan Cuti Sakit Berkepanjangan
        Pertama kepada Saudara terhitung mulai tanggal 17 Februari 2025 sampai
        dengan 16 Juni 2025.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20, textIndent: 8 }]}>
        Peraturan Perusahaan BPK PENABUR Tahun 2024 Pasal 32 ayat 2 mengatur
        gaji karyawan selama cuti sakit berkepanjangan sebagai berikut:
      </Text>

      {/* tabel tetap */}
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
            Masa Cuti Sakit
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
            Cuti Sakit
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
            Gaji/Bulan
          </Text>
        </View>

        {tableContent.map((item, index) => (
          <View
            key={index}
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
                  flex: 1,
                  paddingHorizontal: 5,
                },
              ]}
            >
              {item.masaCuti}
            </Text>
            <Text
              style={[
                styles.textNormal,
                {
                  paddingVertical: 1,
                  borderRightWidth: 1,
                  width: 100,
                  paddingHorizontal: 5,
                  textAlign: "center",
                },
              ]}
            >
              {item.cutiSakit}
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
              {item.gaji}
            </Text>
          </View>
        ))}
      </View>

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
            Masa Cuti Sakit
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
            Cuti Sakit
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
            Gaji/Bulan
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
                  flex: 1,
                  paddingHorizontal: 5,
                },
              ]}
            >
              {item.masaCuti}
            </Text>

            <Text
              style={[
                styles.textNormal,
                {
                  paddingVertical: 1,
                  borderRightWidth: 1,
                  width: 100,
                  paddingHorizontal: 5,
                  textAlign: "center",
                },
              ]}
            >
              {item.cutiSakit}
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
              {item.gaji}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.textNormal, { marginTop: 20, textIndent: 8 }]}>
        Kami meminta Saudara untuk memeriksakan diri ke Dokter yang merawat
        Saudara pada tanggal {tanggalNumeric} untuk memperoleh Surat Keterangan
        Medik tentang kelaikan kerja dan kondisi kesehatan Saudara pada saat
        itu. Kami mohon agar Surat Keterangan Medik tersebut disampaikan kepada
        Dokter BPK PENABUR Jakarta sebelum berakhirnya masa Cuti Sakit
        Berkepanjangan Pertama (ke-1).
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20, textIndent: 8 }]}>
        Berdasarkan kondisi kesehatan Saudara pada tanggal {tanggalNumeric},
        kami akan menentukan pemberlakuan atau tidak memberlakukan Cuti Sakit
        Berkepanjangan.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20, textIndent: 8 }]}>
        Kami berdoa memohon Tuhan Sang Tabib Agung memulihkan kesehatan Saudara,
        memberkati serta menguatkan Saudara dan keluarga.
      </Text>

      <View
        style={{
          alignSelf: "flex-end",
          marginRight: 30,
          alignItems: "center",
        }}
        break
      >
        <Text style={styles.textNormal}>Hormat kami,</Text>

        <Text
          style={[
            styles.textBold,
            { textDecoration: "underline", marginTop: 70, color: "blue" },
          ]}
        >
          Irani Waruwu
        </Text>
        <Text style={styles.textNormal}>Pj. Kepala Divisi SDM</Text>
      </View>

      <View style={{ marginTop: 15 }}>
        <Text style={[styles.textNormal, { fontSize: 13 }]}>Tembusan :</Text>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: 13 }]}>
            1.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: 13 }]}>
            Kepala Divisi Pendidikan
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: 13 }]}>
            2.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: 13 }]}>
            Kepala Jenjang SMP
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: 13 }]}>
            3.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: 13 }]}>
            Kepala SMPK 5 PENABUR
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: 13 }]}>
            4.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: 13 }]}>
            Dokter BPK PENABUR Jakarta
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 15, fontSize: 13 }]}>
            5.
          </Text>
          <Text style={[styles.textNormal, { flex: 1, fontSize: 13 }]}>
            Arsip SDM
          </Text>
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
