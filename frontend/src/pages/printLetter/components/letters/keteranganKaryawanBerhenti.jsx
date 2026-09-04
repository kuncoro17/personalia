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

export default function KeteranganKaryawanBerhenti({ data }) {
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
              001/SDM/PT/01/2025
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
              Penyesuaian Golongan Struktural Baru
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
            x` `<Text style={styles.textNormal}>Lampiran</Text>
            <Text style={styles.textNormal}>:</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textNormal, { paddingLeft: 5 }]}>
              1 (satu) berkas
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.textNormal}>
          Yth. Sdr. Pengurus Yayasan BPK PENABUR
        </Text>
        <Text style={styles.textNormal}>Gedung UKRIDA Blok E Lantai 5</Text>
        <Text style={styles.textNormal}>Jl. Tanjung Duren Raya No. 4</Text>
        <Text style={styles.textNormal}>Jakarta Barat</Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 40 }]}>Dengan hormat,</Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Sehubungan dengan surat pengunduran diri Sdr.{namaLengkap} dari BPK
        PENABUR Jakarta terhitung {today}, dengan ini kami mohon dibuatkan Surat
        Keterangan Kerja atas nama tersebut di atas yang bekerja sejak{" "}
        {tgl_join_penabur_jkt}
        s/d {tanggal_inactive}, golongan terakhir {kode_golongan} dengan tugas
        dan jabatan terakhir sebagai {jabatan} di {divisiText}, Gedung UKRIDA
        Blok E Lantai 6, Jl. Tanjung Duren Raya No. 4, Jakarta Barat.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Bersama surat ini kami melampirkan fotokopi Surat Pengunduran Diri dan
        Sertifikat Dana Pensiun yang bersangkutan.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 20 }]}>
        Atas perhatian dan kerjasama Saudara kami mengucapkan terima kasih.
      </Text>

      <View style={{ marginTop: 40, alignItems: "center", width: "100%" }}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.textNormal}>Hormat kami,</Text>
          <Text style={styles.textNormal}>Pengurus BPK PENABUR Jakarta</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 80, width: "100%" }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.textNormal, { textDecoration: "underline" }]}>
              Ir. Kenny Lim
            </Text>

            <Text style={styles.textNormal}>Ketua</Text>
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.textNormal, { textDecoration: "underline" }]}>
              Ir. Yosafat Adrian Wiguna, MBA
            </Text>

            <Text style={styles.textNormal}>Sekretaris II</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.textNormal}>Tembusan:</Text>
        <View
          style={{
            marginLeft: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "black",
              borderRadius: 2.5,
              height: 5,
              aspectRatio: 1,
            }}
          />
          <Text style={[styles.textNormal]}>Dana Pensiun</Text>
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
