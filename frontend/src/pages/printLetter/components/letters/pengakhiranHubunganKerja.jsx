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

export default function PengakhiranHubunganKerja(data) {

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
      const nik =
    String(payload?.nik ?? payload?.nik ?? "").trim() || "—";
  const tgl_join_penabur_jkt = formatTanggalIndo(payload?.tgl_join_penabur_jkt);
  const tanggal_inactive = formatTanggalIndo(payload?.tanggal_inactive);
  const today = formatTanggalIndo(new Date());
  const kode_golongan = payload?.kode_golongan ?? "—";
  const jabatan =
    unitKerja?.jabatan?.jabatan ?? unitKerja?.[0]?.jabatan?.jabatan ?? "—";
  return (
    <Page style={styles.containerDocument} size={["8.27in", "11.69in"]}>
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
          <Text style={styles.textNormal}>Perihal</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.textNormal]}>: Pengakhiran Hubungan Kerja</Text>
        </View>
      </View>

      <View style={{ marginTop: 24 }}>
        <Text style={styles.textNormal}>
          Yth. Sdr. {namaLengkap} {nik}
        </Text>
        <Text style={styles.textNormal}>Dusun VI Serbangan RT.000 RW.000 </Text>
        <Text style={styles.textNormal}>Kel. Silau Padang Kec. Sipispis</Text>
        <Text style={styles.textNormal}>Sumatera Utara</Text>
      </View>

      <Text style={[styles.textNormal, { marginTop: 24 }]}>Dengan hormat,</Text>

      <Text style={[styles.textNormal, { marginTop: 12 }]}>
        Kami menemui Saudara dengan harapan Saudara dalam keadaan sehat
        walafiat.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 12 }]}>
        Perkenankan kami menyampaikan bahwa BPK PENABUR Jakarta akan mengakhiri
        Perjanjian Kerja Waktu Tertentu (PKWT) dengan Saudara efektif per
        tanggal 1 April 2025.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 12 }]}>
        Kami akan membayarkan uang kompensasi kepada Saudara sesuai dengan
        ketentuan PP No. 35 Tahun 2021 serta menerbitkan Surat Keterangan Kerja.
      </Text>

      <Text style={[styles.textNormal, { marginTop: 12 }]}>
        Kami mengucapkan terima kasih atas dedikasi, karya dan kerjasama yang
        telah Saudara berikan kepada BPK PENABUR Jakarta.
      </Text>

      <View
        style={{
          marginTop: 48,
          marginLeft: "3.15in",
          alignItems: "center",
        }}
      >
        <Text style={[styles.textNormal, { textAlign: "center" }]}>
          Hormat Kami,
        </Text>

        <View style={{ marginTop: 48, alignItems: "center" }}>
          <Text style={[styles.textBold, { textDecoration: "underline" }]}>
            Irani Waruwu
          </Text>
          <Text style={styles.textNormal}>Pj. Kepala Divisi SDM</Text>
        </View>
      </View>

      <View style={{ marginTop: 24, left: "0.1in" }}>
        <Text style={[styles.textNormal, { fontSize: 11 }]}>Tembusan:</Text>

        <View style={{ flexDirection: "row" }}>
          <Text style={[{ width: "0.2in", fontSize: 11 }, styles.textNormal]}>
            1.
          </Text>
          <Text style={[styles.textNormal, { fontSize: 11 }]}>
            Ka. Jenjang SD
          </Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={[{ width: "0.2in", fontSize: 1 }, styles.textNormal]}>
            2.
          </Text>
          <Text style={[styles.textNormal, { fontSize: 11 }]}>
            Ka. SDK 2 PENABUR
          </Text>
        </View>
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
    textAlign: "justify",
  },

  textBold: {
    fontFamily: "Cambria",
    fontWeight: "bold",
    fontSize: 12,
  },
});
