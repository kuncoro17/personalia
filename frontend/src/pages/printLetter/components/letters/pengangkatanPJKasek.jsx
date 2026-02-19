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

export default function PengangkatanPJKasek() {
  const payload = data?.data ?? data ?? {};

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

  function formatTanggalIndo(value) {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    const tanggal = date.getDate();
    const bulan = BULAN[date.getMonth()];
    const tahun = date.getFullYear();

    return `${tanggal} ${bulan} ${tahun}`;
  }
  const getNamaUnit = (uk) => {
    const detail = uk?.unit_kerja_detail;

    return (
      detail?.seksi?.nama_sek ||
      detail?.bagian?.nama_bag ||
      detail?.divisi?.nama_div ||
      detail?.deputi?.nama_dep ||
      detail?.deputi?.nama_deputi ||
      detail?.direktur?.nama_dir ||
      detail?.direktur?.nama_direktur ||
      null
    );
  };

  const unitKerja = payload?.unitKerja ?? payload?.unit_kerja_karyawan;
  const divisiList = Array.isArray(unitKerja)
    ? unitKerja.map((uk) => getNamaUnit(uk)).filter(Boolean)
    : unitKerja
      ? [getNamaUnit(unitKerja)].filter(Boolean)
      : [];
  const divisiText = divisiList.join(", ") || "—";
  const namaLengkap =
    String(payload?.nama_lengkap ?? payload?.nama ?? "").trim() || "—";
  const tgl_join_penabur_jkt = formatTanggalIndo(payload?.tgl_join_penabur_jkt);
  const tanggal_inactive = formatTanggalIndo(payload?.tanggal_inactive);
  const today = formatTanggalIndo(new Date());
  const kode_golongan = payload?.kode_golongan ?? "—";
  const jabatan =
    unitKerja?.jabatan?.jabatan ?? unitKerja?.[0]?.jabatan?.jabatan ?? "—";
  return (
    <Page style={styles.containerDocument} size={"A4"}>
      <Image src={"/assets/images/kop.png"} style={styles.kopSurat} fixed />

      <View style={styles.containerHeader}>
        <Text style={styles.titleHeader}>SURAT PENGANGKATAN</Text>
        <Text style={[styles.textNormal, { color: "blue" }]}>
          Nomor : 001/SDM/SP.PJ.Kasek/05/2024
        </Text>
      </View>

      <Text style={[styles.textBold, { textAlign: "center" }]}>
        PENGURUS BADAN PENDIDIKAN KRISTEN PENABUR JAKARTA
      </Text>

      <View style={{ marginTop: 30 }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Menimbang</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              Bahwa masih diperlukan Kepala Sekolah di Jenjang TK BPK PENABUR
              Jakarta.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Membaca</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              Surat Keputusan Pengurus Tentang Formasi Kepala Sekolah
              No.3/JKT/SKE/04/2024 yang disahkan dalam Rapat Pleno Pengurus BPK
              PENABUR Jakarta tanggal _____________.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View
            style={{
              width: "25%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textNormal}>Menetapkan</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1, width: "75%" }}>
            <Text style={[styles.textBold, { paddingLeft: 5, color: "blue" }]}>
              Sdr. {namaLengkap}
            </Text>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              sebagai {jabatan} di {divisiList},
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 15 }]}>
        dalam dinas Badan Pendidikan Kristen PENABUR Jakarta dengan
        ketentuan-ketentuan sebagai berikut:
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 20 }]}>a.</Text>
          <Text style={styles.textNormal}>
            Pengangkatan ini berlaku mulai tanggal ____________ s.d.
            ___________;
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 20 }]}>b.</Text>
          <Text style={styles.textNormal}>
            BPK PENABUR Jakarta melakukan evaluasi kinerja dan capaian yang
            bersangkutan selama 1 (satu) tahun untuk menetapkan perpanjangan
            masa jabatan 3 (tiga) tahun selanjutnya sebagai Kepala Sekolah;
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 20 }]}>c.</Text>
          <Text style={styles.textNormal}>
            Karyawan bersedia mentaati dan menjalani evaluasi kinerja, Mutasi,
            Rotasi, Promosi dan Demosi yang ditetapkan oleh BPK PENABUR Jakarta;
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 20 }]}>d.</Text>
          <Text style={styles.textNormal}>
            BPK PENABUR Jakarta berhak atas pertimbangannya sendiri untuk
            melakukan Mutasi, Rotasi, Promosi dan Demosi selama periode surat
            pengangkatan ini;
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.textNormal, { width: 20 }]}>e.</Text>
          <Text style={styles.textNormal}>
            Segala sesuatu akan diubah dan diperhitungkan sebagaimana mestinya,
            apabila dikemudian hari ternyata terdapat kekeliruan dalam surat
            pengangkatan ini.
          </Text>
        </View>
      </View>

      <Text style={[styles.textNormal, { marginTop: 15 }]}>
        Demikian surat pengangkatan ini dibuat, semoga Saudara dapat menerima
        dan melaksanakan tugas Saudara dengan baik.
      </Text>

      <View
        style={{
          marginRight: 30,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={styles.textNormal}>
          Jakarta, <Text style={{ color: "blue" }}>tanggal surat</Text>
        </Text>
        <Text style={styles.textNormal}>
          Badan Pendidikan Kristen PENABUR Jakarta
        </Text>

        <View style={{ flexDirection: "row", columnGap: 30 }}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.textBold,
                { textDecoration: "underline", marginTop: 70, color: "blue" },
              ]}
            >
              Ir. Kenny Lim
            </Text>
            <Text style={styles.textNormal}> Ketua</Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text
              style={[
                styles.textBold,
                { textDecoration: "underline", marginTop: 70, color: "blue" },
              ]}
            >
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
    fontSize: 16,
  },
});
