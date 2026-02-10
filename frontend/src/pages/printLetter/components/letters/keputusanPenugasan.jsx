import { Page, Text, Image, StyleSheet, View, Font } from "@react-pdf/renderer";

Font.register({
  family: "Cambria",
  fonts: [
    { src: "/assets/fonts/Cambria/cambria-regular.ttf" },
    { src: "/assets/fonts/Cambria/cambria-bold.ttf", fontWeight: "bold" },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

export default function KeputusanPenugasan(props) {
  // ✅ kompatibel untuk 2 pola pemanggilan:
  // 1) <LetterComponent {...letterData} />
  // 2) <LetterComponent data={letterData} />
  const incoming = props?.data ?? props;

  // ✅ kalau response API masih { success, message, data: {...} }
  const payload = incoming?.data ?? incoming;

  // --- mapping field (sesuaikan nama field API kamu kalau beda) ---
  const nomorSurat = payload?.nomor_surat ?? "01/SDM/ST/01/2025";

  const nama = payload?.nama_lengkap ?? payload?.nama ?? "—";
  const nik = payload?.nik ?? "—";

  // jabatan utama karyawan
  const jabatanUtama =
    payload?.jabatan_utama ?? payload?.jabatan ?? payload?.jabatan_nama ?? "—";

  // unit penugasan (TKK 10 PENABUR, dll)
  const unit =
    payload?.unit_penugasan ?? payload?.unit_kerja ?? payload?.unit ?? "—";

  // nama penugasan (Plt. Kepala ..., dst)
  const penugasan =
    payload?.penugasan ??
    payload?.nama_penugasan ??
    "Pelaksana Tugas (Plt.) Kepala Kelompok Bermain";

  // periode
  const tglMulai = payload?.tgl_mulai ?? payload?.tanggal_mulai ?? "—";
  const tglAkhir = payload?.tgl_akhir ?? payload?.tanggal_akhir ?? "—";

  // ✅ tanggal surat today
  const now = new Date();
  const bulan = [
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
  const tanggalSurat = `${now.getDate()} ${bulan[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <Page style={styles.containerDocument} size={["8.27in", "11.69in"]}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <View style={[styles.containerHeader, { marginTop: 16 }]}>
        <Text style={styles.titleHeader}>SURAT KEPUTUSAN PENUGASAN</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          Nomor : {nomorSurat}
        </Text>
      </View>

      <Text style={[styles.textBold, { textAlign: "center", marginTop: 24 }]}>
        BADAN PENDIDIKAN KRISTEN PENABUR JAKARTA
      </Text>

      <View style={{ flexDirection: "row", marginTop: 24 }}>
        <View style={{ width: "1.28in", flexDirection: "row" }}>
          <Text style={styles.textNormal}>Menimbang</Text>
        </View>
        <Text style={[styles.textNormal, { width: "0.2in" }]}>:</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.textNormal}>
            Peraturan Menteri Pendidikan dan Kebudayaan RI Nomor 137 Tahun 2014
            mengenai Standar Nasional PAUD.
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <View style={{ width: "1.28in", flexDirection: "row" }}>
          <Text style={styles.textNormal}>Membaca</Text>
        </View>
        <Text style={[styles.textNormal, { width: "0.2in" }]}>:</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.textNormal}>
            Memo dari Ka. TKK 10 PENABUR tanggal 12 Maret 2025 perihal
            permohonan pembuatan Surat Keputusan dan Surat Tugas Plt.Kepala
            Kelompok Bermain.
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", marginTop: 12 }}>
        <View style={{ width: "1.28in", flexDirection: "row" }}>
          <Text style={styles.textNormal}>Menugaskan</Text>
        </View>
        <Text style={[styles.textNormal, { width: "0.2in" }]}>:</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.textNormal}>
            Sdr. <Text style={{ color: "blue" }}>{nama}</Text> (NIK:{" "}
            <Text style={{ color: "blue" }}>{nik}</Text>) sebagai{" "}
            <Text style={{ color: "blue" }}>{penugasan}</Text>{" "}
            <Text style={{ color: "blue" }}>{unit}</Text>, di samping
            tugas-tugasnya sebagai{" "}
            <Text style={{ color: "blue" }}>{jabatanUtama}</Text>,
          </Text>
        </View>
      </View>

      <Text style={styles.textNormal}>
        dalam dinas Badan Pendidikan Kristen PENABUR Jakarta, dengan ketentuan -
        ketentuan sebagai berikut :
      </Text>

      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: "0.3in" }]}>a.</Text>
        <Text style={styles.textNormal}>
          Berlaku mulai tanggal{" "}
          <Text style={{ color: "blue" }}>{tglMulai}</Text> sampai dengan{" "}
          <Text style={{ color: "blue" }}>{tglAkhir}</Text>;
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: "0.3in" }]}>b.</Text>
        <Text style={styles.textNormal}>
          Menaati Peraturan Karyawan BPK PENABUR Jakarta;
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: "0.3in" }]}>c.</Text>
        <Text style={styles.textNormal}>
          Tidak ada perubahan atas term & condition kepegawaian;
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.textNormal, { width: "0.3in" }]}>d.</Text>
        <Text style={styles.textNormal}>
          BPK PENABUR Jakarta berhak atas pertimbangannya sendiri untuk
          mengubah/ memperbaiki Surat Keputusan Penugasan ini.
        </Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 12.6 }]}>
        Demikian Surat Keputusan Penugasan ini dibuat, semoga Saudara dapat
        menerima dan melaksanakan tugas Saudara dengan baik.
      </Text>

      <View
        style={{ marginLeft: "2.56in", alignItems: "center", marginTop: 24 }}
      >
        <Text style={styles.textNormal}>
          Jakarta, <Text style={{ color: "blue" }}>{tanggalSurat}</Text>
        </Text>
        <Text style={styles.textNormal}>BPK PENABUR Jakarta</Text>

        <Text
          style={[
            styles.textBold,
            { textDecoration: "underline", marginTop: 60, color: "blue" },
          ]}
        >
          Irani Waruwu
        </Text>
        <Text style={styles.textNormal}>Pj. Kepala Divisi SDM</Text>
      </View>

      {/* ✅ DEBUG (biar kamu lihat payload bener masuk) */}
      <View style={{ marginTop: 18 }}>
        <Text style={{ fontSize: 8 }}>DEBUG:</Text>
        <Text style={{ fontSize: 8 }}>{JSON.stringify(payload, null, 2)}</Text>
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
    paddingBottom: "0.57in",
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

  textBold: {
    fontFamily: "Cambria",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 1.15,
  },

  textNormal: {
    fontFamily: "Cambria",
    fontSize: 12,
    lineHeight: 1.15,
  },

  titleHeader: {
    fontFamily: "Cambria",
    textDecoration: "underline",
    fontWeight: "bold",
    fontSize: 16,
  },
});
